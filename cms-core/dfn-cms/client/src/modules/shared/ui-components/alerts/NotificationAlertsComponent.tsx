import React from 'react';

export interface PropTypes {
    responseData: {
        status: string;
        msg: string;
    } | undefined;
}

function NotificationAlertsComponent(props: PropTypes) {
    return (
        <>
            {props.responseData && props.responseData.status === 'success' && (
                <div className="row">
                    <div className="col-md-12">
                        <div
                            className="alert alert-success alert-dismissible fade show mt-2"
                            role="alert"
                        >
                            <strong>Success</strong> {props.responseData.msg}
                            <button
                                type="button"
                                className="close"
                                data-dismiss="alert"
                                aria-label="Close"
                            >
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {props.responseData && props.responseData.status === 'failed' && (
                <div className="row">
                    <div className="col-md-12">
                        <div
                            className="alert alert-danger alert-dismissible fade show mt-2"
                            role="alert"
                        >
                            <strong>Failed</strong> {props.responseData.msg}
                            <button
                                type="button"
                                className="close"
                                data-dismiss="alert"
                                aria-label="Close"
                            >
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
            {props.responseData && props.responseData.status === 'inprogress' && (
                <div className="row">
                    <div className="col-md-12">
                        <div
                            className="alert alert-info alert-dismissible fade show mt-2"
                            role="alert"
                        >
                            <strong>InProgress</strong> {props.responseData.msg}
                            <button
                                type="button"
                                className="close"
                                data-dismiss="alert"
                                aria-label="Close"
                            >
                                <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}

export default NotificationAlertsComponent;
