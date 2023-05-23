import React, { useState, useEffect, Fragment } from 'react';
import Axios from 'axios';
import { TableUiComponent } from '../TableComponent';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';
import { setLanguage } from '../../../helper/metaData';
import { marketBackEndProxyPass } from '../../../config/path';
import { useURLparam } from '../../../customHooks/useURLparam';
import { ExportButton } from '../../ExportPrintButtons/ExportButton';
import { PrintButton } from '../../ExportPrintButtons/PrintButton';
import styled from 'styled-components';
import * as constants from '../../../config/constants';
import { halfPeriod, fullMonths, quarterPeriod } from '../../FilesList/consts';

const ButtonDiv = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-bottom: 5px;
`;

const TitleDiv = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 25px;
    color: #c6974b;
`;

export const SummaryBySector = (props) => {
    const { commonConfigs, lang } = props;
    let [tableData, setTableData] = useState([]);
    let [year, setYear] = useState('');
    let [period, setPeriod] = useState('');
    let [type, setType] = useState('');
    const symID = useURLparam();

    let sumRow = {
        Sector: lang.langKey === 'EN' ? 'Overall - Default summary' : 'لسوق اجماليالرسمي',
        Noofunchanged: 0,
        NoofRegCompanies: 0,
        NoOfTrades: 0,
        Value: 0,
        NoofIncreased: 0,
        Quantity: 0,
        ValuePerc: 0,
        AmountPerc: 0,
        TransactionsPerc: 0,
        NoofDecreased: 0,
    };

    useEffect(() => {
        if (symID) {
            let params = handleParams(symID);
            let isResponseSuccess = true;

            const header = {
                params: {
                    RT: 3536,
                    L: setLanguage(lang),
                    Y: params[0],
                    T: params[1],
                    TV: params[2],
                },
            };

            setYear(params[0]);
            setType(params[1]);
            setPeriod(params[2]);

            Axios.get(marketBackEndProxyPass(), header).then((res) => {
                if (isResponseSuccess) {
                    let rowTableData = res.data;
                    let tableData = [];
                    let sumValue = 0;
                    sortData(rowTableData);
                    rowTableData.forEach((data) => {
                        tableData.push({ fieldData: data });
                    });

                    for (const [key, value] of Object.entries(sumRow)) {
                        if (key !== 'Sector') {
                            sumValue = tableData.reduce(
                                (accumulator, current) => accumulator + current.fieldData[key],
                                0
                            );

                            if (key !== 'Value') {
                                if (
                                    key === 'TransactionsPerc' ||
                                    key === 'ValuePerc' ||
                                    key === 'AmountPerc'
                                ) {
                                    sumRow[key] = Math.round(sumValue) + '%';
                                } else {
                                    sumRow[key] = Math.round(sumValue);
                                }
                            }

                            if (key === 'Value') {
                                sumRow[key] = sumValue.toFixed(3);
                            }
                        }
                    }
                    tableData.push({ fieldData: sumRow });
                    setTableData(tableData);
                }
            });

            return () => {
                isResponseSuccess = false;
            };
        }
    }, [symID]);

    const sortData = (objs) => {
        return objs.sort((a, b) => (a.Sector > b.Sector ? 1 : b.Sector > a.Sector ? -1 : 0));
    };

    const handleParams = (params) => {
        let fields = params && params.split('-');
        return fields;
    };

    const summaryBySector = {
        columns: [
            {
                columnName: lang.langKey === 'EN' ? 'Sector' : 'القطاع',
                dataType: 'text',
                mappingField: 'Sector',
                disableSorting: true,
            },
            {
                columnName:
                    lang.langKey === 'EN'
                        ? 'No. of Companies registered in Sector'
                        : 'عدد الشركات  المسجله ',
                dataType: 'figure_0decimals',
                mappingField: 'NoofRegCompanies',
                disableSorting: true,
            },
            {
                columnName: lang.langKey === 'EN' ? 'Quantity' : 'الكمية',
                dataType: 'figure_0decimals',
                mappingField: 'Quantity',
                disableSorting: true,
            },
            {
                columnName:
                    lang.langKey === 'EN'
                        ? 'Proportion to the total amount of trading (%)'
                        : 'نسبة الكمية الى اجمالى  التداول',
                dataType: 'figure',
                mappingField: 'AmountPerc',
                disableSorting: true,
            },
            {
                columnName: lang.langKey === 'EN' ? 'Value' : 'القيمة',
                dataType: 'figure_3decimals',
                mappingField: 'Value',
                disableSorting: true,
            },
            {
                columnName:
                    lang.langKey === 'EN'
                        ? 'Proportion to the total Value of trading (%)'
                        : 'نسبة القيمة الى اجمالى  التداول ',
                dataType: 'figure',
                mappingField: 'ValuePerc',
                disableSorting: true,
            },
            {
                columnName: lang.langKey === 'EN' ? 'Number of Trades' : 'الصفقات',
                dataType: 'figure_0decimals',
                mappingField: 'NoOfTrades',
                disableSorting: true,
            },
            {
                columnName:
                    lang.langKey === 'EN'
                        ? 'Proportion to the total number of transactions trading (%)'
                        : 'نسبة عدد الصفقات الى اجمالى التداول',
                dataType: 'figure',
                mappingField: 'TransactionsPerc',
                disableSorting: true,
            },
            {
                columnName:
                    lang.langKey === 'EN' ? 'No. of Increased securities' : 'عدد الشركات المرتفعه',
                dataType: 'figure_0decimals',
                mappingField: 'NoofIncreased',
                disableSorting: true,
            },
            {
                columnName:
                    lang.langKey === 'EN' ? 'No. of Decreased securities' : 'عدد الشركات المنخفضه',
                dataType: 'figure_0decimals',
                mappingField: 'NoofDecreased',
                disableSorting: true,
            },
            {
                columnName:
                    lang.langKey === 'EN'
                        ? 'No. of unchanged securities'
                        : 'عدد الشركات التي لم تتغير',
                dataType: 'figure_0decimals',
                mappingField: 'Noofunchanged',
                disableSorting: true,
            },
        ],

        showColumnTitle: true,
        httpRequest: {
            header: {},
        },
        rawData: tableData,
        isLastRowColored: true,
    };

    const renderPeriod = (year, type, period) => {
        let month = '';

        if (type == 'M') {
            fullMonths.forEach((element) => {
                if (element.id == period) {
                    month = lang.langKey === 'EN' ? element.titleE : element.titleA;
                }
            });
        } else if (type == 'Q') {
            quarterPeriod.forEach((element) => {
                if (element.id == period) {
                    month = lang.langKey === 'EN' ? element.titleE : element.titleA;
                }
            });
        } else if (type == 'H') {
            halfPeriod.forEach((element) => {
                if (element.id == period) {
                    month = lang.langKey === 'EN' ? element.titleE : element.titleA;
                }
            });
        } else {
            month = lang.langKey === 'EN' ? 'Year' : 'السنوي';
        }
        console.log("name", month + ' - ' + year);
        return month + ' - ' + year;
    };

    const renderTitle = () => {
        let title = lang.langKey === 'EN' ? 'Report for' : 'تقرير شهر';
        return title;
    };

    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="Summary By Sector Table" />
    ) : (
   <Fragment>
            <TitleDiv>
                {renderTitle()} {renderPeriod(year, type, period)}{' '}
            </TitleDiv>

            <ButtonDiv language={lang.langKey}>
                <ExportButton
                    title={
                        lang.langKey == 'EN' || lang.langKey == 'en'
                            ? `Summary By Sector ${renderPeriod(year, type, period)}`
                            : `تقرير القطاعات بناير ${renderPeriod(year, type, period)}`
                    }
                    id="ua-lang"
                    orientation="l"
                    format="a4"
                    type={constants.XLSX}
                    lang={lang.langKey}
                    tab={renderPeriod(year, type, period)}
                />
                <PrintButton
                    title={
                        lang.langKey == 'EN' || lang.langKey == 'en'
                            ? `Summary By Sector ${renderPeriod(year, type, period)}`
                            : `تقرير القطاعات بناير ${renderPeriod(year, type, period)}`
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
                            ? `Summary By Sector ${renderPeriod(year, type, period)}`
                            : `تقرير القطاعات بناير ${renderPeriod(year, type, period)}`
                    }
                    id="ua-lang"
                    orientation="l"
                    format="a4"
                    type={constants.PDF}
                    lang={lang.langKey}
                />
            </ButtonDiv>

            <TableUiComponent componentSettings={summaryBySector}></TableUiComponent>
        </Fragment>
    );
};
