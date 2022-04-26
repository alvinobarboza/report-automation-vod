const { reportAllcustomers, reportVodWatched, reportVodPackage } = require("./util/dataModel"); //testing only
const { 
    getAllCustomers, 
    getVodsPackages, 
    getWatchedVods,
} = require("./util/reports");
const { customersPackagesValidation, groupVodsByWatchedAmount, vodsPackageValidation } = require("./util/validation");

// Promise.all(
//     [
//         getAllCustomers(),
//         getVodsPackages(),
//         getWatchedVods()
//     ]
// ).then( data => {
//     const allCustomers = data[0].response.rows;
//     const vodsPackages = data[1].response.rows;
//     const vodsWatched = data[2].response.rows;
//     const customersValidation = customersPackagesValidation(allCustomers);
//     const vodsValidation = customersPackagesValidation(vodsWatched);

//     const table = [
//         {
//             studios:vodsValidation[0].length,
//             nK:vodsValidation[1].length,
//             rest:vodsValidation[2].length
//         },
//         {
//             studios:customersValidation[0].length,
//             nK:customersValidation[1].length,
//             rest:customersValidation[2].length
//         },
//     ]
//     console.table(table);
// });

const main = () => {

    vodsPackageValidation(reportVodWatched, reportVodPackage);
    const customersValidation = customersPackagesValidation(reportAllcustomers);
    const vodsValidation = customersPackagesValidation(reportVodWatched);
    const table = [
        {
            studios:vodsValidation[0].length,
            nK:vodsValidation[1].length,
            rest:vodsValidation[2].length
        },
        {
            studios:customersValidation[0].length,
            nK:customersValidation[1].length,
            rest:customersValidation[2].length
        },
    ]
    console.table(table);
    console.log('Studios');
    console.table(groupVodsByWatchedAmount(vodsValidation[0]));
    console.log('Nacionais/kids');
    console.table(groupVodsByWatchedAmount(vodsValidation[1]));
    console.log('Resto');
    console.table(groupVodsByWatchedAmount(vodsValidation[2]));
}

main();