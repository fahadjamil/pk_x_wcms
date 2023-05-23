import React from 'react';
import ConfirmationModal from '../../../shared/ui-components/modals/confirmation-modal';
import { DeleteProductSubGroupPropTypes } from '../models/ProductSubGroupsModel';

function DeleteProductSubGroupComponent(props: DeleteProductSubGroupPropTypes) {
    const { selectedProductSubGroupId } = props;

    function handleConfirme() {
        props.deleteProductSubGroup(selectedProductSubGroupId);
    }

    return (
        <>
            <ConfirmationModal
                modalTitle="DELETE PRODUCT SUB GROUP"
                show={props.isDeleteProductSubGroupModalOpen}
                handleConfirme={handleConfirme}
                handleClose={() => {
                    props.setIsDeleteProductSubGroupModalOpen(false);
                }}
            >
                <div className="alert alert-danger" role="alert">
                    Are you sure you want to delete this product Sub Group?
                </div>
            </ConfirmationModal>
        </>
    );
}

export default DeleteProductSubGroupComponent;
