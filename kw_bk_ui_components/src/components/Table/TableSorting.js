import naturalCompare from 'natural-compare';
import moment from 'moment';

// Only provide sorting for ascending order - Desending order is handeld by table component level;
// only use 1, 0 or -1 as return values;
// Use minimal sorting function as posiible
export function sortCompareValues(a, b, type) {
    switch (type) {
        case 'dateTime':
        case 'date':
        case 'price':
        case 'number':
            if (a && b && a.value && b.value) {
                let valueA = a.value;
                let valueB = b.value;
                try {
                    valueA = Number(valueA);
                    valueB = Number(valueB);
                } catch (error) {
                    console.log('Sort error', error);
                }

                if (valueA > valueB) {
                    return 1;
                }

                if (valueA < valueB) {
                    return -1;
                }

                return 0;
            } else {
                return 0;
            }
        case 'newsLink':
        case 'link':
            if (a && b && a.value && b.value && a.value.text && b.value.text) {
                let valueA = a.value.text;
                let valueB = b.value.text;
                try {
                    return naturalCompare(valueA, valueB);
                } catch (error) {
                    console.log('Sort error', error);
                }

                return 0;
            } else {
                return 0;
            }
        case 'autoIncrement':
        case 'custom':
            return 0;
        case 'lossCategory':
            return 0;
        case 'monthYear':
            if (a && b && a.value && b.value) {
                let valueA = a.value;
                let valueB = b.value;
                try {
                    valueA = Number(valueA);
                    valueB = Number(valueB);
                } catch (error) {
                    console.log('Sort error', error);
                }

                if (valueA > valueB) {
                    return 1;
                }

                if (valueA < valueB) {
                    return -1;
                }

                return 0;
            } else {
                return 0;
            }
        default:
            if (a && b && a.value && b.value) {
                try {
                    return naturalCompare(a.value, b.value);
                } catch (error) {
                    console.log('Sort error', error);
                }

                return 0;
            } else {
                return 0;
            }
    }
}
