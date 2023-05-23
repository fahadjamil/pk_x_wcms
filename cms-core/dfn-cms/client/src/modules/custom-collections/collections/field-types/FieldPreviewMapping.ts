import TextPreviewComponent from '../../../shared/ui-components/preview-components/TextPreviewComponent';
import RichTextPreviewComponent from '../../../shared/ui-components/preview-components/RichTextPreviewComponent';
import MediaPreviewComponent from '../../../shared/ui-components/preview-components/MediaPreviewComponent';
import DatePickerPreviewComponent from '../../../shared/ui-components/preview-components/DatePickerPreviewComponent';
import DropDownListPreviewComponent from '../../../shared/ui-components/preview-components/DropDownListPreviewComponent';

const filedPreviewMapping: { [key: string]: any } = {
    fieldLongText: TextPreviewComponent,
    fieldShortText: TextPreviewComponent,
    number: TextPreviewComponent,
    email: TextPreviewComponent,
    media: MediaPreviewComponent,
    dropDownList: DropDownListPreviewComponent,
    richTextEditor: RichTextPreviewComponent,
    date: DatePickerPreviewComponent,
};

export default filedPreviewMapping;
