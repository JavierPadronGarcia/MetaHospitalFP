import React, { useState } from 'react';
import { Button, Menu, Dropdown, message } from 'antd';
import { DownloadOutlined, EyeOutlined, MailOutlined, SnippetsOutlined } from '@ant-design/icons';
import './FloatingMenu.css';
import jsreportService from '../../services/jsreport.service';
import MailModal from '../mail-modal/MailModal';

const FloatingMenu = () => {
  const [open, setOpen] = useState(false);
  const [showSendEmail, setShowSendEmail] = useState(false);
  const [clearFields, setClearFields] = useState(false);

  const handleMenuClick = async (e) => {
    if (e.key === "view") {
      jsreportService.SchoolsReportView();
    } else if (e.key === "download") {
      jsreportService.downloadSchoolsReport();
    } else if (e.key === "email") {
      setShowSendEmail(true);
    }
    setOpen(false);
  };

  const handleCancelSendEmail = () => {
    setShowSendEmail(false);
  }

  const handleSendEmail = async (email, subject, body) => {
    try {
      message.loading('Enviando correo electrónico...', 0);
      await jsreportService.sendReportByEmail(email, subject, body);
      setClearFields(!clearFields);
      message.destroy();
      message.success('Informe enviado correctamente', 1);
    } catch (error) {
      message.destroy();
      message.error('Error al enviar el informe por correo electrónico.');
    }
  }

  const menu = (
    <Menu onClick={handleMenuClick}>
      <Menu.Item key="download" icon={<DownloadOutlined />}>
        Descargar
      </Menu.Item>
      <Menu.Item key="view" icon={<EyeOutlined />}>
        Ver
      </Menu.Item>
      <Menu.Item key="email" icon={<MailOutlined />}>
        Enviar por email
      </Menu.Item>
    </Menu>
  );

  return (
    <>
      <MailModal cancelEmail={handleCancelSendEmail} notifSendEmail={handleSendEmail} showFields={showSendEmail} clearFields={clearFields}
        subject='Informe escolar'
      />
      <Dropdown overlay={menu} trigger={['click']} visible={open} onVisibleChange={setOpen}>
        <Button className="floating-menu" shape="circle" icon={<SnippetsOutlined />} size="large" />
      </Dropdown>
    </>

  );
};

export default FloatingMenu;
