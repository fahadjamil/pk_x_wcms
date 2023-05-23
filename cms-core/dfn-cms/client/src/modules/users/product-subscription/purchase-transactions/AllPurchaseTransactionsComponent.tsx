import React from 'react';
import { getFormattedDateTimeString } from '../../../shared/utils/DateTimeUtil';
import { AllPurchaseTransactionsPropTypes } from '../models/PurchaseTransaction';

function AllPurchaseTransactionsComponent(props: AllPurchaseTransactionsPropTypes) {
    function getTransactionStatusById(statusId) {
        let transactionStatus;

        switch (statusId) {
            case '-1':
                transactionStatus = 'failed';
                break;
            case '0':
                transactionStatus = 'urlSendToUser';
                break;
            case '1':
                transactionStatus = 'success';
                break;
            case '2':
                transactionStatus = 'sendToPayment';
                break;
            default:
                transactionStatus = 'unknown';
        }

        return transactionStatus;
    }

    return (
        <table className="table-borderless table-hover tbl-thm-01 table">
            <thead>
                <tr>
                    <th>TRACK ID</th>
                    <th>LOGIN ID</th>
                    <th>FIRST NAME</th>
                    <th>LOGIN NAME</th>
                    <th>PAYMENT ID</th>
                    <th>TRANSACTION ID</th>
                    <th>REFERENCE ID</th>
                    <th>AMOUNT</th>
                    <th>STATUS</th>
                    <th>ERROR</th>
                    <th>RESULTS</th>
                    <th>CREATED DATE</th>
                </tr>
            </thead>
            <tbody>
                {Array.isArray(props.allPurchaseTransactions) &&
                    props.allPurchaseTransactions.map((transactions, transactionsIndex) => {
                        const {
                            TRACK_ID,
                            LOGIN_ID,
                            S01_FIRSTNAME,
                            S02_LOGINNAME,
                            PAYMENT_ID,
                            TRANSACTION_ID,
                            REFERENCE_ID,
                            AMOUNT,
                            STATUS,
                            ERROR,
                            RESULT,
                            CREATED_DATE,
                        } = transactions;

                        return (
                            <tr key={`transactions-${TRACK_ID}-${transactionsIndex}`}>
                                <td>{TRACK_ID}</td>
                                <td>{LOGIN_ID}</td>
                                <td>{S01_FIRSTNAME}</td>
                                <td>{S02_LOGINNAME}</td>
                                <td>{PAYMENT_ID}</td>
                                <td>{TRANSACTION_ID}</td>
                                <td>{REFERENCE_ID}</td>
                                <td>{AMOUNT}</td>
                                <td>{getTransactionStatusById(STATUS)}</td>
                                <td>{ERROR}</td>
                                <td>{RESULT}</td>
                                <td>{getFormattedDateTimeString(CREATED_DATE)}</td>
                            </tr>
                        );
                    })}
            </tbody>
        </table>
    );
}

export default AllPurchaseTransactionsComponent;
