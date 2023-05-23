// TODO: Add product form validations
import React, { useEffect, useState } from 'react';
import ConfirmationModal from '../../../shared/ui-components/modals/confirmation-modal';
import { AddProductGroupPropTypes } from '../models/ProductGroupsModel';

function AddProductGroupComponent(props: AddProductGroupPropTypes) {
    const [productGroupDetails, setProductGroupDetails] = useState<any>(undefined);

    useEffect(() => {
        let isMounted: boolean = true;

        if (
            isMounted &&
            props &&
            props.productGroupDetails &&
            props.productGroupDetails.length > 0
        ) {
            const details = {
                groupId: props.productGroupDetails[0].GROUP_ID,
                groupEn: props.productGroupDetails[0].DESCRIPTION_EN,
                groupAr: props.productGroupDetails[0].DESCRIPTION_AR,
            };

            setProductGroupDetails(details);
        }

        return () => {
            isMounted = false;
        };
    }, [props.productGroupDetails]);

    function handleValueChanges(event) {
        const details = { ...productGroupDetails };

        details[event.target.name] = event.target.value;
        setProductGroupDetails(details);
    }

    function handleConfirme() {
        props.handleConfirme(productGroupDetails);
    }

    return (
        <ConfirmationModal
            modalTitle={props.modalTitle}
            show={props.isAddProductGroupModalOpen}
            handleConfirme={handleConfirme}
            handleClose={() => {
                props.setIsAddProductGroupsModalOpen(false);
            }}
            size="lg"
        >
            {props?.validationErrors?.common && (
                <div className="form-group">
                    <div className="invalid-feedback d-block">{props.validationErrors.common}</div>
                </div>
            )}
            <div className="form-group">
                <label htmlFor="subGroupEn">Product Group EN</label>
                <input
                    type="text"
                    className={`form-control ${
                        props?.validationErrors?.groupEn ? 'is-invalid' : ''
                    }`}
                    id="groupEn"
                    placeholder="Enter Product Group"
                    name="groupEn"
                    value={productGroupDetails?.groupEn || ''}
                    onChange={handleValueChanges}
                />
                {props?.validationErrors?.groupEn && (
                    <div className="invalid-feedback d-block">{props.validationErrors.groupEn}</div>
                )}
            </div>
            <div className="form-group">
                <label htmlFor="groupAr">Product Group AR</label>
                <input
                    type="text"
                    className={`form-control ${
                        props?.validationErrors?.groupAr ? 'is-invalid' : ''
                    }`}
                    id="groupAr"
                    placeholder="Enter Product Group"
                    name="groupAr"
                    value={productGroupDetails?.groupAr || ''}
                    onChange={handleValueChanges}
                />
                {props?.validationErrors?.groupAr && (
                    <div className="invalid-feedback d-block">{props.validationErrors.groupAr}</div>
                )}
            </div>
        </ConfirmationModal>
    );
}

export default AddProductGroupComponent;
