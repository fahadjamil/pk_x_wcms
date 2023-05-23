import SubMenuModel from './SubMenuModel';

export default interface MainMenuModel {
    topMenuText: string;
    topMenuID?: string;
    subMenus: SubMenuModel[];
}
