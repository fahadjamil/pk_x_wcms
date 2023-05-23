import React from 'react';
import { EmberWrapper } from '../EmberWrapper';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';

export const WatchListMenu = (props) => {
    const { commonConfigs, componentIndex } = props;
    const componentSettings = {
        class: 'ua-widget-id',
        uaWidgetID: `price.widgets.watchlist-menu.${componentIndex}`,
    };
    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="Watchlist Menu"></SpecificPreviewComponent>
    ) : (
        <EmberWrapper componentSettings={componentSettings}></EmberWrapper>
    );
};
