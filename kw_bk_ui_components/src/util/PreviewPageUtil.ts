import styled from 'styled-components';

export const generatePreviewPageStyledComponent = (element: string) => {
    return styled[element]`
        background: ${(props: any) => {
            return props.background ? props.background.normal.classic.color : '';
        }};

        background-image: url(${(props: any) => {
            return props.background ? props.background.normal.classic.image.filePath : '';
        }});

        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;

        margin-left: ${(props: any) => {
            return props.margin ? props.margin.left + 'px' : '';
        }};

        margin-right: ${(props: any) => {
            return props.margin ? props.margin.right + 'px' : '';
        }};

        margin-top: ${(props: any) => {
            return props.margin ? props.margin.top + 'px' : '';
        }};

        margin-bottom: ${(props: any) => {
            return props.margin ? props.margin.bottom + 'px' : '';
        }};

        padding-left: ${(props: any) => {
            return props.padding ? props.padding.left + 'px' : '';
        }};

        padding-right: ${(props: any) => {
            return props.padding ? props.padding.right + 'px' : '';
        }};

        padding-top: ${(props: any) => {
            return props.padding ? props.padding.top + 'px' : '';
        }};

        padding-bottom: ${(props: any) => {
            return props.padding ? props.padding.bottom + 'px' : '';
        }};
        ${(props: any) => {
            return props.customCSS ? props.customCSS : '';
        }}
    `;
};
