import React, { useState, useEffect, Fragment } from 'react';
import { TableUiComponent } from '../TableComponent';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';
import Axios from 'axios';
import { marketBackEndProxyPass, oldMarketBackEndProxyPass } from '../../../config/path';
import { stockProfileLink } from '../../../config/constants';
import { _getHeaderIndexList, setLanguage } from '../../../helper/metaData';
import { ExportButton } from '../../ExportPrintButtons/ExportButton';
import { PrintButton } from '../../ExportPrintButtons/PrintButton';
import styled from 'styled-components';
import * as constants from '../../../config/constants';

const ButtonDiv = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-bottom: 5px;
`;

export const ListedCompanies = (props) => {
    const { commonConfigs, lang } = props;

    const [tableData, setTableData] = useState([]);
    const [sectors, setSectors] = useState([]);
    const [subMarkets, setSubMarkets] = useState([]);
    const [lossData, setLossData] = useState({});

    useEffect(() => {
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
            if (res.data.DAT.SRC) {
                let secArray = {};
                res.data.DAT.SRC.SCTD.forEach((item) => {
                    secArray[item.split('|')[0]] = item.split('|')[1];
                });
                setSectors(secArray);

                let subMktArray = {};
                res.data.DAT.SRC.SMD.forEach((item) => {
                    subMktArray[item.split('|')[0]] = item.split('|')[1];
                });
                setSubMarkets(subMktArray);
            }
        });
    }, []);

    useEffect(() => {
        Axios.get(marketBackEndProxyPass(), {
            params: { RT: 3550, L: setLanguage(lang) },
        }).then((res) => {
            if (res.data) {
                setLossData(res.data);
            }
        });
    }, []);

    useEffect(() => {
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
        }).then((res) => {
            if (res.data.HED && res.data.DAT) {
                if (res.data.DAT.TD) {
                    let headerFields = [
                        'SYMBOL',
                        'SYMBOL_DESCRIPTION',
                        'MARKET_ID',
                        'SECTOR',
                        'LISTING_DATE',
                        'COMPANY_CODE',
                        'SHRT_DSC',
                    ];

                    let symHedIdxList = _getHeaderIndexList(res.data.HED.TD, headerFields);

                    let filteredRegularSymbol = res.data.DAT.TD.filter(
                        (participant) => participant.split('|')[1].split('`')[1] == 'R'
                    );

                    let finalData = filteredRegularSymbol.map((participant, index) => {
                        let fields = participant.split('|');
                        return {
                            // num: index + 1,
                            sec: fields[symHedIdxList.COMPANY_CODE],
                            sector: Object.keys(sectors).length
                                ? getSectorName(fields[symHedIdxList.SECTOR])
                                : fields[symHedIdxList.SECTOR],
                            ticker: fields[symHedIdxList.SHRT_DSC],
                            name: {
                                text: fields[symHedIdxList.SYMBOL_DESCRIPTION],
                                link: stockProfileLink(fields[symHedIdxList.COMPANY_CODE], lang),
                            },
                            marketSegmant: Object.keys(subMarkets).length
                                ? getMarketSegmantName(fields[symHedIdxList.MARKET_ID])
                                : fields[symHedIdxList.MARKET_ID],
                            accLoss: Object.keys(lossData).length
                                ? getAccLoss(fields[symHedIdxList.COMPANY_CODE])
                                : '--',
                            listDate: fields[symHedIdxList.LISTING_DATE],
                        };
                    });

                    let sortedData = finalData.sort((a, b) => {
                        if (b.sec == null || isNaN(b.sec)) {
                            return 1;
                        } else if (a.sec == null || isNaN(a.sec)) {
                            return 0;
                        } else {
                            return parseInt(a.sec) - parseInt(b.sec);
                        }
                    });

                    setTableData(sortedData);
                }
            }
        });
    }, [sectors, lossData, subMarkets]);

    const getMarketSegmantName = (value) => {
        return subMarkets[value];
    };
    const getSectorName = (value) => {
        return sectors[value];
    };

    const getAccLoss = (value) => {
        if (lossData) {
            if (
                lossData['Fifty To Seventyfive'].filter((e) => {
                    return e.Stk === value.toString();
                }).length
            ) {
                return 'orange';
            } else if (
                lossData['More Than Seventyfive'].filter((e) => {
                    return e.Stk === value.toString();
                }).length
            ) {
                return 'red';
            } else {
                return '';
            }
        }
    };

    let componentSettingsListofParticipants = {
        columns: [
            {
                columnName: lang.langKey === 'AR' ? '#رقم' : '#No',
                mappingField: 'sec',
                dataType: 'autoIncrement',
            },
            {
                columnName: lang.langKey === 'AR' ? 'رقم السهم' : 'Sec. Code',
                dataType: 'text',
                mappingField: 'sec',
            },
            {
                columnName: lang.langKey === 'AR' ? 'اسم السهم' : 'Ticker',
                dataType: 'ticker',
                mappingField: 'ticker',
            },
            {
                columnName: '',
                dataType: 'lossCategory',
                mappingField: 'accLoss',
            },
            {
                columnName: lang.langKey === 'AR' ? 'الإسم' : 'Name',
                dataType: 'link',
                mappingField: 'name',
            },
            {
                columnName: lang.langKey === 'AR' ? 'القطاع' : 'Sector',
                dataType: 'text',
                mappingField: 'sector',
            },
            {
                columnName: lang.langKey === 'AR' ? 'السوق' : 'Market Segment',
                dataType: 'text',
                mappingField: 'marketSegmant',
            },
            {
                columnName: lang.langKey === 'AR' ? "تاريخ الإدراج" : 'Date of Listing',
                dataType: 'date',
                mappingField: 'listDate',
            },
        ],
        showColumnTitle: true,
        httpRequest: {
            header: {},
        },
        rawData: tableData,
        id: 'table',
    };

    return commonConfigs && commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="Listed Companies" />
    ) : (
        <Fragment>
            <ButtonDiv>
                <ExportButton
                    title={
                        lang.langKey == 'EN' || lang.langKey == 'en'
                            ? 'Listed Companies'
                            : 'الشركات المدرجة'
                    }
                    id="ua-lang"
                    orientation="l"
                    format="a4"
                    type={constants.XLSX}
                    lang={lang.langKey}
                />
                <PrintButton
                    title={
                        lang.langKey == 'EN' || lang.langKey == 'en'
                            ? 'Listed Companies'
                            : 'الشركات المدرجة'
                    }
                    id="ua-lang"
                    orientation="l"
                    format="a4"
                    lang={lang.langKey}
                    autoPrint={true}
                />
                <ExportButton
                    title={
                        lang.langKey == 'EN' || lang.langKey == 'en'
                            ? 'Listed Companies'
                            : 'الشركات المدرجة'
                    }
                    id="ua-lang"
                    orientation="l"
                    format="a4"
                    type={constants.PDF}
                    lang={lang.langKey}
                />
            </ButtonDiv>
            <TableUiComponent
                componentSettings={componentSettingsListofParticipants}
            ></TableUiComponent>
        </Fragment>
    );
};
