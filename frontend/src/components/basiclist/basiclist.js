import React from 'react';
import { EditOutlined, DeleteOutlined, LockOutlined } from '@ant-design/icons';
import { Popconfirm } from 'antd';
import './basiclist.css';
import { useTranslation } from 'react-i18next';

const BasicList = ({ items, renderRow, Headlines, onDelete, onEdit, password }) => {
  const [t] = useTranslation('global');

  return (
    <div className='table-component'>
      <table>
        <thead>
          <tr>
            {Headlines.map((headline, index) => (
              <th key={index} className='headlines'>{headline}</th>
            ))}
            <th>{t('action_p')}</th>
          </tr>
        </thead>
        <tbody>
          {items && items.length > 0 ? (
            items.map((item) => (
              <tr key={item.id}>
                {renderRow(item)}
                <td>
                  {password && <Popconfirm
                    title={t('reset_password')}
                    description={t('reset_password_req')}
                    onConfirm={() => onEdit(item.id, 'popform')}
                    okText={t('yes')}
                    cancelText={t('no')}
                  ><LockOutlined className='edit-normal' style={{ marginRight: 8 }} />
                  </Popconfirm>}
                  {password && <Popconfirm
                    title={t('reset_password')}
                    description={t('reset_password_req')}
                    onConfirm={() => onEdit(item.id, 'popform')}
                    okText={t('yes')}
                    cancelText={t('no')}
                  ><LockOutlined className='edit-popform' style={{ marginRight: 8 }} />
                  </Popconfirm>}

                  {onEdit && !password && <EditOutlined className='edit-normal' style={{ marginRight: 8 }} onClick={() => onEdit(item.id, 'normal')} />}
                  {onEdit && !password && <EditOutlined className='edit-popform' style={{ marginRight: 8 }} onClick={() => onEdit(item.id, 'popform')} />}
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
