import React, { useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import './search.css';

function SearchComponent({ data, onSearch, fieldName }) {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) => {
        const searchTerm = e.target.value;
        setSearchTerm(searchTerm);

        const filteredData = data.filter(item => {
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

        onSearch(filteredData);
    };

    return (
        <div className="search-container"> 
            <input
                type="text"
                placeholder="Search..."
                value={searchTerm}
                onChange={handleSearch}
                className="search-input" 
            />
            <div className="search-icon-container"> 
                <SearchOutlined className="search-icon" />
            </div>
        </div>
    );
}

export default SearchComponent;


