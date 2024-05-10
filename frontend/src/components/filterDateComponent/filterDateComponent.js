import React, { useState } from 'react';
import Calendar from 'react-calendar';
import Slider from 'rc-slider';
import 'rc-slider/assets/index.css';
import './filterDateComponent.css';

const FilterComponent = ({ data, onFilter }) => {
  const [selectedDay, setSelectedDay] = useState(new Date());
  const [selectedStartHour, setSelectedStartHour] = useState(0);
  const [selectedEndHour, setSelectedEndHour] = useState(24);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const handleDayChange = (date) => {
    setSelectedDay(date);
  };

  const handleHourRangeChange = (values) => {
    setSelectedStartHour(values[0]);
    setSelectedEndHour(values[1]);
  };

  const handleFilter = () => {
    const filteredData = data.filter(item => {
      const logTimestamp = new Date(item.submittedAt);
      const logDate = logTimestamp.toLocaleDateString();
      const logHour = logTimestamp.getHours();
      const logMinute = logTimestamp.getMinutes();
      console.log(logHour, logMinute, selectedEndHour);

      return (
        (!selectedDay || logDate === selectedDay.toLocaleDateString()) &&
        ((logHour > selectedStartHour || (logHour === selectedStartHour && logMinute >= 0)) &&
          (logHour < selectedEndHour || (logHour === selectedEndHour && logMinute <= 0)))
      );
    });
    onFilter(filteredData);
  };

  return (
    <div className="filter-container">
      <summary onClick={() => setIsFilterOpen(!isFilterOpen)}>
        <button className="filter-button">Mostrar filtro</button>
      </summary>
      {isFilterOpen && (
        <div className="filter-content">
          <div className="filter-label">
            <label>Día:</label>
            <Calendar
              onChange={handleDayChange}
              value={selectedDay}
            />
          </div>
          <div className="filter-label">
            <label>Rango de horas:</label>
            <div className="hour-range">
              <span>{selectedStartHour}:00</span>
              <span>{selectedEndHour}:00</span>
            </div>
            <Slider
              min={0}
              max={24}
              range
              defaultValue={[selectedStartHour, selectedEndHour]}
              onChange={handleHourRangeChange}
              trackStyle={{ backgroundColor: "#ff704a", height: 10 }}
              railStyle={{ backgroundColor: "#ffffff", height: 10 }}
              handleStyle={{
                borderColor: "#646269",
                height: 20,
                width: 20,
                backgroundColor: "#646269"
              }}
            />
          </div>
          <button className="filter-button" onClick={handleFilter}>Filtrar</button>
        </div>
      )}
    </div>
  );
};

export default FilterComponent;
