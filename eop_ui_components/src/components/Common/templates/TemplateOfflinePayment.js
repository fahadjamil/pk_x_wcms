import React from 'react';

export const TemplateOfflinePayment = React.forwardRef((props, ref) => {
    let offlineData = props.offlineData;

    return (
        <div className="row col-md-9 border" ref={ref}>
            <div className="col-md-12">
                <img
                    alt="Logo"
                    class="mt-3 mx-auto d-block"
                    src="/images/1641294014587.jpg"
                    style={{ width: '300px' }}
                />
            </div>
            <div className="col-md-12">
                <h4 style={{ textAlign: 'center' }} className="m-3">
                    Application Fee Voucher
                </h4>
            </div>
            <div className="col-md-12 mt-3">
                <span style={{ float: 'left' }}><strong>Voucher Number:</strong> {offlineData.voucher_num}</span>
                <span style={{ float: 'right' }}><strong>Issue Date:</strong> {offlineData.issue_date}</span>
            </div>
            <div className="col-md-12 mt-3">
                <span style={{ float: 'left' }}><strong>Application Number:</strong> {offlineData.referenceNum}</span>
            </div>
            <div className="col-md-12 mt-3">
                <span style={{ float: 'left' }}><strong>Category:</strong> {offlineData.category}</span>
            </div>
            <div className="col-md-12 mt-3">
                <table className="table border">
                    <thead>
                        <tr>
                            <th>Item Description</th>
                            <th>Amount (SAR)</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>Application Fee ({offlineData.category})</td>
                            <td>{offlineData.payAmount} SAR</td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td></td>
                            <td></td>
                        </tr>
                        <tr>
                            <td>Total Payable</td>
                            <td>{offlineData.payAmount} SAR</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
});
