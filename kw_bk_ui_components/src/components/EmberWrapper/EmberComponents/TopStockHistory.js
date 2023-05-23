import React from 'react';
import { EmberWrapper } from '../EmberWrapper';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';

export const TopStockHistory = (props) => {
    const { commonConfigs, componentIndex, data } = props;
    const mode = (data.settings && data.settings.mode && data.settings.mode.value) || 1;

    const componentSettings = {
        class: 'ua-widget-id full-height',
        uaWidgetID: `price.widgets.top-stock.${componentIndex}`,
        args: `mode:${mode};isHistory:true;showMenu:false`,
    };

    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="Top Stock History"></SpecificPreviewComponent>
    ) : (
        <EmberWrapper componentSettings={componentSettings}></EmberWrapper>
    );
};
