import React from 'react';
import { EmberWrapper } from '../EmberWrapper';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';

export const ReportChart = (props) => {
    const { commonConfigs, componentIndex } = props;

    const componentSettings = {
        class: 'ua-widget-id full-height full-width',
        uaWidgetID: `chart.report-chart.${componentIndex}`,
        args: `readUrl:true;chartType:report`,
    };
    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="Report Chart"></SpecificPreviewComponent>
    ) : (
        <EmberWrapper componentSettings={componentSettings}></EmberWrapper>
    );
};
