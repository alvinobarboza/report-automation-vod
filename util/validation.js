const KIDS = 'SVOD Kids';
const NACIONAL = 'SVOD Nacional';
const STUDIO = 'SVOD Studio';

const vodsPackageValidation = (vodsWatched, vodsPackages) => {
    vodsWatched.forEach((v, i) => {
        let found = false;
        vodsPackages.forEach(vp=>{
            if(v.vodsid === vp.vodsid){
                vodsWatched[i].vodpackage = vp.package
                found = true;
            }
        });
        if(!found){
            vodsWatched[i].vodpackage = '';
        }
    })
}

const customersPackagesValidation = (unvalidated) => {
    const studios = unvalidated.filter(data =>  data.package.toLowerCase().includes('studio'));
    const nacionaisKids = unvalidated.filter(data => (data.package.toLowerCase().includes('svod') && !(data.package.toLowerCase().includes('studio'))));    
    const rest = unvalidated.filter(data => !(data.package.toLowerCase().includes('svod')));
    return {studios,nacionaisKids,rest};
}

const groupVodsByWatchedAmount = (vods) => {
    const vodsGroupSet = new Set();
    vods.forEach(vod => {
        if(
            (
                vod.vodpackage === KIDS || 
                vod.vodpackage === NACIONAL || 
                vod.vodpackage === STUDIO
            ) 
            &&
            !(
                vod.login.toLowerCase().includes('.demo') ||
                vod.login.toLowerCase().includes('demo.') ||
                vod.login.toLowerCase().includes('test') ||
                vod.login.toLowerCase().includes('youcast') ||
                vod.login.toLowerCase().includes('.yc') ||
                vod.login.toLowerCase().includes('yc.') ||
                vod.login.toLowerCase().includes('trial') ||
                vod.login.toLowerCase().includes('yplay')
            )
        ){
            vodsGroupSet.add(vod.vodsid);
        }
    });

    const vodsGrooupArray = [];

    vodsGroupSet.forEach(vod => {
        vodsGrooupArray.push({
            vodsid: vod,
        })
    });

    vodsGrooupArray.forEach((vodGrouped, index) => {
        let counter = 0;
        let vodName = '';
        let vodPackage = '';
        vods.forEach(v => {
            if(v.vodsid === vodGrouped.vodsid){
                counter++;
                vodName = v.vod;
                vodPackage = v.vodpackage;
            }
        })
        vodsGrooupArray[index].vodname = vodName;
        vodsGrooupArray[index].package = vodPackage;
        vodsGrooupArray[index].amountwatched = counter;
    });
    return vodsGrooupArray;
}

const countValidCustomers = (allCustomers, customersValidation) => {
    let totalCustomers = 0;
    let totalStudioCustomers = 0;
    let totalNacionaisKidsCustomers = 0;

    allCustomers.forEach(c => {
        if(!(
            c.login.toLowerCase().includes('.demo') ||
            c.login.toLowerCase().includes('demo.') ||
            c.login.toLowerCase().includes('test') ||
            c.login.toLowerCase().includes('youcast') ||
            c.login.toLowerCase().includes('.yc') ||
            c.login.toLowerCase().includes('yc.') ||
            c.login.toLowerCase().includes('trial') ||
            c.login.toLowerCase().includes('yplay')
        )){
            totalCustomers++;
        }
    });

    customersValidation.studios.forEach(c => {
        if(!(
            c.login.toLowerCase().includes('.demo') ||
            c.login.toLowerCase().includes('demo.') ||
            c.login.toLowerCase().includes('test') ||
            c.login.toLowerCase().includes('youcast') ||
            c.login.toLowerCase().includes('.yc') ||
            c.login.toLowerCase().includes('yc.') ||
            c.login.toLowerCase().includes('trial') ||
            c.login.toLowerCase().includes('yplay')
        )){
            totalStudioCustomers++;
        }
    });

    customersValidation.nacionaisKids.forEach(c => {
        if(!(
            c.login.toLowerCase().includes('.demo') ||
            c.login.toLowerCase().includes('demo.') ||
            c.login.toLowerCase().includes('test') ||
            c.login.toLowerCase().includes('youcast') ||
            c.login.toLowerCase().includes('.yc') ||
            c.login.toLowerCase().includes('yc.') ||
            c.login.toLowerCase().includes('trial') ||
            c.login.toLowerCase().includes('yplay')
        )){
            totalNacionaisKidsCustomers++;
        }
    });

    return { 
        totalCustomers, 
        totalStudioCustomers, 
        totalNacionaisKidsCustomers
    };
}

module.exports = {
    customersPackagesValidation,
    groupVodsByWatchedAmount,
    vodsPackageValidation,
    countValidCustomers
};