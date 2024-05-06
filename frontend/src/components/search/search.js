import React, { useState, useEffect } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import './search.css';

function SearchComponent({ data, onSearch, filter, fieldName }) {
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedFilter, setSelectedFilter] = useState('');

    useEffect(() => {
        handleSearch();
    }, [searchTerm, selectedFilter]);

    const handleSearch = () => {
        let filteredData = [...data];
        if (searchTerm) {
            if (selectedFilter && filter) {
                filteredData = filteredData.filter(item =>
                    item[selectedFilter.value].toLowerCase().includes(searchTerm.toLowerCase())
                );
            } else {
                filteredData = data.filter(item => {
                    if (fieldName.includes('.')) {
                        const fields = fieldName.split('.');
                        let fieldValue = item;

                        for (let field of fields) {
                            if (fieldValue[field]) {
                                fieldValue = fieldValue[field];
                            } else {
                                return false;
                            }
                        }
                        return fieldValue.toLowerCase().includes(searchTerm.toLowerCase());
                    } else {
                        return item[fieldName].toLowerCase().includes(searchTerm.toLowerCase());
                    }
                });
            }
        }
        onSearch(filteredData);
    };

    const handleFilterChange = (e) => {
        setSelectedFilter(filter.find(item => item.value === e.target.value));
    };

    const renderOptionsFilter = () => {
        return filter.map((item, index) => (
            <option key={index} value={item.value}>{item.name}</option>
        ));
    };

    return (
        <div className="search-container">
            <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-input"
            />
            <div className="search-icon-container">
                {!filter && <SearchOutlined className="search-icon" />}
                {filter && (
                    <select onChange={handleFilterChange} className="search-icon" style={{height: '2.3rem', border: 'none'}}>
                        <option value="">Select Filter</option>
                        {renderOptionsFilter()}
                    </select>
                )}
            </div>
        </div>
    );
}

export default SearchComponent;
