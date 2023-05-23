export interface ProductDetailsType {
    PRODUCT_AR: string;
    PRODUCT_EN: string;
    VAT: number;
    PRODUCT_FEE: number;
    GROUP_ID: string;
    PRODUCT_GROUP_AR: string;
    PRODUCT_GROUP_EN: string;
    PRODUCT_ID: string;
    SUB_GROUP_ID: string | null;
    PRODUCT_SUB_GROUP_AR: string | null;
    PRODUCT_SUB_GROUP_EN: string | null;
    STATUS: number;
    SUBSCRIPTION_PERIOD_AR: string;
    SUBSCRIPTION_PERIOD_EN: string;
    SUBSCRIPTION_PERIOD_ID: string;
    PRODUCT_FEE_ID: string;
}

export interface ProductDetailsPropTypes {
    productDetails: ProductDetailsType[];
    isProductDetailsModalOpen: boolean;
    setIsProductDetailsModalOpen: any;
}

export interface GroupType {
    DESCRIPTION_AR: string;
    DESCRIPTION_EN: string;
    GROUP_ID: string;
}

export interface SubGroupType {
    DESCRIPTION_AR: string;
    DESCRIPTION_EN: string;
    GROUP_ID: number;
    SUB_GROUP_ID: string;
}

export interface PeriodType {
    DESCRIPTION_AR: string;
    DESCRIPTION_EN: string;
    PERIOD_ID: string;
}

export interface AddProductOtherDataType {
    groups: GroupType[];
    periods: PeriodType[];
    subGroups: SubGroupType[];
}

export interface ValidationErrorTypes {
    productEn?: string;
    productAr?: string;
    group?: string;
    common?: string;
}

export interface AddProductPropTypes {
    otherImportantData: AddProductOtherDataType;
    isAddProductModalOpen: boolean;
    setIsAddProductModalOpen: any;
    addProduct: any;
    productDetails: ProductDetailsType[];
    validationErrors: ValidationErrorTypes;
    modalTitle: string;
}

export interface AllProductsType {
    PRODUCT_AR: string;
    PRODUCT_EN: string;
    PRODUCT_GROUP_AR: string;
    PRODUCT_GROUP_EN: string;
    PRODUCT_ID: string;
    PRODUCT_SUB_GROUP_AR: string | null;
    PRODUCT_SUB_GROUP_EN: string | null;
    STATUS: number;
    VAT: number;
}

export interface AllProductsPropTypes {
    allProducts: AllProductsType[];
    handleProductDetailedView: any;
    handleProductEdit: any;
    handleProductDelete: any;
}

export interface DeleteProductPropTypes {
    isDeleteProductModalOpen: boolean;
    selectedProductId: number | undefined;
    setIsDeleteProductModalOpen: any;
    deleteProduct: any;
}
