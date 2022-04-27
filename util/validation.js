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
        if(vod.vodpackage === KIDS || vod.vodpackage === NACIONAL || vod.vodpackage === STUDIO ){
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

module.exports = {
    customersPackagesValidation,
    groupVodsByWatchedAmount,
    vodsPackageValidation
};