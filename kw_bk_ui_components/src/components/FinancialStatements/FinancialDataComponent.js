import Axios from 'axios';
import React, { useEffect, useState, Fragment } from 'react';
import styled from 'styled-components';
import { marketBackEndProxyPass } from '../../config/path';
import { useURLparam } from '../../customHooks/useURLparam';
import { TableUiComponent } from '../Table/TableComponent';
import { FinancialDataMetaData } from './FinancialDataMetaData';

import { ExportButton } from '../../components/ExportPrintButtons/ExportButton';
import { PrintButton } from '../../components/ExportPrintButtons/PrintButton';
import { XLSX } from '../../config/constants';
import { setLanguage } from '../../helper/metaData';

const StyledButton = styled.button`
    background: #c5964a;
    color: white;
    padding: 5px 10px;
    border: none;
    border-radius: 5px;
    float: ${(props) => props.side};
    margin-bottom: 5px;
`;

const ButtonDiv = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-bottom: 5px;
`;

const AvailabilityDiv = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;
export const FinancialDataComponent = (props) => {
    const { lang } = props;

    const [tableData, setTableData] = useState([]);
    const [generalInfo, setGeneralInfo] = useState(null);
    const [years, setYears] = useState([]);
    const [isAnnual, setIsAnnual] = useState(true);
    const [visible, setVisible] = useState(false);
    const [dataUnavailable, setDataUnavailable] = useState(false);
    const stockID = useURLparam();

    const convertByLang = (arText, enText) => (lang.langKey === 'AR' ? arText : enText);
    const quarters = [
        convertByLang('الربع الرابع ', 'Fourth Quarter'),
        convertByLang('الربع الثالث ', 'Third Quarter'),
        convertByLang('الربع الثانى', 'Second Quarter'),
        convertByLang('الربع الأول', 'First Quarter'),
    ];
    const TWO_DASH_EMPTY_CELL = ' -- ';

    // Thousand separator
    const formatAsCurrency = (value) => value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    useEffect(() => {
        if (stockID) {
            Axios.get(marketBackEndProxyPass(), {
                params: {
                    RT: 3549,
                    L: setLanguage(lang),
                    T: 2,
                },
            }).then((res) => {
                let visible = res.data.filter((x) => x.Stk == stockID);
                if (visible.length > 0) {
                    setVisible(true);
                }
            });
            Axios.get(marketBackEndProxyPass(), {
                params: {
                    RT: 3500,
                    SID: props.SID,
                    SYMC: stockID,
                    NY: isAnnual ? getNY() : undefined,
                    A: isAnnual && !props.isSingleYear ? 1 : undefined,
                    P: isAnnual ? undefined : 4,
                    N: props.isSingleYear ? 1 : undefined,
                },
            })
                .then((res) => {
                    let responseYears = getSortedKeyValues(res.data.dataFields);
                    setYears(responseYears);

                    let response = res.data.headerFields.map((header) => {
                        let rowObject = {
                            desc: convertByLang(header.msgNameAr, header.msgNameEng),
                            sortOrder: header.sortOrder,
                        };
                        // generating data for Annual mode
                        if (isAnnual) {
                            responseYears.map((yr) => {
                                let dataObj = res.data.dataFields[yr].find(
                                    (data) => data.msgId == header.msgID
                                );

                                rowObject[yr] =
                                    (dataObj &&
                                        dataObj.msgValue &&
                                        formatValue(dataObj.msgValue)) ||
                                    TWO_DASH_EMPTY_CELL;
                            });
                        } else {
                            // generating data for Quarterly mode
                            responseYears.map((yr) => {
                                let dataObj = res.data.dataFields[yr].filter(
                                    (data) => data.msgId == header.msgID
                                );

                                quarters.map((quarter, index) => {
                                    let quarterIndex = index + 1;
                                    let quarterData = dataObj.find(
                                        (data) => data.period == quarterIndex
                                    );

                                    // set key using year along with period
                                    // eg. 2016 (Period 1) First Quarter -> 2016_1
                                    rowObject[`${yr}_${quarterIndex}`] =
                                        (quarterData &&
                                            quarterData.msgValue &&
                                            formatValue(quarterData.msgValue)) ||
                                        TWO_DASH_EMPTY_CELL;
                                });
                            });
                        }
                        return rowObject;
                    });
                    response.sort((a, b) => a.sortOrder - b.sortOrder);
                    setTableData(response);
                    setGeneralInfo(res.data.generalInfo);

                    if (response && Array.isArray(response) && response.length == 0) {
                        setDataUnavailable(true);
                    }
                })
                .catch((err) => setDataUnavailable(true));
        }
    }, [stockID, isAnnual]);

    const getNY = () => (props.isSingleYear ? 1 : 8);

    const formatValue = (value) => {
        if (isNaN(value)) {
            return value;
        }
        return props.isSingleYear
            ? positionMinusSymbol(floatThousandSeparator(value))
            : positionMinusSymbol(formatAsCurrency(Number(value).toFixed(2)));
    };

    const floatThousandSeparator = (value) => {
        let numerics = value.toString().split('.');
        return `${formatAsCurrency(numerics[0])}.${numerics[1] || 0}`;
    };

    const positionMinusSymbol = (value) =>
        value < 0 ? convertByLang(`${value * -1}-`, value) : value;

    const getSortedKeyValues = (object) =>
        Object.keys(object).sort((a, b) => parseInt(b) - parseInt(a));

    const generateColumns = () => {
        if (isAnnual) {
            return years.map((year) => ({
                columnName: props.isSingleYear ? ' ' : year,
                mappingField: year,
                dataType: 'custom',
                disableSorting: true,
            }));
        } else {
            let columnNames = [];
            years.map((yr) =>
                quarters.map((quarter, index) => {
                    let quarterPeriod = 4 - index;
                    let showColumn = tableData.find(
                        (data) => data[`${yr}_${quarterPeriod}`] != TWO_DASH_EMPTY_CELL
                    );
                    if (showColumn) {
                        let quarterData = {
                            columnName: `${quarter} ${yr}`,
                            mappingField: `${yr}_${quarterPeriod}`,
                            dataType: 'custom',
                            disableSorting: true,
                        };
                        columnNames.push(quarterData);
                    }
                })
            );
            return columnNames;
        }
    };
    let componentSettings = {
        columns: [
            {
                columnName: ' ',
                mappingField: 'desc',
                dataType: 'text',
                disableSorting: true,
            },
            ...generateColumns(),
        ],
        showColumnTitle: true,
        httpRequest: {
            header: {},
        },
        rawData: tableData,
        id: 'table',
    };
    const togglePeriod = () => {
        //   setting TableData to an empty array, avoiding table glitching issue on period change
        setTableData([]);
        setIsAnnual(!isAnnual);
    };

    return (
        <Fragment>
            {visible ? (
                <AvailabilityDiv>
                    {lang.langKey == 'EN' ? 'Data Not Available' : 'البيانات غير متاحة'}
                </AvailabilityDiv>
            ) : (
                <div>
                    {!props.isSingleYear ? (
                        <StyledButton
                            onClick={() => togglePeriod()}
                            side={lang.langKey == 'AR' ? 'left' : 'right'}
                        >
                            {' '}
                            {isAnnual
                                ? convertByLang('المعلومات الربع سنوية', 'Get Quarterly Data')
                                : convertByLang('المعلومات السنوية', 'Get Annual Data')}
                        </StyledButton>
                    ) : (
                        <React.Fragment></React.Fragment>
                    )}
                    <ButtonDiv>
                        <ExportButton
                            title={`${props.name} (${stockID})`}
                            id="ua-lang"
                            orientation="l"
                            format="a4"
                            type={XLSX}
                            lang={lang.langKey}
                        />
                        <PrintButton
                            title={`${props.name} (${stockID})`}
                            id="ua-lang"
                            orientation="l"
                            format="a4"
                            lang={lang.langKey}
                            autoPrint={true}
                        />
                    </ButtonDiv>
                    {generalInfo ? (
                        <FinancialDataMetaData generalInfo={generalInfo} lang={lang} />
                    ) : (
                        <React.Fragment />
                    )}

                    {dataUnavailable ? (
                        <AvailabilityDiv>
                            {lang.langKey == 'EN' ? 'Data Not Available' : 'البيانات غير متاحة'}
                        </AvailabilityDiv>
                    ) : years.length > 0 ? (
                        <TableUiComponent componentSettings={componentSettings}></TableUiComponent>
                    ) : (
                        <React.Fragment />
                    )}
                </div>
            )}
        </Fragment>
    );
};
