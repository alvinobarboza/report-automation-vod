const { getCurrentDateForScheduleHistory } = require('./date');

const SMSURLYPLAY = 'https://sms.yplay.com.br';
const MWURLYPLAY = 'https://mw.yplay.com.br';
const SMSURLTIP = 'https://sms.tvnsul.com.br';
const MWURLTIP = 'https://mw.tvnsul.com.br';
const SMSURLSUMICITY = 'https://sms.sumicity.net.br';
const MWURLSUMICITY = 'https://mw.sumicity.net.br';
const REPORT = '/api/report/reportSelection';
const REPORT_SCHEDULE = '/api/reportSchedule/downloadReport';
const REPORT_SCHEDULE_HISTORY = '/api/reportSchedule/historySelection';

/**
 * @param {number} id
 * @returns {string}
 */
const smsBody = (id) => `{
    "data":{
        "reports_id": ${id}
    }
}`;

/**
 * @param {number} id
 * @returns {string}
 */
const mwBody = (id) => `{
    "data":{
        "reportsId": ${id}
    }
}`;

/**
 * @param {number} id
 * @returns {string}
 */
const lastestEntryFromScheduleBody = (id) => {
    return `{
        "data": {
            "where": [
                {
                    "column": "report_schedules_attachements_report_schedules_id",
                    "type": "=",
                    "valueType": "%i",
                    "value": ${id}
                },
                {
                    "column": "report_schedules_attachements_generated",
                    "type": ">=",
                    "valueType": "%t",
                    "value": "${getCurrentDateForScheduleHistory()}"
                }
            ]
        }
    }
    `;
};

/**
 * @param {number} id
 * @returns {string}
 */
const downloadReportBody = (id) =>
    `{ "data": { "reportSchedulesAttachementsId": ${id} } }`;

/**
 * @param {string} token
 * @returns {{Authorization:string}}
 */
const smsHeader = (token) => {
    return { Authorization: token };
};

/**
 * @param {string} token
 * @returns {{'Authorization-user':string}}
 */
const mwHeader = (token) => {
    return { 'Authorization-user': token };
};

module.exports = {
    SMSURLYPLAY,
    MWURLYPLAY,
    SMSURLTIP,
    MWURLTIP,
    SMSURLSUMICITY,
    MWURLSUMICITY,
    REPORT,
    REPORT_SCHEDULE,
    REPORT_SCHEDULE_HISTORY,
    smsBody,
    mwBody,
    downloadReportBody,
    lastestEntryFromScheduleBody,
    mwHeader,
    smsHeader,
};
