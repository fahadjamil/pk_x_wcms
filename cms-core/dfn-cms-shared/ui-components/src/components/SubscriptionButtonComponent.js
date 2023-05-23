import React, { useEffect, useState } from 'react';
import Axios from 'axios';

function SubscriptionButtonComponent(props) {
    const [payableAmmount, setPayableAmmount] = useState('0');
    let currentLangKey = '';


    const Subscriptions = [
        {
            EXPIRY_DATE: '2020-11-14T00:00:00.000Z',
            NEW_EXPIRY_DATE: null,
            NEW_PERIOD_ID: null,
            PERIOD_ID: '1',
            PRODUCT_ID: '1',
            STATUS: 1,
            SUBSCRIBED_DATE: '2020-11-13T00:00:00.000Z',
            SUBSCRIPTION_ID: '21',
            TRANSACTION_CODE: '0000620201113142948',
            UNSUBSCRIBED_DATE: null,
            USER_LOGIN_ID: '6',
        },
        {
            EXPIRY_DATE: '2021-03-20T00:00:00.000Z',
            NEW_EXPIRY_DATE: null,
            NEW_PERIOD_ID: null,
            PERIOD_ID: '6',
            PRODUCT_ID: '8',
            STATUS: 1,
            SUBSCRIBED_DATE: '2020-03-20T00:00:00.000Z',
            SUBSCRIPTION_ID: '5',
            TRANSACTION_CODE: null,
            UNSUBSCRIBED_DATE: null,
            USER_LOGIN_ID: '6',
        },
        {
            EXPIRY_DATE: '2021-03-20T00:00:00.000Z',
            NEW_EXPIRY_DATE: null,
            NEW_PERIOD_ID: null,
            PERIOD_ID: '6',
            PRODUCT_ID: '18',
            STATUS: 1,
            SUBSCRIBED_DATE: '2020-03-20T00:00:00.000Z',
            SUBSCRIPTION_ID: '6',
            TRANSACTION_CODE: null,
            UNSUBSCRIBED_DATE: null,
            USER_LOGIN_ID: '6',
        },
        {
            EXPIRY_DATE: '2020-12-17T00:00:00.000Z',
            NEW_EXPIRY_DATE: null,
            NEW_PERIOD_ID: null,
            PERIOD_ID: '3',
            PRODUCT_ID: '2',
            STATUS: 1,
            SUBSCRIBED_DATE: '2020-11-17T00:00:00.000Z',
            SUBSCRIPTION_ID: '22',
            TRANSACTION_CODE: '0000620201117022704',
            UNSUBSCRIBED_DATE: null,
            USER_LOGIN_ID: '6',
        },
        {
            EXPIRY_DATE: '2020-12-25T00:00:00.000Z',
            NEW_EXPIRY_DATE: null,
            NEW_PERIOD_ID: null,
            PERIOD_ID: '3',
            PRODUCT_ID: '19',
            STATUS: 1,
            SUBSCRIBED_DATE: '2020-11-25T00:00:00.000Z',
            SUBSCRIPTION_ID: '27',
            TRANSACTION_CODE: '0000620201125113518',
            UNSUBSCRIBED_DATE: null,
            USER_LOGIN_ID: '6',
        },
        {
            EXPIRY_DATE: '2021-03-16T00:00:00.000Z',
            NEW_EXPIRY_DATE: null,
            NEW_PERIOD_ID: null,
            PERIOD_ID: '2',
            PRODUCT_ID: '3',
            STATUS: 1,
            SUBSCRIBED_DATE: '2021-03-09T00:00:00.000Z',
            SUBSCRIPTION_ID: '33',
            TRANSACTION_CODE: '0000620210309110832',
            UNSUBSCRIBED_DATE: null,
            USER_LOGIN_ID: '6',
        },
        {
            EXPIRY_DATE: '2021-03-12T00:00:00.000Z',
            NEW_EXPIRY_DATE: null,
            NEW_PERIOD_ID: null,
            PERIOD_ID: '1',
            PRODUCT_ID: '9',
            STATUS: 1,
            SUBSCRIBED_DATE: '2021-03-11T00:00:00.000Z',
            SUBSCRIPTION_ID: '36',
            TRANSACTION_CODE: '0000620210311044314',
            UNSUBSCRIBED_DATE: null,
            USER_LOGIN_ID: '6',
        },
        {
            EXPIRY_DATE: '2021-03-10T00:00:00.000Z',
            NEW_EXPIRY_DATE: null,
            NEW_PERIOD_ID: null,
            PERIOD_ID: '1',
            PRODUCT_ID: '7',
            STATUS: 1,
            SUBSCRIBED_DATE: '2021-03-09T00:00:00.000Z',
            SUBSCRIPTION_ID: '34',
            TRANSACTION_CODE: '0000620210309115610',
            UNSUBSCRIBED_DATE: null,
            USER_LOGIN_ID: '6',
        },
        {
            EXPIRY_DATE: '2021-09-09T00:00:00.000Z',
            NEW_EXPIRY_DATE: null,
            NEW_PERIOD_ID: null,
            PERIOD_ID: '5',
            PRODUCT_ID: '13',
            STATUS: 1,
            SUBSCRIBED_DATE: '2021-03-09T00:00:00.000Z',
            SUBSCRIPTION_ID: '32',
            TRANSACTION_CODE: '0000620210309034220',
            UNSUBSCRIBED_DATE: null,
            USER_LOGIN_ID: '6',
        },
    ];

    if (typeof window !== 'undefined') {
        const currentPathName = window.location.pathname;

        if (currentPathName.length > 0) {
             currentLangKey = currentPathName.split('/')[1];
             console.log('currentLangKey: ',currentLangKey);
        }
    }

    function subscribe() {
        let payAmount = 0;
        try {
            payAmount = Number(payableAmmount);
            if(payAmount === NaN){
                payAmount = 0;
            }
        } catch (error) {
            console.log('error', error);
        }
        const payload = {
            loginId: '6',
            paybleAmount: payAmount,
            lang:currentLangKey,
            subscriptions: Subscriptions,
        };

        const jwt = localStorage.getItem('jwt-token');

        const requestUrl = '/api/web/subscription/product-subscription';

        const httpHeaders = {
            headers: {
                Authorization: jwt,
            },
        };
        Axios.post(requestUrl, payload, httpHeaders)
            .then((response) => {
                console.log('response', response.data);

                if (typeof window !== 'undefined') {
                    window.location = response.data.response_url;
                }
            })
            .catch((err) => {
                console.log('error', err);
            });
    }

    return (
        <div>
            <div className="row">
                <div className="col-lg-3 col-md-3 col-sm-12 form-group mb-3">
                    <label className="">Payable Amount</label>
                    <input
                        className="form-control"
                        id="subcriptionAmmount"
                        value={payableAmmount}
                        pattern="[0-9]*"
                        onChange={(e) => {
                            setPayableAmmount(e.target.value);
                        }}
                        placeholder="Amount"
                    />
                </div>
                <div className="col-lg-1 mt-4 col-md-1 col-sm-12 form-group mb-3 text-right align-self-center">
                    <button
                        className="btn btn-bk-primary"
                        id="subcriptionButton"
                        onClick={(e) => {
                            e.preventDefault();
                            subscribe();
                        }}
                    >
                        Subscribe
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SubscriptionButtonComponent;
