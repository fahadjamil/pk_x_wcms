import React, { useState, useEffect } from 'react';
import { TableUiComponent } from '../TableComponent';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';
import { oldMarketBackEndProxyPass } from '../../../config/path';
import { _getHeaderIndexList } from '../../../helper/metaData';
import Axios from 'axios';
import {
    balanceSheetLink,
    cashFlowStatementLink,
    incomeStatementLink,
    ratiosAndIndicatorsLink,
    comparisonLink,
} from '../../../config/constants';
import * as constants from '../../../config/constants';

export const FinancialDataTable = (props) => {
    const { commonConfigs, lang } = props;
    const [tableData, setTableData] = useState([]);
    const convertByLang = (arText, enText) => (lang.langKey === 'AR' ? arText : enText);

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
                        'COMPANY_CODE',
                        'SHRT_DSC'
                    ];

                    let symHedIdxList = _getHeaderIndexList(res.data.HED.TD, headerFields);

                    let filteredRegularSymbol= res.data.DAT.TD.filter(
                        (participant) =>
                            participant.split('|')[1].split('`')[1] == 'R'
                    );

                    let finalData = filteredRegularSymbol.map((participant, index) => {
                        let fields = participant.split('|');

                        return {
                            sec: fields[symHedIdxList.COMPANY_CODE],
                            ticker: fields[symHedIdxList.SHRT_DSC],
                            name: fields[symHedIdxList.SYMBOL_DESCRIPTION],
                            income: incomeStatementLink(fields[symHedIdxList.COMPANY_CODE],lang),
                            balance: balanceSheetLink(fields[symHedIdxList.COMPANY_CODE],lang),
                            cash: cashFlowStatementLink(fields[symHedIdxList.COMPANY_CODE],lang),
                            ratios: ratiosAndIndicatorsLink(fields[symHedIdxList.COMPANY_CODE],lang),
                            compare: comparisonLink(fields[symHedIdxList.COMPANY_CODE],lang),
                        };
                    });

                    setTableData(finalData);
                }
            }
        });
    }, []);

    const settingsAccumulatedLoss = {
        columns: [
            {
                columnName: convertByLang('الشركة', 'Stock'),
                dataType: 'number',
                mappingField: 'sec',
            },
            {
                columnName: convertByLang('اسم السهم', 'Ticker'),
                dataType: 'ticker',
                mappingField: 'ticker',
            },
            { columnName: convertByLang('الإسم', 'Name'), dataType: 'text', mappingField: 'name' },
            {
                columnName: convertByLang('قائمة الدخل', 'Income Statement'),
                dataType: 'docIcon',
                mappingField: 'income',
            },
            {
                columnName: convertByLang('قائمة المركز المالي', 'Balance Sheet'),
                dataType: 'docIcon',
                mappingField: 'balance',
            },
            {
                columnName: convertByLang('قائمة التدفق النقدي', 'Cash Flow Statement'),
                dataType: 'docIcon',
                mappingField: 'cash',
            },
            {
                columnName: convertByLang('النسب والمؤشرات المالية', 'Ratios & Indicators'),
                dataType: 'docIcon',
                mappingField: 'ratios',
            },
            {
                columnName: convertByLang('مقارنة', 'Compare'),
                dataType: 'docIcon',
                mappingField: 'compare',
            },
        ],
        showColumnTitle: true,
        httpRequest: {
            header: {},
        },
        rawData: tableData,
    };

    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="Financial Data Table" />
    ) : (
        <TableUiComponent componentSettings={settingsAccumulatedLoss}></TableUiComponent>
    );
};
