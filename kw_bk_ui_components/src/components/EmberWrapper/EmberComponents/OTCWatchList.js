import React from 'react';
import { EmberWrapper } from '../EmberWrapper';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';

export const OTCWatchList = (props) => {
    const { commonConfigs, componentIndex } = props;

    const componentSettings = {
        class: 'ua-widget-id',
        uaWidgetID: `price.widgets.watch-list.otc-watch-list.${componentIndex}`,
    };
    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="OTC Watch List"></SpecificPreviewComponent>
    ) : (
        <EmberWrapper componentSettings={componentSettings}></EmberWrapper>
    );
};
