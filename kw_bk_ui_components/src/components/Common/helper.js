export const formatAsCurrency = (value) => value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

export const formatYAxisValues = (value) => {
    if (value && !isNaN(value)) {
        if (value > 999999) {
            return `${value / 1000000} million`;
        } else {
            return formatAsCurrency(value);
        }
    } else {
        return value;
    }
};
