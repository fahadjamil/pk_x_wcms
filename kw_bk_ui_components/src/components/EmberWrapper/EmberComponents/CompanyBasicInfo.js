import React from 'react';
import { EmberWrapper } from '../EmberWrapper';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';

export const CompanyBasicInfo = (props) => {
    const { commonConfigs, componentIndex, data} = props;
    const type =  (data.settings && data.settings.type && data.settings.type.value) || 0;

    const componentSettings = {
        class: 'ua-widget-id',
        uaWidgetID: `price.widgets.company-profile.company-basic-info.${componentIndex}`,
        args: `type:${type}`,
    };

    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="Company Basic Info"></SpecificPreviewComponent>
    ) : (
        <EmberWrapper componentSettings={componentSettings}></EmberWrapper>
    );
};
