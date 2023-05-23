import React from 'react';
import { EmberWrapper } from '../EmberWrapper';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';

export const TopStockAdvanced = (props) => {
    const { commonConfigs, componentIndex, data } = props;
    const mode = (data.settings.mode && data.settings.mode.value) || 1;

    const componentSettings = {
        class: 'ua-widget-id',
        uaWidgetID: `price.widgets.top-stock.${componentIndex}`,
        args: `mode:${mode};isHistory:false;showMenu:true`,
    };

    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="Top Stock Advanced"></SpecificPreviewComponent>
    ) : (
        <EmberWrapper componentSettings={componentSettings}></EmberWrapper>
    );
};
