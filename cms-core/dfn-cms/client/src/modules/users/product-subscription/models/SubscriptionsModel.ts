export interface AllProductSubscriptionTypes {
    DESCRIPTION_EN: string;
    EXPIRY_DATE: Date;
    PERIOD_DESC: string;
    PERIOD_ID: string;
    PRODUCT_ID: string;
    S01_FIRSTNAME: string;
    S02_LOGINNAME: string;
    STATUS: number;
    SUBSCRIBED_DATE: Date;
    SUBSCRIPTION_ID: string;
    TRANSACTION_CODE: null | string;
}

export interface AllSubscriptionsPropTypes {
    allProductSubscription: AllProductSubscriptionTypes[];
}
