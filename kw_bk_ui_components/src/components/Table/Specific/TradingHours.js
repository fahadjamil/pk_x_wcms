import React from 'react';
import { TableUiComponent } from '../TableComponent';
import { appServerURL } from '../../../config/path';

const TradingHours = (props) => {
    const { commonConfigs } = props;
    let componentSettingsTradingHours = {
        menuName: 'BK Testing Table',
        columns: [
            {
                columnName: 'Session Name',
                mappingField: 'session',
                dataType: 'text',
            },
            {
                columnName: 'From',
                dataType: 'date',
                mappingField: 'from',
            },
            {
                columnName: 'To',
                dataType: 'date',
                mappingField: 'to',
            },
        ],
        showColumnTitle: true,
        httpRequest: {
            dataSource: appServerURL('trading-hours'),
            header: {},
        },
    };
    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="Trading Hours"></SpecificPreviewComponent>
    ) : (
        <TableUiComponent componentSettings={componentSettingsTradingHours}></TableUiComponent>
    );
};

export default TradingHours;
