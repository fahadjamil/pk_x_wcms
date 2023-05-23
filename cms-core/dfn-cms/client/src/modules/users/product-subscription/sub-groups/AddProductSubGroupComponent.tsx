// TODO: Add product form validations
import React, { useEffect, useState } from 'react';
import ConfirmationModal from '../../../shared/ui-components/modals/confirmation-modal';
import { AddProductSubGroupPropTypes } from '../models/ProductSubGroupsModel';

function AddProductSubGroupComponent(props: AddProductSubGroupPropTypes) {
    const [productSubGroupDetails, setProductSubGroupDetails] = useState<any>(undefined);

    useEffect(() => {
        let isMounted: boolean = true;

        if (
            isMounted &&
            props &&
            props.productSubGroupDetails &&
            props.productSubGroupDetails.length > 0
        ) {
            const details = {
                subGroupId: props.productSubGroupDetails[0].SUB_GROUP_ID,
                subGroupEn: props.productSubGroupDetails[0].PRODUCT_SUB_GROUP_EN,
                subGroupAr: props.productSubGroupDetails[0].PRODUCT_SUB_GROUP_AR,
                group: props.productSubGroupDetails[0].GROUP_ID,
            };

            setProductSubGroupDetails(details);
        }

        return () => {
            isMounted = false;
        };
    }, [props.productSubGroupDetails]);

    function handleValueChanges(event) {
        const details = { ...productSubGroupDetails };

        details[event.target.name] = event.target.value;
        setProductSubGroupDetails(details);
    }

    function handleConfirme() {
        props.handleConfirme(productSubGroupDetails);
    }

    return (
        <ConfirmationModal
            modalTitle={props.modalTitle}
            show={props.isAddProductSubGroupModalOpen}
            handleConfirme={handleConfirme}
            handleClose={() => {
                props.setIsAddProductSubGroupsModalOpen(false);
            }}
            size="lg"
        >
            {props?.validationErrors?.common && (
                <div className="form-group">
                    <div className="invalid-feedback d-block">{props.validationErrors.common}</div>
                </div>
            )}
            <div className="form-group">
                <label htmlFor="subGroupEn">Product Sub Group EN</label>
                <input
                    type="text"
                    className={`form-control ${
                        props?.validationErrors?.subGroupEn ? 'is-invalid' : ''
                    }`}
                    id="subGroupEn"
                    placeholder="Enter Product Sub Group"
                    name="subGroupEn"
                    value={productSubGroupDetails?.subGroupEn || ''}
                    onChange={handleValueChanges}
                />
                {props?.validationErrors?.subGroupEn && (
                    <div className="invalid-feedback d-block">
                        {props.validationErrors.subGroupEn}
                    </div>
                )}
            </div>
            <div className="form-group">
                <label htmlFor="subGroupAr">Product Sub Group AR</label>
                <input
                    type="text"
                    className={`form-control ${
                        props?.validationErrors?.subGroupAr ? 'is-invalid' : ''
                    }`}
                    id="subGroupAr"
                    placeholder="Enter Product Sub Group"
                    name="subGroupAr"
                    value={productSubGroupDetails?.subGroupAr || ''}
                    onChange={handleValueChanges}
                />
                {props?.validationErrors?.subGroupAr && (
                    <div className="invalid-feedback d-block">
                        {props.validationErrors.subGroupAr}
                    </div>
                )}
            </div>
            <div className="form-group">
                <label htmlFor="group">Group</label>
                <select
                    className={`form-control ${props?.validationErrors?.group ? 'is-invalid' : ''}`}
                    id="group"
                    value={productSubGroupDetails?.group || ''}
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
        </ConfirmationModal>
    );
}

export default AddProductSubGroupComponent;
