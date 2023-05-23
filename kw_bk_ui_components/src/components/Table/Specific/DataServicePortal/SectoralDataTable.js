import React, { useState, useRef, Fragment, useEffect } from 'react';
import Axios from 'axios';
import styled from 'styled-components';
import { TableUiComponent } from '../../TableComponent';
import { SpecificPreviewComponent } from '../../../SpecificPreviewComponent';
import { marketBackEndProxyPass } from '../../../../config/path';
import { dateForURL, setLanguage } from '../../../../helper/metaData';
import { DatePickerComponent } from '../../../DatePicker/DatePickerComponent';
import { SelectSectorIndex } from '../../../Common/SelectSectorIndex';

const Section = styled.div`
    padding: 0 5px;
`;

const FormWrapper = styled.div`
    padding: 10px;
    display: flex;
`;

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

const TabButton = styled.button`
    padding: 10px 20px;
    width: 200px;
    border: none;
    background: ${(props) => (props.selected ? 'gray' : '#e6e5e3')};
    color: ${(props) => (props.selected ? 'white' : 'black')};
`;
export const SectoralData = (props) => {
    const { commonConfigs, data, lang } = props;
    const isPremiumUser = false;
    const [fromDate, setFromDate] = useState('');
    const [toDate, setToDate] = useState('');
    const [tradeDate, setTradeDate] = useState('');
    const [selectedSector, setSelectedSector] = useState('');
    const [tableData, setTableData] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const [isBefore, setIsBefore] = useState(true);
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
    const handleTradeDateChange = (newDate) => setTradeDate(newDate);
    const handleSelectedSector = (newSector) => setSelectedSector(newSector);

    useEffect(
        // reseting states on tab switch
        () => {
            if (tradeDate) {
                setTradeDate('');
            }
            if (toDate) {
                setToDate('');
            }
            if (fromDate) {
                setFromDate('');
            }
            if (showResults) {
                setShowResults(false);
            }
            if (tableData.length > 0) {
                setTableData([]);
            }
        },
        [isBefore]
    );

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
        if (selectedSector) {
            temp.TID = selectedSector;
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

    const resultColumns = !isBefore
        ? [
              {
                  columnName: lang.langKey === 'AR' ? 'التاريخ' : 'Date',
                  mappingField: 'TransactionDate',
                  dataType: 'date',
              },
              {
                  columnName: lang.langKey === 'AR' ? 'فهرس' : 'Index',
                  mappingField: 'Index',
                  dataType: 'text',
              },
              {
                  columnName: lang.langKey === 'AR' ? 'الإغلاق' : 'Close',
                  mappingField: 'Close',
                  dataType: 'figure_0decimals',
              },
          ]
        : [
              {
                  columnName: lang.langKey === 'AR' ? 'التاريخ' : 'Date',
                  mappingField: 'TransactionDate',
                  dataType: 'date',
              },
              {
                  columnName: lang.langKey === 'AR' ? 'فهرس' : 'Index',
                  mappingField: 'Index',
                  dataType: 'text',
              },
              {
                  columnName: lang.langKey === 'AR' ? 'الافتتاح' : 'Open',
                  mappingField: 'Open',
                  dataType: 'figure_0decimals',
              },
              {
                  columnName: lang.langKey === 'AR' ? 'الإغلاق' : 'Close',
                  mappingField: 'Close',
                  dataType: 'figure_0decimals',
              },
              {
                  columnName: lang.langKey === 'AR' ? 'أعلى' : 'High',
                  mappingField: 'High',
                  dataType: 'figure_0decimals',
              },
              {
                  columnName: lang.langKey === 'AR' ? 'أدنى' : 'Low',
                  mappingField: 'Low',
                  dataType: 'figure_0decimals',
              },
              {
                  columnName: lang.langKey === 'AR' ? 'الكمية' : 'Volume',
                  mappingField: 'Volume',
                  dataType: 'figure_0decimals',
              },
              {
                  columnName: lang.langKey === 'AR' ? 'القيمة' : 'Value',
                  mappingField: 'Value',
                  dataType: 'figure_0decimals',
              },
              {
                  columnName: lang.langKey === 'AR' ? 'مجموع الصفقات' : 'Total Trades',
                  mappingField: 'NoOfTrades',
                  dataType: 'figure_0decimals',
              },
          ];

    let componentsSettings = {
        menuName: 'Sectoral Data',
        columns: resultColumns,
        showColumnTitle: true,
        httpRequest: {},
        rawData: tableData,
    };

    const clearFilters = () => {
        setTradeDate('');
        setToDate('');
        setFromDate('');
        setSelectedSector('');
    };

    // add specific preview component
    return (
        <div>
            {isPremiumUser ? (
                <React.Fragment></React.Fragment>
            ) : (
                <React.Fragment>
                    {' '}
                    <TabButton onClick={() => setIsBefore(false)} selected={!isBefore}>
                        Starting April 2018
                    </TabButton>
                    <TabButton onClick={() => setIsBefore(true)} selected={isBefore}>
                        Before April 2018
                    </TabButton>
                </React.Fragment>
            )}
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
                {!isBefore ? (
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
                ) : (
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
                )}

                <ButtonWrapper>
                    <Button bgColor={'#C5964A'} onClick={() => onClickShow()}>
                        {convertByLang('عرض ', 'Show')}
                    </Button>
                    <Button onClick={() => clearFilters()}>
                        {convertByLang('مسح التصفية', 'Clear')}
                    </Button>
                </ButtonWrapper>
            </Div>
            {showResults ? (
                <div>
                    {tableData.length != 0 ? (
                        <TableUiComponent componentSettings={componentsSettings}></TableUiComponent>
                    ) : (
                        <p>Data Not Found</p>
                    )}
                </div>
            ) : (
                <React.Fragment></React.Fragment>
            )}
        </div>
    );
};
