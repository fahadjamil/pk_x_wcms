import React from 'react';

import styled from 'styled-components';
import { genarateComponentLevelStyleConfigurations } from '../util/UiComponentsUtil';

const Icon = styled.div`
    > img {
        ${(props: any) => {
            if (props.customCSS) {
                return props.customCSS;
            }
        }}
    }
`;
export function IconComponent(props) {
    let inlineStyles: any = {};
    const { commonConfigs } = props;
    const { isPreview } = commonConfigs;
    const { data, styles, settings } = props.data;

    if (styles) {
        inlineStyles = genarateComponentLevelStyleConfigurations(styles);
    }

    let filePath = '';
    let boundUrl = '';

    if (data) {
        const { icon } = data;

        if (icon) {
            filePath = isPreview ? icon.filePath : '/icons/' + icon.fileName;
            boundUrl = icon.boundUrl ? icon.boundUrl : '';
        }
    }

    if (filePath.length !== 0) {
        return (
            <Icon {...inlineStyles}>
                {boundUrl != '' && settings && settings.seprateLink && settings.seprateLink.value && (
                    <a href={boundUrl} target="_blank">
                        <object
                            type="image/svg+xml"
                            data={filePath}
                            width={settings.iconSize ? settings.iconSize.value : '24'}
                            height={settings.iconSize ? settings.iconSize.value : '24'}
                            style={{
                                pointerEvents: 'none',
                                color: settings.iconColor ? settings.iconColor.value : '',
                            }}
                        ></object>
                    </a>
                )}
                {boundUrl != '' &&
                    settings &&
                    (settings.seprateLink === undefined ||
                        (settings.seprateLink && !settings.seprateLink.value)) && (
                        <a href={boundUrl}>
                            <object
                                type="image/svg+xml"
                                data={filePath}
                                width={settings.iconSize ? settings.iconSize.value : '24'}
                                height={settings.iconSize ? settings.iconSize.value : '24'}
                                style={{
                                    pointerEvents: 'none',
                                    color: settings.iconColor ? settings.iconColor.value : '',
                                }}
                            ></object>
                        </a>
                    )}
                {boundUrl === '' && (
                    <object
                        type="image/svg+xml"
                        data={filePath}
                        width={settings.iconSize ? settings.iconSize.value : '24'}
                        height={settings.iconSize ? settings.iconSize.value : '24'}
                        style={{
                            pointerEvents: 'none',
                            color: settings.iconColor ? settings.iconColor.value : '',
                        }}
                    ></object>
                )}
            </Icon>
        );
    } else {
        return <></>;
    }
}
