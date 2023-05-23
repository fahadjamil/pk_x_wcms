import React from 'react';
import { EmberWrapper } from '../EmberWrapper';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';

export const IndexTab = (props) => {
    const { commonConfigs, componentIndex, data } = props;
    const dataArray = data.settings.collection && data.settings.collection.value;
    let formattedArray = dataArray ? dataArray.map(element => element.value).join('|') : '';

    const componentSettings = {
        class: 'ua-widget-id aligner align-center',
        uaWidgetID: `price.widgets.index-tab.${componentIndex}`,
        args: `dataArray:${formattedArray}`,
    };

    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="Market Watch Index Tab"></SpecificPreviewComponent>
    ) : (
        <EmberWrapper componentSettings={componentSettings}></EmberWrapper>
    );
};
