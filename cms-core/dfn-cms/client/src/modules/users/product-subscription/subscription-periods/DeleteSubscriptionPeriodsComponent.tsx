import React from 'react';
import ConfirmationModal from '../../../shared/ui-components/modals/confirmation-modal';
import { DeleteSubscriptionPeriodPropTypes } from '../models/SubscriptionPeriodsModel';

function DeleteSubscriptionPeriodsComponent(props: DeleteSubscriptionPeriodPropTypes) {
    const { selectedSubscriptionPeriodId } = props;

    function handleConfirme() {
        props.deleteSubscriptionPeriod(selectedSubscriptionPeriodId);
    }

    return (
        <>
            <ConfirmationModal
                modalTitle="DELETE SUBSCRIPTION PERIOD"
                show={props.isDeleteSubscriptionPeriodModalOpen}
                handleConfirme={handleConfirme}
                handleClose={() => {
                    props.setIsDeleteSubscriptionPeriodModalOpen(false);
                }}
            >
                <div className="alert alert-danger" role="alert">
                    Are you sure you want to delete this subscription period?
                </div>
            </ConfirmationModal>
        </>
    );
}

export default DeleteSubscriptionPeriodsComponent;
