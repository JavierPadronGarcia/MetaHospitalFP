const db = require("../../models");
const xlsx = require('xlsx');
const dayjs = require('dayjs');
const Op = db.Sequelize.Op;

const WorkUnit = db.workUnit;
const Case = db.case;
const Item = db.item;
const ItemCase = db.itemCase;
const PlayerRole = db.playerRole;
const ItemPlayerRole = db.itemPlayerRole;

exports.createCompleteCase = async (req, res) => {

  const workUnitId = req.params.workUnitId;

  const workUnit = await WorkUnit.findOne({ where: { id: workUnitId } });

  if (!req.file || !req.file.buffer || !req.file.buffer.toString().includes('xl/workbook.xml')) {
    return res.status(400).json({ message: 'Invalid file, must be an xlsx file' });
  }

  if (!workUnit) { return res.status(500).json({ message: 'Work Unit not found' }); }

  const transaction = await db.sequelize.transaction();
  try {

    //SET UP DATA AND VARIABLES
    const dataToInsert = {};
    const insertedData = {};
    const existingData = {};
    const syncedData = {};

    const [dbCasesAndItems, dbRoles] = await Promise.all([
      getCasesAndItemsInDb(workUnit),
      getRolesInDb(),
    ]);

    const workbook = xlsx.read(req.file.buffer, { type: 'buffer' });

    const casesSheet = workbook.Sheets[workbook.SheetNames[0]];
    const itemsSheet = workbook.Sheets[workbook.SheetNames[1]];

    const cases = xlsx.utils.sheet_to_json(casesSheet);
    const items = xlsx.utils.sheet_to_json(itemsSheet);

    dataToInsert.cases = await getCasesInExcel(workUnitId, cases, dbCasesAndItems.cases);
    dataToInsert.items = await getItemsInExcel(workUnitId, items, dbCasesAndItems.items);

    existingData.cases = await getCasesInExcelExistingInDb(workUnitId, cases, dbCasesAndItems.cases);
    existingData.items = await getItemsInExcelExistingInDb(workUnitId, items, dbCasesAndItems.items);

    //INSERT AND SYNC ITEMS
    [insertedData.items, syncedData.items] = await Promise.all([
      insertItems(dataToInsert, transaction),
      synchronizeItems(existingData, transaction)
    ]);

    //INSERT AND SYNC CASES
    [insertedData.cases, syncedData.cases] = await Promise.all([
      insertCases(dataToInsert, transaction),
      synchronizeCases(existingData, transaction)
    ]);

    const parsedInsertedCases = parseInsertedCases(insertedData.cases, dataToInsert.cases);
    const parsedInsertedItems = parseInsertedItems(insertedData.items, dataToInsert.items);

    const oldAndNewItems = [...dbCasesAndItems.items, ...insertedData.items];

    dataToInsert.itemCases = await getNewItemCases(parsedInsertedCases, oldAndNewItems);
    dataToInsert.itemPlayerRoles = await getNewItemPlayerRoles(parsedInsertedItems, dbRoles);

    insertedData.itemCases = await insertItemCases(dataToInsert, transaction);
    insertedData.itemPlayerRoles = await insertItemPlayerRoles(dataToInsert, transaction);

    await transaction.rollback();
    return res.status(200).send({ message: 'Data inserted successfully', insertedData, syncedData });
  } catch (error) {

    await transaction.rollback();
    return res.status(500).send({
      error: true,
      message: `There was an error creating cases, items and itemCases, details: ${error}`
    });
  }
}

//SYNCHRONIZATION FUNCTIONS
async function synchronizeCases(existingData, transaction) {
  const casesToSync = existingData.cases.map(eachExistingCase => eachExistingCase.excelCase);
  const casesInDatabase = existingData.cases.map(eachExistingCase => eachExistingCase.dbCase);
  const updatedCases = [];
  const createdItemCases = [];
  const deletedItemCases = [];

  // Store all the promises of all the async operations
  const promises = casesToSync.map(async (eachCase) => {
    const caseInDatabase = casesInDatabase.find(eachCaseInDatabase => eachCaseInDatabase.caseNumber === eachCase.caseNumber);

    // Get the itemCases associated with the case
    const itemCasesInDatabase = await ItemCase.findAll({
      where: { CaseID: caseInDatabase.id },
      include: [{ model: Item, required: true }],
    });

    // Get the items in eachCase variable
    const itemsInEachCase = eachCase.Items.map(eachItem => Number(eachItem) + 1);

    // find all the items in the database that have the same itemNumber as the items in eachCase
    const itemsInDatabaseOfEachCase = await Item.findAll({
      where: {
        WorkUnitID: caseInDatabase.WorkUnitID,
        itemNumber: { [Op.in]: itemsInEachCase }
      },
      transaction,
    });

    // create the itemCases from the items in the database of eachCase
    const itemCasesFromEachCase = itemsInDatabaseOfEachCase.map((item) => ({
      CaseID: caseInDatabase.id,
      ItemID: item.id,
      caseNumber: caseInDatabase.caseNumber,
      itemNumber: item.itemNumber,
    }));

    // filter new itemCases from itemCasesInDatabase to create
    const itemCasesToCreate = itemCasesFromEachCase.filter(itemCase =>
      !itemCasesInDatabase.find(eachItemCase => eachItemCase.CaseID === itemCase.CaseID && eachItemCase.ItemID === itemCase.ItemID));

    const itemCasesToDelete = itemCasesInDatabase.filter(eachItemCase =>
      !itemCasesFromEachCase.find(itemCaseToCreate => itemCaseToCreate.CaseID === eachItemCase.CaseID && itemCaseToCreate.ItemID === eachItemCase.ItemID)
    );

    // update the case if it already exists
    if (caseInDatabase.name && caseInDatabase.name !== eachCase.name) {
      caseInDatabase.name = eachCase.name;
      await caseInDatabase.save({ transaction });
      updatedCases.push(caseInDatabase)
    }

    // create new itemCases if they don't exist
    if (itemCasesToCreate.length > 0) {
      await ItemCase.bulkCreate(itemCasesToCreate, {
        fields: ['CaseID', 'ItemID'],
        transaction
      });
      createdItemCases.push(...itemCasesToCreate);
    }

    // delete itemCases that don't exist in the new data
    if (itemCasesToDelete.length > 0) {
      await ItemCase.destroy({
        where: {
          CaseID: { [Op.in]: itemCasesToDelete.map(eachItemCase => eachItemCase.CaseID) },
          ItemID: { [Op.in]: itemCasesToDelete.map(eachItemCase => eachItemCase.ItemID) }
        },
        transaction
      });
      deletedItemCases.push(...itemCasesToDelete);
    }

  });

  await Promise.all(promises);
  return { updatedCases, createdItemCases, deletedItemCases };
}

async function synchronizeItems(existingData, transaction) {
  const itemsToSync = existingData.items.map(eachExistingItem => eachExistingItem.excelItem);
  const itemsInDatabase = existingData.items.map(eachExistingItem => eachExistingItem.dbItem);
  const updatedItems = [];
  const createdItemPlayerRoles = [];
  const deletedItemPlayerRoles = [];

  // Store all the promises of all the async operations
  const promises = itemsToSync.map(async (eachItem) => {
    const itemInDatabase = itemsInDatabase.find(eachItemInDatabase => eachItemInDatabase.itemNumber === eachItem.itemNumber);

    const itemPlayerRolesInDatabase = await ItemPlayerRole.findAll({
      where: { ItemID: itemInDatabase.id },
      include: [{ model: PlayerRole, required: true }],
    });

    const rolesInEachItem = eachItem.Roles;

    const rolesInDatabaseOfEachItem = await PlayerRole.findAll({
      where: {
        id: { [Op.in]: rolesInEachItem }
      },
      transaction,
    });

    const itemPlayerRolesFromEachItem = rolesInDatabaseOfEachItem.map((role) => ({
      ItemID: itemInDatabase.id,
      PlayerRoleID: role.id,
      itemNumber: itemInDatabase.itemNumber,
      roleName: role.name,
    }));

    // filter new itemPlayerRoles from itemPlayerRolesInDatabase to create
    const itemPlayerRolesToCreate = itemPlayerRolesFromEachItem.filter(itemPlayerRole =>
      !itemPlayerRolesInDatabase.find(eachItemPlayerRole =>
        eachItemPlayerRole.ItemID === itemPlayerRole.ItemID && eachItemPlayerRole.PlayerRoleID === itemPlayerRole.PlayerRoleID
      ));

    const itemPlayerRolesToDelete = itemPlayerRolesInDatabase.filter(itemPlayerRole =>
      !itemPlayerRolesFromEachItem.find(eachItemPlayerRole =>
        itemPlayerRole.ItemID === eachItemPlayerRole.ItemID && itemPlayerRole.PlayerRoleID === eachItemPlayerRole.PlayerRoleID
      ));

    // update the item if it already exists
    if (itemInDatabase.value && itemInDatabase.value !== eachItem.value) {
      itemInDatabase.value = eachItem.value;
      await itemInDatabase.save({ transaction });
      updatedItems.push(itemInDatabase)
    }

    // create new itemPlayerRoles if they don't exist
    if (itemPlayerRolesToCreate.length > 0) {
      await ItemPlayerRole.bulkCreate(itemPlayerRolesToCreate, {
        fields: ['ItemID', 'PlayerRoleID'],
        transaction
      });
      createdItemPlayerRoles.push(...itemPlayerRolesToCreate);
    }

    // delete itemPlayerRoles that don't exist in the new data
    if (itemPlayerRolesToDelete.length > 0) {
      await ItemPlayerRole.destroy({
        where: {
          PlayerRoleID: { [Op.in]: itemPlayerRolesToDelete.map(eachItemPlayerRole => eachItemPlayerRole.PlayerRoleID) },
          ItemID: { [Op.in]: itemPlayerRolesToDelete.map(eachItemPlayerRole => eachItemPlayerRole.ItemID) }
        },
        transaction
      });
      deletedItemPlayerRoles.push(...itemPlayerRolesToDelete);
    }
  });

  await Promise.all(promises);

  return { updatedItems, createdItemPlayerRoles, deletedItemPlayerRoles };
}

//GET FUNCTIONS
async function getCasesAndItemsInDb(workUnit, transaction) {

  const [cases, items, itemCases] = await Promise.all([
    Case.findAll({ where: { WorkUnitID: workUnit.id }, transaction }),
    Item.findAll({ where: { WorkUnitID: workUnit.id }, transaction }),
    // ItemCase.findAll({
    //   include: [
    //     {
    //       model: Case,
    //       required: true,
    //       attributes: [],
    //       where: {
    //         WorkUnitID: workUnit.id
    //       }
    //     },
    //     {
    //       model: Item,
    //       required: true,
    //       attributes: [],
    //       where: {
    //         WorkUnitID: workUnit.id
    //       }
    //     }
    //   ],
    //   transaction
    // })
  ]);

  return { cases, items }; //, itemCases
}

async function getRolesInDb() {
  return (await PlayerRole.findAll());
}

async function getCasesInExcel(workUnitId, cases, dbCases) {
  const duplicatedCases = cases.map(caseObj => ({ ...caseObj }));

  let foundCases = duplicatedCases.map((eachCase) => {

    eachCase.ID = Number(eachCase.ID.replace('ej', '')) + 1;

    const caseExists = checkIfCaseExists(eachCase, dbCases);

    if (!caseExists) {
      eachCase = parseCaseSteps(eachCase);

      return {
        name: eachCase.Ejercicio || eachCase.Descripcion,
        workUnitID: workUnitId,
        caseNumber: eachCase.ID,
        Items: eachCase.Items
      };
    }
  })
  return foundCases.filter(eachCase => eachCase);
}

async function getItemsInExcel(workUnitId, items, dbItems) {
  const duplicatedItems = items.map(itemObj => ({ ...itemObj }));

  let foundItems = duplicatedItems.map((eachItem) => {
    eachItem.ID = Number(eachItem.ID.replace('int', '')) + 1;

    const itemExists = checkIfItemExists(eachItem, dbItems);

    if (!itemExists) {
      return {
        name: eachItem.Interacciones,
        workUnitID: workUnitId,
        value: eachItem.Nota,
        itemNumber: eachItem.ID,
        Roles: parseRoles(eachItem.Rol),
      };
    }

  });

  return foundItems.filter(eachItem => eachItem);
}

async function getNewItemCases(cases, oldAndNewItems) {

  const itemCases = [];
  for (let i = 0; i < cases.length; i++) {
    const caseObject = cases[i];
    const caseItems = caseObject.Items;

    for (let j = 0; j < caseItems.length; j++) {
      const itemNumber = Number(caseItems[j]) + 1;
      const itemFound = oldAndNewItems.find(eachItem => eachItem.itemNumber === Number(itemNumber))
      itemCases.push({
        CaseID: caseObject.id,
        ItemID: itemFound.id,
      });
    }
  }
  return itemCases;
}

async function getNewItemPlayerRoles(items, dbRoles) {

  const itemPlayerRoles = [];
  for (let i = 0; i < items.length; i++) {
    const itemObject = items[i];
    const itemRoles = itemObject.Roles;

    for (let j = 0; j < itemRoles.length; j++) {
      const itemRole = itemRoles[j];
      const roleFound = dbRoles.find(eachRole => eachRole.id === itemRole)
      itemPlayerRoles.push({
        ItemID: itemObject.id,
        PlayerRoleID: roleFound.id,
      });
    }
  }
  return itemPlayerRoles;
}

async function getItemCasesInDatabase(workUnitId, caseNumber, itemNumber, transaction) {
  const itemCases = await ItemCase.findAll({
    raw: true,
    include: [
      {
        model: Case,
        required: true,
        attributes: [],
        where: {
          WorkUnitID: workUnitId,
          caseNumber: caseNumber
        }
      },
      {
        model: Item,
        required: true,
        attributes: [],
        where: {
          WorkUnitID: workUnitId,
          itemNumber: itemNumber
        }
      }
    ],
    transaction,
  });
  return itemCases;
}

async function getCasesInExcelExistingInDb(workUnitId, cases, dbCases) {
  const duplicatedCases = cases.map(caseObj => ({ ...caseObj }));
  let foundCases = duplicatedCases.map((eachCase) => {
    eachCase.ID = Number(eachCase.ID.replace('ej', '')) + 1;

    const caseFound = checkIfCaseExists(eachCase, dbCases, true);

    if (caseFound.length !== 0) {
      eachCase = parseCaseSteps(eachCase);

      return {
        dbCase: caseFound[0],
        excelCase: {
          name: eachCase.Ejercicio || eachCase.Descripcion,
          workUnitID: workUnitId,
          caseNumber: eachCase.ID,
          Items: eachCase.Items
        }
      };
    }
  })
  return foundCases.filter(eachCase => eachCase);
}

async function getItemsInExcelExistingInDb(workUnitId, items, dbItems) {
  const duplicatedItems = items.map(itemObj => ({ ...itemObj }));

  let foundItems = duplicatedItems.map((eachItem) => {
    eachItem.ID = Number(eachItem.ID.replace('int', '')) + 1;

    const itemFound = checkIfItemExists(eachItem, dbItems, true);
    if (itemFound.length !== 0) {
      return {
        dbItem: itemFound[0],
        excelItem: {
          name: eachItem.Interacciones,
          workUnitID: workUnitId,
          value: eachItem.Nota,
          itemNumber: eachItem.ID,
          Roles: parseRoles(eachItem.Rol),
        }
      };
    }
  });

  return foundItems.filter(eachItem => eachItem);
}

//INSERT FUNCTIONS
async function insertCases(dataToInsert, transaction) {
  const parsedCases = dataToInsert.cases.map(eachCase => ({
    name: eachCase.name,
    WorkUnitID: eachCase.workUnitID,
    caseNumber: eachCase.caseNumber,
    ...returnTimeStamps(),
  }))

  const createdCases = await Case.bulkCreate(parsedCases, { transaction });
  return createdCases;
}

async function insertItems(dataToInsert, transaction) {
  const parsedItems = dataToInsert.items.map(eachItem => ({
    WorkUnitID: eachItem.workUnitID,
    itemNumber: eachItem.itemNumber,
    value: eachItem.value,
    ...returnTimeStamps(),
  }))

  const createdItems = await Item.bulkCreate(parsedItems, { transaction });
  return createdItems;
}

async function insertItemCases(dataToInsert, transaction) {
  const parsedItemCases = dataToInsert.itemCases.map(eachItemCase => ({
    CaseID: eachItemCase.CaseID,
    ItemID: eachItemCase.ItemID,
    ...returnTimeStamps(),
  }))

  const createdItemCases = await ItemCase.bulkCreate(parsedItemCases, { transaction });
  return createdItemCases;
}

async function insertItemPlayerRoles(dataToInsert, transaction) {
  const parsedItemPlayerRoles = dataToInsert.itemPlayerRoles.map(eachItemPlayerRole => ({
    ItemID: eachItemPlayerRole.ItemID,
    PlayerRoleID: eachItemPlayerRole.PlayerRoleID,
    ...returnTimeStamps(),
  }))

  const createdItemPlayerRoles = await ItemPlayerRole.bulkCreate(parsedItemPlayerRoles, { transaction });
  return createdItemPlayerRoles;
}

//UTILS
function getActualDate() {
  return dayjs().format('YYYY-MM-DD HH:mm:ss');
}

function returnTimeStamps() {
  const createUpdateDate = getActualDate();
  return {
    createdAt: createUpdateDate,
    updatedAt: createUpdateDate,
  };
}

function parseInsertedCases(insertedCases, casesToInsert) {
  return insertedCases.map(eachInsertedData => {
    const jsonInsertedData = eachInsertedData.toJSON();
    jsonInsertedData.Items = casesToInsert.find(eachCase => eachCase.caseNumber === jsonInsertedData.caseNumber).Items;
    return jsonInsertedData;
  });
}

function parseInsertedItems(insertedItems, itemsToInsert) {
  return insertedItems.map(eachInsertedData => {
    const jsonInsertedData = eachInsertedData.toJSON();
    jsonInsertedData.Roles = itemsToInsert.find(eachItem => eachItem.itemNumber === jsonInsertedData.itemNumber).Roles;
    return jsonInsertedData;
  });
}

function parseCaseSteps(eachCase) {
  let items = '';
  let itemsFound = false;

  Object.keys(eachCase).forEach(key => {
    if (!itemsFound && key.toLowerCase().includes('paso')) {
      itemsFound = true;
    }

    if (itemsFound) {
      items += eachCase[key] + '_';
      delete eachCase[key];
    }
  });

  eachCase['Items'] = (items.slice(0, -1)).split('_');

  return eachCase;
}

function parseRoles(roles) {
  const parsedRoles = [];
  const splittedRoles = roles.toString().split('_');
  for (const role of splittedRoles) {
    parsedRoles.push(Number(role) + 1)
  }
  return parsedRoles;
}

function checkIfCaseExists(eachCase, cases, returnCase) {
  if (!returnCase) {
    return cases.find(caseToCompare => caseToCompare.caseNumber === eachCase.ID);
  }

  return cases.filter(caseToCompare => caseToCompare.caseNumber === eachCase.ID);
  // return caseToCompare.name === eachCase.Ejercicio || caseToCompare.name === eachCase.Descripcion
}

function checkIfItemExists(eachItem, items, returnItem) {
  if (!returnItem) {
    return items.find(itemToCompare => itemToCompare.itemNumber === eachItem.ID);
  }

  return items.filter(itemToCompare => itemToCompare.itemNumber === eachItem.ID);
}