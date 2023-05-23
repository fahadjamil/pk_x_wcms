import { arabicMonths, shortMonthNames } from '../../../config/constants';

// --- epoch conversions ---
export const epochToDate = (epochTimeStamp) => {
    // 1618470660000 >> 2021-03-15
    let date = new Date(0);
    date.setUTCSeconds(epochTimeStamp);
    return `${date.getFullYear()}-${date.getMonth()}-${date.getDate()}`;
};

export const epochToShortDate = (epochTimeStamp, lang) => {

    // 1618470660000 >> Mar-15
    let date = new Date(0);
    date.setUTCSeconds(epochTimeStamp);
    return `${date.getDate()}-${
        lang && lang.langKey == 'AR'
            ? arabicMonths[date.getMonth()]
            : shortMonthNames[date.getMonth()]
    }`;
};

//  check if two epoch timestamps are of the same date
export const isSameDate = (epochTimeStamp1, epochTimeStamp2) => {
    // 1618470660000 >> 2021-03-15
    let date1 = new Date(0);
    date1.setUTCSeconds(epochTimeStamp1);

    let date2 = new Date(0);
    date2.setUTCSeconds(epochTimeStamp2);
    return (
        date1.getFullYear() == date2.getFullYear() &&
        date1.getMonth() == date2.getMonth() &&
        date1.getDate() == date2.getDate()
    );
};

// --- Math functions ---

export const findMin = (array, propName) => Math.min(...array.map((element) => element[propName]));

export const findMax = (array, propName) => Math.max(...array.map((element) => element[propName]));

//  --- Meta Data ---
export const getHeaderIndex = (header, propName) => {
    if (typeof header == 'string') {
        return header.split(',').indexOf(propName);
    }
};
