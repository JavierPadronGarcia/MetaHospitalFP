import jsreport from '@jsreport/browser-client';
import { useEffect, useRef, useState } from 'react';
import { Spin, Input, Button, Modal, Form, message } from 'antd';
import emailService from '../../services/email.service';
import { jsReportEnpoint } from '../../constants/backendEndpoints';
import MailModal from '../mail-modal/MailModal';

jsreport.serverUrl = jsReportEnpoint;

function ReportGenerator({ reportData }) {
  const pdfContainerRef = useRef();
  const [loading, setLoading] = useState(false);
  const [showEmailFields, setShowEmailFields] = useState(false);

  const sendEmail = async (reportInfo) => {
    emailService.sendEmail(reportInfo).then(reponse => {
      message.success('Correo electrónico enviado correctamente');
    }).catch(err => {
      message.error('Error al enviar el correo electrónico')
    })
  };

  const generateReport = async () => {
    setLoading(true);
    const report = await jsreport.render({
      template: {
        shortid: "7ggS5RqZL2"
      },
      data: {
        token: localStorage.getItem('token'),
        params: reportData
      }
    })
    const uriReport = await report.toDataURI();
    pdfContainerRef.current.src = uriReport;
    setLoading(false);
  };

  const handleSendEmail = async (email, subject, body) => {
    const formData = new FormData();

    const report = await jsreport.render({
      template: {
        shortid: "7ggS5RqZL2"
      },
      data: {
        token: localStorage.getItem('token'),
        params: reportData
      }
    })

    const blob = await report.toBlob();

    formData.append('pdf', blob, 'informe.pdf');
    formData.append('to', email);
    formData.append('subject', subject);
    formData.append('text', body);

    await sendEmail(formData);
    setShowEmailFields(false);
  };

  const handleCancelEmail = () => {
    setShowEmailFields(false);
  };

  const showEmailModal = () => {
    setShowEmailFields(true);
  };

  useEffect(() => {
    generateReport();
  }, []);

  return (
    <div>
      <Button type="primary" onClick={showEmailModal}>Enviar por correo electrónico</Button>
      <MailModal
        handleCancelEmail={handleCancelEmail}
        notifSendEmail={handleSendEmail}
        cancelEmail={handleCancelEmail}
        showFields={showEmailFields}
        subject='Reporte de notas'
      />

      {loading && (
        <div style={{ textAlign: 'center', marginTop: '20px' }}>
          <Spin size="large" />
          <p>Generando informe...</p>
        </div>
      )}

      <iframe
        ref={pdfContainerRef}
        title="Visor PDF"
        width="100%"
        height="600px"
        style={{ display: loading ? 'none' : 'block' }}
      />
    </div>
  );
}

export default ReportGenerator;