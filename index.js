const { getAllCustomersYplay, getAllCustomersYbox, getAllVodsWatchedYbox } = require("./util/reports");
const { validateTCMCustomers, validateYBOXVOD } = require("./util/validation");
const { writeToFile } = require("./util/writeToFile");

Promise.all(
    [
        getAllCustomersYplay(),
        getAllCustomersYbox(),
        getAllVodsWatchedYbox()
    ]
).then(data => {
    const allCustomersYplay = data[0].response.rows;
    const allCustomersYbox = data[1].response.rows;
    const allVodsWatchedYbox = data[2].response.rows;

    const valideYbox = validateYBOXVOD(allCustomersYbox, allVodsWatchedYbox);

    const dataTCM = validateTCMCustomers(allCustomersYplay);

    writeToFile({ valideYbox, dataTCM });
}).catch(e => console.log(e));
