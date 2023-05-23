import React from 'react';
import styled from 'styled-components';
import TableCell from '../../TableCell';
import TableHead from '../../TableHead';
import { ExportOptions } from './subcomponents/ExportOptions';

const TableRow = styled.tr`
    background-color: ${(props) => (props.index % 2 ? ' #EAEAEB;' : 'FAFAFA')};
`;

const SectorSumRow = styled.tr`
    background-color: #aaaaaa;
    color: #ffffff;
`;

const MarketSumRow = styled.tr`
    background-color: #757171;
    color: #ffffff;
`;
const StatusSumRow = styled.tr`
    background-color: #333f4f;
    color: #ffffff;
`;

const EmptyWhiteCell = styled.td`
    background-color: #ffffff;
    color: #ffffff;
`;
export const TableGroupByCategory = (params) => {
    const { lang, columns, languageKey, rawData } = params.componentSettings;
    const convertByLang = (arText, enText) => (lang.langKey === 'AR' ? arText : enText);

    const SUMMARY = convertByLang('الملخص', 'Summary');

    // multiplied by 1000 and divided by 1000 due to javascript floating point multiplication error
    const getSectorSum = (status, market, sector, mappingField) =>
        rawData &&
        rawData[status] &&
        rawData[status][market] &&
        rawData[status][market][sector] &&
        rawData[status][market][sector].reduce(
            (count, company) => (count * 1000 + company[mappingField] * 1000) / 1000,
            0
        );

    const getMarketSum = (status, market, mappingField) =>
        rawData &&
        rawData[status] &&
        rawData[status][market] &&
        Object.keys(rawData[status][market]).reduce(
            (count, sector) =>
                (count * 1000 + getSectorSum(status, market, sector, mappingField) * 1000) / 1000,
            0
        );

    const getStatusSum = (status, mappingField) =>
        rawData &&
        rawData[status] &&
        Object.keys(rawData[status]).reduce(
            (count, market) =>
                (count * 1000 + getMarketSum(status, market, mappingField) * 1000) / 1000,
            0
        );

    const generateSectorSummationRow = (status, market, sector) =>
        columns &&
        columns.map((column, colIndex) => {
            if (colIndex < 2) {
                return <EmptyWhiteCell className="dash">-</EmptyWhiteCell>;
            } else if (column.mappingField === 'Sector') {
                return (
                    <td className="sector-sum" colSpan="2">
                        {SUMMARY} - {sector || ''}
                    </td>
                );
            } else if (column.mappingField === 'NameDesc') {
                return null;
            } else {
                return column.showSum ? (
                    <TableCell
                        key={colIndex}
                        type={column.dataType}
                        fieldDataValue={getSectorSum(status, market, sector, column.mappingField)}
                        lang={lang}
                        className="sector-sum"
                    />
                ) : (
                    <td className="sector-sum dash">-</td>
                );
            }
        });

    const generateMarketSummationRow = (status, market) =>
        columns &&
        columns.map((column, colIndex) => {
            if (colIndex === 0) {
                return <EmptyWhiteCell className="dash">-</EmptyWhiteCell>;
            } else if (column.mappingField === 'MarketDesc') {
                return (
                    <td className="market-sum" colSpan="2">
                        {SUMMARY} - {market || ''}
                    </td>
                );
            } else if (column.mappingField === 'Sector') {
                return null;
            } else {
                return column.showSum ? (
                    <TableCell
                        key={colIndex}
                        type={column.dataType}
                        fieldDataValue={getMarketSum(status, market, column.mappingField)}
                        lang={lang}
                        className="market-sum"
                    />
                ) : (
                    <td className="market-sum dash">-</td>
                );
            }
        });
    const generateStatusSummationRow = (status) =>
        columns &&
        columns.map((column, colIndex) => {
            if (column.mappingField === 'SymbolStatus') {
                return (
                    <td className="status-sum" colSpan="2">
                        {SUMMARY} - {status || ''}
                    </td>
                );
            } else if (column.mappingField === 'MarketDesc') {
                return null;
            } else {
                return column.showSum ? (
                    <TableCell
                        key={colIndex}
                        type={column.dataType}
                        fieldDataValue={getStatusSum(status, column.mappingField)}
                        lang={lang}
                        className="status-sum"
                    />
                ) : (
                    <td className="status-sum dash">-</td>
                );
            }
        });
    return (
        <div>
            <ExportOptions lang={lang} />
            <table className="table" id="table">
                <TableHead columns={columns} languageKey={languageKey}></TableHead>
                <tbody>
                    {rawData &&
                        Object.keys(rawData).map((status, statusIndex) => (
                            <React.Fragment>
                                {rawData &&
                                    rawData[status] &&
                                    Object.keys(rawData[status]).map((market, marketIndex) => (
                                        <React.Fragment>
                                            {rawData &&
                                                rawData[status] &&
                                                rawData[status][market] &&
                                                Object.keys(rawData[status][market]).map(
                                                    (sector, sectorIndex) => (
                                                        <React.Fragment>
                                                            {rawData &&
                                                                rawData[status] &&
                                                                rawData[status][market] &&
                                                                rawData[status][market][sector] &&
                                                                rawData[status][market][sector].map(
                                                                    (company, companyIndex) => (
                                                                        <TableRow
                                                                            index={
                                                                                companyIndex +
                                                                                sectorIndex +
                                                                                marketIndex +
                                                                                statusIndex
                                                                            }
                                                                        >
                                                                            {columns.map(
                                                                                (
                                                                                    column,
                                                                                    ColumnKey
                                                                                ) => (
                                                                                    <TableCell
                                                                                        key={
                                                                                            ColumnKey
                                                                                        }
                                                                                        type={
                                                                                            column.dataType
                                                                                        }
                                                                                        fieldDataValue={
                                                                                            company[
                                                                                                column
                                                                                                    .mappingField
                                                                                            ]
                                                                                        }
                                                                                        lang={lang}
                                                                                    />
                                                                                )
                                                                            )}
                                                                        </TableRow>
                                                                    )
                                                                )}
                                                            <SectorSumRow>
                                                                {generateSectorSummationRow(
                                                                    status,
                                                                    market,
                                                                    sector
                                                                )}
                                                            </SectorSumRow>
                                                        </React.Fragment>
                                                    )
                                                )}
                                            <MarketSumRow>
                                                {generateMarketSummationRow(status, market)}
                                            </MarketSumRow>
                                        </React.Fragment>
                                    ))}
                                <StatusSumRow>{generateStatusSummationRow(status)}</StatusSumRow>
                            </React.Fragment>
                        ))}
                </tbody>
            </table>
        </div>
    );
};
