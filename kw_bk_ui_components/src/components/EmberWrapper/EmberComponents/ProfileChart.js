import React from 'react';
import { EmberWrapper } from '../EmberWrapper';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';

export const ProfileChart = (props) => {
    const { commonConfigs, componentIndex, data } = props;
    const type =  (data.settings && data.settings.type && data.settings.type.value) || 0;

    const componentSettings = {
        class: 'ua-widget-id full-height full-width',
        uaWidgetID: `chart.pro-chart.${componentIndex}`,
        args: `toolBarEnabled:true;enablePeriodSelection:true;enableZoom:true;readUrl:true;type:${type}`,

    };
    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="Profile Chart"></SpecificPreviewComponent>
    ) : (
        <EmberWrapper componentSettings={componentSettings}></EmberWrapper>
    );
};
