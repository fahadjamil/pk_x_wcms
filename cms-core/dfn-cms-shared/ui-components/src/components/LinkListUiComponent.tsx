import React, { useState, useEffect } from 'react';
import { v1 as uuidv1 } from 'uuid';

export function LinkListUiComponent(props) {
    const { commonConfigs } = props;
    const [uniqueKey, setUniqueKey] = useState<string>('');
    let location = '';
    if (typeof window !== 'undefined') {
        location = window.location.href;
        // console.log('location' + window.location.href);
    }

    useEffect(() => {
        setUniqueKey(uuidv1());
    }, []);

    let linkList = [{ caption: '', link: '' }];

    const { data, styles, settings } = props.data;

    if (data.linkList) {
        linkList = data.linkList;
    }

    return (
        <>
            {settings && settings.linkList && settings.linkList.value === 'horizontal' && (
                <ul className="nav nav-tabs" id="myTab" role="tablist">
                    {linkList.map((item: any, index) => {
                        // let active = index === 0 ? ' active' : '';
                        let routes = location?.split('/');
                        let route = routes[routes.length - 1];
                        let symCodes = route?.split('#');
                        let link = symCodes[1] ? item.link + '#' + symCodes[1] : item.link;
                        let active = link ? (link.indexOf(route) > 0 ? ' active' : '') : '';

                        // console.log('isActive*****', active);
                        // console.log('link*****', link);
                        return (
                            <li
                                className="nav-item"
                                role="presentation"
                                key={uniqueKey + '-' + index}
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
            )}
            {!(settings && settings.linkList && settings.linkList.value === 'horizontal') && (
                <ul
                    className="nav flex-column nav-pills"
                    id="v-pills-tab"
                    role="tablist"
                    aria-orientation="vertical"
                >
                    {linkList.map((item: any, index) => {
                        // let active = index === 0 ? ' active' : '';
                        let routes = location?.split('/');
                        let route = routes[routes.length - 1];
                        let symCodes = route?.split('#');
                        let link = symCodes[1] ? item.link + '#' + symCodes[1] : item.link;
                        let active = link ? (link.indexOf(route) > 0 ? ' active' : '') : '';

                        // console.log('isActive*****', active);
                        // console.log('link*****', link);
                        return (
                            <li
                                className="nav-item"
                                role="presentation"
                                key={uniqueKey + '-' + index}
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
            )}
        </>
    );
}
