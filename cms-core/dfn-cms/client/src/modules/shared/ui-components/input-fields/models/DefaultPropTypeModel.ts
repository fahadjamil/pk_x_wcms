export default interface DefaultPropTypeModel {
    id: string;
    label?: string;
    name: string;
    placeholder?: string;
    defaultValue?: any;
    isRequired?: boolean;
    minLength?: number;
    maxLength?: number;
    isAutofocus?: boolean;
    checked?: boolean;
    handleValueChange?: any;
}
