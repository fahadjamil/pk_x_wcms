import Axios from 'axios';
import React, { useState, useEffect } from 'react';
import { listedCompaniesLink } from '../config/constants';
import { marketBackEndProxyPass } from '../config/path';

export const useREITsID = (langKey) => {
    const [reitsID, setREITsID] = useState(null);
    const [lang, setLang] = useState(langKey || 'en');

    const redirectToListedCompanies = () => {
        window.location = listedCompaniesLink(lang);
        console.log('Redirecting to listed companies');
    };

    useEffect(() => {
        if (
            !langKey &&
            window &&
            window.location &&
            window.location.pathname &&
            window.location.pathname.includes('/ar/')
        ) {
            setLang('ar');
        }

        // Get the hash value from URL
        let hashValue = window.location.hash;
        let tempID = hashValue.substring(1);

        if (tempID && !isNaN(tempID)) {
            Axios.get(marketBackEndProxyPass(), {
                params: {
                    RT: 3561,
                    SYMC: tempID,
                },
            }).then((res3561) => {
                // check if symbol is REITs
                if (res3561 && res3561.data && res3561.data[0] && res3561.data[0].MarketId != 'T') {
                    redirectToListedCompanies();
                } else {
                    setREITsID(tempID);
                }
            });
        }
    }, []);

    return reitsID;
};
