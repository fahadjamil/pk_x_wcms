import React from 'react';
import PESectionDelete from '../../../shared/resources/PageEditor-Section-Delete';
import PESectionEdit from '../../../shared/resources/PageEditor-Section-Edit';
import ViewDetails from '../../../shared/resources/ViewDetails';
import { AllProductsPropTypes } from '../models/ProductsModel';

function AllProductsComponent(props: AllProductsPropTypes) {
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
        <table className="table-borderless table-hover tbl-thm-01 table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>PRODUCT</th>
                    <th>STATUS</th>
                    <th>GROUP</th>
                    <th>SUB GROUP</th>
                    {/* <th>VAT</th> */}
                    <th className="text-right">ACTIONS</th>
                </tr>
            </thead>
            <tbody>
                {Array.isArray(props.allProducts) &&
                    props.allProducts.map((product, productIndex) => {
                        const {
                            PRODUCT_ID,
                            PRODUCT_EN,
                            STATUS,
                            PRODUCT_GROUP_EN,
                            PRODUCT_SUB_GROUP_EN,
                            VAT,
                        } = product;

                        return (
                            <tr key={`${PRODUCT_ID}-${productIndex}`}>
                                <td>{PRODUCT_ID}</td>
                                <td>{PRODUCT_EN}</td>
                                <td>{getProductStatusById(STATUS)}</td>
                                <td>{PRODUCT_GROUP_EN}</td>
                                <td>{PRODUCT_SUB_GROUP_EN || ''}</td>
                                {/* <td>{VAT ? `${VAT * 100} %` : '0.0 %'}</td> */}
                                <td className="text-right">
                                    <a
                                        type="button"
                                        className="mr-3"
                                        // disabled={isEnable('/api/cms/users/update')}
                                        onClick={(e) => {
                                            props.handleProductEdit(PRODUCT_ID);
                                        }}
                                    >
                                        <PESectionEdit
                                            width="20px"
                                            height="20px"
                                            title="Edit Product"
                                        />
                                    </a>
                                    <a
                                        type="button"
                                        className="mr-3"
                                        onClick={(e) => {
                                            props.handleProductDetailedView(PRODUCT_ID);
                                        }}
                                    >
                                        <ViewDetails
                                            width="20px"
                                            height="20px"
                                            title="View Product Details"
                                        />
                                    </a>
                                    <a
                                        type="button"
                                        className="mr-3"
                                        onClick={(e) => {
                                            props.handleProductDelete(PRODUCT_ID);
                                        }}
                                    >
                                        <PESectionDelete
                                            width="20px"
                                            height="20px"
                                            title="Delete Product"
                                        />
                                    </a>
                                </td>
                            </tr>
                        );
                    })}
            </tbody>
        </table>
    );
}

export default AllProductsComponent;
