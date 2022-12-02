const { mwBody, mwHeader, MWURLYPLAY, MWURLSUMICITY } = require('./constant');
const { SMSURLYPLAY, REPORT, smsBody, smsHeader } = require('./constant');
const { getReport, getToken } = require('./motvCall.js');

require('dotenv').config();

const loginSMS_Yplay = process.env.loginSMS_Yplay;
const secretSMS_Yplay = process.env.secretSMS_Yplay;

const GETALLCUSTOMERSYPLAY = 131;

const getAllCustomersYplay = () => getReport(
    SMSURLYPLAY + REPORT,
    smsBody(GETALLCUSTOMERSYPLAY),
    smsHeader(
        getToken(
            loginSMS_Yplay,
            secretSMS_Yplay
        )
    )
);


module.exports = {
    getAllCustomersYplay,
}