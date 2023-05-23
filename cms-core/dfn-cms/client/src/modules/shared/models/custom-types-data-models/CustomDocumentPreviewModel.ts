import LanguageModel from "../LanguageModel";
import ValidationModel from "./ValidationModel";

export default interface CustomDocumentPreviewModel {
    dataKey: string;
    fieldType: string;
    initialValue: any;
    language: LanguageModel;
    validations: ValidationModel;
    dropDownListContent: any;
    value: string;
    website: string;
}
