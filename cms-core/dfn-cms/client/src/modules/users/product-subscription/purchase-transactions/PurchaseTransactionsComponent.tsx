import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import NotificationAlertsComponent from '../../../shared/ui-components/alerts/NotificationAlertsComponent';
import { getAuthorizationHeader } from '../../../shared/utils/AuthorizationUtils';
import AllPurchaseTransactionsComponent from './AllPurchaseTransactionsComponent';
import PurchaseTransactionsExportComponent from './PurchaseTransactionsExportComponent';
import PurchaseTransactionsFilterComponent from './PurchaseTransactionsFilterComponent';

function PurchaseTransactionsComponent(props) {
    const { website } = props;
    const [allPurchaseTransactions, setAllPurchaseTransactions] = useState([]);
    const [responseData, setResponseData] = useState<any>(undefined);

    useEffect(() => {
        getAllPurchaseTransactions();
    }, [website]);

    function getAllPurchaseTransactions() {
        const headerParameter = {};
        const httpHeaders = getAuthorizationHeader(headerParameter);

        Axios.get('/api/subscription/purchase-transactions', httpHeaders)
            .then((results) => {
                const { data, status } = results;

                if (status === 200) {
                    const { code, message, purchaseTransactions } = data;

                    if (code === 1) {
                        setAllPurchaseTransactions(purchaseTransactions);
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

        Axios.get('/api/subscription/purchase-transactions/filter', httpHeaders)
            .then((results) => {
                const { data, status } = results;

                if (status === 200) {
                    const { code, message, purchaseTransactions } = data;

                    if (code === 1) {
                        setAllPurchaseTransactions(purchaseTransactions);
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
                <PurchaseTransactionsFilterComponent handleSearch={handleSearch} />
            </div>
            <NotificationAlertsComponent responseData={responseData} />
            <PurchaseTransactionsExportComponent />
            <div className="table-responsive" id="purchaseTransactions">
                <AllPurchaseTransactionsComponent
                    allPurchaseTransactions={allPurchaseTransactions}
                />
            </div>
        </>
    );
}

export default PurchaseTransactionsComponent;
