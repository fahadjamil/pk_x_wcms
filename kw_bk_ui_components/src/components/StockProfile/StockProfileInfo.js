import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { marketBackEndProxyPass } from '../../config/path';
import { useURLparam } from '../../customHooks/useURLparam';
import { useUserAgent } from '../../customHooks/useUserAgent';
import { DataUnavailable } from './subcomponents/DataAvailability';

const StockTitleWrapper = styled.div`
    text-align: start;
`;
const StockTitleMobilWrapper = styled.div`
    text-align: center;
    margin-bottom: 2em;
`;
const StockTitle = styled.h1`
    font-size: 24px;
`;
const LogoWrapper = styled.div`
    text-align: end;
    position: relative;
`;

const LogoMobileWrapper = styled.div`
    text-align: center;
    margin-bottom: 1em;
`;
const TickerWrapper = styled.div``;
const TickerMobileWrapper = styled.div`
    text-align: center;
    margin-bottom: 1em;
`;
const StockNumberWrapper = styled.div``;
const StockNumberMobileWrapper = styled.div`
    text-align: center;
    margin-bottom: 1em;
`;
const WebLinkWrapper = styled.div``;
const WebLinkMobileWrapper = styled.div`
    text-align: center;
    margin-bottom: 1em;
`;
const PropertyName = styled.p`
    color: #757171;
    margin-bottom: 0;
`;

const WebLinkText = styled.a`
    color: black;
`;

export const StockProfileInfo = (props) => {
    const { lang } = props;
    const isMobile = useUserAgent();
    const stockID = useURLparam();
    const [profileData, setProfileData] = useState({});
    const [dataUnavailable, setDataUnavailable] = useState(false);

    useEffect(() => {
        if (stockID) {
            Axios.get(marketBackEndProxyPass(), {
                params: {
                    RT: 3517,
                    SYMC: stockID,
                    L: convertByLang('A', 'E'),
                },
            })
                .then((res) => {
                    if (
                        res &&
                        res.data &&
                        res.data['Company Summary'] &&
                        Array.isArray(res.data['Company Summary']) &&
                        res.data['Company Summary'][0]
                    ) {
                        setProfileData(res.data['Company Summary'][0]);
                    } else {
                        setDataUnavailable(true);
                    }
                })
                .catch((err) => setDataUnavailable(true));
        }
    }, [stockID]);
    const convertByLang = (arText, enText) => (lang.langKey === 'AR' ? arText : enText);

    const companyName = profileData.companyName;
    const companyTicker = profileData.DisplayTicker;
    const comapnyStockNumber = profileData.Stk;
    const companyWebLink = profileData.Website;
    const companyLogo = `https://cis.boursakuwait.com.kw/logo/${profileData.ImageName}`;

    const TICKER = convertByLang('اسم السهم', 'Ticker');
    const STOCK_NUMBER = convertByLang('رقم الشركة', 'Stock Number');

    const Logo = () =>
        profileData && profileData.ImageName ? (
            <img src={companyLogo} alt="company logo" />
        ) : (
            <React.Fragment />
        );

    const WebLink = () => <WebLinkText href={companyWebLink}>{companyWebLink}</WebLinkText>;
    const StockProfileInfoComponent = () =>
        isMobile ? (
            <div className="container-fluid ">
                <StockTitleMobilWrapper>
                    <StockTitle>{companyName}</StockTitle>
                </StockTitleMobilWrapper>
                <LogoMobileWrapper>
                    <Logo />
                </LogoMobileWrapper>
                <TickerMobileWrapper>
                    <PropertyName>{TICKER}</PropertyName>
                    <strong> {companyTicker}</strong>
                </TickerMobileWrapper>
                <StockNumberMobileWrapper>
                    <PropertyName> {STOCK_NUMBER}</PropertyName>
                    <strong> {comapnyStockNumber}</strong>
                </StockNumberMobileWrapper>
                <WebLinkMobileWrapper>
                    <WebLink />
                </WebLinkMobileWrapper>
            </div>
        ) : (
            <div className="container-fluid ">
                <div className="row">
                    <StockTitleWrapper className="col col-lg-8">
                        <StockTitle>{companyName}</StockTitle>
                        <div className="row justify-content-lg-left">
                            <TickerWrapper className="col col-lg-auto">
                                {TICKER}: <strong> {companyTicker} </strong>
                            </TickerWrapper>
                            <StockNumberWrapper className="col col-lg-auto">
                                {STOCK_NUMBER}: <strong>{comapnyStockNumber} </strong>
                            </StockNumberWrapper>
                            <WebLinkWrapper className="col col-lg-auto">
                                <WebLink />
                            </WebLinkWrapper>
                        </div>
                    </StockTitleWrapper>
                    <LogoWrapper className="col col-lg-4 ">
                        <Logo />
                    </LogoWrapper>
                </div>
            </div>
        );



    return dataUnavailable ? <DataUnavailable lang={lang} /> : <StockProfileInfoComponent />;
};
