import React, { useState } from 'react';
import { DatePickerComponent } from '../../../shared/ui-components/input-fields/date-picker-component';

function SubscriptionsFilterComponent(props) {
    const [filter, setFilter] = useState<any>({});
    const [subscribedFromDate, setSubscribedFromDate] = useState<Date | null>(null);
    const [subscribedToDate, setSubscribedToDate] = useState<Date | null>(null);
    const [expiryFromDate, setExpiryFromDate] = useState<Date | null>(null);
    const [expiryToDate, setExpiryToDate] = useState<Date | null>(null);

    function handleValueChanges(event) {
        const updatedFilter = { ...filter };

        updatedFilter[event.target.name] = event.target.value.trim();
        setFilter(updatedFilter);
    }

    function handleDatePickerValueChanges() {
        const updatedFilter = { ...filter };

        if (subscribedFromDate && subscribedToDate) {
            subscribedFromDate.setHours(0, 0, 0, 0);
            subscribedToDate.setHours(23, 59, 59, 59);

            const offsetFromDate = new Date(
                subscribedFromDate.getTime() - subscribedFromDate.getTimezoneOffset() * 60000
            );
            const offsetToDate = new Date(
                subscribedToDate.getTime() - subscribedToDate.getTimezoneOffset() * 60000
            );

            updatedFilter.subscribed = {};
            updatedFilter.subscribed.fromDate = offsetFromDate.toISOString();
            updatedFilter.subscribed.toDate = offsetToDate.toISOString();
        } else {
            updatedFilter.subscribed = undefined;
        }

        if (expiryFromDate && expiryToDate) {
            const offsetFromDate = new Date(
                expiryFromDate.getTime() - expiryFromDate.getTimezoneOffset() * 60000
            );
            const offsetToDate = new Date(
                expiryToDate.getTime() - expiryToDate.getTimezoneOffset() * 60000
            );

            updatedFilter.expiry = {};
            updatedFilter.expiry.fromDate = offsetFromDate.toISOString();
            updatedFilter.expiry.toDate = offsetToDate.toISOString();
        } else {
            updatedFilter.expiry = undefined;
        }

        setFilter(updatedFilter);
        return updatedFilter;
    }

    function handleSearch() {
        const updatedFilter = handleDatePickerValueChanges();
        props.handleSearch(updatedFilter);
    }

    return (
        <div className="form-row align-items-center m-3">
            <div className="col-1">
                <label className="mr-sm-2" htmlFor="productFilter">
                    Product Id
                </label>
                <input
                    type="text"
                    className="form-control"
                    id="productFilter"
                    placeholder="Product Id"
                    onChange={handleValueChanges}
                    name="productFilter"
                />
            </div>
            <div className="col-2">
                <label className="mr-sm-2" htmlFor="loginNameFilter">
                    Login Name
                </label>
                <input
                    type="text"
                    className="form-control"
                    id="loginNameFilter"
                    placeholder="Login Name"
                    onChange={handleValueChanges}
                    name="loginNameFilter"
                />
            </div>
            <div className="col-2">
                <label className="mr-sm-2" htmlFor="transactionCodeFilter">
                    Trancaction Code
                </label>
                <input
                    type="text"
                    className="form-control"
                    id="transactionCodeFilter"
                    placeholder="Trancaction Code"
                    onChange={handleValueChanges}
                    name="transactionCodeFilter"
                />
            </div>
            <div className="col-3">
                <label className="mr-sm-2">Subscribed Date</label>
                <div className="input-group">
                    <DatePickerComponent
                        wrapperClassName="w-50 pr-2"
                        handleValueChange={(date) => {
                            setSubscribedFromDate(date);
                        }}
                        selected={subscribedFromDate}
                        placeholderText="Select From Date"
                        isClearable={true}
                    />
                    <DatePickerComponent
                        wrapperClassName="w-50"
                        handleValueChange={(date) => {
                            setSubscribedToDate(date);
                        }}
                        selected={subscribedToDate}
                        placeholderText="Select To Date"
                        isClearable={true}
                    />
                </div>
            </div>
            <div className="col-3">
                <label className="mr-sm-2" htmlFor="inlineFormCustomSelect">
                    Expiry Date
                </label>
                <div className="input-group">
                    <DatePickerComponent
                        wrapperClassName="w-50 pr-2"
                        handleValueChange={(date) => {
                            setExpiryFromDate(date);
                        }}
                        selected={expiryFromDate}
                        placeholderText="Select From Date"
                        isClearable={true}
                    />
                    <DatePickerComponent
                        wrapperClassName="w-50"
                        handleValueChange={(date) => {
                            setExpiryToDate(date);
                        }}
                        selected={expiryToDate}
                        placeholderText="Select To Date"
                        isClearable={true}
                    />
                </div>
            </div>
            <div className="col-1 text-right">
                <button className="btn btn-primary  mt-4 w-100" onClick={handleSearch}>
                    Search
                </button>
            </div>
        </div>
    );
}

export default SubscriptionsFilterComponent;
