const excel = require('excel4node');
const path = require('path');

const {
    getCurrentMonth,
    getCurrentYear,
    getLastMonthYearShort,
    getCurrentMonthLong,
} = require('./date');
const sendEmail = require('./email/mailSender');
const { headerStyleTCM, dataStyleTCM } = require('./excelStyles');

const FILENAMES = [];

function insertFilenameToFilenames(file) {
    FILENAMES.push(file);
}

const writeToFile = (data) => {
    const { dataTCM } = data;

    writeTCMVODReport(dataTCM);

    sendEmail(FILENAMES).catch(e => console.log(e));
}

const writeTCMVODReport = (dataTCM) => {
    // console.log(dataTCM);
    const columnWidth = [12, 10, 30, 16];
    const headerMain = 'ASSINANTES ATIVOS COM O PACOTE TCM VOD';
    const headerCustomers = ['ID', 'Vendor', 'Login', 'Package'];
    const headerTotal = [
        { column1: 'Ref.:', column2: getLastMonthYearShort() },
        { column1: 'Quantidade de Assinantes:', column2: `${dataTCM.total}` },
    ]
    const workBook = new excel.Workbook();
    const workSheet = workBook.addWorksheet(getCurrentMonthLong());

    columnWidth.forEach((width, index) => workSheet.column(index + 1).setWidth(width));
    workSheet.cell(1, 1, 1, 4, true).string(headerMain).style({ ...headerStyleTCM, font: { ...headerStyleTCM.font, size: 16 } });
    headerTotal.forEach((header, index) => {
        workSheet.cell(2 + index, 1, 2 + index, 3, true).string(header.column1).style({ ...headerStyleTCM, alignment: { horizontal: ['right'] } });
        workSheet.cell(2 + index, 4).string(header.column2).style({ alignment: { horizontal: ['center'] } });
    });
    headerCustomers.forEach((header, index) => workSheet.cell(5, index + 1).string(header).style(headerStyleTCM));

    dataTCM.customers.forEach((customer, index) => {
        workSheet.cell(6 + index, 1).number(customer.idmw).style(index % 2 === 0 ? dataStyleTCM : { alignment: { horizontal: ['center'] } });
        workSheet.cell(6 + index, 2).string(customer.vendor).style(index % 2 === 0 ? dataStyleTCM : { alignment: { horizontal: ['center'] } });
        workSheet.cell(6 + index, 3).string(customer.login).style(index % 2 === 0 ? dataStyleTCM : { alignment: { horizontal: ['center'] } });
        workSheet.cell(6 + index, 4).string('TCM VOD').style(index % 2 === 0 ? dataStyleTCM : { alignment: { horizontal: ['center'] } });
    });

    const file = {
        filename: `Assinantes ativos com pacote TCM VOD - ${getCurrentMonth()}_${getCurrentYear()}.xlsx`,
        path: path.join(__dirname, '..', 'output', `Assinantes ativos com pacote TCM VOD - ${getCurrentMonth()}_${getCurrentYear()}.xlsx`)
    }
    insertFilenameToFilenames(file);
    workBook.write(file.path);
}

module.exports = {
    writeToFile
}