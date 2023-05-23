import React from 'react';
import NewsComponent from '../../NewsComponent';

export const MarketAnnouncements = (props) => {
    const { commonConfigs, lang } = props;
    return <NewsComponent default={0} commonConfigs={commonConfigs} lang={lang}></NewsComponent>;
};
