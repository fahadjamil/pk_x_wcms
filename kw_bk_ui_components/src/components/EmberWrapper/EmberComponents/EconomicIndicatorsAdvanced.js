import React from 'react';
import { EmberWrapper } from '../EmberWrapper';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';

export const EconomicIndicatorsAdvanced = (props) => {
    const { commonConfigs, componentIndex} = props;
    const componentSettings = {
        class: 'ua-widget-id',
        uaWidgetID: `price.widgets.economic-indicators.${componentIndex}`,
    };

    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="Economic Indicators Advanced"></SpecificPreviewComponent>
    ) : (
        <EmberWrapper componentSettings={componentSettings}></EmberWrapper>
    );
};
