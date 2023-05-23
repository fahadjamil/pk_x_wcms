import React, { useState } from 'react';
import Axios from 'axios';
import styled from 'styled-components';
import { TableUiComponent } from '../../TableComponent';
import { SpecificPreviewComponent } from '../../../SpecificPreviewComponent';
import { marketBackEndProxyPass } from '../../../../config/path';
import { dateForURL, setLanguage } from '../../../../helper/metaData';
import { DatePickerComponent } from '../../../DatePicker/DatePickerComponent';

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

export const EndOfDayData = (props) => {
    const { commonConfigs, data, lang } = props;
    const [selectedDate, setSelectedDate] = useState('');
    const [showResults, setShowResults] = useState(false);
    const [tableData, setTableData] = useState([]);
    const convertByLang = (arText, enText) => (lang.langKey === 'AR' ? arText : enText);

    const reqSource =
        data && data.settings && data.settings.market && data.settings.market.value == 1
            ? { B: 'R', RT: 3524 }
            : { SRC: 'KSEOTC', RT: 3539 };

    const handleDateChange = (newDate) => setSelectedDate(newDate);

    let componentSettingsEndOfDay = {
        menuName: 'End of Day Data',
        columns: [
            {
                columnName: lang.langKey === 'AR' ? 'التاريخ' : 'Date',
                mappingField: 'TransactionDate',
                dataType: 'date',
                disableSorting: true,
            },
            {
                columnName: lang.langKey === 'AR' ? 'رقم السهم' : 'Security Code',
                mappingField: 'DisplayTicker',
                dataType: 'text',
                disableSorting: true,
            },
            {
                columnName: lang.langKey === 'AR' ? 'اسم السهم' : 'Security Ticker',
                mappingField: 'Stk',
                dataType: 'ticker',
                disableSorting: true,
            },
            {
                columnName: lang.langKey === 'AR' ? 'الإسم' : 'Security Name',
                mappingField: 'SecurityName',
                dataType: 'text',
                disableSorting: true,
            },
            {
                columnName: lang.langKey === 'AR' ? 'القطاع' : 'Sector',
                mappingField: 'Sector',
                dataType: 'text',
                disableSorting: true,
            },
            {
                columnName: lang.langKey === 'AR' ? 'الإغلاق السابق' : 'Privous Closing Price',
                mappingField: 'Previous',
                dataType: 'price',
                disableSorting: true,
            },
            {
                columnName: lang.langKey === 'AR' ? 'سعر الأساس' : 'Reference Price',
                mappingField: 'Reference',
                dataType: 'price',
                disableSorting: true,
            },
            {
                columnName: lang.langKey === 'AR' ? 'الافتتاح' : 'Open Price',
                mappingField: 'Open',
                dataType: 'price',
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
                columnName: lang.langKey === 'AR' ? 'الإغلاق' : 'Closing Price',
                mappingField: 'Close',
                dataType: 'price',
                disableSorting: true,
            },
            {
                columnName: lang.langKey === 'AR' ? 'معدل السعر المرجح' : 'VWAP',
                mappingField: 'VWAP',
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
                columnName: lang.langKey === 'AR' ? 'القيمة' : 'Value',
                mappingField: 'Value',
                dataType: 'figure_0decimals',
                disableSorting: true,
            },
            {
                columnName: lang.langKey === 'AR' ? 'عدد الصفقات' : 'No. of Trades',
                mappingField: 'NoOfTrades',
                dataType: 'figure_0decimals',
                disableSorting: true,
            },
            {
                columnName: lang.langKey === 'AR' ? 'عدد الأسهم' : 'No. of Shares',
                mappingField: 'NoOfShares',
                dataType: 'figure_0decimals',
                disableSorting: true,
            },
            {
                columnName: lang.langKey === 'AR' ? 'رسملة السوق' : 'Market Cap',
                mappingField: 'MarketCap',
                dataType: 'figure_0decimals',
                disableSorting: true,
            },
            {
                columnName: lang.langKey === 'AR' ? 'الطلب' : 'Bid Price',
                mappingField: 'BidPrice',
                dataType: 'price',
                disableSorting: true,
            },
            {
                columnName: lang.langKey === 'AR' ? 'العرض' : 'Ask Price',
                mappingField: 'AskPrice',
                dataType: 'price',
                disableSorting: true,
            },
        ],
        showColumnTitle: true,

        httpRequest: {},
        rawData: tableData,
    };

    const onClickShow = () => {
        if (selectedDate) {
            Axios.get(marketBackEndProxyPass(), {
                params: {
                    L: setLanguage(lang),
                    TD: selectedDate ? dateForURL(selectedDate) : undefined,
                    ...reqSource,
                },
            }).then((res) => setTableData(res.data));
            setShowResults(true);
        }
    };

    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="End Of Day Data" />
    ) : (
        <div>
            <Div className="row">
                <DatePickerWrapper>
                    <DivInline>
                        <DatePickerComponent
                            data={{
                                data: { title: convertByLang('من', 'From Date') },
                                styles: {},
                                settings: {
                                    callBack: handleDateChange,
                                    placeHolder: selectedDate,
                                },
                            }}
                        />
                    </DivInline>
                </DatePickerWrapper>

                <ButtonWrapper>
                    <Button bgColor={'#C5964A'} onClick={() => onClickShow()}>
                        {convertByLang('عرض ', 'Show')}
                    </Button>
                </ButtonWrapper>
            </Div>

            <TableUiComponent componentSettings={componentSettingsEndOfDay}></TableUiComponent>
        </div>
    );
};
