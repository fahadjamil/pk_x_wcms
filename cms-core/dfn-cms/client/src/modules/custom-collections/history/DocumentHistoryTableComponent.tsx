import React from 'react';
import Axios from 'axios';
import MasterRepository from '../../shared/repository/MasterRepository';
import WorkflowBadgeComponent from '../../workflows/WorkflowBadgeComponent';
import { getAuthorizationHeader } from '../../shared/utils/AuthorizationUtils';
import { getFormattedDateTimeString } from '../../shared/utils/DateTimeUtil';

const DocumentHistoryTableComponent = (props) => {
    let title = props.row.title;
    let version = props.row.version;
    let pageId = props.row._id.toString();
    let collection = props.row.collection;
    let dbName = props.dbName;
    let lang = props.lang;

    const checkOut = () => {
        const r = window.confirm('Are you sure you wish checkout this page?');
        if (r) {
            const headerParameter = {};
            const httpHeaders = getAuthorizationHeader(headerParameter);
            // const jwt = localStorage.getItem('jwt-token');

            // const httpHeaders = {
            //     headers: {
            //         Authorization: jwt,
            //     },
            // };

            let newWorkFlowState = {};
            newWorkFlowState['state'] = 'initial';
            newWorkFlowState['modifiedBy'] = MasterRepository.getCurrentUser().docId;
            newWorkFlowState['modifiedDate'] = new Date().toLocaleString();
            newWorkFlowState['comment'] = `Page - ${title} is checked out from the history.`;

            Axios.post(
                '/api/pages/history/checkout',
                {
                    dbName: dbName,
                    title: title,
                    pageId: pageId,
                    version: version,
                    workflow: newWorkFlowState,
                },
                httpHeaders
            )
                .then((result) => {
                    window.confirm('done');
                })
                .catch((err) => {
                    console.log(err);
                });
        } else {
        }
    };

    return (
        <>
            <tr>
                <th scope="row">{props.index}</th>
                <td>{props.row.fieldData[lang].entry_name}</td>
                <td>{props.row.workflowState.comment}</td>
                <td>{props.row.version}</td>
                <td className="d-flex  align-items-left justify-content-left">
                    <WorkflowBadgeComponent currentworkflowId={props.row.workflowState.state} />
                </td>
                <td>{getFormattedDateTimeString(props.row.workflowState.modifiedDate)} </td>
                <td>
                    <button type="button" className="btn btn-sm btn-outline-primary">
                        Checkout
                    </button>
                </td>
            </tr>
        </>
    );
};

export default DocumentHistoryTableComponent;
