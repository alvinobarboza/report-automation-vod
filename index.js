const {
    getAllCustomersYplay,
    getAllCustomersYbox,
    getAllCustomersYboxActive,
    getAllCustomersYboxActiveTIP,
} = require('./util/reports');
const {
    validateTCMCustomers,
    validateYBOXVOD,
    validateYboxTip,
} = require('./util/validation');
const { writeToFile } = require('./util/writeToFile');

Promise.all([
    getAllCustomersYplay(),
    getAllCustomersYbox(),
    getAllCustomersYboxActive(),
    getAllCustomersYboxActiveTIP(),
])
    .then((data) => {
        const allCustomersYplay = data[0].response.rows;
        const allCustomersYbox = data[1].response.rows;
        const allcustomersYboxActive = data[2].response.rows;
        const allCustomersYboxTIP = data[3].response.rows;
        const valideTip = validateYboxTip(allCustomersYboxTIP);

        const valideYbox = validateYBOXVOD(
            allCustomersYbox,
            allcustomersYboxActive
        );

        const valideTCM = validateTCMCustomers(allCustomersYplay);

        writeToFile({ valideYbox, valideTCM, valideTip });
    })
    .catch((e) => console.log(e));
