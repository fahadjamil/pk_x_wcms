import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { LazyLoadImage } from 'react-lazy-load-image-component';
import styled from 'styled-components';
import { OutboundLink } from 'gatsby-plugin-google-analytics';
import { ParagraphComponent } from './ParagraphComponent';

const CarasoulCaption = styled.div`
    position: relative;
    z-index: 20;
    ${(props) => {
        if (props && props.position && props.position.contentPosition) {
            let left = 'left';
            let right = 'right';

            if (props.language && props.language.direction === 'rtl') {
                left = 'right';
                right = 'left';
            }

            switch (props.position.contentPosition) {
                case 'topLeft':
                    return `top: 0%; ${left}: 0%;`;
                case 'topCenter':
                    return `top: 0%; ${left}: 50%; ${right}: 50%;`;
                case 'topRight':
                    return `top: 0%; ${right}: 0%;`;
                case 'midLeft':
                    return `top: 50%; bottom: 50%; ${left}: 0%;`;
                case 'midCenter':
                    return `top: 50%; bottom: 50%; ${left}: 50%; ${right}: 50%;`;
                case 'midRight':
                    return `top: 50%; bottom: 50%; ${right}: 0%;`;
                case 'bottomLeft':
                    return `bottom: 0%; ${left}: 0%;`;
                case 'bottomCenter':
                    return `bottom: 0%; ${left}: 50%; ${right}: 50%;`;
                case 'bottomRight':
                    return `bottom: 0%; ${right}: 0%;`;
                default:
                    return `top: 0%; ${left}: 0%;`;
            }
        } else {
            return 'top: 0%; left: 0%;';
        }
    }}
`;

export function BannerComponent(params) {
    const [bannerData, setBannerData] = useState({});
    const { commonConfigs, componentIndex } = params;
    const { data, styles, settings } = params.data;
    const selectedLanguage = params.lang;
    const { banner, interval } = settings;
    const { uniqueId, value } = banner;
    const { isEditMode, isPreview } = commonConfigs;

    let bannerInterval = 5000;

    if (interval && interval.value) {
        bannerInterval = interval.value * 1000;
    }

    useEffect(() => {
        let isUnmounted = false;

        if (!isUnmounted && value && value !== '') {
            getDataFromSource(isUnmounted);
        }

        return () => {
            isUnmounted = true;
        };
    }, [value]);

    function getDataFromSource(isUnmounted) {
        const jwt = localStorage.getItem('jwt-token');

        let requestUrl = '/api/banner';
        let requestParams = { id: value, nameSpace: params.dbName };

        if (isPreview) {
            requestUrl = '/api/banners/banner';
            requestParams = { id: value, dbName: params.dbName };
        }

        const httpHeaders = {
            headers: {
                Authorization: jwt,
            },
            params: requestParams,
        };

        Axios.get(requestUrl, httpHeaders)
            .then((result) => {
                if (!isUnmounted && result && result.data) {
                    setBannerData(result.data);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function getBannerUniqueTitle() {
        if (bannerData) {
            return bannerData.title.replace(/[^A-Z0-9]+/gi, '');
        } else {
            return 'bannerCarousel';
        }
    }

    function getAnalyticsEventLabel() {
        const uniqueTitle = getBannerUniqueTitle();
        const uniqueIndex = componentIndex ? '-' + componentIndex : '';
        const labelName = uniqueTitle + uniqueIndex;

        return labelName;
    }

    function getBannerImageComponenet(banner) {
        if (banner) {
            if (banner.boundUrl && banner.boundUrl !== '') {
                if (isPreview) {
                    return (
                        <a href={banner.boundUrl} rel="noreferrer" target="_blank">
                            {getImageComponent(
                                banner.imagePath,
                                banner.thumbnail,
                                banner.bannerText
                            )}
                        </a>
                    );
                } else {
                    return (
                        <OutboundLink
                            href={banner.boundUrl}
                            rel="noreferrer"
                            target="_blank"
                            eventLabel={getAnalyticsEventLabel()}
                        >
                            {getImageComponent(
                                banner.imagePath,
                                banner.thumbnail,
                                banner.bannerText
                            )}
                        </OutboundLink>
                    );
                }
            } else {
                return getImageComponent(banner.imagePath, banner.thumbnail, banner.bannerText);
            }
        } else {
            return <React.Fragment></React.Fragment>;
        }
    }

    function getImageComponent(imagePath, thumbnailUri, textContent) {
        const splitedPath = imagePath.split('/');
        const imageName = splitedPath[splitedPath.length - 1];

        /* if (imagePath && thumbnailUri) {
            return (
                <LazyLoadImage
                    alt="bannerImage"
                    src={imagePath}
                    height="auto"
                    width="100%"
                    effect="blur"
                    visibleByDefault={false}
                    placeholderSrc={thumbnailUri}
                    className="img-responsive"
                />
            );
        }
        else */
        if (imagePath && textContent) {
            const params = { styles: {}, data: { paragraph: textContent } };
            const paragraphStyles = { ...styles, language: selectedLanguage };
            return (
                <React.Fragment>
                    <img
                        style={{ width: '100%', objectFit: 'cover', height: '100%' }}
                        src={isPreview ? imagePath : '/images/' + imageName}
                        className="img-responsive"
                        alt="bannerImage"
                    />
                    <div className="container carousel-content">
                        <CarasoulCaption {...paragraphStyles}>
                            <ParagraphComponent data={params} />
                        </CarasoulCaption>
                    </div>
                </React.Fragment>
            );
        } else if (imagePath) {
            return (
                <img
                    style={{ width: '100%', objectFit: 'cover', height: '100%' }}
                    src={isPreview ? imagePath : '/images/' + imageName}
                    className="img-responsive"
                    alt="bannerImage"
                />
            );
        } else {
            return <React.Fragment></React.Fragment>;
        }
    }

    if (
        bannerData &&
        bannerData.bannerData &&
        selectedLanguage &&
        selectedLanguage.langKey &&
        bannerData.bannerData[selectedLanguage.langKey]
    ) {
        if (bannerData.bannerData[selectedLanguage.langKey].length === 1) {
            const singleBanner = bannerData.bannerData[selectedLanguage.langKey][0];
            return getBannerImageComponenet(singleBanner);
        } else {
            return (
                <div>
                    <div
                        id={getBannerUniqueTitle()}
                        className="carousel slide carousel-fade"
                        data-ride="carousel"
                    >
                        <ol className="carousel-indicators">
                            {bannerData.bannerData[selectedLanguage.langKey].map(
                                (banner, index) => {
                                    let classNameContent = '';
                                    if (index === 0) {
                                        classNameContent = 'active';
                                    }
                                    return (
                                        <li
                                            key={'bannerCarouselIndicator' + index}
                                            data-target={'#' + getBannerUniqueTitle()}
                                            data-slide-to={index}
                                            className={classNameContent}
                                        ></li>
                                    );
                                }
                            )}
                        </ol>
                        <div className="carousel-inner">
                            {bannerData.bannerData[selectedLanguage.langKey].map(
                                (banner, index) => {
                                    let classNameContent = 'carousel-item';
                                    if (index === 0) {
                                        classNameContent = 'carousel-item active';
                                    }

                                    return (
                                        <div
                                            key={'bannerCarousel' + index}
                                            className={classNameContent}
                                            data-interval={bannerInterval}
                                        >
                                            {getBannerImageComponenet(banner)}
                                        </div>
                                    );
                                }
                            )}
                        </div>
                        <a
                            className="carousel-control-prev"
                            href={'#' + getBannerUniqueTitle()}
                            role="button"
                            data-slide="prev"
                        >
                            <span className="carousel-control-prev-icon" aria-hidden="true"></span>
                            <span className="sr-only">Previous</span>
                        </a>
                        <a
                            className="carousel-control-next"
                            href={'#' + getBannerUniqueTitle()}
                            role="button"
                            data-slide="next"
                        >
                            <span className="carousel-control-next-icon" aria-hidden="true"></span>
                            <span className="sr-only">Next</span>
                        </a>
                    </div>
                </div>
            );
        }
    } else {
        return <React.Fragment></React.Fragment>;
    }
}
