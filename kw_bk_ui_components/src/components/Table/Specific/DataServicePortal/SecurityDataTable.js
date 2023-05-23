import React, { useState, useRef, useEffect } from 'react';
import Axios from 'axios';
import { TableUiComponent } from '../../TableComponent';
import styled from 'styled-components';
import { SpecificPreviewComponent } from '../../../SpecificPreviewComponent';
import { marketBackEndProxyPass } from '../../../../config/path';
import { dateForURL, setLanguage } from '../../../../helper/metaData';
import { SelectSecurity } from '../../../Common/SelectSecurity';
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

export const SecurityData = (props) => {
    const { commonConfigs, data, lang } = props;
    const [selectedSecurity, setSelectedSecurity] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [tradeDate, setTradeDate] = useState('');
    const [showResults, setShowResults] = useState(false);
    const [tableData, setTableData] = useState([]);
    const [reqObject, setReqObject] = useState({
        RT: 3525,
        L: setLanguage(lang),
        SRC:
            data && data.settings && data.settings.collection && data.settings.collection.value == 2
                ? 'KSEOTC'
                : undefined,
    });
    const convertByLang = (arText, enText) => (lang.langKey === 'AR' ? arText : enText);
    const isPremiumUser = false;

    useEffect(() => {
        Axios.get(marketBackEndProxyPass(), {
            params: { ...reqObject },
        }).then((res) => setTableData(res.data));
    }, [reqObject]);

    const handleFromDateChange = (newDate) => setFromDate(newDate);
    const handleToDateChange = (newDate) => setToDate(newDate);
    const handleTradeDateChange = (newDate) => setTradeDate(newDate);
    const handleSelectedSecurity = (newSecurity) => setSelectedSecurity(newSecurity);
    const handleShow = () => {
        let temp = reqObject;

        delete temp.SYMC;
        delete temp.TD;
        delete temp.SD;
        delete temp.ED;
        if (selectedSecurity && selectedSecurity != 'ALL') {
            temp.SYMC = selectedSecurity;
        }
        if (tradeDate) {
            temp.TD = dateForURL(tradeDate);
        }
        if (fromDate) {
            temp.SD = dateForURL(fromDate);
        }
        if (toDate) {
            temp.ED = dateForURL(toDate);
        }

        setReqObject({ ...temp });
    };

    let componentSettingsEndOfDay = {
        menuName: 'Security Data',
        columns: [
            {
                columnName: lang.langKey === 'AR' ? 'التاريخ' : 'Date',
                mappingField: 'TransactionDate',
                dataType: 'date',
                disableSorting: true,
            },
            {
                columnName: lang.langKey === 'AR' ? 'اسم السهم' : 'Security Ticker',
                mappingField: 'Stk',
                dataType: 'ticker',
                disableSorting: true,
            },
            {
                columnName: lang.langKey === 'AR' ? 'الافتتاح' : 'Open',
                mappingField: 'Open',
                dataType: 'figure_0decimals',
                disableSorting: true,
            },
            {
                columnName: lang.langKey === 'AR' ? 'الإغلاق' : 'Close',
                mappingField: 'Close',
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
                columnName: lang.langKey === 'AR' ? 'القيمة' : 'Value',
                mappingField: 'Value',
                dataType: 'figure_0decimals',
                disableSorting: true,
            },
            {
                columnName: lang.langKey === 'EN' ? '52 Week High' : 'أعلى 52',
                mappingField: 'High52WK',
                dataType: 'figure_0decimals',
                disableSorting: true,
            },
            {
                columnName: lang.langKey == 'EN' ? '52 Week Low' : 'أدنى 52',
                mappingField: 'Low52WK',
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
                columnName:
                    lang.langKey === 'AR' ? 'كمية صفقات خارج النظام' : 'Special Trade Volume',
                mappingField: 'SpecialTradeVolume',
                dataType: 'figure_0decimals',
                disableSorting: true,
            },
            {
                columnName: lang.langKey === 'AR' ? 'عدد صفقات خارج النظام' : 'Special Trade Trade',
                mappingField: 'SpecialTradeTrade',
                dataType: 'figure_0decimals',
                disableSorting: true,
            },
            {
                columnName:
                    lang.langKey === 'AR' ? 'قيمة صفقات خارج النظام' : 'Special Trade Value',
                mappingField: 'SpecialTradeValue',
                dataType: 'figure_0decimals',
                disableSorting: true,
            },
        ],
        showColumnTitle: true,

        httpRequest: {},
        rawData: tableData,
    };

    const clearFilters = () => {
        setReqObject({
            RT: 3525,
            L: setLanguage(lang),
            SRC:
                data &&
                data.settings &&
                data.settings.collection &&
                data.settings.collection.value == 2
                    ? 'KSEOTC'
                    : undefined,
        });
        setTradeDate('');
        setSelectedSecurity('');
        setToDate('');
        setFromDate('');
    };

    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="Security Data" />
    ) : (
        <div>
            <Div className="row">
                <DivInline>
                    <SelectSecurity
                        value={selectedSecurity}
                        callback={handleSelectedSecurity}
                        lang={lang.langKey}
                        width={'220px'}
                        styles="height: 38px; border: 1px solid #ccc; border-radius: 5px;"
                    ></SelectSecurity>
                </DivInline>
                {isPremiumUser ? (
                    <DatePickerWrapper>
                        <DivInline>
                            <DatePickerComponent
                                data={{
                                    data: { title: convertByLang('من', 'From Date') },
                                    styles: {},
                                    settings: {
                                        callBack: handleFromDateChange,
                                        placeHolder: fromDate,
                                    },
                                }}
                            />
                        </DivInline>
                        <DivInline>
                            <DatePickerComponent
                                data={{
                                    data: { title: convertByLang('الى', 'To Date') },
                                    styles: {},
                                    settings: {
                                        callBack: handleToDateChange,
                                        placeHolder: toDate,
                                    },
                                }}
                            />
                        </DivInline>
                    </DatePickerWrapper>
                ) : (
                    <DatePickerWrapper>
                        <DivInline>
                            <DatePickerComponent
                                data={{
                                    data: { title: convertByLang('التاريخ', 'Trade Date ') },
                                    styles: {},
                                    settings: {
                                        callBack: handleTradeDateChange,
                                        placeHolder: tradeDate,
                                    },
                                }}
                            />
                        </DivInline>
                    </DatePickerWrapper>
                )}

                <ButtonWrapper>
                    <Button bgColor={'#C5964A'} onClick={() => handleShow()}>
                        {convertByLang('عرض ', 'Show')}
                    </Button>
                    <Button onClick={() => clearFilters()}>
                        {convertByLang('مسح التصفية', 'Clear')}
                    </Button>
                </ButtonWrapper>
            </Div>
            <TableUiComponent componentSettings={componentSettingsEndOfDay}></TableUiComponent>
        </div>
    );
};
