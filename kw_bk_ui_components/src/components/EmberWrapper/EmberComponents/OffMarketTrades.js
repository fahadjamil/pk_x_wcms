import React from 'react';
import { EmberWrapper } from '../EmberWrapper';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';

export const OffMarketTrades = (props) => {
    const { commonConfigs, componentIndex } = props;

    const componentSettings = {
        class: 'ua-widget-id',
        uaWidgetID: `price.widgets.off-market-trades-summary.${componentIndex}`,
    };
    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="Off Market Trades"></SpecificPreviewComponent>
    ) : (
        <EmberWrapper componentSettings={componentSettings}></EmberWrapper>
    );
};
