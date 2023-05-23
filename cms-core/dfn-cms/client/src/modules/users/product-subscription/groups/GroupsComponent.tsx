import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import NotificationAlertsComponent from '../../../shared/ui-components/alerts/NotificationAlertsComponent';
import {
    getAuthorizationHeader,
    getAuthorizationHeaderForDelete,
} from '../../../shared/utils/AuthorizationUtils';
import validator from '../../../shared/utils/Validator';
import AddProductGroupComponent from './AddProductGroupComponent';
import AllGroupsComponent from './AllGroupsComponent';
import DeleteProductGroupComponent from './DeleteProductGroupComponent';
import ProductGroupDetailsComponent from './ProductGroupDetailsComponent';

export const groupValidationSchema = {
    groupEn: {
        type: 'string',
        empty: false,
        messages: {
            required: 'This field is required',
            string: 'This field is required and it must be a string.',
            stringEmpty: 'This field is required.',
        },
    },
    groupAr: {
        type: 'string',
        empty: false,
        messages: {
            required: 'This field is required',
            string: 'This field is required and it must be string.',
            stringEmpty: 'This field is required.',
        },
    },
};

function GroupsComponent(props) {
    const { website } = props;
    const [allProductGroups, setAllProductGroups] = useState([]);
    const [productGroupDetails, setProductGroupDetails] = useState<any>([]);
    const [isProductGroupDetailsModalOpen, setIsProductGroupDetailsModalOpen] = useState(false);
    const [isAddProductGroupModalOpen, setIsAddProductGroupsModalOpen] = useState(false);
    const [isDeleteProductGroupModalOpen, setIsDeleteProductGroupModalOpen] = useState(false);
    const [isProductGroupEdit, setIsProductGroupEdit] = useState(false);
    const [selectedProductGroupId, setSelectedProductGroupId] = useState<number | undefined>(
        undefined
    );
    const [responseData, setResponseData] = useState<any>(undefined);
    const [validationErrors, setValidationErrors] = useState<any>({});
    const groupsValidatorKey = 'groupsValidatorKey';

    useEffect(() => {
        let isMounted: boolean = true;

        if (isMounted) {
            getAllProductGroups();
            validator.setValidatorSchema(groupsValidatorKey, groupValidationSchema);
        }

        return () => {
            isMounted = false;
        };
    }, [website]);

    function getAllProductGroups() {
        const headerParameter = {};
        const httpHeaders = getAuthorizationHeader(headerParameter);

        Axios.get('/api/subscription/groups', httpHeaders)
            .then((results) => {
                const { data, status } = results;

                if (status === 200) {
                    const { code, message, groups } = data;

                    if (code === 1) {
                        setAllProductGroups(groups);
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

    function getProductGroupDetails(groupId) {
        const headerParameter = { groupId: groupId };
        const httpHeaders = getAuthorizationHeader(headerParameter);

        Axios.get('/api/subscription/group', httpHeaders)
            .then((results) => {
                const { data, status } = results;

                if (status === 200) {
                    const { code, message, group } = data;

                    if (code === 1) {
                        setProductGroupDetails(group);
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

    function addProductGroup(details) {
        const [isValid, error] = validator.validateData(groupsValidatorKey, details);

        if (isValid) {
            const headerParameter = {};
            const httpHeaders = getAuthorizationHeader(headerParameter);

            let productGroup = {
                groupData: details,
            };

            Axios.post('/api/subscription/group/add', productGroup, httpHeaders)
                .then((results) => {
                    const { data, status } = results;

                    if (status === 200) {
                        const { code, message, groups } = data;

                        if (code === 1) {
                            const resStatus = {
                                status: 'success',
                                msg: message,
                            };

                            if (groups) {
                                setAllProductGroups(groups);
                            }

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

            setValidationErrors({});
            setIsAddProductGroupsModalOpen(false);
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

    function editProductGroups(details) {
        const [isValid, error] = validator.validateData(groupsValidatorKey, details);

        if (isValid) {
            const headerParameter = {};
            const httpHeaders = getAuthorizationHeader(headerParameter);

            let productGroup = {
                groupData: details,
            };

            Axios.put('/api/subscription/group/edit', productGroup, httpHeaders)
                .then((results) => {
                    const { data, status } = results;

                    if (status === 200) {
                        const { code, message, groups } = data;

                        if (code === 1) {
                            const resStatus = {
                                status: 'success',
                                msg: message,
                            };

                            if (groups) {
                                setAllProductGroups(groups);
                            }

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

            setIsAddProductGroupsModalOpen(false);
            setIsProductGroupEdit(false);
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

    function deleteProductGroup(groupId) {
        const headerParameter = { groupId: groupId };
        const payload = getAuthorizationHeaderForDelete(headerParameter);

        Axios.delete('/api/subscription/group/delete', payload)
            .then((results) => {
                const { data, status } = results;

                if (status === 200) {
                    const { code, message, groups } = data;

                    if (code === 1) {
                        const resStatus = {
                            status: 'success',
                            msg: message,
                        };

                        if (groups) {
                            setAllProductGroups(groups);
                        }

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

        setIsDeleteProductGroupModalOpen(false);
    }

    function handleProductGroupDetailedView(groupId) {
        getProductGroupDetails(groupId);
        setIsProductGroupDetailsModalOpen(true);
    }

    function handleAddProductGroup() {
        setProductGroupDetails([]);
        setIsAddProductGroupsModalOpen(true);
        setIsProductGroupEdit(false);
    }

    function handleProductGroupEdit(groupId) {
        getProductGroupDetails(groupId);
        setIsAddProductGroupsModalOpen(true);
        setIsProductGroupEdit(true);
    }

    function handleProductGroupDelete(groupId) {
        setSelectedProductGroupId(groupId);
        setIsDeleteProductGroupModalOpen(true);
    }

    return (
        <>
            <div className="row p-3 justify-content-end">
                <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={handleAddProductGroup}
                >
                    Add Product Group
                </button>
            </div>
            <NotificationAlertsComponent responseData={responseData} />
            <div className="table-responsive" id="product-groups">
                <AllGroupsComponent
                    allProductGroups={allProductGroups}
                    handleProductGroupDetailedView={handleProductGroupDetailedView}
                    handleProductGroupEdit={handleProductGroupEdit}
                    handleProductGroupDelete={handleProductGroupDelete}
                />
            </div>
            {isProductGroupDetailsModalOpen && (
                <ProductGroupDetailsComponent
                    productGroupDetails={productGroupDetails}
                    isProductGroupDetailsModalOpen={isProductGroupDetailsModalOpen}
                    setIsProductGroupDetailsModalOpen={setIsProductGroupDetailsModalOpen}
                />
            )}
            {isAddProductGroupModalOpen && (
                <AddProductGroupComponent
                    isAddProductGroupModalOpen={isAddProductGroupModalOpen}
                    setIsAddProductGroupsModalOpen={(status) => {
                        setIsAddProductGroupsModalOpen(status);
                        setValidationErrors({});
                    }}
                    handleConfirme={isProductGroupEdit ? editProductGroups : addProductGroup}
                    productGroupDetails={productGroupDetails}
                    validationErrors={validationErrors}
                    modalTitle={isProductGroupEdit ? "EDIT PRODUCT GROUP" : "ADD PRODUCT GROUP"}
                />
            )}
            {isDeleteProductGroupModalOpen && (
                <DeleteProductGroupComponent
                    isDeleteProductGroupModalOpen={isDeleteProductGroupModalOpen}
                    selectedProductGroupId={selectedProductGroupId}
                    setIsDeleteProductGroupModalOpen={setIsDeleteProductGroupModalOpen}
                    deleteProductGroup={deleteProductGroup}
                />
            )}
        </>
    );
}

export default GroupsComponent;
