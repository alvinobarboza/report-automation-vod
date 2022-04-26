const getDate = () => {
    return (new Date()).toLocaleString('pt-br');
}

const getCurrentMonthYearNumeric = () => {
    return (new Date).toLocaleString('pt-BR', {month: 'numeric', year: 'numeric'}).split('/').join('.');
}

const getCurrentMonthYearShort = () => {
    const date = (new Date).toLocaleString('pt-BR', {month: 'short', year: '2-digit'})
        .toLocaleLowerCase();
    return date.substring(0,3) +'/'+ date.substring(date.length-2);
}

module.exports = {
    getDate,
    getCurrentMonthYearNumeric,
    getCurrentMonthYearShort
}