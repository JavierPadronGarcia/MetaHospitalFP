const db = require('../models')
const ItemTranslation = db.itemTranslation;
const CaseTranslation = db.caseTranslation;
const Language = db.translationLanguage;

exports.getTranslationIncludeProps = (translationType, language, showAttributes = true) => {
  const translationModel = (translationType === 'item')
    ? ItemTranslation
    : (translationType === 'case')
      ? CaseTranslation
      : null;

  if (!translationModel) {
    throw new Error('TranslationType not valid');
  }

  const translationObject = {
    model: translationModel,
    attributes: showAttributes === true ? undefined : [],
    include: [
      {
        model: Language,
        attributes: showAttributes === true ? undefined : [],
        where: {
          languageShort: language
        }
      }
    ]
  };

  return translationObject
};