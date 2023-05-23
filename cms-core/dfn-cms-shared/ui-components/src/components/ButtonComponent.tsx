import React from 'react';
import styled from 'styled-components';
import { genarateComponentLevelStyleConfigurations } from '../util/UiComponentsUtil';

const ButtonWrapper = styled.div``;

const ButtonLink = styled.a.attrs((props: any) => {
    const { target, href, role, rel } = props;

    return {
        href: href,
        target: target,
        rel: rel,
        role: role,
    };
})`
    ${(props: any) => {
        return props.customCSS ? props.customCSS : '';
    }}
`;

const ButtonContentWrapper = styled.span``;
const ButtonIcon = styled.span``;

const ButtonText = styled.span`
    ${(props: any) => {
        return `color: ${
            props.textColor ? props.textColor : props?.theme?.properties?.h1[0]?.value
        };`;
    }}

    ${(props: any) => {
        return `font-family: ${
            props.selectedFontFamily
                ? props.selectedFontFamily
                : props?.theme?.properties?.h1[0]?.value
        }};`;
    }}

    ${(props: any) => {
        return `font-size: ${
            props.selectedFontSize ? props.selectedFontSize : props?.theme?.properties?.h1[1]?.value
        }};`;
    }}

    ${(props: any) => {
        return `font-style: ${
            props.selectedFontStyle
                ? props.selectedFontStyle
                : props?.theme?.properties?.h1[0]?.value
        }};`;
    }}

    ${(props: any) => {
        return `text-transform: ${
            props.selectedTextTransform
                ? props.selectedTextTransform
                : props?.theme?.properties?.h1[0]?.value
        }};`;
    }}

    ${(props: any) => {
        return `text-decoration: ${
            props.selectedTextDecoration
                ? props.selectedTextDecoration
                : props?.theme?.properties?.h1[0]?.value
        }};`;
    }}

    ${(props: any) => {
        return `text-align: ${
            props.textAlignment ? props.textAlignment : props?.theme?.properties?.h1[0]?.value
        };`;
    }}

    ${(props: any) => {
        return `text-shadow: ${
            props.selectedTextShadow
                ? props.selectedTextShadow
                : props?.theme?.properties?.h1[0]?.value
        }};`;
    }}

    ${(props: any) => {
        return props.customCSS ? props.customCSS : '';
    }}
`;

function ButtonComponent(props) {
    const { commonConfigs, componentIndex, data, dbName, editMode, lang } = props;
    const isDataPresent: boolean = data && Object.keys(data).length > 0;
    const btnSizes = {
        small: 'btn-sm',
        medium: 'btn-md',
        large: 'btn-lg',
    };

    if (isDataPresent) {
        const { settings, styles } = data;
        const cmpData = data.data;

        const {
            addNoFollow = undefined,
            link = undefined,
            openInNewWindow = undefined,
            text = undefined,
        } = { ...cmpData };

        const isLinkNotEmpty = link && link.length > 0;

        const { buttonSize = undefined, buttonType = undefined, isBlockLevel = undefined } = {
            ...settings,
        };

        // const linkClass = buttonType
        //     ? buttonType.value === 'link'
        //         ? ' btn-link'
        //         : ' btn-light'
        //     : ' btn-light';

        const sizeClass = buttonSize ? btnSizes[buttonSize.value] : '';
        const blockLevelClass = isBlockLevel ? (isBlockLevel.value ? ' btn-block' : '') : '';
        const setTarget = isLinkNotEmpty ? (openInNewWindow ? '_blank' : '_self') : undefined;
        const setHref = isLinkNotEmpty ? link : undefined;
        const setRole = isLinkNotEmpty ? undefined : 'button';
        const setNoFollow = isLinkNotEmpty ? (addNoFollow ? 'nofollow' : undefined) : undefined;

        const attrs = {
            target: setTarget,
            href: setHref,
            role: setRole,
            rel: setNoFollow,
        };

        let buttonComponentStyles: any = styles
            ? styles.buttonComponentStyles
                ? styles.buttonComponentStyles
                : {}
            : {};
        let buttonTextStyles: any = styles ? (styles.text ? styles.text : {}) : {};

        let buttonComponentInlineStyles = genarateComponentLevelStyleConfigurations({
            cmpStyles: buttonComponentStyles,
        });
        let buttonTextInlineStyles = genarateComponentLevelStyleConfigurations({
            txtStyles: buttonTextStyles,
        });

        return (
            <ButtonWrapper>
                <ButtonLink
                    className={`${sizeClass}${blockLevelClass} ${
                        buttonComponentStyles?.cssClass ? buttonComponentStyles.cssClass : ''
                    }`}
                    {...attrs}
                    {...buttonComponentInlineStyles}
                >
                    <ButtonContentWrapper>
                        {/* <ButtonIcon></ButtonIcon> */}
                        <ButtonText
                            {...buttonTextInlineStyles}
                            className={buttonTextStyles?.cssClass ? buttonTextStyles.cssClass : ''}
                        >
                            {text}
                        </ButtonText>
                    </ButtonContentWrapper>
                </ButtonLink>
            </ButtonWrapper>
        );
    }

    return <></>;
}

export default ButtonComponent;
