import React, { useState, useEffect } from 'react';
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

export const MarketTrades = (props) => {
    const { commonConfigs, data, lang } = props;
    const [selectedDate, setSelectedDate] = useState('');
    const [tableData, setTableData] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const convertByLang = (arText, enText) => (lang.langKey === 'AR' ? arText : enText);
    const handleSelectedDateChange = (newDate) => setSelectedDate(newDate);

    const reqParams =
        data && data.settings && data.settings.collection && data.settings.collection.value == 1
            ? { RT: 3538 }
            : { RT: 3541 };

    let componentSettingsEndOfDay = {
        menuName: 'Market Trades',
        columns: [
            {
                columnName: lang.langKey === 'AR' ? 'التاريخ' : 'Trade Date',
                mappingField: 'TradeDate',
                dataType: 'date',
                disableSorting: true,
            },
            {
                columnName: lang.langKey === 'AR' ? 'زمن' : 'Time',
                mappingField: 'TradeTime',
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
                columnName: lang.langKey === 'AR' ? 'رقم السهم' : 'Security Code',
                mappingField: 'DisplayTicker',
                dataType: 'text',
                disableSorting: true,
            },
            {
                columnName: lang.langKey === 'AR' ? 'سعر' : 'Price',
                mappingField: 'TradePrice',
                dataType: 'price',
                disableSorting: true,
            },
            {
                columnName: lang.langKey === 'AR' ? 'كمية التجارة' : 'Quantity',
                mappingField: 'TradeQty',
                dataType: 'number',
                disableSorting: true,
            },
            {
                columnName: lang.langKey === 'AR' ? 'يعلق على' : 'Board',
                mappingField: 'Board',
                dataType: 'text',
                disableSorting: true,
            },
            {
                columnName: lang.langKey === 'AR' ? 'يكتب' : 'Instrument',
                mappingField: 'MarketType',
                dataType: 'text',
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
                    ...reqParams,
                    L: setLanguage(lang),
                    TD: selectedDate ? dateForURL(selectedDate) : undefined,
                },
            }).then((res) => setTableData(res.data));
            setShowResults(true);
        }
    };

    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="Market Trades" />
    ) : (
        <div>
            <Div className="row">
                <DatePickerWrapper>
                    <DivInline>
                        <DatePickerComponent
                            data={{
                                data: { title: convertByLang('التاريخ', 'Trade Date ') },
                                styles: {},
                                settings: {
                                    callBack: handleSelectedDateChange,
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
