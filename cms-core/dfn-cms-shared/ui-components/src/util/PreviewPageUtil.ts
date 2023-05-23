import styled from 'styled-components';

export const generatePreviewPageStyledComponent = (element: string, isPreviewMode: boolean) => {
    return styled[element]`
        ${(props: any) => {
            if (props?.styleProps?.background?.normal?.classic?.color) {
                return `background-color: ${props.styleProps.background.normal.classic.color};`;
            }
        }}

        ${(props: any) => {
            if (props?.styleProps?.background?.normal?.classic?.image?.filePath) {
                const splitedPath = props.styleProps.background.normal.classic.image.filePath.split('/');
                const imageName = splitedPath[splitedPath.length - 1];

                const url = isPreviewMode
                    ? props.styleProps.background.normal.classic.image.filePath
                    : '/images/' + imageName;

                return `background-image: url(${url});`;
            }
        }}

        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;

        ${(props: any) => {
            if (props?.styleProps?.margin?.left) {
                return `margin-left: ${props.styleProps.margin.left}px;`;
            }
        }}

        ${(props: any) => {
            if (props?.styleProps?.margin?.right) {
                return `margin-right: ${props.styleProps.margin.right}px;`;
            }
        }}

        ${(props: any) => {
            if (props?.styleProps?.margin?.top) {
                return `margin-top: ${props.styleProps.margin.top}px;`;
            }
        }}

        ${(props: any) => {
            if (props?.styleProps?.margin?.bottom) {
                return `margin-bottom: ${props.styleProps.margin.bottom}px;`;
            }
        }}

        ${(props: any) => {
            if (props?.styleProps?.padding?.left) {
                return `padding-left: ${props.styleProps.padding.left}px;`;
            }
        }}

        ${(props: any) => {
            if (props?.styleProps?.padding?.right) {
                return `padding-right: ${props.styleProps.padding.right}px;`;
            }
        }}

        ${(props: any) => {
            if (props?.styleProps?.padding?.top) {
                return `padding-top: ${props.styleProps.padding.top}px;`;
            }
        }}

        ${(props: any) => {
            if (props?.styleProps?.padding?.bottom) {
                return `padding-bottom: ${props.styleProps.padding.bottom}px;`;
            }
        }}

        ${(props: any) => {
            if (props?.styleProps?.customCSS) {
                return props.styleProps.customCSS;
            }
        }}
    `;
};
