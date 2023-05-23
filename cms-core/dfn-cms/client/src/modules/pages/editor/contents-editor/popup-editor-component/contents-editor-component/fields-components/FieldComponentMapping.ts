import RichTextContainerComponent from '../../../../../../shared/ui-components/input-fields/rich-text-component';
import ShortTextContainerComponent from '../../../../../../shared/ui-components/input-fields/short-text-component';
import ToggleSwitchContainerComponent from '../../../../../../shared/ui-components/input-fields/toggle-switch-component/ToggleSwitchContainerComponent';
import EditorDocumentAccordionComponent from './editor-accordion-component';
import EditorCardListComponent from './editor-card-list-component';
import EditorLinkListComponent from './editor-link-list-component';
import EditorListComponent from './editor-list-component';
import EditorMediaComponent from './editor-media-component';
import EditorSocialMediaShareComponent from './editor-social-media-share-component';
import EditorTabComponent from './editor-tab-component';
import EditorTableComponent from './editor-table-component';
import EditorVideoComponent from './editor-video-component';
import EditorIconComponent from './editor-icon-component';

const filedComponentMapping: { [key: string]: any } = {
    fieldLongText: RichTextContainerComponent,
    fieldShortText: ShortTextContainerComponent,
    fieldMedia: EditorMediaComponent,
    fieldTable: EditorTableComponent,
    fieldTab: EditorTabComponent,
    fieldCardList: EditorCardListComponent,
    fieldLinkList: EditorLinkListComponent,
    fieldToggleSwitch: ToggleSwitchContainerComponent,
    // fieldSocialMediaLink: EditorLinkListComponent,
    fieldList: EditorListComponent,
    fieldDocumentAccordion: EditorDocumentAccordionComponent,
    fieldSocialMediaShare: EditorSocialMediaShareComponent,
    fieldVideo: EditorVideoComponent,
    fieldIcon: EditorIconComponent,
};

export default filedComponentMapping;
