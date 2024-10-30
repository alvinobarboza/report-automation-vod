const CSVReader = require('./csvReader');
const type = require('./reports');
/**
 * @param {(id: number)=>Promise<type.MotvResponse<type.RowsReport>>} scheduleHistory
 * @param {(id: number)=> Promise<type.MotvResponse<type.ReportFile>>} download
 * @param {number} id
 * @param {string} platformUrl
 * @param {string} login
 * @param {string} secret
 * @returns {Promise<string[][]>}
 */
const downloadCSVReportFromSchedule = async (
    scheduleHistory,
    download,
    id,
    platformUrl,
    login,
    secret
) => {
    const history = await scheduleHistory(id, platformUrl, login, secret);
    const latest = getLastestEntry(history);

    if (!latest?.report_schedules_attachements_id) {
        return [[]];
    }

    const fileData = await download(
        latest.report_schedules_attachements_id,
        platformUrl,
        login,
        secret
    );
    try {
        const stringFileData = convertBase64ToString(fileData.response.content);
        const csvReader = new CSVReader(stringFileData);
        return csvReader.getArrayData();
    } catch (er) {
        console.log(fileData, history.response);
        throw er;
    }
};

/**
 * @param {type.MotvResponse<type.RowsReport>} history
 * @returns {type.LastestEntryFromSchedule}
 */
function getLastestEntry(history) {
    /**@type {type.LastestEntryFromSchedule} */
    let latestEntry;
    /**@type {Date} */
    let latestDate;
    for (const entry of history.response.rows) {
        const tempDate = new Date(
            entry.report_schedules_attachements_generated
        );
        if (typeof latestDate === 'undefined') {
            latestDate = tempDate;
            latestEntry = entry;
        }

        if (latestDate < tempDate) {
            latestDate = tempDate;
            latestEntry = entry;
        }
    }

    return latestEntry;
}

function convertBase64ToString(data) {
    return Buffer.from(data, 'base64').toString('utf8');
}

module.exports = {
    downloadCSVReportFromSchedule,
};
