import React, { useState, useEffect, Fragment } from 'react';
import Axios from 'axios';
import { TableUiComponent } from '../TableComponent';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';
import { marketBackEndProxyPass } from '../../../config/path';
import { setLanguage } from '../../../helper/metaData';
import { mutualFundProfileLink } from '../../../config/constants';
import { ExportButton } from '../../ExportPrintButtons/ExportButton';
import { PrintButton } from '../../ExportPrintButtons/PrintButton';
import styled from 'styled-components';
import * as constants from '../../../config/constants';

const ButtonDiv = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-bottom: 5px;
`;

export const MutualFundTable = (props) => {
    const { commonConfigs, lang } = props;
    const convertByLang = (arText, enText) => (lang.langKey === 'AR' ? arText : enText);
    const [tableData, setTableData] = useState([]);
    useEffect(() => {
        Axios.get(marketBackEndProxyPass(), { params: { RT: 3518, L: setLanguage(lang) } }).then(
            (res) => {
                let temp = res.data.map((data) => ({
                    ...data,
                    FundName: {
                        text: data.FundName,
                        link: mutualFundProfileLink(data.FundId, lang),
                    },
                }));
                setTableData(temp);
            }
        );
    }, []);

    const settingsMutualFund = {
        columns: [
            {
                columnName: convertByLang('# رقم', '#No'),
                mappingField: 'FundId',
                dataType: 'autoIncrement',
            },
            {
                columnName: convertByLang('اسم مدير الصندوق', 'Name of Fund'),
                dataType: 'link',
                mappingField: 'FundName',
            },
            {
                columnName: convertByLang('اسم الصندوق', 'Name of Fund Manager'),
                dataType: 'text',
                mappingField: 'FundManager',
            },
        ],
        showColumnTitle: true,
        httpRequest: {},
        rawData: tableData,
        id: 'table',
    };

    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="Mutual Fund Table" />
    ) : (
        <Fragment>
            <ButtonDiv>
                <ExportButton
                    title={
                        lang.langKey == 'EN' || lang.langKey == 'en'
                            ? 'Mutual Fund'
                            : 'الصناديق الاستثمارية'
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
                            ? 'Mutual Fund'
                            : 'الصناديق الاستثمارية'
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
                            ? 'Mutual Fund'
                            : 'الصناديق الاستثمارية'
                    }
                    id="ua-lang"
                    orientation="l"
                    format="a4"
                    type={constants.PDF}
                    lang={lang.langKey}
                />
            </ButtonDiv>
            <TableUiComponent componentSettings={settingsMutualFund}></TableUiComponent>
        </Fragment>
    );
};
