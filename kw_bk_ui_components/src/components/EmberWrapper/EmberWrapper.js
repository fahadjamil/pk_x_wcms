import React, { memo } from 'react';

export const EmberWrapper = memo((props) => {
    const { componentSettings } = props;

    return (
        <div
            className={componentSettings.class}
            ua-widget-id={componentSettings.uaWidgetID}
            style={componentSettings.styles}
            ua-widget-args={componentSettings.args}
        ></div>
    );
});
