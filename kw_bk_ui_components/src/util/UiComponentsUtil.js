export function genarateComponentLevelStyleConfigurations(styles) {
    let inlineStyles = {};
    const higherOrderProperties = Object.keys(styles);

    if (higherOrderProperties.length !== 0) {
        higherOrderProperties.forEach((higherOrderProperty, higherOrderPropertyIndex) => {
            const higherOrderStyles = styles[higherOrderProperty];
            const higherOrderStylesProperties = Object.keys(higherOrderStyles);

            // If custom CSS styles exists for the component
            if (higherOrderStylesProperties.includes('customCSS')) {
                const customcssStyles = higherOrderStyles['customCSS'];
                // Remove blank lines and split the string from closing bracket
                const customcssStylesArray = customcssStyles.replace(/\r?\n|\r/g, '').split('}');
                let stylesString = '';

                customcssStylesArray.forEach((customcssStyle, customcssStyleIndex) => {
                    // Remove opening bracket from string
                    let beautified = customcssStyle.replace(/^{+/i, '');
                    stylesString += beautified;
                });
                inlineStyles['customCSS'] = stylesString;
            }

            higherOrderStylesProperties.forEach(
                (higherOrderStylesProperty, higherOrderStylesPropertyIndex) => {
                    if (higherOrderStylesProperty !== 'customCSS') {
                        const styleProperty = higherOrderStyles[higherOrderStylesProperty];

                        if (typeof styleProperty === 'string') {
                            inlineStyles[higherOrderStylesProperty] = styleProperty;
                        } else {
                            const subStyleProperties = Object.keys(styleProperty);

                            subStyleProperties.forEach(
                                (subStyleProperty, subStylePropertyIndex) => {
                                    if (styleProperty[subStyleProperty] != '') {
                                        inlineStyles[subStyleProperty] =
                                            styleProperty[subStyleProperty];
                                    }
                                }
                            );
                        }
                    }
                }
            );
        });
    }

    return inlineStyles;
}
