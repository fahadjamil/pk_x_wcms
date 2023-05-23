import React, { useEffect, useState } from 'react';
import { TableUiComponent } from './TableComponent';
import { genarateComponentLevelStyleConfigurations } from '../../util/UiComponentsUtil';

export const CMSTableComponent = (params) => {
    let title = '';
    let inlineStyles = {};
    let isConfigSet = false;
    let collection = undefined;
    let uiConfigs = undefined;

    const { dbName, componentIndex, commonConfigs } = params;
    const { data, styles, settings } = params.data;
    const { isEditMode, isPreview } = commonConfigs;

    if (settings) {
        collection = settings.collection;
        uiConfigs = settings.uiConfigs;
    }

    if (styles) {
        inlineStyles = genarateComponentLevelStyleConfigurations(styles);
    }

    if (data !== undefined) {
        title = data.title;
    }

    const [componentSettings, setComponentSettings] = useState(generateTableData());

    useEffect(() => {
        if (!isConfigSet) {
            setComponentSettings(generateTableData());
        }

        return () => (isConfigSet = false);
    }, [settings]);

    function generateTableData() {
        let tableSettings = {};
        if (collection !== undefined && uiConfigs !== undefined) {
            const jwt = localStorage.getItem('jwt-token');
            const { columns } = uiConfigs;

            tableSettings = {
                menuName: collection.value.menuName,
                showColumnTitle: true,
                collectionType: collection.value.collectionType,
                baseUrl: settings.collection.externalParams.BaseUrl,
                httpRequest: {
                    dataSource: collection.externalParams.dataSourceUrl,
                    header: {
                        headers: {
                            Authorization: jwt,
                        },
                        params: {
                            dbName: params.dbName,
                            collectionName: collection.value.customeCollectionName,
                        },
                    },
                },
                dbName: dbName,
                columns: columns,
                languageKey: 'EN',
            };
        }

        isConfigSet = true;
        return tableSettings;
    }

    return (
        <div>
            {/* <h5 className="text-center">
                {componentSettings.menuName && componentSettings.menuName}
            </h5> */}
            <TableUiComponent
                componentSettings={componentSettings}
                isPreview={isPreview}
                componentIndex={componentIndex}
            ></TableUiComponent>
        </div>
    );
};
