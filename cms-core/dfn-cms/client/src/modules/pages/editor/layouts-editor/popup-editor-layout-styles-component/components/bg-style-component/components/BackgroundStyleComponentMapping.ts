import BgColorComponent from './bg-color-component';
import BgImageComponent from './bg-image-component';

const BackgroundStyleComponentMapping: { [key: string]: any } = {
    color: BgColorComponent,
    image: BgImageComponent,
};

export default BackgroundStyleComponentMapping;
