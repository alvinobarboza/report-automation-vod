const { reportAllcustomers, reportVodWatched, reportVodPackage } = require("./util/dataModel"); //testing only
const { 
    getAllCustomers, 
    getVodsPackages, 
    getWatchedVods,
} = require("./util/reports");
const { 
    customersPackagesValidation, 
    groupVodsByWatchedAmount, 
    vodsPackageValidation, 
    countValidCustomers 
} = require("./util/validation");
const { writeToFile } = require("./util/writeToFile");

Promise.all(
    [
        getAllCustomers(),
        getVodsPackages(),
        getWatchedVods()
    ]
).then( data => {
    const allCustomers = data[0].response.rows;
    const vodsPackages = data[1].response.rows;
    const vodsWatched = data[2].response.rows;

    vodsPackageValidation(vodsWatched, vodsPackages);
    const customersValidation = customersPackagesValidation(allCustomers);
    const vodsValidation = customersPackagesValidation(vodsWatched);

    const { 
        totalCustomers, 
        totalStudioCustomers, 
        totalNacionaisKidsCustomers
    } = countValidCustomers( allCustomers, customersValidation );

    const groupedStudios = groupVodsByWatchedAmount(vodsValidation.studios);
    const groupedNacionaisKids = groupVodsByWatchedAmount(vodsValidation.nacionaisKids);

    writeToFile({
        groupedStudios, 
        groupedNacionaisKids, 
        totalCustomers, 
        totalNacionaisKidsCustomers, 
        totalStudioCustomers
    });
})
.catch(e=>console.log(e));
