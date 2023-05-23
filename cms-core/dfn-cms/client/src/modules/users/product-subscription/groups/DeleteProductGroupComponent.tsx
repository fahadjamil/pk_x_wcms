import React from 'react';
import ConfirmationModal from '../../../shared/ui-components/modals/confirmation-modal';
import { DeleteProductGroupPropTypes } from '../models/ProductGroupsModel';

function DeleteProductGroupComponent(props: DeleteProductGroupPropTypes) {
    const { selectedProductGroupId } = props;

    function handleConfirme() {
        props.deleteProductGroup(selectedProductGroupId);
    }

    return (
        <>
            <ConfirmationModal
                modalTitle="DELETE PRODUCT GROUP"
                show={props.isDeleteProductGroupModalOpen}
                handleConfirme={handleConfirme}
                handleClose={() => {
                    props.setIsDeleteProductGroupModalOpen(false);
                }}
            >
                <div className="alert alert-danger" role="alert">
                    Are you sure you want to delete this Group?
                </div>
            </ConfirmationModal>
        </>
    );
}

export default DeleteProductGroupComponent;
