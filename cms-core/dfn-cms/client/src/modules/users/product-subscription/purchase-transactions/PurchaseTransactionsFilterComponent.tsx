import React, { useState } from 'react';
import MultiSelect from 'react-multi-select-component';
import { DatePickerComponent } from '../../../shared/ui-components/input-fields/date-picker-component';

function PurchaseTransactionsFilterComponent(props) {
    const [filter, setFilter] = useState<any>({});
    const [fromDate, setFromDate] = useState<Date | null>(null);
    const [toDate, setToDate] = useState<Date | null>(null);
    const [selectedTransactionStatus, setSelectedTransactionStatus] = useState([]);

    const transactionStatus = [
        { label: 'success', value: '1' },
        { label: 'failed', value: '-1' },
        { label: 'urlSendToUser', value: '0' },
        { label: 'sendToPayment', value: '2' },
    ];

    function handleValueChanges(event) {
        const updatedFilter = { ...filter };

        updatedFilter[event.target.name] = event.target.value.trim();
        setFilter(updatedFilter);
    }

    function handleMultiselectValueChanges(values) {
        const updatedFilter = { ...filter };

        if (!('status' in updatedFilter)) {
            updatedFilter['status'] = [];
        }

        const selectedStatus = values.map((option) => option.value);
        updatedFilter['status'] = selectedStatus;

        setFilter(updatedFilter);
        setSelectedTransactionStatus(values);
    }

    function handleDatePickerValueChanges() {
        const updatedFilter = { ...filter };

        if (fromDate && toDate) {
            fromDate.setHours(0, 0, 0, 0);
            toDate.setHours(23, 59, 59, 59);

            // const offsetFromDate = new Date(
            //     fromDate.getTime() - fromDate.getTimezoneOffset() * 60000
            // );
            // const offsetToDate = new Date(toDate.getTime() - toDate.getTimezoneOffset() * 60000);

            updatedFilter.created = {};
            // updatedFilter.created.fromDate = offsetFromDate.toISOString();
            // updatedFilter.created.toDate = offsetToDate.toISOString();
            updatedFilter.created.fromDate = fromDate;
            updatedFilter.created.toDate = toDate;
        } else {
            updatedFilter.created = undefined;
        }

        setFilter(updatedFilter);
        return updatedFilter;
    }

    function handleSearch() {
        const updatedFilter = handleDatePickerValueChanges();
        props.handleSearch(updatedFilter);
    }

    return (
        <div className="form-row align-items-center m-3 w-100">
            <div className="col-3 mb-3">
                <label className="mr-sm-2" htmlFor="trackIdFilter">
                    Track Id
                </label>
                <input
                    type="text"
                    className="form-control"
                    id="trackIdFilter"
                    placeholder="Track Id"
                    name="trackIdFilter"
                    onChange={handleValueChanges}
                />
            </div>
            <div className="col-3 mb-3">
                <label className="mr-sm-2" htmlFor="paymentIdFilter">
                    Payment Id
                </label>
                <input
                    type="text"
                    className="form-control"
                    id="paymentIdFilter"
                    placeholder="Payment Id"
                    name="paymentIdFilter"
                    onChange={handleValueChanges}
                />
            </div>
            <div className="col-3 mb-3">
                <label className="mr-sm-2" htmlFor="trancactionIdFilter">
                    Transaction Id
                </label>
                <input
                    type="text"
                    className="form-control"
                    id="trancactionIdFilter"
                    placeholder="Transaction Id"
                    name="trancactionIdFilter"
                    onChange={handleValueChanges}
                />
            </div>
            <div className="col-3 mb-3">
                <label className="mr-sm-2" htmlFor="referenceIdFilter">
                    Reference Id
                </label>
                <input
                    type="text"
                    className="form-control"
                    id="referenceIdFilter"
                    placeholder="Reference Id"
                    name="referenceIdFilter"
                    onChange={handleValueChanges}
                />
            </div>
            <div className="col">
                <label className="mr-sm-2" htmlFor="loginName">
                    Login Name
                </label>
                <input
                    type="text"
                    className="form-control"
                    id="loginName"
                    placeholder="Login Name"
                    name="loginName"
                    onChange={handleValueChanges}
                />
            </div>
            <div className="col">
                <label className="mr-sm-2" htmlFor="status">
                    status
                </label>
                <MultiSelect
                    className="multi-select form-control p-0"
                    options={transactionStatus}
                    value={selectedTransactionStatus}
                    onChange={handleMultiselectValueChanges}
                    labelledBy="basic-addon4"
                />
            </div>
            <div className="col">
                <label className="mr-sm-2" htmlFor="inlineFormCustomSelect">
                    Created Date
                </label>
                <div className="input-group">
                    <DatePickerComponent
                        wrapperClassName="w-50 pr-2"
                        handleValueChange={(date) => {
                            setFromDate(date);
                        }}
                        selected={fromDate}
                        placeholderText="Select From Date"
                        isClearable={true}
                    />
                    <DatePickerComponent
                        wrapperClassName="w-50"
                        handleValueChange={(date) => {
                            setToDate(date);
                        }}
                        selected={toDate}
                        placeholderText="Select To Date"
                        isClearable={true}
                    />
                </div>
            </div>
            <div className="col text-right">
                <button className="btn btn-primary mt-4" onClick={handleSearch}>
                    Search
                </button>
            </div>
        </div>
    );
}

export default PurchaseTransactionsFilterComponent;
