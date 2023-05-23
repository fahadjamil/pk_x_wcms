import React, { useState, useEffect, Fragment } from 'react';
import { TableUiComponent } from '../TableComponent';
import { oldMarketBackEndProxyPass } from '../../../config/path';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';
import Axios from 'axios';
import { _getHeaderIndexList } from '../../../helper/metaData';
import { reitsProfileLink } from '../../../config/constants';
import { ExportButton } from '../../ExportPrintButtons/ExportButton';
import { PrintButton } from '../../ExportPrintButtons/PrintButton';
import styled from 'styled-components';
import * as constants from '../../../config/constants';

const ButtonDiv = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-bottom: 5px;
`;

export const REITs = (props) => {
    const { commonConfigs, lang } = props;
    const [tableData, setTableData] = useState([]);

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
                        'SECTOR',
                        'COMPANY_CODE',
                        'MARKET_ID',
                        'SHRT_DSC',
                    ];

                    let symHedIdxList = _getHeaderIndexList(res.data.HED.TD, headerFields);

                    let filteredByMarket = res.data.DAT.TD.filter(
                        (participant) => participant.split('|')[symHedIdxList.MARKET_ID] == 'T'
                    );
                    let finalData = filteredByMarket.map((participant, index) => {
                        let fields = participant.split('|');

                        return {
                            num: index + 1,
                            sec: fields[symHedIdxList.COMPANY_CODE],
                            ticker: fields[symHedIdxList.SHRT_DSC],
                            name: {
                                text: fields[symHedIdxList.SYMBOL_DESCRIPTION],
                                link: reitsProfileLink(fields[symHedIdxList.COMPANY_CODE], lang),
                            },
                            sector: fields[symHedIdxList.SECTOR],
                        };
                    });

                    setTableData(finalData);
                }
            }
        });
    }, []);

    let componentSettings = {
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
                columnName: lang.langKey === 'AR' ? 'الإسم' : 'Name',
                dataType: 'link',
                mappingField: 'name',
            },
            {
                columnName: lang.langKey === 'AR' ? 'القطاع' : 'Sector',
                dataType: 'text',
                mappingField: 'sector',
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
        <SpecificPreviewComponent title="REITs Table" />
    ) : (
        <Fragment>
            <ButtonDiv>
                <ExportButton
                    title={
                        lang.langKey == 'EN' || lang.langKey == 'en'
                            ? 'REITS'
                            : 'الصناديق العقارية المدرة للدخل'
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
                            ? 'REITS'
                            : 'الصناديق العقارية المدرة للدخل'
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
                            ? 'REITS'
                            : 'الصناديق العقارية المدرة للدخل'
                    }
                    id="ua-lang"
                    orientation="l"
                    format="a4"
                    type={constants.PDF}
                    lang={lang.langKey}
                />
            </ButtonDiv>
            <TableUiComponent componentSettings={componentSettings}></TableUiComponent>
        </Fragment>
    );
};
