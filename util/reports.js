const { mwBody, mwHeader, MWURLYPLAY, MWURLSUMICITY } = require('./constant');
const { SMSURLYPLAY, REPORT, smsBody, smsHeader } = require('./constant');
const { getReport, getToken } = require('./motvCall.js');

require('dotenv').config();

const loginSMS_Yplay = process.env.loginSMS_Yplay;
const secretSMS_Yplay = process.env.secretSMS_Yplay;

const loginMW_Yplay = process.env.loginMW_Yplay;
const secretMW_Yplay = process.env.secretMW_Yplay;

const loginMW_Sumicity = process.env.loginMW_Sumicity;
const secretMW_Sumicity = process.env.secretMW_Sumicity;

const GETALLCUSTOMERSYPLAY = 131;
const GETALLCUSTOMERSSUMICITY = 54;

const GETWATCHEDVODSYPLAY = 99;
const GETPRODUCTTVOD = 110;
const GETWATCHEDVODSSUMICITY = 46;
const GETVODSPACKAGESYPLAY = 106;
const GETVODSPACKAGESSUMICITY = 55;

const TVODS_WATCHED_YPLAY_HSL = 117;

const getAllCustomersYplay = () =>  getReport(
    SMSURLYPLAY+REPORT, 
    smsBody(GETALLCUSTOMERSYPLAY), 
    smsHeader(
        getToken(
            loginSMS_Yplay, 
            secretSMS_Yplay
        )
    )
);

const getWatchedTvodsYplayHsl = () =>  getReport(
    MWURLYPLAY+REPORT, 
    mwBody(TVODS_WATCHED_YPLAY_HSL), 
    mwHeader(
        getToken(
            loginMW_Yplay, 
            secretMW_Yplay
        )
    )
);

const getWatchedVodsYplay = () =>  getReport(
    MWURLYPLAY+REPORT, 
    mwBody(GETWATCHEDVODSYPLAY), 
    mwHeader(
        getToken(
            loginMW_Yplay, 
            secretMW_Yplay
        )
    )
);

const getVodsPackagesYplay = () =>  getReport(
    MWURLYPLAY+REPORT, 
    mwBody(GETVODSPACKAGESYPLAY), 
    mwHeader(
        getToken(
            loginMW_Yplay, 
            secretMW_Yplay
        )
    )
);

const getTvodsPackagesYplay = () =>  getReport(
    MWURLYPLAY+REPORT, 
    mwBody(GETPRODUCTTVOD), 
    mwHeader(
        getToken(
            loginMW_Yplay, 
            secretMW_Yplay
        )
    )
);

const getAllCustomersSumicity = () =>  getReport(
    MWURLSUMICITY+REPORT, 
    mwBody(GETALLCUSTOMERSSUMICITY), 
    mwHeader(
        getToken(
            loginMW_Sumicity, 
            secretMW_Sumicity
        )
    )
);

const getWatchedVodsSumicity = () =>  getReport(
    MWURLSUMICITY+REPORT, 
    mwBody(GETWATCHEDVODSSUMICITY), 
    mwHeader(
        getToken(
            loginMW_Sumicity, 
            secretMW_Sumicity
        )
    )
);

const getVodsPackagesSumicity = () =>  getReport(
    MWURLSUMICITY+REPORT, 
    mwBody(GETVODSPACKAGESSUMICITY), 
    mwHeader(
        getToken(
            loginMW_Sumicity, 
            secretMW_Sumicity
        )
    )
);

module.exports = {
    getAllCustomersYplay,
    getAllCustomersSumicity,
    getWatchedVodsYplay,
    getWatchedVodsSumicity,
    getVodsPackagesYplay,
    getTvodsPackagesYplay,
    getWatchedTvodsYplayHsl,
    getVodsPackagesSumicity
}