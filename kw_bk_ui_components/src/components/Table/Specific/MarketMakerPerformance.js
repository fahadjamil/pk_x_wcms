import React, { useState, useEffect, Fragment } from 'react';
import Axios from 'axios';
import styled from 'styled-components';
import { TableUiComponent } from '../TableComponent';
import { marketBackEndProxyPass } from '../../../config/path';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';
import { setLanguage, dateForURL } from '../../../helper/metaData';
import { ExportButton } from '../../ExportPrintButtons/ExportButton';
import { PrintButton } from '../../ExportPrintButtons/PrintButton';
import * as constants from '../../../config/constants';
import { getYear, getArabicMonthText, getShortMonthText } from '../../../helper/date';
import { SelectSecurity } from '../../Common/SelectSecurity';
import { DatePickerComponent } from '../../DatePicker/DatePickerComponent';
import { SelectMarketMaker } from '../../Common/SelectMarketMaker';

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

const DatePickerWrapper = styled.span``;

export const MarketMakerPerformance = (props) => {
    const { commonConfigs, lang } = props;
    const [tableData, setTableData] = useState([]);
    const [security, setSecurity] = useState('');
    const [marketMaker, setMarketMaker] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [reqObject, setReqObject] = useState({ RT: 3559, L: setLanguage(lang) });
    const convertByLang = (arText, enText) => (lang.langKey === 'AR' ? arText : enText);

    useEffect(() => {
        Axios.get(marketBackEndProxyPass(), {
            params: {
                ...reqObject,
            },
        }).then((res) => {
            let sortedData = res.data.sort((a, b) => a.MMDate - b.MMDate);
            handleMMFrirmId(sortedData);
        });
    }, []);

    useEffect(() => {
        Axios.get(marketBackEndProxyPass(), {
            params: {
                ...reqObject,
            },
        }).then((res) => {
            let sortedData = res.data.sort((a, b) => a.MMDate - b.MMDate);
            handleMMFrirmId(sortedData);
        });
    }, [reqObject]);

    const handleMMFrirmId = (data) => {
        let mmArray = [];
        data &&
            data.forEach((element) => {
                let firm = element.MMFirm;
                let FormattedDate = handleDateFormat(element.MMDate);
                let obj = {
                    AddDate: element.AddDate,
                    AvgQuotes: element.AvgQuotes,
                    Id: element.Id,
                    MMDate: FormattedDate,
                    MMFirmId: element.MMFirmId,
                    SecName: element.SecName,
                    SecShortName: element.SecShortName,
                    Status: element.Status,
                    Stk: element.Stk,
                    TotalTrades: element.TotalTrades,
                    TotalValue: element.TotalValue,
                    TotalVolume: element.TotalVolume,
                    MMFirm:
                        lang.langKey === 'EN'
                            ? firm.replace(' - Market Maker', '')
                            : firm.replace(' صانع سوق -', ''),
                    unformttedDate: element.MMDate,
                };
                mmArray.push(obj);
            });
        setTableData(mmArray);
    };

    const handleDateFormat = (date) => {
        let year = getYear(date);
        let month = lang.langKey === 'AR' ? getArabicMonthText(date) : getShortMonthText(date);
        return month + ' - ' + year;
    };

    const changeToDate = (date) => setToDate(date);
    const changeFromDate = (date) => setFromDate(date);
    const changeSecurity = (newSecurity) => setSecurity(newSecurity);
    const changeMarketMaker = (newMarketMaker) => setMarketMaker(newMarketMaker);
    const handleDate = (date) => {
        let str = dateForURL(date);
        let newStr = str.slice(0, -2);
        return newStr;
    };

    const filter = () => {
        let temp = reqObject;
        delete temp.SYMC;
        delete temp.MM;
        if (security && security != 'ALL') {
            temp.SYMC = security;
        }
        if (fromDate) {
            temp.SD = handleDate(fromDate);
        }
        if (toDate) {
            temp.ED = handleDate(toDate);
        }
        if (marketMaker) {
            temp.MM = marketMaker;
        }

        setReqObject({ ...temp });
    };

    const clearFilters = () => {
        setReqObject({ RT: 3559, L: setLanguage(lang) });
        setSecurity('');
        setMarketMaker('');
        setToDate('');
        setFromDate('');
    };

    let componentSettingsListofParticipants = {
        columns: [
            {
                columnName: lang.langKey === 'AR' ? 'شهر سنة' : 'Month  -  Year',
                dataType: 'monthYear',
                mappingField: 'MMDate',
                underLinedValue: 'unformttedDate',
            },
            {
                columnName: lang.langKey === 'AR' ? 'رقم السهم' : 'Security Code',
                dataType: 'text',
                mappingField: 'Stk',
            },
            {
                columnName: lang.langKey === 'AR' ? 'اسم الشركة' : 'Company Name',
                dataType: 'text',
                mappingField: 'SecName',
            },
            {
                columnName: lang.langKey === 'AR' ? 'اسم صانع السوق' : 'Market Maker Name',
                dataType: 'text',
                mappingField: 'MMFirm',
            },
            {
                columnName: lang.langKey === 'AR' ? 'القيمة الإجمالية' : 'Total Value',
                dataType: 'figure_0decimals',
                mappingField: 'TotalValue',
            },
            {
                columnName: lang.langKey === 'AR' ? 'الحجم الكلي' : 'Total Volume',
                dataType: 'figure_0decimals',
                mappingField: 'TotalVolume',
            },
            {
                columnName: lang.langKey === 'AR' ? 'عدد الصفقات' : 'Total Number of Trades',
                dataType: 'figure_0decimals',
                mappingField: 'TotalTrades',
            },
            {
                columnName:
                    lang.langKey === 'AR' ? 'متوسط التسعير في اليوم' : 'Average Quotes per day',
                dataType: 'figure_0decimals',
                mappingField: 'AvgQuotes',
            },
        ],
        showColumnTitle: true,
        httpRequest: {},
        rawData: tableData,
        id: 'table',
    };

    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="Market Maker Performance" />
    ) : (
        <Fragment>
            <Div className="row">
                <DivInline>
                    <SelectSecurity
                        value={security}
                        callback={changeSecurity}
                        lang={lang.langKey}
                        width={'220px'}
                        styles="height: 38px; border: 1px solid #ccc; border-radius: 5px;"
                    ></SelectSecurity>
                </DivInline>
                <DivInline>
                    <SelectMarketMaker
                        value={marketMaker}
                        callback={changeMarketMaker}
                        lang={setLanguage(lang)}
                        width={'220px'}
                        styles="height: 38px; border: 1px solid #ccc; border-radius: 5px;"
                    ></SelectMarketMaker>
                </DivInline>
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
                    <DivInline>
                        <DatePickerComponent
                            data={{
                                data: { title: convertByLang('الى', 'To Date') },
                                styles: {},
                                settings: { callBack: changeToDate, placeHolder: toDate },
                            }}
                        />
                    </DivInline>
                </DatePickerWrapper>
                <ButtonWrapper>
                    <Button bgColor={'#C5964A'} onClick={() => filter()}>
                        {convertByLang('تصفية ', 'Filter')}
                    </Button>{' '}
                    <Button onClick={() => clearFilters()}>
                        {convertByLang('مسح التصفية', 'Clear')}
                    </Button>
                </ButtonWrapper>
            </Div>
            <Tools>
                <ExportButton
                    title={
                        lang.langKey == 'EN' || lang.langKey == 'en'
                            ? 'Market Maker Performance'
                            : 'أداء صانع السوق'
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
                            ? 'Market Maker Performance'
                            : 'أداء صانع السوق'
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
                            ? 'Market Maker Performance'
                            : 'أداء صانع السوق'
                    }
                    id="ua-lang"
                    orientation="l"
                    format="a4"
                    type={constants.PDF}
                    lang={lang.langKey}
                />
            </Tools>
            <TableUiComponent
                componentSettings={componentSettingsListofParticipants}
            ></TableUiComponent>
        </Fragment>
    );
};
