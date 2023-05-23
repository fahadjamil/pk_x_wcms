import React from 'react';
import PESectionDelete from '../../../shared/resources/PageEditor-Section-Delete';
import PESectionEdit from '../../../shared/resources/PageEditor-Section-Edit';
import ViewDetails from '../../../shared/resources/ViewDetails';
import { AllProductSubGroupsPropTypes } from '../models/ProductSubGroupsModel';

function AllSubGroupsComponent(props: AllProductSubGroupsPropTypes) {
    return (
        <table className="table-borderless table-hover tbl-thm-01 table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>SUB GROUP</th>
                    <th>GROUP</th>
                    <th className="text-right">ACTIONS</th>
                </tr>
            </thead>
            <tbody>
                {Array.isArray(props.allProductSubGroups) &&
                    props.allProductSubGroups.map((subGroup, subGroupIndex) => {
                        const { SUB_GROUP_ID, PRODUCT_GROUP_EN, PRODUCT_SUB_GROUP_EN } = subGroup;

                        return (
                            <tr key={`sub-group-${SUB_GROUP_ID}-${subGroupIndex}`}>
                                <td>{SUB_GROUP_ID}</td>
                                <td>{PRODUCT_SUB_GROUP_EN}</td>
                                <td>{PRODUCT_GROUP_EN}</td>
                                <td className="text-right">
                                    <a
                                        type="button"
                                        className="mr-3"
                                        // disabled={isEnable('/api/cms/users/update')}
                                        onClick={(e) => {
                                            props.handleProductSubGroupEdit(SUB_GROUP_ID);
                                        }}
                                    >
                                        <PESectionEdit
                                            width="20px"
                                            height="20px"
                                            title="Edit Product Sub Group"
                                        />
                                    </a>
                                    <a
                                        type="button"
                                        className="mr-3"
                                        onClick={(e) => {
                                            props.handleProductSubGroupDetailedView(SUB_GROUP_ID);
                                        }}
                                    >
                                        <ViewDetails
                                            width="20px"
                                            height="20px"
                                            title="View Product Sub Group Details"
                                        />
                                    </a>
                                    <a
                                        type="button"
                                        className="mr-3"
                                        onClick={(e) => {
                                            props.handleProductSubGroupDelete(SUB_GROUP_ID);
                                        }}
                                    >
                                        <PESectionDelete
                                            width="20px"
                                            height="20px"
                                            title="Delete Product Sub Group"
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

export default AllSubGroupsComponent;
