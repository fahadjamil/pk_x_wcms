import React, { useState, useEffect } from 'react';

function BasicMenuComponent(props) {
    const { commonConfigs } = props;
    let location = '';

    if (typeof window !== 'undefined') {
        location = window.location.href;
    }

    let settingsConfigs=undefined;
    let basicMenu = [{ caption: '', link: '' }];
    const { data, styles, settings } = props.data;
    const selectedLanguage = props.lang;
    const { isEditMode, isPreview } = commonConfigs;
    const isPreviewMode = isPreview ? isPreview : false;

    if (data.basicMenu) {
        basicMenu = data.basicMenu;
    }

    if (settings) {
        settingsConfigs = settings;
    }

    const [hrefUrl, setHrefUrl] = useState('#');

    useEffect(() => {
        let url = window.location.pathname,
            urlRegExp = new RegExp(url.replace(/\/$/, '') + '$');

        let navBar = document.getElementById('basicNavBarComponent');
        let navItems: any = navBar.getElementsByClassName('nav-item');

        for (var i = 0; i < navItems.length; i++) {
            const navItem = navItems[i];

            if (navItem) {
                const navLink = navItem.getElementsByClassName('nav-link');

                if (navLink && navLink[0]) {
                    if (urlRegExp.test(navLink[0].href.replace(/\/$/, ''))) {
                        navLink[0].classList.add('nav-link-active');
                    }
                }
            }
        }

        return () => {
            for (var i = 0; i < navItems.length; i++) {
                const navItem = navItems[i];

                if (navItem) {
                    const navLink = navItem.getElementsByClassName('nav-link');

                    if (navLink && navLink[0]) {
                        if (urlRegExp.test(navLink[0].href.replace(/\/$/, ''))) {
                            navLink[0].classList.remove('nav-link-active');
                        }
                    }
                }
            }
        };
    }, []);

    useEffect(() => {
        let isMounted = true;
        if (isMounted && selectedLanguage) {
            if (selectedLanguage.langKey.toLowerCase() === 'en') {
                setHrefUrl(getUrl('ar'));
            } else if (selectedLanguage.langKey.toLowerCase() === 'ar') {
                setHrefUrl(getUrl('en'));
            }
        }

        return () => {
            isMounted = false;
        };
    }, [selectedLanguage]);

    const getUrl = (languageKey) => {
        let updatedUrl = '#';

        if (typeof window !== 'undefined') {
            const languageKeys: any = ['en', 'ar'];
            const currentUrl = window.location.href;
            const currentWebHost = window.location.hostname;
            const currentPathName = window.location.pathname;
            const currentProtocol = window.location.protocol;
            updatedUrl = currentUrl;

            if (currentPathName.length > 0) {
                const currentLangKey = currentPathName.split('/')[1];

                if (languageKeys.includes(currentLangKey)) {
                    const updatedPath = currentPathName.replace(currentLangKey, languageKey);
                    updatedUrl = currentUrl.replace(currentPathName, updatedPath);
                }
            }
        }

        return updatedUrl;
    };

    return (
        <>
            <nav className="navbar navbar-expand-lg" id="basicNavBarComponent">
                <a className="navbar-brand pt-md-0 pt-3 " href="/en">
                    {isPreviewMode ? (
                        <img
                            height="32"
                            src={
                                (settingsConfigs &&
                                    settingsConfigs.logo &&
                                    settingsConfigs.logo.value &&
                                    settingsConfigs.logo.value.filePath) ||
                                '/logo/logo.png'
                            }
                            alt="LOGO"
                        ></img>
                    ) : (
                        <img
                            height="32"
                            src={
                                (settingsConfigs &&
                                    settingsConfigs.logo &&
                                    settingsConfigs.logo.value &&
                                    settingsConfigs.logo.value.fileName &&
                                    `/images/${settingsConfigs.logo.value.fileName}`) ||
                                '/logo/logo.png'
                            }
                            alt="LOGO"
                        ></img>
                    )}
                </a>
                <button
                    className="navbar-toggler"
                    type="button"
                    data-toggle="collapse"
                    data-target="#basicNavbarToggler"
                    aria-controls="basicNavbarToggler"
                    aria-expanded="false"
                    aria-label="Toggle navigation"
                >
                    <span className="navbar-toggler-icon"></span>
                </button>
                <div className="collapse navbar-collapse" id="basicNavbarToggler">
                    <ul className="navbar-nav mr-auto mt-2 mt-lg-0">
                        {basicMenu.map((item: any, index) => {
                            let routes = location?.split('/');
                            let route = routes[routes.length - 1];
                            let symCodes = route?.split('#');
                            let link = symCodes[1] ? item.link + '#' + symCodes[1] : item.link;
                            let active = link
                                ? link.indexOf(route) > 0
                                    ? ' nav-item-active'
                                    : ''
                                : '';

                            return (
                                <li
                                    className="nav-item"
                                    role="presentation"
                                    key={`basic-menu-${index}`}
                                >
                                    <a
                                        className={'nav-link ' + active}
                                        id={item.link + '-pill'}
                                        href={link}
                                    >
                                        {item.caption}
                                    </a>
                                </li>
                            );
                        })}
                    </ul>
                </div>
            </nav>
        </>
    );
}

export default BasicMenuComponent;
