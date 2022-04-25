const SMSURL = 'https://sms.yplay.com.br';
const MWURL = 'https://mw.yplay.com.br';
const REPORT = '/api/report/reportSelection';

const smsBody = (id) => `{
    "data":{
        "reports_id": ${id}
    }
}`;

const mwBody = (id) => `{
    "data":{
        "reportsId": ${id}
    }
}`;

const smsHeader = (token) => {
    return {'Authorization' : token}
}

const mwHeader = (token) => {
    return {'Authorization-user' : token}
}

module.exports = {
    SMSURL,
    MWURL,
    REPORT,
    smsBody,
    mwBody,
    mwHeader,
    smsHeader,
}