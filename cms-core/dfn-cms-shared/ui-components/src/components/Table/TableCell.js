import React from 'react';
import styled from 'styled-components';
import { IconColumnsFormattingMap } from '../../util/IconColumnsFormattingMap';

const formatAsCurrency = (value) => value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');

const formatAsIconButton = (formatting, fieldDataValue, baseUrl, dbName, collectionType) => {
    const url = `${
        baseUrl + (collectionType ? collectionType.toLowerCase() + '/' : '')
    }${dbName}/${fieldDataValue}`;
    // TODO: Load icon according to the formatting type
    const IconBtn = IconColumnsFormattingMap['pdfFileIconGold'];

    return (
        <a href={url} target="_blank">
            <IconBtn width="48" height="48" />
        </a>
    );
};

const displayCellValue = (fieldDataValue, type, formatting, baseUrl, dbName, collectionType) => {
    switch (type) {
        case 'price':
            return formatAsCurrency(fieldDataValue);
        case 'number':
            return `${fieldDataValue}`;
        case 'text':
            return fieldDataValue;
        case 'ticker':
            return fieldDataValue.toUpperCase();
        case 'date':
            return fieldDataValue;
        case 'link':
            return <a href={fieldDataValue.link}>{fieldDataValue.text}</a>;
        case 'icon':
            return formatAsIconButton(formatting, fieldDataValue, baseUrl, dbName, collectionType);
        case 'stock':
            return <a href={`${baseUrl}stock/${fieldDataValue}`}>{fieldDataValue}</a>;
        default:
            break;
    }
};

const TableData = styled.td`
    padding: 0.2em 1em 0.2em 1em;
    a {
        color: black;
        text-decoration: none;
    }
`;

const TableCell = ({ fieldDataValue, type, formatting, baseUrl, dbName, collectionType }) => (
    <TableData>
        {displayCellValue(fieldDataValue, type, formatting, baseUrl, dbName, collectionType)}
    </TableData>
);

export default TableCell;
