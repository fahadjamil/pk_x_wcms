import queryString from 'query-string';
import { monthNames, arabicMonths, shortMonthNames } from '../config/constants';

export const dateFormat = (dateValue) => {
    if (dateValue && typeof dateValue != 'string') {
        dateValue = dateValue.toString();
    }
    const year = dateValue.slice(0, 4);
    const month = dateValue.slice(4, 6) - 1;
    const day = dateValue.slice(6, 8);
    const hour = dateValue.slice(8, 10);
    const minute = dateValue.slice(10, 12);
    const seconds = dateValue.slice(12, 14);

    return new Date(year, month, day, hour, minute, seconds);
};

// eg. 31/12/2020
export const displayFormat = (dateValue) => {
    if (dateValue && typeof dateValue != 'string') {
        dateValue = dateValue.toString();
    }
    const dateObject = dateFormat(dateValue);
    let month =
        dateObject.getMonth() + 1 < 10
            ? `0${dateObject.getMonth() + 1}`
            : dateObject.getMonth() + 1;
    let date = dateObject.getDate() < 10 ? `0${dateObject.getDate()}` : dateObject.getDate();
    return `${date}/${month}/${dateObject.getFullYear()}`;
};

// eg. 31 December 2020
export const displayDDMonthNameYYYYFormat = (dateValue ,lang = {langKey : 'EN'}) => {
    if (dateValue && typeof dateValue != 'string') {
        dateValue = dateValue.toString();
    }
    const dateObject = dateFormat(dateValue);
    let month = dateObject.getMonth() ;
    let date = dateObject.getDate() < 10 ? `0${dateObject.getDate()}` : dateObject.getDate();
    return `${date} ${lang.langKey == 'AR' ? arabicMonths[month] :monthNames[month]}, ${dateObject.getFullYear()}`;
};

export const displayShortFormat = (lang, dateValue) => {
    if (dateValue && typeof dateValue != 'string') {
        dateValue = dateValue.toString();
    }
    const dateObject = dateFormat(dateValue);

    return `${
        lang && lang.langKey == 'AR'
            ? arabicMonths[dateObject.getMonth()]
            : shortMonthNames[dateObject.getMonth()]
    } - ${dateObject.getDate()}`;
};
export const displayDetailedFormat = (dateValue, lang = { langKey: 'EN' }) => {
    if (dateValue && typeof dateValue != 'string') {
        dateValue = dateValue.toString();
    }
    const dateObject = dateFormat(dateValue);
    let AM = lang.langKey == 'AR' ? 'ص' : 'AM';
    let PM = lang.langKey == 'AR' ? 'م' : 'PM';
    let meridiem = dateObject.getHours() > 11 ? PM : AM;
    let hours = dateObject.getHours() % 12; // the hour '0' should be '12'
    let minutes =
        dateObject.getMinutes() < 10 ? `0${dateObject.getMinutes()}` : dateObject.getMinutes();

    let month =
        dateObject.getMonth() + 1 < 10
            ? `0${dateObject.getMonth() + 1}`
            : dateObject.getMonth() + 1;
    let date = dateObject.getDate() < 10 ? `0${dateObject.getDate()}` : dateObject.getDate();

    return `${date}/${month}/${dateObject.getFullYear()} ${
        hours ? hours : 12
    }:${minutes} ${meridiem} `;
};

export const displayTime = (dateValue) => {
    const dateObject = dateFormat(dateValue);
    let minutes = '';
    if (dateObject.getMinutes() < 10) {
        minutes = '0' + dateObject.getMinutes();
    } else {
        minutes = dateObject.getMinutes();
    }
    return `${dateObject.getHours()}:${minutes}`;
};

export const getDate = (dateValue) => {
    const dateObject = dateFormat(dateValue);
    return dateObject.getDate();
};

export const getYear = (dateValue) => dateValue.slice(0, 4);

export const getTime = (dateValue) => {
    const hour = dateValue.slice(8, 10);
    const minute = dateValue.slice(10, 12);

    return `${hour}: ${minute}`;
};

export const getArabicTime = (dateValue) => {
    const hour = dateValue.slice(8, 10);
    const minute = dateValue.slice(10, 12);

    return `${minute} : ${hour}`;
};

export const getMonthText = (dateValue) => monthNames[parseInt(dateValue.slice(4, 6)) - 1];
export const getShortMonthText = (dateValue) =>
    shortMonthNames[parseInt(dateValue.slice(4, 6)) - 1];
export const getArabicMonthText = (dateValue) => arabicMonths[parseInt(dateValue.slice(4, 6)) - 1];

export const getFullDateText = (dateValue) => {
    return dateValue
        ? `${getDate(dateValue)} ${getMonthText(dateValue)}, ${getYear(dateValue)} / ${getTime(
              dateValue
          )} `
        : '';
};

export const getArabicFullDateText = (dateValue) => {
    return dateValue
        ? `${getDate(dateValue)} ${getArabicMonthText(dateValue)}, ${getYear(
              dateValue
          )} / ${getArabicTime(dateValue)} `
        : '';
};

export const getShortFullDate = (dateValue) => {
    return (
        dateValue && `${getDate(dateValue)} ${getShortMonthText(dateValue)} ${getYear(dateValue)}`
    );
};

export const getArabicShortFullDate = (dateValue) => {
    return (
        dateValue && `${getDate(dateValue)} ${getArabicMonthText(dateValue)} ${getYear(dateValue)}`
    );
};

// Time with AM and PM
export const displayDetailedTime = (dateValue, lang = { langKey: 'EN' }) => {
    const dateObject = dateFormat(dateValue);
    let AM = lang.langKey == 'AR' ? 'ص' : 'AM';
    let PM = lang.langKey == 'AR' ? 'م' : 'PM';
    let meridiem = dateObject.getHours() > 11 ? PM : AM;
    let minutes = '';
    if (dateObject.getMinutes() < 10) {
        minutes = '0' + dateObject.getMinutes();
    } else {
        minutes = dateObject.getMinutes();
    }
    return `${dateObject.getHours()}:${minutes} ${meridiem} `;
};

export const getUrlDate = (lang) => {
    // get yaer and month from url
    // eg. ?year=2021&month=2 >> {year : 2021, month: 0 ,curMonthText : 'February', prevMonthText: 'January' }
    let today = new Date();

    let month = today.getMonth() + 1;
    let year = today.getFullYear();
    let quarter = null;

    let curMonthText = '';
    let prevMonthText = '';

    //  m : monthly (default) q: quarterly y: yearly
    let reportMode = 3;

    if (typeof window !== 'undefined') {
        const parsed = queryString.parse(window.location.search);

        if (parsed.year && !isNaN(parsed.year)) {
            year = parsed.year;
            if (!parsed.month && !parsed.quarter) {
                reportMode = 6;
                month = 12;
            }
        }

        if (parsed.month && !isNaN(parsed.month)) {
            month = parsed.month;
            reportMode = 3;
        }
        if (parsed.quarter && !isNaN(parsed.quarter)) {
            quarter = parsed.quarter;
            reportMode = 4;
            month = quarter * 3;
        }
    }

    let currMonthIndex = month - 1;
    let prevMonthIndex = month - 2 < 0 ? 11 : month - 2;
    curMonthText =
        lang && lang.langKey == 'AR' ? arabicMonths[currMonthIndex] : monthNames[currMonthIndex];
    prevMonthText =
        lang && lang.langKey == 'AR' ? arabicMonths[prevMonthIndex] : monthNames[prevMonthIndex];

    return { year, month, quarter, curMonthText, prevMonthText, reportMode };
};

export const firstDay = (year, month) => new Date(year, month - 1, 1);
export const lastDay = (year, month) => new Date(year, month, 0);
export const dateToDateString = (date) =>
    // date obejct >> 20210228
    `${date.getFullYear()}${
        date.getMonth() + 1 < 10 ? '0' + (date.getMonth() + 1) : date.getMonth() + 1
    }${date.getDate() < 10 ? '0' + date.getDate() : date.getDate()}`;

export const getFirstAndLastDay = (year, month) => {
    let firstDayOfMonth = firstDay(year, month);
    let lastDayOfMonth = lastDay(year, month);

    return {
        firstDayOfMonth: dateToDateString(firstDayOfMonth),
        lastDayOfMonth: dateToDateString(lastDayOfMonth),
    };
};

export const epochToDate = (epochTimeStamp) => {
    // 1618470660000 >> 2021-03-15
    let date = new Date(0);
    date.setUTCSeconds(epochTimeStamp);
    return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()}`;
};

export const epochToShortDate = (epochTimeStamp, lang) => {
    // 1618470660000 >> Mar-15
    let date = new Date(0);
    date.setUTCSeconds(epochTimeStamp);
    return `${
        lang && lang.langKey == 'AR'
            ? arabicMonths[date.getMonth()]
            : shortMonthNames[date.getMonth()]
    }-${date.getDate()}`;
};

export const displayTimeWithSeconds = (dataValue, lang = { langKey: 'EN' }) => {
    const dateObject = dateFormat(dataValue);
    let AM = lang.langKey == 'AR' ? 'ص' : 'AM';
    let PM = lang.langKey == 'AR' ? 'م' : 'PM';
    let meridiem = dateObject.getHours() > 11 ? PM : AM;
    let hour = dataValue.slice(8, 10);
    let minute = dataValue.slice(10, 12);
    let second = dataValue.slice(12, 14);
    return `${hour}:${minute}:${second}  ${meridiem}`;
};

export const getStartDateAndEndDate = (reportMode, year, month, quarter) => {
    if (reportMode === 3) {
        const { firstDayOfMonth, lastDayOfMonth } = getFirstAndLastDayOfMonth(year, month);
        return { SD: firstDayOfMonth, ED: lastDayOfMonth };
    } else if (reportMode === 4) {
        const { firstDayOfQuarter, lastDayOfQuarter } = getFirstAndLastDayofQuarter(year, quarter);
        return { SD: firstDayOfQuarter, ED: lastDayOfQuarter };
    } else if (reportMode === 6) {
        const { firstDayOfYear, lastDayOfYear } = getFirstAndLastDayofYear(year);
        return { SD: firstDayOfYear, ED: lastDayOfYear };
    }

    return { SD: null, ED: null };
};

export const getFirstAndLastDayOfMonth = (year, month) => {
    let firstDayOfMonth = firstDay(year, month);
    let lastDayOfMonth = lastDay(year, month);

    return {
        firstDayOfMonth: dateToDateString(firstDayOfMonth),
        lastDayOfMonth: dateToDateString(lastDayOfMonth),
    };
};

const getFirstAndLastDayofQuarter = (year, quarter) => {
    if (quarter && quarter <= 4 && quarter >= 1) {
        let quarterIndex = quarter - 1;
        let firstDate = new Date(year, quarterIndex * 3, 1);
        let endDate = new Date(firstDate.getFullYear(), firstDate.getMonth() + 3, 0);

        return {
            firstDayOfQuarter: dateToDateString(firstDate),
            lastDayOfQuarter: dateToDateString(endDate),
        };
    } else {
        return {
            firstDayOfQuarter: null,
            lastDayOfQuarter: null,
        };
    }
};
const getFirstAndLastDayofYear = (year) => {
    let yearInt = parseInt(year);
    let firstDate = new Date(yearInt, 0, 1);
    let endDate = new Date(yearInt + 1, 0, 0);

    return {
        firstDayOfYear: dateToDateString(firstDate),
        lastDayOfYear: dateToDateString(endDate),
    };
};
