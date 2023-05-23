import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { marketBackEndProxyPass } from '../../../../config/path';
import { getUrlDate } from '../../../../helper/date';
import { TableUiComponent } from '../../../Table/TableComponent';

const MarketStatisticsWrapper = styled.div`
    margin-top: 20px;
`;

const TableHeadingWrapper = styled.h3`
    margin: 20px 0;
`;

export const MarketStatisticsComparisonToPreviousYear = (props) => {
    const { lang } = props;
    const convertByLang = (arText, enText) => (lang.langKey === 'AR' ? arText : enText);

    const initTableData = [
        {
            tradeInfo: 'Traded Value (KD)',
            tradeInfoAR: 'القيمة المتداولة (د.ك.)',
            mappingField: 'Turnover',
        },
        {
            tradeInfo: 'Volume Traded',
            tradeInfoAR: 'الكمية المتداولة',
            mappingField: 'Volume',
        },
        {
            tradeInfo: 'Number of Transactions',
            tradeInfoAR: 'عدد الصفقات',
            mappingField: 'NoOfTrades',
        },
        {
            tradeInfo: 'Number of Trading Days',
            tradeInfoAR: 'عدد أيام التداول',
            mappingField: 'NoOfTradeDays',
        },
        {
            tradeInfo: 'Average Daily Traded Value (KD)',
            tradeInfoAR: 'متوسط القيمة اليومية (د.ك.)',
            mappingField: 'AvgTurnover',
        },
        {
            tradeInfo: 'Average Daily Traded Volume',
            tradeInfoAR: 'متوسط كمية الأسهم اليومية',
            mappingField: 'AvgVolume',
        },
        {
            tradeInfo: 'Average Daily Transactions',
            tradeInfoAR: 'متوسط الصفقات اليومية',
            mappingField: 'AvgNoOfTrades',
        },
        {
            tradeInfo: 'Securities with Increased Price',
            tradeInfoAR: 'اسهم ارتفعت اسعارها',
            mappingField: 'Ups',
        },

        {
            tradeInfo: 'Securities with Decreased Price',
            tradeInfoAR: 'اسهم انخفضت اسعارها',
            mappingField: 'Downs',
        },
        {
            tradeInfo: 'Securities with No Price Change',
            tradeInfoAR: 'أسهم لم تتغير',
            mappingField: 'NoChanges',
        },
        {
            tradeInfo: 'Number of Listed Companies',
            tradeInfoAR: 'عدد الشركات المدرجة',
            mappingField: 'TotSymbols',
        },
        {
            tradeInfo: 'New Listings',
            tradeInfoAR: 'إدراجات جديدة',
            mappingField: 'NoOfNewListing',
        },
        {
            tradeInfo: 'Capital (KD)',
            tradeInfoAR: 'رأس المال (د.ك.)',
            mappingField: 'MarketCap',
        },
    ];
    const [tableData, setTableData] = useState([]);

    const { year, month, curMonthText, prevMonthText, reportMode, quarter } = getUrlDate(lang);

    useEffect(() => {
        Axios.get(marketBackEndProxyPass(), {
            params: {
                RT: 3567,
                Y: year,
                M: month,
                MT: 'P',
                CT: 'Y',
                T: reportMode,
            },
        }).then((res) => {
            if (res && res.data) {
                let prevYearMonth = res.data.Prev && res.data.Prev[0];
                let currYearMonth = res.data.Curent && res.data.Curent[0];
                let change = res.data.Change && res.data.Change[0];

                let finalData = initTableData.map((field) => {
                    let obj = {
                        ...field,
                    };

                    obj.prevMonth = prevYearMonth ? prevYearMonth[field.mappingField] : ' - ';
                    obj.currMonth = currYearMonth ? currYearMonth[field.mappingField] : ' - ';
                    obj.ytdChange = change ? change[field.mappingField] : ' - ';

                    return obj;
                });
                setTableData(finalData);
            }
        });
    }, []);
    const previousColumnName = () => {
        switch (reportMode) {
            case 3:
                return `${year - 1} ${curMonthText} `;
            case 4:
                return `${year - 1} - Q${quarter}`;
            case 6:
                return year - 1;
            default:
                break;
        }
    };

    const currentColumnName = () => {
        switch (reportMode) {
            case 3:
                return ` ${year} ${curMonthText}`;
            case 4:
                return `${year} - Q${quarter}`;
            case 6:
                return year;
            default:
                break;
        }
    };

    const CHANGE_TERM = () =>
        reportMode === 6
            ? convertByLang('نسبة التغيير منذ بداية العام', 'YTD % Change')
            : convertByLang('نسبة التغيير', '% Change');

    const MarketStatisticsConfig = {
        columns: [
            {
                columnName: convertByLang('معلومة', 'Trade Information'),
                mappingField: 'tradeInfo',
                dataType: 'number',
                disableSorting: true,
            },
            {
                columnName: previousColumnName(),
                dataType: 'price',
                mappingField: 'prevMonth',
                disableSorting: true,
            },
            {
                columnName: currentColumnName(),
                dataType: 'price',
                mappingField: 'currMonth',
                disableSorting: true,
            },
            {
                columnName: CHANGE_TERM(),
                dataType: 'figure',
                mappingField: 'ytdChange',
                disableSorting: true,
            },
            {
                columnName: convertByLang('معلومة', 'Trade Information'),
                dataType: 'ArText',
                mappingField: 'tradeInfoAR',
                disableSorting: true,
            },
        ],
        showColumnTitle: true,
        httpRequest: {},
        rawData: tableData,
    };

    return (
        <div>
            <TableHeadingWrapper>
                {' '}
                {convertByLang(
                    `أداء السوق مقارنةً بالسنة الماضية`,
                    'Market Performance Compared to Previous Year'
                )}
            </TableHeadingWrapper>
            <MarketStatisticsWrapper>
                <TableUiComponent componentSettings={MarketStatisticsConfig}></TableUiComponent>
            </MarketStatisticsWrapper>
        </div>
    );
};