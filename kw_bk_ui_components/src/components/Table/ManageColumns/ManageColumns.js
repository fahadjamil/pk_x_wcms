import React, { useEffect, useReducer, useState } from 'react';
import styled from 'styled-components';
import { useColumnManager } from '../../../customHooks/useColumnManager';
import { ManageColumnsModal } from './ManageColumnsModal';

const StyledButton = styled.button`
    width: 150px;
    height: 30px;
    color: #ffffff;
    border: 0px;
    border-radius: 5px;
    background-color: #c5944b;
    margin-bottom: 5px;
    font-size: 1em;

    &:hover {
        background-color: #c5944b;
        cursor: pointer;
   
      }
    &:focus {
        border: 0px;
    }
`;
export const ManageColumns = ({ columns, callBack, tableName, lang }) => {
    const [allColumns, setAllColumns] = useState(
        columns.map((item) => ({ ...item, marked: true }))
    );
    const [columnsFromLS, setCol] = useColumnManager(tableName);
    useEffect(() => {
        if (columnsFromLS && columnsFromLS.length > 0) {
            updateFromBrowserStorage();
        }else {
            callBack(allColumns);
        }
    }, [columnsFromLS]);

    const convertByLang = (arText, enText) => (lang.langKey === 'AR' ? arText : enText);

    // ---text---
    const MANAGE_COLUMNS_AR = 'ترتيب الاعمدة';
    const MANAGE_COLUMNS = convertByLang(MANAGE_COLUMNS_AR, 'Manage Columns');

    const updateFromBrowserStorage = () => {
        if (columnsFromLS) {
            let tempAllColumns = allColumns.map((column) =>
                column.required || columnsFromLS.includes(column.mappingField)
                    ? { ...column, marked: true }
                    : { ...column, marked: false }
            );

            setAllColumns(tempAllColumns);
            callBack(tempAllColumns.filter(col=>col.marked));
        }
    };

    // --- handle events ---
    const toggleState = (mappingField) =>
        setAllColumns(
            allColumns.map((column) => {
                if (!column.required && column.columnName === mappingField) {
                    return { ...column, marked: !column.marked };
                }
                return column;
            })
        );
    const handleSelectAll = () =>
        setAllColumns(allColumns.map((column) => ({ ...column, marked: true })));
    const handleClearAll = () =>
        setAllColumns(
            allColumns.map((column) =>
                column.required ? { ...column } : { ...column, marked: false }
            )
        );
    const handleSave = () => {
        let tempSelectedColumns = allColumns.filter((column) => column.marked);
        let selectedMappingFields = tempSelectedColumns.map((column) => column.mappingField);

        callBack(tempSelectedColumns);
        setCol(selectedMappingFields);
    };

    return (
        <div>
            <StyledButton
                type="button"
                className="btn manage-columns-btn"
                data-toggle="modal"
                data-target="#manageColumnModal"
            >
                {MANAGE_COLUMNS}
            </StyledButton>

            <ManageColumnsModal
                allColumns={allColumns}
                callBack={toggleState}
                handleSelectAll={handleSelectAll}
                handleClearAll={handleClearAll}
                handleSave={handleSave}
                lang={lang}
            />
        </div>
    );
};
