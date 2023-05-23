export default interface SubMenuModel {
    menuText: string;
    menuID?: string;
    dataObject: any;
    notifiIcon: any;
    subMenus?: SubMenuModel[];
}
