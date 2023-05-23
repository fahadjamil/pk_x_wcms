import React from 'react';
import { EmberWrapper } from '../EmberWrapper';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';

export const RightsMarketWatch = (props) => {
    const { commonConfigs, componentIndex } = props;

    const componentSettings = {
        class: 'ua-widget-id',
        uaWidgetID: `price.widgets.watch-list.rights-watch-list.${componentIndex}`,
    };
    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="Rights Watch List"></SpecificPreviewComponent>
    ) : (
        <EmberWrapper componentSettings={componentSettings}></EmberWrapper>
    );
};
