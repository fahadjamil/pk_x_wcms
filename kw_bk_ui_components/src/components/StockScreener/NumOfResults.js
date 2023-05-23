import React from 'react';
import styled from 'styled-components';

const StyledSpan = styled.span`
    font-size: 15px;
`;
const StyleStrong = styled.strong`
    font-weight: bold;
    font-size: 20px;
`;

export const NumOfResults = (props) => {
    const { lang } = props;
    const convertByLang = (arText, enText) => (lang.langKey === 'AR' ? arText : enText);

    return props.numOfResults == props.numOfAllStocks ? (
        <StyledSpan>
            {' '}
            {convertByLang(`سهماً من المجموع الكلي `, `Showing all `)}
            <StyleStrong>{props.numOfResults}</StyleStrong> {convertByLang('', 'stocks')}
        </StyledSpan>
    ) : (
        <StyledSpan>
            <StyleStrong>{props.numOfResults}</StyleStrong>
            {` ${convertByLang('سهماُ من أصل', ' stocks found out of ')}
      ${props.numOfAllStocks}`}
        </StyledSpan>
    );
};
