import React from 'react';
import { EmberWrapper } from '../EmberWrapper';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';

export const TopStock = (props) => {
    const { commonConfigs, componentIndex, data } = props;
    const mode = (data.settings.mode && data.settings.mode.value) || 1;

    const componentSettings = {
        class: 'ua-widget-id',
        uaWidgetID: `price.widgets.top-stock.${componentIndex}`,
        args: `mode:${mode};isHistory:false;showMenu:false`,
        styles: { height: '300px' },
    };

    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="Top Stock"></SpecificPreviewComponent>
    ) : (
        <EmberWrapper componentSettings={componentSettings}></EmberWrapper>
    );
};
