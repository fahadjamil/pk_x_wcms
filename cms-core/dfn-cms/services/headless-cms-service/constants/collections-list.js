const commonDatabase = 'cms-admin';

const commonDbCollectionList = {
    cmsUsers: 'cms-users',
    cmsWebsites: 'cms-websites',
    cmsContentOperation: 'cms-content-operations',
    cmsUserFeature: 'cms-user-feature',
    cmsUserRoles: 'cms-user-roles',
    masterInfo: 'master-info',
};

const collectionsList = {
    pageContentDrafts: 'page-content-drafts',
    pageContent: 'page-content',
    pageContentHistory: 'page-content-history',
    pages: 'pages',
    pagesHistory: 'pages-history',
    pageDrafts: 'page-drafts',
    documents: 'documents',
    documentsHistory: 'documents-history',
    documentDrafts: 'document-drafts',
    posts: 'posts',
    postsHistory: 'posts-history',
    postDrafts: 'post-drafts',
    templates: 'templates',
    templatesContent: 'templates-content',
    templatesContentHistory: 'templates-content-history',
    templatesContentDrafts: 'templates-content-drafts',
    templatesHistory: 'templates-history',
    templatesDraft: 'templates-draft',
    themes: 'themes',
    themeDrafts: 'theme-drafts',
    themeHistory: 'theme-history',
    menus: 'menus',
    siteUsers: 'site-users',
    siteUserPermissions: 'site-user-permissions',
    siteUserRoles: 'site-user-roles',
    siteSettings: 'site-settings',
    cmsContentOperation: 'cms-content-operations',
    cmsUserFeature: 'cms-user-feature',
    counters: 'counters',
    cmsUserRoles: 'cms-user-roles',
    activityLogs: 'activity-logs',
    workflows: 'workflows',
    banners: 'banners',
    bannerDraft: 'banner-draft',
    bannerHistory: 'banner-history',
    customTrees: 'custom-trees',
    customTypes: 'custome-types',
    docsResearchReports: 'docs-research-reports',
    docsPressCorner: 'docs-press-corner',
    contentArchive: 'content-archive',
    staticResources: 'static-resources',
    staticResourcesHistory: 'static-resources-history',
    staticResourcesLinks: 'static-resources-links',
    formDrafts: 'form-drafts',
    forms: 'forms',
    formsHistory: 'forms-history',
};

const gridFsCollectionsList = {
    resources: 'resources',
    media: 'media',
    cmsDocumentResports: 'cms-document-reports',
};

const cmsPermissionIds = {
    workflowId: '2',
    customCollectionId: '3',
};

module.exports = {
    commonDatabase: commonDatabase,
    commonDbCollectionList: commonDbCollectionList,
    collectionsList: collectionsList,
    cmsPermissionIds: cmsPermissionIds,
    gridFsCollectionsList: gridFsCollectionsList,
};
