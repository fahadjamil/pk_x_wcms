import React from 'react';
import styled from 'styled-components';

const TableSumRow = styled.td`
    padding: 0.2em 1em 0.2em 1em;
    a {
        color: black;
        text-decoration: none;
    }
`;

const SumRowWrapper = styled.tr`
    background: #c7954a !important;
    text-align: right;
`;

export const SumRow = (props) => {
    const { columns, collectionData } = props;
    return (
        <SumRowWrapper>
            {columns &&
                columns.map((column, ColumnKey) => {
                    let mappingField = column.mappingField;
                    let sum = 0;
                    collectionData &&
                        collectionData.map((value, key) =>
                            value[mappingField] && !isNaN(value[mappingField])
                                ? (sum += parseFloat(value[mappingField]) * 1000)
                                : undefined
                        );
                    const commaSeparator = (value) =>
                        value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

                    const formatSum = () => {
                        let isZero = sum === 0;
                        let numerics = sum.toString().split('.')[0];

                        if (column.dataType == 'figure_0decimals') {
                            // XXX
                            return isZero ? `0` : `${commaSeparator(numerics.substring(0, numerics.length - 3))}`;
                        }
                        if (column.dataType == 'figure') {
                            // XXX.YY
                            return isZero ? `0.00` : `${commaSeparator(
                                numerics.substring(0, numerics.length - 3)
                            )}.${numerics.substring(numerics.length - 3, numerics.length - 1)}`;
                        }
                        if (column.dataType == 'figure_3decimals') {
                            // XXX.YYY
                            return isZero ? `0.000` : `${commaSeparator(
                                numerics.substring(0, numerics.length - 3)
                            )}.${numerics.substring(numerics.length - 3)}`;
                        }

                        // XXX.YYY
                        return `${commaSeparator(
                            numerics.substring(0, numerics.length - 3)
                        )}.${numerics.substring(numerics.length - 3)}`;
                    };
                    return column.showSum ? (
                        <TableSumRow key={ColumnKey} className="sum">
                            {formatSum()}
                        </TableSumRow>
                    ) : (
                        <TableSumRow key={ColumnKey} className="sum">
                            {' '}
                        </TableSumRow>
                    );
                })}
        </SumRowWrapper>
    );
};
