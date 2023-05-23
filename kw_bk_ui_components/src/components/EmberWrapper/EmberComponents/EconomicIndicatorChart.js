import React from 'react';
import { EmberWrapper } from '../EmberWrapper';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';

export const EconomicIndicatorChart = (props) => {
    const { commonConfigs, componentIndex } = props;

    const componentSettings = {
        class: 'ua-widget-id full-height full-width',
        uaWidgetID: `price.widgets.economic-ind-chart.${componentIndex}`
    };

    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="Economic Indicator Chart"></SpecificPreviewComponent>
    ) : (
        <EmberWrapper componentSettings={componentSettings}></EmberWrapper>
    );
};
