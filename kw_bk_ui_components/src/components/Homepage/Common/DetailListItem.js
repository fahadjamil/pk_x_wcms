import React from 'react';
import styled from 'styled-components';

const ListItemWrapper = styled.div`
    margin-bottom: 20px;
`;

const SecurityRef = styled.span`
    margin-left: 10px;
    margin-right: 10px;
    ${(props) => (props.isHighlighted ? 'color: #C6974B;' : '')}
`;

const Time = styled.span`
    margin-left: 10px;
`;

const Date = styled.span``;

const Text = styled.div``;

export const DetailListItem = (props) => {
    const {
        date,
        time,
        ticker,
        companyName,
        text,
        isSecurityHighlighted,
        isCorporateAction,
        redirectURL,
    } = props;
    return (
        <ListItemWrapper>
            <Date className="font-semibold">{date}</Date>
            <Time className="font-semibold">{time}</Time>
            <SecurityRef
                className={`font-semibold ${isCorporateAction ? 'text-linen' : 'text-gold'}`}
                isHighlighted={isSecurityHighlighted}
            >
                {ticker || companyName}
            </SecurityRef>
            <br />
            <div className="font-medium text-sm line-clamp-2">
                {redirectURL ? <a href={redirectURL}>{text}</a> : text}
            </div>
        </ListItemWrapper>
    );
};
