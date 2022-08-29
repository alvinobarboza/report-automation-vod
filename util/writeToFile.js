const excel = require('excel4node');
const path = require('path');

const { 
    getLastMonthYearNumeric, 
    getCurrentMonth, 
    getCurrentYear, 
    getLastMonthYearShort, 
    getCurrentMonthLong,
    getLastMonthYearLong
} = require('./date');
const { 
    headerStyle,
    dataStyle1,
    dataStyle2,
    dataStyle3,
    headerStyleTVOD1,
    headerStyleTVOD2,
    fillStyleTVOD,
    dataStyleTvod,
    headerStyleTCM,
    dataStyleTCM
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
        totalMoviesCustomersSumicity,
        tvodPackagesYplay,
        dataTCM,
        tvodWatchedYplayHsl
    } = data;

    writeTCMVODReport(dataTCM);
    writeTvodReport(tvodPackagesYplay);
    writeTvodReportHSL(tvodWatchedYplayHsl);
    writeMoviesReport({groupedMovies, totalCustomersSumicity, totalMoviesCustomersSumicity});
    writeStudiosReport({groupedStudios, totalCustomersYplay, totalStudioCustomersYplay});
    writeNacionaisKidsReport({groupedNacionaisKids, totalCustomersYplay, totalNacionaisKidsCustomersYplay});
}

const writeTCMVODReport = (dataTCM) => {
    // console.log(dataTCM);
    const columnWidth = [12,10,30,16];
    const headerMain = 'ASSINANTES ATIVOS COM O PACOTE TCM VOD';
    const headerCustomers = ['ID', 'Vendor', 'Login', 'Package'];
    const headerTotal = [
        {column1: 'Ref.:',column2: getLastMonthYearShort()},
        {column1: 'Quantidade de Assinantes:',column2: `${dataTCM.total}`},
    ]
    const workBook = new excel.Workbook();
    const workSheet = workBook.addWorksheet(getCurrentMonthLong());

    columnWidth.forEach((width, index)=> workSheet.column(index+1).setWidth(width));
    workSheet.cell(1,1,1,4,true).string(headerMain).style({...headerStyleTCM, font: {...headerStyleTCM.font, size: 16}}); 
    headerTotal.forEach((header, index)=>{
        workSheet.cell(2+index,1,2+index,3, true).string(header.column1).style({...headerStyleTCM, alignment: {horizontal:['right']}});
        workSheet.cell(2+index,4).string(header.column2).style({alignment: {horizontal:['center']}});
    });
    headerCustomers.forEach((header, index) => workSheet.cell(5, index+1).string(header).style(headerStyleTCM));

    dataTCM.customers.forEach((customer, index) => {
        workSheet.cell(6+index,1).number(customer.idmw).style(index % 2 === 0 ? dataStyleTCM : {alignment:{horizontal:['center']}});
        workSheet.cell(6+index,2).string(customer.vendor).style(index % 2 === 0 ? dataStyleTCM : {alignment:{horizontal:['center']}});
        workSheet.cell(6+index,3).string(customer.login).style(index % 2 === 0 ? dataStyleTCM : {alignment:{horizontal:['center']}});
        workSheet.cell(6+index,4).string('TCM VOD').style(index % 2 === 0 ? dataStyleTCM : {alignment:{horizontal:['center']}});
    });

    workBook.write(path.join(__dirname,'..','output',`Assinantes ativos com pacote TCM VOD - ${getCurrentMonth()}_${getCurrentYear()}.xlsx`));
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

const writeTvodReport = (data) => {
    const MAIN_HEADER = [
        ['Customer', 13],
        ['Period', 13],
        ['MPM', 13],
        ['Title - VOD', 41],
        ['Transaction Description', 13],
        ['Units Sold', 13],
        ['Format', 11],
        ['State', 9],
        ['Retail Price', 15],
        ['Sales Taxes', 13],
        ['Net Retail Price',16],
        ['',3],
        ['Category',9],
        ['% Share', 9],
        ['% Net Price',11],
        ['Minimum Fee',11],
        ['Max Net x Min',11],
        ['',3],
        ['Amount Payable BRL', 17],
        ['Exchange Rate', 12],
        ['Amount Payable USD',9],
        ['',3]
    ];
    const workBook = new excel.Workbook();
    const workSheet = workBook.addWorksheet(getCurrentMonthLong());

    workSheet.row(1).filter();
    workSheet.row(1).setHeight(42);
    let headerCheck = false;
    MAIN_HEADER.forEach((value, index) => {
        if (value[0] === '') {
            headerCheck = true
            workSheet.column(index+1).setWidth(value[1]);
            workSheet.cell(1, index+1).string(value[0]).style(fillStyleTVOD);
        }else if(headerCheck){
            workSheet.column(index+1).setWidth(value[1]);
            workSheet.cell(1, index+1).string(value[0]).style(headerStyleTVOD2);
        }else {
            workSheet.column(index+1).setWidth(value[1]);
            workSheet.cell(1, index+1).string(value[0]).style(headerStyleTVOD1);
        }
    });
    data.forEach( (d,i) => {
        for (let index = 0; index < MAIN_HEADER.length; index++) {
            if((index+1)===12 || (index+1)===18 || (index+1)===22){
                workSheet.cell(i+2, index+1).string('').style(fillStyleTVOD);
            }else{
                workSheet.cell(i+2, index+1).string('').style(dataStyleTvod);
            }
        }
        workSheet.cell(i+2, 1).string('Yplay');
        workSheet.cell(i+2, 2).string(getLastMonthYearLong());
        workSheet.cell(i+2, 4).string(d.vodsname);
        workSheet.cell(i+2, 5).string('TVOD');
        workSheet.cell(i+2, 6).number(d.countCutomers);
        workSheet.cell(i+2, 7).string('HD');
        workSheet.cell(i+2, 8).string('SP');
    });    

    workBook.write(path.join(__dirname,'..','output',`Yplay_TVOD - ${getCurrentMonth()}_${getCurrentYear()}.xlsx`));
}

const writeTvodReportHSL = (data) => {
    const MAIN_HEADER = [
        ['Customer', 13],
        ['Period', 13],
        ['MPM', 13],
        ['Title - VOD', 41],
        ['Transaction Description', 13],
        ['Units Sold', 13],
        ['Format', 11],
        ['State', 9],
        ['Retail Price', 15],
        ['Sales Taxes', 13],
        ['Net Retail Price',16],
        ['',3],
        ['Category',9],
        ['% Share', 9],
        ['% Net Price',11],
        ['Minimum Fee',11],
        ['Max Net x Min',11],
        ['',3],
        ['Amount Payable BRL', 17],
        ['Exchange Rate', 12],
        ['Amount Payable USD',9],
        ['',3]
    ];
    const workBook = new excel.Workbook();
    const workSheet = workBook.addWorksheet(getCurrentMonthLong());

    workSheet.row(1).filter();
    workSheet.row(1).setHeight(42);
    let headerCheck = false;
    MAIN_HEADER.forEach((value, index) => {
        if (value[0] === '') {
            headerCheck = true
            workSheet.column(index+1).setWidth(value[1]);
            workSheet.cell(1, index+1).string(value[0]).style(fillStyleTVOD);
        }else if(headerCheck){
            workSheet.column(index+1).setWidth(value[1]);
            workSheet.cell(1, index+1).string(value[0]).style(headerStyleTVOD2);
        }else {
            workSheet.column(index+1).setWidth(value[1]);
            workSheet.cell(1, index+1).string(value[0]).style(headerStyleTVOD1);
        }
    });
    data.forEach( (d,i) => {
        for (let index = 0; index < MAIN_HEADER.length; index++) {
            if((index+1)===12 || (index+1)===18 || (index+1)===22){
                workSheet.cell(i+2, index+1).string('').style(fillStyleTVOD);
            }else{
                workSheet.cell(i+2, index+1).string('').style(dataStyleTvod);
            }
        }
        workSheet.cell(i+2, 1).string('Yplay');
        workSheet.cell(i+2, 2).string(getLastMonthYearLong());
        workSheet.cell(i+2, 4).string(d.vodsname);
        workSheet.cell(i+2, 5).string('TVOD');
        workSheet.cell(i+2, 6).number(d.watched);
        workSheet.cell(i+2, 7).string('HD');
        workSheet.cell(i+2, 8).string('SP');
    });    

    workBook.write(path.join(__dirname,'..','output',`Yplay_TVOD - ${getCurrentMonth()}_${getCurrentYear()} - HSL.xlsx`));
}

module.exports = {
    writeToFile,
    writeTvodReport,
}