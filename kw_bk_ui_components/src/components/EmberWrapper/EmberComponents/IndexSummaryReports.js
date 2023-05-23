import React from 'react';
import { EmberWrapper } from '../EmberWrapper';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';

export const IndexSummaryReports = (props) => {
    const { commonConfigs, componentIndex, data } = props;

    const componentSettings = {
        class: 'ua-widget-id',
        uaWidgetID: `price.widgets.index-summary-report.${componentIndex}`,
    };

    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="Index Summery Reports"></SpecificPreviewComponent>
    ) : (
        <EmberWrapper componentSettings={componentSettings}></EmberWrapper>
    );
};
