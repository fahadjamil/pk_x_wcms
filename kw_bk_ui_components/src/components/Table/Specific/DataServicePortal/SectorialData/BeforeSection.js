import React, { useState, Fragment, useEffect } from 'react';
import Axios from 'axios';
import styled from 'styled-components';
import { TableUiComponent } from '../../../TableComponent';
import { SpecificPreviewComponent } from '../../../../SpecificPreviewComponent';
import { marketBackEndProxyPass } from '../../../../../config/path';
import { dateForURL, setLanguage } from '../../../../../helper/metaData';
import { DatePickerComponent } from '../../../../DatePicker/DatePickerComponent';
import { SelectSectorIndex } from '../../../../Common/SelectSectorIndex';

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

export const BeforeSection = (props) => {
    const { commonConfigs, data, lang } = props;
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [selectedSector, setSelectedSector] = useState('');
    const [tableData, setTableData] = useState([]);
    const [reqObject, setReqObject] = useState({
        RT: 3527,
        L: setLanguage(lang),
        SRC:
            data && data.settings && data.settings.collection && data.settings.collection.value == 2
                ? 'KSEOTC'
                : undefined,
    });
    const convertByLang = (arText, enText) => (lang.langKey === 'AR' ? arText : enText);

    const handleFromDateChange = (newDate) => setFromDate(newDate);
    const handleToDateChange = (newDate) => setToDate(newDate);
    const handleSelectedSector = (newSector) => setSelectedSector(newSector);

    useEffect(() => {
        Axios.get(marketBackEndProxyPass(), {
            params: { ...reqObject },
        }).then((res) => setTableData(res.data));
    }, [reqObject]);

    const onClickShow = () => {
        let temp = reqObject;

        delete temp.TID;
        delete temp.TD;
        delete temp.SD;
        delete temp.ED;

        if (selectedSector && selectedSector != 'ALL') {
            temp.TID = selectedSector;
        }
        if (fromDate) {
            temp.SD = dateForURL(fromDate);
        }
        if (toDate) {
            temp.ED = dateForURL(toDate);
        }

        setReqObject({ ...temp });
    };

    let componentsSettings = {
        menuName: 'Sectoral Data',
        columns: [
            {
                columnName: lang.langKey === 'AR' ? 'التاريخ' : 'Date',
                mappingField: 'TransactionDate',
                dataType: 'date',
                disableSorting: true,
            },
            {
                columnName: lang.langKey === 'AR' ? 'فهرس' : 'Index',
                mappingField: 'Index',
                dataType: 'text',
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
                columnName: lang.langKey === 'AR' ? 'مجموع الصفقات' : 'Total Trades',
                mappingField: 'NoOfTrades',
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
            RT: 3527,
            L: setLanguage(lang),
            SRC:
                data &&
                data.settings &&
                data.settings.collection &&
                data.settings.collection.value == 2
                    ? 'KSEOTC'
                    : undefined,
        });
        setToDate('');
        setFromDate('');
        setSelectedSector('');
    };

    return (
        <Fragment>
            {commonConfigs.isPreview ? (
                <SpecificPreviewComponent title="Before Section - Sectorial Data" />
            ) : (
                <Fragment>
                    <Div className="row">
                        <DivInline>
                            <SelectSectorIndex
                                lang={lang.langKey}
                                width={'220px'}
                                styles="height: 38px; border: 1px solid #ccc; border-radius: 5px;"
                                value={selectedSector}
                                callback={handleSelectedSector}
                            />
                        </DivInline>
                        <DatePickerWrapper>
                            <DivInline>
                                <DatePickerComponent
                                    data={{
                                        data: { title: convertByLang('من', 'From Date') },
                                        styles: {},
                                        settings: {
                                            callBack: handleFromDateChange,
                                            placeHolder: fromDate,
                                            maxDate: `${new Date('2018-4-30')}`,
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
                                            maxDate: `${new Date('2018-4-31')}`,
                                        },
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
                    {tableData.length != 0 ? (
                        <TableUiComponent componentSettings={componentsSettings}></TableUiComponent>
                    ) : (
                        <Fragment></Fragment>
                    )}
                </Fragment>
            )}
        </Fragment>
    );
};
