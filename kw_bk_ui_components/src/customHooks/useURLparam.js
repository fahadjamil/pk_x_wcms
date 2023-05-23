import React, { useState, useEffect } from 'react';

export const useURLparam = () => {
    const [stockID, setStockID] = useState(null);

    useEffect(() => {
        if (!stockID) {
            let hashValue = window.location.hash;
            let tempID = hashValue.substring(1);
            setStockID(tempID);
        }
    }, []);
    return stockID;
};

export const useURLMoreParam = () => {
    const [params, setParams] = useState(null);

    useEffect(() => {
        if (!params) {
            let hashValue = window.location.hash;
            let hashParams = hashValue ? hashValue.substring(1) : undefined;
            let paramsArray = hashParams ? hashParams.split("-") : undefined;

            setParams(paramsArray);
        }
    },[]);

    return params;
};
