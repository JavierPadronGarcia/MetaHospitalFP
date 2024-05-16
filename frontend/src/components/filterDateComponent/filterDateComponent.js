import React, { useEffect, useState } from 'react';
import { DatePicker, Slider } from 'antd';
import './filterDateComponent.css';
import i18next from 'i18next';
import { useTranslation } from 'react-i18next';
import useDayjsLocale from '../../utils/shared/getDayjsLocale';
import dayjs from 'dayjs';
import localeData from 'dayjs/plugin/localeData';
dayjs.extend(localeData);

const FilterComponent = ({ data, onFilter }) => {

  const [t] = useTranslation('global');
  dayjs.locale(useDayjsLocale());
  const [selectedDay, setSelectedDay] = useState();
  const [selectedStartHour, setSelectedStartHour] = useState(0);
  const [selectedEndHour, setSelectedEndHour] = useState(24);

  const handleDayChange = (date) => {
    if (date === 'Invalid Date') {
      setSelectedDay(null);
    } else {
      setSelectedDay(date);
    }
  };

  const handleHourRangeChange = (values) => {
    setSelectedStartHour(values[0]);
    setSelectedEndHour(values[1]);
  };

  useEffect(() => {
    handleFilter();
  }, [selectedDay, selectedStartHour, selectedEndHour]);

  const handleFilter = () => {
    const filteredData = data.filter(item => {
      const logTimestamp = dayjs(item.submittedAt);
      const logDate = logTimestamp.format('MM/DD/YYYY');
      const logHour = logTimestamp.hour();
      const logMinute = logTimestamp.minute();

      const isHourMatch = (logHour > selectedStartHour || (logHour === selectedStartHour && logMinute >= 0)) &&
        (logHour < selectedEndHour || (logHour === selectedEndHour && logMinute <= 0));

      if (selectedDay) {
        const isDayMatch = logDate === dayjs(selectedDay).format('MM/DD/YYYY');
        return isDayMatch && isHourMatch;
      }

      return isHourMatch;
    });

    onFilter(filteredData);
  };

  return (
    <div className="filter-container">
      <div className="filter-content">
        <div className="filter-label date-picker">
          <DatePicker onChange={handleDayChange} />
        </div>
        <div className="filter-label slider">
          <Slider
            range={{
              draggableTrack: true,
            }}
            tooltip={{
              formatter: (value) => `${value}:00`,
              placement: 'bottom',
              color: '#646269',
            }}
            onChange={handleHourRangeChange}
            max={24}
            min={0}
            defaultValue={[0, 24]}
          />
        </div>
      </div>
    </div>
  );
};

export default FilterComponent;