import React from 'react';
import { EmberWrapper } from '../EmberWrapper';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';

export const EconomicIndicatorsMenu = (props) => {
    const { commonConfigs, componentIndex} = props;
    const componentSettings = {
        class: 'ua-widget-id',
        uaWidgetID: `price.widgets.economic-indicators-menu.${componentIndex}`,
    };

    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="Economic Indicators Menu"></SpecificPreviewComponent>
    ) : (
        <EmberWrapper componentSettings={componentSettings}></EmberWrapper>
    );
};
