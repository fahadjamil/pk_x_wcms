import React, { Fragment } from 'react';
import styled from 'styled-components';
import { SortingDirections } from '../../config/SortingDirections';

const TableHeader = styled.thead`
    background: #c5964a;
    color: white;
`;
const Tooltip = styled.div`
    visibility: hidden;
    width: 200px;
    background-color: #dfddd0;
    color: #435058;
    border-radius: 6px;
    padding: 5px;
    margin-top: 40px;
    margin-left: -20px;
    margin-right: -100px;
    position: absolute;
    z-index: 1;
`;

const Th = styled.div`
    position: relative;
    display: inline-block;
    white-space: pre-wrap;
    &:hover ${Tooltip} {
        visibility: visible;
    }
`;

const HeaderCol = styled.th`
    ${(props) =>
        props.type == 'custom' ||
        props.type == 'custom2' ||
        props.type == 'figure' ||
        props.type == 'figure_3decimals' ||
        props.type == 'figure_0decimals' ||
        props.type == 'figure_1decimal' ||
        props.type == 'price' ||
        props.type == 'ArText' ||
        props.type == 'perentage_2decimals' 
            ? 'text-align: right;'
            : ''}
`;

const TableHead = ({ columns, languageKey, onHeadClicked, sortingTableColumn }) => {
    return (
        <TableHeader className="thead-dark table-striped">
            <tr>
                {columns &&
                    columns.map((column, ColumnKey) => {
                        let sortingClassName = 'sortable';
                        if (sortingTableColumn && sortingTableColumn.colIndex > -1) {
                            if (ColumnKey === sortingTableColumn.colIndex) {
                                if (sortingTableColumn.sortDir === SortingDirections.ascending) {
                                    sortingClassName = 'sortable sortable-ase';
                                } else if (
                                    sortingTableColumn.sortDir === SortingDirections.descending
                                ) {
                                    sortingClassName = 'sortable sortable-des';
                                }
                            }
                        }

                        return (
                            <React.Fragment key={ColumnKey}>
                                {languageKey ? (
                                    <HeaderCol
                                        className={column.disableSorting ? '' : sortingClassName}
                                        onClick={() => onHeadClicked(column, ColumnKey)}
                                        type={column.dataType}
                                    >
                                        <Th>
                                            {column.tooltip ? (
                                                <Tooltip>{column.tooltip}</Tooltip>
                                            ) : (
                                                <Fragment></Fragment>
                                            )}
                                            {column.columnName[languageKey]}
                                        </Th>
                                    </HeaderCol>
                                ) : (
                                    <HeaderCol
                                        className={column.disableSorting ? '' : sortingClassName}
                                        onClick={() => onHeadClicked(column, ColumnKey)}
                                        type={column.dataType}
                                    >
                                        <Th>
                                            {column.tooltip ? (
                                                <Tooltip>{column.tooltip}</Tooltip>
                                            ) : (
                                                <Fragment></Fragment>
                                            )}
                                            {column.columnName}
                                        </Th>
                                    </HeaderCol>
                                )}
                            </React.Fragment>
                        );
                    })}
            </tr>
        </TableHeader>
    );
};

export default TableHead;
