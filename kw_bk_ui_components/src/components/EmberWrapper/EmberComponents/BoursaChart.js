import React from 'react';
import { EmberWrapper } from '../EmberWrapper';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';

export const BoursaChart = (props) => {
    const { commonConfigs, componentIndex } = props;

    const componentSettings = {
        class: 'ua-widget-id full-height full-width',
        uaWidgetID: `chart.pro-chart.${componentIndex}`,
        args: `toolBarEnabled:true;enableSymSearch:true;enablePeriodSelection:true;enableChartStyles:true;enableIndicators:true;enableZoom:true;enableIntervals:true`,

    };
    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="Boursa Chart"></SpecificPreviewComponent>
    ) : (
        <EmberWrapper componentSettings={componentSettings}></EmberWrapper>
    );
};
