import React from 'react';
import { EmberWrapper } from '../EmberWrapper';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';

export const IntradayChart = (props) => {
    const { commonConfigs, componentIndex } = props;

    const componentSettings = {
        class: 'ua-widget-id full-height full-width',
        uaWidgetID: `chart.pro-chart.${componentIndex}`,
        args: `toolBarEnabled:true;enableSymSearch:true;`,

    };
    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="Intraday Chart"></SpecificPreviewComponent>
    ) : (
        <EmberWrapper componentSettings={componentSettings}></EmberWrapper>
    );
};
