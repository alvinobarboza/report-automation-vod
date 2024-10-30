const {
    mwBody,
    mwHeader,
    MWURLYPLAY,
    MWURLSUMICITY,
    MWURLTIP,
    REPORT_SCHEDULE,
    lastestEntryFromScheduleBody,
    REPORT_SCHEDULE_HISTORY,
    downloadReportBody,
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

const LOGIN_MW_UNIFIQUE = process.env.LOGIN_MW_UNIFIQUE;
const SECRET_MW_UNIFIQUE = process.env.SECRET_MW_UNIFIQUE;

const GETALLCUSTOMERSYPLAY = 131;
const GETALLCUSTOMERSYBOX = 132;
const GETALLCUSTOMERSYBOXACTIVE = 106;
const GETALLVODERNANY_YPLAY = 9;
const GETALLVODERNANY_UNIFIQUE = 4;
const GETALLVODERNANY_TIP = 3;

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

/**
 * @param {number} id
 * @param {string} platformUrl
 * @param {string} login
 * @param {string} secret
 * @returns {Promise<MotvResponse<RowsReport>>}
 */
const getLastestEntryFromSchedule = async (id, platformUrl, login, secret) =>
    getReport(
        platformUrl + REPORT_SCHEDULE_HISTORY,
        lastestEntryFromScheduleBody(id),
        mwHeader(getToken(login, secret))
    );

/**
 * @param {number} id
 * @param {string} platformUrl
 * @param {string} login
 * @param {string} secret
 * @returns {Promise<MotvResponse<ReportFile>>} */
const downloadReport = async (id, platformUrl, login, secret) =>
    getReport(
        platformUrl + REPORT_SCHEDULE,
        downloadReportBody(id),
        mwHeader(getToken(login, secret))
    );

module.exports = {
    getAllCustomersYplay,
    getAllCustomersYbox,
    getAllCustomersYboxActive,
    getAllCustomersYboxActiveTIP,
    getLastestEntryFromSchedule,
    downloadReport,
    GETALLVODERNANY_UNIFIQUE,
    GETALLVODERNANY_YPLAY,
    GETALLVODERNANY_TIP,
    LOGIN_MW_TIP,
    LOGIN_MW_YPLAY,
    LOGIN_MW_UNIFIQUE,
    SECRET_MW_TIP,
    SECRET_MW_UNIFIQUE,
    SECRET_MW_YPLAY,
};

/**
 * @typedef {object} RowsReport
 * @property {LastestEntryFromSchedule[]} rows
 * @property {number} row_count
 */

/**
 * @typedef {object} LastestEntryFromSchedule
 * @property {number} report_schedules_attachements_id
 * @property {number} report_schedules_attachements_report_schedules_id
 * @property {string} report_schedules_attachements_generated
 * @property {string} report_schedules_attachements_path
 * @property {string} report_schedules_attachements_type
 * @property {string} report_schedules_attachements_note
 * @property {number} report_schedules_attachements_duration
 * @property {string} _class
 */

/**
 * @typedef {object} ReportFile
 * @property {string} filename
 * @property {string} content
 */

/**
 * @template T
 * @typedef {object} MotvResponse
 * @property {T} response
 * @property {number} status
 */
