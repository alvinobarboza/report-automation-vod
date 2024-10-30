const vendor = 0;
const dealer_id = 1;
const dealer_name = 2;
const dealer_nomefantasia = 3;
const dealer_razaosocial = 4;
const dealer_cnpj = 5;
const dealer_cidade = 6;
const dealer_uf = 7;
const mwid = 8;
const smsid = 9;
const login = 10;
const packages = 11;
const profiles = 12;
const vods_group = 13;

/**
 * @param {string[][]} yplay
 * @param {string[][]} unifique
 * @param {string[][]} tip
 * @returns {Dealer[]}
 */
function validateErnaniReport(yplay, unifique, tip) {
    const yplayValidated = yplayValidation(yplay);
    const otherPlatforms = validatePlatforms([...unifique, ...tip]);
    return [...yplayValidated, ...otherPlatforms];
}

/**
 * @param {string[][]} data
 * @returns {Dealer[]}
 */
function validatePlatforms(data) {
    /**@type {Dealer[]} */
    const dealerData = [];

    /**@type {DealerHashMap} */
    const dealerTempHashMap = {};

    const monthRange = new Date(
        new Date().getTime() - 24 * 60 * 60 * 1000 * 32
    );

    for (const line of data) {
        if (line.length < 14) {
            continue;
        }
        if (line[0] === 'vendor' && line[line.length - 1] === 'vods_groups') {
            continue;
        }

        const customer = customerData(line);
        let lastMonthActive = 0;
        for (const profile of customer.profiles) {
            const dateUsed = new Date(profile.lastused);
            if (dateUsed > monthRange) {
                lastMonthActive = 1;
            }
        }

        if (dealerTempHashMap[line[vendor]]) {
            dealerTempHashMap[line[vendor]].customers.push(customer);
            dealerTempHashMap[line[vendor]].lastMonthCount += lastMonthActive;
        } else {
            dealerTempHashMap[line[vendor]] = {
                id: line[dealer_id],
                name: line[vendor],
                nomefantasia: '',
                razaosocial: '',
                cnpj: '',
                cidade: '',
                uf: '',
                vendor: line[vendor],
                lastMonthCount: lastMonthActive,
                customers: [customer],
            };
            dealerData.push(dealerTempHashMap[line[vendor]]);
        }
    }
    return dealerData;
}

/**
 * @param {string[][]} data
 * @returns {Dealer[]}
 */
function yplayValidation(data) {
    /**@type {Dealer[]} */
    const dealerData = [];

    /**@type {DealerHashMap} */
    const dealerTempHashMap = {};

    const monthRange = new Date(
        new Date().getTime() - 24 * 60 * 60 * 1000 * 32
    );

    for (const line of data) {
        if (line.length < 14) {
            continue;
        }
        if (line[0] === 'vendor' && line[line.length - 1] === 'vods_groups') {
            continue;
        }

        const customer = customerData(line);
        let lastMonthActive = 0;
        for (const profile of customer.profiles) {
            const dateUsed = new Date(profile.lastused);
            if (dateUsed > monthRange) {
                lastMonthActive = 1;
            }
        }

        if (dealerTempHashMap[line[dealer_id]]) {
            dealerTempHashMap[line[dealer_id]].customers.push(customer);
            dealerTempHashMap[line[dealer_id]].lastMonthCount +=
                lastMonthActive;
        } else {
            dealerTempHashMap[line[dealer_id]] = {
                id: line[dealer_id],
                name: line[dealer_name],
                nomefantasia: line[dealer_nomefantasia],
                razaosocial: line[dealer_razaosocial],
                cnpj: line[dealer_cnpj],
                cidade: line[dealer_cidade],
                uf: line[dealer_uf],
                vendor: line[vendor],
                lastMonthCount: lastMonthActive,
                customers: [customer],
            };
            dealerData.push(dealerTempHashMap[line[dealer_id]]);
        }
    }
    return dealerData;
}

/**
 * @param {string[]} line
 * @returns {Customer}
 */
function customerData(line) {
    const profilesUsed = customerProfile(line);

    const packagesData = line[packages].split('|').map((value) => value.trim());
    const vodgroupsData = line[vods_group]
        .split('|')
        .map((value) => value.trim());

    /**@type {Customer} */
    const customerData = {
        login: line[login],
        mwid: line[mwid],
        smsid: line[smsid],
        packages: packagesData,
        profiles: profilesUsed,
        vodgroups: vodgroupsData,
    };

    return customerData;
}

/**
 * @param {string[]} line
 * @returns {Profile[]}
 */
function customerProfile(line) {
    if (line[profiles].length < 1) {
        return [];
    }
    const profilesData = line[profiles].split('|');

    /**@type {Profile[]} */
    const profilesUsed = [];

    if (profilesData) {
        for (const profidata of profilesData) {
            const nameUsed = profidata.split('-T-');
            profilesUsed.push({
                name: nameUsed[0],
                lastused: nameUsed[1],
            });
        }
    }

    return profilesUsed;
}

module.exports = {
    validateErnaniReport,
};

/**
 * @typedef {Object<string, Dealer>} DealerHashMap
 */

/**
 * @typedef {object} Dealer
 * @property {string} id
 * @property {string} name
 * @property {string} nomefantasia
 * @property {string} razaosocial
 * @property {string} cnpj
 * @property {string} cidade
 * @property {string} uf
 * @property {string} vendor
 * @property {number} lastMonthCount
 * @property {Customer[]} customers
 */

/**
 * @typedef {object} Customer
 * @property {string} smsid
 * @property {string} mwid
 * @property {string} login
 * @property {Profile[]} profiles
 * @property {string[]} packages
 * @property {string[]} vodgroups
 */

/**
 * @typedef {object} Profile
 * @property {string} name
 * @property {string} lastused
 */
