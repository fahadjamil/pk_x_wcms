import React from 'react';
import { EmberWrapper } from '../EmberWrapper';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';

export const ProChart = (props) => {
    const { commonConfigs, componentIndex, data } = props;
    const enableOHLC = (data.settings.OHLC && data.settings.OHLC.value) || false;
    const enablePeriodSelection = (data.settings.period && data.settings.period.value) || false;

    const componentSettings = {
        class: 'ua-widget-id full-height full-width',
        uaWidgetID: `chart.pro-chart.${componentIndex}`,
        args: `enableOHLCBelowChart:${enableOHLC};enablePeriodSelection:${enablePeriodSelection}`,

    };
    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="Pro Chart"></SpecificPreviewComponent>
    ) : (
        <EmberWrapper componentSettings={componentSettings}></EmberWrapper>
    );
};
