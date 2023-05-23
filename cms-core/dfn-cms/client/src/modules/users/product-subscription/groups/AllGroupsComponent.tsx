import React from 'react';
import PESectionDelete from '../../../shared/resources/PageEditor-Section-Delete';
import PESectionEdit from '../../../shared/resources/PageEditor-Section-Edit';
import ViewDetails from '../../../shared/resources/ViewDetails';
import { AllProductGroupsPropTypes } from '../models/ProductGroupsModel';

function AllGroupsComponent(props: AllProductGroupsPropTypes) {
    return (
        <table className="table-borderless table-hover tbl-thm-01 table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>GROUP</th>
                    <th className="text-right">ACTIONS</th>
                </tr>
            </thead>
            <tbody>
                {Array.isArray(props.allProductGroups) &&
                    props.allProductGroups.map((group, groupIndex) => {
                        const { GROUP_ID, DESCRIPTION_EN } = group;

                        return (
                            <tr key={`group-${GROUP_ID}-${groupIndex}`}>
                                <td>{GROUP_ID}</td>
                                <td>{DESCRIPTION_EN}</td>
                                <td className="text-right">
                                    <a
                                        type="button"
                                        className="mr-3"
                                        // disabled={isEnable('/api/cms/users/update')}
                                        onClick={(e) => {
                                            props.handleProductGroupEdit(GROUP_ID);
                                        }}
                                    >
                                        <PESectionEdit
                                            width="20px"
                                            height="20px"
                                            title="Edit Product Group"
                                        />
                                    </a>
                                    <a
                                        type="button"
                                        className="mr-3"
                                        onClick={(e) => {
                                            props.handleProductGroupDetailedView(GROUP_ID);
                                        }}
                                    >
                                        <ViewDetails
                                            width="20px"
                                            height="20px"
                                            title="View Product Group Details"
                                        />
                                    </a>
                                    <a
                                        type="button"
                                        className="mr-3"
                                        onClick={(e) => {
                                            props.handleProductGroupDelete(GROUP_ID);
                                        }}
                                    >
                                        <PESectionDelete
                                            width="20px"
                                            height="20px"
                                            title="Delete Product Group"
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

export default AllGroupsComponent;
