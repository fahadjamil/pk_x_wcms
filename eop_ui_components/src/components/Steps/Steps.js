import React, { useState, useEffect } from 'react';
import { eopShowCategories } from '../../config/path';
import { eopUsers } from '../../config/path';
import { eopStepNum } from '../../config/path';
import { eopStepItems } from '../../config/path';
import Axios from 'axios';
import { ADMIN_FUNCTION_ALLOWED } from '../../config/constants';
import toast, { Toaster } from 'react-hot-toast';
import { AdminAuthorizationText } from '../Common/AdminAuthorizationText';

export const Steps = (props) => {
    const { lang } = props;
    const [loading, setLoading] = useState(true);
    const [authorize, setAuthorize] = useState(false);
    const [data, setData] = useState({
        step_number: '',
        category: '',
        step_description: '',
    });
    const convertByLang = (arText, enText) => (lang.langKey === 'AR' ? arText : enText);
    const [categoriesData, setCategoriesData] = useState([]);
    const [resData, setResData] = useState('');
    const [categorysuccess, setCategorySuccess] = useState('');
    const [category_data, setcategory] = useState('');

    const [item, setItem] = useState({
        enable_arabic: '',
        item_name: '',
        item_helptext: '',
        item_type: '',
        validation: '',
        required: '',
        dropdown_values_eng: '',
        dropdown_values_arb: '',
        date_convert: '',
    });
    const setItemData = (e) => {
        console.log(e.target);
        console.log(e.target.value);
        if (e.target.id === 'enable_arabic') {
            setItem({ ...item, enable_arabic: e.target.checked });
        }
        if (e.target.id === 'item_name') {
            setItem({ ...item, item_name: e.target.value });
        }
        if (e.target.id === 'item_helptext') {
            setItem({ ...item, item_helptext: e.target.value });
        }
        if (e.target.id === 'item_type') {
            setItem({ ...item, item_type: e.target.value });
        }
        if (e.target.id === 'validation') {
            setItem({ ...item, validation: e.target.value });
        }
        if (e.target.id === 'required') {
            setItem({ ...item, required: e.target.checked ? 'required' : 'not required' });
        }
        if (e.target.id === 'dropdown_values_eng') {
            setItem({ ...item, dropdown_values_eng: e.target.value });
        }
        if (e.target.id === 'dropdown_values_arb') {
            setItem({ ...item, dropdown_values_arb: e.target.value });
        }
        if (e.target.id === 'date_convert') {
            setItem({ ...item, date_convert: e.target.value });
        }
    };

    const [error, setError] = useState('');
    useEffect(() => {
        setLoading(true);
        setAuthorize(ADMIN_FUNCTION_ALLOWED);
        setLoading(false);
        let hashValue = window.location.hash;
        let tempID = hashValue.substring(1);
        setcategory(tempID);
        Axios.get('/api/eop_show_categories', {}).then((res) => {
            console.log('--categories res--');
            console.log(res);
            let ary = [];
            if (res.data.user_data.showCategories) {
                res.data.user_data.showCategories.forEach((row) => {
                    ary.push(row);
                });
                console.log('--CATEGORY ary--');
                console.log(ary);
                setCategoriesData(ary);
            } else {
                console.log('--empty--');
                setCategoriesData([]);
            }
        });
    }, []);

    const Set_Value = (e) => {
        if (e.target.id === 'step_number') {
            setData({ ...data, step_number: e.target.value });
        }
        if (e.target.id === 'category') {
            setData({ ...data, category: e.target.value });
        }
        if (e.target.id === 'step_description') {
            setData({ ...data, step_description: e.target.value });
        }
    };

    const [item_array, setItem_array] = useState([]);

    const Add_Step_Items = (e) => {
        e.preventDefault();
        console.log('item data');
        console.log(item);
        let ary = item_array ? item_array : [];

        ary.push({
            step_id: resData,
            item_enabled: true,
            item_name: item.item_name,
            item_helptext: item.item_helptext,
            item_type: item.item_type,
            validation: item.validation,
            required: item.required,
            enable_arabic: item.enable_arabic,
            dropdown_values_eng: item.dropdown_values_eng.split(/\n/),
            dropdown_values_arb: item.dropdown_values_arb.split(/\n/),
            date_convert: item.date_convert,
        });

        setItem_array(ary);
        console.log(ary);
        setItem({
            item_type: '',
            item_helptext: '',
            item_name: '',
            validation: '',
            required: '',
            enable_arabic: '',
            dropdown_values_eng: '',
            dropdown_values_arb: '',
            date_convert: '',
        });
    };
    const Add_Step_item = (e) => {
        e.preventDefault();
        console.log('item_array');
        console.log(JSON.stringify(item_array));
        console.log(resData);
        Axios.get('/getCSRFToken').then((response) => {
            if (response.data.csrfToken) {
                Axios.post(
                    '/api/eop_step_item',
                    {
                        item_data: JSON.stringify(item_array),
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
                        setCategorySuccess(convertByLang(res.data.message_ar, res.data.message));
                    } else {
                        toast.error(res.data.message);
                        setError(convertByLang(res.data.message_ar, res.data.message));
                    }
                });
            }
        });
    };

    const Add_Step = (e) => {
        e.preventDefault();
        console.log(data);
        Axios.get('/getCSRFToken').then((response) => {
            if (response.data.csrfToken) {
                Axios.post(
                    '/api/eop_step_num',
                    {
                        step_number: data.step_number,
                        category: category_data,
                        step_description: data.step_description,
                    },
                    {
                        headers: {
                            'x-xsrf-token': response.data.csrfToken,
                        },
                    }
                ).then((res) => {
                    console.log(res);
                    if (res.data.status == 'success') {
                        setResData(res.data.step_data._id);
                        toast.success(res.data.message);
                        setCategorySuccess(convertByLang(res.data.message_ar, res.data.message));
                    } else {
                        toast.error(res.data.message);
                        setError(convertByLang(res.data.message_ar, res.data.message));
                    }
                });
            }
        });
    };

    const changeItemChecked = function (val, index) {
        //e.preventDefault();
        let ary = item_array;
        let _item = ary[index];
        _item.item_enabled = val;
        item_array[index] = _item;
        setItem_array(ary);
        console.log(item_array);
    };
    console.log('category_data');
    console.log(category_data);
    let document = categoriesData.find((x) => x._id === category_data);
    console.log('document');
    console.log(document);

    return (
        <div style={{ display: loading ? 'none' : 'block' }}>
            {authorize ? (
                <div>
                    <Toaster
                        position="top-center"
                        reverseOrder={false}
                        toastOptions={{
                            duration: 5000,
                        }}
                    />

                    <form className="row " onSubmit={Add_Step}>
                        <div className="col-md-3 p-2">
                            <label htmlFor="step_number" className="form-label">
                                Step Number
                                <span className="text-danger">*</span>
                            </label>
                            <input
                                type="number"
                                min="0"
                                title="Please enter the Step number..."
                                className="form-control"
                                onChange={Set_Value}
                                id="step_number"
                                required
                            />
                        </div>
                        <div className="col-md-3 p-2">
                            <label htmlFor="category" className="form-label">
                                Category
                                <span className="text-danger">*</span>
                            </label>
                            <input
                                type="text"
                                readOnly
                                className="form-control"
                                defaultValue={document ? document.category_name : ''}
                            />
                        </div>
                        <div className="col-md-3 p-2"></div>
                        <div className="col-md-6 p-2">
                            <label htmlFor="step_description" className="form-label">
                                Step Description
                                <span className="text-danger">*</span>
                            </label>
                            <textarea
                                rows="5"
                                cols="60"
                                type="text"
                                onChange={Set_Value}
                                title="Please enter the Step description..."
                                className="form-control"
                                id="step_description"
                                required
                            />
                        </div>
                        <div className="col-md-6"></div>
                        <input
                            type="submit"
                            className="btn btn-primary my-4 mx-2"
                            style={{ align: 'right' }}
                            value="submit"
                        />
                    </form>

                    {resData ? (
                        <form
                            className="row border"
                            onSubmit={Add_Step_Items}
                            style={{ borderRadius: '1rem' }}
                        >
                            <div className="col-md-12">
                                <h3 className="mt-5 mx-2">Required Items</h3>
                            </div>
                            <div className="row border mx-3" style={{ borderRadius: '1rem' }}>
                                <div className="col-md-12 mt-2">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="enable_arabic"
                                            onClick={setItemData}
                                        />
                                        <label
                                            className="form-check-label pt-1"
                                            for="enable_arabic"
                                        >
                                            Enable Arabic Input
                                        </label>
                                    </div>
                                </div>
                                <div className="col-md-3 p-2 m-2">
                                    <label htmlFor="item_name" className="form-label mt-1">
                                        Item Name
                                        <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="item_name"
                                        required
                                        onChange={setItemData}
                                    />
                                </div>
                                <div className="col-md-3 p-2 m-2">
                                    <label htmlFor="item_helptext" className="form-label mt-1">
                                        Item Help Text
                                        <span className="text-danger">*</span>
                                    </label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="item_helptext"
                                        required
                                        onChange={setItemData}
                                    />
                                </div>
                                <div className="col-md-3 p-2 m-2">
                                    <label htmlFor="item_type" className="form-label mt-1">
                                        Item Type
                                        <span className="text-danger">*</span>
                                    </label>
                                    <select
                                        className="form-control"
                                        id="item_type"
                                        onChange={setItemData}
                                        required
                                    >
                                        <option value="">Open this to select</option>
                                        <option value="text">Text Input</option>
                                        <option value="file">File Upload</option>
                                        <option value="date">Date Input</option>
                                        <option value="dropdown">Dropdown List</option>
                                    </select>
                                </div>
                                {item.item_type == 'date' && item.enable_arabic === true ? (
                                    <div className="row col-md-12">
                                        <div className="col-md-6 mt-2">
                                            <label
                                                htmlFor="date_convert"
                                                className="form-label mt-1"
                                            >
                                                Select the method of conversion
                                            </label>
                                            <select
                                                className="form-control"
                                                id="date_convert"
                                                onChange={setItemData}
                                            >
                                                <option value="">Open this to select</option>
                                                <option value="arabic">Change to Arabic</option>
                                                <option value="hijri">Change to Hijri</option>
                                            </select>
                                        </div>
                                        <div className="col-md-6 mt-2"></div>
                                    </div>
                                ) : (
                                    ''
                                )}
                                {item.item_type == 'text' ? (
                                    <div className="col-md-3 p-2 m-2">
                                        <label htmlFor="validation" className="form-label mt-1">
                                            Validation Pattern for Input Text
                                        </label>
                                        <select
                                            className="form-control"
                                            id="validation"
                                            onChange={setItemData}
                                        >
                                            <option value="">Open this to select</option>
                                            <option value="^\d{5}-\d{7}-\d{1}$">CNIC</option>
                                            <option value="^[2]\d{9}$">Iqama Number</option>
                                            <option value="^(\d{1,3}[- ]?)?\d{10}$">
                                                Mobile Number
                                            </option>
                                            <option value="^(?!^0+$)[a-zA-Z0-9]{6,9}$">
                                                Passport
                                            </option>
                                            <option value="/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/">
                                                Email
                                            </option>
                                        </select>
                                    </div>
                                ) : (
                                    ''
                                )}
                                {item.item_type == 'dropdown' ? (
                                    <div className="row">
                                        <div className="col-md-3 p-2 m-2">
                                            <label
                                                htmlFor="dropdown_values_eng"
                                                className="form-label"
                                            >
                                                Dropdown Values in English
                                                <span className="text-danger">*</span>
                                            </label>
                                            <textarea
                                                rows="5"
                                                cols="60"
                                                type="text"
                                                onChange={setItemData}
                                                title="Please enter the Dropdown Values..."
                                                className="form-control"
                                                id="dropdown_values_eng"
                                                required
                                            />
                                            <small className="form-text text-muted">
                                                Please enter one value per line
                                            </small>
                                        </div>
                                        {item.enable_arabic == true ? (
                                            <div className="col-md-3 p-2 m-2">
                                                <label
                                                    htmlFor="dropdown_values_arb"
                                                    className="form-label"
                                                >
                                                    Dropdown Values in Arabic
                                                    <span className="text-danger">*</span>
                                                </label>
                                                <textarea
                                                    rows="5"
                                                    cols="60"
                                                    type="text"
                                                    onChange={setItemData}
                                                    title="Please enter the Dropdown Values..."
                                                    className="form-control"
                                                    id="dropdown_values_arb"
                                                    required
                                                />
                                                <small className="form-text text-muted">
                                                    Please enter one value per line
                                                </small>
                                            </div>
                                        ) : (
                                            ''
                                        )}
                                    </div>
                                ) : (
                                    ''
                                )}
                                <div className="col-md-3 ">
                                    <div className="form-check mt-2">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            value="required"
                                            id="required"
                                            onClick={setItemData}
                                        />
                                        <label className="form-check-label pt-1" for="required">
                                            Mark as Required
                                        </label>
                                    </div>
                                </div>
                                <input
                                    type="submit"
                                    className="btn btn-primary my-5 mx-5"
                                    style={{ align: 'right' }}
                                    value="submit"
                                />
                            </div>
                            <div
                                className="col-md-12 p-2 m-1 border"
                                style={{ borderRadius: '1rem' }}
                            >
                                <div className="row">
                                    {item_array
                                        ? item_array.map((item, index) => {
                                              return (
                                                  <div key={index} className="col-md-3 p-3">
                                                      <input
                                                          type="checkbox"
                                                          value={item}
                                                          defaultChecked={item.item_enabled}
                                                          onChange={(e) =>
                                                              changeItemChecked(
                                                                  e.target.checked,
                                                                  index
                                                              )
                                                          }
                                                      />
                                                      <label>{item.item_name}</label>
                                                      <br></br>
                                                  </div>
                                              );
                                          })
                                        : ''}
                                </div>
                            </div>
                            <button className="btn btn-primary m-2" onClick={Add_Step_item}>
                                Submit
                            </button>
                        </form>
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
