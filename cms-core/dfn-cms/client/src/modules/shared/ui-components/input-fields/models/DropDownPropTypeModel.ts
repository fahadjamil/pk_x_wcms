export default interface DropDownPropTypeModel {
    id: string;
    name: string;
    value: any;
    isRequired: boolean;
    size?: number;
    isMultipleSelect?: boolean;
    type: string;
    isAutofocus?: boolean;
    dropDownListContent: any;
    onValueChange: any;
}