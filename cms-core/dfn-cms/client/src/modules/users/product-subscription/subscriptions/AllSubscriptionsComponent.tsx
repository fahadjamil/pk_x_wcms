import React from 'react';
import { getFormattedDateTimeString } from '../../../shared/utils/DateTimeUtil';
import { AllSubscriptionsPropTypes } from '../models/SubscriptionsModel';

function AllSubscriptionsComponent(props: AllSubscriptionsPropTypes) {
    function getSubscriptionStatusById(statusId) {
        let subStatus;

        switch (statusId) {
            case -2:
                subStatus = 'unsubscribed';
                break;
            case -1:
                subStatus = 'expired';
                break;
            case 0:
                subStatus = 'pending';
                break;
            case 1:
                subStatus = 'active';
                break;
            case 2:
                subStatus = 'updatePending';
                break;
            case 3:
                subStatus = 'activePending';
                break;
            default:
                subStatus = 'unknown';
        }

        return subStatus;
    }

    function getDateFromISOstring(date) {
        if (date) {
            date = new Date(date);

            let year = date.getFullYear();
            let month = date.getMonth() + 1;
            let dt = date.getDate();

            if (dt < 10) {
                dt = '0' + dt;
            }

            if (month < 10) {
                month = '0' + month;
            }

            return year + '-' + month + '-' + dt;
        }

        return '';
    }

    return (
        <table className="table-borderless table-hover tbl-thm-01 table">
            <thead>
                <tr>
                    <th>SUBSCRIPTION ID</th>
                    <th>PRODUCT ID</th>
                    <th>PRODUCT</th>
                    <th>FIRST NAME</th>
                    <th>LOGIN NAME</th>
                    <th>PERIOD</th>
                    <th>STATUS</th>
                    <th>TRANSACTION CODE</th>
                    <th>SUBSCRIBED DATE</th>
                    <th>EXPIRY DATE</th>
                </tr>
            </thead>
            <tbody>
                {Array.isArray(props.allProductSubscription) &&
                    props.allProductSubscription.map((subscription, subscriptionIndex) => {
                        const {
                            SUBSCRIPTION_ID,
                            PRODUCT_ID,
                            DESCRIPTION_EN,
                            S01_FIRSTNAME,
                            S02_LOGINNAME,
                            PERIOD_ID,
                            PERIOD_DESC,
                            STATUS,
                            TRANSACTION_CODE,
                            SUBSCRIBED_DATE,
                            EXPIRY_DATE,
                        } = subscription;

                        return (
                            <tr key={`subscription-${SUBSCRIPTION_ID}-${subscriptionIndex}`}>
                                <td>{SUBSCRIPTION_ID}</td>
                                <td>{PRODUCT_ID}</td>
                                <td>{DESCRIPTION_EN}</td>
                                <td>{S01_FIRSTNAME}</td>
                                <td>{S02_LOGINNAME}</td>
                                <td>{PERIOD_DESC}</td>
                                <td>{getSubscriptionStatusById(STATUS)}</td>
                                <td>{TRANSACTION_CODE}</td>
                                <td>{getDateFromISOstring(SUBSCRIBED_DATE)}</td>
                                <td>{getDateFromISOstring(EXPIRY_DATE)}</td>
                            </tr>
                        );
                    })}
            </tbody>
        </table>
    );
}

export default AllSubscriptionsComponent;
