import React from 'react';
import { EmberWrapper } from '../EmberWrapper';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';

export const Portfolio = (props) => {
    const { commonConfigs, componentIndex } = props;

    const componentSettings = {
        class: 'ua-widget-id',
        uaWidgetID: `price.widgets.price-portfolio.${componentIndex}`,
    };
    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="Portfolio"></SpecificPreviewComponent>
    ) : (
        <EmberWrapper componentSettings={componentSettings}></EmberWrapper>
    );
};
