import React, { useState, useEffect, Fragment } from 'react';
import Axios from 'axios';
import styled from 'styled-components';
import { DatePickerComponent } from '../../DatePicker/DatePickerComponent';
import { marketBackEndProxyPass } from '../../../config/path';
import { TableUiComponent } from '../TableComponent';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';
import { setLanguage, dateForURL } from '../../../helper/metaData';
import { ExportButton } from '../../ExportPrintButtons/ExportButton';
import { PrintButton } from '../../ExportPrintButtons/PrintButton';
import * as constants from '../../../config/constants';

const Div = styled.div`
    padding-left: 25px;
`;

const DivInline = styled.div`
    display: inline-block;
    padding: 10px;
`;

const ButtonWrapper = styled.div``;

const Button = styled.button`
    display: inline-block;
    height: 38px;
    width: 100px;
    margin: 10px;
    border-radius: 5px;
    font-size: 14px;
    border: none;
    color: white;
    border-radius: 5px;
    background: ${(props) => props.bgColor || '#BBBBBB'};
`;

const Tools = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-bottom: 5px;
`;

export const OTCMarketOverview = (props) => {
    const { commonConfigs, lang } = props;
    const [tableData, setTableData] = useState([]);
    const [date, setDate] = useState('');
    const convertByLang = (arText, enText) => (lang.langKey === 'AR' ? arText : enText);

    const changeDate = (date) => {
        setDate(date);
    };

    let componentSettings = {
        columns: [
            {
                columnName: convertByLang('التاريخ', 'Date'),
                mappingField: 'TransactionDate',
                dataType: 'date',
            },
            {
                columnName: convertByLang('السوق', 'Market Type'),
                dataType: 'text',
                mappingField: 'MarketType',
            },
            {
                columnName: convertByLang('الكمية', 'Volume'),
                dataType: 'figure_0decimals',
                mappingField: 'Volume',
                showSum: true,
            },

            {
                columnName: convertByLang('القيمة (د.ك)', 'Value (KD)'),
                dataType: 'figure_3decimals',
                mappingField: 'Value',
                showSum: true,
            },
            {
                columnName: convertByLang('مجموع الصفقات', 'Total Trades'),
                dataType: 'figure_0decimals',
                mappingField: 'TotalTrades',
                showSum: true,
            },
            {
                columnName: convertByLang('عدد الشركات المتداولة', 'No. of companies Traded'),
                dataType: 'figure_0decimals',
                mappingField: 'NoofCompanyTrades',
                showSum: true,
            },
            {
                columnName: convertByLang('القيمة السوقية (د.ك)', 'Market Cap (KD)'),
                dataType: 'figure_3decimals',
                mappingField: 'MarketCap',
                showSum: true,
            },
        ],
        showColumnTitle: true,
        httpRequest: {},
        rawData: tableData,
        showSumRow: true,
        id: 'otcMarketOverview',
    };

    const filteredData = (data) => {
        Axios.get(marketBackEndProxyPass(), { params: data }).then((res) => {
            let sortedData = res.data.sort((a, b) => a.Stk - b.Stk);
            setTableData(sortedData);
        });
    };

    const filter = () => {
        let temp = { RT: 3534, L: setLanguage(lang), SRC: 'KSEOTC' };

        if (date) {
            temp.TD = dateForURL(date);
        }

        filteredData(temp);
    };

    return (
        <Fragment>
            {commonConfigs.isPreview ? (
                <SpecificPreviewComponent title="OTC Market Overview" />
            ) : (
                <Fragment>
                    <Div className="row">
                        <DivInline>
                            <DatePickerComponent
                                data={{
                                    data: { title: convertByLang('من', 'From Date') },
                                    styles: {},
                                    settings: {
                                        callBack: changeDate,
                                        placeHolder: date,
                                    },
                                }}
                            />
                        </DivInline>
                        <ButtonWrapper>
                            <Button bgColor={'#133A51'} onClick={() => filter()}>
                                {convertByLang('تصفية ', 'Filter')}
                            </Button>{' '}
                        </ButtonWrapper>
                    </Div>
                    <Tools>
                        <ExportButton
                            title={
                                lang.langKey == 'EN' || lang.langKey == 'en'
                                    ? 'Market Overview'
                                    : ' نظرة عامة'
                            }
                            id="otcMarketOverview"
                            orientation="l"
                            format="a4"
                            type={constants.XLSX}
                            lang={lang.langKey}
                        />
                        <PrintButton
                            title={
                                lang.langKey == 'EN' || lang.langKey == 'en'
                                    ? 'Market Overview'
                                    : ' نظرة عامة'
                            }
                            id="otcMarketOverview"
                            orientation="l"
                            format="a4"
                            lang={lang.langKey}
                            autoPrint={true}
                        />
                        <ExportButton
                            title={
                                lang.langKey == 'EN' || lang.langKey == 'en'
                                    ? 'Market Overview'
                                    : ' نظرة عامة'
                            }
                            id="otcMarketOverview"
                            orientation="l"
                            format="a4"
                            type={constants.PDF}
                            lang={lang.langKey}
                        />
                    </Tools>
                    <TableUiComponent componentSettings={componentSettings}></TableUiComponent>
                </Fragment>
            )}
        </Fragment>
    );
};
