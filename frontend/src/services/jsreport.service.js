import jsreport from '@jsreport/browser-client';
import { saveAs } from 'file-saver';
import EmailService from './email.service';
import { jsReportEnpoint } from '../constants/backendEndpoints';

jsreport.serverUrl = jsReportEnpoint;

async function SchoolsReportView() {
    try {
        const parsedId = parseInt(localStorage.getItem('schoolId'), 10) || null;
        const report = await jsreport.render({
            template: {
                shortid: 'trM9BOHUP',
            },
            data: {
                schoolId: parsedId,
                token: localStorage.getItem('AccessToken'),
            },
        });

        report.openInWindow({ title: 'Reporte de escuelas' });

        return report;
    } catch (error) {

        if (error && error.response && error.response.data) {
            console.error('Error al renderizar el informe:', error.response.data);
        } else {
            console.error('Error inesperado al renderizar el informe:', error);
            throw error;
        }
    }
}

async function downloadSchoolsReport() {
    try {
        const parsedId = parseInt(localStorage.getItem('schoolId'), 10) || null;
        const report = await jsreport.render({
            template: {
                shortid: 'trM9BOHUP',
            },
            data: {
                schoolId: parsedId,
                token: localStorage.getItem('AccessToken'),
            },
        });

        const blob = await report.toBlob();

        saveAs(blob, 'reporte_de_escuelas.pdf');

    } catch (error) {
        if (error && error.response && error.response.data) {
            console.error('Error al renderizar el informe:', error.response.data);
        } else {
            console.error('Error inesperado al renderizar el informe:', error);
            throw error;
        }
    }
}

async function sendReportByEmail(email, subject, body) {
    try {
        const formdata = new FormData();

        const parsedId = parseInt(localStorage.getItem('schoolId'), 10) || null;
        const report = await jsreport.render({
            template: {
                shortid: 'trM9BOHUP',
            },
            data: {
                schoolId: parsedId,
                token: localStorage.getItem('token'),
            },
        });

        const blob = await report.toBlob();

        formdata.append('pdf', blob, 'informe.pdf');
        formdata.append('to', email);
        formdata.append('subject', subject);
        formdata.append('text', body);

        await sendEmail(formdata);
    } catch (error) {
        console.error('Error al renderizar el informe o enviar por correo electrónico:', error);
        throw error;
    }
}

async function sendEmail(formData) {
    try {
        await EmailService.sendEmail(formData);
    } catch (error) {
        console.error('Error sending email:', error.message);
    }
}


const jsreportService = {
    SchoolsReportView,
    downloadSchoolsReport,
    sendReportByEmail,
};

export default jsreportService;