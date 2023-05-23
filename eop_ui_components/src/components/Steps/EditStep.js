import React, { useState, useEffect } from 'react';
import { eopShowCategories } from '../../config/path';
import { eopUsers } from '../../config/path';
import { eopUpdateStepNum } from '../../config/path';
import { eopUpdateStepItem } from '../../config/path';
import { FiEdit } from 'react-icons/fi';
import Axios from 'axios';
import { ADMIN_FUNCTION_ALLOWED } from '../../config/constants';
import toast, { Toaster } from 'react-hot-toast';
import { AdminAuthorizationText } from '../Common/AdminAuthorizationText';

export const EditStep = (props) => {
    const { lang } = props;
    const [data, setData] = useState({
        step_number: '',
        category: '',
        step_description: '',
    });
    const [loading, setLoading] = useState(true);
    const [authorize, setAuthorize] = useState(false);
    const convertByLang = (arText, enText) => (lang.langKey === 'AR' ? arText : enText);
    const [categoriesData, setCategoriesData] = useState([]);
    const [userData, setUserData] = useState([]);
    const [id, setID] = useState('');
    const [previousData, setPreviousData] = useState([]);
    const [stepId, setStepId] = useState('');
    const [categorysuccess, setCategorySuccess] = useState('');
    const [error, setError] = useState('');
    const [document, setDocument] = useState('');
    const [item_array, setItem_array] = useState([]);
    const [saveMessage, setSaveMessage] = useState('');
    const [formKey, setFormKey] = useState('');
    const [configuration, setConfiguration] = useState('');
    const [itemOrderReadonly, setItemOrderReadonly] = useState(true);

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
        autotranslate: '',
        multiline: '',
        item_order: ''
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
        if (e.target.id === 'autotranslate') {
            setItem({ ...item, autotranslate: e.target.checked });
        }
        if (e.target.id === 'multiline') {
            setItem({ ...item, multiline: e.target.checked });
        }
    };

    useEffect(() => {
        setLoading(true);
        setAuthorize(ADMIN_FUNCTION_ALLOWED);
        setLoading(false);
        let hashValue = window.location.hash;
        let tempID = hashValue.substring(1);
        setID(tempID);
        console.log('Param id value');
        console.log(tempID);
        Axios.get('/api/eop_show_single_step/' + tempID, {}).then((res) => {
            console.log('--Users res--');
            console.log(res);
            let ary = [];
            let previousCategory;
            if (res.data.find_data) {
                console.log('previous data');
                console.log(res.data.find_data[0].category[0]._id);
                previousCategory = res.data.find_data[0].category[0]._id;
                res.data.find_data.forEach((row) => {
                    ary.push(row);
                });
                console.log('--USERS ary--');
                console.log(ary);
                setPreviousData(ary[0]);
            } else {
                console.log('--empty--');
                setPreviousData([]);
            }
            Axios.get('/api/eop_show_categories', {}).then((resp) => {
                console.log('--categories res--');
                console.log(resp);
                let ary = [];
                if (resp.data.user_data.showCategories) {
                    resp.data.user_data.showCategories.forEach((row) => {
                        ary.push(row);
                    });
                    console.log('--CATEGORY ary--');
                    console.log(ary);
                    setCategoriesData(ary);
                    console.log('previous Category');
                    console.log(previousCategory);
                    let document = resp.data.user_data.showCategories.find(
                        (x) => x._id === previousCategory
                    );
                    setDocument(document);
                    console.log('document');
                    console.log(document);
                } else {
                    console.log('--empty--');
                    setCategoriesData([]);
                }
            });
            Axios.get('/api/eop_configuraion', {}).then((res) => {
                console.log('--res--');
                console.log(res.data.find_data[0]);
                setConfiguration(res.data.find_data[0]);
                setItemOrderReadonly(res.data.find_data[0].category_item_order_readonly)
            });

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

    const Add_New_Item = (e) => {
        e.preventDefault();
        let ary = item_array ? item_array : [];

        ary.push({
            step_id: stepId,
            item_enabled: 'Y',
            item_name: item.item_name,
            item_helptext: item.item_helptext,
            item_type: item.item_type,
            validation: item.validation,
            required: item.required,
            enable_arabic: item.enable_arabic,
            dropdown_values_eng: item.dropdown_values_eng.split(/\n/),
            dropdown_values_arb: item.dropdown_values_arb.split(/\n/),
            date_convert: item.date_convert,
            autotranslate: item.autotranslate,
            multiline: item.multiline,
            item_order: ary[ary.length - 1].item_order ? ary[ary.length - 1].item_order + 1 : 0,
        });
        setItem_array(ary);

        console.log(ary);

        setSaveMessage('Remember to click \'Save All Changes\' button to save newly added fields.');

        setItem({
            step_id: stepId,
            item_enabled: 'Y',
            item_name: '',
            item_helptext: '',
            item_type: '',
            validation: '',
            required: '',
            enable_arabic: '',
            dropdown_values_eng: '',
            dropdown_values_arb: '',
            date_convert: '',
            autotranslate: '',
            multiline: '',
            item_order: '',
        });
    };

    const SaveStepChanges = (e) => {

        e.preventDefault();

        for (let i = 0; i < item_array.length; i++) {
            console.log(item_array[i].item_name);
            console.log(document.getElementById('enabled_' + item_array[i]._id).checked);
            console.log(document.getElementById('order_' + item_array[i]._id).value);
            item_array[i].item_enabled = document.getElementById('enabled_' + item_array[i]._id).checked ? 'Y' : 'N';
            item_array[i].item_order = document.getElementById('order_' + item_array[i]._id).value;
        }

        //sort by item_order & re-render
        item_array.sort((a, b) => a.item_order - b.item_order);
        setItem_array(item_array);

        console.log(stepId);
        console.log('SaveStepChanges--item_array');
        console.log(JSON.stringify(item_array));

        Axios.get('/getCSRFToken').then((response) => {
            if (response.data.csrfToken) {
                Axios.post(
                    '/api/eop_update_step_item',
                    {
                        stepId: stepId,
                        itemdata: JSON.stringify(item_array),
                    },
                    {
                        headers: {
                            'x-xsrf-token': response.data.csrfToken,
                        },
                    }
                ).then((res) => {
                    console.log(res);
                    if (res.data.status == 'success') {
                        setSaveMessage('');
                        toast.success(res.data.message);
                        setCategorySuccess(convertByLang(res.data.message_ar, res.data.message));

                        console.log('--res.data--');
                        console.log(res.data);
                        console.log('--res.data.stepData.items--');
                        console.log(res.data.stepData.items);
                        let resp_item_array = res.data.stepData.items;
                        //sort by item_order & re-render
                        resp_item_array.sort((a, b) => a.item_order - b.item_order);
                        setItem_array(resp_item_array);
                        // set formKey to re-render
                        setFormKey(Math.floor(Math.random() * 1000));
                        console.log('after sorting--resp_item_array');
                        console.log(JSON.stringify(resp_item_array));

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

        let sn, ca, sd;
        if (!data.step_number) {
            sn = previousData.step_number;
        } else {
            sn = data.step_number;
        }
        if (!data.category) {
            ca = previousData.category[0]._id;
        } else {
            ca = data.category;
        }
        if (!data.step_description) {
            sd = previousData.step_description;
        } else {
            sd = data.step_description;
        }
        let finaldata = { sn, ca, sd };
        console.log(finaldata);

        Axios.get('/getCSRFToken').then((response) => {
            if (response.data.csrfToken) {
                Axios.post('/api/eop_update_step_num',
                    {
                        id: id,
                        step_number: sn,
                        category: ca,
                        step_description: sd,
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


        setStepId(id);
        if (previousData.items) {
            previousData.items.forEach((item) => {
                item_array.push(item);
            });
            //sort items on item_order
            item_array.sort((a, b) => a.item_order - b.item_order);
        }
    };

    const changeItemChecked = function (val, item) {
        let _item = item_array.find(i => i._id == item._id);
        _item.item_enabled = (val === true ? 'Y' : 'N');
        setItem_array(item_array);
    };

    const changeItemOrder = function (val, item) {

        let _item = item_array.find(i => i._id == item._id);
        _item.item_order = val;
        // sort on item order
        item_array.sort((a, b) => a.item_order - b.item_order);
        setItem_array(item_array);
    };

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

                    {!stepId ? (
                        <form className="row" key={formKey} onSubmit={Add_Step}>
                            <div className="col-md-3 p-2">
                                <label htmlFor="step_number" className="form-label">
                                    Step Number
                                </label>
                                {previousData && previousData.step_number ? (
                                    <input
                                        defaultValue={previousData.step_number}
                                        type="number"
                                        min="0"
                                        title="Please enter the Step number..."
                                        className="form-control"
                                        onChange={Set_Value}
                                        id="step_number"
                                        required
                                    />
                                ) : (
                                    ''
                                )}
                            </div>
                            <div className="col-md-3 p-2">
                                <label htmlFor="category" className="form-label">
                                    Category
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
                                </label>
                                {previousData && previousData.step_description ? (
                                    <textarea
                                        rows="5"
                                        cols="60"
                                        type="text"
                                        defaultValue={previousData.step_description}
                                        onChange={Set_Value}
                                        title="Please enter the Step description..."
                                        className="form-control"
                                        id="step_description"
                                        required
                                    />
                                ) : (
                                    ''
                                )}
                            </div>
                            <div className="col-md-6"></div>
                            <input
                                type="submit"
                                className="btn btn-primary my-4 mx-2"
                                style={{ align: 'right' }}
                                value="Update and Edit Step"
                            />
                        </form>
                    ) : (
                        ''
                    )}

                    {stepId ? (
                        <div>
                            <form onSubmit={Add_New_Item}>
                                <div className="col-md-12">
                                    <h2 className="mt-3">{document ? document.category_name : ''}</h2>
                                </div>
                                <div className="col-md-12">
                                    <h3 className="mt-5 mb-0">Configure Application Form Fields</h3>
                                </div>
                                <div className="row p-3 mt-1 mx-3 border">
                                    <div className="col-md-12 mt-2">
                                        <div className="form-check">
                                            <input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="enable_arabic"
                                                onClick={setItemData}
                                            />
                                            <label
                                                className="form-check-label"
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
                                            <option value="file">File/Attachment Upload</option>
                                            <option value="date">Date Input</option>
                                            <option value="dropdown">Dropdown List</option>
                                            <option value="download">Downloadable File</option>
                                        </select>
                                    </div>
                                    {item.item_type == 'date' && item.enable_arabic === true ? (
                                        <div className="row col-md-12">
                                            <div className="col-md-6 mt-2">
                                                <label
                                                    htmlFor="date_convert"
                                                    className="form-label mt-1"
                                                >
                                                    Select the method of date conversion
                                                </label>
                                                <select
                                                    className="form-control"
                                                    id="date_convert"
                                                    onChange={setItemData}
                                                >
                                                    <option value="">Open this to select</option>
                                                    <option value="arabic">
                                                        Convert to Arabic Numbers
                                                    </option>
                                                    <option value="hijri">Convert to Hijri Date</option>
                                                </select>
                                            </div>
                                            <div className="col-md-6 mt-2"></div>
                                        </div>
                                    ) : (
                                        ''
                                    )}
                                    {item.item_type == 'text' ? (
                                        <div className="col-md-6 p-2 m-2">
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id="multiline"
                                                    onClick={setItemData}
                                                />
                                                <label
                                                    className="form-check-label"
                                                    for="multiline"
                                                >
                                                    Allow Multiline Text Input (Text Area)
                                                </label>
                                            </div>
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
                                                <option value="/^[0-9]+$/">Numeric</option>
                                            </select>
                                        </div>
                                    ) : (
                                        ''
                                    )}
                                    {item.item_type == 'text' &&
                                        item.enable_arabic == true &&
                                        item.autotranslate == true ? (
                                        <div className="col-md-3 p-2 m-2">
                                            <div className="form-check">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    id="autotranslate"
                                                    onClick={setItemData}
                                                />
                                                <label
                                                    className="form-check-label"
                                                    for="autotranslate"
                                                >
                                                    Auto-translate numbers to Arabic
                                                </label>
                                            </div>
                                        </div>
                                    ) : (
                                        ''
                                    )}
                                    {item.item_type == 'dropdown' ? (
                                        <div className="row col-md-12">
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
                                    {item.item_type != 'download' ? (
                                        <div className="col-md-12">
                                            <div className="form-check mt-2">
                                                <input
                                                    className="form-check-input"
                                                    type="checkbox"
                                                    value="required"
                                                    id="required"
                                                    onClick={setItemData}
                                                />
                                                <label className="form-check-label" for="required">
                                                    Mark as Required
                                                </label>
                                            </div>
                                        </div>
                                    )
                                        :
                                        (
                                            ''
                                        )
                                    }
                                    <div className="col-md-3">
                                        <input
                                            type="submit"
                                            className="btn btn-primary my-3 mx-0"
                                            style={{ align: 'right' }}
                                            value="Add New Field"
                                        />
                                    </div>
                                </div>
                            </form>
                            <form onSubmit={SaveStepChanges}>
                                <div className="col-md-12 mt-4">
                                    <h3 className="mt-5 mb-0">Configure Application Form Fields</h3>
                                </div>
                                <div className="row p-3 mt-1 mx-3 border">
                                    <div className="row col-md-12">
                                        {item_array
                                            ? item_array.map((item, index) => {
                                                // console.log('maping section');
                                                // console.log(item_array);
                                                return (
                                                    <div key={index} className="col-md-5 p-0 m-3 card">
                                                        <div className='card-header'>
                                                            <div class="custom-control custom-checkbox float-left">
                                                                <input
                                                                    type="checkbox"
                                                                    id={'enabled_' + item._id}
                                                                    className='custom-control-input'
                                                                    value={item.item_enabled}
                                                                    defaultChecked={
                                                                        item.item_enabled == 'Y'
                                                                            ? true
                                                                            : item.item_enabled == 'N'
                                                                                ? false
                                                                                : item.item_enabled
                                                                    }
                                                                    onChange={(e) =>
                                                                        changeItemChecked(
                                                                            e.target.checked,
                                                                            item
                                                                        )
                                                                    }
                                                                />
                                                                &nbsp;
                                                                <label className='custom-control-label' for={item._id}>{item.item_name}</label>
                                                            </div>
                                                            <a
                                                                className='btn btn-sm btn-primary float-right'
                                                                title='Edit'
                                                                href={
                                                                    '/' +
                                                                    lang.langKey +
                                                                    '/update-item#' +
                                                                    item._id
                                                                }
                                                            >
                                                                <FiEdit />&nbsp;Edit
                                                            </a>
                                                        </div>
                                                        <div className='card-body'>
                                                            <small className="form-text text-muted">
                                                                Type: {item.item_type}
                                                            </small>
                                                            <small className="form-text text-muted">
                                                                Help text: {item.item_helptext}
                                                            </small>
                                                        </div>
                                                        <div className='mr-3 text-right'>
                                                            <small>
                                                                <label>Display Position&nbsp;<input id={'order_' + item._id} readOnly={itemOrderReadonly} type="number" style={{ width: '50px' }} defaultValue={item.item_order ? item.item_order : 0} onChange={(e) =>
                                                                    changeItemOrder(
                                                                        e.target.value,
                                                                        item
                                                                    )
                                                                } /></label>
                                                            </small>

                                                        </div>
                                                    </div>
                                                );
                                            })
                                            : ''}
                                    </div>
                                </div>
                                <button type="submit" className="btn btn-lg btn-success m-3">
                                    Save All Changes
                                </button>
                                {saveMessage ? <div className='mt-4 alert alert-warning' role="alert">{saveMessage}</div> : ''}
                            </form>
                        </div>
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
