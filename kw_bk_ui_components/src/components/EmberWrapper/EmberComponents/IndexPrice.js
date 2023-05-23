import React from 'react';
import { EmberWrapper } from '../EmberWrapper';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';

export const IndexPrice = (props) => {
    const { commonConfigs, componentIndex, data } = props;
    const currentIndex = data.settings.collection.value;
    const isClickable = (data.settings.bound && data.settings.bound.value) || false;

    const componentSettings = {
        class: 'ua-widget-id aligner align-center',
        uaWidgetID: `price.widgets.index-price.${componentIndex}`,
        styles: { height: '125px' },
        args: `currentIndex:${currentIndex};clickable:${isClickable}`,
    };

    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="Index Price"></SpecificPreviewComponent>
    ) : (
        <EmberWrapper componentSettings={componentSettings}></EmberWrapper>
    );
};
