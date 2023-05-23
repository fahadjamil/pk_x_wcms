// TODO: Add product form validations
import React, { useEffect, useState } from 'react';
import ConfirmationModal from '../../../shared/ui-components/modals/confirmation-modal';
import { AddSubscriptionPeriodPropTypes } from '../models/SubscriptionPeriodsModel';

function AddSubscriptionPeriodsComponent(props: AddSubscriptionPeriodPropTypes) {
    const [subscriptionPeriodDetails, setSubscriptionPeriodDetails] = useState<any>(undefined);

    useEffect(() => {
        let isMounted: boolean = true;

        if (
            isMounted &&
            props &&
            props.subscriptionPeriodDetails &&
            props.subscriptionPeriodDetails.length > 0
        ) {
            const details = {
                subPeriodId: props.subscriptionPeriodDetails[0].PERIOD_ID,
                periodEn: props.subscriptionPeriodDetails[0].DESCRIPTION_EN,
                periodAr: props.subscriptionPeriodDetails[0].DESCRIPTION_AR,
            };

            setSubscriptionPeriodDetails(details);
        }

        return () => {
            isMounted = false;
        };
    }, [props.subscriptionPeriodDetails]);

    function handleValueChanges(event) {
        const details = { ...subscriptionPeriodDetails };

        details[event.target.name] = event.target.value;
        setSubscriptionPeriodDetails(details);
    }

    function handleConfirme() {
        props.handleConfirme(subscriptionPeriodDetails);
    }

    return (
        <ConfirmationModal
            modalTitle={props.modalTitle}
            show={props.isAddSubscriptionPeriodsModalOpen}
            handleConfirme={handleConfirme}
            handleClose={() => {
                props.setIsAddSubscriptionPeriodsModalOpen(false);
            }}
            size="lg"
        >
            {props?.validationErrors?.common && (
                <div className="form-group">
                    <div className="invalid-feedback d-block">{props.validationErrors.common}</div>
                </div>
            )}
            <div className="form-group">
                <label htmlFor="periodEn">Subscription Period EN</label>
                <input
                    type="text"
                    className={`form-control ${
                        props?.validationErrors?.periodEn ? 'is-invalid' : ''
                    }`}
                    id="periodEn"
                    placeholder="Enter Subscription Period"
                    name="periodEn"
                    value={subscriptionPeriodDetails?.periodEn || ''}
                    onChange={handleValueChanges}
                />
                {props?.validationErrors?.periodEn && (
                    <div className="invalid-feedback d-block">
                        {props.validationErrors.periodEn}
                    </div>
                )}
            </div>
            <div className="form-group">
                <label htmlFor="periodAr">Subscription Period AR</label>
                <input
                    type="text"
                    className={`form-control ${
                        props?.validationErrors?.periodAr ? 'is-invalid' : ''
                    }`}
                    id="periodAr"
                    placeholder="Enter Subscription Period"
                    name="periodAr"
                    value={subscriptionPeriodDetails?.periodAr || ''}
                    onChange={handleValueChanges}
                />
                {props?.validationErrors?.periodAr && (
                    <div className="invalid-feedback d-block">
                        {props.validationErrors.periodAr}
                    </div>
                )}
            </div>
        </ConfirmationModal>
    );
}

export default AddSubscriptionPeriodsComponent;
