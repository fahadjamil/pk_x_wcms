import React from 'react';
import NotificationModal from '../../../shared/ui-components/modals/notification-modal';
import { ProductSubGroupDetailsPropTypes } from '../models/ProductSubGroupsModel';

function ProductSubGroupDetailsComponent(props: ProductSubGroupDetailsPropTypes) {
    return (
        <NotificationModal
            modalTitle="PRODUCT SUB GROUP DETAILS"
            show={props.isProductSubGroupDetailsModalOpen}
            handleClose={() => {
                props.setIsProductSubGroupDetailsModalOpen(false);
            }}
            size="lg"
        >
            <div className="table-responsive" id="product-subgroup-details">
                <table className="table table-sm">
                    <tbody>
                        <tr>
                            <th scope="row">ID</th>
                            <td>
                                {props.productSubGroupDetails &&
                                    props.productSubGroupDetails[0] &&
                                    props.productSubGroupDetails[0].SUB_GROUP_ID}
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">SUB GROUP</th>
                            <td>
                                {props.productSubGroupDetails &&
                                    props.productSubGroupDetails[0] &&
                                    props.productSubGroupDetails[0].PRODUCT_SUB_GROUP_EN}
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">GROUP</th>
                            <td>
                                {props.productSubGroupDetails &&
                                    props.productSubGroupDetails[0] &&
                                    props.productSubGroupDetails[0].PRODUCT_GROUP_EN}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </NotificationModal>
    );
}

export default ProductSubGroupDetailsComponent;
