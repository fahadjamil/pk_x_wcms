import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { marketBackEndProxyPass } from '../../../../../config/path';
import { getUrlDate } from '../../../../../helper/date';
import { TopActiveStockByTrades } from './TopActiveStockByTrades';
import { TopActiveStockByValue } from './TopActiveStockByValue';
import { TopActiveStockByVolume } from './TopActiveStockByVolume';

const ActiveStocksWrapper = styled.div`
    margin: 20px 0;
`;
const TopStockWrapper = styled.div`
    margin: 20px 0;
`;
export const TopStocks = (props) => {
    const { lang } = props;
    const [topStocksData, setTopStocksData] = useState({});
    const { year, month, curMonthText, prevMonthText, reportMode } = getUrlDate(lang);
    const convertByLang = (arText, enText) => (lang.langKey === 'AR' ? arText : enText);

    useEffect(() => {
        Axios.get(marketBackEndProxyPass(), {
            params: {
                RT: 3568,
                Y: year,
                M: month,
                L: 'E',
                T: reportMode,
            },
        }).then((res) => {
            if (res && res.data) {
                setTopStocksData(res.data);
            }
        });
    }, []);
    const headingAr = 'الخمس أسهم أكثر نشاطاً';
    const headeingEn = '5 Most Active Stocks';
    return topStocksData && topStocksData != {} ? (
        <ActiveStocksWrapper>
            {topStocksData != {} ? (
                <h2>{convertByLang(headingAr, headeingEn)}</h2>
            ) : (
                <React.Fragment></React.Fragment>
            )}
            <TopStockWrapper>
                <TopActiveStockByValue
                    lang={lang}
                    tableData={topStocksData.Value}
                    title={convertByLang('حسب السعر', 'By Price')}
                ></TopActiveStockByValue>
            </TopStockWrapper>
            <TopStockWrapper>
                <TopActiveStockByVolume
                    lang={lang}
                    tableData={topStocksData.Volume}
                    title={convertByLang('حسب القيمة', 'By Value')}
                ></TopActiveStockByVolume>
            </TopStockWrapper>

            <TopStockWrapper>
                <TopActiveStockByTrades
                    lang={lang}
                    tableData={topStocksData.Transactions}
                    title={convertByLang('حسب الصفقات', 'By Transaction')}
                ></TopActiveStockByTrades>
            </TopStockWrapper>
        </ActiveStocksWrapper>
    ) : (
        <React.Fragment></React.Fragment>
    );
};
