import React, { useEffect, useState, Fragment } from 'react';
import Axios from 'axios';
import { TableUiComponent } from '../TableComponent';
import { marketBackEndProxyPass } from '../../../config/path';
import { setLanguage } from '../../../helper/metaData';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';
import { ExportButton } from '../../ExportPrintButtons/ExportButton';
import { PrintButton } from '../../ExportPrintButtons/PrintButton';
import styled from 'styled-components';
import * as constants from '../../../config/constants';

const ButtonDiv = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-bottom: 5px;
`;

export const OffMarketTradesTable = (props) => {
    const { commonConfigs, lang } = props;
    const [finalData, setFinalData] = useState([]);
    const convertByLang = (arText, enText) => (lang.langKey === 'AR' ? arText : enText);

    useEffect(() => {
        Axios.get(marketBackEndProxyPass(), {
            params: {
                RT: 3543,
                L: setLanguage(lang),
            },
        }).then((res) => {
            if (res.length !== 0) {
                setFinalData(
                    res.data.sort((a, b) => {
                        if (b.SettleDate == null) {
                            return 1;
                        } else if (a.SettleDate == null) {
                            return 0;
                        } else {
                            return parseInt(b.SettleDate) - parseInt(a.SettleDate);
                        }
                    })
                );
            }
        });
    }, []);

    let componentSettingsOffMarketTradesTable = {
        columns: [
            {
                columnName: convertByLang('الشركة', 'Stock '),
                mappingField: 'Stk',
                dataType: 'number',
            },
            {
                columnName: convertByLang('اسم السهم', 'Ticker'),
                dataType: 'ticker',
                mappingField: 'DisplayTicker',
            },
            {
                columnName: convertByLang('التاريخ', 'Date'),
                dataType: 'date',
                mappingField: 'SettleDate',
            },
            {
                columnName: convertByLang('أسعار الصفقات المتفق عليها', 'Off Market Trades Prices'),
                dataType: 'number',
                mappingField: 'TradesPrice',
            },
            {
                columnName: convertByLang('حجم الصفقات المتفق عليها', 'Off Market Trades Volume'),
                dataType: 'price',
                mappingField: 'TradesVolume',
            },
            {
                columnName: convertByLang('قيمة الصفقات المتفق عليها', 'Off Market Trades Value'),
                dataType: 'price',
                mappingField: 'TradesValue',
            },
        ],
        showColumnTitle: true,
        httpRequest: {
            header: {},
        },
        rawData: finalData,
        id: 'table',
    };

    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="Off Market Trades Table"></SpecificPreviewComponent>
    ) : (
        <Fragment>
            <ButtonDiv>
                <ExportButton
                    title={
                        lang.langKey == 'EN' || lang.langKey == 'en'
                            ? 'Off Market Trades'
                            : 'الصفقات المتفق عليها'
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
                            ? 'Off Market Trades'
                            : 'الصفقات المتفق عليها'
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
                            ? 'Off Market Trades'
                            : 'الصفقات المتفق عليها'
                    }
                    id="ua-lang"
                    orientation="l"
                    format="a4"
                    type={constants.PDF}
                    lang={lang.langKey}
                />
            </ButtonDiv>
            <TableUiComponent
                componentSettings={componentSettingsOffMarketTradesTable}
            ></TableUiComponent>
        </Fragment>
    );
};
