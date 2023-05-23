import React, { Fragment } from 'react';
import { ExportToPdf, ExportExcelJS } from '../../util/ExportHelper/index';
import { IconColumnsFormattingMap } from '../../util/IconColumnsFormattingMap';
import * as constants from '../../config/constants';
import styled from 'styled-components';

const Button = styled.button`
    border: none;
    margin-left: 2px;
    margin-right: 2px;
`;

export const ExportButton = (props) => {
    const { title, id, orientation, format, type, lang, autoPrint, tab } = props;
    // const BkFileColor = IconColumnsFormattingMap['bkFileColor'];
    const BkExcel = IconColumnsFormattingMap['boursaExcelIcon'];
    const DownloadIcon = IconColumnsFormattingMap['boursaDownload'];

    const handleExport = () => {
        if (type == constants.PDF) {
            ExportToPdf(id, {
                title: title,
                pageFormat: { orientation: orientation, format: format, lang: lang },
            });
        } else if (type == constants.XLSX) {
            ExportExcelJS(id, title, lang, tab);
        } else {
            ExportToCsv(id, title);
        }
    };

    const renderIcon = () => {
        if (type == constants.PDF) {
            return <DownloadIcon height={22} width={22} />
        } else if (type == constants.XLSX) {
            return <BkExcel height={22} width={22} />
        } else {
            //ExportToCsv(id, title);
        }
    }

    return (
        <Fragment>
            <Button onClick={handleExport}>
                {/* <BkExcel height={22} width={22} /> */}
                {renderIcon()}
            </Button>
        </Fragment>
    );
};
