import React, { useEffect, useState, Fragment } from 'react';
import Axios from 'axios';
import { marketBackEndProxyPass } from '../../../config/path';
import { TableUiComponent } from '../TableComponent';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';
import { setLanguage } from '../../../helper/metaData';
import { ExportButton } from '../../ExportPrintButtons/ExportButton';
import { PrintButton } from '../../ExportPrintButtons/PrintButton';
import styled from 'styled-components';
import * as constants from '../../../config/constants';

const ButtonDiv = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-bottom: 5px;
`;

export const SuspendedCompanies = (props) => {
    const { commonConfigs, lang } = props;
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        Axios.get(marketBackEndProxyPass(), {
            params: {
                RT: 3549,
                L: setLanguage(lang),
                T: 3,
            },
        }).then((res) => {
            if (res.length !== 0) {
                let sortedData = res.data.sort((a, b) => {
                    if (b.Stk == null || isNaN(b.Stk)) {
                        return 1;
                    } else if (a.Stk == null || isNaN(a.Stk)) {
                        return 0;
                    } else {
                        return parseInt(a.Stk) - parseInt(b.Stk);
                    }
                });
                setTableData(sortedData);
            }
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
            // Removed on client Request - no data available
            // {
            //   columnName: (lang.langKey === 'AR' ? 'تاريخ إلغاء الإدراج' : 'Suspended Date'),
            //   dataType: "date",
            //   mappingField: "DelistingDate",
            // },
        ],
        showColumnTitle: true,
        httpRequest: {
            header: {},
        },
        rawData: tableData,
        id: 'table',
    };

    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="Suspended Companies Table" />
    ) : (
        <Fragment>
            <ButtonDiv>
                <ExportButton
                    title={
                        lang.langKey == 'EN' || lang.langKey == 'en'
                            ? 'Suspended Companies'
                            : 'الشركات الموقوفة عن التداول'
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
                            ? 'Suspended Companies'
                            : 'الشركات الموقوفة عن التداول'
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
                            ? 'Suspended Companies'
                            : 'الشركات الموقوفة عن التداول'
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
