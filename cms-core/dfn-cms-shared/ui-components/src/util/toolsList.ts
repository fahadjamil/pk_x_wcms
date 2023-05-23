import { ParagraphComponent } from '../components/ParagraphComponent';
import { TitleComponent } from '../components/TitleComponent';
import { ImageComponent } from '../components/ImageComponent';
import { TitleParagraphComponent } from '../components/TitleParagraphComponent';
import { MainMenuComponent } from '../components/MainMenuComponent';
import { FooterMenuComponent } from '../components/FooterMenuComponent';
import { BannerComponent } from '../components/BannerComponent';
import { TabUiComponent } from '../components/TabUiComponent';
import { CMSTableComponent } from '../components/Table/CMSTableComponent';
import { PopupBannerComponent } from '../components/PopupBannerComponent';
import CardListComponent from '../components/CardListComponent';
import CardComponent from '../components/CardComponent';
import { LinkListUiComponent } from '../components/LinkListUiComponent';
import { SocialMediaComponent } from '../components/SocialMediaComponent';
import ButtonComponent from '../components/ButtonComponent';
import { ListComponent } from '../components/ListComponent';
import TreeViewComponent from '../components/TreeViewComponent';
import AccordionDataComponent from '../components/AccordionDataComponent';
import DateVersionComponent from '../components/DateVersionComponent';
import { SiteSearchComponent } from '../components/search/SiteSearchComponent';
import { SiteSearchResultsComponent } from '../components/search/SiteSearchResultsComponent';

import ShareOnSocialMediaComponent from '../components/ShareOnSocialMediaComponent';
import TreeViewSearchComponent from '../components/TreeViewSearchComponent';
import SubscriptionButtonComponent from '../components/SubscriptionButtonComponent';
import SubscriptionConfirmationComponent from '../components/SubscriptionConfirmationComponent';

import BKToolsList from './bkToolsList';
import VideoComponent from '../components/VideoComponent';
import { IconComponent } from '../components/IconComponent';
import { FormComponent } from '../components/Form/FormComponent';
import EOPToolsList from './eopToolsList';


const ToolsList = {
    ...BKToolsList,
    ...EOPToolsList,
    titleParagraph: TitleParagraphComponent,
    paragraph: ParagraphComponent,
    title: TitleComponent,
    image: ImageComponent,
    mainMenu: MainMenuComponent,
    footerMenu: FooterMenuComponent,
    banner: BannerComponent,
    tab: TabUiComponent,
    table: CMSTableComponent,
    popupBanner: PopupBannerComponent,
    cardList: CardListComponent,
    card: CardComponent,
    linkList: LinkListUiComponent,
    button: ButtonComponent,
    socialMedia: SocialMediaComponent,
    list: ListComponent,
    treeView: TreeViewComponent,
    accordionView: AccordionDataComponent,
    dateVersion: DateVersionComponent,
    siteSearch: SiteSearchComponent,
    siteSearchResults: SiteSearchResultsComponent,
    socialMediaShare: ShareOnSocialMediaComponent,
    treeSearch: TreeViewSearchComponent,
    productSubscription: SubscriptionButtonComponent,
    subscriptionConfirmation: SubscriptionConfirmationComponent,
    video: VideoComponent,
    icon: IconComponent,
    form: FormComponent,
};

export default ToolsList;
