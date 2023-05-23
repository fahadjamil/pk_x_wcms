export const StyleConfigMappingModels = {
    fieldStyles: {
        fieldShortText: ['textColor', 'typography', 'textAlignment', 'textShadow', 'customCSS'],
        fieldLongText: ['customCSS'],
        fieldMedia: [],
    },
    _commentLayoutStyles:
        'LayoutTypes can be an array or an object similar to the stylesConfigurations',
    layoutStyles: {
        section: ['background', 'margin', 'padding', 'customCSS'],
        column: ['background', 'margin', 'padding', 'customCSS'],
        innerSection: ['background', 'margin', 'padding', 'customCSS'],
        innerColumn: ['background', 'margin', 'padding', 'customCSS'],
    },
};
