import React, { memo, useState, useEffect } from 'react';
import Axios from 'axios';
import styled from 'styled-components';
import TableHead from './TableHead';
import TableCell from './TableCell';
import { sortCompareValues } from './TableSorting';
import { SortingDirections } from '../../config/SortingDirections';
// import { genarateComponentLevelStyleConfigurations } from '../util/UiComponentsUtil';

const TableRow = styled.tr`
    background-color: ${(props) => (props.index % 2 ? ' #EAEAEB;' : 'FAFAFA')};
`;

const initialSortingColumnDef = {
    colIndex: -1,
    sortDir: SortingDirections.ascending,
    column: undefined,
};

export const TableUiComponent = memo((params) => {
    const [collectionData, setCollectionData] = useState([]);
    const [sortingTableColumn, setSortingTableColumn] = useState(initialSortingColumnDef);
    const {
        columns,
        httpRequest,
        showColumnTitle,
        languageKey,
        baseUrl,
        dbName,
        collectionType,
    } = params.componentSettings;

    useEffect(() => {
        let isResponseSuccess = true;
        if (httpRequest != null) {
            Axios.get(httpRequest.dataSource, httpRequest.header).then((res) => {
                if (isResponseSuccess) {
                    setCollectionData(res.data);
                    setSortingTableColumn(initialSortingColumnDef);
                }
            });
        }

        return () => {
            isResponseSuccess = false;
        };
    }, [params.componentSettings]);

    function onTableHeadClicked(column, ColumnKey) {
        let sortDir = SortingDirections.ascending;

        //Toggle sorting direction
        if (sortingTableColumn.colIndex === ColumnKey) {
            if (sortingTableColumn.sortDir === SortingDirections.ascending) {
                sortDir = SortingDirections.descending;
            }
        }

        const tableSortingColumnConf = { colIndex: ColumnKey, sortDir: sortDir, column: column };

        let colType = undefined;
        let mappingName = undefined;
        let initialDataMap = undefined;

        //Only map sorting data for optimized search- reduce data yeild
        if (languageKey) {
            colType = column.dataType[languageKey];
            mappingName = column.mappingField[languageKey];

            if (mappingName && mappingName !== '') {
                initialDataMap = collectionData.map((element, index) => {
                    return { index: index, value: element.fieldData[languageKey][mappingName] };
                });
            }
        } else {
            colType = column.dataType;
            mappingName = column.mappingField;

            if (mappingName && mappingName !== '') {
                initialDataMap = collectionData.map((element, index) => {
                    return { index: index, value: element.fieldData[mappingName] };
                });
            }
        }

        //Sort data according to column type
        if (colType && initialDataMap && initialDataMap.length > 0) {
            initialDataMap.sort(function (a, b) {
                return sortCompareValues(a, b, colType) * tableSortingColumnConf.sortDir;
            });

            //Organize tabale data according to sorting
            const result = initialDataMap.map((element) => {
                return collectionData[element.index];
            });

            setCollectionData(result);
            setSortingTableColumn(tableSortingColumnConf);
        }
    }

    const generateTableCell = (
        ColumnKey,
        dataType,
        fieldDataValue,
        formatting,
        baseUrl,
        dbName,
        collectionType
    ) => {
        return (
            <TableCell
                key={ColumnKey}
                type={dataType}
                fieldDataValue={fieldDataValue}
                formatting={formatting}
                baseUrl={baseUrl}
                dbName={dbName}
                collectionType={collectionType}
            />
        );
    };

    return (
        <div className="table-responsive">
            <table className="table">
                {showColumnTitle ? (
                    <TableHead
                        columns={columns}
                        languageKey={languageKey}
                        onHeadClicked={onTableHeadClicked}
                        sortingTableColumn={sortingTableColumn}
                    ></TableHead>
                ) : (
                    <React.Fragment></React.Fragment>
                )}
                <tbody>
                    {collectionData &&
                        collectionData.map((value, key) => {
                            return (
                                <TableRow key={key} index={key}>
                                    {columns &&
                                        columns.map((column, ColumnKey) => {
                                            const { mappingField, dataType, formatting } = column;
                                            if (languageKey) {
                                                if (mappingField) {
                                                    return Object.entries(
                                                        value.fieldData[languageKey]
                                                    ).map(([fieldDataKey, fieldDataValue]) => {
                                                        if (
                                                            fieldDataKey ===
                                                            mappingField[languageKey]
                                                        ) {
                                                            return generateTableCell(
                                                                ColumnKey,
                                                                dataType && dataType[languageKey],
                                                                fieldDataValue,
                                                                formatting &&
                                                                    formatting[languageKey],
                                                                baseUrl,
                                                                dbName,
                                                                collectionType
                                                            );
                                                        }

                                                        return null;
                                                    });
                                                }

                                                if (mappingField === undefined) {
                                                    return generateTableCell(
                                                        ColumnKey,
                                                        dataType && dataType[languageKey],
                                                        'Custom Column',
                                                        formatting && formatting[languageKey],
                                                        baseUrl,
                                                        dbName,
                                                        collectionType
                                                    );
                                                }

                                                return null;
                                            } else {
                                                if (mappingField) {
                                                    return Object.entries(value.fieldData).map(
                                                        ([fieldDataKey, fieldDataValue]) => {
                                                            if (fieldDataKey === mappingField) {
                                                                return generateTableCell(
                                                                    ColumnKey,
                                                                    dataType,
                                                                    fieldDataValue,
                                                                    formatting,
                                                                    baseUrl,
                                                                    dbName,
                                                                    collectionType
                                                                );
                                                            }

                                                            return null;
                                                        }
                                                    );
                                                }

                                                if (mappingField === undefined) {
                                                    return generateTableCell(
                                                        ColumnKey,
                                                        dataType,
                                                        'Custom Column',
                                                        formatting,
                                                        baseUrl,
                                                        dbName,
                                                        collectionType
                                                    );
                                                }

                                                return null;
                                            }
                                        })}
                                </TableRow>
                            );
                        })}
                </tbody>
            </table>
        </div>
    );
});
