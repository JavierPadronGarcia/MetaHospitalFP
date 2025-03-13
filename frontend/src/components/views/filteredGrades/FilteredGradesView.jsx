import { Button, DatePicker, Flex, Select, Space, Spin } from "antd";
import dayjs from "dayjs";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { utils, writeFile } from 'xlsx';
import casesService from "../../../services/cases.service";
import gradeService from "../../../services/grade.service";
import workUnitGroupsService from "../../../services/workUnitGroups.service";
import Accordion from "../../accordion/Accordion";
import ExerciseCard from "../../exerciseCard/ExerciseCard";
import './FilteredGradesView.css';
import { DownloadOutlined, LoadingOutlined } from "@ant-design/icons";

const { RangePicker } = DatePicker;

const FilteredGradesView = () => {

  const groupId = localStorage.getItem('groupsId');
  const groupName = localStorage.getItem('groupsName');
  const [t] = useTranslation('global');

  const [timestamps, setTimestamps] = useState({ startDate: null, endDate: null });
  const [workUnitId, setWorkUnitId] = useState(null);
  const [caseId, setCaseId] = useState(null);

  const [workUnits, setWorkUnits] = useState([]);
  const [possibleCases, setPossibleCases] = useState([]);

  const [filterResponse, setFilterResponse] = useState({});

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function getWorkUnits() {
      try {
        const responseUTs = await workUnitGroupsService.getAllWorkUnitsWithColorsByGroup(groupId);
        const workUnitsData = responseUTs.map((ut) => ({
          value: ut.WorkUnitID,
          label: ut.workUnit.name
        }));
        setWorkUnits(workUnitsData);
      } catch (err) {
        console.log(err);
      }
    }
    getWorkUnits()
  }, [groupId]);

  useEffect(() => {
    async function getCasesInWorkUnit() {
      try {
        const responseCases = await casesService.getAllCasesOfTheGroup(groupId, workUnitId);
        const casesData = responseCases.map((caseData) => ({
          value: caseData.id,
          label: caseData.name
        }));
        setPossibleCases(casesData);
      } catch (err) {
        console.log(err);
      }
    }
    if (workUnitId !== null && workUnitId !== undefined) {
      getCasesInWorkUnit();
    }
  }, [groupId, workUnitId]);

  const handleChangeRangePicker = (dates) => {
    if (dates === null || dates.length === 0) {
      setTimestamps({ startDate: null, endDate: null });
      return null;
    }

    setTimestamps({
      startDate: dayjs(dates[0]).toISOString(),
      endDate: dayjs(dates[1]).toISOString()
    });
  }

  const handleChangeUT = (utId) => {
    setWorkUnitId(utId);
  }

  const handleChangeCase = (caseId) => {
    setCaseId(caseId);
  }

  const filterGrades = () => {
    const { startDate, endDate } = timestamps;
    setLoading(true);
    gradeService.getFilteredGrades(workUnitId, caseId, startDate, endDate, groupId).then(data => {
      setFilterResponse(data);
    }).catch(err => {
      console.log(err);
    }).finally(() => {
      setLoading(false);
    });
  }

  const renderContent = (data) => {

    const { uts } = data;

    if (uts.length === 0) {
      return <div>No hay datos</div>
    }

    if (uts.length === 1 && workUnitId) {
      return renderCases(uts[0])
    }

    return (
      uts.map((ut) => {
        if (ut.id === null) {
          return;
        }
        return (
          <Accordion title={ut.name} key={ut.id} defaultOpen={uts.length === 1}>
            {renderCases(ut)}
          </Accordion>
        )
      })
    )
  }

  const renderCases = (data) => {
    const { cases } = data;

    if (cases.length === 0) {
      return <div>No hay casos</div>
    }

    if (cases.length === 1 && caseId) {
      return renderParticipations(cases[0])
    }

    return (
      cases.map((caseItem) => {
        return (
          <Accordion title={caseItem.name} key={caseItem.id} defaultOpen={cases.length === 1}>
            {renderParticipations(caseItem)}
          </Accordion>
        )
      })
    );
  }

  const renderParticipations = (data) => {
    const { participations } = data;

    if (participations.length === 0) {
      return <div>No hay participaciones</div>
    }

    return (
      participations.map((participation, index) => {
        return (
          <ExerciseCard
            title={participation.studentName}
            participationGrades={
              {
                finalGrade: participation.finalGrade,
                itemGrades: participation.grades
              }
            }
            date={participation.submittedAt}
            noReorderGrades={true}
          />
        )
      })
    );
  }

  const handleExportViewToXlsx = () => {
    const wb = utils.book_new();
    const uts = filterResponse.uts;

    for (const indexUt in uts) {
      const ut = uts[indexUt];

      const utData = [];

      for (const indexCase in ut.cases) {
        const caseItem = ut.cases[indexCase];

        for (const indexParticipation in caseItem.participations) {
          const participation = caseItem.participations[indexParticipation];

          const date = dayjs(participation.submittedAt);

          const participationData = {
            [t('case_s')]: caseItem.caseNumber,
            [t('final_grade')]: participation.finalGrade,
            [t('submit_date')]: date.format("YYYY-MM-DD"),
            [t('submit_time')]: date.format("HH:mm"),
            [t('student_s')]: participation.studentName
          };

          utData.push(participationData);
        }
      }

      const utWorkSheet = utils.json_to_sheet(utData);
      utils.book_append_sheet(wb, utWorkSheet, ut.name);
    }

    writeFile(wb, `${t('student_grades')} - ${groupName} - ${dayjs().format("YYYY-MM-DD")}.xlsx`);
  }

  return (
    <div className="filtered-grades-view">
      <div className="filtered-grades-view-filters">
        <Flex vertical align="center" style={{ width: '100%' }}>

          <Space>
            <Select
              placeholder={t("unit_p")}
              style={{ width: 250 }}
              onChange={handleChangeUT}
              options={workUnits || []}
              allowClear
              showSearch
              onClear={() => setWorkUnitId(null)}
              filterOption={(input, option) =>
                option?.label?.toLowerCase().includes(input.toLowerCase())
              }
            />
            <Select
              placeholder={t("case_p")}
              style={{ width: 300 }}
              onChange={handleChangeCase}
              options={possibleCases || []}
              disabled={!workUnitId}
              allowClear
              showSearch
              onClear={() => setCaseId(null)}
              filterOption={(input, option) =>
                option?.label?.toLowerCase().includes(input.toLowerCase())
              }
            />
            <RangePicker showTime onChange={handleChangeRangePicker} />
            <Button type="primary" onClick={filterGrades} loading={loading}>{t('filter')}</Button>
            <Button type="dashed" onClick={handleExportViewToXlsx}><DownloadOutlined />{t('export_view')}</Button>
          </Space>

          <Flex vertical style={{ width: '100%' }}>
            {loading
              ? <Spin indicator={<LoadingOutlined spin />} size="large" />
              : <>
                {filterResponse.uts
                  ? renderContent(filterResponse)
                  : <div style={{ margin: '0 auto', paddingTop: "100px" }}>{t('filter_view_content')}</div>
                }
              </>
            }
          </Flex>

        </Flex>
      </div>
    </div>
  )
}

export default FilteredGradesView;