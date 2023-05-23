import React from 'react';
import { EmberWrapper } from '../EmberWrapper';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';

export const CompanyOwnersInfo = (props) => {
    const { commonConfigs, componentIndex, data} = props;
    const instrumentType =  (data && data.settings && data.settings.type && data.settings.type.value) || 0;

    const componentSettings = {
        class: 'ua-widget-id',
        uaWidgetID: `price.widgets.company-profile.company-owners-new.${componentIndex}`,
        args: `instrumentType:${instrumentType}`,
    };

    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="Company Owners Info"></SpecificPreviewComponent>
    ) : (
        <EmberWrapper componentSettings={componentSettings}></EmberWrapper>
    );
};