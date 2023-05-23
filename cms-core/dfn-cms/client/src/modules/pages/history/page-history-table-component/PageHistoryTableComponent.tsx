import Axios from 'axios';
import React, { useState } from 'react';
import MasterRepository from '../../../shared/repository/MasterRepository';
import { getAuthorizationHeader } from '../../../shared/utils/AuthorizationUtils';
import WorkflowBadgeComponent from '../../../workflows/WorkflowBadgeComponent';
import { getFormattedDateTimeString } from '../../../shared/utils/DateTimeUtil';
import ConfirmationModal from '../../../shared/ui-components/modals/confirmation-modal';

const PageHistoryTableComponent = (props) => {
    let title = props.row.pageName;
    let version = props.row.version;
    let pageId = props.row._id.toString();
    let dbName = props.dbName;
    const [
        isPageCheckoutConfirmationModalOpen,
        setPageCheckoutConfirmationModalOpen,
    ] = useState<boolean>(false);

    const checkOut = () => {
        const headerParameter = {};
        const httpHeaders = getAuthorizationHeader(headerParameter);

        let newWorkFlowState = {};
        newWorkFlowState['state'] = 'initial';
        newWorkFlowState['modifiedBy'] = MasterRepository.getCurrentUser().docId;
        newWorkFlowState['modifiedDate'] = new Date();
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
                props.onCheckout();
                setPageCheckoutConfirmationModalOpen(false);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    function getPageCheckoutModalTitle() {
        let pagetitle: string = '';

        if (title) {
            pagetitle = `Checkout Template - ${title}`;
        }

        return pagetitle;
    }

    return (
        <>
            <tr>
                <td scope="row">{props.index}</td>
                <td>{props.row.pageName}</td>
                <td>{props.row.workflowState.comment}</td>
                <td>{props.row.version}</td>
                <td>
                    <WorkflowBadgeComponent currentworkflowId={props.row.workflowState.state} />
                </td>
                <td>{getFormattedDateTimeString(props.row.workflowState.modifiedDate)}</td>
                <td className="text-right">
                    <button
                        type="button"
                        className="btn btn-sm btn-outline-primary"
                        onClick={() => setPageCheckoutConfirmationModalOpen(true)}
                    >
                        Checkout
                    </button>
                </td>
            </tr>
            {isPageCheckoutConfirmationModalOpen && (
                <ConfirmationModal
                    modalTitle={getPageCheckoutModalTitle()}
                    show={isPageCheckoutConfirmationModalOpen}
                    handleClose={() => {
                        setPageCheckoutConfirmationModalOpen(false);
                    }}
                    handleConfirme={checkOut}
                >
                    <p>"Are you sure you want to checkout this page?"</p>
                </ConfirmationModal>
            )}
        </>
    );
};

export default PageHistoryTableComponent;
