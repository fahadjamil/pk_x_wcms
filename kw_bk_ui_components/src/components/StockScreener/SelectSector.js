import React from 'react';
import styled from 'styled-components';

const StyledSelect = styled.select`
    ${(props) => (props.isMobile ? 'width: 100%;' : ' width: 200px;')}
    height: 30px;
`;
export const SelectSector = (props) => {
    const { lang, isMobile } = props;
    let sectorData = props.sectorData;
    sectorData.sort((a, b) => (a.sectorName > b.sectorName ? 1 : -1));
    const convertByLang = (arText, enText) => (lang.langKey === 'AR' ? arText : enText);
    return (
        <StyledSelect
            value={props.currentValue}
            onChange={(event) => props.onChange(event.target.value)}
            isMobile={isMobile}
        >
            <option value="">
                {convertByLang(
                    '\u062c\u0645\u064a\u0639 \u0627\u0644\u0642\u0637\u0627\u0639\u0627\u062a',
                    'All Sectors'
                )}
            </option>

            {sectorData.map((sect) => (
                <option value={sect.sectorID}>{sect.sectorName}</option>
            ))}
        </StyledSelect>
    );
};
