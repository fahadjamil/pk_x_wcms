import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { stockProfileLink } from '../../config/constants';
import { marketBackEndProxyPass, oldMarketBackEndProxyPass } from '../../config/path';
import { _getHeaderIndexList } from '../../helper/metaData';
import { SpecificPreviewComponent } from '../SpecificPreviewComponent';
import { Filters } from './Filters';
import { Results } from './Results';

export const StockScreenerNew = (props) => {
    const {
        lang,
        data: { settings },
        commonConfigs,
    } = props;
    // Storing all stock data received from services in stockData state
    const [stockData, setStockData] = useState([]);
    const [sectorData, setSectorData] = useState([]);

    // Storing filtered stock data to display as results in filteredStockData state
    const [filteredStockData, setFilteredStockData] = useState([]);
    useEffect(() => {
        // Fetching RT 306 from legacy mix service
        Axios.get(oldMarketBackEndProxyPass(), {
            params: {
                UID: '3166765',
                SID: '3090B191-7C82-49EE-AC52-706F081F265D',
                L: lang.langKey,
                UNC: 0,
                UE: 'KSE',
                H: 1,
                M: 1,
                RT: 306,
                SRC: 'KSE',
                AS: 1,
            },
        }).then((res) => {
            if (
                res.data &&
                res.data.DAT.SRC &&
                res.data.DAT.SRC.SCTD &&
                res.data.HED &&
                res.data.HED.SRC &&
                res.data.HED.SRC.SCTD
            ) {
                let sectorHeaderFields = ['SECTOR', 'SECT_DSC'];
                let sectorSymHedIdxList = _getHeaderIndexList(
                    res.data.HED.SRC.SCTD,
                    sectorHeaderFields
                );

                let tempSectorData = res.data.DAT.SRC.SCTD.map((sect) => {
                    let sectorFields = sect.split('|');
                    return {
                        sectorID: sectorFields[sectorSymHedIdxList.SECTOR],
                        sectorName: sectorFields[sectorSymHedIdxList.SECT_DSC],
                    };
                });
                setSectorData(tempSectorData);
                // Fetching RT 3535
                Axios.get(marketBackEndProxyPass(), { params: { RT: 3535 } }).then((res3535) => {
                    // Fetching RT 303 from legacy mix
                    Axios.get(oldMarketBackEndProxyPass(), {
                        params: {
                            UID: '3166765',
                            SID: '3090B191-7C82-49EE-AC52-706F081F265D',
                            L: lang.langKey,
                            UNC: 0,
                            UE: 'KSE',
                            H: 1,
                            M: 1,
                            RT: 303,
                            SRC: 'KSE',
                            AS: 1,
                        },
                    }).then((res303) => {
                        if (res303.data.HED && res303.data.DAT) {
                            if (res303.data.HED && res303.data.HED.TD) {
                                let headerFields = ['SYMBOL', 'SECTOR', 'COMPANY_CODE', 'SHRT_DSC'];

                                let symHedIdxList = _getHeaderIndexList(
                                    res303.data.HED.TD,
                                    headerFields
                                );

                                let tempStockData = [];
                                for (const [stockID, stockFinData] of Object.entries(
                                    res3535.data
                                )) {
                                    let stockInfo = res303.data.DAT.TD.find((security, index) => {
                                        let fields = security.split('|');
                                        let symbol =
                                            fields[symHedIdxList.SYMBOL] &&
                                            fields[symHedIdxList.SYMBOL].split('`');

                                        let symbolMarketType = symbol && symbol[1];
                                        return (
                                            stockID == fields[symHedIdxList.COMPANY_CODE] &&
                                            symbolMarketType == 'R'
                                        );
                                    });
                                    let ticker =
                                        stockInfo && stockInfo.split('|')[symHedIdxList.SHRT_DSC];
                                    let sectorIndex =
                                        stockInfo && stockInfo.split('|')[symHedIdxList.SECTOR];
                                    let sectorObject = tempSectorData.find(
                                        (sect) => sect.sectorID == sectorIndex
                                    );

                                    tempStockData.push({
                                        ticker: ticker,
                                        sector: (sectorObject && sectorObject.sectorName) || ' - ',
                                        sectorID: sectorIndex,
                                        stockID: stockID,
                                        symbol: {
                                            text: ticker,
                                            link: stockProfileLink(stockID, lang),
                                        },
                                        ...stockFinData,
                                    });
                                }

                                // filterout stocks without a ticker
                                let cleanStockData = tempStockData.filter((stock) => stock.ticker);
                                setStockData(cleanStockData);
                                // showing all stocks on init load
                                setFilteredStockData(cleanStockData);
                            }
                        }
                    });
                });
            }
        });
    }, []);


    return stockData.length > 0 ? (
        <div>
            <Filters
                stockData={stockData}
                setFilteredStockData={setFilteredStockData}
                lang={lang}
                sectorData={sectorData}
                numOfResults={filteredStockData.length}
                activeSearchBar={settings && settings.searchBar && settings.searchBar.value}
            ></Filters>
            <Results
                tableData={filteredStockData}
                lang={lang}
                activeManageColumns={
                    settings && settings.manageColumns && settings.manageColumns.value
                }
            ></Results>
        </div>
    ) : (
        <SpecificPreviewComponent title="Stock Screener" />
    );


};
