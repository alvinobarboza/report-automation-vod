const getDate = () => {
    const tempDate = new Date();
    return (new Date(tempDate.getFullYear(), tempDate.getMonth() - 1)).toLocaleString('pt-br');
}

const getLastMonthYearNumeric = () => {
    const tempDate = new Date();
    return (new Date(tempDate.getFullYear(), tempDate.getMonth() - 1))
        .toLocaleString('pt-BR', { month: 'numeric', year: 'numeric' })
        .split('/')
        .join('.');
}

const getCurrentMonth = () => {
    const tempDate = new Date();
    return (new Date(tempDate.getFullYear(), tempDate.getMonth() - 1))
        .toLocaleString('pt-BR', { month: 'short' })
        .toLocaleUpperCase()
        .split('.')[0];
}

const getCurrentMonthLong = () => {
    const tempDate = new Date();
    return (new Date(tempDate.getFullYear(), tempDate.getMonth() - 1))
        .toLocaleString('pt-BR', { month: 'long' })
        .toLocaleUpperCase()
        .split('.')[0];
}

const getCurrentYear = () => {
    return (new Date).getFullYear();
}

const getLastMonthYearShort = () => {
    const tempDate = new Date();
    const date = (new Date(tempDate.getFullYear(), tempDate.getMonth() - 1))
        .toLocaleString('pt-BR', { month: 'short', year: '2-digit' })
        .toLocaleLowerCase();
    return date.substring(0, 3) + '/' + date.substring(date.length - 2);
}

const getLastMonthYearLong = () => {
    const tempDate = new Date();
    const date = (new Date(tempDate.getFullYear(), tempDate.getMonth() - 1))
        .toLocaleString('pt-BR', { month: 'long', year: 'numeric' })
        .toLocaleLowerCase();
    const formatedDate = date.split(' ');
    return `${formatedDate[0]}, ${formatedDate[2]}`;
}
const getCurrentDate = () => {
    return new Date().toISOString().split('T')[0]
}

module.exports = {
    getDate,
    getLastMonthYearNumeric,
    getCurrentMonth,
    getCurrentMonthLong,
    getCurrentYear,
    getLastMonthYearShort,
    getLastMonthYearLong,
    getCurrentDate
}