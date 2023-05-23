import React from 'react';
import { EmberWrapper } from '../EmberWrapper';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';

export const EconomicIndicator = (props) => {
    const { commonConfigs, componentIndex, data } = props;
    const currentIndex = data.settings.collection.value;

    const componentSettings = {
        class: 'ua-widget-id',
        uaWidgetID: `price.widgets.economic-indicator-price.${componentIndex}`,
        styles: { height: '125px' },
        args: `currentIndex:${currentIndex}`
    };

    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="Economic Indicator Price"></SpecificPreviewComponent>
    ) : (
        <EmberWrapper componentSettings={componentSettings}></EmberWrapper>
    );
};
