import React from 'react';
import { EmberWrapper } from '../EmberWrapper';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';

export const ProchartMenu = (props) => {
    const { commonConfigs, componentIndex} = props;
    const componentSettings = {
        class: 'ua-widget-id',
        uaWidgetID: `price.widgets.pro-chart-menu.${componentIndex}`,
    };

    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="Prochart Menu"></SpecificPreviewComponent>
    ) : (
        <EmberWrapper componentSettings={componentSettings}></EmberWrapper>
    );
};
