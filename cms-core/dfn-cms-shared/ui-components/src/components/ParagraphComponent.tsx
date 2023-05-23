import React from 'react';
import styled from 'styled-components';
import { genarateComponentLevelStyleConfigurations } from '../util/UiComponentsUtil';

// CK Editor generate "P", "Figure" tags
const RichText = styled.div`
    > figure.table {
        overflow-x: auto !important;
    }

    > figure.image img {
        max-width: 100% !important;
        height: auto !important;
    }

    ${(props: any) => {
        return `color: ${
            props.textColor ? props.textColor : props?.theme?.properties?.h2[0]?.value
        };`;
    }}

    ${(props: any) => {
        return `font-family: ${
            props.selectedFontFamily
                ? props.selectedFontFamily
                : props?.theme?.properties?.h2[0]?.value
        }};`;
    }}
    
    ${(props: any) => {
        return `font-size: ${
            props.selectedFontSize ? props.selectedFontSize : props?.theme?.properties?.h2[1]?.value
        }};`;
    }}
    
    ${(props: any) => {
        return `font-style: ${
            props.selectedFontStyle
                ? props.selectedFontStyle
                : props?.theme?.properties?.h2[0]?.value
        }};`;
    }}
    
    ${(props: any) => {
        return `text-transform: ${
            props.selectedTextTransform
                ? props.selectedTextTransform
                : props?.theme?.properties?.h2[0]?.value
        }};`;
    }}
    
    ${(props: any) => {
        return `text-decoration: ${
            props.selectedTextDecoration
                ? props.selectedTextDecoration
                : props?.theme?.properties?.h2[0]?.value
        }};`;
    }}
    
    ${(props: any) => {
        return `text-align: ${
            props.textAlignment ? props.textAlignment : props?.theme?.properties?.h2[0]?.value
        };`;
    }}
    
    ${(props: any) => {
        return `text-shadow: ${
            props.selectedTextShadow
                ? props.selectedTextShadow
                : props?.theme?.properties?.h2[0]?.value
        }};`;
    }}

    ${(props: any) => {
        return props.customCSS ? props.customCSS : '';
    }}
`;

export const ParagraphComponent = (params) => {
    let paragraph: any = {};
    let inlineStyles: any = {};
    // const { commonConfigs, dbName } = params;
    // const { isEditMode, isPreview } = commonConfigs;
    const { data, styles } = params.data;

    if (styles) {
        inlineStyles = genarateComponentLevelStyleConfigurations(styles);
    }

    if (data !== undefined) {
        paragraph = {
            __html: data.paragraph,
        };
        // if (isPreview) {
        //     console.log('------------PREVIEW TRUE-------------');
        //     paragraph = {
        //         __html: data.paragraph,
        //     };
        // } else {
        //     console.log('------------PREVIEW FALSE-------------');
        //     if (data?.paragraph) {
        //         console.log('------------DATA PARAGRAPH EXISTS-------------');
        //         const str = data.paragraph;
        //         const updatedStr = str.replace(`/api/page-data/getImage/${dbName}/`, '/images/');

        //         paragraph = {
        //             __html: updatedStr,
        //         };
        //     }
        // }
    }

    return (
        <RichText
            {...inlineStyles}
            dangerouslySetInnerHTML={paragraph}
            className={inlineStyles?.cssClass ? inlineStyles.cssClass : ''}
        ></RichText>
    );
};
