const TCM_VODS = [13, 15, 19, 81, 222, 476, 792];

function validateTCMCustomers(allCustomers) {
    const validData = {
        total: 0,
        customers: [],
    };
    //very fancy count++
    const totalVODCustomers = allCustomers.reduce((prev, curr) => {
        if (curr.vendor === 'TCM' && isTCMVOD(curr.productid)) {
            prev++;
            validData.customers.push(curr);
        }
        return prev;
    }, 0);
    validData.total = totalVODCustomers;
    return validData;
}

/**
 * @param {number} id
 */
function isTCMVOD(id) {
    for (const idT of TCM_VODS) {
        if (idT === id) {
            return true;
        }
    }
    return false;
}

function validateYBOXVOD(subscribed, active) {
    const subscribedGroupedByDealer = groupByDealerByCustomer(subscribed);
    return validateStatusAndReportability(subscribedGroupedByDealer, active);
}

function validateYboxTip(data) {
    const temp = {};
    const group = [];

    for (const customer of data) {
        if (temp[customer.vendor]) {
            temp[customer.vendor].customers.push(customer);
            temp[customer.vendor].total++;
        } else {
            temp[customer.vendor] = {
                vendor: customer.vendor,
                customers: [customer],
                total: 1,
            };
            group.push(temp[customer.vendor]);
        }
    }
    return group;
}

function groupByDealerByCustomer(subscribed) {
    const group = groupData(subscribed, 'dealerid', 'dealer');
    for (let i = 0; i < group.length; i++) {
        group[i].group = groupData(group[i].group, 'idmw', 'login');
    }
    return group;
}

// loop through active customers and flag them on the grouped ones also check for valide packages
function validateStatusAndReportability(subscribedGroupedByDealer, active) {
    for (let activeindex = 0; activeindex < active.length; activeindex++) {
        for (
            let dealerindex = 0;
            dealerindex < subscribedGroupedByDealer.length;
            dealerindex++
        ) {
            if (checkDealer(subscribedGroupedByDealer[dealerindex].dealerid)) {
                subscribedGroupedByDealer[dealerindex].dealertoreport = true;
            }
            for (
                let customerindex = 0;
                customerindex <
                subscribedGroupedByDealer[dealerindex].group.length;
                customerindex++
            ) {
                if (
                    active[activeindex].idmw ===
                    subscribedGroupedByDealer[dealerindex].group[customerindex]
                        .idmw
                ) {
                    subscribedGroupedByDealer[dealerindex].group[
                        customerindex
                    ].status = true;
                }
            }
        }
    }

    for (
        let dealerindex = 0;
        dealerindex < subscribedGroupedByDealer.length;
        dealerindex++
    ) {
        if (checkDealer(subscribedGroupedByDealer[dealerindex].dealerid)) {
            for (
                let customerindex = 0;
                customerindex <
                subscribedGroupedByDealer[dealerindex].group.length;
                customerindex++
            ) {
                subscribedGroupedByDealer[dealerindex].group[
                    customerindex
                ].customertoreport = isCustomerReportable(
                    subscribedGroupedByDealer[dealerindex].group[customerindex]
                        .group
                );
            }
        }
    }

    return subscribedGroupedByDealer;
}

function isCustomerReportable(arrayProducts) {
    let check = false;
    for (let i = 0; i < arrayProducts.length; i++) {
        if (checkPackage(arrayProducts[i].packagesid)) {
            check = true;
        }
    }
    return check;
}

function checkDealer(delaerid) {
    const dealerToExclude = [
        1, // JACON dealer
        5, // Youcast CSMS
        7, // Z-Não-usar
        22, // ADMIN-YOUCAST
    ];
    return !dealerToExclude.includes(delaerid);
}

function checkPackage(pacakgeid) {
    const packagesToExclude = [
        6, // Yplay monitoring
        39, // Yplay Teste midia
        692, // DEMO SEMPRE
        715, // Pacote RIT TV
        753, // LIGGA DEMO
        755, // Demo - Grupo Conexão
        778, // Projeto IG
    ];
    return !packagesToExclude.includes(pacakgeid);
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
                group: [ungrouped[i]],
            };
        }
    }
    const result = Object.values(groupedData);
    //==================

    return result;
}

module.exports = {
    validateTCMCustomers,
    validateYBOXVOD,
    validateYboxTip,
};
