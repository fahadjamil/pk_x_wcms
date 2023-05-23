import React from 'react';
import styled from 'styled-components';
import { SortingDirections } from '../../config/SortingDirections';

const TableHeader = styled.thead`
    background: #c6974b;
    color: white;
`;

const TableHead = ({ columns, languageKey, onHeadClicked, sortingTableColumn }) => {
    return (
        <TableHeader className="thead-dark table-striped">
            <tr>
                {columns &&
                    columns.map((column, ColumnKey) => {
                        const { columnName } = column;

                        let sortingClassName = 'sortable';
                        if(sortingTableColumn && sortingTableColumn.colIndex >-1){
                            if(ColumnKey === sortingTableColumn.colIndex){
                                if(sortingTableColumn.sortDir === SortingDirections.ascending){
                                    sortingClassName = 'sortable sortable-ase';
                                }else if(sortingTableColumn.sortDir === SortingDirections.descending){
                                    sortingClassName = 'sortable sortable-des';
                                }
                            }
                        }

                        if (columnName) {
                            return (
                                <React.Fragment key={ColumnKey}>
                                    {languageKey ? (
                                        <th className={sortingClassName} onClick={()=>onHeadClicked(column, ColumnKey)}>{column.columnName[languageKey]}</th>
                                    ) : (
                                        <th className={sortingClassName} onClick={()=>onHeadClicked(column, ColumnKey)}>{column.columnName}</th>
                                    )}
                                </React.Fragment>
                            );
                        }

                        return null;
                    })}
            </tr>
        </TableHeader>
    );
};

export default TableHead;
