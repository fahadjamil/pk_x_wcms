import React from 'react';
import { EmberWrapper } from '../EmberWrapper';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';

export const MarketWatchChart = (props) => {
    const { commonConfigs, componentIndex, data } = props;
    const height = data.settings.chartHeight ? data.settings.chartHeight.value : '';

    const componentSettings = {
        class: 'ua-widget-id full-height full-width',
        uaWidgetID: `chart.pro-chart.${componentIndex}`,
        args: `enableOHLCBelowChart:false;enablePeriodSelection:false;height:${height};`,

    };
    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="Market Watch Chart"></SpecificPreviewComponent>
    ) : (
        <EmberWrapper componentSettings={componentSettings}></EmberWrapper>
    );
};
