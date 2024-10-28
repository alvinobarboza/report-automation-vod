const axios = require('axios').default;
const sha1 = require('js-sha1');

/**
 * @param {string} url
 * @param {string} body
 * @param {{'Authorization-user':string}|{Authorization:string}} header
 * @returns
 */
const getReport = async (url, body, header) => {
    // console.log(url, body, header);
    try {
        const { data, status } = await axios({
            method: 'post',
            url: url,
            data: JSON.parse(body),
            headers: header,
        });
        if (status != 200) {
            return 0;
        }
        return data;
    } catch (error) {
        console.log('Error motv: getReport');
        console.log(error);
        return 0;
    }
};

/**
 * @param {string} login
 * @param {string} secret
 * @returns
 */
const getToken = (login, secret) => {
    const timestamp = Math.round(new Date().getTime() / 1000);
    return login + ':' + timestamp + ':' + sha1(timestamp + login + secret);
};

module.exports = {
    getReport,
    getToken,
};
