import React from 'react';
import { EmberWrapper } from '../EmberWrapper';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';

export const OTCTopStock = (props) => {
    const { commonConfigs, componentIndex, data } = props;
    const mode = (data.settings.mode && data.settings.mode.value) || 1;

    const componentSettings = {
        class: 'ua-widget-id',
        uaWidgetID: `price.widgets.otc-top-stock.${componentIndex}`,
        args: `mode:${mode}`,
    };

    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="OTC Top Stock"></SpecificPreviewComponent>
    ) : (
        <EmberWrapper componentSettings={componentSettings}></EmberWrapper>
    );
};
