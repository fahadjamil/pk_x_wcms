export const _getHeaderIndexList = (headerObj, headerFields) => {
    let TDvalues = headerObj.split('|');
    let headerIndex = headerFields.reduce(
        (prev, header) => ({
            ...prev,
            [header]: TDvalues.indexOf(header),
        }),
        {}
    );
    return headerIndex;
};

export const setLanguage = (langData) => {
    switch (langData.langKey) {
        case 'AR':
            return 'A';
        case 'EN':
            return 'E';
        default:
            return 'E';
    }
};

export const dateForURL = (date) => {
    let temp = date.split('-');
    if (temp[2].length < 2) {
        temp[2] = `0${temp[2]}`;
    }
    return temp.join('');
};

export const marketMapping = (marketName) => {
    switch (marketName.toLowerCase()) {
        case 'premier':
            return 'P';
        case 'main':
            return 'M';
        case 'all':
            return 'A';
        default:
            return '';
    }
};

export const periodMapping = (period) => {
    switch (period.toLowerCase()) {
        case 'daily':
            return 1;
        case 'weekly':
            return 2;
        case 'monthly':
            return 3;
        case 'quarterly':
            return 4;
        default:
            return '';
    }
};

export const modeMapping = (mode) => {
    switch (mode) {
        case 1:
            return 'Gainers';
        case 3:
            return 'Losers';
        case 4:
            return 'Volume';
        case 6:
            return 'Value';
        default:
            return '';
    }
};