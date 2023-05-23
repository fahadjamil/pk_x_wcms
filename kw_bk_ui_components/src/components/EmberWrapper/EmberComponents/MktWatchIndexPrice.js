import React from 'react';
import { EmberWrapper } from '../EmberWrapper';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';

export const MktWatchIndexPrice = (props) => {
    const { commonConfigs, componentIndex, data } = props;
    const currentIndex = (data.settings.collection && data.settings.collection.value) || '01';

    const componentSettings = {
        class: 'ua-widget-id aligner align-center',
        uaWidgetID: `price.widgets.index-price.${componentIndex}`,
        args: `currentIndex:${currentIndex};clickable:true;isMktWatch:true`,
    };

    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="Market Watch Index Price"></SpecificPreviewComponent>
    ) : (
        <EmberWrapper componentSettings={componentSettings}></EmberWrapper>
    );
};
