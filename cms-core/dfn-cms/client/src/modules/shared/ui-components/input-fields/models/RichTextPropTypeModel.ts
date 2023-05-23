export default interface RichTextPropTypeModel {
    id: string;
    label: string;
    data: string;
    config?: any;
    disabled?: boolean;
    onInit?: any;
    onBlur?: any;
    onFocus?: any;
    onError?: any;
    handleValueChange: any;
}
