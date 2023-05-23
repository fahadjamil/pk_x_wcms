import React from 'react';
import styled from 'styled-components';
import { getUrlDate } from '../../../helper/date';

const StyledTitle = styled.h2`
    width: 100%;
    text-align: center;
    color: #c4954a;
`;

export const ReportTitle = (props) => {
    const { lang } = props;
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
                    `${Ar_REPORT_FOR} ${year} - Q${parseInt(quarter)}`,
                    `Report for ${year} - Q${parseInt(quarter)}`
                );
            case 6:
                return convertByLang(`${Ar_REPORT_FOR} ${year} `, `Report for ${year} `);
            default:
                break;
        }
    };
    return <StyledTitle>{generateTitle()}</StyledTitle>;
};
