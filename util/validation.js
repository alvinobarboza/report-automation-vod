const KIDS = 'SVOD Kids';
const NACIONAL = 'SVOD Nacional';
const STUDIO = 'SVOD Studio';
const SUMICITY_MOVIES = 'Sumicity Movies';

const countTvodWatched = (tvodPackage, tvodWatched) => {
    tvodPackage.forEach((tvod, index) => {
        let count = 0;        
        tvodWatched.forEach(watched => {
            if(
                tvod.vodsid === watched.vodsid && 
                watched.package.toLocaleLowerCase().includes('HSL - TVOD') &&
                watched.vendor === 'HSL' &&
                !(
                    watched.login.toLowerCase().includes('.demo') ||
                    watched.login.toLowerCase().includes('demo.') ||
                    watched.login.toLowerCase().includes('test') ||
                    watched.login.toLowerCase().includes('youcast') ||
                    watched.login.toLowerCase().includes('.yc') ||
                    watched.login.toLowerCase().includes('yc.') ||
                    watched.login.toLowerCase().includes('trial') ||
                    watched.login.toLowerCase().includes('yplay')
                )
            ){
                count++;
            }
        });
        tvodPackage[index].countCutomers = count;
    });
}

const validateVodsWatchedSumicity = (data) => {
    const moviesVods = [];
    const restVods = [];
     
    data.forEach(e => {
        if(e.package.includes(SUMICITY_MOVIES) && e.vodpackage === SUMICITY_MOVIES){
            moviesVods.push(e);
        }else{
            restVods.push(e);
        }
    });
    return { moviesVods, restVods };
}

const validateCustomersSumicity = (data) => {
    const sumicityMoviesCustomers = data.filter(d=>d.package.includes(SUMICITY_MOVIES));
    const restCustomers = data.filter(d=>!d.package.includes(SUMICITY_MOVIES));
    return { sumicityMoviesCustomers, restCustomers };
}

const vodsPackageValidation = (vodsWatched, vodsPackages) => {
    vodsWatched.forEach((v, i) => {
        let found = false;
        vodsPackages.forEach(vp=>{
            if(v.vodsid === vp.vodsid){
                vodsWatched[i].vodpackage = vp.package;
                found = true;
            }
        });
        if(!found){
            vodsWatched[i].vodpackage = '';
        }
    })
}

const customersPackagesValidationYplay = (unvalidated) => {
    const studios = unvalidated.filter(data =>  data.package.toLowerCase().includes('studio'));
    const nacionaisKids = unvalidated.filter(data => (data.package.toLowerCase().includes('svod') && !(data.package.toLowerCase().includes('studio'))));    
    const rest = unvalidated.filter(data => !(data.package.toLowerCase().includes('svod')));
    return {studios,nacionaisKids,rest};
}

const groupVodsByWatchedAmountYplay = (vods) => {
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

const groupVodsByWatchedAmountSumicity = (vods) => {
    const vodsGroupSet = new Set();
    vods.forEach(vod => {
        if(            
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

const countValidCustomersYplay = (allCustomers, customersValidation) => {
    let totalCustomersYplay = 0;
    let totalStudioCustomersYplay = 0;
    let totalNacionaisKidsCustomersYplay = 0;

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
            totalCustomersYplay++;
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
            totalStudioCustomersYplay++;
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
            totalNacionaisKidsCustomersYplay++;
        }
    });

    return { 
        totalCustomersYplay, 
        totalStudioCustomersYplay, 
        totalNacionaisKidsCustomersYplay
    };
}

const countValidCustomersSumicity = (allCustomers, customersValidation) => {
    let totalCustomersSumicity = 0;
    let totalMoviesCustomersSumicity = 0;

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
            totalCustomersSumicity++;
        }
    });

    customersValidation.forEach(c => {
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
            totalMoviesCustomersSumicity++;
        }
    });

    return { 
        totalCustomersSumicity, 
        totalMoviesCustomersSumicity,         
    };
}

module.exports = {
    countTvodWatched,
    validateVodsWatchedSumicity,
    validateCustomersSumicity,
    customersPackagesValidationYplay,
    groupVodsByWatchedAmountYplay,
    groupVodsByWatchedAmountSumicity,
    vodsPackageValidation,
    countValidCustomersYplay,
    countValidCustomersSumicity,
};