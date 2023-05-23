import React, { memo, useState, useEffect } from 'react';
import Axios from 'axios';
import styled from 'styled-components';
import TableHead from './TableHead';
import TableCell from './TableCell';
import { sortCompareValues } from './TableSorting';
import { SortingDirections } from '../../config/SortingDirections';
import { SumRow } from './SumRow';
import { ManageColumns } from './ManageColumns/ManageColumns';
import { useColumnManager } from '../../customHooks/useColumnManager';
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
        lang,
        columns,
        httpRequest,
        showColumnTitle,
        languageKey,
        baseUrl,
        dbName,
        collectionType,
        rawData,
        isLastRowColored,
        id,
        showSumRow,
        enableColumnManager,
        tableName,
    } = params.componentSettings;

    useEffect(() => {
        let isResponseSuccess = true;

        Axios.get(httpRequest.dataSource, httpRequest.header).then((res) => {
            if (isResponseSuccess) {
                setCollectionData(res.data);
                setSortingTableColumn(initialSortingColumnDef);
            }
        });

        if (!httpRequest.dataSource && rawData) {
            setCollectionData(rawData);
            setSortingTableColumn(initialSortingColumnDef);
        }

        return () => {
            isResponseSuccess = false;
        };
    }, [httpRequest]);

    function onTableHeadClicked(column, ColumnKey) {
        if (!column.disableSorting) {
            let sortDir = SortingDirections.ascending;

            //Toggle sorting direction
            if (sortingTableColumn.colIndex === ColumnKey) {
                if (sortingTableColumn.sortDir === SortingDirections.ascending) {
                    sortDir = SortingDirections.descending;
                }
            }

            const tableSortingColumnConf = {
                colIndex: ColumnKey,
                sortDir: sortDir,
                column: column,
            };

            let colType = undefined;
            let mappingName = undefined;
            let initialDataMap = undefined;
            let underLinedValue = undefined;

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
                mappingName = column.underLinedValue ? column.underLinedValue : column.mappingField;

                if (mappingName && mappingName !== '') {
                    initialDataMap = collectionData.map((element, index) => {
                        let value = undefined;
                        if (element.fieldData) {
                            value = element.fieldData[mappingName];
                        } else {
                            value = element[mappingName];
                        }
                        return { index: index, value: value };
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
    }

    const [displayColumns, setDisplayColumns] = useState([]);
    useEffect(() => {
        if (!enableColumnManager) {
            setDisplayColumns(columns);
        }
    }, [columns]);
    
    return (
        <div className="table-responsive" id={id}>
            {enableColumnManager ? (
                <ManageColumns
                    columns={columns}
                    callBack={setDisplayColumns}
                    tableName={tableName}
                    lang={lang}
                />
            ) : (
                <React.Fragment />
            )}
            <table className="table">
                {showColumnTitle ? (
                    <TableHead
                        columns={displayColumns}
                        languageKey={languageKey}
                        onHeadClicked={onTableHeadClicked}
                        sortingTableColumn={sortingTableColumn}
                    ></TableHead>
                ) : (
                    <React.Fragment></React.Fragment>
                )}
                <tbody>
                    {collectionData.length > 0 ? (
                        collectionData &&
                        collectionData.map((value, key) => (
                            <TableRow
                                key={key}
                                index={key}
                                className={
                                    isLastRowColored
                                        ? key === collectionData.length - 1
                                            ? 'lastRowColored'
                                            : ''
                                        : ''
                                }
                            >
                                {displayColumns &&
                                    displayColumns.map((column, ColumnKey) => {
                                        if (languageKey) {
                                            return Object.entries(value.fieldData[languageKey]).map(
                                                ([fieldDataKey, fieldDataValue]) => {
                                                    if (
                                                        fieldDataKey ===
                                                        column.mappingField[languageKey]
                                                    ) {
                                                        console.log('rowIndex', key);
                                                        return (
                                                            <TableCell
                                                                key={ColumnKey}
                                                                rowIndex={key}
                                                                type={column.dataType[languageKey]}
                                                                fieldDataValue={fieldDataValue}
                                                                formatting={
                                                                    column.formatting &&
                                                                    column.formatting[languageKey]
                                                                }
                                                                baseUrl={baseUrl}
                                                                dbName={dbName}
                                                                collectionType={collectionType}
                                                                lang={lang}
                                                            />
                                                        );
                                                    }

                                                    return null;
                                                }
                                            );
                                        } else {
                                            return Object.entries(value.fieldData || value).map(
                                                ([fieldDataKey, fieldDataValue]) => {
                                                    if (fieldDataKey === column.mappingField) {
                                                        return (
                                                            <TableCell
                                                                rowIndex={key}
                                                                key={ColumnKey}
                                                                type={column.dataType}
                                                                fieldDataValue={fieldDataValue}
                                                                formatting={
                                                                    column.formatting &&
                                                                    column.formatting[languageKey]
                                                                }
                                                                baseUrl={baseUrl}
                                                                dbName={dbName}
                                                                collectionType={collectionType}
                                                                lang={lang}
                                                            />
                                                        );
                                                    }

                                                    return null;
                                                }
                                            );
                                        }
                                    })}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell>No data to display ...</TableCell>
                        </TableRow>
                    )}

                    {collectionData.length && showSumRow ? (
                        <SumRow columns={displayColumns} collectionData={collectionData}></SumRow>
                    ) : (
                        <React.Fragment></React.Fragment>
                    )}
                </tbody>
            </table>
        </div>
    );
});
