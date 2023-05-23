import React from 'react';
import NotificationModal from '../../../shared/ui-components/modals/notification-modal';
import { SubscriptionPeriodDetailsPropTypes } from '../models/SubscriptionPeriodsModel';

function SubscriptionPeriodDetailsComponent(props: SubscriptionPeriodDetailsPropTypes) {
    return (
        <NotificationModal
            modalTitle="SUBSCRIPTION PERIOD DETAILS"
            show={props.isSubscriptionPeriodDetailsModalOpen}
            handleClose={() => {
                props.setIsSubscriptionPeriodDetailsModalOpen(false);
            }}
            size="lg"
        >
            <div className="table-responsive" id="sub-period-details">
                <table className="table table-sm">
                    <tbody>
                        <tr>
                            <th scope="row">ID</th>
                            <td>
                                {props.subscriptionPeriodDetails &&
                                    props.subscriptionPeriodDetails[0] &&
                                    props.subscriptionPeriodDetails[0].PERIOD_ID}
                            </td>
                        </tr>
                        <tr>
                            <th scope="row">SUBSCRIPTION PERIOD</th>
                            <td>
                                {props.subscriptionPeriodDetails &&
                                    props.subscriptionPeriodDetails[0] &&
                                    props.subscriptionPeriodDetails[0].DESCRIPTION_EN}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </NotificationModal>
    );
}

export default SubscriptionPeriodDetailsComponent;
