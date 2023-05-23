import React from 'react';
import LanguageModel from '../../shared/models/LanguageModel';
import filedPreviewMapping from './field-types/FieldPreviewMapping'

interface IcollType {
    _id: '';
    fieldsList: {};
    customeCollectionName: '';
    collectionTypes: '';
    menuName: '';
}

interface IfldTyp {
    default: '';
    max: '';
    min: '';
    regex: '';
    required: boolean;
    type: '';
    ext: '';
    islocalized: boolean;
    itemList: any;
}
interface IgetFields {
    dataKey: string;
    fieldType: string;
    initialValue: any;
    language: any;
    validations: any;
    dropDownListContent: any;
    value: string;
}

interface DocumentViewModel {
    lang: LanguageModel[];
    fieldObj: any;
    collectionTypes: any;
    website: string;
}

function DocumentView(props: DocumentViewModel) {
    const websiteLanguages = props.lang;
    let collectionTypeObj: IcollType = props.collectionTypes;


    const getFields = (value: IgetFields) => {
        const PreviewComponent = filedPreviewMapping[value.fieldType];
        let keyId =
            String(value.dataKey) + String(value.fieldType) + String(value.language.langKey);
        return (
            <div key={keyId}>
                <PreviewComponent {...value} website={props.website}/>
            </div>
        );
    };

    const showLanguageWiseContent = () => {
        //collectionTypeObj -Schema object
        return Object.entries(collectionTypeObj.fieldsList).map(([fieldNm, value]) => {
            let fldTyplcl: IfldTyp;
            fldTyplcl = value as IfldTyp;
            let fieldData = props.fieldObj[websiteLanguages[0].langKey]
                ? props.fieldObj[websiteLanguages[0].langKey][fieldNm]
                : '';

            if (!fldTyplcl.islocalized) {
                return getFields({
                    dataKey: fieldNm,
                    fieldType: fldTyplcl?.type,
                    language: websiteLanguages[0],
                    initialValue: {
                        [websiteLanguages[0].langKey]: fieldData ? fieldData : '',
                    },
                    validations: {
                        required: fldTyplcl?.required ? fldTyplcl.required : false,
                        minLen: fldTyplcl?.min ? Number(fldTyplcl.min) : 0,
                        maxLen: fldTyplcl?.max ? Number(fldTyplcl.max) : 524288,
                        regex: fldTyplcl?.regex,
                        ext: fldTyplcl?.ext,
                    },
                    dropDownListContent: fldTyplcl?.itemList,
                    value: fieldData,
                });
            } else {
                return websiteLanguages.map((lang) => {
                    fieldData = props.fieldObj[lang.langKey]
                        ? props.fieldObj[lang.langKey][fieldNm]
                        : undefined;

                    return getFields({
                        dataKey: fieldNm,
                        fieldType: fldTyplcl?.type,
                        language: lang,
                        initialValue: {
                            [lang.langKey]: fieldData ? fieldData : '',
                        },
                        validations: {
                            required: fldTyplcl?.required ? fldTyplcl.required : false,
                            minLen: fldTyplcl?.min ? Number(fldTyplcl.min) : 0,
                            maxLen: fldTyplcl?.max ? Number(fldTyplcl.max) : 524288,
                            regex: fldTyplcl?.regex,
                            ext: fldTyplcl?.ext,
                        },
                        dropDownListContent: fldTyplcl?.itemList,
                        value: fieldData,
                    });
                });
            }
        });
    };

    return collectionTypeObj && <>{showLanguageWiseContent()}</>;
}

export default DocumentView;
