// const { 
//     reportAllcustomers, 
//     reportVodWatched, 
//     reportVodPackage, 
//     reportAllCustomersSumcity, 
//     reportVodPackageSumicity, 
//     reportVodWatchedSumicity 
// } = require("./util/dataModel"); //testing only

const { 
    getAllCustomersYplay, 
    getVodsPackagesYplay, 
    getWatchedVodsYplay,
    getAllCustomersSumicity,
    getVodsPackagesSumicity,
    getWatchedVodsSumicity,
} = require("./util/reports");
const { 
    customersPackagesValidationYplay, 
    groupVodsByWatchedAmountYplay, 
    vodsPackageValidation, 
    countValidCustomersYplay, 
    validateVodsWatchedSumicity,
    validateCustomersSumicity,
    groupVodsByWatchedAmountSumicity,
    countValidCustomersSumicity,
} = require("./util/validation");
const { writeToFile } = require("./util/writeToFile");



//     writeToFile({

//     });
// })
// .catch(e=>console.log(e));



Promise.all(
    [
        getAllCustomersYplay(),
        getVodsPackagesYplay(),
        getWatchedVodsYplay(),
        getAllCustomersSumicity(),
        getVodsPackagesSumicity(),
        getWatchedVodsSumicity()
    ]
).then( data => {
    const allCustomersYplay = data[0].response.rows;
    const vodsPackagesYplay = data[1].response.rows;
    const vodsWatchedYplay = data[2].response.rows;
    const allCustomersSumicity = data[3].response.rows;
    const vodsPackagesSumicity = data[4].response.rows;
    const vodsWatchedSumicity = data[5].response.rows;

    //Yplay reports
    vodsPackageValidation(vodsWatchedYplay, vodsPackagesYplay);
    const customersValidation = customersPackagesValidationYplay(allCustomersYplay);
    const vodsValidation = customersPackagesValidationYplay(vodsWatchedYplay);

    const { 
        totalCustomersYplay, 
        totalStudioCustomersYplay, 
        totalNacionaisKidsCustomersYplay
    } = countValidCustomersYplay( allCustomersYplay, customersValidation );

    const groupedStudios = groupVodsByWatchedAmountYplay(vodsValidation.studios);
    const groupedNacionaisKids = groupVodsByWatchedAmountYplay(vodsValidation.nacionaisKids);
    
    //Sumicity Reports
    vodsPackageValidation(vodsWatchedSumicity, vodsPackagesSumicity);
    const { moviesVods } = validateVodsWatchedSumicity(vodsWatchedSumicity);
    const { sumicityMoviesCustomers } = validateCustomersSumicity(allCustomersSumicity);
    const groupedMovies = groupVodsByWatchedAmountSumicity(moviesVods);
    const {totalCustomersSumicity,totalMoviesCustomersSumicity} = countValidCustomersSumicity(allCustomersSumicity, sumicityMoviesCustomers);

    writeToFile({
        groupedStudios, 
        groupedNacionaisKids, 
        totalCustomersYplay, 
        totalNacionaisKidsCustomersYplay, 
        totalStudioCustomersYplay,
        groupedMovies, 
        totalCustomersSumicity, 
        totalMoviesCustomersSumicity
    });
   
})
.catch(e=>console.log(e));
