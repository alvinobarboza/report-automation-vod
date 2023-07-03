const excel = require('excel4node');
const path = require('path');
const fs = require('fs');

const {
    getCurrentMonth,
    getCurrentYear,
    getLastMonthYearShort,
    getCurrentMonthLong,
    getLastMonthYearNumeric,
    getCurrentDate,
} = require('./date');
const sendEmail = require('./email/mailSender');
const {
    headerStyleTCM,
    dataStyleTCM,
    headerStyle,
    dataStyle1,
    dataStyle2,
    dataStyle3,
} = require('./excelStyles');

const FILENAMES = [];
const PATHTOFOLDER = path.join(
    __dirname,
    '..',
    'output',
    `${getCurrentMonth()}${getCurrentYear()}_${getCurrentDate()}`
);

const writeToFile = (data) => {
    const { valideYbox, valideTCM, valideTip } = data;

    // Create folder for out files
    createFolderForFile();

    // Save raw data for future check;
    saveRawData(valideYbox, valideTCM, valideTip);

    // TVN
    writeYboxTip(valideTip);

    // TCM
    writeTCMVODReport(valideTCM);

    // YBOX Internal
    writeYboxReport(valideYbox);
    // 1 Films
    write1FilmsReport(valideYbox);
    // A2
    writeA2Report(valideYbox);

    sendEmail(FILENAMES).catch((e) => console.log(e));
};

function saveRawData(ybox, tcm, tip) {
    fs.writeFileSync(
        getPath(
            `ybox_${getCurrentMonth()}${getCurrentYear()}_${getCurrentDate()}.json`
        ),
        JSON.stringify(ybox, null, 2),
        'utf-8'
    );
    fs.writeFileSync(
        getPath(
            `tcm_${getCurrentMonth()}${getCurrentYear()}_${getCurrentDate()}.json`
        ),
        JSON.stringify(tcm, null, 2),
        'utf-8'
    );
    fs.writeFileSync(
        getPath(
            `tip_${getCurrentMonth()}${getCurrentYear()}_${getCurrentDate()}.json`
        ),
        JSON.stringify(tip, null, 2),
        'utf-8'
    );
}

function getPath(filename) {
    return path.join(PATHTOFOLDER, filename);
}

function insertFilenameToFilenames(filename) {
    FILENAMES.push({
        filename: path.basename(filename),
        path: filename,
    });
}

function createFolderForFile() {
    try {
        if (!fs.existsSync(PATHTOFOLDER)) {
            fs.mkdirSync(PATHTOFOLDER);
        }
    } catch (err) {
        console.error(err);
    }
}

const writeTCMVODReport = (dataTCM) => {
    // console.log(dataTCM);
    const columnWidth = [12, 10, 30, 16];
    const headerMain = 'ASSINANTES ATIVOS COM O PACOTE TCM VOD';
    const headerCustomers = ['ID', 'Vendor', 'Login', 'Package'];
    const headerTotal = [
        { column1: 'Ref.:', column2: getLastMonthYearShort() },
        { column1: 'Quantidade de Assinantes:', column2: `${dataTCM.total}` },
    ];
    const workBook = new excel.Workbook();
    const workSheet = workBook.addWorksheet(getCurrentMonthLong());

    columnWidth.forEach((width, index) =>
        workSheet.column(index + 1).setWidth(width)
    );
    workSheet
        .cell(1, 1, 1, 4, true)
        .string(headerMain)
        .style({
            ...headerStyleTCM,
            font: { ...headerStyleTCM.font, size: 16 },
        });
    headerTotal.forEach((header, index) => {
        workSheet
            .cell(2 + index, 1, 2 + index, 3, true)
            .string(header.column1)
            .style({ ...headerStyleTCM, alignment: { horizontal: ['right'] } });
        workSheet
            .cell(2 + index, 4)
            .string(header.column2)
            .style({ alignment: { horizontal: ['center'] } });
    });
    headerCustomers.forEach((header, index) =>
        workSheet
            .cell(5, index + 1)
            .string(header)
            .style(headerStyleTCM)
    );

    dataTCM.customers.forEach((customer, index) => {
        workSheet
            .cell(6 + index, 1)
            .number(customer.idmw)
            .style(
                index % 2 === 0
                    ? dataStyleTCM
                    : { alignment: { horizontal: ['center'] } }
            );
        workSheet
            .cell(6 + index, 2)
            .string(customer.vendor)
            .style(
                index % 2 === 0
                    ? dataStyleTCM
                    : { alignment: { horizontal: ['center'] } }
            );
        workSheet
            .cell(6 + index, 3)
            .string(customer.login)
            .style(
                index % 2 === 0
                    ? dataStyleTCM
                    : { alignment: { horizontal: ['center'] } }
            );
        workSheet
            .cell(6 + index, 4)
            .string('TCM VOD')
            .style(
                index % 2 === 0
                    ? dataStyleTCM
                    : { alignment: { horizontal: ['center'] } }
            );
    });

    const file = getPath(
        `Assinantes ativos com pacote TCM VOD - ${getCurrentMonth()}_${getCurrentYear()}.xlsx`
    );
    insertFilenameToFilenames(file);
    workBook.write(file);
};

const writeYboxReport = (data) => {
    const MAIN_HEADER = 'YOUCAST';
    let MAIN_HEADER_ROWS_COUNT = 7;
    const SECONDARY_HEADER = ['Provedores', 'QTD clientes cadastrados'];
    const workBook = new excel.Workbook();
    const workSheet = workBook.addWorksheet(getLastMonthYearNumeric());

    const countSubscribedCustomers = data.reduce((accumulator, dealer) => {
        if (dealer.dealertoreport) {
            accumulator += dealer.group.length;
        }
        return accumulator;
    }, 0);

    workSheet.column(1).setWidth(50);
    workSheet.column(2).setWidth(22);
    workSheet.cell(1, 1, 1, 2, true).string(MAIN_HEADER).style(headerStyle);
    workSheet.cell(3, 1).string('Período').style(dataStyle2);
    workSheet.cell(3, 2).string(getLastMonthYearShort()).style(dataStyle2);

    workSheet
        .cell(5, 1)
        .string('QTD Assinantes com Acesso ao pacote Ybox VOD')
        .style(dataStyle1);
    workSheet.cell(5, 2).number(countSubscribedCustomers).style(dataStyle2);

    for (let i = 2; i <= MAIN_HEADER_ROWS_COUNT; i++) {
        if (i % 2 === 0) {
            workSheet.row(i).setHeight(8);
            continue;
        }
    }

    SECONDARY_HEADER.forEach((value, index) =>
        workSheet
            .cell(MAIN_HEADER_ROWS_COUNT, index + 1)
            .string(value)
            .style(headerStyle)
    );

    let subscribedCountTotal = 0;

    data.forEach((dealer) => {
        if (dealer.dealertoreport) {
            MAIN_HEADER_ROWS_COUNT++;

            workSheet
                .cell(MAIN_HEADER_ROWS_COUNT, 1)
                .string(dealer.dealer.toUpperCase())
                .style(dataStyle3);
            workSheet
                .cell(MAIN_HEADER_ROWS_COUNT, 2)
                .number(dealer.group.length)
                .style(dataStyle2);

            subscribedCountTotal += dealer.group.length;
        }
    });
    MAIN_HEADER_ROWS_COUNT++;
    workSheet
        .cell(MAIN_HEADER_ROWS_COUNT, 2)
        .number(subscribedCountTotal)
        .style({ ...dataStyle2, font: { bold: true } });

    const file = getPath(
        `YBOX VOD - ${getCurrentMonth()}_${getCurrentYear()}.xlsx`
    );
    insertFilenameToFilenames(file);
    workBook.write(file);
};

const write1FilmsReport = (data) => {
    const MAIN_HEADER = 'YOUCAST';
    let MAIN_HEADER_ROWS_COUNT = 7;
    const SECONDARY_HEADER = ['Provedores', 'QTD clientes ativos'];
    const workBook = new excel.Workbook();
    const workSheet = workBook.addWorksheet(getLastMonthYearNumeric());

    const countActiveCustomers = data.reduce((accDealer, dealer) => {
        if (dealer.dealertoreport) {
            accDealer += dealer.group.reduce((accCustomer, customer) => {
                if (customer.status && customer.customertoreport) {
                    accCustomer += 1;
                }
                return accCustomer;
            }, 0);
        }
        return accDealer;
    }, 0);

    workSheet.column(1).setWidth(50);
    workSheet.column(2).setWidth(22);
    workSheet.cell(1, 1, 1, 2, true).string(MAIN_HEADER).style(headerStyle);
    workSheet.cell(3, 1).string('Período').style(dataStyle1);
    workSheet.cell(3, 2).string(getLastMonthYearShort()).style(dataStyle2);

    workSheet
        .cell(5, 1)
        .string('QTD assinantes com Acesso ao pacote 1 Films')
        .style(dataStyle1);
    workSheet.cell(5, 2).number(countActiveCustomers).style(dataStyle2);

    for (let i = 2; i <= MAIN_HEADER_ROWS_COUNT; i++) {
        if (i % 2 === 0) {
            workSheet.row(i).setHeight(8);
            continue;
        }
    }

    SECONDARY_HEADER.forEach((value, index) =>
        workSheet
            .cell(MAIN_HEADER_ROWS_COUNT, index + 1)
            .string(value)
            .style(headerStyle)
    );

    let activeCountTotal = 0;

    data.forEach((dealer) => {
        if (dealer.dealertoreport) {
            let countCustomerAciveDealer = dealer.group.reduce(
                (accCustomer, customer) => {
                    if (customer.status && customer.customertoreport) {
                        accCustomer += 1;
                    }
                    return accCustomer;
                },
                0
            );

            if (countCustomerAciveDealer > 0) {
                MAIN_HEADER_ROWS_COUNT++;
                workSheet
                    .cell(MAIN_HEADER_ROWS_COUNT, 1)
                    .string(dealer.dealer.toUpperCase())
                    .style(dataStyle3);
                workSheet
                    .cell(MAIN_HEADER_ROWS_COUNT, 2)
                    .number(countCustomerAciveDealer)
                    .style(dataStyle2);
                activeCountTotal += countCustomerAciveDealer;
            }
        }
    });
    MAIN_HEADER_ROWS_COUNT++;
    workSheet
        .cell(MAIN_HEADER_ROWS_COUNT, 2)
        .number(activeCountTotal)
        .style({ ...dataStyle2, font: { bold: true } });

    const file = getPath(
        `1 Films - ${getCurrentMonth()}_${getCurrentYear()}.xlsx`
    );
    insertFilenameToFilenames(file);
    workBook.write(file);
};

const writeA2Report = (data) => {
    const MAIN_HEADER = 'YOUCAST';
    let MAIN_HEADER_ROWS_COUNT = 7;
    const SECONDARY_HEADER = ['Provedores', 'QTD clientes ativos'];
    const workBook = new excel.Workbook();
    const workSheet = workBook.addWorksheet(getLastMonthYearNumeric());

    const countActiveCustomers = data.reduce((accDealer, dealer) => {
        if (dealer.dealertoreport) {
            accDealer += dealer.group.reduce((accCustomer, customer) => {
                if (customer.status && customer.customertoreport) {
                    accCustomer += 1;
                }
                return accCustomer;
            }, 0);
        }
        return accDealer;
    }, 0);

    workSheet.column(1).setWidth(50);
    workSheet.column(2).setWidth(22);
    workSheet.cell(1, 1, 1, 2, true).string(MAIN_HEADER).style(headerStyle);
    workSheet.cell(3, 1).string('Período').style(dataStyle1);
    workSheet.cell(3, 2).string(getLastMonthYearShort()).style(dataStyle2);

    workSheet
        .cell(5, 1)
        .string('QTD assinantes com Acesso ao pacote A2')
        .style(dataStyle1);
    workSheet.cell(5, 2).number(countActiveCustomers).style(dataStyle2);

    for (let i = 2; i <= MAIN_HEADER_ROWS_COUNT; i++) {
        if (i % 2 === 0) {
            workSheet.row(i).setHeight(8);
            continue;
        }
    }

    SECONDARY_HEADER.forEach((value, index) =>
        workSheet
            .cell(MAIN_HEADER_ROWS_COUNT, index + 1)
            .string(value)
            .style(headerStyle)
    );

    let activeCountTotal = 0;

    data.forEach((dealer) => {
        if (dealer.dealertoreport) {
            let countCustomerAciveDealer = dealer.group.reduce(
                (accCustomer, customer) => {
                    if (customer.status && customer.customertoreport) {
                        accCustomer += 1;
                    }
                    return accCustomer;
                },
                0
            );

            if (countCustomerAciveDealer > 0) {
                MAIN_HEADER_ROWS_COUNT++;
                workSheet
                    .cell(MAIN_HEADER_ROWS_COUNT, 1)
                    .string(dealer.dealer.toUpperCase())
                    .style(dataStyle3);
                workSheet
                    .cell(MAIN_HEADER_ROWS_COUNT, 2)
                    .number(countCustomerAciveDealer)
                    .style(dataStyle2);
                activeCountTotal += countCustomerAciveDealer;
            }
        }
    });
    MAIN_HEADER_ROWS_COUNT++;
    workSheet
        .cell(MAIN_HEADER_ROWS_COUNT, 2)
        .number(activeCountTotal)
        .style({ ...dataStyle2, font: { bold: true } });

    const file = getPath(`A2 - ${getCurrentMonth()}_${getCurrentYear()}.xlsx`);
    insertFilenameToFilenames(file);
    workBook.write(file);
};

const writeYboxTip = (data) => {
    const MAIN_HEADER = 'TVN';
    let MAIN_HEADER_ROWS_COUNT = 7;
    const SECONDARY_HEADER = ['Vendors', 'QTD clientes cadastrados'];
    const workBook = new excel.Workbook();
    const workSheet = workBook.addWorksheet(getLastMonthYearNumeric());

    const countSubscribedCustomers = data.reduce((accumulator, vendor) => {
        accumulator += vendor.total;
        return accumulator;
    }, 0);

    workSheet.column(1).setWidth(50);
    workSheet.column(2).setWidth(22);
    workSheet.cell(1, 1, 1, 2, true).string(MAIN_HEADER).style(headerStyle);
    workSheet.cell(3, 1).string('Período').style(dataStyle2);
    workSheet.cell(3, 2).string(getLastMonthYearShort()).style(dataStyle2);

    workSheet
        .cell(5, 1)
        .string('QTD Assinantes com Acesso ao pacote Ybox VOD')
        .style(dataStyle1);
    workSheet.cell(5, 2).number(countSubscribedCustomers).style(dataStyle2);

    for (let i = 2; i <= MAIN_HEADER_ROWS_COUNT; i++) {
        if (i % 2 === 0) {
            workSheet.row(i).setHeight(8);
            continue;
        }
    }

    SECONDARY_HEADER.forEach((value, index) =>
        workSheet
            .cell(MAIN_HEADER_ROWS_COUNT, index + 1)
            .string(value)
            .style(headerStyle)
    );

    let subscribedCountTotal = 0;

    data.forEach((vendor) => {
        MAIN_HEADER_ROWS_COUNT++;

        workSheet
            .cell(MAIN_HEADER_ROWS_COUNT, 1)
            .string(vendor.vendor.toUpperCase())
            .style(dataStyle3);
        workSheet
            .cell(MAIN_HEADER_ROWS_COUNT, 2)
            .number(vendor.total)
            .style(dataStyle2);

        subscribedCountTotal += vendor.total;
    });
    MAIN_HEADER_ROWS_COUNT++;
    workSheet
        .cell(MAIN_HEADER_ROWS_COUNT, 2)
        .number(subscribedCountTotal)
        .style({ ...dataStyle2, font: { bold: true } });

    const file = getPath(
        `YBOX VOD TVN - ${getCurrentMonth()}_${getCurrentYear()}.xlsx`
    );
    insertFilenameToFilenames(file);
    workBook.write(file);
};

module.exports = {
    writeToFile,
};
