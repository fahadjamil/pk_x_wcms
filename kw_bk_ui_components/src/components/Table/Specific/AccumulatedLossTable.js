import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import styled from 'styled-components';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';
import { setLanguage } from '../../../helper/metaData';
import { marketBackEndProxyPass } from '../../../config/path';
import { TableUiComponent } from '../TableComponent';
import { stockProfileLink } from '../../../config/constants';

const LossIcon = styled.span`
    width: 12px;
    height: 12px;
    background: ${(props) => (props.dotColor ? props.dotColor : '')};
    border-radius: 100px;
    display: inline-block;
    margin-right: 5px;
`;

export const AccumulatedLossTable = (props) => {
    const { lang } = props;
    const convertByLang = (arText, enText) => (lang.langKey === 'AR' ? arText : enText);
    const [lossData, setLossData] = useState({});
    useEffect(() => {
        Axios.get(marketBackEndProxyPass(), {
            params: { RT: 3550, L: setLanguage(lang) },
        }).then((res) => {
            let responseData = res && res.data;
            const structuredData = {};
            structuredData.mediumLossCategory =
                responseData &&
                responseData['Fifty To Seventyfive'].map((lossSec) => ({
                    ...lossSec,
                    Name: { link: stockProfileLink(lossSec.Stk, lang), text: lossSec.Name },
                }));
            structuredData.highLossCategory =
                responseData &&
                responseData['More Than Seventyfive'].map((lossSec) => ({
                    ...lossSec,
                    Name: { link: stockProfileLink(lossSec.Stk, lang), text: lossSec.Name },
                }));

            setLossData(structuredData);
        });
    }, []);

    const accumulatedLossColumns = [
        {
            columnName: convertByLang('# رقم', '#No'),
            mappingField: 'Stk',
            dataType: 'autoIncrement',
        },
        {
            columnName: convertByLang('رقم السهم', 'Sec. Code'),
            dataType: 'text',
            mappingField: 'Stk',
        },
        {
            columnName: convertByLang('اسم السهم', 'Ticker'),
            dataType: 'ticker',
            mappingField: 'DisplayTicker',
        },

        { columnName: convertByLang('الإسم', 'Name'), dataType: 'link', mappingField: 'Name' },
        {
            columnName: convertByLang('القطاع', 'Sector'),
            dataType: 'text',
            mappingField: 'Sector',
        },
        {
            columnName: convertByLang('السوق', 'Market Segment'),
            dataType: 'text',
            mappingField: 'MktSegment',
        },
    ];

    let componentSettingsAccumulatedLossLow = {
        columns: accumulatedLossColumns,
        showColumnTitle: true,
        httpRequest: {
            header: {},
        },
        rawData: lossData.mediumLossCategory,
    };

    let componentSettingsAccumulatedLossHigh = {
        columns: accumulatedLossColumns,
        showColumnTitle: true,
        httpRequest: {
            header: {},
        },
        rawData: lossData.highLossCategory,
    };
    return (
        <div>
            <p>
                <LossIcon dotColor="orange"> </LossIcon>
                {convertByLang(
                    'شركات تبلغ نسبة الخسائر المتراكمة لديها 50% فأكثر وبما يقل عن 75% من رأس المال المدفوع',
                    'Companies with accumulated losses of 50% to less than 75% of their paid capital'
                )}
            </p>
            <TableUiComponent
                componentSettings={componentSettingsAccumulatedLossLow}
            ></TableUiComponent>
            <br />

            <p>
                <LossIcon dotColor="red"> </LossIcon>
                {convertByLang(
                    'شركات تبلغ نسبة الخسائر المتراكمة لديها 75% فأكثر من رأس المال المدفوع',
                    'Companies with accumulated losses of 75% or more of their paid capital'
                )}
            </p>

            <TableUiComponent
                componentSettings={componentSettingsAccumulatedLossHigh}
            ></TableUiComponent>
        </div>
    );
};
