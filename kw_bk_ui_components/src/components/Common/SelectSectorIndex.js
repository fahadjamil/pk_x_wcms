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
export const SelectSectorIndex = (props) => {
    const [listofSectorIndices, setListofSectorIndices] = useState([]);
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
                RT: 302,
                SRC: 'KSE',
            },
        }).then((res) => {
            if (res.data.HED && res.data.DAT) {
                if (res.data.DAT.SCTD) {
                    let sectorHeaderFields = ['SECTOR'];
                    let sectorHedIdxList = _getHeaderIndexList(
                        res.data.HED.SCTD,
                        sectorHeaderFields
                    );

                    let allSectors = res.data.DAT.SCTD.map(
                        (sect) => sect.split('|')[sectorHedIdxList.SECTOR]
                    );
                    let indexHeaderFields = ['SYMBOL', 'SYMBOL_DESCRIPTION'];
                    let indexHedIdxList = _getHeaderIndexList(res.data.HED.ID, indexHeaderFields);
                    let allSectorIndices = res.data.DAT.ID.filter((index) =>
                        allSectors.includes(index.split('|')[indexHedIdxList.SYMBOL])
                    );

                    let result = allSectorIndices.map((index) => {
                        let fields = index.split('|');
                        return {
                            value: fields[indexHedIdxList.SYMBOL],
                            name: fields[indexHedIdxList.SYMBOL_DESCRIPTION],
                        };
                    });
                    setListofSectorIndices(result);
                }
            }
        });
    }, []);
    const changeSecurity = (newSecurity) => callback(newSecurity);

    return (
        <StyledSelect
            width={width}
            styles={styles}
            onChange={(event) => changeSecurity(event.target.value)}
            value={value || 'ALL'}
        >
            <option value="ALL">All Sector Indices</option>
            {listofSectorIndices.map((sectorIndex, key) => (
                <option value={sectorIndex.value} key={key}>
                    {sectorIndex.name}
                </option>
            ))}
        </StyledSelect>
    );
};
