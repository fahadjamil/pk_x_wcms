import React, { useState, useEffect, Fragment } from 'react';
import Axios from 'axios';
import { TableUiComponent } from '../TableComponent';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';
import { marketBackEndProxyPass } from '../../../config/path';
import { setLanguage } from '../../../helper/metaData';
import styled from 'styled-components';
import { ExportButton } from '../../ExportPrintButtons/ExportButton';
import { PrintButton } from '../../ExportPrintButtons/PrintButton';
import { researchReportViewLink, XLSX, PDF } from '../../../config/constants';

const ButtonDiv = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-bottom: 5px;
`;

export const ResearchReportTable = (props) => {
    const { commonConfigs, lang } = props;
    const [tableData, setTableData] = useState([]);

    useEffect(() => {
        Axios.get(marketBackEndProxyPass(), {
            params: { RT: 3505, L: setLanguage(lang) },
        }).then((res) => {
            if (res.data.dataFields) {
                res.data.dataFields.sort((a, b) => b.postedDate - a.postedDate);
                const finalData = res.data.dataFields.map((item) => {
                    return {
                        reportTitle: {
                            text: item.reportTitle,
                            link: researchReportViewLink(item.rowId, lang),
                        },
                        companyName: item.companyName,
                        postedDate: item.postedDate,
                    };
                });
                setTableData(finalData);
            }
        });
    }, []);

    const componentSettingsresearch = {
        columns: [
            {
                columnName: lang.langKey === 'AR' ? 'عنوان' : 'Title',
                dataType: 'link',
                mappingField: 'reportTitle',
            },
            {
                columnName: lang.langKey === 'AR' ? 'مصدر الدراسة' : 'Provider',
                dataType: 'text',
                mappingField: 'companyName',
            },
            {
                columnName: lang.langKey === 'AR' ? 'تاريخ النشر' : 'Published On',
                dataType: 'date',
                mappingField: 'postedDate',
            },
        ],
        showColumnTitle: true,
        rawData: tableData,
        httpRequest: {},
        id: 'table',
    };

    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="Research Report Table" />
    ) : (
        <Fragment>
            <ButtonDiv>
                <ExportButton
                    title={
                        lang.langKey == 'EN' || lang.langKey == 'en'
                            ? 'Research Report'
                            : 'الدراسات والتقارير'
                    }
                    id="ua-lang"
                    orientation="l"
                    format="a4"
                    type={XLSX}
                    lang={lang.langKey}
                />
                <PrintButton
                    title={
                        lang.langKey == 'EN' || lang.langKey == 'en'
                            ? 'Research Report'
                            : 'الدراسات والتقارير'
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
                            ? 'Research Report'
                            : 'الدراسات والتقارير'
                    }
                    id="ua-lang"
                    orientation="l"
                    format="a4"
                    type={PDF}
                    lang={lang.langKey}
                />
            </ButtonDiv>
            <TableUiComponent componentSettings={componentSettingsresearch}></TableUiComponent>
        </Fragment>
    );
};
