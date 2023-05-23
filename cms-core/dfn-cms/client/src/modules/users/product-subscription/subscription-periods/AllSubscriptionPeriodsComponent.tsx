import React from 'react';
import PESectionDelete from '../../../shared/resources/PageEditor-Section-Delete';
import PESectionEdit from '../../../shared/resources/PageEditor-Section-Edit';
import ViewDetails from '../../../shared/resources/ViewDetails';
import { AllSubscriptionPeriodsPropTypes } from '../models/SubscriptionPeriodsModel';

function AllSubscriptionPeriodsComponent(props: AllSubscriptionPeriodsPropTypes) {
    return (
        <table className="table-borderless table-hover tbl-thm-01 table">
            <thead>
                <tr>
                    <th>ID</th>
                    <th>PERIOD</th>
                    <th className="text-right">ACTIONS</th>
                </tr>
            </thead>
            <tbody>
                {Array.isArray(props.allSubscriptionPeriods) &&
                    props.allSubscriptionPeriods.map((period, periodIndex) => {
                        const { PERIOD_ID, DESCRIPTION_EN } = period;

                        return (
                            <tr key={`period-${PERIOD_ID}-${periodIndex}`}>
                                <td>{PERIOD_ID}</td>
                                <td>{DESCRIPTION_EN}</td>
                                <td className="text-right">
                                    <a
                                        type="button"
                                        className="mr-3"
                                        // disabled={isEnable('/api/cms/users/update')}
                                        onClick={(e) => {
                                            props.handleSubscriptionPeriodEdit(PERIOD_ID);
                                        }}
                                    >
                                        <PESectionEdit
                                            width="20px"
                                            height="20px"
                                            title="Edit Subscription Period"
                                        />
                                    </a>
                                    <a
                                        type="button"
                                        className="mr-3"
                                        onClick={(e) => {
                                            props.handleSubscriptionPeriodDetailedView(PERIOD_ID);
                                        }}
                                    >
                                        <ViewDetails
                                            width="20px"
                                            height="20px"
                                            title="View Subscription Period Details"
                                        />
                                    </a>
                                    <a
                                        type="button"
                                        className="mr-3"
                                        onClick={(e) => {
                                            props.handleSubscriptionPeriodDelete(PERIOD_ID);
                                        }}
                                    >
                                        <PESectionDelete
                                            width="20px"
                                            height="20px"
                                            title="Delete Subscription Period"
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

export default AllSubscriptionPeriodsComponent;
