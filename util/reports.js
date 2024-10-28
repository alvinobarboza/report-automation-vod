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

const GETALLCUSTOMERSYPLAY = 131;
const GETALLCUSTOMERSYBOX = 132;
const GETALLCUSTOMERSYBOXACTIVE = 106;
const GETALLVODERNANY = 9;

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
 * @returns {Promise<MotvResponse<RowsReport>>}
 */
const getLastestEntryFromSchedule = async () =>
    getReport(
        MWURLYPLAY + REPORT_SCHEDULE_HISTORY,
        lastestEntryFromScheduleBody(GETALLVODERNANY),
        mwHeader(getToken(LOGIN_MW_YPLAY, SECRET_MW_YPLAY))
    );

/**@param {number} id @returns {Promise<MotvResponse<ReportFile>>} */
const downloadReport = async (id) =>
    getReport(
        MWURLYPLAY + REPORT_SCHEDULE,
        downloadReportBody(id),
        mwHeader(getToken(LOGIN_MW_YPLAY, SECRET_MW_YPLAY))
    );

module.exports = {
    getAllCustomersYplay,
    getAllCustomersYbox,
    getAllCustomersYboxActive,
    getAllCustomersYboxActiveTIP,
    getLastestEntryFromSchedule,
    downloadReport,
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
