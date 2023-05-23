import React, { Fragment } from 'react';
import { ExportToPrint } from '../../util/ExportHelper/index';
import { IconColumnsFormattingMap } from '../../util/IconColumnsFormattingMap';
import styled from 'styled-components';

const Button = styled.button`
    border: none;
    margin-left: 2px;
    margin-right: 2px;
`;

export const PrintButton = (props) => {
    const { title, id, orientation, format, lang, autoPrint } = props;
    let BkPrint = IconColumnsFormattingMap['bkPrintColor'];

    const handlePrint = () => {
        ExportToPrint(
            id,
            {
                title: title,
                pageFormat: { orientation: orientation, format: format, lang: lang },
            },
            autoPrint
        );
    };

    return (
        <Fragment>
            <Button onClick={handlePrint}>
                <BkPrint height={22} width={22} />
            </Button>
        </Fragment>
    );
};
