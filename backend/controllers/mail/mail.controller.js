const nodemailer = require('nodemailer');
const fs = require('fs');
const path = require('path');

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    type: "OAuth2",
    user: process.env.USER_MAIL,
    clientId: process.env.CLIENT_ID_MAIL,
    clientSecret: process.env.CLIENT_SECRET_MAIL,
    refreshToken: process.env.REFRESH_TOKEN_MAIL,
  }
});

function enviarCorreo(destinatario, asunto) {

  const rutaArchivoHTML = path.join(__dirname, 'mail.html');

  fs.readFile(rutaArchivoHTML, 'utf8', function (err, data) {
    if (err) {
      console.error('Error al leer el archivo HTML:', err);
      return;
    }

    const htmlContent = data.replace('{{destinatario}}', destinatario);

    const mailOptions = {
      from: 'pruebas.jcll@gmail.com',
      to: destinatario,
      subject: asunto,
      html: htmlContent,
      attachments: [
        {
          filename: 'Icon.png',
          path: 'controllers/mail/Icon.png',
          cid: 'Icon'
        }
      ]
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.error('Error al enviar el correo:', error);
      } else {
        console.log('Correo enviado:', info.response);
      }
    });
  });
}

module.exports = enviarCorreo;
