import React, { useEffect, useState } from 'react';

const ProductItem = (prop) => {
    let [subscribed, setSubscribed] = useState(true);
    let [period, setPeriod] = useState('0');
    let [expDate, setExpDate] = useState(new Date());
    let [price, setPrice] = useState('');

    useEffect(() => {
        setSubscribed(prop && prop.product.SUBSCRIBED);
        setPeriod(prop && prop.product.PERIOD_ID.toString());

        setExpDate(prop && prop.product.EXP_DATE);

        if (prop.product.SUBSCRIBED) {
            for (let i = 0; i < prop.fees.length; i++) {
                if (prop.fees[i].PERIOD_ID === prop.product.PERIOD_ID.toString()) {
                    setPrice(prop.fees[i].FEE);
                    return;
                }
            }
        }
    }, [prop.formReset]);

    const handleCheckBoxChange = (event) => {
        if (event.target.checked) {
            setSubscribed(true);
        } else {
            setSubscribed(false);
            prop.productsDataHandler({
                productId: prop.product.PRODUCT_ID,
                control: 1,
                value: event.target.checked,
            });
        }
    };

    const handleDropDownChange = (event) => {
        setPeriod(event.target.value);

        setPrice(''); // Handle slect default opotion
        for (let i = 0; i < prop.fees.length; i++) {
            if (prop.fees[i].PERIOD_ID === event.target.value) {
                setPrice(prop.fees[i].FEE);
                break;
            }
        }

        setExpDate(getExpiryDate(prop.product, event.target.value));

        prop.productsDataHandler({
            productId: prop.product.PRODUCT_ID,
            control: 2,
            value: event.target.value,
        });
    };

    function getExpiryDate(product, periodId) {
        let toDate = new Date();

        if (product.SUBSCRIBED) {
            toDate = new Date(product.EXP_DATE);
        }

        switch (parseInt(periodId)) {
            case 1: // One Day
                toDate.setDate(toDate.getDate() + 1);
                break;
            case 2: // Week
                toDate.setDate(toDate.getDate() + 7);
                break;
            case 3: // One month
                toDate.setMonth(toDate.getMonth() + 1);
                break;
            case 4: // Three Months
                toDate.setMonth(toDate.getMonth() + 3);
                break;
            case 5: // Six Months
                toDate.setMonth(toDate.getMonth() + 6);
                break;
            case 6: // One Year
                toDate.setFullYear(toDate.getFullYear() + 1);
                break;
        }

        return toDate;
    }

    function formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2) month = '0' + month;
        if (day.length < 2) day = '0' + day;

        return [year, month, day].join('-');
    }

    return (
        <React.Fragment>
            <div className="product-item">
                <div className="row">
                    <div className="col-md-6 d-flex align-items-center">
                        <div className="form-check w-100">
                            <input
                                key={'select_' + prop.product.PRODUCT_ID}
                                disabled={prop.formDisabled}
                                checked={subscribed}
                                className="form-check-input"
                                type="checkbox"
                                onChange={handleCheckBoxChange}
                            />
                            <label className="form-check-label" key={'name_' + prop.product.PRODUCT_ID}>
                                {prop.product.DESCRIPTION_EN}
                            </label>
                        </div>
                    </div>
                    <div className="col-md-2">
                        <div className="form-group">
                            <select
                                className="form-control form-control-sm mt-3"
                                key={'period_' + prop.product.PRODUCT_ID}
                                disabled={prop.formDisabled || !subscribed || prop.product.SUBSCRIBED}
                                value={period}
                                onChange={handleDropDownChange}
                            >
                                {prop.periods}
                            </select>
                        </div>
                    </div>
                    <div className="col-md-2 d-flex align-items-center">
                        <label key={'cost_' + prop.product.PRODUCT_ID}>
                            {subscribed && period !== '0' ? price + ' KWD' : ''}{' '}
                        </label>
                    </div>
                    <div className="col-md-2 d-flex align-items-center">
                        <label key={'date_' + prop.product.PRODUCT_ID}>
                            {subscribed && period !== '0' ? formatDate(expDate) : ''}{' '}
                        </label>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default ProductItem;
