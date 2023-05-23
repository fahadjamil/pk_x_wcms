import DatePickerComponent from './components/DatePickerComponent';
import DropDownComponent from './components/DropDownComponent';
import EmailComponent from './components/EmailComponent';
import GoogleRecaptchaComponent from './components/GoogleRecaptchaComponent';
import LongTextComponent from './components/LongTextComponent';
import MediaComponent from './components/MediaComponent';
import NumberComponent from './components/NumberComponent';
import ResetButtonComponent from './components/ResetButtonComponent';
// import RichTextComponent from './components/RichTextComponent';
import ShortTextComponent from './components/ShortTextComponent';
import SubmitButtonComponent from './components/SubmitButtonComponent';

export const formComponentsMapping = {
    fieldShortText: ShortTextComponent,
    fieldLongText: LongTextComponent,
    number: NumberComponent,
    email: EmailComponent,
    media: MediaComponent,
    richTextEditor: LongTextComponent,
    // richTextEditor: RichTextComponent,
    submit: SubmitButtonComponent,
    reset: ResetButtonComponent,
    date: DatePickerComponent,
    recaptcha: GoogleRecaptchaComponent,
    dropDownList: DropDownComponent,
};

export const formComponentsDataTypeMappings = {
    fieldShortText: 'string',
    fieldLongText: 'string',
    number: 'number',
    email: 'email',
    media: 'string',
    richTextEditor: 'string',
    date: 'date',
};
