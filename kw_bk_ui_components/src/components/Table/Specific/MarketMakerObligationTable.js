import React from 'react';
import { TableUiComponent } from '../TableComponent';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';
import { appServerURL } from '../../../config/path';

export const MarketMakerObligationTable = props => {
    const { commonConfigs } = props;

    const settingsAccumulatedLoss = {
        columns: [
            { columnName: '', dataType: 'text', mappingField: 'category' },
            { columnName: '', dataType: 'text', mappingField: 'ticker' },
            { columnName: '', dataType: 'text', mappingField: 'lb1' },
            { columnName: '', dataType: 'text', mappingField: 'lb2' },
            { columnName: '', dataType: 'text', mappingField: 'lb' },
            { columnName: '', dataType: 'text', mappingField: 'lb3' },
            { columnName: '', dataType: 'text', mappingField: 'lb4' }
        ],
        showColumnTitle: true,
        httpRequest: {
            dataSource: appServerURL('market_maker_obligation'),
            header: {},
        }
    };

    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="Market Maker Obligation Table" />
    ) : (
        <TableUiComponent componentSettings={settingsAccumulatedLoss}></TableUiComponent>
    );

}