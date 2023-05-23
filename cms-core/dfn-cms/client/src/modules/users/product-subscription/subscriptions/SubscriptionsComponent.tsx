import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import NotificationAlertsComponent from '../../../shared/ui-components/alerts/NotificationAlertsComponent';
import { getAuthorizationHeader } from '../../../shared/utils/AuthorizationUtils';
import AllSubscriptionsComponent from './AllSubscriptionsComponent';
import SubscriptionsExportComponent from './SubscriptionsExportComponent';
import SubscriptionsFilterComponent from './SubscriptionsFilterComponent';

function SubscriptionsComponent(props) {
    const { website } = props;
    const [allProductSubscription, setAllProductSubscription] = useState([]);
    const [responseData, setResponseData] = useState<any>(undefined);

    useEffect(() => {
        getAllProductSubscription();
    }, [website]);

    function getAllProductSubscription() {
        const headerParameter = {};
        const httpHeaders = getAuthorizationHeader(headerParameter);

        Axios.get('/api/subscription/subscriptions', httpHeaders)
            .then((results) => {
                const { data, status } = results;

                if (status === 200) {
                    const { code, message, subscriptions } = data;

                    if (code === 1) {
                        setAllProductSubscription(subscriptions);
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

    function handleSearch(filter) {
        const headerParameter = { filter: filter };
        const httpHeaders = getAuthorizationHeader(headerParameter);

        Axios.get('/api/subscription/subscriptions/filter', httpHeaders)
            .then((results) => {
                const { data, status } = results;

                if (status === 200) {
                    const { code, message, subscriptions } = data;

                    if (code === 1) {
                        setAllProductSubscription(subscriptions);
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

    return (
        <>
            <div className="row">
                <SubscriptionsFilterComponent handleSearch={handleSearch} />
            </div>
            <NotificationAlertsComponent responseData={responseData} />
            <SubscriptionsExportComponent />
            <div className="table-responsive" id="productSubscriptions">
                <AllSubscriptionsComponent allProductSubscription={allProductSubscription} />
            </div>
        </>
    );
}

export default SubscriptionsComponent;
