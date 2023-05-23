import React from 'react';
import styled from 'styled-components';

const NewsItemWrapper = styled.div`
    font-size: 1em;
    font-family: Arial, Verdana, Tahoma;
    background: #f0f4fa;
    width: 350px;
    border-radius: 10px;
    box-shadow: 0px 1px 0px 1px #e9ecef;
    margin: 0.8em 0 0 0.5em;
`;

const NewsItem = styled.div`
    padding: 1em;
`;

const Ticker = styled.span`
    font-size: 0.8em;
    float: right;
`;
const NewsTitle = styled.a`
    font-size: 0.9em;
`;
const Date = styled.p`
    font-size: 0.6em;
`;

const NewsItemComponent = (params) => {
    return (
        <NewsItemWrapper>
            <NewsItem>
                <NewsTitle>{params.title}</NewsTitle>
                <Date>{params.date || ''}</Date>
                <Ticker>{params.ticker || ''}</Ticker>
            </NewsItem>
        </NewsItemWrapper>
    );
};

export default NewsItemComponent;
