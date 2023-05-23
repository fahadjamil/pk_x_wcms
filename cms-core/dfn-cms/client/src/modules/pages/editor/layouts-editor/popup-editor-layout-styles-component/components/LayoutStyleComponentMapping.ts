import BgStyleComponent from './bg-style-component';
import MarginComponent from './margin-component';
import CustomCSSComponent from './custom-css-component';
import PaddingComponent from './padding-component';
import CssClassComponent from './css-class-component';

const filedStyleComponentMapping: { [key: string]: any } = {
    background: BgStyleComponent,
    margin: MarginComponent,
    padding: PaddingComponent,
    customCSS: CustomCSSComponent,
    cssClass: CssClassComponent,
};

export default filedStyleComponentMapping;
