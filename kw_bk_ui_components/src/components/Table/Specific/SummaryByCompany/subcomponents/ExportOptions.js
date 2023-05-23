import React from 'react';
import styled from 'styled-components';
import { ExportButton } from '../../../../ExportPrintButtons/ExportButton';
import { PrintButton } from '../../../../ExportPrintButtons/PrintButton';
import * as constants from '../../../../../config/constants';
import { getUrlDate } from '../../../../../helper/date';

const ButtonDiv = styled.div`
    display: flex;
    justify-content: flex-end;
    margin-bottom: 5px;
`;

export const ExportOptions = ({lang}) => {
    const { year, curMonthText, quarter, reportMode } = getUrlDate(lang);
    const convertByLang = (arText, enText) => (lang.langKey === 'AR' ? arText : enText);

    const Ar_REPORT_FOR = `تقرير شهر`;
    const Ar_AND = ' لسنة';

    const generateTitle = () => {
        switch (reportMode) {
            case 3:
                return convertByLang(
                    `${Ar_REPORT_FOR} ${curMonthText} ${Ar_AND} ${year}`,
                    `Report for ${curMonthText} - ${year}`
                );
            case 4:
                return convertByLang(
                    `${Ar_REPORT_FOR} ${year} - Q${quarter}`,
                    `Report for ${year} - Q${quarter}`
                );
            case 6:
                return convertByLang(`${Ar_REPORT_FOR} ${year} `, `Report for ${year} `);
            default:
                break;
        }
    };
    return (
        <ButtonDiv>
            <ExportButton
                title={generateTitle()}
                id="ua-lang"
                orientation="l"
                format="a4"
                type={constants.XLSX}
                lang={lang.langKey}
            />
            <PrintButton
                title={generateTitle()}
                id="ua-lang"
                orientation="l"
                format="a4"
                lang={lang.langKey}
                autoPrint={true}
            />
            <ExportButton
                title={generateTitle()}
                id="ua-lang"
                orientation="l"
                format="a4"
                type={constants.PDF}
                lang={lang.langKey}
            />
        </ButtonDiv>
    );
};
