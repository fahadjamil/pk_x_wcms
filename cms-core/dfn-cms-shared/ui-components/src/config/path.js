const baseURL = `http://localhost:3300/`;
const URLtail = `api/getSampleResponse?`;
const queryParams = `key=`;

export const appServerURL = (param) => `${URLtail}${queryParams}${param}`;
