const { getAllCustomersYplay } = require("./util/reports");
const { validateTCMCustomers } = require("./util/validation");
const { writeToFile } = require("./util/writeToFile");

Promise.all(
    [
        getAllCustomersYplay(),
    ]
).then(data => {
    const allCustomersYplay = data[0].response.rows;

    const dataTCM = validateTCMCustomers(allCustomersYplay);

    writeToFile({ dataTCM });

}).catch(e => console.log(e));
