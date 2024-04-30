import { Card, Popconfirm, Popover } from 'antd';
import { DeleteOutlined, EditOutlined, EllipsisOutlined } from '@ant-design/icons';
import { useState } from 'react';
import ActivityForm from '../activity-form/ActivityForm';
import { useParams } from 'react-router-dom';
import dayjs from 'dayjs';

const { Meta } = Card;

function ActivityCard({ edit, caseId, activityId, title, description, assigned, notifyDelete, notifyUpdateInfo }) {
  const [isOpen, setOpen] = useState(false);
  const params = useParams();
  const groupId = params.id;
  const workUnitId = params.workUnitId;

  if (edit) {

    const handleDelete = () => {
      notifyDelete(activityId);
      setOpen(false);
    }

    const deleteElement = () => (
      <Popconfirm
        title='¿Eliminar esta actividad?'
        open={isOpen}
        onConfirm={() => handleDelete()}
        onCancel={() => setOpen(false)}
        okText='Confirmar'
        cancelText='Cancelar'
      >
        <DeleteOutlined key='delete' onClick={() => setOpen(true)} />
      </Popconfirm>
    )

    const formUpdateContent = () => (
      <div>
        <ActivityForm
          groupId={groupId}
          workUnitId={workUnitId}
          isUpdateForm={true}
          updateFormContent={{ case: { id: caseId, name: title }, date: description, assigned: assigned }}
          notifyUpdateInfo={() => notifyUpdateInfo()} />
      </div>
    )

    const editElement = () => (
      <Popover content={formUpdateContent}
        trigger='click'
      >
        <EditOutlined key='edit' />
      </Popover>
    )

    return (
      <>
        <Card
          className='activities-card'
          actions={[
            (deleteElement()),
            (editElement()),
          ]}
        >
          <Meta title={title} description={description ? dayjs(description).format('DD-MM-YYYY') : ''} />
        </Card>
      </>
    );
  }

  return (
    <Card
      className='activities-card'
      actions={[
        <EllipsisOutlined key='ellipsis' />
      ]}
    >
      <Meta title={title} description={description ? dayjs(description).format('DD-MM-YYYY') : ''} />
    </Card>
  );
}

export default ActivityCard;