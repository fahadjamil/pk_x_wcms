import React, { useState, useEffect } from 'react';
import { TableUiComponent } from '../TableComponent';
import { marketBackEndProxyPass, oldMarketBackEndProxyPass } from '../../../config/path';
import { DatePickerComponent } from '../../DatePicker/DatePickerComponent';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';
import Axios from 'axios';
import { setLanguage, dateForURL } from '../../../helper/metaData';
import styled from 'styled-components';
import { newsDetailLink } from '../../../config/constants';
import { useUserAgent } from '../../../customHooks/useUserAgent';
import { SelectSecurity } from '../../Common/SelectSecurity';

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

const Select = styled.select`
    word-wrap: normal;

    ${(props) => (props.isMobile ? 'width: 100%;' : 'width: 220px;')}
    height: 38px;
    border: 1px solid #ccc;
    border-radius: 5px;
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

export const CorporateActions = (props) => {
    const { commonConfigs, lang } = props;
    const isMobile = useUserAgent();
    const [security, setSecurity] = useState('');
    const [eventType, setEventType] = useState('ALL');
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [reqObject, setReqObject] = useState({ RT: 3509, L: setLanguage(lang) });
    const [tableData, setTableData] = useState([]);
    const convertByLang = (arText, enText) => (lang.langKey === 'AR' ? arText : enText);

    useEffect(() => {
        Axios.get(marketBackEndProxyPass(), {
            params: {
                ...reqObject,
            },
        }).then((res) => {
            if (res.data.dataFields) {
                const finalData = res.data.dataFields.map((item) => {
                    return {
                        ISINCode: item.ISINCode,
                        Stk: {
                            text: item.Stk,
                            link: newsDetailLink(item.NewsID, lang),
                        },
                        DisplayTicker: {
                            text: item.DisplayTicker,
                            link: newsDetailLink(item.NewsID, lang),
                        },
                        AGMCumDate: item.AGMCumDate,
                        AGMExDivDate: item.AGMExDivDate,
                        AGMRecordDate: item.AGMRecordDate,
                        AGMPaymentDate: item.AGMPaymentDate,
                    };
                });
                setTableData(
                    finalData.sort((a, b) => {
                        return b.AGMExDivDate - a.AGMExDivDate;
                    })
                );
            }
        });
    }, [reqObject]);
    //R= 50 because the initial API response is too large 5.6mb [remove for prod]
    const changeToDate = (date) => setToDate(date);
    const changeFromDate = (date) => setFromDate(date);
    const changeSecurity = (newSecurity) => setSecurity(newSecurity);
    const changeEventType = (newEvent) => setEventType(newEvent);

    const filter = () => {
        let temp = reqObject;

        delete temp.SYMC;
        delete temp.DT;
        if (security && security != 'ALL') {
            temp.SYMC = security;
        }
        if (eventType) {
            temp.DT = eventType;
        }
        if (fromDate) {
            temp.SD = dateForURL(fromDate);
        }
        if (toDate) {
            temp.ED = dateForURL(toDate);
        }

        setReqObject({ ...temp });
    };

    const clearFilters = () => {
        setReqObject({ RT: 3509, L: setLanguage(lang) });
        setEventType('ALL');
        setSecurity('');
        setToDate('');
        setFromDate('');
    };
    let componentSettings = {
        columns: [
            {
                columnName: convertByLang('رقم ISIN', 'ISIN Code'),
                dataType: 'text',
                mappingField: 'ISINCode',
            },
            {
                columnName: convertByLang('رقم السهم', 'Sec. Code'),
                mappingField: 'Stk',
                dataType: 'link',
            },
            {
                columnName: convertByLang('اسم السهم', 'Ticker'),
                dataType: 'link',
                mappingField: 'DisplayTicker',
            },

            {
                columnName: convertByLang(
                    ' تاريخ حيازة السهم \n (اخر يوم محمل بالأرباح) ',
                    'Cum-Dividend Date'
                ),
                dataType: 'date',
                mappingField: 'AGMCumDate',
                tooltip: convertByLang(
                    'تاريخ حيازة السهم (اخر يوم محمل بالأرباح) وهو اليوم الأخير الذي يجب عنده الاحتفاظ بالسهم حتى يكون المساهم مقيداً في سجلات الشركة في يوم الاستحقاق للحصول على التوزيعات. ويجب أن يكون هذا اليوم قبل يوم الاستحقاق ويتحدد ووفقاً لدورة التسوية (ثلاثة أيام تداول قبل يوم الاستحقاق).',
                    'Cum-Dividend Date (Cum-Div): It is the last day on which the share must be purchased in order for the shareholder to be registered in the companies’ registers on the Record Date to be entitled to the distributions. Such day must be before the Record Date and the Ex-Dividend Date and shall be determined according to the settlement cycle (three days before Record Date).'
                ),
            },
            {
                columnName: convertByLang(
                    'تاريخ  تداول السهم دون \n  (غير محمل بالأرباح)',
                    'Ex-Dividend Date'
                ),
                dataType: 'date',
                mappingField: 'AGMExDivDate',
                tooltip: convertByLang(
                    'تاريخ تداول السهم دون استحقاق (غير محمل بالأرباح) هو اليوم الذي يتم فيه تداول السهم غير محملاً بالتوزيعات النقدية أو توزيعات أسهم المنحة أو غيرها من الإجراءات التي ينتج عنها استحقاقات للأسهم، وهو اليوم الذي يتم فيه التعديل على سعر السهم نتيجة التوزيعات وفقاً لقواعد التداول.',
                    'Ex-Dividend Date (Ex-Div): The first day on which the share is traded without cash dividends or the bonus shares dividends or other corporate actions. It is also the day on which the share price is adjusted due to the distributions according to the trading rules.'
                ),
            },
            {
                columnName: convertByLang(
                    ' (غير محمل بالأرباح) \n (مقيد في سجل المساهمين)',
                    'Record Date'
                ),
                dataType: 'date',
                mappingField: 'AGMRecordDate',
                tooltip: convertByLang(
                    'تاريخ الاستحقاق (مقيد في سجل المساهمين)هو اليوم الذي يتم فيه تحديد المساهمين المقيدين بسجلات الشركة والمستحقين لتوزيعات الأرباح.',
                    'Record Date: The day on which the registered shareholders who are registered in the company’s register and entitled to receive the dividends are identified.'
                ),
            },
            {
                columnName: convertByLang('تاريخ التوزيع', 'Payment Date'),
                dataType: 'date',
                mappingField: 'AGMPaymentDate',
                tooltip: convertByLang(
                    'اليوم الذي يتم فيه سداد أرباح الأسهم وتنفيذ قرارات الجمعية العمومية',
                    `Payment Date: The day on which the dividends are paid, and the decisions of the general assembly meeting are executed.`
                ),
            },
        ],
        showColumnTitle: true,
        httpRequest: {
            header: {},
        },
        rawData: tableData,
    };
    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="Corporate Actions Filters and Table" />
    ) : (
        <div>
            <Div className="row" isMobile={isMobile}>
                <DivInline isMobile={isMobile}>
                    <SelectSecurity
                        value={security}
                        callback={changeSecurity}
                        lang={lang.langKey}
                        width={isMobile ? '100%' : '220px'}
                        styles="height: 38px; border: 1px solid #ccc; border-radius: 5px;"
                    ></SelectSecurity>
                </DivInline>
                <DivInline isMobile={isMobile}>
                    <Select
                        onChange={(event) => changeEventType(event.target.value)}
                        value={eventType}
                        isMobile={isMobile}
                    >
                        <option value="ALL">{convertByLang(' كل الأحداث', 'All Events')}</option>
                        <option value="CUMDATE">
                            {convertByLang('تاريخ حيازة السهم', 'Cum-Dividend')}
                        </option>
                        <option value="EXDATE">
                            {convertByLang('تاريخ تداول السهم دون استحقاق', 'Ex-Dividend')}
                        </option>
                        <option value="RDATE">
                            {convertByLang('تاريخ الاستحقاق', 'Record Date')}
                        </option>
                        <option value="PDATE">
                            {convertByLang('يوم الاستحقاق', 'Payment Date')}
                        </option>
                    </Select>
                </DivInline>
                <DatePickerWrapper isMobile={isMobile}>
                    <DivInline isMobile={isMobile}>
                        <DatePickerComponent
                            data={{
                                data: { title: convertByLang('من', 'From Date') },
                                styles: {},
                                settings: { callBack: changeFromDate, placeHolder: fromDate },
                            }}
                        />
                    </DivInline>
                    <DivInline isMobile={isMobile}>
                        <DatePickerComponent
                            data={{
                                data: { title: convertByLang('الى', 'To Date') },
                                styles: {},
                                settings: { callBack: changeToDate, placeHolder: toDate },
                            }}
                        />
                    </DivInline>
                </DatePickerWrapper>
                <ButtonWrapper isMobile={isMobile}>
                    <Button bgColor={'#C5964A'} onClick={() => filter()} isMobile={isMobile}>
                        {convertByLang('تصفية ', 'Filter')}
                    </Button>{' '}
                    <Button onClick={() => clearFilters()} isMobile={isMobile}>
                        {convertByLang('مسح التصفية', 'Clear')}
                    </Button>
                </ButtonWrapper>
            </Div>
            <br />
            <TableUiComponent componentSettings={componentSettings}></TableUiComponent>
        </div>
    );
};
