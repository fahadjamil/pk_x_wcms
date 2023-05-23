import React, { useState, useEffect, Fragment } from 'react';
import Axios from 'axios';
import styled from 'styled-components';
import moment from 'moment';
import { DatePickerComponent } from '../../DatePicker/DatePickerComponent';
import { marketBackEndProxyPass } from '../../../config/path';
import { TableUiComponent } from '../TableComponent';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';
import { setLanguage, dateForURL } from '../../../helper/metaData';
import { ExportButton } from '../../ExportPrintButtons/ExportButton';
import { PrintButton } from '../../ExportPrintButtons/PrintButton';
import { SelectSecurity } from '../../Common/SelectSecurity';
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

export const CircuitBreaker = (props) => {
    const { commonConfigs, lang } = props;
    const [tableData, setTableData] = useState([]);
    const [security, setSecurity] = useState('');
    const [date, setDate] = useState('');
    const [defaultDate, setDefaultDate] = useState('');
    const [reqObject, setReqObject] = useState({ RT: 3552, L: setLanguage(lang) });
    const convertByLang = (arText, enText) => (lang.langKey === 'AR' ? arText : enText);

    useEffect(() => {
        Axios.get(marketBackEndProxyPass(), {
            params: {
                ...reqObject,
            },
        }).then((res) => {
            let sortedData = res.data.DataFields.sort((a, b) => a.CBStartTime - b.CBStartTime);
            setTableData(sortedData);
            handleDefaultDate(res.data.TradeDate);
        });
    }, []);

    useEffect(() => {
        Axios.get(marketBackEndProxyPass(), {
            params: {
                ...reqObject,
            },
        }).then((res) => {
            let sortedData = res.data.DataFields.sort((a, b) => a.CBStartTime - b.CBStartTime);
            setTableData(sortedData);
            handleDefaultDate(res.data.TradeDate);
        });
    }, [reqObject]);

    const changeSecurity = (newSecurity) => setSecurity(newSecurity);
    const changeDate = (date) => {
        setDefaultDate('');
        setDate(date);
    };
    const handleDefaultDate = (date) => {
        setDefaultDate(moment(date).format('YYYY-MM-DDTHH:mm:ss.SSS'));
    };

    let componentSettingsCircuitBreaker = {
        columns: [
            {
                columnName: lang.langKey === 'AR' ? '#رقم' : '#No',
                mappingField: 'Stk',
                dataType: 'autoIncrement',
            },
            {
                columnName: lang.langKey === 'AR' ? 'رقم السهم' : 'Security Code',
                dataType: 'text',
                mappingField: 'Stk',
            },
            {
                columnName: lang.langKey === 'AR' ? 'اسم السهم' : 'Ticker',
                dataType: 'ticker',
                mappingField: 'DisplayTicker',
            },
            {
                columnName: lang.langKey === 'AR' ? 'الإسم' : 'Name',
                dataType: 'text',
                mappingField: 'SecName',
            },
            {
                columnName: lang.langKey === 'AR' ? 'وقت البدء' : 'Start Time   ',
                dataType: 'detailedTime',
                mappingField: 'CBStartTime',
            },
            {
                columnName: lang.langKey === 'AR' ? 'وقت النهاية' : 'End Time     ',
                dataType: 'detailedTime',
                mappingField: 'CBEndTime',
            },
            {
                columnName: lang.langKey === 'AR' ? 'تغيير الأسعار(%)' : 'Price Change%',
                dataType: 'figure_4decimals',
                mappingField: 'PriceChange',
            },
            {
                columnName:
                    lang.langKey === 'AR'
                        ? 'السعر المرجعي لمزاد فاصل التداول'
                        : 'Reference Price for CB Auction',
                dataType: 'price',
                mappingField: 'CBRefPrice',
            },
            {
                columnName:
                    lang.langKey === 'AR'
                        ? 'الحد الأعلى لمزاد فاصل التداول'
                        : 'CB Auction Upper Limit',
                dataType: 'price',
                mappingField: 'CBUpperLimit',
            },
            {
                columnName:
                    lang.langKey === 'AR'
                        ? 'الحد الأدنى لمزاد فاصل التداول'
                        : 'CB Auction Lower Limit ',
                dataType: 'price',
                mappingField: 'CBLowerLimit',
            },
            {
                columnName: lang.langKey === 'AR' ? 'تسلسل فاصل التداول' : 'CB Sequence',
                dataType: 'figure_0decimals',
                mappingField: 'CBsequence',
            },
        ],
        showColumnTitle: true,
        httpRequest: {},
        rawData: tableData,
        id: 'table',
        lang: lang,
    };

    const filter = () => {
        let temp = reqObject;

        delete temp.R;
        // if (security) {
        //     temp.SYMC = security;
        // }

        if (date) {
            temp.SD = dateForURL(date);
        }

        setReqObject({ ...temp });
    };

    const clearFilters = () => {
        setReqObject({ RT: 3552, L: setLanguage(lang) });
        // setSecurity('ALL');
        setDate('');
    };

    return (
        <Fragment>
            {commonConfigs.isPreview ? (
                <SpecificPreviewComponent title="Circuit Breakers Table" />
            ) : (
                <Fragment>
                    <Div className="row">
                        <DivInline>
                            {/* <SelectSecurity
                                value={security}
                                callback={changeSecurity}
                                lang={lang.langKey}
                                width={'220px'}
                                styles="height: 38px; border: 1px solid #ccc; border-radius: 5px;"
                            ></SelectSecurity> */}
                            <DatePickerComponent
                                data={{
                                    data: { title: convertByLang('من', 'From Date') },
                                    styles: {},
                                    settings: {
                                        callBack: changeDate,
                                        placeHolder: date,
                                        defaultValue: defaultDate,
                                    },
                                }}
                            />
                        </DivInline>
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
                                    ? 'Circuit Breaker'
                                    : 'فواصل التداول'
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
                                    ? 'Circuit Breaker'
                                    : 'فواصل التداول'
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
                                    ? 'Circuit Breaker'
                                    : 'فواصل التداول'
                            }
                            id="ua-lang"
                            orientation="l"
                            format="a4"
                            type={constants.PDF}
                            lang={lang.langKey}
                        />
                    </Tools>
                    <TableUiComponent
                        componentSettings={componentSettingsCircuitBreaker}
                    ></TableUiComponent>
                </Fragment>
            )}
        </Fragment>
    );
};
