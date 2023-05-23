import React, { useState, useEffect } from 'react';

export function TabUiComponent(props) {
    const { commonConfigs } = props;

    useEffect(() => {
        enableContent();
    }, []);

    let tabs = [{ caption: '', sectionId: '' }];

    const { data, styles, settings } = props.data;

    if (data.tab && Array.isArray(data.tab) && data.tab.length > 0) {
        tabs = data.tab;
    }

    function enableContent() {
        if (!commonConfigs.isEditMode && tabs[0].sectionId != '') {
            let x = document.getElementById(tabs[0].sectionId);
            if (x) {
                x.style.display = 'block';
            }
        }
    }

    function hideContent() {
        if (!commonConfigs.isEditMode) {
            for (let i = 0; i < tabs.length; i++) {
                if (tabs[i] && tabs[i].sectionId && tabs[i].sectionId != '') {
                    let x = document.getElementById(tabs[i].sectionId);
                    if (x) {
                        x.style.display = 'none';
                    }
                }
            }
        }
    }

    function handleTabClick(tabId) {
        hideContent();
        let x = document.getElementById(tabId);
        if (x) {
            if (x.style.display === 'none') {
                x.style.display = 'block';
            } else {
                x.style.display = 'none';
            }
        }
    }

    return (
        <>
            {!(settings && settings.tab && settings.tab.value === 'vertical') && (
                <ul className="nav nav-tabs" id="myTab" role="tablist">
                    {tabs.map((item: any, index) => {
                        if (item && item.sectionId != '') {
                            let active = index === 0 ? ' active' : '';
                            return (
                                <li className="nav-item" role="presentation">
                                    <a
                                        className={'nav-link ' + active}
                                        id={item.sectionId + '-tab'}
                                        data-toggle="tab"
                                        href={'#' + item.sectionId}
                                        role="tab"
                                        aria-controls={item.sectionId}
                                        aria-selected="true"
                                        onClick={() => {
                                            handleTabClick(item.sectionId);
                                        }}
                                    >
                                        {item.caption}
                                    </a>
                                </li>
                            );
                        }

                        return null;
                    })}
                </ul>
            )}
            {settings && settings.tab && settings.tab.value === 'vertical' && (
                <ul
                    className="nav flex-column nav-pills"
                    id="v-pills-tab"
                    role="tablist"
                    aria-orientation="vertical"
                >
                    {tabs.map((item: any, index) => {
                        if (item && item.sectionId != '') {
                            let active = index === 0 ? ' active' : '';
                            return (
                                <li className="nav-item" role="presentation">
                                    <a
                                        className={'nav-link ' + active}
                                        id={item.sectionId + '-pill'}
                                        data-toggle="pill"
                                        href={'#' + item.sectionId}
                                        role="tab"
                                        aria-controls={item.sectionId}
                                        aria-selected="true"
                                        onClick={() => {
                                            handleTabClick(item.sectionId);
                                        }}
                                    >
                                        {item.caption}
                                    </a>
                                </li>
                            );
                        }

                        return null;
                    })}
                </ul>
            )}
        </>
    );
}
