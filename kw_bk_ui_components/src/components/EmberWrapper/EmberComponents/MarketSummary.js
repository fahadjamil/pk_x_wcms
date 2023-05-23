import React from 'react';
import { EmberWrapper } from '../EmberWrapper';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';

export const MarketSummary = (props) => {
    const { commonConfigs, componentIndex } = props;
    const componentSettings = {
        class: 'ua-widget-id',
        uaWidgetID: `price.widgets.market-summary.${componentIndex}`,
        styles: { height: '300px' },
    };
    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="Market Summary"></SpecificPreviewComponent>
    ) : (
        <EmberWrapper componentSettings={componentSettings}></EmberWrapper>
    );
};
