import React from 'react';
import { EmberWrapper } from '../EmberWrapper';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';

export const SectorSummary = (props) => {
    const { commonConfigs, componentIndex } = props;
    const componentSettings = {
        class: 'ua-widget-id',
        uaWidgetID: `price.widgets.sector-summary.${componentIndex}`,
    };
    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="Sector Summary"></SpecificPreviewComponent>
    ) : (
        <EmberWrapper componentSettings={componentSettings}></EmberWrapper>
    );
};
