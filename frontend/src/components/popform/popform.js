import React, { useState, useEffect } from 'react';
import { Modal, Button, Affix } from 'antd';
import { PlusOutlined } from '@ant-design/icons';
import './popform.css';

const PopForm = ({ renderInputs, cancel, onSubmit, showModalAutomatically }) => {
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    if (showModalAutomatically.editMode && showModalAutomatically.showPop) {
      setModalVisible(true);
    }
  }, [showModalAutomatically]);

  const showModal = () => {
    setModalVisible(true);
  };

  const handleCancel = () => {
    setModalVisible(false);
    if (cancel) {
      cancel();
    }
  };

  const handleOk = () => {
    setModalVisible(false);
    if (onSubmit) {
      onSubmit();
      cancel();
    }
  };

  return (
    <div>
      <Affix style={{ position: 'fixed', bottom: 20, right: 20 }}>
        <Button
          className="floating-button"
          type="primary"
          shape="circle"
          icon={<PlusOutlined />}
          size="large"
          onClick={showModal}
        />
      </Affix>
      <Modal
        visible={modalVisible}
        onOk={handleOk}
        onCancel={handleCancel}
        className="blue-background-modal"
      >
        <div className="inputs">
          {renderInputs()}
        </div>
      </Modal>
    </div>
  );
};

export default PopForm;