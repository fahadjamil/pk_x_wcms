import Axios from 'axios';
import React, { useState } from 'react';
import MasterRepository from '../../shared/repository/MasterRepository';
import { getAuthorizationHeader } from '../../shared/utils/AuthorizationUtils';
import WorkflowBadgeComponent from '../../workflows/WorkflowBadgeComponent';
import { getFormattedDateTimeString } from '../../shared/utils/DateTimeUtil';
import ConfirmationModal from '../../shared/ui-components/modals/confirmation-modal';

const BannerHistoryTableComponent = (props) => {
    let title = props.row.title;
    let bannerId = props.row._id.toString();
    let dbName = props.dbName;
    const [
        isBannerCheckoutConfirmationModalOpen,
        setBannerCheckoutConfirmationModalOpen,
    ] = useState<boolean>(false);

    const checkOut = () => {
        const headerParameter = {};
        const httpHeaders = getAuthorizationHeader(headerParameter);

        let newWorkFlowState = {};
        newWorkFlowState['state'] = 'initial';
        newWorkFlowState['modifiedBy'] = MasterRepository.getCurrentUser().docId;
        newWorkFlowState['modifiedDate'] = new Date();
        newWorkFlowState['comment'] = `Banner - ${title} is checked out from the history.`;

        Axios.post(
            '/api/banner/history/checkout',
            {
                dbName: dbName,
                title: title,
                bannerId: bannerId,
                workflow: newWorkFlowState,
            },
            httpHeaders
        )
            .then((result) => {
                props.onCheckout();
                setBannerCheckoutConfirmationModalOpen(false);
            })
            .catch((err) => {
                console.log(err);
            });
    };

    function getBannerCheckoutModalTitle() {
        let bannertitle: string = '';

        if (title) {
            bannertitle = `Checkout Banner - ${title}`;
        }

        return bannertitle;
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
                        onClick={() => setBannerCheckoutConfirmationModalOpen(true)}
                    >
                        Checkout
                    </button>
                </td>
            </tr>
            {isBannerCheckoutConfirmationModalOpen && (
                <ConfirmationModal
                    modalTitle={getBannerCheckoutModalTitle()}
                    show={isBannerCheckoutConfirmationModalOpen}
                    handleClose={() => {
                        setBannerCheckoutConfirmationModalOpen(false);
                    }}
                    handleConfirme={checkOut}
                >
                    <p>"Are you sure you want to checkout this banner?"</p>
                </ConfirmationModal>
            )}
        </>
    );
};

export default BannerHistoryTableComponent;
