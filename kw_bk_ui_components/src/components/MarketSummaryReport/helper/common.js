export const formatAsCurrency = (value) =>
    value && value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export const formatYAxisValues = (value, lang) => {
    if (value && !isNaN(value)) {
        if (value > 999999) {
            let displayValue = value / 1000000;
            return lang && lang.langKey == 'AR'
                ? `${displayValue} مليون`
                : `${displayValue} million`;
        } else {
            return formatAsCurrency(value);
        }
    } else {
        return value;
    }
};

export const formatToolTipValues = (value) => {
    return formatAsCurrency(value);
};
