const excel = require('excel4node');
const path = require('path');

const {
    getCurrentMonth,
    getCurrentYear,
    getLastMonthYearShort,
    getCurrentMonthLong,
    getLastMonthYearNumeric,
} = require('./date');
const sendEmail = require('./email/mailSender');
const { headerStyleTCM, dataStyleTCM, headerStyle, dataStyle1, dataStyle2, dataStyle3 } = require('./excelStyles');

const FILENAMES = [];

function insertFilenameToFilenames(file) {
    FILENAMES.push(file);
}

const writeToFile = (data) => {
    const { valideYbox, dataTCM } = data;

    // TCM
    writeTCMVODReport(dataTCM);

    // YBOX
    writeYboxReport(valideYbox);

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

const writeYboxReport = (data) => {
    const MAIN_HEADER = 'YOUCAST';
    let MAIN_HEADER_ROWS_COUNT = 9;
    const SECONDARY_HEADER = ['Título', 'Formato', 'Acessos'];
    const workBook = new excel.Workbook();
    const workSheet = workBook.addWorksheet(getLastMonthYearNumeric());

    workSheet.column(1).setWidth(50);
    workSheet.cell(1, 1, 1, 3, true).string(MAIN_HEADER).style(headerStyle);
    workSheet.cell(3, 2).string('Período').style(dataStyle2);
    workSheet.cell(3, 3).string(getLastMonthYearShort()).style(dataStyle2);

    workSheet.cell(5, 1).string('Assinantes Ativos com Acesso ao YBOX VOD/SVOD Nacional').style(dataStyle1);
    workSheet.cell(5, 2).number(data.activecustomers.length).style(dataStyle2);
    workSheet.cell(7, 1).string('QTD assinantes ativos que assistiram o conteúdo').style(dataStyle1);
    workSheet.cell(7, 2).number(data.watchedcustomers.length).style(dataStyle2);

    for (let i = 2; i <= MAIN_HEADER_ROWS_COUNT; i++) {
        if (i % 2 === 0) {
            workSheet.row(i).setHeight(8);
            continue;
        }
    }

    SECONDARY_HEADER.forEach((value, index) => workSheet.cell(MAIN_HEADER_ROWS_COUNT, index + 1).string(value).style(headerStyle));

    let vodcount = 0;
    data.vods.forEach((vod, index) => {
        MAIN_HEADER_ROWS_COUNT++;
        workSheet.cell(MAIN_HEADER_ROWS_COUNT, 1).string(vod.vod).style(dataStyle3);
        workSheet.cell(MAIN_HEADER_ROWS_COUNT, 2).string('YBOX').style(dataStyle2);
        workSheet.cell(MAIN_HEADER_ROWS_COUNT, 3).number(vod.group.length).style(dataStyle2);
        vodcount += vod.group.length;
    });
    MAIN_HEADER_ROWS_COUNT++;
    workSheet.cell(MAIN_HEADER_ROWS_COUNT, 3).number(vodcount).style({ ...dataStyle2, font: { bold: true } });

    const file = {
        filename: `YBOX VOD - ${getCurrentMonth()}_${getCurrentYear()}.xlsx`,
        path: path.join(__dirname, '..', 'output', `YBOX VOD - ${getCurrentMonth()}_${getCurrentYear()}.xlsx`)
    }
    insertFilenameToFilenames(file);
    workBook.write(file.path);
}

module.exports = {
    writeToFile
}