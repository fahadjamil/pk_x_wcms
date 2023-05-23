import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { marketBackEndProxyPass } from '../../../../config/path';
import { getUrlDate } from '../../../../helper/date';
import { TableUiComponent } from '../../../Table/TableComponent';

const TableWrapper = styled.div`
    margin-top: 20px;
`;
const TableHeadingWrapper = styled.h3`
    margin: 20px 0;
`;

export const PerformanceOfSectorIndices = (props) => {
    const { lang } = props;

    const [tableData, setTableData] = useState([]);
    const { year, month, curMonthText, prevMonthText, reportMode, quarter } = getUrlDate(lang);
    const convertByLang = (arText, enText) => (lang.langKey === 'AR' ? arText : enText);

    useEffect(() => {
        Axios.get(marketBackEndProxyPass(), {
            params: {
                RT: 3565,
                Y: year,
                M: month,
                L: convertByLang('A', 'E'),
                T: reportMode,
            },
        }).then((res) => {
            if (res && res.data && Array.isArray(res.data)) {
                setTableData(res.data);
            }
        });
    }, []);

    const previousColumnName = () => {
        switch (reportMode) {
            case 3:
                return `${month - 1 ? '' : year -1 } ${prevMonthText}`;
            case 4:
                return ` ${quarter - 1 ? '' : year - 1} Q${quarter - 1 || 4}`;
            case 6:
                return year - 1;

            default:
                break;
        }
    };

    const currentColumnName = () => {
        switch (reportMode) {
            case 3:
                return `${month - 1 ? '' : year } ${curMonthText}`;
            case 4:
                return `Q${quarter}`;
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

    const performanceOfMainIndices_changes = {
        columns: [
            {
                columnName: convertByLang('مؤشر القطاع', 'Sector Index'),
                mappingField: 'SectorNameEn',
                dataType: 'text',
                disableSorting: true,
            },
            {
                columnName: previousColumnName(),
                dataType: 'price',
                mappingField: 'PrevClosed',
                disableSorting: true,
            },
            {
                columnName: currentColumnName(),
                dataType: 'price',
                mappingField: 'CurrentClosed',
                disableSorting: true,
            },

            {
                columnName: CHANGE_TERM(),
                dataType: 'figure',
                mappingField: 'YtdPerc',
                disableSorting: true,
            },
            {
                columnName: convertByLang('مؤشر القطاع', 'Sector Index'),
                dataType: 'ArText',
                mappingField: 'SectorNameAr',
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
                {convertByLang('أداء مؤشرات القطاعات', 'Performance of Sector Indices')}
            </TableHeadingWrapper>
            <TableWrapper>
                <TableUiComponent
                    componentSettings={performanceOfMainIndices_changes}
                ></TableUiComponent>
            </TableWrapper>
        </div>
    );
};
