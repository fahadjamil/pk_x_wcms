import naturalCompare from 'natural-compare';
import moment from 'moment';

// Only provide sorting for ascending order - Desending order is handeld by table component level;
// only use 1, 0 or -1 as return values; 
// Use minimal sorting function as posiible
export function sortCompareValues(a, b, type){
    switch (type) {
        case 'number':
        case 'price':
            if(a && b && a.value && b.value){
                let valueA = a.value;
                let valueB = b.value;
                try {
                    valueA = Number(valueA);
                    valueB = Number(valueB);
                } catch (error) {
                    console.log('Sort error', error);
                }

                if(valueA > valueB){
                    return 1;
                }

                if(valueA < valueB){
                    return -1;
                }

                return 0;
            }else{
                return 0;
            }
        case 'date':
            if(a && b && a.value && b.value){
                let valueA = a.value;
                let valueB = b.value;

                try {
                    const dateA = moment(a.value, 'DD/MM/YYYY');
                    const dateB = moment(b.value, 'DD/MM/YYYY');

                    if(dateA.isValid() && dateB.isValid()){
                        valueA = parseInt(dateA.format('x'), 10);
                        valueB = parseInt(dateB.format('x'), 10);

                        if(valueA > valueB){
                            return 1;
                        }
        
                        if(valueA < valueB){
                            return -1;
                        }

                        return 0;
                    }else if(dateA.isValid()){
                        return 1;
                    }else if(dateB.isValid()){
                        return -1;
                    }else{
                        return 0;
                    }


                } catch (error) {
                    console.log('Sort error', error);
                }

                return 0;
            }
            else{
                return 0;
            }
        case 'link':
            if(a && b && a.value && b.value && a.value.text && b.value.text){
                let valueA = a.value.text;
                let valueB = b.value.text;
                try {
                    return naturalCompare(valueA,valueB);
                } catch (error) {
                    console.log('Sort error', error);
                }

                return 0;
            }else{
                return 0;
            }
        case 'icon':
            return 0;
        case 'text':
        case 'ticker':
        case 'stock':
        default:
            if(a && b && a.value && b.value){
                try {
                    return naturalCompare(a.value, b.value);
                } catch (error) {
                    console.log('Sort error', error);
                }

                return 0;
            }else{
                return 0;
            }
    }
}