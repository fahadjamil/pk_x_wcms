export interface AllPurchaseTransactionTypes {
    AMOUNT: string;
    CREATED_DATE: Date;
    ERROR: null | string;
    LOGIN_ID: string;
    PAYMENT_ID: null | string;
    REFERENCE_ID: null | string;
    RESULT: null | string;
    S01_FIRSTNAME: string;
    S02_LOGINNAME: string;
    STATUS: string;
    TRACK_ID: string;
    TRANSACTION_ID: null | string;
}

export interface AllPurchaseTransactionsPropTypes {
    allPurchaseTransactions: AllPurchaseTransactionTypes[];
}
