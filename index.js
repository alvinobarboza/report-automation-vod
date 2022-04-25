const { 
    getAllCustomers, 
    getVodsPackages, 
    getWatchedVods,
} = require("./util/reports");

/*Promise.all(
    [
        getAllCustomers(),
        getVodsPackages(),
        getWatchedVods()
    ]
).then( data => {
    console.table(data[0].response.rows)
})*/


getAllCustomers().then(data=>{
    const studios = data.response.rows.filter(data =>  data.products.toLowerCase().includes('studio'));
    const nacionaisKids = data.response.rows.filter(data => (data.products.toLowerCase().includes('svod') && !(data.products.toLowerCase().includes('studio'))));    
    const rest = data.response.rows.filter(data => !(data.products.toLowerCase().includes('svod')));
    console.table([data.response.rows.length,studios.length, nacionaisKids.length, rest.length]);
});

