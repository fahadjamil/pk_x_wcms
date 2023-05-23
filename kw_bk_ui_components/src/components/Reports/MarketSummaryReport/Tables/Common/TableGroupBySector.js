import React from 'react';
import styled from 'styled-components';
import TableCell from '../../../../Table/TableCell';
import TableHead from '../../../../Table/TableHead';

const TableRow = styled.tr`
    background-color: ${(props) => (props.index % 2 ? ' #EAEAEB;' : 'FAFAFA')};
`;

const SectorRow = styled.tr`
    background-color: #e3221222;
`;

const SumRow = styled.tr`
    background: #c4bcbb;
`;
const TableSumRow = styled.td`
    padding: 0.2em 1em 0.2em 1em;
    a {
        color: black;
        text-decoration: none;
    }
`;
export const TableGroupBySector = (params) => {
    const {
        lang,
        columns,
        showColumnTitle,
        languageKey,

        rawData,
    } = params.componentSettings;
    return (
        <div>
            <table className="table">
                {showColumnTitle ? (
                    <TableHead columns={columns} languageKey={languageKey}></TableHead>
                ) : (
                    <React.Fragment></React.Fragment>
                )}

                <tbody>
                    {rawData &&
                        Object.entries(rawData).map(([sector, sectorData], index) => {
                            return (
                                <React.Fragment>
                                    <SectorRow key={index} className="section-title">
                                        {columns.map((column, columnIndex) =>
                                            columnIndex == 0 ? (
                                                <td>
                                                    <strong>{sector}</strong>
                                                </td>
                                            ) : (
                                                <td></td>
                                            )
                                        )}
                                    </SectorRow>
                                    {sectorData.map((security, secIndex) => {
                                        return (
                                            <TableRow index={secIndex}>
                                                {columns.map((column) => {
                                                    return (
                                                        <TableCell
                                                            fieldDataValue={
                                                                security[column.mappingField]
                                                            }
                                                            type={column.dataType}
                                                        ></TableCell>
                                                    );
                                                })}
                                            </TableRow>
                                        );
                                    })}
                                    <SumRow className="section-sum">
                                        {columns &&
                                            columns.map((column, columnKey) => {
                                                let mappingField = column.mappingField;
                                                let sum = 0;

                                                sectorData &&
                                                    sectorData.map((value, key) =>
                                                        value[mappingField] &&
                                                        !isNaN(value[mappingField])
                                                            ? (sum += parseFloat(
                                                                  value[mappingField]
                                                              ))
                                                            : undefined
                                                    );
                                                return column.showSum ? (
                                                    <TableCell
                                                        key={columnKey}
                                                        fieldDataValue={sum}
                                                        type={column.dataType}
                                                    ></TableCell>
                                                ) : columnKey == 0 ? (
                                                    <TableSumRow key={columnKey}>
                                                        <u>
                                                            {' '}
                                                            {lang && lang.langKey == 'AR'
                                                                ? `اجمالي القطاع`
                                                                : 'Sector Total'}
                                                        </u>
                                                    </TableSumRow>
                                                ) : (
                                                    <TableSumRow key={columnKey}>
                                                        {' - '}
                                                    </TableSumRow>
                                                );
                                            })}
                                    </SumRow>
                                </React.Fragment>
                            );
                        })}
                </tbody>
            </table>
        </div>
    );
};
