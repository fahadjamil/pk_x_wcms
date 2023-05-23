export const ComponentsConfiguration = {
    components: [
        {
            compId: 'paragraph',
            parentId: '',
            displayNameTag: 'Paragraph',
            displayImage: 'paragraphIcon',
            compFields: [
                {
                    fieldType: 'fieldLongText',
                    dataKey: 'paragraph',
                    isLanguageWiseContentPresent: true,
                    validations: {
                        required: true,
                        minLen: 0,
                        maxLen: 1000,
                    },
                },
            ],
        },

        {
            compId: 'title',
            parentId: '',
            displayNameTag: 'Title',
            displayImage: 'titleIcon',
            compFields: [
                {
                    fieldType: 'fieldShortText',
                    dataKey: 'title',
                    isLanguageWiseContentPresent: true,
                    validations: {
                        required: true,
                        minLen: 0,
                        maxLen: 100,
                    },
                },
            ],
        },
        {
            compId: 'image',
            parentId: '',
            displayNameTag: 'Image',
            displayImage: 'imageIcon',
            settings: [
                {
                    displayTitle: 'Settings Input Field',
                    settingType: 'textInput',
                    dataKey: 'inputVal',
                },
                {
                    displayTitle: 'Open link in new window',
                    settingType: 'toggleSwitch',
                    dataKey: 'seprateLink',
                    settingData: { defaultValue: false },
                },
            ],
            compFields: [
                {
                    fieldType: 'fieldMedia',
                    dataKey: 'image',
                    isLanguageWiseContentPresent: true,
                    validations: {
                        required: true,
                        mediaFormat: '',
                    },
                },
            ],
        },
        {
            compId: 'table',
            parentId: '',
            displayNameTag: 'Table',
            displayImage: 'tableIcon',
            settings: [
                {
                    displayTitle: 'Custom Collections',
                    settingType: 'dropDown',
                    dataKey: 'collection',
                    externalDataSource: {
                        request: { url: '/api/custom-collections', params: {} },
                        externalParams: {
                            dataSourceUrl: '/api/cms/getCollectionData',
                            BaseUrl: '/api/',
                        },
                        uniqueKeyMapping: '_id',
                        displayNameMapping: 'menuName',
                        valueMapping: '',
                    },
                },
            ],
            compFields: [
                {
                    fieldType: 'fieldTable',
                    dataKey: 'table',
                    isLanguageWiseContentPresent: false,
                    validations: {
                        required: true,
                        minLen: 0,
                        maxLen: 100,
                    },
                },
            ],
        },
        {
            compId: 'banner',
            parentId: '',
            displayNameTag: 'Banner',
            displayImage: 'mediaCarouselIcon',
            styles: ['position'],
            settings: [
                {
                    displayTitle: 'Banner List',
                    settingType: 'dropDown',
                    dataKey: 'banner',
                    externalDataSource: {
                        request: { url: '/api/banners', params: {} },
                        externalParams: {},
                        uniqueKeyMapping: '_id',
                        displayNameMapping: 'title',
                        valueMapping: '_id',
                    },
                },
                {
                    displayTitle: 'Banner interval (Seconds)',
                    settingType: 'numberInput',
                    dataKey: 'interval',
                    settingData: { maxValue: 10, minValue: 1, defaultValue: 5 },
                },
            ],
            compFields: [],
        },
        {
            compId: 'tab',
            parentId: '',
            displayNameTag: 'Tab',
            displayImage: 'tabIcon',
            compFields: [
                {
                    fieldType: 'fieldTab',
                    dataKey: 'tab',
                    isLanguageWiseContentPresent: true,
                    validations: {
                        required: true,
                        minLen: 0,
                        maxLen: 100,
                    },
                },
            ],
            settings: [
                {
                    displayTitle: 'Tab Settings',
                    settingType: 'dropDown',
                    dataKey: 'tab',
                    settingData: [
                        {
                            uniqueKey: 'horizontal',
                            displayValue: 'Horizontal Tab',
                            value: 'horizontal',
                        },
                        {
                            uniqueKey: 'vertical',
                            displayValue: 'Vertical Tab',
                            value: 'vertical',
                        },
                    ],
                },
            ],
        },
        {
            compId: 'linkList',
            parentId: '',
            displayNameTag: 'Link List',
            displayImage: 'listIcon',
            compFields: [
                {
                    fieldType: 'fieldLinkList',
                    dataKey: 'linkList',
                    isLanguageWiseContentPresent: true,
                    validations: {
                        required: true,
                        minLen: 0,
                        maxLen: 100,
                    },
                },
            ],

            settings: [
                {
                    displayTitle: 'Link List Settings',
                    settingType: 'dropDown',
                    dataKey: 'linkList',
                    settingData: [
                        {
                            uniqueKey: 'horizontal',
                            displayValue: 'Horizontal Linklist',
                            value: 'horizontal',
                        },
                        {
                            uniqueKey: 'vertical',
                            displayValue: 'Vertical Linklist',
                            value: 'vertical',
                        },
                    ],
                },
            ],
        },

        {
            compId: 'popupBanner',
            displayNameTag: 'Popup Banner',
            displayImage: 'slidesIcon',
            settings: [
                {
                    displayTitle: 'Banner List',
                    settingType: 'dropDown',
                    dataKey: 'banner',
                    externalDataSource: {
                        request: { url: '/api/banners', params: {} },
                        externalParams: {},
                        uniqueKeyMapping: '_id',
                        displayNameMapping: 'title',
                        valueMapping: '_id',
                    },
                },
                {
                    displayTitle: 'Banner interval (Seconds)',
                    settingType: 'numberInput',
                    dataKey: 'interval',
                    settingData: { maxValue: 10, minValue: 1, defaultValue: 5 },
                },
                {
                    displayTitle: 'Popup Display Options',
                    settingType: 'dropDown',
                    dataKey: 'displayPopup',
                    settingData: [
                        {
                            uniqueKey: 'showAlways',
                            displayValue: 'Show always',
                            value: 'showAlways',
                        },
                        {
                            uniqueKey: 'showOneTime',
                            displayValue: 'Show One Time',
                            value: 'showOneTime',
                        },
                    ],
                },
            ],
            compFields: [],
        },
        {
            compId: 'countDown',
            parentId: '',
            displayNameTag: 'Countdown',
            displayImage: 'countDownIcon',
            compFields: [],
        },
        {
            compId: 'mainMenu',
            parentId: '',
            displayNameTag: 'Main Menu',
            displayImage: 'mainMenuIcon',
            compFields: [],
            settings: [
                {
                    displayTitle: 'Logo',
                    settingType: 'imageGallery',
                    dataKey: 'logo',
                },
            ],
        },
        {
            compId: 'footerMenu',
            parentId: '',
            displayNameTag: 'FooterMenu',
            displayImage: 'footerMenuIcon',
            compFields: [],
        },
        {
            compId: 'cardList',
            parentId: '',
            displayNameTag: 'Card List',
            displayImage: 'cardListIcon',
            settings: [
                {
                    displayTitle: 'Custom Collections',
                    settingType: 'dropDown',
                    dataKey: 'collection',
                    externalDataSource: {
                        request: { url: '/api/custom-collections', params: {} },
                        externalParams: {
                            dataSourceUrl: '/api/cms/getCollectionData',
                            BaseUrl: '/api/',
                        },
                        uniqueKeyMapping: '_id',
                        displayNameMapping: 'menuName',
                        valueMapping: '',
                    },
                },
                {
                    displayTitle: 'Records Limit',
                    settingType: 'numberInput',
                    dataKey: 'recordsLimit',
                    settingData: { maxValue: 10, minValue: 1, defaultValue: 6 },
                },
                {
                    displayTitle: 'Cards Per Row',
                    settingType: 'numberInput',
                    dataKey: 'cardsPerRow',
                    settingData: { maxValue: 6, minValue: 1, defaultValue: 3 },
                },
                {
                    displayTitle: 'Records Order',
                    settingType: 'dropDown',
                    dataKey: 'recordsOrder',
                    settingData: [
                        {
                            uniqueKey: 'asc',
                            displayValue: 'Ascending Order',
                            value: 'asc',
                        },
                        {
                            uniqueKey: 'desc',
                            displayValue: 'Descending Order',
                            value: 'desc',
                        },
                    ],
                },
                {
                    displayTitle: 'Enable View More link',
                    settingType: 'toggleSwitch',
                    dataKey: 'viewMoreLink',
                    settingData: { defaultValue: false },
                },
            ],
            compFields: [
                {
                    fieldType: 'fieldCardList',
                    dataKey: 'cardList',
                    isLanguageWiseContentPresent: false,
                    validations: {
                        required: true,
                        minLen: 0,
                        maxLen: 100,
                    },
                },
            ],
        },
        {
            compId: 'card',
            parentId: '',
            displayNameTag: 'Card',
            displayImage: 'cardIcon',
            compFields: [],
        },
        {
            compId: 'button',
            parentId: '',
            displayNameTag: 'Button',
            displayImage: 'buttonIcon',
            styles: ['buttonComponentStyles'],
            settings: [
                {
                    displayTitle: 'Button Type',
                    settingType: 'dropDown',
                    dataKey: 'buttonType',
                    settingData: [
                        {
                            uniqueKey: 'link',
                            displayValue: 'Default Link',
                            value: 'link',
                        },
                        {
                            uniqueKey: 'button',
                            displayValue: 'Default Button',
                            value: 'button',
                        },
                    ],
                },
                {
                    displayTitle: 'Button Size',
                    settingType: 'dropDown',
                    dataKey: 'buttonSize',
                    settingData: [
                        {
                            uniqueKey: 'small',
                            displayValue: 'Small Button',
                            value: 'small',
                        },
                        {
                            uniqueKey: 'medium',
                            displayValue: 'Medium Button',
                            value: 'medium',
                        },
                        {
                            uniqueKey: 'large',
                            displayValue: 'Large Button',
                            value: 'large',
                        },
                    ],
                },
                {
                    displayTitle: 'Enable Block Level',
                    settingType: 'toggleSwitch',
                    dataKey: 'isBlockLevel',
                    settingData: { defaultValue: false },
                },
            ],
            compFields: [
                {
                    fieldType: 'fieldShortText',
                    dataKey: 'text',
                    isLanguageWiseContentPresent: true,
                    validations: {
                        required: true,
                        minLen: 0,
                        maxLen: 100,
                    },
                    style: [],
                },
                {
                    fieldType: 'fieldShortText',
                    dataKey: 'link',
                    isLanguageWiseContentPresent: true,
                    validations: {
                        required: false,
                        minLen: 0,
                        maxLen: 100,
                    },
                    style: [],
                },
                {
                    fieldType: 'fieldToggleSwitch',
                    dataKey: 'openInNewWindow',
                    isLanguageWiseContentPresent: false,
                    validations: {
                        required: false,
                    },
                    style: [],
                },
                {
                    fieldType: 'fieldToggleSwitch',
                    dataKey: 'addNoFollow',
                    isLanguageWiseContentPresent: false,
                    validations: {
                        required: false,
                    },
                    style: [],
                },
            ],
        },
        {
            compId: 'socialMedia',
            parentId: '',
            displayNameTag: 'Social Media',
            displayImage: 'slidesIcon',
            compFields: [
                // {
                //     fieldType: 'fieldSocialMediaLink',
                //     dataKey: 'socialMedia',
                //     isLanguageWiseContentPresent: true,
                //     validations: {
                //         required: true,
                //         minLen: 0,
                //         maxLen: 100,
                //     },
                // },
            ],
        },
        {
            compId: 'list',
            parentId: '',
            displayNameTag: 'List',
            displayImage: 'cardListIcon',
            settings: [
                {
                    displayTitle: 'Custom Collections',
                    settingType: 'dropDown',
                    dataKey: 'collection',
                    externalDataSource: {
                        request: { url: '/api/custom-collections', params: {} },
                        externalParams: {
                            dataSourceUrl: '/api/cms/getCollectionData',
                            BaseUrl: '/api/',
                        },
                        uniqueKeyMapping: '_id',
                        displayNameMapping: 'menuName',
                        valueMapping: '',
                    },
                },
                {
                    displayTitle: 'Records Order',
                    settingType: 'dropDown',
                    dataKey: 'recordsOrder',
                    settingData: [
                        {
                            uniqueKey: 'asc',
                            displayValue: 'Ascending Order',
                            value: 'asc',
                        },
                        {
                            uniqueKey: 'desc',
                            displayValue: 'Descending Order',
                            value: 'desc',
                        },
                    ],
                },
            ],
            compFields: [
                {
                    fieldType: 'fieldList',
                    dataKey: 'list',
                    isLanguageWiseContentPresent: false,
                    validations: {
                        required: true,
                        minLen: 0,
                        maxLen: 100,
                    },
                },
            ],
        },
        {
            compId: 'treeView',
            parentId: '',
            displayNameTag: 'Tree View',
            displayImage: 'treeIcon',
            settings: [
                {
                    displayTitle: 'Tree List',
                    settingType: 'dropDown',
                    dataKey: 'tree',
                    externalDataSource: {
                        request: { url: '/api/custom-collections/tree/all', params: {} },
                        externalParams: {},
                        uniqueKeyMapping: 'id',
                        displayNameMapping: 'title',
                        valueMapping: 'id',
                    },
                },
            ],
            compFields: [],
        },
        {
            compId: 'accordionView',
            parentId: '',
            displayNameTag: 'Document Accordion View',
            displayImage: 'accordionIcon',
            settings: [
                {
                    displayTitle: 'Search Result Page',
                    settingType: 'textInput',
                    dataKey: 'searchResultURL',
                },
                {
                    displayTitle: 'PDF Download Content',
                    settingType: 'customCollectionOptionSelect',
                    dataKey: 'customReport',
                },
            ],
            compFields: [
                {
                    fieldType: 'fieldDocumentAccordion',
                    dataKey: 'dataMap',
                    isLanguageWiseContentPresent: false,
                    validations: {
                        required: true,
                        minLen: 0,
                        maxLen: 100,
                    },
                },
            ],
        },
        {
            compId: 'dateVersion',
            parentId: '',
            displayNameTag: 'Date Version',
            displayImage: 'accordionIcon',
            settings: [
                {
                    displayTitle: 'Custom Collections',
                    settingType: 'dropDown',
                    dataKey: 'collection',
                    externalDataSource: {
                        request: { url: '/api/custom-collections', params: {} },
                        externalParams: {},
                        uniqueKeyMapping: '_id',
                        displayNameMapping: 'menuName',
                        valueMapping: 'customeCollectionName',
                    },
                },
            ],
            compFields: [
                {
                    fieldType: 'fieldShortText',
                    dataKey: 'text',
                    isLanguageWiseContentPresent: true,
                    validations: {
                        required: true,
                        minLen: 0,
                        maxLen: 100,
                    },
                    style: [],
                },
            ],
        },
        {
            compId: 'siteSearch',
            parentId: '',
            displayNameTag: 'Site Search',
            displayImage: 'searchIcon',
            settings: [
                {
                    displayTitle: 'Full width Component',
                    settingType: 'toggleSwitch',
                    dataKey: 'componentType',
                    settingData: { defaultValue: false },
                },
            ],
            compFields: [],
        },
        {
            compId: 'siteSearchResults',
            parentId: '',
            displayNameTag: 'Site Search Results',
            displayImage: 'siteSearchIcon',
            settings: [
                {
                    displayTitle: 'Records Limit',
                    settingType: 'numberInput',
                    dataKey: 'recordsLimit',
                    settingData: { maxValue: 10, minValue: 1, defaultValue: 5 },
                },
            ],
            compFields: [],
        },
        {
            compId: 'socialMediaShare',
            parentId: '',
            displayNameTag: 'Social Media Share',
            displayImage: 'slidesIcon',
            compFields: [],
        },
        {
            compId: 'treeSearch',
            parentId: '',
            displayNameTag: 'Tree Search',
            displayImage: 'treeIcon',
            settings: [
                {
                    displayTitle: 'Tree List',
                    settingType: 'dropDown',
                    dataKey: 'tree',
                    externalDataSource: {
                        request: { url: '/api/custom-collections/tree/all', params: {} },
                        externalParams: {},
                        uniqueKeyMapping: 'id',
                        displayNameMapping: 'title',
                        valueMapping: 'id',
                    },
                },
                {
                    displayTitle: 'Title Mapping Field',
                    settingType: 'textInput',
                    dataKey: 'titleMap',
                },
                {
                    displayTitle: 'Paragraph Mapping Field',
                    settingType: 'textInput',
                    dataKey: 'paragraphMap',
                },
            ],
            compFields: [],
        },
        {
            compId: 'productSubscription',
            parentId: '',
            displayNameTag: 'Product Subscription',
            displayImage: 'slidesIcon',
            compFields: [],
        },
        {
            compId: 'subscriptionConfirmation',
            parentId: '',
            displayNameTag: 'Subscription Confirmation',
            displayImage: 'slidesIcon',
            compFields: [],
        },
        {
            compId: 'video',
            parentId: '',
            displayNameTag: 'video',
            displayImage: 'videoIcon',
            compFields: [
                {
                    fieldType: 'fieldVideo',
                    dataKey: 'video',
                    isLanguageWiseContentPresent: true,
                    validations: {},
                },
            ],
            settings: [
                {
                    displayTitle: 'Enable Auto Play',
                    settingType: 'toggleSwitch',
                    dataKey: 'autoPlay',
                    settingData: { defaultValue: false },
                },
                {
                    displayTitle: 'Enable Video Download',
                    settingType: 'toggleSwitch',
                    dataKey: 'downloadable',
                    settingData: { defaultValue: true },
                },
            ],
        },
        {
            compId: 'icon',
            parentId: '',
            displayNameTag: 'icon',
            displayImage: 'imageIcon',
            compFields: [
                {
                    fieldType: 'fieldIcon',
                    dataKey: 'icon',
                    isLanguageWiseContentPresent: true,
                    validations: {},
                },
            ],
            settings: [
                {
                    displayTitle: 'Open link in new window',
                    settingType: 'toggleSwitch',
                    dataKey: 'seprateLink',
                    settingData: { defaultValue: false },
                },
                // {
                //     displayTitle: 'Color',
                //     settingType: 'colorPicker',
                //     dataKey: 'iconColor',
                // },
                {
                    displayTitle: 'Icon Size',
                    settingType: 'dropDown',
                    dataKey: 'iconSize',
                    settingData: [
                        {
                            uniqueKey: '18dp',
                            displayValue: '18dp',
                            value: '18',
                        },
                        {
                            uniqueKey: '24dp',
                            displayValue: '24dp',
                            value: '24',
                        },
                        {
                            uniqueKey: '36dp',
                            displayValue: '36dp',
                            value: '36',
                        },
                        {
                            uniqueKey: '48dp',
                            displayValue: '48dp',
                            value: '48',
                        },
                    ],
                },
            ],
        },
        {
            compId: 'form',
            parentId: '',
            displayNameTag: 'Form',
            displayImage: 'accordionIcon',
            settings: [
                {
                    displayTitle: 'Custom Collections',
                    settingType: 'dropDown',
                    dataKey: 'collection',
                    externalDataSource: {
                        request: {
                            url: '/api/collection/data/all',
                            params: { collection: 'forms' },
                        },
                        externalParams: {},
                        uniqueKeyMapping: '_id',
                        displayNameMapping: 'title',
                        valueMapping: '_id',
                    },
                },
            ],

            compFields: [],
        },
        {
            compId: 'registration',
            parentId: '',
            displayNameTag: 'registration',
            displayImage: 'imageIcon',
            styles: ['buttonComponentStyles'],
            settings: [],
            compFields: [],
        },
        {
            compId: 'basicMenu',
            parentId: '',
            displayNameTag: 'Basic Menu',
            displayImage: 'mainMenuIcon',
            compFields: [
                {
                    fieldType: 'fieldLinkList',
                    dataKey: 'basicMenu',
                    isLanguageWiseContentPresent: true,
                    validations: {
                        required: true,
                        minLen: 0,
                        maxLen: 100,
                    },
                },
            ],
            settings: [
                {
                    displayTitle: 'Logo',
                    settingType: 'imageGallery',
                    dataKey: 'logo',
                },
            ],
        },
    ],
};
