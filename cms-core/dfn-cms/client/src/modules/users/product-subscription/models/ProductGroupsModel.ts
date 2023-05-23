export interface ProductGroupsType {
    GROUP_ID: string;
    DESCRIPTION_AR: string;
    DESCRIPTION_EN: string;
}

export interface ProductGroupDetailsPropTypes {
    productGroupDetails: ProductGroupsType[];
    isProductGroupDetailsModalOpen: boolean;
    setIsProductGroupDetailsModalOpen: any;
}

export interface ValidationErrorTypes {
    groupEn?: string;
    groupAr?: string;
    common?: string;
}

export interface AddProductGroupPropTypes {
    isAddProductGroupModalOpen: boolean;
    setIsAddProductGroupsModalOpen: any;
    handleConfirme: any;
    productGroupDetails: ProductGroupsType[];
    validationErrors: ValidationErrorTypes;
    modalTitle: string;
}

export interface AllProductGroupsPropTypes {
    allProductGroups: ProductGroupsType[];
    handleProductGroupDetailedView: any;
    handleProductGroupEdit: any;
    handleProductGroupDelete: any;
}

export interface DeleteProductGroupPropTypes {
    isDeleteProductGroupModalOpen: boolean;
    selectedProductGroupId: number | undefined;
    setIsDeleteProductGroupModalOpen: any;
    deleteProductGroup: any;
}
