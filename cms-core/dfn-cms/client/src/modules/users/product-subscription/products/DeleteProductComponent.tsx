import React from 'react';
import ConfirmationModal from '../../../shared/ui-components/modals/confirmation-modal';
import { DeleteProductPropTypes } from '../models/ProductsModel';

function DeleteProductComponent(props: DeleteProductPropTypes) {
    const { selectedProductId } = props;

    function handleConfirme() {
        props.deleteProduct(selectedProductId);
    }

    return (
        <>
            <ConfirmationModal
                modalTitle="DELETE PRODUCT"
                show={props.isDeleteProductModalOpen}
                handleConfirme={handleConfirme}
                handleClose={() => {
                    props.setIsDeleteProductModalOpen(false);
                }}
            >
                <div className="alert alert-danger" role="alert">
                    Are you sure you want to delete this product?
                </div>
            </ConfirmationModal>
        </>
    );
}

export default DeleteProductComponent;
