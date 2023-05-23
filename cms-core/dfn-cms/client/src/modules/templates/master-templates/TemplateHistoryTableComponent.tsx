import Axios from 'axios';
import React, { useState } from 'react';
import MasterRepository from '../../shared/repository/MasterRepository';
import { getAuthorizationHeader } from '../../shared/utils/AuthorizationUtils';
import WorkflowBadgeComponent from '../../workflows/WorkflowBadgeComponent';
import { getFormattedDateTimeString } from '../../shared/utils/DateTimeUtil';
import ConfirmationModal from '../../shared/ui-components/modals/confirmation-modal';

const TemplateHistoryTableComponent = (props) => {
    let title = props.row.title;
    let version = props.row.version;
    let templateId = props.row._id.toString();
    let dbName = props.dbName;
    const [
        isTemplateCheckoutConfirmationModalOpen,
        setTemplateCheckoutConfirmationModalOpen,
    ] = useState<boolean>(false);

    const checkOut = () => {
        const headerParameter = {};
        const httpHeaders = getAuthorizationHeader(headerParameter);

        let newWorkFlowState = {};
        newWorkFlowState['state'] = 'initial';
        newWorkFlowState['modifiedBy'] = MasterRepository.getCurrentUser().docId;
        newWorkFlowState['modifiedDate'] = new Date();
        newWorkFlowState['comment'] = `Template - ${title} is checked out from the history.`;

        Axios.post(
            '/api/templates/history/checkout',
            {
                dbName: dbName,
                title: title,
                templateId: templateId,
                version: version,
                workflow: newWorkFlowState,
            },
            httpHeaders
        )
            .then((result) => {
                props.onCheckout();
                setTemplateCheckoutConfirmationModalOpen(false);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    function getTemplateCheckoutModalTitle() {
        let templatetitle: string = '';

        if (title) {
            templatetitle = `Checkout Template - ${title}`;
        }

        return templatetitle;
    }

    return (
        <>
            <tr>
                <td scope="row">{props.index}</td>
                <td>{props.row.title}</td>
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
                        onClick={() => setTemplateCheckoutConfirmationModalOpen(true)}
                    >
                        Checkout
                    </button>
                </td>
            </tr>
            {isTemplateCheckoutConfirmationModalOpen && (
                <ConfirmationModal
                    modalTitle={getTemplateCheckoutModalTitle()}
                    show={isTemplateCheckoutConfirmationModalOpen}
                    handleClose={() => {
                        setTemplateCheckoutConfirmationModalOpen(false);
                    }}
                    handleConfirme={checkOut}
                >
                    <p>"Are you sure you want to checkout this template?"</p>
                </ConfirmationModal>
            )}
        </>
    );
};

export default TemplateHistoryTableComponent;
