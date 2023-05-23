import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import PESectionDelete from '../../../shared/resources/PageEditor-Section-Delete';
import PESectionEdit from '../../../shared/resources/PageEditor-Section-Edit';
import ViewDetails from '../../../shared/resources/ViewDetails';
import NotificationAlertsComponent from '../../../shared/ui-components/alerts/NotificationAlertsComponent';
import {
    getAuthorizationHeader,
    getAuthorizationHeaderForDelete,
} from '../../../shared/utils/AuthorizationUtils';
import validator from '../../../shared/utils/Validator';
import AddProductComponent from './AddProductComponent';
import AllProductsComponent from './AllProductsComponent';
import DeleteProductComponent from './DeleteProductComponent';
import ProductDetailsComponent from './ProductDetailsComponent';

export const productsValidationSchema = {
    productEn: {
        type: 'string',
        empty: false,
        messages: {
            required: 'This field is required',
            string: 'This field is required and it must be a string.',
            stringEmpty: 'This field is required.',
        },
    },
    productAr: {
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

function ProductsComponent(props) {
    const { website } = props;
    const [allProducts, setAllProducts] = useState([]);
    const [productDetails, setProductDetails] = useState<any>([]);
    const [otherImportantData, setOtherImportantData] = useState<any>({});
    const [isProductDetailsModalOpen, setIsProductDetailsModalOpen] = useState(false);
    const [isAddProductModalOpen, setIsAddProductModalOpen] = useState(false);
    const [isDeleteProductModalOpen, setIsDeleteProductModalOpen] = useState(false);
    const [isProductEdit, setIsProductEdit] = useState(false);
    const [selectedProductId, setSelectedProductId] = useState<number | undefined>(undefined);
    const [responseData, setResponseData] = useState<any>(undefined);
    const [validationErrors, setValidationErrors] = useState<any>({});
    const productsValidatorKey = 'productsValidatorKey';

    useEffect(() => {
        let isMounted: boolean = true;

        if (isMounted) {
            getAllProducts();
            validator.setValidatorSchema(productsValidatorKey, productsValidationSchema);
        }

        return () => {
            isMounted = false;
        };
    }, [website]);

    function getAllProducts() {
        const headerParameter = {};
        const httpHeaders = getAuthorizationHeader(headerParameter);

        Axios.get('/api/subscription/products', httpHeaders)
            .then((results) => {
                const { data, status } = results;

                if (status === 200) {
                    const { code, message, products } = data;

                    if (code === 1) {
                        setAllProducts(products);
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

    function getProductDetails(productId) {
        const headerParameter = { productId: productId };
        const httpHeaders = getAuthorizationHeader(headerParameter);

        Axios.get('/api/subscription/product', httpHeaders)
            .then((results) => {
                const { data, status } = results;

                if (status === 200) {
                    const { code, message, product } = data;

                    if (code === 1) {
                        setProductDetails(product);
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

    // Get all groups, sub groups and periods
    function getAllNecessaryDataForAddProductModal(PRODUCT_ID = undefined) {
        const headerParameter = { productId: PRODUCT_ID };
        const httpHeaders = getAuthorizationHeader(headerParameter);

        Axios.get('/api/subscription/product/other-data', httpHeaders)
            .then((results) => {
                const { data, status } = results;

                if (status === 200) {
                    const { code, message, otherData, product } = data;

                    if (code === 1) {
                        setOtherImportantData(otherData);

                        if (product) {
                            setProductDetails(product);
                        } else {
                            setProductDetails([]);
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

    function handleProductDetailedView(productId) {
        getProductDetails(productId);
        setIsProductDetailsModalOpen(true);
    }

    function handleAddProduct() {
        setProductDetails([]);
        getAllNecessaryDataForAddProductModal();
        setIsAddProductModalOpen(true);
        setIsProductEdit(false);
    }

    function addProduct(details) {
        const [isValid, error] = validator.validateData(productsValidatorKey, details);

        if (isValid) {
            const headerParameter = {};
            const httpHeaders = getAuthorizationHeader(headerParameter);

            let product = {
                productData: details,
            };

            Axios.post('/api/subscription/product/add', product, httpHeaders)
                .then((results) => {
                    const { data, status } = results;

                    if (status === 200) {
                        const { code, message, products } = data;

                        if (code === 1) {
                            if (products) {
                                setAllProducts(products);
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

            setIsAddProductModalOpen(false);
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

    function editProduct(details) {
        const [isValid, error] = validator.validateData(productsValidatorKey, details);

        if (isValid) {
            const headerParameter = {};
            const httpHeaders = getAuthorizationHeader(headerParameter);

            let product = {
                productData: details,
            };

            Axios.put('/api/subscription/product/edit', product, httpHeaders)
                .then((results) => {
                    const { data, status } = results;

                    if (status === 200) {
                        const { code, message, products } = data;

                        if (code === 1) {
                            if (products) {
                                setAllProducts(products);
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

            setIsAddProductModalOpen(false);
            setIsProductEdit(false);
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

    function deleteProduct(productId) {
        const headerParameter = { productId: productId };
        const payload = getAuthorizationHeaderForDelete(headerParameter);

        Axios.delete('/api/subscription/product/delete', payload)
            .then((results) => {
                const { data, status } = results;

                if (status === 200) {
                    const { code, message, products } = data;

                    if (code === 1) {
                        if (products) {
                            setAllProducts(products);
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

        setIsDeleteProductModalOpen(false);
    }

    function handleProductEdit(PRODUCT_ID) {
        getAllNecessaryDataForAddProductModal(PRODUCT_ID);
        setIsAddProductModalOpen(true);
        setIsProductEdit(true);
    }

    function handleProductDelete(productId) {
        setSelectedProductId(productId);
        setIsDeleteProductModalOpen(true);
    }

    return (
        <>
            <div className="row p-3 justify-content-end">
                <button type="button" className="btn btn-primary btn-sm" onClick={handleAddProduct}>
                    Add Product
                </button>
            </div>
            <NotificationAlertsComponent responseData={responseData} />
            <div className="table-responsive" id="products">
                <AllProductsComponent
                    allProducts={allProducts}
                    handleProductDetailedView={handleProductDetailedView}
                    handleProductEdit={handleProductEdit}
                    handleProductDelete={handleProductDelete}
                />
            </div>
            {isProductDetailsModalOpen && (
                <ProductDetailsComponent
                    productDetails={productDetails}
                    isProductDetailsModalOpen={isProductDetailsModalOpen}
                    setIsProductDetailsModalOpen={setIsProductDetailsModalOpen}
                />
            )}
            {isAddProductModalOpen && (
                <AddProductComponent
                    isAddProductModalOpen={isAddProductModalOpen}
                    otherImportantData={otherImportantData}
                    setIsAddProductModalOpen={(status) => {
                        setIsAddProductModalOpen(status);
                        setValidationErrors({});
                    }}
                    addProduct={isProductEdit ? editProduct : addProduct}
                    productDetails={productDetails}
                    validationErrors={validationErrors}
                    modalTitle={isProductEdit ? 'EDIT PRODUCT' : 'ADD PRODUCT'}
                />
            )}
            {isDeleteProductModalOpen && (
                <DeleteProductComponent
                    isDeleteProductModalOpen={isDeleteProductModalOpen}
                    selectedProductId={selectedProductId}
                    setIsDeleteProductModalOpen={setIsDeleteProductModalOpen}
                    deleteProduct={deleteProduct}
                />
            )}
        </>
    );
}

export default ProductsComponent;
