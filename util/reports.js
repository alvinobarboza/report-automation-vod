const {
    mwBody,
    mwHeader,
    MWURLYPLAY,
    MWURLSUMICITY,
    MWURLTIP,
} = require('./constant');
const { SMSURLYPLAY, REPORT, smsBody, smsHeader } = require('./constant');
const { getReport, getToken } = require('./motvCall.js');

require('dotenv').config();

const LOGIN_SMS_YPLAY = process.env.loginSMS_Yplay;
const SECRET_SMS_YPLAY = process.env.secretSMS_Yplay;

const LOGIN_MW_YPLAY = process.env.loginMW;
const SECRET_MW_YPLAY = process.env.secretMW;

const LOGIN_MW_TIP = process.env.LOGIN_MW_TIP;
const SECRET_MW_TIP = process.env.SECRET_MW_TIP;

const GETALLCUSTOMERSYPLAY = 131;
const GETALLCUSTOMERSYBOX = 132;
const GETALLCUSTOMERSYBOXACTIVE = 106;

const GETALLCUSTOMERSYBOXACTIVE_TIP = 63;

const getAllCustomersYplay = () =>
    getReport(
        SMSURLYPLAY + REPORT,
        smsBody(GETALLCUSTOMERSYPLAY),
        smsHeader(getToken(LOGIN_SMS_YPLAY, SECRET_SMS_YPLAY))
    );

const getAllCustomersYbox = () =>
    getReport(
        SMSURLYPLAY + REPORT,
        smsBody(GETALLCUSTOMERSYBOX),
        smsHeader(getToken(LOGIN_SMS_YPLAY, SECRET_SMS_YPLAY))
    );

const getAllCustomersYboxActive = () =>
    getReport(
        MWURLYPLAY + REPORT,
        mwBody(GETALLCUSTOMERSYBOXACTIVE),
        mwHeader(getToken(LOGIN_MW_YPLAY, SECRET_MW_YPLAY))
    );

const getAllCustomersYboxActiveTIP = () =>
    getReport(
        MWURLTIP + REPORT,
        mwBody(GETALLCUSTOMERSYBOXACTIVE_TIP),
        mwHeader(getToken(LOGIN_MW_TIP, SECRET_MW_TIP))
    );

module.exports = {
    getAllCustomersYplay,
    getAllCustomersYbox,
    getAllCustomersYboxActive,
    getAllCustomersYboxActiveTIP,
};
