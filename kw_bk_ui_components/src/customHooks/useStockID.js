import Axios from 'axios';
import React, { useState, useEffect } from 'react';
import { reitsListLink } from '../config/constants';
import { marketBackEndProxyPass } from '../config/path';

export const useStockID = (langKey) => {
    const [stockID, setStockID] = useState(null);
    const [lang, setLang] = useState(langKey || 'en');

    //Set the redirection paths with the language

    const redirectToREITsList = () => {
        window.location = reitsListLink(lang);
    };

    useEffect(() => {
        if (!stockID) {
            // Get the hash value from URL
            let hashValue = window.location.hash;
            let tempID = hashValue.substring(1);

              // Set the lang for redirects
              if (
                !langKey &&
                window &&
                window.location &&
                window.location.pathname &&
                window.location.pathname.includes('/ar/')
            ) {
                setLang('ar');
            }

            Axios.get(marketBackEndProxyPass(), {
                params: {
                    RT: 3561,
                    SYMC: tempID,
                },
            })
                .then((res) => {

                     // check if symbol is REITs
                     if (
                        res &&
                        res.data &&
                        res.data[0] &&
                        res.data[0].MarketId == 'T'
                    ) {
                        redirectToREITsList();
                    }
                    return tempID;
                })

                .then((tempID) => {
                    setStockID(tempID);
                });
        }
    }, []);

    return stockID;
};
