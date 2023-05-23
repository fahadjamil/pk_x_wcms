export const CLOSE_KEY = 'CLS';
export const VOLUME_KEY = 'VOL';
export const TOVR_KEY = 'TOVR';
export const DATE_KEY = 'DT';

// --- Index Specific Colors ---
export const PREMIER_COLOR = '#C5944B';
export const ALL_COLOR = '#4E7E4E';
export const MAIN_COLOR = '#444B54';
export const MAIN50_COLOR = '#8d8f8e';

// --- Property Specific Colors ---
export const VOLUME_COLOR = '#444B54';
export const VALUE_COLOR = '#C5944B';
export const NOOFTRADES_COLOR = '#8d8f8e';

// --- Index Meta Data ---
export const PREMIER_NAME = 'Premier';
export const ALL_NAME = 'All Share';
export const MAIN_NAME = 'Main';
export const MAIN50_NAME = 'Main 50';
export const PREMIER_AR_NAME = ' الأول';
export const ALL_AR_NAME = 'مؤشر السوق العام';
export const MAIN_AR_NAME = 'الرئيسي';
export const MAIN50_AR_NAME = ' الرئيسي 50';
export const PREMIER_KEY = 'premier';
export const ALL_KEY = 'all';
export const MAIN_KEY = 'main';
export const MAIN50_KEY = 'main50';

// --- Property Meta ---
export const VALUE_DATAKEY = 'Value';
export const VOLUME_DATAKEY = 'Volume';
export const NOOFTRADES_DATAKEY = 'NoOfTrades';
export const VALUE_NAME = 'Value';
export const VOLUME_NAME = 'Volume';
export const NOOFTRADES_NAME = 'No. of Trades';
export const VALUE_AR_NAME = 'السعر';
export const VOLUME_AR_NAME = 'القيمة';
export const NOOFTRADES_AR_NAME = 'عدد الأسهم المتداولة';

// --- Line Chart Settings ---
export const chartHeight = 250;
export const chartWidth = 500;
export const strokeWidthSize = 2.5;
export const domainMargin = 100;
export const strokeDashSize = 2;

//  --- Sector Summary Bar Chart Settings ---
export const sectorSummaryChartHeight = 530;
export const sectorSummaryChartWidth = 1200;

// --- Line Charts ---

export const charts = [
    {
        id: 1,
        name: PREMIER_NAME,
        arName: PREMIER_AR_NAME,
        key: PREMIER_KEY,
        color: PREMIER_COLOR,
        type: '01',
    },
    {
        id: 2,
        name: ALL_NAME,
        arName: ALL_AR_NAME,
        key: ALL_KEY,
        color: ALL_COLOR,
        type: '03',
    },
    {
        id: 3,
        name: MAIN_NAME,
        arName: MAIN_AR_NAME,
        key: MAIN_KEY,
        color: MAIN_COLOR,
        type: '02',
    },
    {
        id: 4,
        name: MAIN50_NAME,
        arName: MAIN50_AR_NAME,
        key: MAIN50_KEY,
        color: MAIN50_COLOR,
        type: '50',
    },
];
