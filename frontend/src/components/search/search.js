import React, { useState } from 'react';
import { SearchOutlined } from '@ant-design/icons';
import './search.css'; // Importa el archivo CSS para aplicar estilos

function SearchComponent({ data, onSearch, fieldName }) {
    const [searchTerm, setSearchTerm] = useState('');

    const handleSearch = (e) => {
        const searchTerm = e.target.value;
        setSearchTerm(searchTerm);
        const filteredData = data.filter(item =>
            item[fieldName].toLowerCase().includes(searchTerm.toLowerCase())
        );
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

