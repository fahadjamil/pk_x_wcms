import React from 'react';
import { EmberWrapper } from '../EmberWrapper';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';

export const StockSnapshot = (props) => {
    const { commonConfigs, componentIndex, data} = props;
    const type =  (data.settings && data.settings.type && data.settings.type.value) || 0;

    const componentSettings = {
        class: 'ua-widget-id',
        uaWidgetID: `price.widgets.stock-snapshot.${componentIndex}`,
        args: `type:${type}`,
    };

    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="Stock Snapshot"></SpecificPreviewComponent>
    ) : (
        <EmberWrapper componentSettings={componentSettings}></EmberWrapper>
    );
};
