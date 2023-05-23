import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import Axios from 'axios';
import Cookies from 'universal-cookie/es6';
import ProductItem from './ProductItem';
import { Modal } from 'react-bootstrap';

const SubscriptionForm = styled.div``;

const ProdGroupRow = styled.h2`
    margin: 2rem 0 1rem 0;
`;

const ProdSubGroupRow = styled.h3`
    font-size: 16px;
    font-weight: 600;
`;

const SpanError = styled.span`
    display: flex;
    justify-content: center;
    color: red;
    padding-top: 8px;
    padding-bottom: 3px;
`;

const SpanSuccess = styled.span`
    display: flex;
    justify-content: center;
    color: green;
    padding-top: 8px;
    padding-bottom: 3px;
`;

const SpanWarning = styled.span`
    display: flex;
    justify-content: center;
    color: orange;
    padding-top: 8px;
    padding-bottom: 3px;
`;

const ButtonSave = styled.button`
    background: #c6974b;
    color: #fff;
    font-weight: 500;
    font-size: 14px;
`;

const ButtonReset = styled.button`
    background: #bfbfbf;
    color: #fff;
    font-weight: 500;
    font-size: 14px;
`;

export const ProductSubscriptionForm = (props) => {
    const { commonConfigs, dbName } = props;
    const selectedLanguage = props.lang;
    const { data, styles, settings } = props.data;
    // const loginId = '6'; // TODO: Set value
    let currentLangKey = '';
    let [formEdited, setFormEdited] = useState(false); // For handle save-reset buttons
    let [formDisabled, setFormDisabled] = useState(false); // For disable product items
    let [formReset, setFormReset] = useState(false); // For reset product items

    let [showConfirm, setShowConfirm] = useState(false);
    let [paybleAmount, setPaybleAmount] = useState(0);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState(false);
    const [warning, setWarning] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [warningMessage, setWarningMessage] = useState('');
    const [customerAgreement, setCustomerAgreement] = useState(undefined);

    let [periods, setPeriods] = useState([]);
    let [fees, setFees] = useState([]);
    let [products, setProducts] = useState([]);
    let [productData, setProductData] = useState([]);
    let [savedSubscriptions, setSavedSubscriptions] = useState([]);
    const [changedSubscriptions, setChangedSubscriptions] = useState([]);
    const cookies = new Cookies();

    // let [savedSubscriptionsMap, setSavedSubscriptionsMap] = useState(new Map());
    // let [changedSubscriptionsMap, setChangedSubscriptionsMap] = useState(new Map());

    // const updateSavedSubscriptionsMap = (k,v) => {
    //   setSavedSubscriptionsMap(new Map(savedSubscriptionsMap.set(k,v)));
    // }

    // const updateChangedSubscriptionsMap = (k,v) => {
    //   setChangedSubscriptionsMap(new Map(changedSubscriptionsMap.set(k,v)));
    // }

    let loginId = cookies.get('bk_login_id') ? cookies.get('bk_login_id') : undefined;

    useEffect(() => {
        Axios.get('/api/web/subscription/product-details?loginId=' + loginId).then((res) => {
            if (res.data.code === 1) {
                if (
                    res.data &&
                    res.data.products &&
                    res.data.groups &&
                    res.data['sub-groups'] &&
                    res.data.periods &&
                    res.data.fees &&
                    res.data.subscriptions
                ) {
                    setProducts(res.data.products);
                    setPeriods(res.data.periods);
                    setFees(res.data.fees);

                    const subscriptionsCopy = [];

                    res.data.subscriptions.forEach((element) => {
                        subscriptionsCopy.push({ ...element });
                    });

                    setChangedSubscriptions(subscriptionsCopy);
                    setSavedSubscriptions(res.data.subscriptions);

                    let productDataList = [];

                    for (let i = 0; i < res.data.groups.length; i++) {
                        if (productDataList) {
                            const groupName = res.data.groups[i].DESCRIPTION_EN;
                            productDataList.push({
                                grp_id: res.data.groups[i].GROUP_ID,
                                grp_name: groupName,
                                sub_grps: [],
                                products: [],
                            });
                        }
                    }

                    for (let i = 0; i < res.data['sub-groups'].length; i++) {
                        for (let x = 0; x < productDataList.length; x++) {
                            if (
                                parseInt(productDataList[x].grp_id) ===
                                res.data['sub-groups'][i].GROUP_ID
                            ) {
                                if (
                                    productDataList[x].sub_grps &&
                                    !productDataList[x].sub_grps[res.data['sub-groups'][i].GROUP_ID]
                                ) {
                                    const subGroupName = res.data['sub-groups'][i].DESCRIPTION_EN;
                                    productDataList[x].sub_grps.push({
                                        sub_grp_id: res.data['sub-groups'][i].SUB_GROUP_ID,
                                        sub_grp_name: subGroupName,
                                        products: [],
                                    });
                                }
                            }
                        }
                    }

                    for (let i = 0; i < res.data.products.length; i++) {
                        if (res.data.products[i].SUB_GROUP_ID) {
                            for (let x = 0; x < productDataList.length; x++) {
                                if (productDataList[x].sub_grps) {
                                    for (let y = 0; y < productDataList[x].sub_grps.length; y++) {
                                        if (
                                            productDataList[x].sub_grps[y] &&
                                            parseInt(productDataList[x].sub_grps[y].sub_grp_id) ===
                                                res.data.products[i].SUB_GROUP_ID
                                        ) {
                                            productDataList[x].sub_grps[y].products.push(
                                                getUpdatedProduct(
                                                    res.data.subscriptions,
                                                    res.data.products[i]
                                                )
                                            );
                                        }
                                    }
                                }
                            }
                        } else if (res.data.products[i].GROUP_ID) {
                            for (let x = 0; x < productDataList.length; x++) {
                                if (
                                    productDataList[x].products &&
                                    parseInt(productDataList[x].grp_id) ===
                                        res.data.products[i].GROUP_ID
                                ) {
                                    productDataList[x].products.push(
                                        getUpdatedProduct(
                                            res.data.subscriptions,
                                            res.data.products[i]
                                        )
                                    );
                                }
                            }
                        }
                    }

                    setProductData(productDataList);
                } else {
                    setError(true);
                    setErrorMessage('Please login in order to load the products.');

                    setTimeout(() => {
                        setError(false);
                        setErrorMessage('');
                    }, 3000);
                }
            } else {
                setError(true);
                setErrorMessage('Please login in order to load the products.');

                setTimeout(() => {
                    setError(false);
                    setErrorMessage('');
                }, 3000);
            }
        });
    }, []);

    const getUpdatedProduct = (subscriptions, product) => {
        product['SUBSCRIBED'] = false;
        product['PERIOD_ID'] = 0;

        // TODO: use savedSubscriptions
        for (let i = 0; i < subscriptions.length; i++) {
            if (subscriptions[i].PRODUCT_ID == product.PRODUCT_ID) {
                product['SUBSCRIBED'] = true;
                product['PERIOD_ID'] = parseInt(subscriptions[i].PERIOD_ID);
                product['EXP_DATE'] = new Date(subscriptions[i].EXPIRY_DATE);
            }
        }
        return product;
    };

    const getProductFeeForPeriod = (prodId, periodId) => {
        const productFees = getProductFees(prodId);

        for (let i = 0; i < productFees.length; i++) {
            if (parseInt(periodId) === parseInt(productFees[i].PERIOD_ID)) {
                return parseInt(productFees[i].FEE);
            }
        }

        return 0;
    };

    const getProductPeriods = (prodId, periodId) => {
        const productFees = getProductFees(prodId);

        let filteredPeriods = [];

        if (periodId === 0) {
            filteredPeriods.push(
                <option key="0" value="0">
                    Select
                </option>
            );
        }

        for (let i = 0; i < productFees.length; i++) {
            for (let x = 0; x < periods.length; x++) {
                // if (parseInt(periods[x].PERIOD_ID) === parseInt(productFees[i].PERIOD_ID) && parseInt(periods[x].PERIOD_ID) >= periodId) {
                if (parseInt(periods[x].PERIOD_ID) === parseInt(productFees[i].PERIOD_ID)) {
                    filteredPeriods.push(
                        <option key={periods[x].PERIOD_ID} value={periods[x].PERIOD_ID}>
                            {periods[x].DESCRIPTION_EN}
                        </option>
                    );
                    break;
                }
            }
        }

        return filteredPeriods;
    };

    const getProductFees = (prodId) => {
        let filteredFees = [];
        for (let i = 0; i < fees.length; i++) {
            if (fees[i].PRODUCT_ID === prodId) {
                filteredFees.push(fees[i]);
            }
        }
        return filteredFees;
    };

    const getProducts = () => {
        let result = [];

        productData.forEach((group) => {
            result.push(
                <ProdGroupRow key={'grp_' + group.grp_id}>
                    <span> {group.grp_name} </span>
                </ProdGroupRow>
            );

            if (group.products) {
                group.products.forEach((product) => {
                    result.push(
                        <ProductItem
                            key={product.PRODUCT_ID}
                            product={product}
                            periods={getProductPeriods(product.PRODUCT_ID, product.PERIOD_ID)}
                            fees={getProductFees(product.PRODUCT_ID)}
                            productsDataHandler={productsDataHandler}
                            formDisabled={formDisabled}
                            formReset={formReset}
                        />
                    );
                });
            }

            if (group.sub_grps) {
                group.sub_grps.forEach((subGroup) => {
                    result.push(
                        <ProdSubGroupRow key={'sub_grp_' + subGroup.sub_grp_id}>
                            {subGroup.sub_grp_name}
                        </ProdSubGroupRow>
                    );

                    if (subGroup.products) {
                        subGroup.products.forEach((product) => {
                            result.push(
                                <ProductItem
                                    key={product.PRODUCT_ID}
                                    product={product}
                                    periods={getProductPeriods(
                                        product.PRODUCT_ID,
                                        product.PERIOD_ID
                                    )}
                                    fees={getProductFees(product.PRODUCT_ID)}
                                    productsDataHandler={productsDataHandler}
                                    formDisabled={formDisabled}
                                    formReset={formReset}
                                />
                            );
                        });
                    }
                });
            }
        });

        return <div>{result}</div>;
    };

    const productsDataHandler = (dataEvent) => {
        setFormEdited(true);

        /*
    if (dataEvent.control === 1) {

      // if (changedSubscriptionsMap.has(dataEvent.productId)) {
      if (isSubscribed(dataEvent.productId)) {
        alert('Has');
        changedSubscriptionsMap.delete(dataEvent.productId);
      }     
    } else if (dataEvent.control === 2) {
      // if (changedSubscriptionsMap.has(dataEvent.productId)) {
      //   changedSubscriptionsMap.set(dataEvent.productId, dataEvent.value);         
      // } else {
      //   changedSubscriptionsMap.set(dataEvent.productId, dataEvent.value); 
      // }
      // Add or Update
      updateChangedSubscriptionsMap(dataEvent.productId, dataEvent.value);  
    }
    */

        /*
    let changedSubscriptionsCopy = [...changedSubscriptions];  

    if (dataEvent.control === 1) {

      for (let i = 0; i < changedSubscriptionsCopy.length; i++) {
        
        if (changedSubscriptionsCopy[i].PRODUCT_ID === dataEvent.productId) {
          changedSubscriptionsCopy.splice(i, 1);
        }
      }      
    } else if (dataEvent.control === 2) {
      let isNewProduct = true;

      for (let i = 0; i < changedSubscriptionsCopy.length; i++) {      

        if (changedSubscriptionsCopy[i].PRODUCT_ID === dataEvent.productId) {
          isNewProduct = false;
          
          changedSubscriptionsCopy[i].PERIOD_ID = dataEvent.value;
          break;
        }
      }

      if (isNewProduct){
        let newSubscription = {};
        newSubscription['PRODUCT_ID'] = dataEvent.productId;
        newSubscription['PERIOD_ID'] = dataEvent.value;

        changedSubscriptionsCopy.push(newSubscription)
      }      
    }

    setChangedSubscriptions([...changedSubscriptionsCopy]);
    */

        if (dataEvent.control === 1) {
            for (let i = 0; i < changedSubscriptions.length; i++) {
                if (changedSubscriptions[i].PRODUCT_ID === dataEvent.productId) {
                    changedSubscriptions.splice(i, 1);
                }
            }
        } else if (dataEvent.control === 2) {
            let isNewProduct = true;

            for (let i = 0; i < changedSubscriptions.length; i++) {
                if (changedSubscriptions[i].PRODUCT_ID === dataEvent.productId) {
                    isNewProduct = false;

                    changedSubscriptions[i].PERIOD_ID = dataEvent.value;
                    break;
                }
            }

            if (isNewProduct) {
                let newSubscription = {};
                newSubscription['PRODUCT_ID'] = dataEvent.productId;
                newSubscription['PERIOD_ID'] = dataEvent.value;

                changedSubscriptions.push(newSubscription);
            }
        }
    };

    const saveClick = () => {
        let oldMap = new Map();
        let newMap = new Map();
        let amount = 0;
        let pendingChangesAvailable = false;

        savedSubscriptions.forEach((element) => {
            oldMap.set(element.PRODUCT_ID, element.PERIOD_ID);
        });

        changedSubscriptions.forEach((element) => {
            newMap.set(element.PRODUCT_ID, element.PERIOD_ID);
        });

        products.forEach((product) => {
            if (oldMap.has(product.PRODUCT_ID)) {
                if (newMap.has(product.PRODUCT_ID)) {
                    if (oldMap.get(product.PRODUCT_ID) < newMap.get(product.PRODUCT_ID)) {
                        // Upgrade
                        console.log('Upgrade');
                        pendingChangesAvailable = true;
                        amount =
                            amount +
                            getProductFeeForPeriod(
                                product.PRODUCT_ID,
                                newMap.get(product.PRODUCT_ID)
                            );
                    } else if (oldMap.get(product.PRODUCT_ID) > newMap.get(product.PRODUCT_ID)) {
                        // Downgrade (Not support)
                        // pendingChangesAvailable = true;
                    }
                } else {
                    // Remove
                    console.log('Remove');
                    pendingChangesAvailable = true;
                }
            } else if (newMap.has(product.PRODUCT_ID)) {
                // Add New
                console.log('Add New');
                pendingChangesAvailable = true;
                amount =
                    amount +
                    getProductFeeForPeriod(product.PRODUCT_ID, newMap.get(product.PRODUCT_ID));
            }
        });

        if (pendingChangesAvailable) {
            setPaybleAmount(amount);
            setFormEdited(false);
            setFormDisabled(true);
            // setShowConfirm(true);
            getCustomerAgreement();
        } else {
            setFormEdited(false);

            setWarningMessage('No Pending changes to save');
            setWarning(true);

            setTimeout(() => {
                setWarningMessage('');
                setWarning(false);
            }, 3000);
        }
    };

    const resetClick = () => {
        setFormEdited(false);

        if (formReset) {
            setFormReset(false);
        } else {
            setFormReset(true);
        }

        const subscriptionsCopy = [];
        savedSubscriptions.forEach((element) => {
            subscriptionsCopy.push({ ...element });
        });

        setChangedSubscriptions(subscriptionsCopy);
    };

    if (typeof window !== 'undefined') {
        const currentPathName = window.location.pathname;

        if (currentPathName.length > 0) {
            currentLangKey = currentPathName.split('/')[1];
            console.log('currentLangKey: ', currentLangKey);
        }
    }

    const saveContinueClick = () => {
        setShowConfirm(false);

        let subscriptionRequest = {
            loginId: loginId,
            paybleAmount: paybleAmount,
            lang: currentLangKey,
            subscriptions: changedSubscriptions,
        };

        Axios.post(`/api/web/subscription/product-subscription`, subscriptionRequest).then(
            (res) => {
                if (res.data.code == 1) {
                    setSuccess(true);
                    setSuccessMessage('Subscriptions Saved Successfully');

                    setTimeout(() => {
                        setSuccess(false);
                        setSuccessMessage('');
                    }, 3000);
                    // TODO: Navigate to payment screen here
                    console.log('subscription Knet response', res.data);

                    if (typeof window !== 'undefined') {
                        window.location = res.data.response_url;
                    }
                } else {
                    setFormDisabled(false);
                    setFormEdited(true);

                    setError(true);
                    setErrorMessage('Error Occurred, Please Try Again');

                    setTimeout(() => {
                        setError(false);
                        setErrorMessage('');
                    }, 3000);
                }
            }
        );
    };

    const saveCancelClick = () => {
        setShowConfirm(false);
        setFormEdited(true);
        setFormDisabled(false);
    };

    const getCustomerAgreement = () => {
        if (
            settings &&
            settings.hasOwnProperty('productSubscription') &&
            settings.productSubscription.hasOwnProperty('value')
        ) {
            const { collection, documentId } = settings.productSubscription.value;

            if (collection && documentId && dbName) {
                Axios.get('/api/cms/getSingleDocumentById', {
                    params: {
                        searchId: documentId,
                        nameSpace: dbName,
                        collectionName: collection,
                    },
                })
                    .then((response) => {
                        const { status, data } = response;

                        if (status === 200) {
                            const agreementData = agreementBySelectedLanguage(data);
                            setCustomerAgreement(agreementData);
                        }
                    })
                    .catch(function (error) {
                        console.log(error);
                    });
            }
        }
    };

    const agreementBySelectedLanguage = (agreementDoc) => {
        if (agreementDoc && agreementDoc.hasOwnProperty('fieldData')) {
            if (selectedLanguage && selectedLanguage.langKey) {
                let data = agreementDoc.fieldData[selectedLanguage.langKey];

                if (data) {
                    const { content, title } = data;

                    if (content) {
                        return {
                            isAvailable: true,
                            data: <div dangerouslySetInnerHTML={{ __html: content }} />,
                            title: title || 'Customer Agreement',
                        };
                    }
                }
            }
        }

        return {
            isAvailable: false,
            data: <div>Customer agreement not found.</div>,
            title: 'Customer Agreement',
        };
    };

    return (
        <SubscriptionForm>
            <ul>{getProducts()}</ul>
            <div className="text-right">
                <ButtonReset
                    className="btn btn-product-reset mx-3"
                    disabled={!formEdited}
                    onClick={resetClick}
                >
                    Reset
                </ButtonReset>
                <ButtonSave
                    className="btn btn-product-save"
                    disabled={!formEdited}
                    onClick={saveClick}
                >
                    Save
                </ButtonSave>
            </div>
            {customerAgreement && (
                <Modal show={customerAgreement.isAvailable} size="xl">
                    <Modal.Header closeButton>
                        <Modal.Title>{customerAgreement.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{customerAgreement.data}</Modal.Body>
                    <Modal.Footer>
                        <button
                            className="btn btn-outline-success"
                            onClick={() => {
                                setShowConfirm(true);
                                setCustomerAgreement(undefined);
                            }}
                        >
                            I Agree
                        </button>
                        <button
                            className="btn btn-outline-danger"
                            onClick={() => {
                                setCustomerAgreement(undefined);
                            }}
                        >
                            Cancel
                        </button>
                    </Modal.Footer>
                </Modal>
            )}
            <Modal show={showConfirm}>
                <Modal.Body>
                    You have to pay {paybleAmount} KWD. Please continue to preceed.
                </Modal.Body>
                <Modal.Footer>
                    <button className="btn btn-outline-success" onClick={saveContinueClick}>
                        Continue
                    </button>
                    <button className="btn btn-outline-danger" onClick={saveCancelClick}>
                        Cancel
                    </button>
                </Modal.Footer>
            </Modal>
            {warning && (
                <div className="alert alert-warning alert-dismissible fade show mt-2" role="alert">
                    {warningMessage}
                    <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            )}
            {error && (
                <div className="alert alert-danger alert-dismissible fade show mt-2" role="alert">
                    {errorMessage}
                    <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            )}
            {success && (
                <div className="alert alert-success alert-dismissible fade show mt-2" role="alert">
                    {successMessage}
                    <button type="button" className="close" data-dismiss="alert" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
            )}
        </SubscriptionForm>
    );
};
