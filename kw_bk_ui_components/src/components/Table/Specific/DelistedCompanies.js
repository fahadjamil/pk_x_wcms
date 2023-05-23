import React, { useState, useEffect, Fragment } from 'react';
import { marketBackEndProxyPass } from '../../../config/path';
import { TableUiComponent } from '../TableComponent';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';
import { setLanguage } from '../../../helper/metaData';
import Axios from 'axios';
import { ExportButton } from '../../ExportPrintButtons/ExportButton';
import { PrintButton } from '../../ExportPrintButtons/PrintButton';
import styled from 'styled-components';
import * as constants from '../../../config/constants';

const ButtonDiv = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-bottom: 5px;
`;

export const DelistedCompanies = (props) => {
    const { commonConfigs, lang } = props;
    const [tableData, setTableData] = useState([]);
    useEffect(() => {
        Axios.get(marketBackEndProxyPass(), {
            params: {
                RT: 3549,
                L: setLanguage(lang),
                T: 2,
            },
        }).then((res) => {
            let sortedData = res.data.sort((a, b) => a.Stk - b.Stk);
            setTableData(sortedData);
        });
    }, []);

    let componentSettingsListofParticipants = {
        columns: [
            {
                columnName: lang.langKey === 'AR' ? '#رقم' : '#No',
                mappingField: 'Stk',
                dataType: 'autoIncrement',
            },
            {
                columnName: lang.langKey === 'AR' ? 'رقم السهم' : 'Sec. Code',
                dataType: 'text',
                mappingField: 'Stk',
            },
            {
                columnName: lang.langKey === 'AR' ? 'اسم السهم' : 'Ticker',
                dataType: 'ticker',
                mappingField: 'DisplayTicker',
            },
            {
                columnName: lang.langKey === 'AR' ? 'الإسم' : 'Name',
                dataType: 'text',
                mappingField: 'Name',
            },
            {
                columnName: lang.langKey === 'AR' ? 'القطاع' : 'Sector',
                dataType: 'text',
                mappingField: 'Sector',
            },
            {
                columnName: lang.langKey === 'AR' ? 'السوق' : 'Market Segment',
                dataType: 'text',
                mappingField: 'MktSegment',
            },
            {
                columnName: lang.langKey === 'AR' ? 'تاريخ إلغاء الإدراج' : 'Date of Delisting',
                dataType: 'date',
                mappingField: 'DelistingDate',
            },
        ],
        showColumnTitle: true,
        httpRequest: {},
        rawData: tableData,
        id: 'table'
    };

    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="Delisted Companies Table" />
    ) : (
        <Fragment>
            <ButtonDiv>
                <ExportButton
                    title={
                        lang.langKey == 'EN' || lang.langKey == 'en'
                            ? 'Delisted Companies'
                            : 'الشركات التي تم إلغاء إدراجها'
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
                            ? 'Delisted Companies'
                            : 'الشركات التي تم إلغاء إدراجها'
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
                            ? 'Delisted Companies'
                            : 'الشركات التي تم إلغاء إدراجها'
                    }
                    id="ua-lang"
                    orientation="l"
                    format="a4"
                    type={constants.PDF}
                    lang={lang.langKey}
                />
            </ButtonDiv>
            <TableUiComponent
                componentSettings={componentSettingsListofParticipants}
            ></TableUiComponent>
        </Fragment>
    );
};
