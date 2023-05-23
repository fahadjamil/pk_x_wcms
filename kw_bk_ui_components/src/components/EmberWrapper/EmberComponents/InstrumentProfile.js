import React from 'react';
import { EmberWrapper } from '../EmberWrapper';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';

export const InstrumentProfile = (props) => {
    const { commonConfigs, componentIndex, data } = props;
    const instrumentType =  (data.settings.type && data.settings.type.value) || 0;

    const componentSettings = {
        class: 'ua-widget-id',
        uaWidgetID: `price.widgets.instrument-profile.${componentIndex}`,
        args: `instrumentType:${instrumentType}`,
    };

    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="Instrument Profile"></SpecificPreviewComponent>
    ) : (
        <EmberWrapper componentSettings={componentSettings}></EmberWrapper>
    );
};
