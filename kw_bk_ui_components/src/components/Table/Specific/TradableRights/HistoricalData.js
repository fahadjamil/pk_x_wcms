import React, { useEffect, useState, Fragment } from 'react';
import Axios from 'axios';
import styled from 'styled-components';
import { marketBackEndProxyPass } from '../../../../config/path';
import { TableUiComponent } from '../../TableComponent';
import { SpecificPreviewComponent } from '../../../SpecificPreviewComponent';
import { useURLparam } from '../../../../customHooks/useURLparam';
import { setLanguage } from '../../../../helper/metaData';
import { ExportButton } from '../../../ExportPrintButtons/ExportButton';
import { PrintButton } from '../../../ExportPrintButtons/PrintButton';
import * as constants from '../../../../config/constants';

const ButtonDiv = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-bottom: 5px;
`;

export const TradableRightsHistoricalData = (props) => {
    const { data, commonConfigs, lang } = props;
    const [tableData, setTableData] = useState([]);
    const symID = useURLparam();

    useEffect(() => {
        let params = handleParams(symID);
        if (symID) {
            Axios.get(marketBackEndProxyPass(), {
                params: { RT: 3575, L: setLanguage(lang), SYMC: params[1] },
            }).then((res) => {
                if (res.data) {
                    let sortedData = res.data.sort((a, b) => b.TransactionDate - a.TransactionDate);
                    setTableData(sortedData);
                }
            });
        }
    }, [symID]);

    const handleParams = (params) => {
        let fields = params && params.split('-');
        return fields;
    };

    const settingsListofParticipants = {
        columns: [
            {
                columnName: lang.langKey === 'AR' ? 'تاريخ' : 'Trade Date',
                dataType: 'date',
                mappingField: 'TransactionDate',
            },
            {
                columnName: lang.langKey === 'AR' ? 'رقم الشركة' : 'Sec. Code',
                dataType: 'text',
                mappingField: 'SecCode',
            },
            {
                columnName: lang.langKey === 'AR' ? 'اسم السهم' : 'Ticker',
                dataType: 'ticker',
                mappingField: 'SecTicker',
            },
            {
                columnName: lang.langKey === 'AR' ? 'اسم الورقة المالية' : 'Security Name',
                dataType: 'text',
                mappingField: 'SecurityName',
            },
            {
                columnName: lang.langKey === 'AR' ? 'السعر المرجعي' : 'Ref. Price',
                mappingField: 'ReferencePrice',
                dataType: 'price',
            },
            {
                columnName: lang.langKey === 'AR' ? 'اخر' : 'Last',
                mappingField: 'Last',
                dataType: 'figure_0decimals',
            },
            {
                columnName: lang.langKey === 'AR' ? 'سعر الاكتتاب' : 'Subscription Price',
                dataType: 'price',
                mappingField: 'SubscriptionPrice',
            },
            {
                columnName: lang.langKey === 'AR' ? 'السعر الافتراضي' : 'Theoretical Price',
                dataType: 'price',
                mappingField: 'TheoreticalPrice',
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
        <SpecificPreviewComponent title="Tradable Rights Historical Data" />
    ) : (
        <Fragment>
            <ButtonDiv>
                <ExportButton
                    title={
                        lang.langKey == 'EN' || lang.langKey == 'en'
                            ? 'Rights Issue Historical Data'
                            : 'البيانات التاريخية لحقوق الاولوية'
                    }
                    id="ua-lang"
                    orientation="l"
                    format="a4"
                    type={constants.XLSX}
                    lang={lang.langKey}
                    tab={
                        lang.langKey == 'EN' || lang.langKey == 'en'
                            ? 'Historical Data'
                            : 'البيانات التاريخية'
                    }
                />
                <PrintButton
                    title={
                        lang.langKey == 'EN' || lang.langKey == 'en'
                            ? 'Rights Issue Historical Data'
                            : 'البيانات التاريخية لحقوق الاولوية'
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
                            ? 'Rights Issue Historical Data'
                            : 'البيانات التاريخية لحقوق الاولوية'
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
