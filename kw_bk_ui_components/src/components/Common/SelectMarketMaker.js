import Axios from 'axios';
import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { marketBackEndProxyPass } from '../../config/path';
import { _getHeaderIndexList } from '../../helper/metaData';

const StyledSelect = styled.select`
    height: 100%;
    width: ${(props) => (props.width ? props.width : '300px')};
    ${(props) => (props.styles ? props.styles : '')}
`;
// props : value , lang ("AR" or "EN"), callback function
export const SelectMarketMaker = (props) => {
    const [listOfSecurities, setListofSecurities] = useState([]);
    const { value, lang, callback, width, styles } = props;

    useEffect(() => {
        Axios.get(marketBackEndProxyPass(), {
            params: { RT: 3562, L: lang },
        }).then((res) => {
            handleMMFrirmId(res.data);
        });
    }, []);
    const changeMarketMaker = (newSecurity) => callback(newSecurity);
    const handleMMFrirmId = (data) => {
        let mmArray = [];
        data.forEach((element) => {
            let id = element.MMFirmId;
            let firm = element.MMfirm;
            let obj = {
                MMFirmId: id.trim(),
                MMfirm:
                    lang == 'E'
                        ? firm.replace(' - Market Maker', '')
                        : firm.replace(' صانع سوق -', ''),
            };
            mmArray.push(obj);
        });
        setListofSecurities(mmArray);
    };

    return (
        <StyledSelect
            onChange={(event) => changeMarketMaker(event.target.value)}
            value={value || ''}
            width={width}
            styles={styles}
        >
            <option value=''>{lang == 'E' ? 'All Market Makers' : 'كل صانع سوق'}</option>
            {listOfSecurities.map((stock, stockIndex) => (
                <option value={stock.MMFirmId} key={stockIndex}>
                    {stock.MMfirm}
                </option>
            ))}
        </StyledSelect>
    );
};
