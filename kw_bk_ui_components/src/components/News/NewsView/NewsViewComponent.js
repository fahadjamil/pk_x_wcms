import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import NewsViewBody from './NewsViewBody';
import Axios from 'axios';
import { SpecificPreviewComponent } from '../../SpecificPreviewComponent';
import { useURLparam } from '../../../customHooks/useURLparam';
import { marketBackEndProxyPass } from '../../../config/path';
import { setLanguage } from '../../../helper/metaData';
import { getFullDateText, getArabicFullDateText } from '../../../helper/date';
import { newsDetailLink, stockProfileLink } from '../../../config/constants';

const NewsViewWrapper = styled.div`
    padding: 0 10% 0 10%;
`;
const NewsType = styled.h3`
    color: #c5964a;
    font-size: 30px;
    text-transform: uppercase;
`;

const NewsTitle = styled.h1`
    font-size: 2rem;
`;
const FakeNewsTitle = styled.del`
    color: red !important;
`;
const Ticker = styled.a`
    color: #c5964a;
    text-decoration: none;
    text-transform: uppercase;
}`;
const DateTime = styled.p``;
const MoreInfo = styled.p`
    margin-top: 10px;
    font-size: 16px;
`;
const MoreInfoLink = styled.a`
    font-size: 16px;
    color: #c5964a;
    text-decoration: none;
`;

export const NewsViewComponent = (params) => {
    const { commonConfigs, lang } = params;
    const [newsViewData, setNewsViewData] = useState({});
    const [isFetching, setIsFetching] = useState(false);
    const convertByLang = (arText, enText) =>
        lang && lang.langKey && lang.langKey === 'AR' ? arText : enText;

    const newsID = useURLparam();
    useEffect(() => {
        if (newsID) {
            setIsFetching(true);
            Axios.get(marketBackEndProxyPass(), {
                params: {
                    RT: 3514,
                    L: setLanguage(lang),
                    NID: newsID,
                },
            })
                .then((result) => {
                    setNewsViewData(result.data);
                    setIsFetching(false);
                })
                .catch((err) => setIsFetching(false));
        }
    }, [newsID]);
    const pdfFullUrl = `https://cis.boursakuwait.com.kw/Portal/NewsPDF/${newsViewData.URL}`;
    const linkNewsID = newsViewData && newsViewData.LinkNewsId;
    const linkNewsTitle = newsViewData && linkNewsID && newsViewData.LinkNewsTitle;
    const falseNews = newsViewData && newsViewData.FalseNews;

    const linkedFalseNews = newsViewData && newsViewData.LinkedFalseNews;
    const linkedFalseNewsTitle = newsViewData && newsViewData.FalseNewsTitle;
    const linkFalseNewsId = newsViewData && newsViewData.LinkedFalseNewsId;

    return commonConfigs.isPreview ? (
        <SpecificPreviewComponent title="News View"></SpecificPreviewComponent>
    ) : (
        <NewsViewWrapper>
            <NewsType>{isFetching ? 'Loading ' : newsViewData.NewsType}</NewsType>
            {falseNews ? (
                <NewsTitle>
                    <FakeNewsTitle>{newsViewData.Title}</FakeNewsTitle>
                </NewsTitle>
            ) : (
                <NewsTitle>{newsViewData.Title}</NewsTitle>
            )}
            <Ticker href={stockProfileLink(newsViewData.Stk, lang)} target="_blank">
                {newsViewData.DisplayTicker || ''}
            </Ticker>
            <DateTime>
                {convertByLang(
                    getArabicFullDateText(newsViewData.PostedDate),
                    getFullDateText(newsViewData.PostedDate)
                )}
            </DateTime>
            <NewsViewBody pdf={newsViewData.URL} text={newsViewData.Matter} />
            {newsViewData.URL && newsViewData.URL.trim() ? (
                <MoreInfo>
                    {convertByLang('للمزيد من المعلومات', 'For more information ')}{' '}
                    <MoreInfoLink href={pdfFullUrl} target="_blank">
                        {convertByLang('اضغط هنا', 'Click Here')}
                    </MoreInfoLink>
                </MoreInfo>
            ) : (
                <React.Fragment></React.Fragment>
            )}

            {linkNewsID && linkNewsID > 0 ? (
                <MoreInfo>
                    {convertByLang(
                        ':الافصاح السابق التابع لنفس المحتوى ',
                        'Previous disclosure related to the same subject: '
                    )}{' '}
                    <MoreInfoLink href={newsDetailLink(linkNewsID, lang)} target="_blank">
                        {linkNewsTitle}
                    </MoreInfoLink>
                </MoreInfo>
            ) : (
                <React.Fragment></React.Fragment>
            )}

            {linkedFalseNews == 1 && linkedFalseNewsTitle && linkFalseNewsId > 0 ? (
                <MoreInfoLink href={newsDetailLink(linkFalseNewsId, lang)}>
                    <FakeNewsTitle>{linkedFalseNewsTitle}</FakeNewsTitle>
                </MoreInfoLink>
            ) : (
                <React.Fragment></React.Fragment>
            )}
        </NewsViewWrapper>
    );
};
