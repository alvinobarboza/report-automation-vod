const { MWURLYPLAY, MWURLTIP, MWURLUNIFIQUE } = require('./util/constant');
const {
    downloadCSVReportFromSchedule,
} = require('./util/downloadReportSchedule');
const {
    getAllCustomersYplay,
    getAllCustomersYbox,
    getAllCustomersYboxActive,
    getAllCustomersYboxActiveTIP,
    getLastestEntryFromSchedule,
    downloadReport,
    GETALLVODERNANY_YPLAY,
    GETALLVODERNANY_UNIFIQUE,
    LOGIN_MW_YPLAY,
    SECRET_MW_YPLAY,
    LOGIN_MW_UNIFIQUE,
    SECRET_MW_UNIFIQUE,
    GETALLVODERNANY_TIP,
    LOGIN_MW_TIP,
    SECRET_MW_TIP,
} = require('./util/reports');
const {
    validateTCMCustomers,
    validateYBOXVOD,
    validateYboxTip,
} = require('./util/validation');
const { validateErnaniReport } = require('./util/validation.ernani');
const { writeToFile } = require('./util/writeToFile');

Promise.all([
    getAllCustomersYplay(),
    getAllCustomersYbox(),
    getAllCustomersYboxActive(),
    getAllCustomersYboxActiveTIP(),
    downloadCSVReportFromSchedule(
        getLastestEntryFromSchedule,
        downloadReport,
        GETALLVODERNANY_YPLAY,
        MWURLYPLAY,
        LOGIN_MW_YPLAY,
        SECRET_MW_YPLAY
    ),
    downloadCSVReportFromSchedule(
        getLastestEntryFromSchedule,
        downloadReport,
        GETALLVODERNANY_UNIFIQUE,
        MWURLUNIFIQUE,
        LOGIN_MW_UNIFIQUE,
        SECRET_MW_UNIFIQUE
    ),
    downloadCSVReportFromSchedule(
        getLastestEntryFromSchedule,
        downloadReport,
        GETALLVODERNANY_TIP,
        MWURLTIP,
        LOGIN_MW_TIP,
        SECRET_MW_TIP
    ),
])
    .then((data) => {
        const allCustomersYplay = data[0].response.rows;
        const allCustomersYbox = data[1].response.rows;
        const allcustomersYboxActive = data[2].response.rows;
        const allCustomersYboxTIP = data[3].response.rows;
        const ernaniDataYplay = data[4];
        const ernaniDataUnifique = data[5];
        const ernaniDataTip = data[6];

        const ernaniValidated = validateErnaniReport(
            ernaniDataYplay,
            ernaniDataUnifique,
            ernaniDataTip
        );

        const valideTip = validateYboxTip(allCustomersYboxTIP);

        const valideYbox = validateYBOXVOD(
            allCustomersYbox,
            allcustomersYboxActive
        );

        const valideTCM = validateTCMCustomers(allCustomersYplay);

        writeToFile(valideYbox, valideTCM, valideTip, {
            ernaniValidated,
            ernaniData: { ernaniDataYplay, ernaniDataUnifique, ernaniDataTip },
        });
    })
    .catch((e) => console.log(e));
