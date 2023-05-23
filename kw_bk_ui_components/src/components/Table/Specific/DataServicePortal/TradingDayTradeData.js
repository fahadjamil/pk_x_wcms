import React, { useState, useRef, useEffect } from 'react';
import { TableUiComponent } from '../../TableComponent';
import styled from 'styled-components';
import { SpecificPreviewComponent } from '../../../SpecificPreviewComponent';
import { marketBackEndProxyPass } from '../../../../config/path';
import { setLanguage, dateForURL } from '../../../../helper/metaData';
import { DatePickerComponent } from '../../../DatePicker/DatePickerComponent';
import Axios from 'axios';

const DivInline = styled.div`
    display: inline-block;
    padding: 10px;
    ${(props) => (props.isMobile ? 'width: 90%;' : '')}
`;

const Button = styled.button`
    display: inline-block;
    height: 38px;
    ${(props) => (props.isMobile ? 'width: 45%;' : 'width: 100px;')}
    margin: 10px;
    border-radius: 5px;
    font-size: 14px;
    border: none;
    color: white;
    border-radius: 5px;
    background: ${(props) => props.bgColor || '#BBBBBB'};
`;

const Div = styled.div`
    ${(props) => (props.isMobile ? 'text-align: center;' : 'padding-left: 25px;')}
`;

const ButtonWrapper = styled.div`
    ${(props) =>
        props.isMobile ? 'display: flex; width:90%; justify-content: space-between;' : ''}
`;

const DatePickerWrapper = styled.span`
    ${(props) => (props.isMobile ? 'width:90%; display: flex;justify-content: space-between;' : '')}
`;

export const TradingDayTradeData = (props) => {
    const { commonConfigs, data, lang } = props;
    const [fromDate, setFromDate] = useState('');
    const [tableData, setTableData] = useState([]);
    const convertByLang = (arText, enText) => (lang.langKey === 'AR' ? arText : enText);

    const reqParams =
        data && data.settings && data.settings.collection && data.settings.collection.value == 1
            ? { RT: 3529 }
            : { RT: 3542 };

    let componentSettingsEndOfDay = {
        menuName: 'Trading Day Trade Data',
        columns: [
            {
                columnName: lang.langKey === 'AR' ? 'رقم السهم' : 'Security Code',
                mappingField: 'Stk',
                dataType: 'text',
                disableSorting: true,
            },
            {
                columnName: lang.langKey === 'AR' ? 'سعر' : 'Price',
                mappingField: 'TradePrice',
                dataType: 'price',
                disableSorting: true,
            },
            {
                columnName: lang.langKey === 'AR' ? 'كمية التجارة' : 'Quantity',
                mappingField: 'TradeQty',
                dataType: 'figure_0decimals',
                disableSorting: true,
            },
            {
                columnName: lang.langKey === 'AR' ? 'زمن' : 'Time',
                mappingField: 'TradeDate',
                dataType: 'detailedTime',
                disableSorting: true,
            },
        ],
        showColumnTitle: true,
        httpRequest: {
            header: {},
        },
        rawData: tableData,
    };

    const changeFromDate = (date) => setFromDate(date);

    const search = () => {
        Axios.get(marketBackEndProxyPass(), {
            params: {
                ...reqParams,
                L: setLanguage(lang),
                TD: fromDate ? dateForURL(fromDate) : undefined,
            },
        }).then((res) => setTableData(res.data));
    };

    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="Current Day - Security" />
    ) : (
        <div>
            <Div className="row">
                <DatePickerWrapper>
                    <DivInline>
                        <DatePickerComponent
                            data={{
                                data: { title: convertByLang('من', 'From Date') },
                                styles: {},
                                settings: { callBack: changeFromDate, placeHolder: fromDate },
                            }}
                        />
                    </DivInline>
                </DatePickerWrapper>
                <ButtonWrapper>
                    <Button bgColor={'#C5964A'} onClick={() => search()}>
                        {convertByLang('عرض ', 'Show')}
                    </Button>
                </ButtonWrapper>
            </Div>

            <TableUiComponent componentSettings={componentSettingsEndOfDay}></TableUiComponent>
        </div>
    );
};
