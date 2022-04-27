const getDate = () => {
    return (new Date()).toLocaleString('pt-br');
}

const getCurrentMonthYearNumeric = () => {
    return (new Date).toLocaleString('pt-BR', {month: 'numeric', year: 'numeric'}).split('/').join('.');
}

const getCurrentMonth = () => {
	return (new Date).toLocaleString('pt-BR', {month: 'short'})
		.toLocaleUpperCase()
		.split('.')[0];
}

const getCurrentYear = () => {
	return (new Date).getFullYear();
}

const getCurrentMonthYearShort = () => {
    const date = (new Date).toLocaleString('pt-BR', {month: 'short', year: '2-digit'})
        .toLocaleLowerCase();
    return date.substring(0,3) +'/'+ date.substring(date.length-2);
}

module.exports = {
    getDate,
    getCurrentMonthYearNumeric,
    getCurrentMonth,
    getCurrentYear,
    getCurrentMonthYearShort
}