import EmailContainerComponent from '../../../shared/ui-components/input-fields/email-component';
import InternalMediaContainerComponent from '../../../shared/ui-components/input-fields/internal-media-component';
import LongTextContainerComponent from '../../../shared/ui-components/input-fields/long-text-component';
import NumberContainerComponent from '../../../shared/ui-components/input-fields/number-component';
import ShortTextContainerComponent from '../../../shared/ui-components/input-fields/short-text-component';
import { DropDownContainerCustCollection } from '../../../shared/ui-components/input-fields/drop-down-component';
import RichTextContainerComponent from '../../../shared/ui-components/input-fields/rich-text-component';
import DateContainerComponent from './DateContainerComponent';

const filedComponentMapping: { [key: string]: any } = {
    fieldLongText: LongTextContainerComponent,
    fieldShortText: ShortTextContainerComponent,
    number: NumberContainerComponent,
    email: EmailContainerComponent,
    media: InternalMediaContainerComponent,
    dropDownList: DropDownContainerCustCollection,
    richTextEditor: RichTextContainerComponent,
    date: DateContainerComponent,
};

export default filedComponentMapping;
