import moment from 'moment';

const DATE_TIME_FORMAT = 'YYYY-MM-DD, hh:mm:ss a';

export function getFormattedDateTimeString(date: Date | undefined, dateFormat: string = '') {
    if (date) {
        let dateFormatConfiguration = DATE_TIME_FORMAT;
        if (dateFormat && dateFormat !== '') {
            dateFormatConfiguration = dateFormat;
        }
        const formatedDate = moment(date).format(dateFormatConfiguration);
        return formatedDate;
    } else {
        return '';
    }
}

// Return YYYYMMDD formatted date
export function getFormattedDateString(date: Date | undefined) {
    if (date) {
        if (typeof date === 'string') {
            const dateObj = new Date(date);
            const selectedFullYear = dateObj.getFullYear();
            const selectedMonth = ('0' + (dateObj.getMonth() + 1)).slice(-2);
            const selectedDate = ('0' + dateObj.getDate()).slice(-2);
            const formattedDate = selectedFullYear + selectedMonth + selectedDate;

            return formattedDate;
        } else {
            const selectedFullYear = date.getFullYear();
            const selectedMonth = ('0' + (date.getMonth() + 1)).slice(-2);
            const selectedDate = ('0' + date.getDate()).slice(-2);
            const formattedDate = selectedFullYear + selectedMonth + selectedDate;

            return formattedDate;
        }
    } else {
        return '';
    }
}
