import Axios from 'axios';
import React, { useEffect, useState, Fragment } from 'react';
import { TableUiComponent } from '../TableComponent';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';
import { marketBackEndProxyPass, oldMarketBackEndProxyPass } from '../../../config/path';
import { _getHeaderIndexList, setLanguage } from '../../../helper/metaData';
import { stockProfileLink } from '../../../config/constants';
import { ExportButton } from '../../ExportPrintButtons/ExportButton';
import { PrintButton } from '../../ExportPrintButtons/PrintButton';
import styled from 'styled-components';
import * as constants from '../../../config/constants';

const ButtonDiv = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-bottom: 5px;
`;

export const ListOfParticipantsTable = (props) => {
    const { data, commonConfigs, lang } = props;
    const [tableData, setTableData] = useState([]);
    const [sectors, setSectors] = useState([]);
    const [lossData, setLossData] = useState({});
    const [isLossDataFetched, setIsLossDataFetched] = useState(false)

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
            setIsLossDataFetched(true)
        });
    }, []);

    useEffect(() => {
        if (sectors && lossData) {
            Axios.get(
                oldMarketBackEndProxyPass(),
                // 'UID=3166765&SID=3090B191-7C82-49EE-AC52-706F081F265D&L=EN&UNC=1&UE=KSE&H=1&M=1&RT=303&SRC=KSE&AS=1'
                {
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
                }
            ).then((res) => {
                if (res.data.HED && res.data.DAT) {
                    if (res.data.DAT.TD) {
                        let headerFields = [
                            'SHRT_DSC',
                            'SYMBOL_DESCRIPTION',
                            'MARKET_ID',
                            'SECTOR',
                            'COMPANY_CODE',
                        ];

                        let symHedIdxList = _getHeaderIndexList(res.data.HED.TD, headerFields);

                        let filteredByMarket = res.data.DAT.TD.filter(
                            (participant) =>
                                participant.split('|')[symHedIdxList.MARKET_ID] ==
                                getMarket(data.settings.market.value)
                        );
                        let finalData = filteredByMarket.map((participant, index) => {
                            let fields = participant.split('|');

                            return {
                                num: index + 1,
                                sec: fields[symHedIdxList.COMPANY_CODE],
                                ticker: fields[symHedIdxList.SHRT_DSC],
                                name: {
                                    text: fields[symHedIdxList.SYMBOL_DESCRIPTION],
                                    link: stockProfileLink(
                                        fields[symHedIdxList.COMPANY_CODE],
                                        lang
                                    ),
                                },
                                sector: Object.keys(sectors).length
                                    ? getSectorName(fields[symHedIdxList.SECTOR])
                                    : fields[symHedIdxList.SECTOR],

                                marketSegmant: getMarketSegmantName(
                                    fields[symHedIdxList.MARKET_ID],
                                    lang.langKey
                                ),
                                accLoss: Object.keys(lossData).length
                                    ? getAccLoss(fields[symHedIdxList.COMPANY_CODE])
                                    : '--',
                            };
                        });

                        setTableData(finalData.sort((a, b) => parseInt(a.sec) - parseInt(b.sec)));
                    }
                }
            });
        }
    }, [sectors, lossData]);

    const getSectorName = (value) => {
        return sectors[value];
    };

    const getMarket = (value) => {
        switch (value) {
            case 1:
                return 'M';
            case 2:
                return 'P';

            default:
                break;
        }
    };
    const getMarketSegmantName = (value, langKey) => {
        switch (value) {
            case 'M':
                return langKey === 'AR' ? 'السوق الرئيسي' : 'Main Market';
            case 'P':
                return langKey === 'AR' ? 'السوق الأول' : 'Premier Market';
            default:
                return '';
        }
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

    const settingsListofParticipants = {
        columns: [
            {
                columnName: lang.langKey === 'AR' ? '#رقم' : '#No',
                mappingField: 'num',
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
        ],
        showColumnTitle: true,
        httpRequest: {
            header: {},
        },
        rawData: tableData,
        id: 'table',
    };

    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="List of Participants Table" />
    ) : (
        <Fragment>
            <ButtonDiv>
                <ExportButton
                    title={
                        lang.langKey == 'EN' || lang.langKey == 'en'
                            ? 'List of Participants'
                            : 'قائمة المشاركين'
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
                            ? 'List of Participants'
                            : 'قائمة المشاركين'
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
                            ? 'List of Participants'
                            : 'قائمة المشاركين'
                    }
                    id="ua-lang"
                    orientation="l"
                    format="a4"
                    type={constants.PDF}
                    lang={lang.langKey}
                />
            </ButtonDiv>
            <TableUiComponent componentSettings={settingsListofParticipants}></TableUiComponent>
        </Fragment>
    );
};
