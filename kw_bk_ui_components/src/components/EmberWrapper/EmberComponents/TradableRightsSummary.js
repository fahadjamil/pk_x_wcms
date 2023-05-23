import React from 'react';
import { EmberWrapper } from '../EmberWrapper';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';

export const TradableRightsSummary = (props) => {
    const { commonConfigs, componentIndex } = props;
    const componentSettings = {
        class: 'ua-widget-id',
        uaWidgetID: `price.widgets.tradable-rights-summary.${componentIndex}`,
    };
    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="Tradable Rights Summary"></SpecificPreviewComponent>
    ) : (
        <EmberWrapper componentSettings={componentSettings}></EmberWrapper>
    );
};
