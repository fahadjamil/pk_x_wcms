import React, { useState } from 'react';
import styled from 'styled-components';
import { useUserAgent } from '../../../customHooks/useUserAgent';
import { Box } from './static/Box';
import { Clear } from './static/Clear';
import { Tick } from './static/Tick';

const HeaderWrapper = styled.div`
    background-color: #c5944b;
    border-radius: 5px 5px 0 0;
    display: flex;
    justify-content: space-between;
`;

const SearchWrapper = styled.div`
    display: flex;
    ${(props) => (props.isMobile ? ' padding: 3vh 10px;' : ' padding: 12.5px 25px;')}
`;

const SearchField = styled.input`
  max-height: 30px;
  border-radius: 5px !important;
  border: none;
  padding: 5px;
  :focus {
    outline: none !important;
}
}
`;

const ClearBtnWrapper = styled.div`
    ${(props) =>
        props.isMobile
            ? `     padding-top: 0.5vh; margin-left: 3px;
    `
            : `  margin: 3px;`}
`;
const SelectedStatus = styled.p`
    font-family: Arial;
    font-size: 12px;
    width: 100%;
    text-align: start;
    padding-left: 4%;
`;

const ItemCanvas = styled.div`
    display: flex;
    flex-wrap: wrap;
    overflow-x: hidden;
    overflow-y: auto;
    max-height: 50vh;
    justify-content: flex-start;
    padding: 0.5em 0;
`;

const ItemWrapper = styled.div`
    background: ${(props) => (props.required ? '#B0B0B0' : props.marked ? '  #c5944b' : '#FFFFFF')};
    border: 1px solid ${(props) => (props.required ? '#B0B0B0' : ' #c5944b')};
    border-radius: 5px;
    height: 30px;
    padding: 4px 5px;
    font-size: 14px;
    display: flex;
    font-family: Arial;
    flex: 0 0 44%;
    width: 44%;
    cursor: pointer;
    ${(props) =>
        props.lang && props.lang.langKey == 'AR'
            ? ' margin: 0.3em 4% 0 0;'
            : ' margin: 0.3em 0 0 4%;'}
`;
const ItemLabel = styled.p`
    color: ${(props) => (props.marked ? '#FFFFFF' : '#c5944b')};
    font-size: 12px;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    ${(props) =>
        props.lang && props.lang.langKey == 'AR' ? ' margin: 1px 7px 0 0' : ' margin: 1px 0 0 7px;'}
`;

const PrimaryActionButton = styled.button`
    color: #ffffff;
    border: 0px;
    border-radius: 5px;
    background-color: #c5944b;
    width: 20%;
    height: 2em;
`;
const SecondaryActionButton = styled.button`
    color: #c5944b;
    border: 0px;
    border-radius: 5px;
    background-color: #ffffff;
`;

const SelectAll = styled.p`
    border: none;
    background: none;
    color: #ffffff;
    font-family: Arial;
    font-size: 12px;
    width: 100%;
    text-align: end;
    ${(props) => (props.isMobile ? ' margin-top: 2em;' : ' margin-top: 1.5em;')}
    ${props=> props.lang && props.lang.langKey == 'AR' ? ' margin-left: 6%;' : ' margin-right: 6%;'}
`;

const FooterWrapper = styled.div`
    flex-wrap: nowrap !important;
`;

const Item = ({ marked, label, callBack, required, lang }) => (
    <ItemWrapper lang={lang} marked={marked} onClick={() => callBack()} required={required}>
        {marked ? <Tick height="20px" width="20px" /> : <Box height="20px" width="20px" />}
        <ItemLabel lang={lang} marked={marked}>
            {label}
        </ItemLabel>
    </ItemWrapper>
);

export const ManageColumnsModal = ({
    allColumns,
    callBack,
    handleSelectAll,
    handleClearAll,
    handleSave,
    lang,
}) => {
    const [search, setSearch] = useState('');
    const isMobile = useUserAgent();
    const convertByLang = (arText, enText) => (lang.langKey === 'AR' ? arText : enText);

    const SEARCH = convertByLang('بحث', 'Search');
    const SELECT_ALL = convertByLang('اختيار الكل', 'Select All');
    const CLEAR_ALL = convertByLang('مسح الكل', 'Clear All');
    const ALL_COLUMNS_SELECTED = convertByLang('اختيار جميع الاعمدة', 'All Columns Selected');
    const SELECTED = convertByLang('اعمدة مختارة', 'Selected');
    const SAVE = convertByLang('حفظ', 'Save');
    const CANCEL = convertByLang('الغاء', 'Cancel');

    // --- handle search ---
    const clearSearch = () => setSearch('');
    const handleSearch = (searchValue) => setSearch(searchValue.target.value);
    const convertLowerCase = (str) => str.toLowerCase();
    const searchStrLowerCase = convertLowerCase(search);
    const isMatch = (column) => convertLowerCase(column.columnName).search(searchStrLowerCase) > -1;
    const filtered = allColumns.filter((column) => isMatch(column));
    const displayColumns = search === '' ? allColumns : filtered;
    const isSearched = () => search && search.length > 0;

    // --- counts ---
    const seletedCount = allColumns.reduce(
        (count, column) => (column.marked ? count + 1 : count),
        0
    );
    const isAllSelected = allColumns.every((column) => column.marked);

    return (
        <div
            class="modal fade in"
            id="manageColumnModal"
            tabindex="-1"
            aria-labelledby="exampleModalLabel"
            aria-hidden="true"
        >
            <div class="modal-dialog">
                <div class="modal-content">
                    <HeaderWrapper class="modal-header">
                        <SearchWrapper isMobile={isMobile}>
                            <SearchField
                                type="text"
                                placeholder={SEARCH}
                                onChange={handleSearch}
                                value={search}
                                className="manage-columns-search"
                                isMobile={isMobile}
                            ></SearchField>
                            {isSearched() ? (
                                <ClearBtnWrapper onClick={() => clearSearch()} isMobile={isMobile}>
                                    <Clear width="18px" height="18px" />
                                </ClearBtnWrapper>
                            ) : (
                                <React.Fragment />
                            )}
                        </SearchWrapper>

                        <SelectAll
                            isMobile={isMobile}
                            onClick={() => (isAllSelected ? handleClearAll() : handleSelectAll())}
                            lang={lang}
                        >
                            {isAllSelected ? CLEAR_ALL : SELECT_ALL}
                        </SelectAll>
                    </HeaderWrapper>
                    <ItemCanvas class="modal-body">
                        {' '}
                        {displayColumns.map((item) => (
                            <Item
                                key={item.mappingField}
                                marked={item.marked}
                                label={item.columnName}
                                callBack={() => callBack(item.columnName)}
                                required={item.required}
                                isMobile={isMobile}
                                lang={lang}
                            />
                        ))}
                    </ItemCanvas>
                    <FooterWrapper className="modal-footer">
                        <SelectedStatus isMobile={isMobile}>
                            {isAllSelected ? ALL_COLUMNS_SELECTED : `${seletedCount} ${SELECTED}`}
                        </SelectedStatus>
                        <SecondaryActionButton
                            type="button"
                            class="btn btn-secondary"
                            data-dismiss="modal"
                        >
                            {CANCEL}
                        </SecondaryActionButton>
                        <PrimaryActionButton
                            type="button"
                            class="btn btn-primary"
                            onClick={() => handleSave()}
                            data-dismiss="modal"
                        >
                            {SAVE}
                        </PrimaryActionButton>
                    </FooterWrapper>
                </div>
            </div>
        </div>
    );
};
