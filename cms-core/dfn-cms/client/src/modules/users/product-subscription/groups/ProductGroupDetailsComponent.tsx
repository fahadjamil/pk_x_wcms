import React from 'react';
import NotificationModal from '../../../shared/ui-components/modals/notification-modal';
import { ProductGroupDetailsPropTypes } from '../models/ProductGroupsModel';

function ProductGroupDetailsComponent(props: ProductGroupDetailsPropTypes) {
    return (
        <NotificationModal
            modalTitle="PRODUCT GROUP DETAILS"
            show={props.isProductGroupDetailsModalOpen}
            handleClose={() => {
                props.setIsProductGroupDetailsModalOpen(false);
            }}
            size="lg"
        >
            <div className="table-responsive" id="product-group-details">
                <table className="table table-sm">
                    <tbody>
                        <tr>
                            <th scope="row">ID</th>
                            <td>
                                {props.productGroupDetails &&
                                    props.productGroupDetails[0] &&
                                    props.productGroupDetails[0].GROUP_ID}
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">GROUP</th>
                            <td>
                                {props.productGroupDetails &&
                                    props.productGroupDetails[0] &&
                                    props.productGroupDetails[0].DESCRIPTION_EN}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </NotificationModal>
    );
}

export default ProductGroupDetailsComponent;
