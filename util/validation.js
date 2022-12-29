function validateTCMCustomers(allCustomers) {
    const validData = {
        total: 0,
        customers: []
    };
    //very fancy count++
    const totalVODCustomers = allCustomers.reduce((prev, curr) => {
        if (curr.vendor === 'TCM' && curr.productid === 477) {
            prev++;
            validData.customers.push(curr);
        }
        return prev;
    }, 0);
    validData.total = totalVODCustomers;
    return validData;
}

function validateYBOXVOD(active, watched) {
    const data = {
        activecustomers: [],
        watchedcustomers: [],
        vods: []
    }

    data.activecustomers = active;

    const validatedCustomers = returnWatchedCustomerOnActiveList(watched, active);

    data.watchedcustomers = groupData(validatedCustomers, 'customerid', 'login');
    data.vods = groupData(validatedCustomers, 'vodsid', 'vod');

    return data;
}

function returnWatchedCustomerOnActiveList(watched, active) {
    const validatedCustomers = [];
    for (let i = 0; i < watched.length; i++) {
        for (let j = 0; j < active.length; j++) {
            if (watched[i].customerid === active[j].customerid) {
                validatedCustomers.push(watched[i]);
            }
        }
    }
    return validatedCustomers;
}

function groupData(ungrouped, paramGrouper, extraParam) {
    //ChatGPT answer slightly modified for testing purposes
    const groupedData = {};

    for (let i = 0; i < ungrouped.length; i++) {
        if (groupedData[ungrouped[i][paramGrouper]]) {
            groupedData[ungrouped[i][paramGrouper]].group.push(ungrouped[i]);
        } else {
            groupedData[ungrouped[i][paramGrouper]] = {
                [paramGrouper]: ungrouped[i][paramGrouper],
                [extraParam]: ungrouped[i][extraParam],
                group: [ungrouped[i]]
            };
        }
    }
    const result = Object.values(groupedData);
    //==================

    return result;
}

module.exports = {
    validateTCMCustomers,
    validateYBOXVOD
};