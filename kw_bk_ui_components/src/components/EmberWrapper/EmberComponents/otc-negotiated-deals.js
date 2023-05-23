import React from 'react';
import { EmberWrapper } from '../EmberWrapper';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';

export const OTCNegotiatedDeals = (props) => {
    const { commonConfigs, componentIndex } = props;
    const componentSettings = {
        class: 'ua-widget-id',
        uaWidgetID: `price.widgets.otc-negotiated-deals.${componentIndex}`,
    };
    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="OTC Negotiated Deals"></SpecificPreviewComponent>
    ) : (
        <EmberWrapper componentSettings={componentSettings}></EmberWrapper>
    );
};
