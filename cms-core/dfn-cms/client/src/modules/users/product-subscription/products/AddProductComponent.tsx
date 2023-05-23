// TODO: Add product form validations
import React, { useEffect, useState } from 'react';
import ConfirmationModal from '../../../shared/ui-components/modals/confirmation-modal';
import { AddProductPropTypes } from '../models/ProductsModel';

function AddProductComponent(props: AddProductPropTypes) {
    const [productDetails, setProductDetails] = useState<any>(undefined);

    useEffect(() => {
        let isMounted: boolean = true;

        if (isMounted && props && props.productDetails && props.productDetails.length > 0) {
            const details = {
                productId: props.productDetails[0].PRODUCT_ID,
                productEn: props.productDetails[0].PRODUCT_EN,
                productAr: props.productDetails[0].PRODUCT_AR,
                group: props.productDetails[0].GROUP_ID,
                subGroup: props.productDetails[0].SUB_GROUP_ID,
                status: props.productDetails[0].STATUS === 1 ? true : false,
                // vat: props.productDetails[0].VAT ? props.productDetails[0].VAT * 100 : 0.0,
                fees: {},
            };

            for (let detail of props.productDetails) {
                const {
                    PRODUCT_FEE,
                    SUBSCRIPTION_PERIOD_EN,
                    SUBSCRIPTION_PERIOD_ID,
                    PRODUCT_FEE_ID,
                } = detail;

                if (
                    SUBSCRIPTION_PERIOD_ID &&
                    SUBSCRIPTION_PERIOD_EN &&
                    PRODUCT_FEE &&
                    PRODUCT_FEE_ID
                ) {
                    details.fees[
                        `${SUBSCRIPTION_PERIOD_ID}-${SUBSCRIPTION_PERIOD_EN.replace(
                            /\s/g,
                            ''
                        ).toLowerCase()}`
                    ] = {
                        fee: PRODUCT_FEE.toString(),
                        feeId: PRODUCT_FEE_ID,
                    };
                }
            }

            setProductDetails(details);
        }

        return () => {
            isMounted = false;
        };
    }, [props.productDetails]);

    function handleValueChanges(event) {
        const details = { ...productDetails };

        details[event.target.name] = event.target.value;
        setProductDetails(details);
    }

    function handleStatusValueChanges(event) {
        const details = { ...productDetails };

        if (event.target.checked) {
            details[event.target.name] = 1;
        } else {
            details[event.target.name] = 0;
        }

        setProductDetails(details);
    }

    function handleFeesValueChanges(event) {
        const details = { ...productDetails };

        if (!('fees' in details)) {
            details.fees = {};
        }

        if (!(event.target.name in details.fees)) {
            details.fees[event.target.name] = {};
        }

        details.fees[event.target.name].fee = event.target.value;
        setProductDetails(details);
    }

    function handleConfirme() {
        props.addProduct(productDetails);
    }

    return (
        <ConfirmationModal
            modalTitle={props.modalTitle}
            show={props.isAddProductModalOpen}
            handleConfirme={handleConfirme}
            handleClose={() => {
                props.setIsAddProductModalOpen(false);
            }}
            size="lg"
        >
            {props?.validationErrors?.common && (
                <div className="form-group">
                    <div className="invalid-feedback d-block">{props.validationErrors.common}</div>
                </div>
            )}
            <div className="form-group">
                <label htmlFor="productEn">Product EN</label>
                <input
                    type="text"
                    className={`form-control ${
                        props?.validationErrors?.productEn ? 'is-invalid' : ''
                    }`}
                    id="productEn"
                    placeholder="Enter Product"
                    name="productEn"
                    value={productDetails?.productEn || ''}
                    onChange={handleValueChanges}
                />
                {props?.validationErrors?.productEn && (
                    <div className="invalid-feedback d-block">
                        {props.validationErrors.productEn}
                    </div>
                )}
            </div>
            <div className="form-group">
                <label htmlFor="productAr">Product AR</label>
                <input
                    type="text"
                    className={`form-control ${
                        props?.validationErrors?.productAr ? 'is-invalid' : ''
                    }`}
                    id="productAr"
                    placeholder="Enter Product"
                    name="productAr"
                    value={productDetails?.productAr || ''}
                    onChange={handleValueChanges}
                />
                {props?.validationErrors?.productAr && (
                    <div className="invalid-feedback d-block">
                        {props.validationErrors.productAr}
                    </div>
                )}
            </div>
            <div className="form-group">
                <label htmlFor="group">Group</label>
                <select
                    className={`form-control ${props?.validationErrors?.group ? 'is-invalid' : ''}`}
                    id="group"
                    value={productDetails?.group || ''}
                    name="group"
                    onChange={handleValueChanges}
                >
                    <option disabled value="">
                        -- select a group --
                    </option>
                    {props &&
                        props.otherImportantData &&
                        props.otherImportantData.groups &&
                        Array.isArray(props.otherImportantData.groups) &&
                        props.otherImportantData.groups.map((group, index) => {
                            const { DESCRIPTION_EN, GROUP_ID } = group;
                            return (
                                <option key={`group-en-${GROUP_ID}`} value={GROUP_ID}>
                                    {DESCRIPTION_EN}
                                </option>
                            );
                        })}
                </select>
                {props?.validationErrors?.group && (
                    <div className="invalid-feedback d-block">{props.validationErrors.group}</div>
                )}
            </div>
            <div className="form-group">
                <label htmlFor="subGroup">Sub Group</label>
                <select
                    className="form-control"
                    id="subGroup"
                    name="subGroup"
                    value={productDetails?.subGroup || ''}
                    onChange={handleValueChanges}
                >
                    <option disabled value="">
                        -- select a sub group --
                    </option>
                    {props &&
                        props.otherImportantData &&
                        props.otherImportantData.subGroups &&
                        Array.isArray(props.otherImportantData.subGroups) &&
                        props.otherImportantData.subGroups.map((subGroup, index) => {
                            const { DESCRIPTION_EN, SUB_GROUP_ID } = subGroup;
                            return (
                                <option key={`sub-group-en-${SUB_GROUP_ID}`} value={SUB_GROUP_ID}>
                                    {DESCRIPTION_EN}
                                </option>
                            );
                        })}
                </select>
            </div>
            {/* TODO: ADD validation for 99.99 % values */}
            {/* <div className="form-group">
                <label htmlFor="vat">VAT</label>
                <input
                    type="number"
                    className="form-control"
                    id="vat"
                    placeholder="0.00 %"
                    name="vat"
                    value={productDetails?.vat || ''}
                    onChange={handleValueChanges}
                    step="0.01"
                    min="0"
                />
            </div> */}
            <div className="custom-control custom-switch">
                <input
                    type="checkbox"
                    className="custom-control-input"
                    id="status"
                    name="status"
                    checked={productDetails?.status || false}
                    onChange={handleStatusValueChanges}
                ></input>
                <label className="custom-control-label" htmlFor="status">
                    Status
                </label>
            </div>
            <div className="form-group">
                <label>Fees</label>
                {props &&
                    props.otherImportantData &&
                    props.otherImportantData.periods &&
                    Array.isArray(props.otherImportantData.periods) &&
                    props.otherImportantData.periods.map((period, index) => {
                        const { DESCRIPTION_EN, PERIOD_ID } = period;
                        return (
                            <div
                                className="form-group row"
                                key={`period-fee-${DESCRIPTION_EN}-${PERIOD_ID}`}
                            >
                                <label
                                    htmlFor={`${PERIOD_ID}-${DESCRIPTION_EN.replace(
                                        /\s/g,
                                        ''
                                    ).toLowerCase()}`}
                                    className="offset-sm-2 col-sm-3 col-form-label col-form-label-sm"
                                >
                                    {DESCRIPTION_EN}
                                </label>
                                <div className="col-sm-5">
                                    <input
                                        type="number"
                                        className="form-control form-control-sm"
                                        id={`${PERIOD_ID}-${DESCRIPTION_EN.replace(
                                            /\s/g,
                                            ''
                                        ).toLowerCase()}`}
                                        name={`${PERIOD_ID}-${DESCRIPTION_EN.replace(
                                            /\s/g,
                                            ''
                                        ).toLowerCase()}`}
                                        // placeholder="0.00 KWD"
                                        placeholder="0 KWD"
                                        value={
                                            productDetails?.fees?.[
                                                `${PERIOD_ID}-${DESCRIPTION_EN.replace(
                                                    /\s/g,
                                                    ''
                                                ).toLowerCase()}`
                                            ]?.fee || ''
                                        }
                                        onChange={handleFeesValueChanges}
                                        // step="0.01"
                                        // min="0"
                                    />
                                </div>
                            </div>
                        );
                    })}
            </div>
        </ConfirmationModal>
    );
}

export default AddProductComponent;
