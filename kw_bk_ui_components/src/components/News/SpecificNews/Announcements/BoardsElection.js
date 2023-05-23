import React from 'react';
import NewsComponent from '../../NewsComponent';

export const BoardsElection = (props) => {
    const { commonConfigs, lang } = props;

    return <NewsComponent default={14} commonConfigs={commonConfigs} lang={lang}></NewsComponent>;
};
