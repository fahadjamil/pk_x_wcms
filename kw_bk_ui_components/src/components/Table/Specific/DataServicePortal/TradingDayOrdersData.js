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

export const TradingDayOrdersData = (props) => {
    const { commonConfigs, data, lang } = props;
    const [fromDate, setFromDate] = useState('');
    const [tableData, setTableData] = useState([]);
    const convertByLang = (arText, enText) => (lang.langKey === 'AR' ? arText : enText);

    const reqParams =
    data && data.settings && data.settings.collection && data.settings.collection.value == 1
        ? { RT: 3530}
        : { RT: 3530, SRC: 'KSEOTC'  };

    let componentSettingsEndOfDay = {
        menuName: 'Trading Day Orders Data',
        columns: [
            {
                columnName: lang.langKey === 'AR' ? 'رقم السهم' : 'Security Code',
                mappingField: 'Stk',
                dataType: 'text',
                disableSorting: true,
            },
            {
                columnName: lang.langKey === 'AR' ? 'الطلب' : 'Bid',
                mappingField: 'Bid',
                dataType: 'figure_0decimals',
                disableSorting: true,
            },
            {
                columnName: lang.langKey === 'AR' ? 'حجم الطلب' : 'Bid Quantity',
                mappingField: 'BidQty',
                dataType: 'figure_0decimals',
                disableSorting: true,
            },
            {
                columnName: lang.langKey === 'AR' ? 'العرض' : 'Ask',
                mappingField: 'Ask',
                dataType: 'figure_0decimals',
                disableSorting: true,
            },
            {
                columnName: lang.langKey === 'AR' ? 'حجم العرض' : 'Ask Quantity',
                mappingField: 'AskQty',
                dataType: 'figure_0decimals',
                disableSorting: true,
            }
        ],
        showColumnTitle: true,
        httpRequest: {
            header: {},
        },
        rawData: tableData,
    };

    const search = () => {
            Axios.get(marketBackEndProxyPass(), {
                params: {
                    ...reqParams,
                    L: setLanguage(lang),
                    TD: fromDate ? dateForURL(fromDate) : undefined,
                },
            }).then((res) => setTableData(res.data));
    };

    const changeFromDate = (date) => setFromDate(date);

    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="Current Day - Orders" />
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
