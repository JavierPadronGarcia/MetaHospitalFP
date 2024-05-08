import { useState } from 'react';
import { EditOutlined, DeleteOutlined, LockOutlined } from '@ant-design/icons';
import './basiclist.css';
import { Popconfirm } from 'antd';
import { useTranslation } from 'react-i18next';

const BasicList = ({ items, renderRow, Headlines, onDelete, onEdit, password, columnTypes }) => {
  const [sortBy, setSortBy] = useState({ key: null, order: 'asc' });
  const [t] = useTranslation('global');

  const handleSort = (index) => {
    if (sortBy.key === index) {
      setSortBy({ key: index, order: sortBy.order === 'asc' ? 'desc' : 'asc' });
    } else {
      setSortBy({ key: index, order: 'asc' });
    }
  };

  const sortedItems = [...items].sort((a, b) => {
    if (sortBy.key !== null) {
      const columnName = columnTypes[0].name[sortBy.key + 1]; // Ajusta el índice a base cero
      const columnType = columnTypes[0].type[sortBy.key + 1]; // Ajusta el índice a base cero
      const aValue = a[columnName];
      const bValue = b[columnName];

      if (columnType === 'string') {
        // Ordenamiento de cadenas
        if (sortBy.order === 'asc') {
          return aValue.localeCompare(bValue);
        } else {
          return bValue.localeCompare(aValue);
        }
      } else if (columnType === 'image') {
        // No ordenar columnas de imagen
        return 0;
      }
    }
    return 0;
  });

  return (
    <div className='table-component'>
      <table>
        <thead>
          <tr>
            {Headlines.map((headline, index) => (
              <th key={index} className='headlines' onClick={() => handleSort(index)}>
                {t(headline)} {sortBy.key === index && (sortBy.order === 'asc' ? '▲' : '▼')}
              </th>
            ))}
            <th>{t('action_p')}</th>
          </tr>
        </thead>
        <tbody>
          {sortedItems.length > 0 ? (
            sortedItems.map((item) => (
              <tr key={item.id}>
                {renderRow(item)}
                <td>
                  {password && (
                    <Popconfirm
                      title={t('reset_password')}
                      description={t('reset_password_req')}
                      onConfirm={() => onEdit(item.id, 'popform')}
                      okText={t('yes')}
                      cancelText={t('no')}
                    >
                      <LockOutlined className='edit-normal' style={{ marginRight: 8 }} />
                    </Popconfirm>
                  )}
                  {onEdit && !password && (
                    <EditOutlined
                      className='edit-normal'
                      style={{ marginRight: 8 }}
                      onClick={() => onEdit(item.id, 'normal')}
                    />
                  )}
                  <Popconfirm
                    title={t('delete')}
                    description={t('delete_question')}
                    onConfirm={() => onDelete(item.id)}
                    okText={t('yes')}
                    cancelText={t('no')}
                  >
                    <DeleteOutlined data-testid="delete-button" />
                  </Popconfirm>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={Headlines.length + 1}>{t('no_elements_to_show')}</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BasicList;
