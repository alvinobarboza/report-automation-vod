// const { 
//     reportTvodPackage,
//     reportVodWatched
// } = require("./util/dataModel"); //testing only

const { 
    getAllCustomersYplay, 
    getVodsPackagesYplay, 
    getWatchedVodsYplay,
    getAllCustomersSumicity,
    getVodsPackagesSumicity,
    getWatchedVodsSumicity,
    getTvodsPackagesYplay,
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
    countTvodWatched,
} = require("./util/validation");
const { writeToFile, writeTvodReport } = require("./util/writeToFile");

Promise.all(
    [
        getAllCustomersYplay(),
        getVodsPackagesYplay(),
        getWatchedVodsYplay(),
        getAllCustomersSumicity(),
        getVodsPackagesSumicity(),
        getWatchedVodsSumicity(),
        getTvodsPackagesYplay()
    ]
).then( data => {
    const allCustomersYplay = data[0].response.rows;
    const vodsPackagesYplay = data[1].response.rows;
    const vodsWatchedYplay = data[2].response.rows;
    const allCustomersSumicity = data[3].response.rows;
    const vodsPackagesSumicity = data[4].response.rows;
    const vodsWatchedSumicity = data[5].response.rows;
    const tvodPackagesYplay = data[6].response.rows;

    //Yplay reports
    vodsPackageValidation(vodsWatchedYplay, vodsPackagesYplay);
    countTvodWatched(tvodPackagesYplay, vodsWatchedYplay);

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
        totalMoviesCustomersSumicity,
        tvodPackagesYplay
    });
   
})
.catch(e=>console.log(e));
