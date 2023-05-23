import Axios from 'axios';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { oldMarketBackEndProxyPass } from '../../config/path';
import { _getHeaderIndexList } from '../../helper/metaData';

const StyledSelect = styled.select`
    height: 100%;
    width: ${(props) => (props.width ? props.width : '300px')};
    ${(props) => (props.styles ? props.styles : '')}
`;
// props : value , lang ("AR" or "EN"), callback function
export const SelectSecurity = (props) => {
    const [listOfSecurities, setListofSecurities] = useState([]);
    const { value, lang, callback, width, styles } = props;

    useEffect(() => {
        Axios.get(oldMarketBackEndProxyPass(), {
            params: {
                UID: '3166765',
                SID: '3090B191-7C82-49EE-AC52-706F081F265D',
                L: lang,
                UNC: 0,
                UE: 'KSE',
                H: 1,
                M: 1,
                RT: 303,
                SRC: 'KSE',
                AS: 1,
            },
        }).then((res) => {
            if (res.data.HED && res.data.DAT) {
                if (res.data.DAT.TD) {
                    let headerFields = [
                        'COMPANY_CODE',
                        'SYMBOL_DESCRIPTION',
                        'SYMBOL',
                        'MARKET_ID',
                    ];
                    let symHedIdxList = _getHeaderIndexList(res.data.HED.TD, headerFields);

                    let tempList = res.data.DAT.TD.filter(
                        (stock) =>
                            stock.split('|')[symHedIdxList.SYMBOL].split('`')[1] == 'R' ||
                            stock.split('|')[symHedIdxList.MARKET_ID] == 'T'
                    );

                    setListofSecurities(
                        tempList.map((stock) => {
                            let fields = stock.split('|');

                            return {
                                name: fields[symHedIdxList.SYMBOL_DESCRIPTION],
                                stockRef: fields[symHedIdxList.COMPANY_CODE],
                            };
                        })
                    );
                }
            }
        });
    }, []);
    const changeSecurity = (newSecurity) => callback(newSecurity);

    return (
        <StyledSelect
            onChange={(event) => changeSecurity(event.target.value)}
            value={value || 'ALL'}
            width={width}
            styles={styles}
        >
            <option value="ALL">{lang == 'EN' ? 'All Securities' : 'كل الأسهم'}</option>
            {listOfSecurities.map((stock, stockIndex) => (
                <option
                    value={stock.stockRef}
                    key={stockIndex}
                >{`${stock.stockRef} : ${stock.name}`}</option>
            ))}
        </StyledSelect>
    );
};
