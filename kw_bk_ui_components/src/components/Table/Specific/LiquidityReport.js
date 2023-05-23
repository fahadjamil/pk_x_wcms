import React, { useEffect, useState, Fragment } from 'react';
import Axios from 'axios';
import styled from 'styled-components';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';
import { marketBackEndProxyPass } from '../../../config/path';
import { setLanguage } from '../../../helper/metaData';
import { fullMonths } from '../../FilesList/consts';
import { ExportButton } from '../../ExportPrintButtons/ExportButton';
import { PrintButton } from '../../ExportPrintButtons/PrintButton';
import * as constants from '../../../config/constants';

const TableHeader = styled.th`
    text-align: center !important;
    background-color: #c5964a;
    color: white;
    border: 1px solid;
    padding-left: 7px;
    padding-right: 7px;
`;

const TableHeaderTrading = styled.th`
    text-align: center;
    background-color: #c5964a;
    color: white;
    border: 1px solid;
    padding-left: 7px;
    padding-right: 7px;
    width: 200px !important;
`;

const TableHeaderLiquidity = styled.th`
    text-align: center;
    background-color: #c5964a;
    color: white;
    border: 1px solid;
    padding-left: 7px;
    padding-right: 7px;
    width: 500px !important;
`;

const YearsHeader = styled.th`
    text-align: center !important;
    background-color: #c5964a;
    color: white;
    border: 1px solid;
    padding-left: 7px;
    padding-right: 7px;
    width: 100px;
`;

const YearCell = styled.td`
    text-align: center !important;
`;

const TableRow = styled.tr`
    background-color: ${(props) => (props.index % 2 ? ' #EAEAEB;' : 'FAFAFA')};
`;

const TableColumn = styled.td`
    padding: 0.75rem;
    vertical-align: top;
    text-align: center;
`;

const ButtonDiv = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-bottom: 5px;
`;

export const LiquidityReport = (props) => {
    const { commonConfigs, lang } = props;
    const [yearArr, setYearArr] = useState([]);
    const [monthArr, setMonthArr] = useState([]);
    const [monthlyData, setMonthlyData] = useState([]);

    useEffect(() => {
        Axios.get(marketBackEndProxyPass(), {
            params: {
                RT: 3566,
                L: setLanguage(lang),
            },
        }).then((res) => {
            handleYears(res.data);
        });
    }, []);

    const handleDataSet = (year, data, month) => {
        const lastArr = [];
        for (let i = 0; i < year.length; i++) {
            const objArr = [];
            for (let j = 0; j < data.length; j++) {
                if (year[i] == data[j].TradingYear) {
                    objArr.push(data[j]);
                } else {
                    continue;
                }
            }
            const obj = {
                year: year[i],
                reportData: objArr,
            };
            lastArr.push(obj);
        }
        lastArr.forEach((element) => {
            addMonths(element.reportData);
        });
        handleMonths(lastArr, month);
    };

    const addMonths = (data) => {
        let monthsExisting = [];
        let year = '';

        data.forEach((element) => {
            let obj = {
                month: element.MonthNumber,
                year: element.TradingYear,
            };
            monthsExisting.push(obj);
            year = element.TradingYear;
        });

        let map = {};
        fullMonths.forEach((i) => (map[i.id] = false));
        monthsExisting.forEach((i) => map[i.month] === false && (map[i.month] = true));
        let jsonArray = Object.keys(map).map((k) => ({
            month: k,
            matched: map[k],
        }));

        for (let index = 0; index < jsonArray.length; index++) {
            if (jsonArray[index].matched == false) {
                let newObj = {
                    AddDate: '',
                    Id: '',
                    MonthlyADTV: '',
                    QuarterNumber: '',
                    Status: '',
                    TotalTradingDays: '',
                    MonthNumber: jsonArray[index].month,
                    TradingYear: year,
                };
                data.push(newObj);
            }
        }

        let finalObj = {
            year: year,
            reportData: data,
        };
        return finalObj;
    };

    const handleYears = (listArr) => {
        let yearsArr = [];
        let monthArr = [];
        listArr &&
            listArr.map((item) => {
                yearsArr.push(item.TradingYear);
                monthArr.push(item.MonthNumber);
            });
        let uniqueYears = yearsArr.filter((val, id, array) => array.indexOf(val) == id);
        let uniqueMonths = monthArr.filter((val, id, array) => array.indexOf(val) == id);
        uniqueYears.sort((a, b) => b - a);
        uniqueMonths.sort((a, b) => a - b);
        setYearArr(uniqueYears);
        setMonthArr(uniqueMonths);
        handleDataSet(uniqueYears, listArr, uniqueMonths);
    };

    const handleMonths = (data, month) => {
        let arr = [];
        let obj = {};
        for (let index = 1; index < month.length + 1; index++) {
            let subArr = [];
            data.forEach((element) => {
                element.reportData.forEach((item) => {
                    if (item.MonthNumber == index) {
                        subArr.push(item);
                    }
                });
            });
            obj = {
                month: index,
                reportData: subArr,
            };
            arr.push(obj);
        }
        arr.sort((a, b) => b.TradingYear - a.TradingYear);
        setMonthlyData(arr);
    };

    const handleEmptyMonths = (data) => {
        let obj = {
            AddDate: '',
            Id: '',
            MonthNumber: '',
            MonthlyADTV: '',
            QuarterNumber: '',
            Status: '',
            TotalTradingDays: '',
            TradingYear: '',
        };
        if (yearArr.length == 5 && data.length < 5) {
            let count = 5 - (data.length - 1);
            for (let index = 1; index < count; index++) {
                data.push(obj);
            }
        } else if (yearArr.length < 5 && data.length == 0) {
            for (let index = 0; index < yearArr.length; index++) {
                data.push(obj);
            }
        } else if (yearArr.length < 5 && data.length != yearArr.length) {
            let count = yearArr.length - data.length;
            for (let index = 0; index < count; index++) {
                data.push(obj);
            }
        }
        return data;
    };

    const renderBody = (data, lang) => {
        const newDataSet = handleEmptyMonths(data);
        return (
            <Fragment>
                {newDataSet &&
                    newDataSet.map((item, key) => {
                        return (
                            <Fragment key={key}>
                                <TableColumn language={lang.langKey}>
                                    {item.TotalTradingDays || ' - '}
                                </TableColumn>
                                <TableColumn language={lang.langKey}>
                                    {formatAsNumber(item.MonthlyADTV) || ' - '}
                                </TableColumn>
                            </Fragment>
                        );
                    })}
            </Fragment>
        );
    };

    const renderMonth = (data) => {
        return (
            <Fragment>
                {fullMonths.map((item, key) => {
                    if (item.id == data.month) {
                        return (
                            <YearCell>{lang.langKey == 'EN' ? item.titleE : item.titleA}</YearCell>
                        );
                    }
                })}
            </Fragment>
        );
    };

    const formatAsCurrency = (value) => value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

    const formatAsNumber = (fieldDataValue) =>
        isNaN(fieldDataValue) ? `${fieldDataValue}` : handleNegativeNumeric(fieldDataValue);

    const handleNegativeNumeric = (fieldDataValue) =>
        fieldDataValue < 0.0
            ? `(${formatAsCurrency(fieldDataValue * -1)})`
            : `${formatAsCurrency(fieldDataValue)}`;

    return (
        <Fragment>
            {commonConfigs && commonConfigs.isPreview ? (
                <SpecificPreviewComponent title="Liquidity Report" />
            ) : (
                <Fragment>
                    {/* <ButtonDiv>
                <ExportButton
                    title={
                        lang.langKey == 'EN' || lang.langKey == 'en'
                            ? 'Indicative Liquidity Requirement'
                            : 'متطلبات السيولة الإرشادية'
                    }
                    id="table"
                    orientation="l"
                    format="a4"
                    type={constants.XLSX}
                    lang={lang.langKey}
                />
                <PrintButton
                    title={
                        lang.langKey == 'EN' || lang.langKey == 'en'
                            ? 'Indicative Liquidity Requirement'
                            : 'متطلبات السيولة الإرشادية'
                    }
                    id="table"
                    orientation="l"
                    format="a4"
                    lang={lang.langKey}
                    autoPrint={true}
                />
                <ExportButton
                    title={
                        lang.langKey == 'EN' || lang.langKey == 'en'
                            ? 'Indicative Liquidity Requirement'
                            : 'متطلبات السيولة الإرشادية'
                    }
                    id="table"
                    orientation="l"
                    format="a4"
                    type={constants.PDF}
                    lang={lang.langKey}
                />
            </ButtonDiv> */}
                    <br />
                    <table id="table">
                        <tr>
                            <YearsHeader rowSpan="3">
                                {lang.langKey === 'AR' ? 'الشهر' : 'Month'}
                            </YearsHeader>
                        </tr>
                        <tr>
                            {yearArr.map((item, key) => {
                                return (
                                    <TableHeader colSpan="2" key={key}>
                                        {item}
                                    </TableHeader>
                                );
                            })}
                        </tr>
                        <tr>
                            {yearArr.map((element, key) => {
                                return (
                                    <Fragment key={key}>
                                        <TableHeaderTrading>
                                            {lang.langKey === 'AR'
                                                ? 'أيام التداول'
                                                : 'Trading Days'}
                                        </TableHeaderTrading>
                                        <TableHeaderLiquidity>
                                            {lang.langKey === 'AR'
                                                ? 'الحد الأدنى للسيولة للسوق الأول'
                                                : 'Minimum Liquidity (ADTV) for Premier Market'}
                                        </TableHeaderLiquidity>
                                    </Fragment>
                                );
                            })}
                        </tr>
                        {monthlyData.map((item, key) => {
                            return (
                                <TableRow index={key}>
                                    {renderMonth(item)}
                                    {renderBody(item.reportData && item.reportData, lang)}
                                </TableRow>
                            );
                        })}
                    </table>
                </Fragment>
            )}
        </Fragment>
    );
};
