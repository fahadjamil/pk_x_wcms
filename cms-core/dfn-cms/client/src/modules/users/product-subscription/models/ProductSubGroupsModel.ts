export interface ProductSubGroupsType {
    SUB_GROUP_ID: string;
    GROUP_ID: string;
    PRODUCT_GROUP_AR: string;
    PRODUCT_GROUP_EN: string;
    PRODUCT_SUB_GROUP_AR: string;
    PRODUCT_SUB_GROUP_EN: string;
}

export interface ProductSubGroupDetailsPropTypes {
    productSubGroupDetails: ProductSubGroupsType[];
    isProductSubGroupDetailsModalOpen: boolean;
    setIsProductSubGroupDetailsModalOpen: any;
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

export interface AddProductSubGroupOtherDataType {
    groups: GroupType[];
}

export interface ValidationErrorTypes {
    subGroupEn?: string;
    subGroupAr?: string;
    group?: string;
    common?: string;
}

export interface AddProductSubGroupPropTypes {
    otherImportantData: AddProductSubGroupOtherDataType;
    isAddProductSubGroupModalOpen: boolean;
    setIsAddProductSubGroupsModalOpen: any;
    handleConfirme: any;
    productSubGroupDetails: ProductSubGroupsType[];
    validationErrors: ValidationErrorTypes;
    modalTitle: string;
}

export interface AllProductSubGroupsPropTypes {
    allProductSubGroups: ProductSubGroupsType[];
    handleProductSubGroupDetailedView: any;
    handleProductSubGroupEdit: any;
    handleProductSubGroupDelete: any;
}

export interface DeleteProductSubGroupPropTypes {
    isDeleteProductSubGroupModalOpen: boolean;
    selectedProductSubGroupId: number | undefined;
    setIsDeleteProductSubGroupModalOpen: any;
    deleteProductSubGroup: any;
}
