const nodemailer = require("nodemailer");
require('dotenv').config();

const EMAIL = process.env.EMAIL;
const PASSWD = process.env.PASSWORD;

// Simple delay to wait files to be created, could be an node watcher...
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

async function sendEmail(files) {
    try {
        const date = (new Date()).toLocaleString();
        const bodyHTML = require('./templateEmail');

        await delay(15000);

        const emails = [
            'daniel.campos@youcast.tv.br',
            'vinicius.okaeda@youcast.tv.br',
            'carlos.salce@youcast.tv.br',
            'alvino.barboza@youcast.tv.br',
        ];
        const bodyPlainText = `
        Email enviado automáticamente,
        Segue relatório gerados às ${date}.
        `;

        let transporter = nodemailer.createTransport({
            host: "smtp.youcast.tv.br",
            port: 587,
            auth: {
                user: EMAIL,
                pass: PASSWD,
            },
        });

        let info = await transporter.sendMail({
            from: 'noreply2@mail.youcast.tv.br',
            to: emails,
            subject: 'Relatórios último dia do mês - VOD',
            text: bodyPlainText,
            html: bodyHTML,
            attachments: files
        });
    } catch (error) {
        console.log(error);
    }
}

// sendEmail().catch(console.error);

module.exports = sendEmail;