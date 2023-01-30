const { getAllCustomersYplay, getAllCustomersYbox, getAllCustomersYboxActive } = require("./util/reports");
const { validateTCMCustomers, validateYBOXVOD } = require("./util/validation");
const { writeToFile } = require("./util/writeToFile");

Promise.all(
    [
        getAllCustomersYplay(),
        getAllCustomersYbox(),
        getAllCustomersYboxActive()
    ]
).then(data => {
    const allCustomersYplay = data[0].response.rows;
    const allCustomersYbox = data[1].response.rows;
    const allcustomersYboxActive = data[2].response.rows;

    const valideYbox = validateYBOXVOD(allCustomersYbox, allcustomersYboxActive);

    const valideTCM = validateTCMCustomers(allCustomersYplay);

    writeToFile({ valideYbox, valideTCM });
}).catch(e => console.log(e));
