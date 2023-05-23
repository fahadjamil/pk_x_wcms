import React from 'react';
import NewsComponent from '../../NewsComponent';

export const TradingSystemAnnouncements = (props) => {
    const { commonConfigs, lang } = props;
    return <NewsComponent default={100} commonConfigs={commonConfigs} lang={lang}></NewsComponent>;
};
