const excel = require('excel4node');
const path = require('path');

const { 
    getLastMonthYearNumeric, 
    getCurrentMonth, 
    getCurrentYear, 
    getLastMonthYearShort 
} = require('./date');
const { 
    headerStyle,
    dataStyle1,
    dataStyle2,
    dataStyle3
} = require('./excelStyles');


const writeToFile = (data) => {
    const { 
        groupedStudios, 
        groupedNacionaisKids, 
        totalCustomersYplay, 
        totalStudioCustomersYplay, 
        totalNacionaisKidsCustomersYplay,        
        groupedMovies, 
        totalCustomersSumicity, 
        totalMoviesCustomersSumicity
    } = data;

    writeMoviesReport({groupedMovies, totalCustomersSumicity, totalMoviesCustomersSumicity});
    writeStudiosReport({groupedStudios, totalCustomersYplay, totalStudioCustomersYplay});
    writeNacionaisKidsReport({groupedNacionaisKids, totalCustomersYplay, totalNacionaisKidsCustomersYplay});
}

const writeStudiosReport = (data) => {
    const {
        groupedStudios,
        totalCustomersYplay,
        totalStudioCustomersYplay
    } = data;
    // console.table(groupedStudios);
    const MAIN_HEADER = 'YOUCAST';
    const MAIN_HEADER_ROWS_COUNT = 14;
    const SECONDARY_HEADER = ['Título','Formato', 'Acessos'];
    const workBook = new excel.Workbook();
    const workSheet = workBook.addWorksheet(getLastMonthYearNumeric());

    workSheet.column(1).setWidth(50);
    workSheet.cell(1,1,1,3,true).string(MAIN_HEADER).style(headerStyle);
    workSheet.cell(3,2).string('Período').style(dataStyle2);
    workSheet.cell(3,3).string(getLastMonthYearShort()).style(dataStyle2);
    workSheet.cell(5,1).string('Operadora').style(dataStyle1);
    workSheet.cell(5,2).string('YPlay').style(dataStyle2);
    workSheet.cell(7,1).string('Assinantes cadastrados na Plataforma').style(dataStyle1);
    workSheet.cell(7,2).number(totalCustomersYplay).style(dataStyle2);
    workSheet.cell(9,1).string('Assinantes Ativos com Acesso ao Pacote SVOD STUDIOS').style(dataStyle1);
    workSheet.cell(9,2).number(totalStudioCustomersYplay).style(dataStyle2);
    workSheet.cell(11,1).string('Tipo Distribuição').style(dataStyle1);
    workSheet.cell(11,2).string('SVOD').style(dataStyle2);
    workSheet.cell(13,1).string('Canal').style(dataStyle1);
    workSheet.cell(13,2).string('STUDIO').style(dataStyle2);

    for (let i = 2; i <= MAIN_HEADER_ROWS_COUNT; i++) {
        if(i % 2 === 0){
            workSheet.row(i).setHeight(8);
            continue;
        }
    }
    workSheet.row(MAIN_HEADER_ROWS_COUNT+1).filter();
    SECONDARY_HEADER.forEach((value, index) => workSheet.cell(MAIN_HEADER_ROWS_COUNT+1, index+1).string(value).style(headerStyle));

    groupedStudios.forEach((vod, index)=>{
        workSheet.cell((index+MAIN_HEADER_ROWS_COUNT+2),1).string(vod.vodname).style(dataStyle3);
        workSheet.cell((index+MAIN_HEADER_ROWS_COUNT+2),2).string('SVOD').style(dataStyle2);
        workSheet.cell((index+MAIN_HEADER_ROWS_COUNT+2),3).number(vod.amountwatched).style(dataStyle2);
    });
    const excelFormula = `=sum(C${MAIN_HEADER_ROWS_COUNT+2}:C${groupedStudios.length+MAIN_HEADER_ROWS_COUNT+1})`;
    workSheet.cell((groupedStudios.length+MAIN_HEADER_ROWS_COUNT+2),3).formula(excelFormula).style({...dataStyle2, font: { bold: true}});

    workBook.write(path.join(__dirname,'..','output',`YPlay_SVOD_Studio - ${getCurrentMonth()}_${getCurrentYear()}.xlsx`));
}

const writeNacionaisKidsReport = (data) => {
    const {
        groupedNacionaisKids,
        totalCustomersYplay,
        totalNacionaisKidsCustomersYplay
    } = data;
    // console.table(groupedStudios);
    const MAIN_HEADER = 'YOUCAST';
    const MAIN_HEADER_ROWS_COUNT = 14;
    const SECONDARY_HEADER = ['Título','Formato', 'Acessos'];
    const workBook = new excel.Workbook();
    const workSheet = workBook.addWorksheet(getLastMonthYearNumeric());

    workSheet.column(1).setWidth(50);
    workSheet.cell(1,1,1,3,true).string(MAIN_HEADER).style(headerStyle);
    workSheet.cell(3,2).string('Período').style(dataStyle2);
    workSheet.cell(3,3).string(getLastMonthYearShort()).style(dataStyle2);
    workSheet.cell(5,1).string('Operadora').style(dataStyle1);
    workSheet.cell(5,2).string('YPlay').style(dataStyle2);
    workSheet.cell(7,1).string('Assinantes cadastrados na Plataforma').style(dataStyle1);
    workSheet.cell(7,2).number(totalCustomersYplay).style(dataStyle2);
    workSheet.cell(9,1).string('Assinantes Ativos com Acesso aos Pacotes SVOD Nacional + KIDS').style(dataStyle1);
    workSheet.cell(9,2).number(totalNacionaisKidsCustomersYplay).style(dataStyle2);
    workSheet.cell(11,1).string('Tipo Distribuição').style(dataStyle1);
    workSheet.cell(11,2).string('SVA').style(dataStyle2);
    workSheet.cell(13,1).string('Canal').style(dataStyle1);
    workSheet.cell(13,2).string('STUDIO').style(dataStyle2);

    for (let i = 2; i <= MAIN_HEADER_ROWS_COUNT; i++) {
        if(i % 2 === 0){
            workSheet.row(i).setHeight(8);
            continue;
        }
    }
    workSheet.row(MAIN_HEADER_ROWS_COUNT+1).filter();
    SECONDARY_HEADER.forEach((value, index) => workSheet.cell(MAIN_HEADER_ROWS_COUNT+1, index+1).string(value).style(headerStyle));

    groupedNacionaisKids.forEach((vod, index)=>{
        workSheet.cell((index+MAIN_HEADER_ROWS_COUNT+2),1).string(vod.vodname).style(dataStyle3);
        workSheet.cell((index+MAIN_HEADER_ROWS_COUNT+2),2).string('SVOD').style(dataStyle2);
        workSheet.cell((index+MAIN_HEADER_ROWS_COUNT+2),3).number(vod.amountwatched).style(dataStyle2);
    });
    const excelFormula = `=sum(C${MAIN_HEADER_ROWS_COUNT+2}:C${groupedNacionaisKids.length+MAIN_HEADER_ROWS_COUNT+1})`;
    workSheet.cell((groupedNacionaisKids.length+MAIN_HEADER_ROWS_COUNT+2),3).formula(excelFormula).style({...dataStyle2, font: { bold: true}});

    workBook.write(path.join(__dirname,'..','output',`YPlay_SVA_Nacional + KIDS - ${getCurrentMonth()}_${getCurrentYear()}.xlsx`));
}

const writeMoviesReport = (data) => {
    const {
        groupedMovies,
        totalCustomersSumicity,
        totalMoviesCustomersSumicity
    } = data;
    // console.table(groupedStudios);
    const MAIN_HEADER = 'YOUCAST';
    const MAIN_HEADER_ROWS_COUNT = 14;
    const SECONDARY_HEADER = ['Título','Formato', 'Acessos'];
    const workBook = new excel.Workbook();
    const workSheet = workBook.addWorksheet(getLastMonthYearNumeric());

    workSheet.column(1).setWidth(50);
    workSheet.column(2).setWidth(20);
    workSheet.cell(1,1,1,3,true).string(MAIN_HEADER).style(headerStyle);
    workSheet.cell(3,2).string('Período').style(dataStyle2);
    workSheet.cell(3,3).string(getLastMonthYearShort()).style(dataStyle2);
    workSheet.cell(5,1).string('Operadora').style(dataStyle1);
    workSheet.cell(5,2).string('Sumicity Movies').style(dataStyle2);
    workSheet.cell(7,1).string('Assinantes cadastrados na Plataforma').style(dataStyle1);
    workSheet.cell(7,2).number(totalCustomersSumicity).style(dataStyle2);
    workSheet.cell(9,1).string('Assinantes Ativos com Acesso ao Pacote SVOD STUDIOS').style(dataStyle1);
    workSheet.cell(9,2).number(totalMoviesCustomersSumicity).style(dataStyle2);
    workSheet.cell(11,1).string('Tipo Distribuição').style(dataStyle1);
    workSheet.cell(11,2).string('SVOD').style(dataStyle2);
    workSheet.cell(13,1).string('Canal').style(dataStyle1);
    workSheet.cell(13,2).string('STUDIO').style(dataStyle2);

    for (let i = 2; i <= MAIN_HEADER_ROWS_COUNT; i++) {
        if(i % 2 === 0){
            workSheet.row(i).setHeight(8);
            continue;
        }
    }
    workSheet.row(MAIN_HEADER_ROWS_COUNT+1).filter();
    SECONDARY_HEADER.forEach((value, index) => workSheet.cell(MAIN_HEADER_ROWS_COUNT+1, index+1).string(value).style(headerStyle));

    groupedMovies.forEach((vod, index)=>{
        workSheet.cell((index+MAIN_HEADER_ROWS_COUNT+2),1).string(vod.vodname).style(dataStyle3);
        workSheet.cell((index+MAIN_HEADER_ROWS_COUNT+2),2).string('SVOD').style(dataStyle2);
        workSheet.cell((index+MAIN_HEADER_ROWS_COUNT+2),3).number(vod.amountwatched).style(dataStyle2);
    });
    const excelFormula = `=sum(C${MAIN_HEADER_ROWS_COUNT+2}:C${groupedMovies.length+MAIN_HEADER_ROWS_COUNT+1})`;
    workSheet.cell((groupedMovies.length+MAIN_HEADER_ROWS_COUNT+2),3).formula(excelFormula).style({...dataStyle2, font: { bold: true}});

    workBook.write(path.join(__dirname,'..','output',`Sumicity Movies_SVOD_Studio - ${getCurrentMonth()}_${getCurrentYear()}.xlsx`));
}

module.exports = {
    writeToFile,
}