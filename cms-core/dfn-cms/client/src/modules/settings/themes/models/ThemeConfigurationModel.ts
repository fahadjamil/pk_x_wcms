export default interface ThemeConfigurationModel {
    _id: string;
    displayName: string;
    name: string;
    properties: Properties;
    generalProperties: Generalproperties;
    colors: Colors;
    type: string;
    sectionName: string;
}

interface Properties {
    h1: PropertyType[];
    h2: PropertyType[];
    h3: PropertyType[];
}

interface Generalproperties {
    body: PropertyType[];
}

interface Colors {
    primary: PropertyType[];
}

interface PropertyType {
    value: string;
    porpType: string;
    propertyName: string;
}