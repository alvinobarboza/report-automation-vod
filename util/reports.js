const { mwBody, mwHeader, MWURL } = require('./constant');
const { SMSURL, REPORT, smsBody, smsHeader } = require('./constant');
const { getReport, getToken } = require('./motvCall.js');

require('dotenv').config();

const loginSMS = process.env.loginSMS;
const secretSMS = process.env.secretSMS;

const loginMW = process.env.loginMW;
const secretMW = process.env.secretMW;

const GETALLCUSTOMERS = 131;

const GETWATCHEDVODS = 99;
const GETVODSPACKAGES = 106;

const getAllCustomers = () =>  getReport(
    SMSURL+REPORT, 
    smsBody(GETALLCUSTOMERS), 
    smsHeader(
        getToken(
            loginSMS, 
            secretSMS
        )
    )
);

const getWatchedVods = () =>  getReport(
    MWURL+REPORT, 
    mwBody(GETWATCHEDVODS), 
    mwHeader(
        getToken(
            loginMW, 
            secretMW
        )
    )
);

const getVodsPackages = () =>  getReport(
    MWURL+REPORT, 
    mwBody(GETVODSPACKAGES), 
    mwHeader(
        getToken(
            loginMW, 
            secretMW
        )
    )
);

module.exports = {
    getAllCustomers,
    getWatchedVods,
    getVodsPackages
}