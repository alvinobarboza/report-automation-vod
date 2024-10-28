const CSVReader = require('./csvReader');
const type = require('./reports');
/**
 * @param {()=>Promise<type.MotvResponse<type.RowsReport>>} scheduleHistory
 * @param {(id: number)=> Promise<type.MotvResponse<type.ReportFile>>} download
 * @returns {Promise<string[][]>}
 */
const downloadCSVReportFromSchedule = async (scheduleHistory, download) => {
    const history = await scheduleHistory();
    const latest = getLastestEntry(history);

    const fileData = await download(latest.report_schedules_attachements_id);
    const stringFileData = convertBase64ToString(fileData.response.content);

    const csvReader = new CSVReader(stringFileData);
    return csvReader.getArrayData();
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
