const SMSURLYPLAY = 'https://sms.yplay.com.br';
const MWURLYPLAY = 'https://mw.yplay.com.br';
const SMSURLTIP = 'https://sms.tvnsul.com.br';
const MWURLTIP = 'https://mw.tvnsul.com.br';
const SMSURLSUMICITY = 'https://sms.sumicity.net.br';
const MWURLSUMICITY = 'https://mw.sumicity.net.br';
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
    return { Authorization: token };
};

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
    smsBody,
    mwBody,
    mwHeader,
    smsHeader,
};
