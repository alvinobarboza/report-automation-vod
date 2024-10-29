const excel = require('excel4node');
const {
    dataStyle2,
    headerStyle,
    dataStyle3,
    dataStyle1,
} = require('./excelStyles');
const { getCurrentMonth, getCurrentYear } = require('./date');
const types = require('./validation.ernani');

/**
 * @param {types.Dealer[]} data
 * @param {(path: string)=>void} insertFilenameToFilenames
 * @param {(filename: string)=>string} getPath
 */
const writeErnaniReport = (data, insertFilenameToFilenames, getPath) => {
    const MAIN_HEADER = [
        'PLAY',
        'PROVEDOR (NOME FANTASIA)',
        'RAZAO SOCIAL',
        'CIDADE',
        'UF',
        'CNPJ',
        'Cadastrados Atual',
        'Logados ultimos 30 dias',
    ];
    const workBook = new excel.Workbook();
    const workSheet = workBook.addWorksheet('MAIN');

    let ROWS_COUNT = 2;

    const widths = columnWidthCounter(data);
    widths.forEach((d, i) => {
        workSheet.column(i + 2).setWidth(d);
    });

    MAIN_HEADER.forEach((value, index) => {
        workSheet
            .cell(ROWS_COUNT, index + 2)
            .string(value)
            .style(headerStyle);
    });

    data.forEach((dealer) => {
        ROWS_COUNT++;
        workSheet
            .cell(ROWS_COUNT, 2)
            .string(dealer.name.toUpperCase())
            .style(dataStyle3);
        workSheet
            .cell(ROWS_COUNT, 3)
            .string(
                dealer.nomefantasia ? dealer.nomefantasia.toUpperCase() : 'N/D'
            )
            .style(dataStyle3);
        workSheet
            .cell(ROWS_COUNT, 4)
            .string(
                dealer.razaosocial ? dealer.razaosocial.toUpperCase() : 'N/D'
            )
            .style(dataStyle3);
        workSheet
            .cell(ROWS_COUNT, 5)
            .string(dealer.cidade ? dealer.cidade.toUpperCase() : 'N/D')
            .style(dataStyle2);
        workSheet
            .cell(ROWS_COUNT, 6)
            .string(dealer.uf ? dealer.uf.toUpperCase() : 'N/D')
            .style(dataStyle2);
        workSheet
            .cell(ROWS_COUNT, 7)
            .string(dealer.cnpj ? dealer.cnpj.toUpperCase() : 'N/D')
            .style(dataStyle2);
        workSheet
            .cell(ROWS_COUNT, 8)
            .number(dealer.customers.length)
            .style(dataStyle2);
        workSheet
            .cell(ROWS_COUNT, 9)
            .number(dealer.lastMonthCount)
            .style(dataStyle2);
    });

    const file = getPath(
        `Ernani - ${getCurrentMonth()}_${getCurrentYear()}.xlsx`
    );
    insertFilenameToFilenames(file);
    workBook.write(file);
};

/**
 * @param {types.Dealer[]} dealers
 * @returns {number[]}
 */
function columnWidthCounter(dealers) {
    const widths = [10, 10, 10, 10, 10, 10, 20, 20];
    const keys = [
        'name',
        'nomefantasia',
        'razaosocial',
        'cidade',
        'uf',
        'cnpj',
    ];
    for (const dealer of dealers) {
        keys.forEach((key, i) => {
            widths[i] =
                widths[i] > dealer[key].length ? widths[i] : dealer[key].length;
        });
    }
    return widths;
}

module.exports = {
    writeErnaniReport,
};
