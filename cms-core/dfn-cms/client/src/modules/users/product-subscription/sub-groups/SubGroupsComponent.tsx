import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import NotificationAlertsComponent from '../../../shared/ui-components/alerts/NotificationAlertsComponent';
import {
    getAuthorizationHeader,
    getAuthorizationHeaderForDelete,
} from '../../../shared/utils/AuthorizationUtils';
import validator from '../../../shared/utils/Validator';
import AddProductSubGroupComponent from './AddProductSubGroupComponent';
import AllSubGroupsComponent from './AllSubGroupsComponent';
import DeleteProductSubGroupComponent from './DeleteProductSubGroupComponent';
import ProductSubGroupDetailsComponent from './ProductSubGroupDetailsComponent';

export const subGroupValidationSchema = {
    subGroupEn: {
        type: 'string',
        empty: false,
        messages: {
            required: 'This field is required',
            string: 'This field is required and it must be a string.',
            stringEmpty: 'This field is required.',
        },
    },
    subGroupAr: {
        type: 'string',
        empty: false,
        messages: {
            required: 'This field is required',
            string: 'This field is required and it must be string.',
            stringEmpty: 'This field is required.',
        },
    },
    group: {
        type: 'string',
        empty: false,
        messages: {
            required: 'This field is required',
            string: 'This field is required and it must be string.',
            stringEmpty: 'This field is required.',
        },
    },
};

function SubGroupsComponent(props) {
    const { website } = props;
    const [allProductSubGroups, setAllProductSubGroups] = useState([]);
    const [productSubGroupDetails, setProductSubGroupDetails] = useState<any>([]);
    const [otherImportantData, setOtherImportantData] = useState<any>({});
    const [isProductSubGroupDetailsModalOpen, setIsProductSubGroupDetailsModalOpen] = useState(
        false
    );
    const [isAddProductSubGroupModalOpen, setIsAddProductSubGroupsModalOpen] = useState(false);
    const [isDeleteProductSubGroupModalOpen, setIsDeleteProductSubGroupModalOpen] = useState(false);
    const [isProductSubGroupEdit, setIsProductSubGroupEdit] = useState(false);
    const [selectedProductSubGroupId, setSelectedProductSubGroupId] = useState<number | undefined>(
        undefined
    );
    const [responseData, setResponseData] = useState<any>(undefined);
    const [validationErrors, setValidationErrors] = useState<any>({});
    const subGroupsValidatorKey = 'subGroupsValidatorKey';

    useEffect(() => {
        let isMounted: boolean = true;

        if (isMounted) {
            getAllProductSubGroups();
            validator.setValidatorSchema(subGroupsValidatorKey, subGroupValidationSchema);
        }

        return () => {
            isMounted = false;
        };
    }, [website]);

    function getAllProductSubGroups() {
        const headerParameter = {};
        const httpHeaders = getAuthorizationHeader(headerParameter);

        Axios.get('/api/subscription/sub-groups', httpHeaders)
            .then((results) => {
                const { data, status } = results;

                if (status === 200) {
                    const { code, message, subGroups } = data;

                    if (code === 1) {
                        setAllProductSubGroups(subGroups);
                    }

                    if (code === -1 || code === -2 || code === -3) {
                        const resStatus = {
                            status: 'failed',
                            msg: message,
                        };

                        setResponseData(resStatus);

                        setTimeout(function () {
                            setResponseData(undefined);
                        }, 3000);
                    }
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function getProductSubGroupDetails(subGroupId) {
        const headerParameter = { subGroupId: subGroupId };
        const httpHeaders = getAuthorizationHeader(headerParameter);

        Axios.get('/api/subscription/sub-group', httpHeaders)
            .then((results) => {
                const { data, status } = results;

                if (status === 200) {
                    const { code, message, subGroup } = data;

                    if (code === 1) {
                        setProductSubGroupDetails(subGroup);
                    }

                    if (code === -1 || code === -2 || code === -3) {
                        const resStatus = {
                            status: 'failed',
                            msg: message,
                        };

                        setResponseData(resStatus);

                        setTimeout(function () {
                            setResponseData(undefined);
                        }, 3000);
                    }
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    // Get all groups
    function getAllNecessaryDataForAddProductSubGroupModal(subGroupId = undefined) {
        const headerParameter = { subGroupId: subGroupId };
        const httpHeaders = getAuthorizationHeader(headerParameter);

        Axios.get('/api/subscription/sub-group/other-data', httpHeaders)
            .then((results) => {
                const { data, status } = results;

                if (status === 200) {
                    const { code, message, otherData, subGroup } = data;

                    if (code === 1) {
                        setOtherImportantData(otherData);

                        if (subGroup) {
                            setProductSubGroupDetails(subGroup);
                        } else {
                            setProductSubGroupDetails([]);
                        }
                    }

                    if (code === -1 || code === -2 || code === -3) {
                        const resStatus = {
                            status: 'failed',
                            msg: message,
                        };

                        setResponseData(resStatus);

                        setTimeout(function () {
                            setResponseData(undefined);
                        }, 3000);
                    }
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function addProductSubGroup(details) {
        const [isValid, error] = validator.validateData(subGroupsValidatorKey, details);

        if (isValid) {
            const headerParameter = {};
            const httpHeaders = getAuthorizationHeader(headerParameter);

            let productSubGroup = {
                subGroupData: details,
            };

            Axios.post('/api/subscription/sub-group/add', productSubGroup, httpHeaders)
                .then((results) => {
                    const { data, status } = results;

                    if (status === 200) {
                        const { code, message, subGroups } = data;

                        if (code === 1) {
                            if (subGroups) {
                                setAllProductSubGroups(subGroups);
                            }

                            const resStatus = {
                                status: 'success',
                                msg: message,
                            };

                            setResponseData(resStatus);

                            setTimeout(function () {
                                setResponseData(undefined);
                            }, 3000);
                        }

                        if (code === -1 || code === -2 || code === -3) {
                            const resStatus = {
                                status: 'failed',
                                msg: message,
                            };

                            setResponseData(resStatus);

                            setTimeout(function () {
                                setResponseData(undefined);
                            }, 3000);
                        }
                    }
                })
                .catch((err) => {
                    console.log(err);
                });

            setIsAddProductSubGroupsModalOpen(false);
            setValidationErrors({});
        } else {
            const updatedError = {};

            for (let errorItem of error) {
                const { field, message } = errorItem;

                if (field) {
                    updatedError[field] = message;
                    continue;
                }

                updatedError['common'] = 'Please fix the validation errors.';
            }

            setValidationErrors(updatedError);
        }
    }

    function editProductSubGroups(details) {
        const [isValid, error] = validator.validateData(subGroupsValidatorKey, details);

        if (isValid) {
            const headerParameter = {};
            const httpHeaders = getAuthorizationHeader(headerParameter);

            let productSubGroup = {
                subGroupData: details,
            };

            Axios.put('/api/subscription/sub-group/edit', productSubGroup, httpHeaders)
                .then((results) => {
                    const { data, status } = results;

                    if (status === 200) {
                        const { code, message, subGroups } = data;

                        if (code === 1) {
                            if (subGroups) {
                                setAllProductSubGroups(subGroups);
                            }

                            const resStatus = {
                                status: 'success',
                                msg: message,
                            };

                            setResponseData(resStatus);

                            setTimeout(function () {
                                setResponseData(undefined);
                            }, 3000);
                        }

                        if (code === -1 || code === -2 || code === -3) {
                            const resStatus = {
                                status: 'failed',
                                msg: message,
                            };

                            setResponseData(resStatus);

                            setTimeout(function () {
                                setResponseData(undefined);
                            }, 3000);
                        }
                    }
                })
                .catch((err) => {
                    console.log(err);
                });

            setIsAddProductSubGroupsModalOpen(false);
            setIsProductSubGroupEdit(false);
            setValidationErrors({});
        } else {
            const updatedError = {};

            for (let errorItem of error) {
                const { field, message } = errorItem;

                if (field) {
                    updatedError[field] = message;
                    continue;
                }

                updatedError['common'] = 'Please fix the validation errors.';
            }

            setValidationErrors(updatedError);
        }
    }

    function deleteProductSubGroup(subGroupId) {
        const headerParameter = { subGroupId: subGroupId };
        const payload = getAuthorizationHeaderForDelete(headerParameter);

        Axios.delete('/api/subscription/sub-group/delete', payload)
            .then((results) => {
                const { data, status } = results;

                if (status === 200) {
                    const { code, message, subGroups } = data;

                    if (code === 1) {
                        if (subGroups) {
                            setAllProductSubGroups(subGroups);
                        }

                        const resStatus = {
                            status: 'success',
                            msg: message,
                        };

                        setResponseData(resStatus);

                        setTimeout(function () {
                            setResponseData(undefined);
                        }, 3000);
                    }

                    if (code === -1 || code === -2 || code === -3) {
                        const resStatus = {
                            status: 'failed',
                            msg: message,
                        };

                        setResponseData(resStatus);

                        setTimeout(function () {
                            setResponseData(undefined);
                        }, 3000);
                    }
                }
            })
            .catch((err) => {
                console.log(err);
            });

        setIsDeleteProductSubGroupModalOpen(false);
    }

    function handleProductSubGroupDetailedView(subGroupId) {
        getProductSubGroupDetails(subGroupId);
        setIsProductSubGroupDetailsModalOpen(true);
    }

    function handleAddProductSubGroup() {
        setProductSubGroupDetails([]);
        getAllNecessaryDataForAddProductSubGroupModal();
        setIsAddProductSubGroupsModalOpen(true);
        setIsProductSubGroupEdit(false);
    }

    function handleProductSubGroupEdit(subGroupId) {
        getAllNecessaryDataForAddProductSubGroupModal(subGroupId);
        setIsAddProductSubGroupsModalOpen(true);
        setIsProductSubGroupEdit(true);
    }

    function handleProductSubGroupDelete(subGroupId) {
        setSelectedProductSubGroupId(subGroupId);
        setIsDeleteProductSubGroupModalOpen(true);
    }

    return (
        <>
            <div className="row p-3 justify-content-end">
                <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={handleAddProductSubGroup}
                >
                    Add Product SubGroup
                </button>
            </div>
            <NotificationAlertsComponent responseData={responseData} />
            <div className="table-responsive" id="product-subgroups">
                <AllSubGroupsComponent
                    allProductSubGroups={allProductSubGroups}
                    handleProductSubGroupDetailedView={handleProductSubGroupDetailedView}
                    handleProductSubGroupEdit={handleProductSubGroupEdit}
                    handleProductSubGroupDelete={handleProductSubGroupDelete}
                />
            </div>
            {isProductSubGroupDetailsModalOpen && (
                <ProductSubGroupDetailsComponent
                    productSubGroupDetails={productSubGroupDetails}
                    isProductSubGroupDetailsModalOpen={isProductSubGroupDetailsModalOpen}
                    setIsProductSubGroupDetailsModalOpen={setIsProductSubGroupDetailsModalOpen}
                />
            )}
            {isAddProductSubGroupModalOpen && (
                <AddProductSubGroupComponent
                    isAddProductSubGroupModalOpen={isAddProductSubGroupModalOpen}
                    otherImportantData={otherImportantData}
                    setIsAddProductSubGroupsModalOpen={(status) => {
                        setIsAddProductSubGroupsModalOpen(status);
                        setValidationErrors({});
                    }}
                    handleConfirme={
                        isProductSubGroupEdit ? editProductSubGroups : addProductSubGroup
                    }
                    productSubGroupDetails={productSubGroupDetails}
                    validationErrors={validationErrors}
                    modalTitle={
                        isProductSubGroupEdit ? 'EDIT PRODUCT SUB GROUP' : 'ADD PRODUCT SUB GROUP'
                    }
                />
            )}
            {isDeleteProductSubGroupModalOpen && (
                <DeleteProductSubGroupComponent
                    isDeleteProductSubGroupModalOpen={isDeleteProductSubGroupModalOpen}
                    selectedProductSubGroupId={selectedProductSubGroupId}
                    setIsDeleteProductSubGroupModalOpen={setIsDeleteProductSubGroupModalOpen}
                    deleteProductSubGroup={deleteProductSubGroup}
                />
            )}
        </>
    );
}

export default SubGroupsComponent;
