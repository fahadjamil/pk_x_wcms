import TextShadowModel from "../styles-components/models/TextShadowModel";
import TypographyModel from "../styles-components/models/TypographyModel";

export default interface InitialStyleModel {
    customCSS: string;
    cssClass: string;
    textAlignment: string;
    textColor: string;
    textShadow: TextShadowModel;
    typography: TypographyModel;
}