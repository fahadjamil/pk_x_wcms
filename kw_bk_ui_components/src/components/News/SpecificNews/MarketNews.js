import React from 'react';
import { marketBackEndProxyPass } from '../../../config/path';
import { NewsSearch } from '../NewsSearch';

export const MarketNews = () => {
    return <NewsSearch dataSource={marketBackEndProxyPass('market-news')}></NewsSearch>;
};
