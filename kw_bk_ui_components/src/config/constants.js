// === urls ===
export const getLangKey = (lang) => (lang.langKey == 'AR' ? 'ar' : 'en');
// financial data
export const incomeStatementLink = (stockID, lang) =>
    `/${getLangKey(lang)}/stock/financial-data/income-statement#${stockID}`;
export const balanceSheetLink = (stockID, lang) =>
    `/${getLangKey(lang)}/stock/financial-data/balance-sheet#${stockID}`;
export const cashFlowStatementLink = (stockID, lang) =>
    `/${getLangKey(lang)}/stock/financial-data/cash-flow-statement#${stockID}`;
export const ratiosAndIndicatorsLink = (stockID, lang) =>
    `/${getLangKey(lang)}/stock/financial-data/ratios-indicators#${stockID}`;
export const comparisonLink = (stockID, lang) =>
    `/${getLangKey(lang)}/stock/financial-data/comparison#${stockID}`;

// news
export const newsDetailLink = (newsID, lang) => `/${getLangKey(lang)}/news/view#${newsID}`;

//event calendar
export const eventCalendarLink = (lang) => `/${getLangKey(lang)}/corporate-event-calendar`;

//company announcement
export const companyAnnouncementLink = (lang) =>
    `/${getLangKey(lang)}/announcements/news-and-announcements/announcements`;

//corporate actions
export const corporateActionsLink = (lang) =>
    `/${getLangKey(lang)}/securities/company-information/corporate-actions`;

//research Report
export const researchReportLink = (lang) =>
    `/${getLangKey(lang)}/data-and-research/data-and-research-overview/research-reports`;

//stock
export const stockProfileLink = (stockID, lang) => `/${getLangKey(lang)}/stock/profile#${stockID}`;

//bank holding Report
export const holdingReportPageLink = (yearMonthID, lang) =>
    `/${getLangKey(lang)}/bank-holding-report-view#${yearMonthID}`;
// export const holdingReportPdfLink = (reportID) => `http://192.168.13.141:8081/api/documents/boursa/${reportID}`;

// reits profile
export const reitsProfileLink = (reitID, lang) => `/${getLangKey(lang)}/reits/profile#${reitID}`;

// mutual fund profile
export const mutualFundProfileLink = (fundID, lang) =>
    `/${getLangKey(lang)}/fund/profile#${fundID}`;

// change default password
export const changeDefaultPassowrdLink = (lang) => `/${getLangKey(lang)}/change-default-password`;

// research report view - disclaimer
export const researchReportViewLink = (researchReportID, lang) =>
    `/${getLangKey(lang)}/research-report-view-page#${researchReportID}`;

export const delistedCompaniesLink = (lang) =>
    `/${lang}/securities/company-information/delisted-companies`;

export const reitsListLink = (lang) => `/${lang}/participants/participants/reits-list`;

export const listedCompaniesLink = (lang) => `/${lang}/participants/participants/listed-companies`;

// tradable rights - inner page
export const tradableRightsSummary = (stockID, lang) => `/${getLangKey(lang)}/tradable/summary#${stockID}`;
// === date constants ===

export const shortDaysOfTheWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const daysOfTheWeek = [
    'Sunday',
    'Monday',
    'Tuesday',
    'Wednesday',
    'Thursday',
    'Friday',
    'Saturday',
];
export const daysOfTheWeekArabic = [
    'الأحد',
    'الإثنين',
    'الثلاثاء',
    'الأربعاء',
    'الخميس',
    'الجمعة',
    'السبت',
];
export const monthNames = [
    'January',
    'February',
    'March',
    'April',
    'May',
    'June',
    'July',
    'August',
    'September',
    'October',
    'November',
    'December',
];
export const shortMonthNames = [
    'Jan',
    'Feb',
    'Mar',
    'Apr',
    'May',
    'Jun',
    'Jul',
    'Aug',
    'Sep',
    'Oct',
    'Nov',
    'Dec',
];
export const arabicMonths = [
    'يناير',
    'فبراير',
    'مارس',
    'أبريل',
    'مايو',
    'يونيو',
    'يوليو',
    'أغسطس',
    'سبتمبر',
    'أكتوبر',
    'نوفمبر',
    'ديسمبر',
];

// === other constants ===

export const arabicNumbers = ['٠', '١', '٢', '٣', '٤', '٥', '٦', '٧', '٨', '٩'];

//  === cookie names ===

export const EMAIL_COOKIE = 'bk_email';
export const SESSION_COOKIE = 'bk_session';
export const SUBSCRIPTIONS_COOKIE = 'bk_subscriptions';
export const LOGIN_ID_COOKIE = 'bk_login_id';
export const NAME_COOKIE = 'bk_name';

// === table exporting ===
export const PDF = 1;
export const XLSX = 2;
export const CSV = 3;

// === product ID ===
export const productID = 42;
