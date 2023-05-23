import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { ADMIN_FUNCTION_ALLOWED } from '../../config/constants';
import { AdminAuthorizationText } from '../Common/AdminAuthorizationText';
import moment from 'moment';
import toast, { Toaster } from 'react-hot-toast';
import { BsChevronRight } from 'react-icons/bs';

export const VoucherDetails = (props) => {
    const { lang } = props;
    const [loading, setLoading] = useState(true);
    const [authorize, setAuthorize] = useState(false);
    const [voucherData, setVoucherData] = useState([]);
    const [voucher_id, setVoucherID] = useState('');
    const [comments, setComments] = useState('');
    const [receiptNumber, setReceiptNumber] = useState('');

    const form_fieldset = {
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '10px',
    };
    const form_legend = {
        padding: '10px',
        width: 'auto',
    };
    useEffect(() => {
        setLoading(true);
        setAuthorize(ADMIN_FUNCTION_ALLOWED);
        setLoading(false);
        show();
        const markRefund = document.getElementById("markRefund");
    }, []);
    const show = () => {
        let hashValue = window.location.hash;
        let tempID = hashValue.substring(1);
        setVoucherID(tempID);
        Axios.get('/api/eop_voucher/' + tempID, {}).then((res) => {
            console.log('--res--');
            console.log(res);
            console.log('--res.data--');
            console.log(res.data);
            setVoucherData(res.data.find_data[0]);
        });
    };

    const markRefund = (e) => {
        e.preventDefault();
        Axios.get('/getCSRFToken').then((response) => {
            console.log('response token');
            console.log(response.data.csrfToken);
            if (response.data.csrfToken) {
                Axios.post(
                    '/api/eop_mark_refund',
                    {
                        id: voucher_id,
                        comments: comments,
                    },
                    {
                        headers: {
                            'x-xsrf-token': response.data.csrfToken,
                        },
                    }
                ).then((res) => {
                    console.log(res);
                    if (res.data.status == 'success') {
                        toast.success(res.data.message);
                        show();
                    } else {
                        toast.error(res.data.message);
                    }
                });
            }
        });
    };

    const markPaid = (e) => {
        e.preventDefault();

        Axios.get('/getCSRFToken').then((response) => {
            console.log('response token');
            console.log(response.data.csrfToken);
            if (response.data.csrfToken) {
                Axios.post(
                    '/api/eop_mark_paid',
                    {
                        id: voucher_id,
                        receiptNo: receiptNumber,
                        comments: comments,
                    },
                    {
                        headers: {
                            'x-xsrf-token': response.data.csrfToken,
                        },
                    }
                ).then((res) => {
                    console.log(res);
                    if (res.data.status == 'success') {
                        toast.success(res.data.message);
                        show();
                    } else {
                        toast.error(res.data.message);
                    }
                });
            }
        });
    };

    return (
        <div style={{ display: loading ? 'none' : 'block' }}>
            <Toaster
                position="top-center"
                reverseOrder={false}
                toastOptions={{
                    duration: 5000,
                }}
            />
            {authorize ? (
                <div>
                    <fieldset className="row col-md-12" style={form_fieldset}>
                        <legend style={form_legend}>Voucher Details</legend>
                        <div className="col-md-4 mt-3">
                            <span>
                                <strong>Voucher Number:</strong>&nbsp;
                                {voucherData && voucherData.voucher_number
                                    ? voucherData.voucher_number
                                    : ''}
                            </span>
                        </div>
                        <div className="col-md-4 mt-3">
                            <span>
                                <strong>Amount:</strong>&nbsp;
                                {voucherData && voucherData.amount ? voucherData.amount : ''}
                            </span>
                        </div>
                        <div className="col-md-4 mt-3">
                            <span>
                                <strong>Payment Status:</strong>&nbsp;
                                {voucherData && voucherData.is_paid
                                    ? voucherData.is_paid === 'Y'
                                        ? 'Paid'
                                        : 'UnPaid'
                                    : ''}
                            </span>
                        </div>
                        <div className="col-md-4 mt-3">
                            <span>
                                <strong>Creation Date:</strong>&nbsp;
                                {voucherData && voucherData.creation_date
                                    ? moment(voucherData.creation_date).format('DD-MM-YYYY hh:mm A')
                                    : ''}
                            </span>
                        </div>

                        {voucherData && voucherData.is_paid === 'Y' ? (
                            <div className="col-md-4 mt-3">
                                <span>
                                    <strong>Payment Method:</strong>&nbsp;
                                    {voucherData &&
                                        voucherData.payments &&
                                        voucherData.payments[0].payment_mode
                                        ? voucherData.payments[0].payment_mode
                                        : ''}
                                </span>
                            </div>
                        ) : (
                            ''
                        )}
                        {voucherData && voucherData.payment_date ? (
                            <div className="col-md-4 mt-3">
                                <span>
                                    <strong>Payment Date:</strong>&nbsp;
                                    {voucherData && voucherData.payment_date
                                        ? moment(voucherData.payment_date).format('DD-MM-YYYY hh:mm A')
                                        : ''}
                                </span>
                            </div>
                        ) : (
                            ''
                        )}
                        {voucherData && voucherData.is_refunded ? (
                            <div className="col-md-4 mt-3">
                                <span>
                                    <strong>Refunded:</strong>&nbsp;
                                    {voucherData && voucherData.is_refunded
                                        ? voucherData.is_refunded === 'Y'
                                            ? 'Yes'
                                            : 'NO'
                                        : ''}
                                </span>
                            </div>
                        ) : (
                            ''
                        )}
                        {voucherData && voucherData.comments ? (
                            <div className="col-md-12 mt-3">
                                <span>
                                    <strong>Payment Comments:</strong>&nbsp;
                                    {voucherData && voucherData.comments ? voucherData.comments : ''}
                                </span>
                            </div>
                        ) : (
                            ''
                        )}
                        {voucherData && voucherData.comments_refund ? (
                            <div className="col-md-12 mt-3">
                                <span>
                                    <strong>Refund Comments:</strong>&nbsp;
                                    {voucherData && voucherData.comments_refund ? voucherData.comments_refund : ''}
                                </span>
                            </div>
                        ) : (
                            ''
                        )}
                        {voucherData && voucherData.payments ? (
                            <div className="col-md-6 mt-3">
                                <span>
                                    {voucherData && voucherData.payments && voucherData.payments[0] ? (
                                        <div>
                                            {' '}
                                            {voucherData.payments[0].order_id &&
                                                voucherData.payments[0].payment_mode === 'Online' ? (
                                                <strong>Payment Order Id:</strong>
                                            ) : (
                                                ''
                                            )}
                                            {voucherData.payments[0].order_id &&
                                                voucherData.payments[0].payment_mode === 'Online'
                                                ? voucherData.payments[0].order_id
                                                : ''}
                                        </div>
                                    ) : (
                                        ''
                                    )}
                                </span>
                            </div>
                        ) : (
                            ''
                        )}
                    </fieldset>
                    <fieldset className="row col-md-12" style={form_fieldset}>
                        <legend style={form_legend}>Application Details</legend>
                        <div className="col-md-4 mt-3">
                            <span>
                                <strong>Application Reference:</strong>&nbsp;
                                {voucherData &&
                                    voucherData.application_id &&
                                    voucherData.application_id.reference_number
                                    ? voucherData.application_id.reference_number
                                    : ''}
                            </span>
                        </div>
                        <div className="col-md-4 mt-3">
                            <span>
                                <strong>Category:</strong>&nbsp;
                                {voucherData &&
                                    voucherData.category &&
                                    voucherData.category.category_name
                                    ? voucherData.category.category_name
                                    : ''}
                            </span>
                        </div>
                        <div className="col-md-4 mt-3">
                            <span>
                                <strong>Applicant Name:</strong>&nbsp;
                                {voucherData &&
                                    voucherData.submit_user &&
                                    voucherData.submit_user.first_name
                                    ? voucherData.submit_user.first_name
                                    : ''}
                                &nbsp;
                                {voucherData &&
                                    voucherData.submit_user &&
                                    voucherData.submit_user.last_name
                                    ? voucherData.submit_user.last_name
                                    : ''}
                            </span>
                        </div>
                    </fieldset>

                    {voucherData && voucherData.is_paid === 'N' ? (
                        <button
                            className="btn btn-primary float-right mt-4"
                            data-toggle="modal"
                            data-target="#paymentDialog"
                        >
                            Mark Paid&nbsp;
                            <BsChevronRight size={15} />
                        </button>
                    ) : (
                        <span
                            class="m-2 border p-3 bg-success float-right"
                            style={{ borderRadius: '5px' }}
                        >
                            <strong>Paid</strong>
                        </span>
                    )}
                    {voucherData && voucherData.is_paid === 'Y' && voucherData.is_refunded != 'Y' ? (
                        <button
                            className="btn btn-primary float-right mt-4 mx-2"
                            data-toggle="modal"
                            data-target="#markRefund"
                        >
                            Mark Refund&nbsp;
                            <BsChevronRight size={15} />
                        </button>
                    ) : (
                        ''
                    )}
                    {voucherData && voucherData.is_refunded === 'Y' ? (
                        <span
                            class="m-2 border p-3 bg-warning float-right"
                            style={{ borderRadius: '5px' }}
                        >
                            <strong>Marked for Refund</strong>
                        </span>
                    ) : (
                        ''
                    )}

                    <div
                        className="modal fade"
                        id="markRefund"
                        tabindex="-1"
                        aria-labelledby="markRefundLabel"
                        aria-hidden="true"
                    >
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="markRefundLabel">
                                        Mark Refund
                                    </h5>
                                    <button
                                        type="button"
                                        className="close"
                                        data-dismiss="modal"
                                        aria-label="Close"
                                    >
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">

                                    <label htmlFor="comment" className="form-label">
                                        Add Your Comments
                                        <span className="text-danger">*</span>
                                    </label>
                                    <textarea
                                        rows="5"
                                        type="text"
                                        title="Your comments..."
                                        className="form-control"
                                        id="comment"
                                        onChange={(e) => setComments(e.target.value)}
                                        required
                                    />
                                    <button type="submit" data-dismiss="modal" onClick={markRefund} class="btn btn-primary my-4 float-right">
                                        Submit
                                    </button>

                                </div>
                            </div>
                        </div>
                    </div>

                    <div
                        className="modal fade"
                        id="paymentDialog"
                        tabindex="-1"
                        aria-labelledby="paymentDialogLabel"
                        aria-hidden="true"
                    >
                        <div className="modal-dialog modal-dialog-centered" role="document">
                            <div className="modal-content">
                                <div className="modal-header">
                                    <h5 className="modal-title" id="paymentDialogLabel">
                                        Mark Refund
                                    </h5>
                                    <button
                                        type="button"
                                        className="close"
                                        data-dismiss="modal"
                                        aria-label="Close"
                                    >
                                        <span aria-hidden="true">&times;</span>
                                    </button>
                                </div>
                                <div className="modal-body">

                                    <div className="form-group">
                                        <label>
                                            Receipt Number
                                            <span className="text-danger">*</span>
                                        </label>
                                        <input
                                            type="text"
                                            title="Receipt Number"
                                            className="form-control"
                                            id="receiptNumber"
                                            onChange={(e) => setReceiptNumber(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="comment" className="form-label">
                                            Add Your Comments
                                            <span className="text-danger">*</span>
                                        </label>
                                        <textarea
                                            rows="5"
                                            type="text"
                                            title="Your comments..."
                                            className="form-control"
                                            id="comment"
                                            onChange={(e) => setComments(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <button type="submit" data-dismiss="modal" onClick={markPaid} class="btn btn-primary my-4 float-right">
                                        Submit
                                    </button>

                                </div>
                            </div>
                        </div>
                    </div>
                    {voucherData && voucherData.application_id && voucherData.application_id._id ? (
                        <a
                            className="mx-2"
                            href={
                                '/' +
                                lang.langKey +
                                '/submitted-application#' +
                                voucherData.application_id._id
                            }
                        >
                            <button className="btn btn-primary float-right mt-4 mx-2" type="button">
                                Application Detail View&nbsp;
                                <BsChevronRight size={15} />
                            </button>
                        </a>
                    ) : (
                        ''
                    )}
                </div>
            ) : (
                <div>
                    <AdminAuthorizationText langKey={lang.langKey} />
                </div>
            )}
        </div>
    );
};
