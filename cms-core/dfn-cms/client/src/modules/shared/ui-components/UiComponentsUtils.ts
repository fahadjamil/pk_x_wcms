export const getComponentID = (label: string, key: string, componentKey: string) => {
    return label + key + componentKey;
};

export const getComponentLabel = (key: string, suffix: string) => {
    const label = key.replace(/(\w)(\w*)/g, function (originalText, firstLetter, textSegment) {
        return firstLetter.toUpperCase() + textSegment.toLowerCase();
    });

    return `${label.split('_').join(' ')} - ${suffix}`;
};
