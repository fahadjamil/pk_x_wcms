import React, { useState, useRef, useEffect } from 'react';
import Axios from 'axios';
import styled from 'styled-components';
import { TableUiComponent } from '../../TableComponent';
import { SpecificPreviewComponent } from '../../../SpecificPreviewComponent';
import { marketBackEndProxyPass } from '../../../../config/path';
import { dateForURL, setLanguage } from '../../../../helper/metaData';
import { DatePickerComponent } from '../../../DatePicker/DatePickerComponent';

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

export const OffMarketDeals = (props) => {
    const { commonConfigs, data, lang } = props;
    const [selectedDate, setSelectedDate] = useState('');
    const [tableData, setTableData] = useState([]);
    const [showResults, setShowResults] = useState(false);
    const isRegular = data && data.settings.collection && data.settings.collection.value == 1;
    const convertByLang = (arText, enText) => (lang.langKey === 'AR' ? arText : enText);
    const handleSelectedDateChange = (newDate) => setSelectedDate(newDate);
    const reqParams = isRegular ? { RT: 3543 } : { RT: 3544 };

    let componentSettingsEndOfDay = {
        menuName: 'Off-Market Deals',
        columns: [
            {
                columnName: lang.langKey === 'AR' ? 'رقم السهم' : 'Security Code',
                mappingField: 'Stk',
                dataType: 'text',
                disableSorting: true,
            },
            {
                columnName: lang.langKey === 'AR' ? 'التاريخ' : 'Date',
                mappingField: isRegular ? 'SettleDate' : 'TradeDate',
                dataType: 'date',
                disableSorting: true,
            },
            {
                columnName:
                    lang.langKey === 'AR' ? 'أسعار الصفقات المتفق عليها' : 'Off-Market Trade Price',
                mappingField: 'TradesPrice',
                dataType: 'price',
                disableSorting: true,
            },
            {
                columnName:
                    lang.langKey === 'AR' ? 'حجم الصفقات المتفق عليها' : 'Off-Market Trade Volume',
                mappingField: 'TradesVolume',
                dataType: 'figure_0decimals',
                disableSorting: true,
            },
            {
                columnName:
                    lang.langKey === 'AR' ? 'قيمة الصفقات المتفق عليها' : 'Off-Market Trade Value',
                mappingField: 'TradesValue',
                dataType: 'figure_0decimals',
                disableSorting: true,
            },
        ],
        showColumnTitle: true,

        httpRequest: {},
        rawData: tableData,
    };

    const onClickShow = () => {
        if (selectedDate) {
            Axios.get(marketBackEndProxyPass(), {
                params: {
                    ...reqParams,
                    L: setLanguage(lang),
                    TD: selectedDate ? dateForURL(selectedDate) : undefined,
                },
            }).then((res) => setTableData(res.data));
            setShowResults(true);
        }
    };

    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="OffMarket Deals" />
    ) : (
        <div>
            <Div className="row">
                <DatePickerWrapper>
                    <DivInline>
                        <DatePickerComponent
                            data={{
                                data: { title: convertByLang('التاريخ', 'Trade Date ') },
                                styles: {},
                                settings: {
                                    callBack: handleSelectedDateChange,
                                    placeHolder: selectedDate,
                                },
                            }}
                        />
                    </DivInline>
                </DatePickerWrapper>

                <ButtonWrapper>
                    <Button bgColor={'#C5964A'} onClick={() => onClickShow()}>
                        {convertByLang('عرض ', 'Show')}
                    </Button>
                </ButtonWrapper>
            </Div>
            <TableUiComponent componentSettings={componentSettingsEndOfDay}></TableUiComponent>
        </div>
    );
};
