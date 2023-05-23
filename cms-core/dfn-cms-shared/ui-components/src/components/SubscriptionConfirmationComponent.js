import React, { useEffect, useState } from 'react';

function SubscriptionConfirmationComponent(params) {
    let currentLocationHash = undefined;
    const [trackId, setTrackId] = useState('');
    const [txnStatus, setTxnStatus] = useState('');

    useEffect(() => {
        let isUnmounted = false;
        //http://bkweb-qa.directfn.net/en/subscription-receipt#123&success
        if (!isUnmounted) {
            if (currentLocationHash && currentLocationHash.length > 1) {
                const hashValue = currentLocationHash.substr(1);
                const selecetdParams = hashValue.split('&');
                if (selecetdParams && selecetdParams.length > 1) {
                    setTrackId(selecetdParams[0]);
                    setTxnStatus(selecetdParams[1]);
                }
            }
        }

        return () => {
            isUnmounted = true;
        };
    }, [getLocationHashValue()]);

    function getLocationHashValue() {
        if (typeof location !== 'undefined') {
            currentLocationHash = location.hash;
        }

        return currentLocationHash;
    }

    if (trackId && trackId !== '') {
        return (
            <div>
                <div className="jumbotron jumbotron-flui">
                    <div class="container">
                        <h1 className="display-6">Transaction : {txnStatus}</h1>
                        <p className="lead">
                            Product subscription Transaction Reference No : {trackId}
                        </p>
                        <hr className="my-4"></hr>
                    </div>
                </div>
            </div>
        );

        // return <div>Your product subscription detail receipt id : {trackId}</div>;
    } else {
        return <div></div>;
    }
}

export default SubscriptionConfirmationComponent;
