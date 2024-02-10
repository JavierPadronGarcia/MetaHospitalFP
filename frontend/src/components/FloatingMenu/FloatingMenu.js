import React, { useState } from 'react';
import { Button, Menu, Dropdown, message } from 'antd';
import { DownloadOutlined, EyeOutlined, MailOutlined, SnippetsOutlined } from '@ant-design/icons';
import './FloatingMenu.css';
import jsreportService from '../../services/jsreport.service';

const FloatingMenu = () => {
  const [open, setOpen] = useState(false);

  const handleMenuClick = async (e) => {
    if (e.key === "view") {
      jsreportService.SchoolsReportView();
    } else if (e.key === "download") {
      jsreportService.downloadSchoolsReport();
    } else if (e.key === "email") {
      const userEmail = prompt('Ingrese su dirección de correo electrónico:');
      if (userEmail) {
        try {
          await jsreportService.sendReportByEmail(userEmail);
          message.success('Informe enviado por correo electrónico con éxito.');
        } catch (error) {
          message.error('Error al enviar el informe por correo electrónico.');
        }
      }
    }
    setOpen(false);
  };

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
    <Dropdown overlay={menu} trigger={['click']} visible={open} onVisibleChange={setOpen}>
      <Button className="floating-menu" shape="circle" icon={<SnippetsOutlined />} size="large" />
    </Dropdown>
  );
};

export default FloatingMenu;
