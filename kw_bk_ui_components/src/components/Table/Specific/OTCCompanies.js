import React, { useState, useEffect, Fragment } from 'react';
import { TableUiComponent } from '../TableComponent';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';
import { oldMarketBackEndProxyPass } from '../../../config/path';
import Axios from 'axios';
import { _getHeaderIndexList } from '../../../helper/metaData';
import { ExportButton } from '../../ExportPrintButtons/ExportButton';
import { PrintButton } from '../../ExportPrintButtons/PrintButton';
import styled from 'styled-components';
import * as constants from '../../../config/constants';

const ButtonDiv = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-bottom: 5px;
`;

export const OTCCompanies = (props) => {
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
                SRC: 'KSEOTC',
                AS: 1,
            },
        }).then((res) => {
            if (res.data.HED && res.data.DAT) {
                let headerFields = ['COMPANY_CODE', 'SYMBOL_DESCRIPTION', 'ISIN_CODE', 'MARKET_ID'];
                let symHedIdxList = _getHeaderIndexList(res.data.HED.TD, headerFields);
                console.log('data', res.data.HED);

                let finalData = [];

                res.data.DAT.TD.map((participant, index) => {
                    let fields = participant.split('|');

                    let obj = {};
                    if (fields[symHedIdxList.MARKET_ID] === 'H') {
                        obj['companyCode'] = fields[symHedIdxList.COMPANY_CODE].split('`')[0];
                        obj['name'] = fields[symHedIdxList.SYMBOL_DESCRIPTION];
                        obj['isinCode'] = fields[symHedIdxList.ISIN_CODE];
                        finalData.push(obj);
                    }
                });
                setTableData(
                    finalData.sort((a, b) => {
                        return a.companyCode - b.companyCode;
                    })
                );
            }
        });
    }, []);

    let componentSettingsNormalMarketSize = {
        columns: [
            {
                columnName: lang.langKey === 'EN' ? 'Stock Number' : 'رقم الشركة',
                dataType: 'number',
                mappingField: 'companyCode',
            },
            {
                columnName: lang.langKey === 'EN' ? 'Name' : 'اسم الشركة',
                dataType: 'text',
                mappingField: 'name',
            },
            {
                columnName: lang.langKey === 'EN' ? 'ISIN code' : 'رقم ISIN',
                dataType: 'text',
                mappingField: 'isinCode',
            },
        ],
        showColumnTitle: true,
        httpRequest: {
            header: {},
        },
        rawData: tableData,
        id: 'table'
    };

    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="OTC Companies" />
    ) : (
        <Fragment>
            <ButtonDiv>
                <ExportButton
                    title={
                        lang.langKey == 'EN' || lang.langKey == 'en'
                            ? 'OTC Companies'
                            : 'الشركات'
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
                            ? 'OTC Companies'
                            : 'الشركات'
                    }
                    id="ua-lang"
                    orientation="l"
                    format="a4"
                    lang={lang.langKey}
                    autoPrint={true}
                />
            </ButtonDiv>
            <TableUiComponent
                componentSettings={componentSettingsNormalMarketSize}
            ></TableUiComponent>
        </Fragment>
    );
};
