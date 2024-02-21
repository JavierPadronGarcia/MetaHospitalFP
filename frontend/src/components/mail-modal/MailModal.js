import { useEffect, useState } from 'react';
import { Input, Button, Modal, Form } from 'antd';

function MailModal({ showFields, cancelEmail, notifSendEmail, subject, clearFields }) {

  const [recipientEmail, setRecipientEmail] = useState('');
  const [emailSubject, setEmailSubject] = useState(subject || '');
  const [emailBody, setEmailBody] = useState('');

  const handleRecipientChange = (e) => {
    setRecipientEmail(e.target.value);
  };

  const handleSubjectChange = (e) => {
    setEmailSubject(e.target.value);
  };

  const handleBodyChange = (e) => {
    setEmailBody(e.target.value);
  };

  const clearForm = () => {
    setRecipientEmail('');
    setEmailSubject(subject || '');
    setEmailBody('');
    console.log('hola')
  }

  useEffect(() => {
    clearForm();

    return () => {
      clearForm();
    }
  }, [clearFields]);

  return (
    <Modal
      title="Enviar por correo electrónico"
      open={showFields}
      onCancel={cancelEmail}
      footer={[
        <Button key="cancel" onClick={() => { clearForm(); cancelEmail(); }}>
          Cancelar
        </Button>,
        <Button
          key="send"
          type="primary"
          onClick={() => notifSendEmail(recipientEmail, emailSubject, emailBody)}
        >
          Enviar
        </Button>,
      ]}
    >
      <Form layout="vertical">
        <Form.Item label="Correo electrónico del destinatario">
          <Input
            placeholder="Ingrese el correo electrónico"
            value={recipientEmail}
            onChange={handleRecipientChange}
          />
        </Form.Item>

        <Form.Item label="Asunto del correo electrónico">
          <Input
            placeholder="Ingrese el asunto del correo electrónico"
            value={emailSubject}
            onChange={handleSubjectChange}
          />
        </Form.Item>

        <Form.Item label="Cuerpo del correo electrónico">
          <Input.TextArea
            placeholder="Ingrese el cuerpo del correo electrónico"
            value={emailBody}
            onChange={handleBodyChange}
          />
        </Form.Item>
      </Form>
    </Modal>
  )

}

export default MailModal;