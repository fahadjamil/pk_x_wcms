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

export const AfterSection = (props) => {
    const { commonConfigs, data, lang } = props;
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [tradeDate, setTradeDate] = useState('');
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
    const handleTradeDateChange = (newDate) => setTradeDate(newDate);
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

        if (selectedSector && selectedSector != 'ALL') {
            temp.TID = selectedSector;
        }
        if (tradeDate) {
            temp.TD = dateForURL(tradeDate);
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
                columnName: lang.langKey === 'AR' ? 'الإغلاق' : 'Close',
                mappingField: 'Close',
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
        setTradeDate('');
        setSelectedSector('');
    };

    return (
        <Fragment>
            {commonConfigs.isPreview ? (
                <SpecificPreviewComponent title="After Section - Sectorial Data" />
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
                                        data: {
                                            title: convertByLang('تاريخ المبادلة', 'Trade Date '),
                                        },
                                        styles: {},
                                        settings: {
                                            callBack: handleTradeDateChange,
                                            placeHolder: tradeDate,
                                            minDate: `${new Date('2018-4-1')}`,
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
