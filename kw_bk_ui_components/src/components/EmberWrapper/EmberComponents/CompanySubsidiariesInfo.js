import React from 'react';
import { EmberWrapper } from '../EmberWrapper';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';

export const CompanySubsidiariesInfo = (props) => {
    const { commonConfigs, componentIndex } = props;

    const componentSettings = {
        class: 'ua-widget-id',
        uaWidgetID: `price.widgets.company-profile.company-subsidiaries-new.${componentIndex}`,
        args: `instrumentType:0;`,
    };

    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="Company Subsidiaries Info"></SpecificPreviewComponent>
    ) : (
        <EmberWrapper componentSettings={componentSettings}></EmberWrapper>
    );
};
