import TypographyComponent from './editor-typography-component';
import TextShadowComponent from './editor-text-shadow-component';
import TextColourComponent from './editor-text-color-component';
import TextAlignmentComponent from './editor-text-alignment-component';
import EditorCustomCssComponent from './editor-custom-css-component';
import EditorCssClassComponent from './editor-css-class-component';
import EditorContentPositionComponent from './editor-content-position-component';
import EditorMarginComponent from './editor-margin-component';
import EditorPaddingComponent from './editor-padding-component';

const filedStyleComponentMapping: { [key: string]: any } = {
    typography: TypographyComponent,
    textShadow: TextShadowComponent,
    textColor: TextColourComponent,
    textAlignment: TextAlignmentComponent,
    customCSS: EditorCustomCssComponent,
    cssClass: EditorCssClassComponent,
    contentPosition: EditorContentPositionComponent,
    margin: EditorMarginComponent,
    padding: EditorPaddingComponent,
};

export default filedStyleComponentMapping;
