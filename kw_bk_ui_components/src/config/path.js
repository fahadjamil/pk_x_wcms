const URLtail = `/api/getSampleResponse?`;
const queryParams = `key=`;
export const appServerURL = (param) => `${URLtail}${queryParams}${param}`;
// market back end
export const marketBackEndProxyPass = (param) =>
    `/data-api/client-services${param ? '?' + param : ''}`;
export const oldMarketBackEndProxyPass = (param) =>
    `/data-api/legacy-mix-services${param ? '?' + param : ''}`;
export const appServerURLCollections = () => `/api/web/collection-data-by-lang`;

// app server
export const holdingReportDetailUrl = (params) =>
    `/api/web/kuwaiti-banks-holding-detail${params ? '?' + params : ''}`;
export const holdingReportSummeryUrl = () => `/api/web/kuwaiti-banks-holding-summary`;

export const marketMakerUrl = () => `/api/web/market-makers`;
export const contactUsUrl = () => `/api/web/contact-us`;

// app server - auth
export const registerService = () => `/api/web/auth/register`;
export const loginService = () => `/api/web/auth/login`;
export const forgotPasswrodService = () => `/api/web/auth/forgot-password`;
export const otpValidationService = () => `/api/web/auth/otp-validation`;
export const changePasswordService = () => `/api/web/auth/change-password`;
export const contactUsService = () => `/api/web/auth/contact-us`;
export const activateUserAccountService = () => `/api/web/auth/activate-account`;
