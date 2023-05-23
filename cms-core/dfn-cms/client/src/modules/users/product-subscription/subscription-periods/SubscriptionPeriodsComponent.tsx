import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import NotificationAlertsComponent from '../../../shared/ui-components/alerts/NotificationAlertsComponent';
import {
    getAuthorizationHeader,
    getAuthorizationHeaderForDelete,
} from '../../../shared/utils/AuthorizationUtils';
import validator from '../../../shared/utils/Validator';
import AddSubscriptionPeriodsComponent from './AddSubscriptionPeriodsComponent';
import AllSubscriptionPeriodsComponent from './AllSubscriptionPeriodsComponent';
import DeleteSubscriptionPeriodsComponent from './DeleteSubscriptionPeriodsComponent';
import SubscriptionPeriodDetailsComponent from './SubscriptionPeriodDetailsComponent';

export const periodValidationSchema = {
    periodEn: {
        type: 'string',
        empty: false,
        messages: {
            required: 'This field is required',
            string: 'This field is required and it must be a string.',
            stringEmpty: 'This field is required.',
        },
    },
    periodAr: {
        type: 'string',
        empty: false,
        messages: {
            required: 'This field is required',
            string: 'This field is required and it must be string.',
            stringEmpty: 'This field is required.',
        },
    },
};

function SubscriptionPeriodsComponent(props) {
    const { website } = props;
    const [allSubscriptionPeriods, setAllSubscriptionPeriods] = useState([]);
    const [subscriptionPeriodDetails, setSubscriptionPeriodDetails] = useState<any>([]);
    const [
        isSubscriptionPeriodDetailsModalOpen,
        setIsSubscriptionPeriodDetailsModalOpen,
    ] = useState(false);
    const [isAddSubscriptionPeriodsModalOpen, setIsAddSubscriptionPeriodsModalOpen] = useState(
        false
    );
    const [isDeleteSubscriptionPeriodModalOpen, setIsDeleteSubscriptionPeriodModalOpen] = useState(
        false
    );
    const [isSubscriptionPeriodEdit, setIsSubscriptionPeriodEdit] = useState(false);
    const [selectedSubscriptionPeriodId, setSelectedSubscriptionPeriodId] = useState<
        number | undefined
    >(undefined);
    const [responseData, setResponseData] = useState<any>(undefined);
    const [validationErrors, setValidationErrors] = useState<any>({});
    const periodValidatorKey = 'periodValidatorKey';

    useEffect(() => {
        let isMounted: boolean = true;

        if (isMounted) {
            getallSubscriptionPeriods();
            validator.setValidatorSchema(periodValidatorKey, periodValidationSchema);
        }

        return () => {
            isMounted = false;
        };
    }, [website]);

    function getallSubscriptionPeriods() {
        const headerParameter = {};
        const httpHeaders = getAuthorizationHeader(headerParameter);

        Axios.get('/api/subscription/subscription-periods', httpHeaders)
            .then((results) => {
                const { data, status } = results;

                if (status === 200) {
                    const { code, message, subscriptionPeriods } = data;

                    if (code === 1) {
                        setAllSubscriptionPeriods(subscriptionPeriods);
                    }

                    if (code === -1 || code === -2 || code === -3) {
                        const resStatus = {
                            status: 'failed',
                            msg: message,
                        };

                        setResponseData(resStatus);

                        setTimeout(function () {
                            setResponseData(undefined);
                        }, 3000);
                    }
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function getSubscriptionPeriodDetails(subPeriodId) {
        const headerParameter = { subPeriodId: subPeriodId };
        const httpHeaders = getAuthorizationHeader(headerParameter);

        Axios.get('/api/subscription/subscription-period', httpHeaders)
            .then((results) => {
                const { data, status } = results;

                if (status === 200) {
                    const { code, message, subscriptionPeriod } = data;

                    if (code === 1) {
                        setSubscriptionPeriodDetails(subscriptionPeriod);
                    }

                    if (code === -1 || code === -2 || code === -3) {
                        const resStatus = {
                            status: 'failed',
                            msg: message,
                        };

                        setResponseData(resStatus);

                        setTimeout(function () {
                            setResponseData(undefined);
                        }, 3000);
                    }
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function addSubscriptionPeriod(details) {
        const [isValid, error] = validator.validateData(periodValidatorKey, details);

        if (isValid) {
            const headerParameter = {};
            const httpHeaders = getAuthorizationHeader(headerParameter);

            let subscriptionPeriod = {
                subscriptionPeriodData: details,
            };

            Axios.post('/api/subscription/subscription-period/add', subscriptionPeriod, httpHeaders)
                .then((results) => {
                    const { data, status } = results;

                    if (status === 200) {
                        const { code, message, subscriptionPeriods } = data;

                        if (code === 1) {
                            if (subscriptionPeriods) {
                                setAllSubscriptionPeriods(subscriptionPeriods);
                            }

                            const resStatus = {
                                status: 'success',
                                msg: message,
                            };

                            setResponseData(resStatus);

                            setTimeout(function () {
                                setResponseData(undefined);
                            }, 3000);
                        }

                        if (code === -1 || code === -2 || code === -3) {
                            const resStatus = {
                                status: 'failed',
                                msg: message,
                            };

                            setResponseData(resStatus);

                            setTimeout(function () {
                                setResponseData(undefined);
                            }, 3000);
                        }
                    }
                })
                .catch((err) => {
                    console.log(err);
                });

            setIsAddSubscriptionPeriodsModalOpen(false);
            setValidationErrors({});
        } else {
            const updatedError = {};

            for (let errorItem of error) {
                const { field, message } = errorItem;

                if (field) {
                    updatedError[field] = message;
                    continue;
                }

                updatedError['common'] = 'Please fix the validation errors.';
            }

            setValidationErrors(updatedError);
        }
    }

    function editSubscriptionPeriod(details) {
        const [isValid, error] = validator.validateData(periodValidatorKey, details);

        if (isValid) {
            const headerParameter = {};
            const httpHeaders = getAuthorizationHeader(headerParameter);

            let subscriptionPeriod = {
                subscriptionPeriodData: details,
            };

            Axios.put('/api/subscription/subscription-period/edit', subscriptionPeriod, httpHeaders)
                .then((results) => {
                    const { data, status } = results;

                    if (status === 200) {
                        const { code, message, subscriptionPeriods } = data;

                        if (code === 1) {
                            if (subscriptionPeriods) {
                                setAllSubscriptionPeriods(subscriptionPeriods);
                            }

                            const resStatus = {
                                status: 'success',
                                msg: message,
                            };

                            setResponseData(resStatus);

                            setTimeout(function () {
                                setResponseData(undefined);
                            }, 3000);
                        }

                        if (code === -1 || code === -2 || code === -3) {
                            const resStatus = {
                                status: 'failed',
                                msg: message,
                            };

                            setResponseData(resStatus);

                            setTimeout(function () {
                                setResponseData(undefined);
                            }, 3000);
                        }
                    }
                })
                .catch((err) => {
                    console.log(err);
                });

            setIsAddSubscriptionPeriodsModalOpen(false);
            setIsSubscriptionPeriodEdit(false);
            setValidationErrors({});
        } else {
            const updatedError = {};

            for (let errorItem of error) {
                const { field, message } = errorItem;

                if (field) {
                    updatedError[field] = message;
                    continue;
                }

                updatedError['common'] = 'Please fix the validation errors.';
            }

            setValidationErrors(updatedError);
        }
    }

    function deleteSubscriptionPeriod(subPeriodId) {
        const headerParameter = { subPeriodId: subPeriodId };
        const payload = getAuthorizationHeaderForDelete(headerParameter);

        Axios.delete('/api/subscription/subscription-period/delete', payload)
            .then((results) => {
                const { data, status } = results;

                if (status === 200) {
                    const { code, message, subscriptionPeriods } = data;

                    if (code === 1) {
                        if (subscriptionPeriods) {
                            setAllSubscriptionPeriods(subscriptionPeriods);
                        }

                        const resStatus = {
                            status: 'success',
                            msg: message,
                        };

                        setResponseData(resStatus);

                        setTimeout(function () {
                            setResponseData(undefined);
                        }, 3000);
                    }

                    if (code === -1 || code === -2 || code === -3) {
                        const resStatus = {
                            status: 'failed',
                            msg: message,
                        };

                        setResponseData(resStatus);

                        setTimeout(function () {
                            setResponseData(undefined);
                        }, 3000);
                    }
                }
            })
            .catch((err) => {
                console.log(err);
            });

        setIsDeleteSubscriptionPeriodModalOpen(false);
    }

    function handleSubscriptionPeriodDetailedView(subPeriodId) {
        getSubscriptionPeriodDetails(subPeriodId);
        setIsSubscriptionPeriodDetailsModalOpen(true);
    }

    function handleAddSubscriptionPeriod() {
        setSubscriptionPeriodDetails([]);
        setIsAddSubscriptionPeriodsModalOpen(true);
        setIsSubscriptionPeriodEdit(false);
    }

    function handleSubscriptionPeriodEdit(subPeriodId) {
        getSubscriptionPeriodDetails(subPeriodId);
        setIsAddSubscriptionPeriodsModalOpen(true);
        setIsSubscriptionPeriodEdit(true);
    }

    function handleSubscriptionPeriodDelete(subPeriodId) {
        setSelectedSubscriptionPeriodId(subPeriodId);
        setIsDeleteSubscriptionPeriodModalOpen(true);
    }

    return (
        <>
            <div className="row p-3 justify-content-end">
                <button
                    type="button"
                    className="btn btn-primary btn-sm"
                    onClick={handleAddSubscriptionPeriod}
                >
                    Add Subscription Period
                </button>
            </div>
            <NotificationAlertsComponent responseData={responseData} />
            <div className="table-responsive" id="subscriptionPeriods">
                <AllSubscriptionPeriodsComponent
                    allSubscriptionPeriods={allSubscriptionPeriods}
                    handleSubscriptionPeriodDetailedView={handleSubscriptionPeriodDetailedView}
                    handleSubscriptionPeriodEdit={handleSubscriptionPeriodEdit}
                    handleSubscriptionPeriodDelete={handleSubscriptionPeriodDelete}
                />
            </div>
            {isSubscriptionPeriodDetailsModalOpen && (
                <SubscriptionPeriodDetailsComponent
                    subscriptionPeriodDetails={subscriptionPeriodDetails}
                    isSubscriptionPeriodDetailsModalOpen={isSubscriptionPeriodDetailsModalOpen}
                    setIsSubscriptionPeriodDetailsModalOpen={
                        setIsSubscriptionPeriodDetailsModalOpen
                    }
                />
            )}
            {isAddSubscriptionPeriodsModalOpen && (
                <AddSubscriptionPeriodsComponent
                    isAddSubscriptionPeriodsModalOpen={isAddSubscriptionPeriodsModalOpen}
                    setIsAddSubscriptionPeriodsModalOpen={(status) => {
                        setIsAddSubscriptionPeriodsModalOpen(status);
                        setValidationErrors({});
                    }}
                    handleConfirme={
                        isSubscriptionPeriodEdit ? editSubscriptionPeriod : addSubscriptionPeriod
                    }
                    subscriptionPeriodDetails={subscriptionPeriodDetails}
                    validationErrors={validationErrors}
                    modalTitle={
                        isSubscriptionPeriodEdit
                            ? 'EDIT SUBSCRIPTION PERIOD'
                            : 'ADD SUBSCRIPTION PERIOD'
                    }
                />
            )}
            {isDeleteSubscriptionPeriodModalOpen && (
                <DeleteSubscriptionPeriodsComponent
                    isDeleteSubscriptionPeriodModalOpen={isDeleteSubscriptionPeriodModalOpen}
                    selectedSubscriptionPeriodId={selectedSubscriptionPeriodId}
                    setIsDeleteSubscriptionPeriodModalOpen={setIsDeleteSubscriptionPeriodModalOpen}
                    deleteSubscriptionPeriod={deleteSubscriptionPeriod}
                />
            )}
        </>
    );
}

export default SubscriptionPeriodsComponent;
