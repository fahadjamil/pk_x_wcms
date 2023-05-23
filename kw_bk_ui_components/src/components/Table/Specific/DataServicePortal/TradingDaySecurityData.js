import React, { useState, useRef, useEffect } from 'react';
import { TableUiComponent } from '../../TableComponent';
import styled from 'styled-components';
import { SpecificPreviewComponent } from '../../../SpecificPreviewComponent';
import { marketBackEndProxyPass } from '../../../../config/path';
import { setLanguage, dateForURL } from '../../../../helper/metaData';
import { DatePickerComponent } from '../../../DatePicker/DatePickerComponent';
import Axios from 'axios';

const DivInline = styled.div`
    display: inline-block;
    padding: 10px;
    ${(props) => (props.isMobile ? 'width: 90%;' : '')}
`;

const Button = styled.button`
    display: inline-block;
    height: 38px;
    ${(props) => (props.isMobile ? 'width: 45%;' : 'width: 100px;')}
    margin: 10px;
    border-radius: 5px;
    font-size: 14px;
    border: none;
    color: white;
    border-radius: 5px;
    background: ${(props) => props.bgColor || '#BBBBBB'};
`;

const Div = styled.div`
    ${(props) => (props.isMobile ? 'text-align: center;' : 'padding-left: 25px;')}
`;

const ButtonWrapper = styled.div`
    ${(props) =>
        props.isMobile ? 'display: flex; width:90%; justify-content: space-between;' : ''}
`;

const DatePickerWrapper = styled.span`
    ${(props) => (props.isMobile ? 'width:90%; display: flex;justify-content: space-between;' : '')}
`;

export const TradingDaySecData = (props) => {
    const { commonConfigs, data, lang } = props;
    const [fromDate, setFromDate] = useState('');
    const [tableData, setTableData] = useState([]);
    const convertByLang = (arText, enText) => (lang.langKey === 'AR' ? arText : enText);

    const reqParams =
    data && data.settings && data.settings.collection && data.settings.collection.value == 1
        ? { RT: 3537, B: 'R'  }
        : { RT: 3540, SRC: 'KSEOTC'  };

    let componentSettingsEndOfDay = {
        menuName: 'Trading Day Security Data',
        columns: [
            {
                columnName: lang.langKey === 'AR' ? 'رقم السهم' : 'Security Code',
                mappingField: 'Stk',
                dataType: 'text',
                disableSorting: true,
            },
            {
                columnName: lang.langKey === 'AR' ? 'اسم السهم' : 'Security Ticker',
                mappingField: 'DisplayTicker',
                dataType: 'ticker',
                disableSorting: true,
            },
            {
                columnName: lang.langKey === 'AR' ? '' : 'Last',
                mappingField: 'Last',
                dataType: 'figure_0decimals',
                disableSorting: true,
            },
            {
                columnName: lang.langKey === 'AR' ? 'التغير' : 'Change',
                mappingField: 'Change',
                dataType: 'figure',
                disableSorting: true,
            },
            {
                columnName: lang.langKey === 'AR' ? 'الافتتاح' : 'Open',
                mappingField: 'Open',
                dataType: 'figure_0decimals',
                disableSorting: true,
            },
            {
                columnName: lang.langKey === 'AR' ? 'أعلى' : 'High',
                mappingField: 'High',
                dataType: 'figure_0decimals',
                disableSorting: true,
            },
            {
                columnName: lang.langKey === 'AR' ? 'أدنى' : 'Low',
                mappingField: 'Low',
                dataType: 'figure_0decimals',
                disableSorting: true,
            },
            {
                columnName: lang.langKey === 'AR' ? 'الكمية' : 'Volume',
                mappingField: 'Volume',
                dataType: 'figure_0decimals',
                disableSorting: true,
            },
            {
                columnName: lang.langKey === 'AR' ? 'مجموع الصفقات' : 'Total Trades',
                mappingField: 'NoOfTrades',
                dataType: 'figure_0decimals',
                disableSorting: true,
            },
            {
                columnName: lang.langKey === 'AR' ? 'القيمة' : 'Value',
                mappingField: 'Value',
                dataType: 'figure_0decimals',
                disableSorting: true,
            },
            {
                columnName: lang.langKey === 'AR' ? 'الإغلاق السابق' : 'Previous Closing Price',
                mappingField: 'PrevPrice',
                dataType: 'price',
                disableSorting: true,
            },
            {
                columnName: lang.langKey === 'AR' ? 'الطلب' : 'Bid',
                mappingField: 'BidPrice',
                dataType: 'figure_0decimals',
            },
            {
                columnName: lang.langKey === 'AR' ? 'العرض' : 'Ask Price',
                mappingField: 'AskPrice',
                dataType: 'price',
                disableSorting: true,
            },
            // {
            //     columnName: lang.langKey === 'AR' ? 'التاريخ السابق' : 'Prev Date',
            //     mappingField: 'PrevPrice',
            //     dataType: 'date',
            // },
        ],
        showColumnTitle: true,
        httpRequest: {
            header: {},
        },
        rawData: tableData,
    };

    const search = () => {
            Axios.get(marketBackEndProxyPass(), {
                params: {
                    ...reqParams,
                    L: setLanguage(lang),
                    TD: fromDate ? dateForURL(fromDate) : undefined,
                },
            }).then((res) => setTableData(res.data));
    };

    const changeFromDate = (date) => setFromDate(date);

    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="Current Day - Security" />
    ) : (
        <div>
            <Div className="row">
                <DatePickerWrapper>
                    <DivInline>
                        <DatePickerComponent
                            data={{
                                data: { title: convertByLang('من', 'From Date') },
                                styles: {},
                                settings: { callBack: changeFromDate, placeHolder: fromDate },
                            }}
                        />
                    </DivInline>
                </DatePickerWrapper>
                <ButtonWrapper>
                    <Button bgColor={'#C5964A'} onClick={() => search()}>
                        {convertByLang('عرض ', 'Show')}
                    </Button>
                </ButtonWrapper>
            </Div>

            <TableUiComponent componentSettings={componentSettingsEndOfDay}></TableUiComponent>
        </div>
    );
};
