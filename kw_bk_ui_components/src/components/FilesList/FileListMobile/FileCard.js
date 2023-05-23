import React from 'react';
import styled from 'styled-components';
import { getShortFullDate, getArabicShortFullDate } from '../../../helper/date';
// import BkPdfIcon from "./BkPdfIcon";
import { IconColumnsFormattingMap } from '../../../util/IconColumnsFormattingMap';

const StyledCard = styled.div`
    height: ${(props) => (props.cardSize == 4 ? '220px' : '280px')};
    width: 100%;
    max-width: 420px;
    border-style: solid;
    border-color: #dfdada;
    border-radius: 30px;
    border-width: 1px;
    margin-bottom: 20px;
`;

const ItemWrapper = styled.div`
    margin: 5% 15%;
    height: 70%;
    width: 70%;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
`;

const Item = styled.div`
    display: flex;
    flex-direction: column;
    text-align: center;
    width: 30%;
    width: ${(props) => {
        if (props.cardSize == 4) {
            return '50%';
        } else if (props.cardSize == 7) {
            return '30%';
        } else {
            return '25%';
        }
    }};
`;
const ItemIcon = styled.div`
    text-align: center;
    height: 34px;
`;
const ItemTitle = styled.div`
    font-size: 0.8em;
    margin-bottom: 5px;
`;

const CardTitle = styled.div`
padding-top: 10px;
width: 100%
  position: absolute;
  text-align: center;
  font-size: 1.2em;
`;
const ItemDate = styled.p`
    font-size: 0.5em;
    color: #435058;
    margin-top: 4px;
`;
const NullDoc = styled.span`
    width: 30px;
`;

const FileCard = (props) => {
    // cardSize 4, 7 ,12
    const { cardTitle, cardData, cardSize, lang } = props;

    let BkPdf = IconColumnsFormattingMap['bkPdfIcon'];
    const generateItem = (title, link, date) => (
        <Item cardSize={cardSize}>
            <ItemTitle>{title}</ItemTitle>
            <ItemIcon>
                {link ? (
                    <a href={link}>
                        {' '}
                        <BkPdf width="30px" />
                    </a>
                ) : (
                    <NullDoc> - </NullDoc>
                )}
                <ItemDate>{date && (lang == 'en' || lang == 'EN' ? getShortFullDate(date): getArabicShortFullDate(date))}</ItemDate>
            </ItemIcon>
        </Item>
    );
    return (
        <StyledCard cardSize={cardSize}>
            {/* <CardTitle>{cardTitle}</CardTitle> */}
            <ItemWrapper>
                {cardData && cardData.map((data) => generateItem(data.title, data.link, data.date))}
            </ItemWrapper>
        </StyledCard>
    );
};

export default FileCard;
