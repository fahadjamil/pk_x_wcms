import React from 'react';
import { PagePreviewComponent } from 'ui-components';
import { Helmet } from 'react-helmet';

export default function PreviewPageWrapperComponent(props) {
    const date = new Date();
    const { pageName, pageInfo, isHomePage, path } = props?.pageContext?.paramsData?.page;

    let isOtcMenuPage = path && path.search('otc-platform');
    let isMarketWatchPage = path && path.search('market-watch');
    let isStockScreenerPage = path && path.search('stock-screener') > -1 ;

    let externalCSS,
        externalJS = [];
    let metaData = {};
    let applicationName,
        author,
        description,
        viewPort,
        keywords = '';
    let language = props?.pageContext?.paramsData?.pageLanguage?.langKey?.toLowerCase();

    if (pageInfo && Object.keys(pageInfo).length > 0) {
        externalCSS = pageInfo?.externalCSS;
        externalJS = pageInfo?.externalJS;
        metaData = pageInfo?.metaData;
    }

    if (metaData && Object.keys(metaData).length > 0) {
        applicationName = metaData?.applicationName;
        author = metaData?.author;
        description = metaData?.description;
        viewPort = metaData?.viewPort;
        keywords = metaData?.keywords;
    }

    if (description === '') {
        description = pageName ? pageName : '';
    }

    const propsWrapper = {
        headerPreviewData: {
            template: props.pageContext.paramsData.template,
            themes: props.pageContext.paramsData.themes,
            contentData: props.pageContext.paramsData.templateData,
        },

        pagePreviewData: {
            page: props.pageContext.paramsData.page,
            themes: props.pageContext.paramsData.themes,
            contentData: props.pageContext.paramsData.pageData,
        },
        footerPreviewData: {
            template: props.pageContext.paramsData.template,
            themes: props.pageContext.paramsData.themes,
            contentData: props.pageContext.paramsData.templateData,
        },
        openComponentList: { openComponentList },
        dbName: props.pageContext.paramsData.dataBaseName,
        selectedLanguage: props.pageContext.paramsData.pageLanguage,
    };

    function openComponentList(column) {}

    function getTitle() {
        let pageTitle = props.pageContext.paramsData.pageTitle;

        if (pageTitle === undefined || pageTitle === '') {
            pageTitle = pageName ? pageName : '';
        }
        return pageTitle;
    }

    function setFixedHeader() {
        if (typeof window !== 'undefined' && typeof document !== 'undefined') {
            var scroll = window.scrollY;

            if (scroll >= 472) {
                const innerHeader = document.getElementsByClassName('inner-header');

                if (innerHeader && innerHeader.length > 0) {
                    innerHeader[0].classList.add('fixed-header');
                }
            } else {
                const innerHeader = document.getElementsByClassName('inner-header');

                if (innerHeader && innerHeader.length > 0) {
                    innerHeader[0].classList.remove('fixed-header');
                }
            }
        }
    }

    if (isOtcMenuPage === 0) {
        if (typeof window !== 'undefined') {
            document.getElementsByTagName('BODY')[0].classList.add('otc-page');
        }
    }

    if (isMarketWatchPage === 30) {
        if (typeof window !== 'undefined') {
            document.getElementsByTagName('BODY')[0].classList.add('market-watch');
        }
    }

    if (isHomePage) {
        if (typeof window !== 'undefined') {
            document.getElementsByTagName('BODY')[0].classList.add('home-page');
        }
    }

    if (typeof window !== 'undefined') {
        if (!isHomePage) {
            window.onscroll = function() {
                setFixedHeader();
            };
        }
    }

    return (
        <div>
            <Helmet>
                <html lang={language} />
                <title>{getTitle()}</title>
                <meta
                    name="universal-app/config/environment"
                    content="%7B%22modulePrefix%22%3A%22universal-app%22%2C%22APP%22%3A%7B%22version%22%3A%22DFNUAWEB_BK_X_1.000.00.0.123%2Be7ae5796%22%7D%7D"
                />

                {applicationName && applicationName.length > 0 && (
                    <meta name="application-name" content={applicationName} />
                )}
                {description && description.length > 0 && (
                    <meta name="description" content={description} />
                )}
                {!description && <meta name="description" content="no data" />}
                {keywords && keywords.length > 0 && <meta name="keywords" content={keywords} />}
                {author && author.length > 0 && <meta name="author" content={author} />}
                {viewPort && viewPort.length > 0 && <meta name="viewport" content={viewPort} />}

                {/* <link
                    rel="stylesheet"
                    type="text/css"
                    href="/ua/assets/ua-styles-1620802552250.css"
                /> */}
                {/* Preload removed since firefox currently doesn't support it */}

                {/* <link
          rel="preload"
          href="/ua/assets/universal-app-1611924727917.css"
          as="style"
          onload="this.onload=null;this.rel='stylesheet'"
        />
        <noscript>
          {`<link
            rel="stylesheet"
            href="/ua/assets/universal-app-1611924727917.css"
          />`}
        </noscript> */}
                {/*<link rel="stylesheet" type="text/css" href="/ua/assets/vendor-1611924727917.css" />*/}
                {/* <link
          rel="preload"
          href="/ua/assets/vendor-1611924727917.css"
          as="style"
          onload="this.onload=null;this.rel='stylesheet'"
        />
        <noscript>
          {`<link rel="stylesheet" href="/ua/assets/vendor-1611924727917.css" />`}
        </noscript> */}
                {/*<link href="/ua/assets/css/chart-1611924727917.css" rel="stylesheet" />*/}
                {/* <link
          rel="preload"
          href="/ua/assets/css/chart-1611924727917.css"
          as="style"
          onload="this.onload=null;this.rel='stylesheet'"
        />
        <noscript>
          {`<link
            rel="stylesheet"
            href="/ua/assets/css/chart-1611924727917.css"
          />`}
        </noscript> */}
                {/*<link href="/ua/assets/css/stx-chart-1611924727917.css" rel="stylesheet" />*/}
                {/* <link
          rel="preload"
          href="/ua/assets/css/stx-chart-1611924727917.css"
          as="style"
          onload="this.onload=null;this.rel='stylesheet'"
        />
        <noscript>
          {`<link
            rel="stylesheet"
            href="/ua/assets/css/stx-chart-1611924727917.css"
          />`}
        </noscript> */}
                {/* <link
          href="http://ovuzy.com/bk-static/bk-home-custom.css"
          rel="stylesheet"
          type="text/css"
        /> */}
                {/* <link href="/bk-static/bk-home-custom.css" rel="stylesheet" type="text/css" /> */}
                {isStockScreenerPage ? (
                    <link rel="stylesheet" type="text/css" href="/custom_styles/antd.css" />
                ) : (
                    <React.Fragment></React.Fragment>
                )}

                {externalCSS &&
                    externalCSS.map((link, linkIndex) => {

                        if (link.length > 0) {
                            return (
                                <React.Fragment key={`external-css-${linkIndex}`}>
                                    <link href={link} rel="stylesheet" type="text/css" />
                                </React.Fragment>
                            );
                        }
                    })}

                {/* <script src="/bk-static/ua-root-creation.js" defer></script> */}
            </Helmet>
            <PagePreviewComponent {...propsWrapper}></PagePreviewComponent>
            {externalJS &&
                externalJS.map((link, linkIndex) => {
                    if (link.length > 0) {
                        return (
                            <React.Fragment key={`external-js-${linkIndex}`}>
                                <script src={link} defer></script>
                            </React.Fragment>
                        );
                    }
                })}
        </div>
    );
}
