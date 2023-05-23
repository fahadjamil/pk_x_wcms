export interface SubscriptionPeriodType {
    PERIOD_ID: string;
    DESCRIPTION_AR: string;
    DESCRIPTION_EN: string;
}

export interface SubscriptionPeriodDetailsPropTypes {
    subscriptionPeriodDetails: SubscriptionPeriodType[];
    isSubscriptionPeriodDetailsModalOpen: boolean;
    setIsSubscriptionPeriodDetailsModalOpen: any;
}

export interface ValidationErrorTypes {
    periodEn?: string;
    periodAr?: string;
    common?: string;
}
export interface AddSubscriptionPeriodPropTypes {
    isAddSubscriptionPeriodsModalOpen: boolean;
    setIsAddSubscriptionPeriodsModalOpen: any;
    handleConfirme: any;
    subscriptionPeriodDetails: SubscriptionPeriodType[];
    validationErrors: ValidationErrorTypes;
    modalTitle: string;
}

export interface AllSubscriptionPeriodsPropTypes {
    allSubscriptionPeriods: SubscriptionPeriodType[];
    handleSubscriptionPeriodDetailedView: any;
    handleSubscriptionPeriodEdit: any;
    handleSubscriptionPeriodDelete: any;
}

export interface DeleteSubscriptionPeriodPropTypes {
    isDeleteSubscriptionPeriodModalOpen: boolean;
    selectedSubscriptionPeriodId: number | undefined;
    setIsDeleteSubscriptionPeriodModalOpen: any;
    deleteSubscriptionPeriod: any;
}
