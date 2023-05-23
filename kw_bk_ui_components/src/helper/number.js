import React from 'react';

export const figureFormat = (x) => {
    let val = decimalCount(x) > 3 ? Number(x).toFixed(3) : x;

    return val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
}

const decimalCount = (num) => {
    // Convert to String
    const numStr = String(num);
    // String Contains Decimal
    if (numStr.includes('.')) {
        return numStr.split('.')[1].length;
    }
    // String Does Not Contain Decimal
    return 0;
}