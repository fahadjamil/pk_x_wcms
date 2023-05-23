import React from 'react';
import DatePicker from 'react-datepicker';
// import './react-datepicker.css';

function DatePickerComponent(props) {
    const {
        handleDatePickerValueChanges,
        disableDatepicker,
        selected,
        onFocus,
        onBlur,
        isClearable,
        placeholderText,
        minDate,
        maxDate,
        wrapperClassName,
        validationErrors,
    } = props;

    const onChange = (date) => {
        handleDatePickerValueChanges(date, props.id);
    };

    const formatDate = (value) => {
        const date = new Date(value);
        const year = date.getFullYear();
        let month = date.getMonth() + 1;
        let dt = date.getDate();

        if (dt < 10) {
            dt = '0' + dt;
        }
        if (month < 10) {
            month = '0' + month;
        }

        return year + '-' + month + '-' + dt;
    };

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
            <label htmlFor={props.id} className={props.uiProperties.label.classes || ''}>
                {props.label}
            </label>
            <div className="d-none d-md-block">
                <DatePicker
                    // dateFormat={getFormat()}
                    className={props.uiProperties.field.classes || ''}
                    wrapperClassName={wrapperClassName}
                    selected={props.value ? new Date(props.value) : ''}
                    onChange={onChange}
                    monthsShown={1}
                    isClearable={true}
                    showPreviousMonths={true}
                    showWeekNumbers={true}
                    showMonthDropdown={true}
                    // showMonthYearPicker={showMonthPicker}
                    disabled={false}
                    placeholderText={''}
                    showYearDropdown={true}
                    // maxDate={disableFutureDates? new Date() : undefined}
                    onFocus={onFocus ? onFocus : () => {}}
                    onBlur={onBlur ? onBlur : () => {}}
                    minDate={minDate}
                    maxDate={maxDate}
                />
                {validationErrors && (
                    <div className="invalid-feedback d-block">
                        {validationErrors.message || 'Invalid field data'}
                    </div>
                )}
            </div>
            <div className="d-md-none">
                <input
                    className={props.uiProperties.field.classes || ''}
                    type="date"
                    value={props.value ? formatDate(props.value) : ''}
                    onChange={(event) => {
                        handleDatePickerValueChanges(event.target.value, props.id);
                    }}
                />
                {validationErrors && (
                    <div className="invalid-feedback d-block">
                        {validationErrors.message || 'Invalid field data'}
                    </div>
                )}
            </div>
        </React.Fragment>
    );
}

export default DatePickerComponent;
