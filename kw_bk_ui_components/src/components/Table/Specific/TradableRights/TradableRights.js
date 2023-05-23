import React, { useEffect, useState, Fragment } from 'react';
import Axios from 'axios';
import { marketBackEndProxyPass } from '../../../../config/path';
import { TableUiComponent } from '../../TableComponent';
import { SpecificPreviewComponent } from '../../../SpecificPreviewComponent';
import { setLanguage } from '../../../../helper/metaData';
import { ExportButton } from '../../../ExportPrintButtons/ExportButton';
import { PrintButton } from '../../../ExportPrintButtons/PrintButton';
import styled from 'styled-components';
import * as constants from '../../../../config/constants';

const ButtonDiv = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-bottom: 5px;
`;

export const TradableRights = (props) => {
    const { data, commonConfigs, lang } = props;
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        Axios.get(marketBackEndProxyPass(), {
            params: { RT: 3573, L: setLanguage(lang) },
        }).then((res) => {
            if (res.data) {
                let sortedData = res.data.sort((a, b) => b.SubscriptionStart - a.SubscriptionStart);
                handleDataSet(sortedData);
            }
        });
    }, []);

    const handleMarket = (type) => {
        let market = '';
        if (type == 'PREMIER_TRI') {
            market = lang.langKey == 'EN' ? 'Premier' : 'السوق الأول';
        } else {
            market = lang.langKey == 'EN' ? 'Main' : 'السوق الرئيسي';
        }
        return market;
    };

    const handleDataSet = (dataArr) => {
        let newArr = [];

        dataArr.forEach((element) => {
            let params = element.SecCode + '-' + element.Stk;
            let obj = {
                CompanyName: {
                    text: element.CompanyName,
                    link: constants.tradableRightsSummary(params, lang),
                },
                SubscriptionEnd: element.SubscriptionEnd,
                DisplayTicker: element.DisplayTicker,
                SubscriptionStart: element.SubscriptionStart,
                SubscriptionPrice: element.SubscriptionPrice,
                Stk: element.Stk,
                SecCode: element.SecCode,
                MarketType: handleMarket(element.MarketType),
            };
            newArr.push(obj);
        });
        setTableData(newArr);
    };

    const settingsListofParticipants = {
        columns: [
            {
                columnName: lang.langKey === 'AR' ? 'رقم السهم' : 'Sec. Code',
                dataType: 'text',
                mappingField: 'SecCode',
            },
            {
                columnName: lang.langKey === 'AR' ? 'اسم السهم' : 'Ticker',
                dataType: 'ticker',
                mappingField: 'DisplayTicker',
            },
            {
                columnName: lang.langKey === 'AR' ? 'الإسم' : 'Security Name',
                dataType: 'link',
                mappingField: 'CompanyName',
            },
            {
                columnName: lang.langKey === 'AR' ? 'السوق' : 'Market',
                dataType: 'text',
                mappingField: 'MarketType',
            },
            {
                columnName: lang.langKey === 'AR' ? 'سعر الاكتتاب' : 'Subscription Price',
                dataType: 'price',
                mappingField: 'SubscriptionPrice',
            },
            {
                columnName:
                    lang.langKey === 'AR'
                        ? 'بداية فترة الاكتتاب في حقوق الاولوية'
                        : 'Subscription Start Date',
                dataType: 'date',
                mappingField: 'SubscriptionStart',
            },
            {
                columnName:
                    lang.langKey === 'AR'
                        ? 'نهاية فترة الاكتتاب في حقوق الاولوية'
                        : 'Subscription End Date',
                dataType: 'date',
                mappingField: 'SubscriptionEnd',
            },
        ],
        showColumnTitle: true,
        httpRequest: {
            header: {},
        },
        rawData: tableData,
        id: 'table',
    };

    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="Tradable Rights Table" />
    ) : (
        <Fragment>
            <ButtonDiv>
                <ExportButton
                    title={
                        lang.langKey == 'EN' || lang.langKey == 'en'
                            ? 'Rights Issue'
                            : 'حقوق الأولوية'
                    }
                    id="ua-lang"
                    orientation="l"
                    format="a4"
                    type={constants.XLSX}
                    lang={lang.langKey}
                />
                <PrintButton
                    title={
                        lang.langKey == 'EN' || lang.langKey == 'en'
                            ? 'Rights Issue'
                            : 'حقوق الأولوية'
                    }
                    id="ua-lang"
                    orientation="l"
                    format="a4"
                    lang={lang.langKey}
                    autoPrint={true}
                />
                <ExportButton
                    title={
                        lang.langKey == 'EN' || lang.langKey == 'en'
                            ? 'Rights Issue'
                            : 'حقوق الأولوية'
                    }
                    id="ua-lang"
                    orientation="l"
                    format="a4"
                    type={constants.PDF}
                    lang={lang.langKey}
                />
            </ButtonDiv>
            <TableUiComponent componentSettings={settingsListofParticipants}></TableUiComponent>
        </Fragment>
    );
};
