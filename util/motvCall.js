const axios = require('axios').default;
const sha1 = require("js-sha1");

const getReport = async (url, body, header) => {
    // console.table(body)
    try {
        const {data, status} = await axios({
            method: 'post',
            url: url,
            data: JSON.parse(body),
            headers: header,
        });
        if(status != 200){
            return 0;
        }        
        return data;        
    } catch (error) {
        console.log('aqui')
        console.log(error);
        return 0;
    }    
}

const getToken = (login, secret) => {
    const timestamp = Math.round((new Date()).getTime() / 1000);
    return login +':'+timestamp+':'+sha1(timestamp+login+secret);
}

module.exports = {
    getReport,
    getToken
};