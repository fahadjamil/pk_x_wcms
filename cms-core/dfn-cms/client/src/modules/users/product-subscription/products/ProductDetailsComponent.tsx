import React from 'react';
import NotificationModal from '../../../shared/ui-components/modals/notification-modal';
import { ProductDetailsPropTypes } from '../models/ProductsModel';

function ProductDetailsComponent(props: ProductDetailsPropTypes) {
    function getProductStatusById(statusId) {
        let subStatus;

        switch (statusId) {
            case 0:
                subStatus = <span className="badge badge-secondary">inactive</span>;
                break;
            case 1:
                subStatus = <span className="badge badge-success">active</span>;
                break;
            default:
                subStatus = 'unknown';
        }

        return subStatus;
    }

    return (
        <NotificationModal
            modalTitle="PRODUCT DETAILS"
            show={props.isProductDetailsModalOpen}
            handleClose={() => {
                props.setIsProductDetailsModalOpen(false);
            }}
            size="lg"
        >
            <div className="table-responsive" id="product-details">
                <table className="table table-sm">
                    <tbody>
                        <tr>
                            <th scope="row">ID</th>
                            <td>
                                {props.productDetails &&
                                    props.productDetails[0] &&
                                    props.productDetails[0].PRODUCT_ID}
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">PRODUCT</th>
                            <td>
                                {props.productDetails &&
                                    props.productDetails[0] &&
                                    props.productDetails[0].PRODUCT_EN}
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">STATUS</th>
                            <td>
                                {props.productDetails &&
                                    props.productDetails[0] &&
                                    getProductStatusById(props.productDetails[0].STATUS)}
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">GROUP</th>
                            <td>
                                {props.productDetails &&
                                    props.productDetails[0] &&
                                    props.productDetails[0].PRODUCT_GROUP_EN}
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">SUB GROUP</th>
                            <td>
                                {props.productDetails &&
                                    props.productDetails[0] &&
                                    props.productDetails[0].PRODUCT_SUB_GROUP_EN}
                            </td>
                        </tr>
                        {/* <tr>
                            <th scope="row">VAT</th>
                            <td>
                                {props.productDetails &&
                                props.productDetails[0] &&
                                props.productDetails[0].VAT
                                    ? `${props.productDetails[0].VAT * 100} %`
                                    : '0.0 %'}
                            </td>
                        </tr> */}
                        <tr>
                            <th scope="row">FEES</th>
                            <td>
                                {Array.isArray(props.productDetails) &&
                                    props.productDetails.map((detail, detailIndex) => {
                                        const { SUBSCRIPTION_PERIOD_EN, PRODUCT_FEE } = detail;

                                        return (
                                            <div
                                                className="alert alert-primary mb-2"
                                                role="alert"
                                                key={`product-fee${detailIndex}`}
                                            >
                                                <div
                                                    style={{
                                                        width: '40%',
                                                        display: 'inline-block',
                                                    }}
                                                >
                                                    {SUBSCRIPTION_PERIOD_EN}
                                                </div>
                                                <div
                                                    style={{
                                                        width: '40%',
                                                        display: 'inline-block',
                                                    }}
                                                >
                                                    {`${PRODUCT_FEE || 0} KWD`}
                                                </div>
                                            </div>
                                        );
                                    })}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </NotificationModal>
    );
}

export default ProductDetailsComponent;
