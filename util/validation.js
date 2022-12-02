const validateTCMCustomers = (allCustomers) => {
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

module.exports = {
    validateTCMCustomers,
};