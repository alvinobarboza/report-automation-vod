const getDate = () => {
    const tempDate = new Date();
    return (new Date(tempDate.getFullYear(), tempDate.getMonth()-1)).toLocaleString('pt-br');
}

const getLastMonthYearNumeric = () => {
    const tempDate = new Date();
    return (new Date(tempDate.getFullYear(), tempDate.getMonth()-1))
        .toLocaleString('pt-BR', {month: 'numeric', year: 'numeric'})
        .split('/')
        .join('.');
}

const getCurrentMonth = () => {
    const tempDate = new Date();
	return (new Date(tempDate.getFullYear(), tempDate.getMonth()-1))
        .toLocaleString('pt-BR', {month: 'short'})
		.toLocaleUpperCase()
		.split('.')[0];
}

const getCurrentYear = () => {
	return (new Date).getFullYear();
}

const getLastMonthYearShort = () => {
    const date = (new Date).toLocaleString('pt-BR', {month: 'short', year: '2-digit'})
        .toLocaleLowerCase();
    return date.substring(0,3) +'/'+ date.substring(date.length-2);
}

module.exports = {
    getDate,
    getLastMonthYearNumeric,
    getCurrentMonth,
    getCurrentYear,
    getLastMonthYearShort
}