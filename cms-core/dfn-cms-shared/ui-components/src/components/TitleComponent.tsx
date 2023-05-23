import React from 'react';
import styled from 'styled-components';
import { genarateComponentLevelStyleConfigurations } from '../util/UiComponentsUtil';

const Title = styled.h1`
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

export const TitleComponent = (params) => {
    let title = '';
    let inlineStyles: any = {};

    const { data, styles } = params.data;

    if (styles) {
        inlineStyles = genarateComponentLevelStyleConfigurations(styles);
    }

    if (data !== undefined) {
        title = data.title;
    }

    return (
        <div>
            <Title
                {...inlineStyles}
                className={inlineStyles?.cssClass ? inlineStyles.cssClass : ''}
            >
                {title}
            </Title>
        </div>
    );
};
