export const StyleConfigMappingModels = {
    fieldStyles: {
        fieldShortText: [
            'textColor',
            'typography',
            'textAlignment',
            'textShadow',
            'cssClass',
            'customCSS',
        ],
        fieldLongText: ['cssClass', 'customCSS'],
        fieldMedia: ['cssClass', 'customCSS'],
        fieldCardList: ['cssClass', 'customCSS'],
        fieldVideo: ['cssClass', 'customCSS'],
        fieldTab: ['cssClass', 'customCSS'],
        fieldLinkList: ['cssClass', 'customCSS'],
        fieldList: ['cssClass', 'customCSS'],
        fieldIcon: ['textAlignment', 'cssClass', 'customCSS'],
    },
    _commentLayoutStyles:
        'LayoutTypes can be an array or an object similar to the stylesConfigurations',
    layoutStyles: {
        section: ['background', 'margin', 'padding', 'cssClass', 'customCSS'],
        column: ['background', 'margin', 'padding', 'cssClass', 'customCSS'],
        innerSection: ['background', 'margin', 'padding', 'cssClass', 'customCSS'],
        innerColumn: ['background', 'margin', 'padding', 'cssClass', 'customCSS'],
    },

    componentStyles: {
        position: ['contentPosition', 'margin', 'padding'],
        //TODO: This is a button component specific editor style component. Need to move this into component configuration and handle necessary logics
        buttonComponentStyles: ['cssClass', 'customCSS'],
    },
};
