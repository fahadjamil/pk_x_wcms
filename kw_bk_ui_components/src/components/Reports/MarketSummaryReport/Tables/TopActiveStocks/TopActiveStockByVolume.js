import React from 'react';
import { TableUiComponent } from '../../../../Table/TableComponent';

export const TopActiveStockByVolume = (props) => {
    const { tableData, title, lang } = props;

    const convertByLang = (arText, enText) => (lang.langKey === 'AR' ? arText : enText);

    const topActiveStock = {
        columns: [
            {
                columnName: convertByLang('الشركة', 'Company'),
                mappingField: 'DisplayTickerEn',
                dataType: 'text',
                disableSorting: true,
            },
            {
                columnName: convertByLang('نسبة الى السوق', '% to Market'),
                dataType: 'figure',
                mappingField: 'MktVolume',
                disableSorting: true,
            },
            {
                columnName: convertByLang('نسبة الى القطاع', '% to Sector'),
                dataType: 'figure',
                mappingField: 'SectVolume',
                disableSorting: true,
            },
            {
                columnName: convertByLang('الكمية المتداولة', 'Traded Volume'),
                dataType: 'figure_0decimals',
                mappingField: 'Volume',
                disableSorting: true,
            },
            {
                columnName: convertByLang('الشركة', 'Company'),
                dataType: 'ArText',
                mappingField: 'DisplayTickerAr',
                disableSorting: true,
            },
        ],
        showColumnTitle: true,
        httpRequest: {},
        rawData: tableData,
    };
    return (
        <div>
            <h3>{title}</h3>
            <TableUiComponent componentSettings={topActiveStock}></TableUiComponent>
        </div>
    );
};
