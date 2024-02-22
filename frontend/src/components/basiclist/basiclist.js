import React from 'react';
import { EditOutlined, DeleteOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import './basiclist.css';

const BasicList = ({ items, renderRow, Headlines, onDelete, onEdit }) => {

  return (
    <div className='table-component'>
      <table>
        <thead>
          <tr>
            {Headlines.map((headline, index) => (
              <th key={index} className='headlines'>{headline}</th>
            ))}
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody>
          {items && items.length > 0 ? (
            items.map((item) => (
              <tr key={item.id}>
                {renderRow(item)}
                <td>
                  {onEdit && <EditOutlined className='edit-normal' style={{ marginRight: 8 }} onClick={() => onEdit(item.id, 'normal')} />}
                  {onEdit && <EditOutlined className='edit-popform' style={{ marginRight: 8 }} onClick={() => onEdit(item.id, 'popform')} />}
                  <Popconfirm
                    title="Eliminar"
                    description="¿Eetas seguro que quieres eliminar?"
                    onConfirm={() => onDelete(item.id)}
                    okText="si"
                    cancelText="no"
                  >
                    <DeleteOutlined data-testid="delete-button" />
                  </Popconfirm>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={Headlines.length + 1}>No hay elementos para mostrar</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BasicList;


