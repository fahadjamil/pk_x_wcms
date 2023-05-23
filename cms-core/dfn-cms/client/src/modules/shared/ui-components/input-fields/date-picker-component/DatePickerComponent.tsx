import React, { useEffect, useState } from 'react';
import DatePicker from 'react-datepicker';
import './react-datepicker.css';

interface PropTypes {
    handleValueChange: any;
    disableDatepicker?: boolean;
    onFocus?: any;
    onBlur?: any;
    selected: Date | null;
    isClearable?: boolean;
    placeholderText?: string;
    minDate?: string;
    maxDate?: string;
    wrapperClassName?: string;
}

export const DatePickerComponent = (props: PropTypes) => {
    const { handleValueChange, disableDatepicker, selected, onFocus, onBlur, isClearable, placeholderText, minDate, maxDate, wrapperClassName } = props;

    const onChange = (date) => {
        handleValueChange(date);
    };

    // const formatDate = (date) => {
    //     let monthVal = date.getMonth() + 1;
    //     let month = monthVal < 10 ? '0' + monthVal : monthVal;
    //     let year = date.getFullYear();
    //     let day = date.getDate();
    //     return `${year}-${month}-${day}`;
    // };

    // function isShowClearIcon() {
    //     return showClear;
    // }

    // function isShowPreviousMonths() {
    //     return showPreviousMonths;
    // }

    // function getMonthsShown() {
    //     return Boolean(showMonthPicker) ? 1 : multipleMonth;
    // }

    // function getFormat() {
    //     return Boolean(showMonthPicker) ? 'MM/yyyy' : format;
    // }

    return (
        <React.Fragment>
            <DatePicker
                    // dateFormat={getFormat()}
                    className="form-control"
                    wrapperClassName={wrapperClassName}
                    selected={selected}
                    onChange={onChange}
                    monthsShown={1}
                    isClearable={isClearable || false}
                    showPreviousMonths={true}
                    showWeekNumbers={true}
                    showMonthDropdown={true}
                    // showMonthYearPicker={showMonthPicker}
                    disabled={disableDatepicker || false}
                    placeholderText={placeholderText || ''}
                    showYearDropdown={true}
                    // maxDate={disableFutureDates? new Date() : undefined}
                    onFocus={onFocus ? onFocus : () => {}}
                    onBlur={onBlur ? onBlur : () => {}}
                    minDate={minDate}
                    maxDate={maxDate}
                />
        </React.Fragment>
    );
};
