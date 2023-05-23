import React from 'react';
import { EmberWrapper } from '../EmberWrapper';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';

export const CompanyAuditors = (props) => {
    const { commonConfigs, componentIndex } = props;

    const componentSettings = {
        class: 'ua-widget-id',
        uaWidgetID: `price.widgets.company-profile.company-auditors-new.${componentIndex}`,
        args: `instrumentType:0;`,
    };

    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="Company Auditors"></SpecificPreviewComponent>
    ) : (
        <EmberWrapper componentSettings={componentSettings}></EmberWrapper>
    );
};
