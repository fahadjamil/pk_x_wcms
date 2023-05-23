import React from 'react';
import { TableUiComponent } from '../TableComponent';
import { appServerURL } from '../../../config/path';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';

export const OTCWatch = (props) => {
    const { commonConfigs } = props;
    let componentSettings = {
        columns: [
            {
                columnName: 'Code',
                mappingField: 'code',
                dataType: 'number',
            },
            {
                columnName: 'Name',
                dataType: 'text',
                mappingField: 'name',
            },
            {
                columnName: 'Prev',
                dataType: 'price',
                mappingField: 'prev',
            },
            {
                columnName: 'Open',
                dataType: 'price',
                mappingField: 'open',
            },
            {
                columnName: 'High',
                dataType: 'price',
                mappingField: 'high',
            },
            {
                columnName: 'Low',
                dataType: 'price',
                mappingField: 'low',
            },
            {
                columnName: 'bid',
                dataType: 'price',
                mappingField: 'bid',
            },
            {
                columnName: 'Ask',
                dataType: 'price',
                mappingField: 'ask',
            },
        ],
        showColumnTitle: true,
        httpRequest: {
            dataSource: appServerURL('otcwatch'),
            header: {},
        },
    };

    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="OTC Watch Table" />
    ) : (
        <TableUiComponent componentSettings={componentSettings}></TableUiComponent>
    );
};
