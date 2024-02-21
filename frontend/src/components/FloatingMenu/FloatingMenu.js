import React, { useState } from 'react';
import { Button, Menu, Dropdown, message } from 'antd';
import { DownloadOutlined, EyeOutlined, MailOutlined, SnippetsOutlined } from '@ant-design/icons';
import './FloatingMenu.css';
import jsreportService from '../../services/jsreport.service';
import MailModal from '../mail-modal/MailModal';
import { useLocation } from 'react-router-dom';

const FloatingMenu = () => {
  const [open, setOpen] = useState(false);
  const [showSendEmail, setShowSendEmail] = useState(false);
  const [clearFields, setClearFields] = useState(false);
  const location = useLocation();

  const handleMenuClick = async (e) => {
    if (e.key === "view") {
      handleViewReport();
    } else if (e.key === "download") {
      handleDownloadReport();
    } else if (e.key === "email") {
      setShowSendEmail(true);
    }
    setOpen(false);
  };

  const handleViewReport = () => {
    const { pathname } = location;

    switch (pathname) {
      case '/admin/schools':
        jsreportService.SchoolsReportView()
        break;
      case '/admin/school':
        jsreportService.SchoolsReportView()
        break;
      case '/admin/users':
        jsreportService.UsersReportView();
        break;
      case '/admin/courses':
        jsreportService.CoursesReportView();
        break;
    }
  }

  const handleDownloadReport = () => {
    const { pathname } = location;

    switch (pathname) {
      case '/admin/schools':
        jsreportService.downloadSchoolsReport();
        break;
      case '/admin/school':
        jsreportService.downloadSchoolsReport();
        break;
      case '/admin/users':
        jsreportService.downloadUsersReport();
        break;
      case '/admin/courses':
        jsreportService.downloadCoursesReport();
        break;
    }
  }

  const handleCancelSendEmail = () => {
    setShowSendEmail(false);
  }

  const getReportType = () => {
    const { pathname } = location;
    let reportType;
    switch (pathname) {
      case '/admin/school':
        reportType = 'schoolReport'
        break;
      case '/admin/schools':
        reportType = 'schoolReport'
        break;
      case '/admin/users':
        reportType = 'userReport'
        break;
      case '/admin/courses':
        reportType = 'coursesReport'
        break;
    }
    return reportType;
  }

  const handleSendEmail = async (email, subject, body) => {
    try {
      const reportType = getReportType();

      message.loading('Enviando correo electrónico...', 0);
      await jsreportService.sendReportByEmail(email, subject, body, reportType);
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
