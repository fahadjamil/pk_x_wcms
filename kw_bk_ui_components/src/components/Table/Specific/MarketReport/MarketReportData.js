import Axios from 'axios';
import React, { useEffect, useState} from 'react';
import { marketBackEndProxyPass } from "../../../../config/path";
import { setLanguage, marketMapping, periodMapping, modeMapping } from "../../../../helper/metaData";
import { useURLMoreParam } from "../../../../customHooks/useURLparam";

export const MarketReportData = (props, compName) => {
    const { data, lang } = props;

    const urlParams = useURLMoreParam();
    const period = periodMapping(urlParams ? urlParams[0] : '1');
    const market = marketMapping(urlParams ? urlParams[1] : 'P');
    const mode  = modeMapping((data && data.settings && data.settings.mode && data.settings.mode.value) || 1);

    const [reportData, setReportData] = useState([]);

    useEffect(() => {
        if (period && market) {
            Axios.get(marketBackEndProxyPass(), {
                params: {
                    L: setLanguage(lang),
                    DT: period,
                    MT: market,
                    RT: 3522
                },
            }).then((res) => {
                setReportData(compName === 'Tops Stocks' ? res.data[compName][0][mode] : compName === 'Market Summary' ? res.data[compName][0] : res.data[compName]);
            });
        }
    } ,[period, market]);

    return reportData;
};
