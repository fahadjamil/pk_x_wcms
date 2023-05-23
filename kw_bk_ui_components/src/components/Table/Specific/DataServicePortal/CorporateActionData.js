import React, { useState } from 'react';
import Axios from 'axios';
import styled from 'styled-components';
import { TableUiComponent } from '../../TableComponent';
import { SpecificPreviewComponent } from '../../../SpecificPreviewComponent';
import { dateForURL, setLanguage } from '../../../../helper/metaData';
import { marketBackEndProxyPass } from '../../../../config/path';
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

// Corporate Action for Data Service Portal
export const CorporateAction = (props) => {
    const { commonConfigs, lang } = props;
    const [toDate, setToDate] = useState('');
    const [fromDate, setFromDate] = useState('');
    const [tableData, setTableData] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [reqObject, setReqObject] = useState({ RT: '', L: setLanguage(lang) });
    const convertByLang = (arText, enText) => (lang.langKey === 'AR' ? arText : enText);

    const handleToDateChange = (newDate) => setToDate(newDate);
    const handleFromDateChange = (newDate) => setFromDate(newDate);

    const reqParams = {
        L: setLanguage(lang),
        TD: toDate ? dateForURL(toDate) : undefined,
        FD: fromDate ? dateForURL(fromDate) : undefined,
    };
    let componentSettingsEndOfDay = {
        menuName: 'Corporate Action Data',
        columns: [
            {
                columnName: lang.langKey === 'AR' ? 'رقم السهم' : 'Security Code',
                mappingField: 'secCode',
                dataType: 'text',
                disableSorting: true,
            },
            {
                columnName: lang.langKey === 'AR' ? 'الإسم' : 'Security Name',
                mappingField: 'secName',
                dataType: 'ticker',
                disableSorting: true,
            },
            {
                columnName: lang.langKey === 'AR' ? 'يكتب' : 'Corporate Action Type',
                mappingField: 'actionType',
                dataType: 'text',
                disableSorting: true,
            },
            {
                columnName: lang.langKey === 'AR' ? 'استحقاقات الأسهم %' : 'CA %',
                mappingField: 'ca',
                dataType: 'figure',
                disableSorting: true,
            },
            {
                columnName: lang.langKey === 'AR' ? 'تاريخ تداول السهم دون استحقاق' : 'Ex.Date',
                mappingField: 'exDate',
                dataType: 'date',
                disableSorting: true,
            },
            {
                columnName: lang.langKey === 'AR' ? 'تاريخ الاستحقاق' : 'Record Date',
                mappingField: 'recDate',
                dataType: 'date',
                disableSorting: true,
            },
            {
                columnName: lang.langKey === 'AR' ? 'تاريخ تأكيدا' : 'Confirm Date',
                mappingField: 'confirmDate',
                dataType: 'date',
                disableSorting: true,
            },
            {
                columnName: lang.langKey === 'AR' ? 'تاريخ حيازة السهم' : 'Cum Date',
                mappingField: 'cumDate',
                dataType: 'date',
                disableSorting: true,
            },
            {
                columnName: lang.langKey === 'AR' ? 'تاريخ التوزيع' : 'Payment Date',
                mappingField: 'payDate',
                dataType: 'date',
                disableSorting: true,
            },
            {
                columnName: lang.langKey === 'AR' ? 'التاريخ' : 'AGM Date',
                mappingField: 'AGMDate',
                dataType: 'date',
                disableSorting: true,
            },
            {
                columnName: lang.langKey === 'AR' ? 'الإغلاق' : 'Close Price',
                mappingField: 'clsPrc',
                dataType: 'figure_0decimals',
                disableSorting: true,
            },
            {
                columnName: lang.langKey === 'AR' ? 'سعر الإغلاق المعدل' : 'Adjusted Closing Price',
                mappingField: 'adgClsPrc',
                dataType: 'figure_0decimals',
                disableSorting: true,
            },
            {
                columnName: lang.langKey === 'AR' ? 'عدد الاسهم المصدرة' : 'No of Issued Shares',
                mappingField: 'noOfIssued',
                dataType: 'figure_0decimals',
                disableSorting: true,
            },
            {
                columnName:
                    lang.langKey === 'AR'
                        ? 'عدد جديد من الأسهم المصدرة'
                        : 'New No of Issued Shared',
                mappingField: 'newNoOfIssued',
                dataType: 'figure_0decimals',
                disableSorting: true,
            },
            {
                columnName: lang.langKey === 'AR' ? 'عدد الاسهم القائمة' : 'Outstanding Shares',
                mappingField: 'outShares',
                dataType: 'figure_0decimals',
                disableSorting: true,
            },
            {
                columnName:
                    lang.langKey === 'AR' ? 'عدد جديد من الأسهم المعلقة' : 'New Outstanding Shares',
                mappingField: 'newOutShares',
                dataType: 'figure_0decimals',
                disableSorting: true,
            },
        ],
        showColumnTitle: true,

        httpRequest: {},
        rawData: tableData,
    };

    const onClickShow = () => {
        if (toDate || fromDate) {
            Axios.get('http://192.168.14.102:8081/bk/ClientService', {
                params: { ...reqParams },
            }).then((res) => setTableData(res.data));
            setShowResults(true);
        }
    };

    const clearFilters = () => {};

    // return commonConfigs.isPreview ? (
    //     <SpecificPreviewComponent title="Corporate Action Data" />
    // ) : (
    return (
        <div>
            <Div className="row">
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
                                settings: { callBack: handleToDateChange, placeHolder: toDate },
                            }}
                        />
                    </DivInline>
                </DatePickerWrapper>

                <ButtonWrapper>
                    <Button bgColor={'#C5964A'} onClick={() => onClickShow()}>
                        {convertByLang('تصفية ', 'Filter')}
                    </Button>
                    <Button onClick={() => clearFilters()}>
                        {convertByLang('مسح التصفية', 'Clear')}
                    </Button>
                </ButtonWrapper>
            </Div>

            {showResults ? (
                <div>
                    {tableData.length != 0 ? (
                        <TableUiComponent
                            componentSettings={componentSettingsEndOfDay}
                        ></TableUiComponent>
                    ) : (
                        <p>Data Not Found</p>
                    )}{' '}
                </div>
            ) : (
                <React.Fragment></React.Fragment>
            )}
        </div>
    );
};
