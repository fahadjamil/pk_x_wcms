import React from 'react';
import { EmberWrapper } from '../EmberWrapper';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';

export const ChartComparsion = (props) => {
    const { commonConfigs, componentIndex } = props;

    const componentSettings = {
        class: 'ua-widget-id full-height full-width',
        uaWidgetID: `chart.pro-chart.${componentIndex}`,
        args: `toolBarEnabled:true;enableSymSearch:true;enableCompare:true;enablePeriodSelection:true;enableZoom:true;enableIntervals:true`,

    };
    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="Chart Comparsion"></SpecificPreviewComponent>
    ) : (
        <EmberWrapper componentSettings={componentSettings}></EmberWrapper>
    );
};
