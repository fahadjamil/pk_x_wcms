import React from 'react';
import styled from 'styled-components';
import { IconColumnsFormattingMap } from '../../util/IconColumnsFormattingMap';
import {
    displayFormat,
    displayDetailedFormat,
    displayTime,
    displayDetailedTime,
    displayTimeWithSeconds,
    displayDDMonthNameYYYYFormat,
} from '../../helper/date';

const formatAsCurrency = (value) => value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

const formatAsIconButton = (formatting, fieldDataValue, baseUrl, dbName, collectionType) => {
    const url = `${
        baseUrl + (collectionType ? collectionType.toLowerCase() + '/' : '')
    }${dbName}/${fieldDataValue}`;
    // TODO: Load icon according to the formatting type
    const IconBtn = IconColumnsFormattingMap['pdfFileIcon'];
    return (
        <a href={url} target="_blank">
            <IconBtn width="30px" height="30px" />
        </a>
    );
};
const LossIcon = styled.span`
    width: 12px;
    height: 12px;
    background: ${(props) => (props.dotColor ? props.dotColor : '')};
    border-radius: 100px;
    display: inline-block;
    margin-right: 5px;
`;

const Div = styled.div`
    width: 12px;
    height: 12px;
    background: ${(props) => (props.dotColor ? props.dotColor : '')};
    border-radius: 100px;
    display: inline-block;
    margin-right: 5px;
`;

const formatAsLossCategoryIcon = (lossCategory) => {
    switch (lossCategory) {
        case 2:
            return <LossIcon dotColor="orange"></LossIcon>;
        case 3:
            return <LossIcon dotColor="red"></LossIcon>;
        default:
            return lossCategory;
    }
};
const formatAsNumber = (fieldDataValue) =>
    isNaN(fieldDataValue) ? `${fieldDataValue}` : handleNegativeNumeric(fieldDataValue);

const handleNegativeNumeric = (fieldDataValue) =>
    fieldDataValue < 0.0
        ? `(${formatAsCurrency(fieldDataValue * -1)})`
        : `${formatAsCurrency(fieldDataValue)}`;
const limitNoDecimals = (value) =>
    isNaN(value) ? value || ' - ' : formatAsCurrency(Number(value).toFixed(0));
const limit1Decimal = (value) =>
    isNaN(value) ? value || ' - ' : formatAsCurrency(Number(value).toFixed(1));
const limit2Decimals = (value) =>
    isNaN(value) ? value || ' - ' : formatAsCurrency(Number(value).toFixed(2));
const limit3Decimals = (value) =>
    isNaN(value) ? value || ' - ' : formatAsCurrency(Number(value).toFixed(3));
const limit4Decimals = (value) => (isNaN(value) ? value || ' - ' : Number(value).toFixed(4));

const displayCellValue = (
    lang,
    fieldDataValue,
    type,
    formatting,
    baseUrl,
    dbName,
    collectionType,
    rowIndex
) => {
    const DecriptionIcon = IconColumnsFormattingMap['financialDescriptionIcon'];
    //const BkPdfIcon = IconColumnsFormattingMap['bkPdfIcon'];
    const BkUrlIcon = IconColumnsFormattingMap['boursaUrlIcon'];
    switch (type) {
        case 'price':
            return fieldDataValue ? formatAsCurrency(fieldDataValue) : ' - ';
        case 'number':
            return fieldDataValue ? formatAsNumber(fieldDataValue) : ' - ';
        case 'figure_0decimals':
            return limitNoDecimals(fieldDataValue);
        case 'figure_1decimal':
            return limit1Decimal(fieldDataValue);
        case 'figure':
            return limit2Decimals(fieldDataValue);
        case 'figure_3decimals':
            return limit3Decimals(fieldDataValue);
        case 'figure_4decimals':
            return limit4Decimals(fieldDataValue);
        case 'perentage_2decimals':
            return `${limit2Decimals(fieldDataValue)}%`;
        case 'text':
            return fieldDataValue ? fieldDataValue : ' - ';
        case 'highlightText':
            return fieldDataValue ? <strong>{fieldDataValue.toUpperCase()}</strong> : ' - ';
        case 'ticker':
            return fieldDataValue ? fieldDataValue.toUpperCase() : ' - ';
        case 'highlightTicker':
            return fieldDataValue ? <strong>{fieldDataValue.toUpperCase()}</strong> : ' - ';
        case 'date':
            return fieldDataValue ? displayFormat(fieldDataValue) : ' - ';
        case 'dateTime':
            return fieldDataValue ? displayDetailedFormat(fieldDataValue, lang) : ' - ';
        case 'longDate':
            return fieldDataValue ? displayDDMonthNameYYYYFormat(fieldDataValue,lang) : ' - ';
        case 'link':
            return <a href={fieldDataValue.link}>{fieldDataValue.text}</a>;
        case 'newsLink':
            return generateNewsTitle(fieldDataValue);
        case 'icon':
            return formatAsIconButton(formatting, fieldDataValue, baseUrl, dbName, collectionType);
        case 'docIcon':
            return (
                <a href={fieldDataValue}>
                    <BkUrlIcon width="30px" height="30px" />
                </a>
            );
        case 'autoIncrement':
            return Number.isInteger(rowIndex) ? rowIndex + 1 : '';
        case 'lossCategory':
            return <Div dotColor={fieldDataValue}></Div>;
        case 'custom':
            return fieldDataValue ? fieldDataValue : ' - ';
        case 'time':
            return fieldDataValue ? displayDetailedTime(fieldDataValue, lang) : ' - ';
        case 'monthYear':
            return fieldDataValue ? fieldDataValue : ' - ';
        case 'detailedTime':
            return fieldDataValue ? displayTimeWithSeconds(fieldDataValue, lang) : ' - ';
        case 'ArText':
            return fieldDataValue || ' - ';
        case 'custom2':
            return fieldDataValue ? formatAsCurrency(fieldDataValue) : '  ';
        default:
            break;
    }
};

const setCellMinWidth = (type) => {
    switch (type) {
        case 'dateTime':
            return 'min-width : 180px;';
        case 'detailedTime':
            return 'min-width : 125px;';
        default:
            return 'min-width :50px';
    }
};

const TableData = styled.td`
    padding: 0.2em 1em 0.2em 1em;
    ${(props) =>
        props.type == 'custom' ||
        props.type == 'custom2' ||
        props.type == 'figure' ||
        props.type == 'figure_3decimals' ||
        props.type == 'figure_0decimals' ||
        props.type == 'figure_1decimal' ||
        props.type == 'figure_4decimal' ||
        props.type == 'price' ||
        props.type == 'ArText' ||
        props.type == 'perentage_2decimals'
            ? 'text-align: right;'
            : ''}
    ${(props) =>
        props.type == 'figure' || 'figure_4decimal' || 'detailedTime' ? 'direction: ltr;' : ''}

    ${(props) =>
        props.type == 'newsLink' && props.lang && props.lang.langKey == 'AR'
            ? 'direction:rtl;'
            : ''}
    .fakenews del{
        color: red; important!
        text-decoration: line-through; 
        display: inline;
        width : 100%;
    }
    .fakenews del:hover{
        color: #C4954A;
    }
    a {
        color: black;
        text-decoration: none;
    }

    ${(props) => setCellMinWidth(props.type)}  
`;

const generateNewsTitle = (fieldDataValue) => {
    // If LinkNewsID > 0 then Title = [Supplementary Disclosure] + <News Title>   (الإفصاح التكميلي) for Arabic page
    let isSupplementaryDisc =
        fieldDataValue && fieldDataValue.LinkNewsId && fieldDataValue.LinkNewsId > 0;

    // If linkedFalseNews> 0 then Title = [Corrective Announcement] + <News Title>  (إعلان تصحيحي) for Arabic
    let isCorrectiveAnnouncement =
        fieldDataValue && fieldDataValue.LinkedFalseNews && fieldDataValue.LinkedFalseNews > 0;

    // If FalseNews> 0 then Title =   <News Title> + (wrong)
    let isFalseNews = fieldDataValue && fieldDataValue.FalseNews && fieldDataValue.FalseNews > 0;

    // lang isEnglish
    let isEn = fieldDataValue && fieldDataValue.lang && fieldDataValue.lang.langKey == 'EN';

    let prefix = `${
        isSupplementaryDisc ? (isEn ? '[Supplementary Disclosure] ' : ' (الإفصاح التكميلي) ') : ''
    }${isCorrectiveAnnouncement ? (isEn ? '[Corrective Announcement] ' : ' (إعلان تصحيحي)') : ''}`;
    return (
        <a className={isFalseNews ? 'fakenews' : ''} href={fieldDataValue.link}>
            <span>{prefix}</span>{' '}
            {isFalseNews ? <del>{fieldDataValue.text}</del> : <span>{fieldDataValue.text}</span>}
            <span>{isFalseNews ? (isEn ? ' (wrong)' : ' (خطأ)') : ''}</span>
        </a>
    );
};

const TableCell = ({
    lang,
    fieldDataValue,
    type,
    formatting,
    baseUrl,
    dbName,
    collectionType,
    rowIndex,
    className,
}) => (
    <TableData type={type} lang={lang} className={className}>
        {displayCellValue(
            lang,
            fieldDataValue,
            type,
            formatting,
            baseUrl,
            dbName,
            collectionType,
            rowIndex
        )}
    </TableData>
);

export default TableCell;
