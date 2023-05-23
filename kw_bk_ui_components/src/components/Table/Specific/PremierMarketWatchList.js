import React from 'react';
import { TableUiComponent } from '../TableComponent';
import { appServerURL } from '../../../config/path';

const PremierMarketWatchlist = (props) => {
    const { commonConfigs } = props;
    let componentSettingsPremierMarketWatchlist = {
        columns: [
            {
                columnName: '#No',
                mappingField: 'num',
                dataType: 'number',
            },
            {
                columnName: 'Company',
                dataType: 'link',
                mappingField: 'name',
            },
            {
                columnName: 'Sector',
                dataType: 'text',
                mappingField: 'sector',
            },
        ],
        showColumnTitle: true,
        httpRequest: {
            dataSource: appServerURL('list-of-participants'),
            header: {},
        },
    };

    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="Premier Market Watch List"></SpecificPreviewComponent>
    ) : (
        <TableUiComponent
            componentSettings={componentSettingsPremierMarketWatchlist}
        ></TableUiComponent>
    );
};

export default PremierMarketWatchlist;
