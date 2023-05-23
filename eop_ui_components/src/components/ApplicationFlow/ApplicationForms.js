import React, { useState, useEffect, useRef } from 'react';
import Axios from 'axios';
import { eopApplicationSubmissions } from '../../config/path';
import { BsArrowRight, BsChevronLeft, BsChevronRight, BsBoxArrowUpRight } from 'react-icons/bs';
import Cookies from 'universal-cookie/es6';
import { LOGIN_ID_COOKIE, ADMIN_LOGIN_ID_COOKIE } from '../../config/constants';
import toast, { Toaster } from 'react-hot-toast';
import { GrDocumentPdf } from 'react-icons/gr';
import { AiOutlineFileDone } from 'react-icons/ai';
import { AuthorizationText } from '../Common/AuthorizationText';
import { cloneDeep } from 'lodash';
import moment from 'moment';
import { TemplateOfflinePayment } from '../Common/templates/TemplateOfflinePayment';
import { useReactToPrint } from 'react-to-print';
import ReactToPdf from 'react-to-pdf';

let count = 0;
let Arr = new Array();
let DisplayArr = new Array();

let userCookie = null;
let adminCookie = null;

export const ApplicationForms = (props) => {
    const { lang } = props;
    const [loading, setLoading] = useState(true);
    const [authorizedUser, setAuthorizedUser] = useState(null);
    const [authorizedAdmin, setAuthorizedAdmin] = useState(null);
    const componentRef = useRef();
    const handlePrint = useReactToPrint({
        content: () => componentRef.current,
    });
    // const navigate = useNavigate();
    const convertByLang = (arText, enText) => (lang.langKey === 'AR' ? arText : enText);
    const [error, setError] = useState('');
    const [applicationsuccess, setApplicationSuccess] = useState('');
    const [referenceNum, SetReferenceNum] = useState('');
    const cookies = new Cookies();
    const [id, setID] = useState('');
    const [index, setIndex] = useState(-1);
    const [fields, setFields] = useState([]);
    const [onReviewStep, setOnReviewStep] = useState(false);
    const [errors, setErrors] = useState('');
    const [categoryData, setCategoryData] = useState('');
    const [formSection, setFormSection] = useState('1');
    const [formKey, setFormKey] = useState('');
    const [paymentModule, setPaymentModule] = useState(0);
    const [loaded, setLoaded] = useState(false);
    const [paymentWay, setPaymentWay] = useState('');
    const [payAmount, setPayAmount] = useState('');
    const [voucherCD, setvoucherCD] = useState('');
    const [voucher_num, setvoucher_num] = useState('');
    const [voucherId, setvoucherId] = useState('');

    let htmlString;

    useEffect(() => {
        console.log('--useEffect--');

        setAuthorizedUser(userCookie);
        setAuthorizedAdmin(adminCookie);

        console.log('--authorizedUser--');
        console.log(authorizedUser);
        console.log('--authorizedAdmin--');
        console.log(authorizedAdmin);

        setLoading(false);
        console.log('--setLoading -- false--');

        let hashValue = window.location.hash;
        let tempID = hashValue.substring(1);
        setID(tempID);
        // console.log('Param id value');
        // console.log(tempID);

        Axios.get('/api/eop_get_form_data/' + tempID, {}).then((res) => {
            console.log('--/api/eop_get_form_data/--');
            // console.log(res);
            setCategoryData(res.data.find_data);
            console.log(res.data.find_data[0].category[0].category_fee);
            setPayAmount(res.data.find_data[0].category[0].category_fee);

            //setUpForm();
        });

        const script = document.createElement('script');
        script.src = 'https://www.merchant.geidea.net/hpp/geideapay.min.js';
        script.onload = function () {
            setLoaded(true);
        };
        script.async = true;
        document.body.appendChild(script);
    }, []);

    const Success = (res) => {
        console.log('Success');
        console.log(res);
        Axios.get('/getCSRFToken').then((response) => {
            console.log('response token');
            console.log(response.data.csrfToken);
            if (response.data.csrfToken) {
                Axios.post(
                    '/api/eop_payment_getway',
                    { res: res, voucher_id: voucherId },
                    {
                        headers: {
                            'x-xsrf-token': response.data.csrfToken,
                        },
                    }
                ).then((res) => {
                    console.log('res');
                    console.log(res);
                    if (res.data.status == 'success') {
                        toast.success(res.data.message);
                    } else {
                        toast.error(res.data.message);
                    }
                });
            }
        });
    };
    const Errorfunction = (res) => {
        console.log('error');
        console.log(res);
        Axios.get('/getCSRFToken').then((response) => {
            console.log('response token');
            console.log(response.data.csrfToken);
            if (response.data.csrfToken) {
                Axios.post(
                    '/api/eop_payment_getway',
                    { res: res },
                    {
                        headers: {
                            'x-xsrf-token': response.data.csrfToken,
                        },
                    }
                ).then((res) => {
                    console.log('res');
                    console.log(res);
                    toast.error(res.data.message);
                });
            }
        });
    };
    const Cancel = (res) => {
        console.log('Cancel');
        console.log(res);
        Axios.get('/getCSRFToken').then((response) => {
            console.log('response token');
            console.log(response.data.csrfToken);
            if (response.data.csrfToken) {
                Axios.post(
                    '/api/eop_payment_getway',
                    { res: res },
                    {
                        headers: {
                            'x-xsrf-token': response.data.csrfToken,
                        },
                    }
                ).then((res) => {
                    console.log('res');
                    console.log(res);
                    toast.error(res.data.message);
                });
            }
        });
    };

    const initPayment = () => {
        const payment = new window.GeideaApi(
            '97ccda5d-f53c-4d1d-b18b-6ea728b7ed3c',
            Success,
            Errorfunction,
            Cancel
        );
        payment.configurePayment({
            amount: payAmount,
            currency: 'SAR',
            language: lang.langKey,
            merchantReferenceId: voucherId,
        });
        payment.startPayment();
    };

    if (categoryData[0]) {
        const Prerequisite = categoryData[0].category[0].prerequisites;
        htmlString = Prerequisite.toString();
    }
    const proceed_function = () => {
        console.log('--proceed_function--');
        setFormSection('');
        setIndex(0);
        setUpForm(0);
    };

    const LastStep = (e) => {
        console.log('--LastStep--');
        e.preventDefault();
        setErrors('');
        setFormSection('');

        let bFormValid = true;
        let _fields = fields;
        let _errors = errors;

        let items = categoryData[index].items;
        items.forEach((item) => {
            if (
                item.required === 'required' &&
                (_fields[item._id] === undefined ||
                    _fields[item._id] === false ||
                    _fields[item._id] === '')
            ) {
                bFormValid = false;
                item.error = 'required';
            }
        });
        // console.log('--LastStep--');
        // console.log(_errors);
        // console.log('bFormValid');
        // console.log(bFormValid);
        // console.log('---Arr---');
        // console.log(Arr);
        if (bFormValid) {
            setOnReviewStep(true);
        } else {
            setErrors('Missing value(s) for required field(s).');
            toast.error((t) => (
                <div>
                    <button className="float-right" onClick={() => toast.dismiss(t.id)}>
                        Close
                    </button>
                    <div>{'Missing value(s) for required field(s).'}</div>
                </div>
            ));
        }
    };

    const Next = (e) => {
        console.log('--Next--');
        e.preventDefault();
        setErrors('');
        setFormSection('');
        let bFormValid = true;
        let _fields = fields;
        let _errors = errors;

        // console.log(_fields);

        let items = categoryData[index].items;
        var errorItems = [];
        items.forEach((item) => {
            if (
                item.required === 'required' &&
                (_fields[item._id] === undefined ||
                    _fields[item._id] === false ||
                    _fields[item._id] === '')
            ) {
                bFormValid = false;
                item.error = 'required';
                errorItems.push(item.item_name);
            }
        });
        // console.log(_errors);
        //setErrors(_errors);
        // console.log('bFormValid');
        // console.log(bFormValid);
        if (!bFormValid) {
            setErrors('Missing value(s) for required field(s):' + errorItems.join(', '));
            toast.error((t) => (
                <div>
                    <button className="float-right" onClick={() => toast.dismiss(t.id)}>Close</button>
                    <div>
                        {'Missing value(s) for required field(s):' + errorItems.join(', ')}
                    </div>
                </div>
            ));
        }
        if (bFormValid) {
            setIndex(index + 1);
            setUpForm(index + 1);
        }
    };

    const setUpForm = (_index) => {
        console.log('--setUpForm--');
        let _fields = fields;
        let _errors = [];
        categoryData[_index].items.forEach((item) => {
            _fields[item._id] = '';
            //_errors[item._id] = '';
        });
        setFields(_fields);
        setErrors('');
    };

    const backfromReview = () => {
        console.log('--setbackfromReview--');
        setFormSection('');
        setIndex(categoryData.length - 1);
        setOnReviewStep(false);
    };
    const Previous = () => {
        console.log('--Previous--');
        setFormSection('');
        setIndex(index - 1);
    };

    const setFieldData = (id, data) => {
        console.log('--setFieldData--');
        console.log(id);
        console.log(data);

        let _fields = fields;
        _fields[id] = data;
        setFields(_fields);
    };

    const onChangeHandler = (e, item) => {
        console.log('--onChangeHandler--');
        console.log(item);
        // console.log(e.target.id);
        // console.log(e.target.type);
        // console.log(e.target.name);
        // console.log(e.target.value);

        if (e.target.type === 'file') {
            Arr[e.target.name] = { item_id: e.target.name, type: 'file', data: e.target.files[0] };
            DisplayArr[e.target.name] = {
                type: e.target.files[0].type,
                url: URL.createObjectURL(e.target.files[0]),
            };
            setFieldData(e.target.name, e.target.files[0]);
            setFormKey(Math.floor(Math.random() * 1000));
        }
        if (e.target.type === 'text') {
            Arr[e.target.name] = { item_id: e.target.name, type: 'text', data: e.target.value };
            setFieldData(e.target.name, e.target.value);

            if (item.enable_arabic === true && item.autotranslate === true) {
                var pnums = e.target.value.match(/\d+/g);
                let c_text = Number(pnums[0]).toLocaleString('ar-SA', {
                    useGrouping: false,
                    maximumSignificantDigits: 10,
                });
                console.log('--c_text--');
                console.log(c_text);

                Arr[e.target.name + '_ar'] = {
                    item_id: e.target.name + '_ar',
                    type: 'text',
                    data: c_text,
                };
                setFieldData(e.target.name + '_ar', c_text);
            }
        }
        if (e.target.type === 'date') {
            Arr[e.target.name] = { item_id: e.target.name, type: 'date', data: e.target.value };
            setFieldData(e.target.name, e.target.value);

            if (item.date_convert === 'arabic') {
                let c_date = new Date(e.target.value)
                    .toLocaleDateString('ar-EG', { dateStyle: 'short' })
                    .substring(0, 12);
                console.log('--c_date--');
                console.log(c_date);

                Arr[e.target.name + '_ar'] = {
                    item_id: e.target.name + '_ar',
                    type: 'date',
                    data: c_date,
                };
                setFieldData(e.target.name + '_ar', c_date);
            }
            if (item.date_convert === 'hijri') {
                let h_date = new Date(e.target.value)
                    .toLocaleDateString('ar-SA', { dateStyle: 'short' })
                    .substring(0, 12);
                console.log('--h_date--');
                console.log(h_date);

                Arr[e.target.name + '_ar'] = {
                    item_id: e.target.name + '_ar',
                    type: 'date',
                    data: h_date,
                };
                setFieldData(e.target.name + '_ar', h_date);
            }
        }
        if (e.target.type === 'select-one') {
            Arr[e.target.name] = {
                item_id: e.target.name,
                type: 'select-one',
                data: e.target.value,
            };
            setFieldData(e.target.name, e.target.value);

            let dropdown_item = categoryData[index].items.find(
                (element) => element._id == e.target.name
            );
            let selectedIndex = e.nativeEvent.target.selectedIndex - 1;

            setFieldData(e.target.name + '_ar', dropdown_item.dropdown_values_arb[selectedIndex]);
            if (item.enable_arabic === true) {
                Arr[e.target.name + '_ar'] = {
                    item_id: e.target.name + '_ar',
                    type: 'select-one',
                    data: dropdown_item.dropdown_values_arb[selectedIndex],
                };
                setFieldData(
                    e.target.name + '_ar',
                    dropdown_item.dropdown_values_arb[selectedIndex]
                );
            }
        }

        if (e.target.type === 'select-one' || e.target.type === 'date') {
            setFormKey(Math.floor(Math.random() * 1000));
        }
    };

    const onBlurHandler = (e, item) => {
        if (e.target.type === 'text' && item.autotranslate === true) {
            setFormKey(Math.floor(Math.random() * 1000));
        }
    };

    const uploadData = (e) => {
        e.preventDefault();

        console.log('--uploadData--');

        var textItems = new Array();
        var form = new FormData();
        if (authorizedUser) {
            form.append('submit_user', authorizedUser);
        }
        if (authorizedAdmin) {
            form.append('submit_user', authorizedAdmin);
        }
        form.append('category', categoryData[0].category[0]._id);
        form.append('category_fee', payAmount);

        categoryData.forEach((cItem) => {
            cItem.items.forEach((item) => {
                if (Arr[item._id]) {
                    let element = Arr[item._id];

                    if (element && element.type == 'file') {
                        form.append(element.item_id, element.data);
                    } else {
                        if (item.enable_arabic === true) {
                            element.enable_arabic = true;

                            if (Arr[item._id + '_ar']) {
                                let element_ar = Arr[item._id + '_ar'];
                                let element_arr = {};

                                element_arr.en = element.data.en ? element.data.en : element.data;
                                element_arr.ar = element_ar.data.ar
                                    ? element_ar.data.ar
                                    : element_ar.data;
                                element.data = cloneDeep({ ...element_arr });
                            }
                        }
                        textItems.push(element);
                    }
                }
            });
        });

        console.log('--textItems--');
        console.log(textItems);
        console.log(JSON.stringify(textItems));

        form.append('items', JSON.stringify(textItems));
        console.log('--after form.append -- JSON.stringify --');

        Axios.get('/getCSRFToken').then((response) => {
            if (response.data.csrfToken) {
                Axios.post('/api/eop_application_submissions', form, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        'x-xsrf-token': response.data.csrfToken,
                    },
                }).then((res) => {
                    console.log('res');
                    console.log(res);
                    console.log('--after api call--');
                    if (res.data.status == 'success') {
                        console.log('--success--');
                        {
                            !payAmount
                                ? toast.success((t) => (
                                    <div>
                                        <button
                                            className="float-right"
                                            onClick={() => {
                                                toast.dismiss(t.id);
                                                // navigate('/');
                                            }}
                                        >
                                            Ok
                                        </button>
                                        <div>
                                            <span>{res.data.message}</span>
                                            <br />
                                            <span>
                                                Your Application Reference Number is:{' '}
                                                <b>{res.data.reference_number}</b>
                                            </span>
                                        </div>
                                    </div>
                                ))
                                : '';
                        }

                        setApplicationSuccess(convertByLang(res.data.message_ar, res.data.message));
                        SetReferenceNum(res.data.reference_number);
                        setPaymentModule(1);
                        setOnReviewStep(false);
                        setvoucherCD(res.data.voucher_creation_date);
                        setvoucher_num(res.data.voucher_number);
                        setvoucherId(res.data.voucher_id);
                    } else {
                        console.log('--error--');
                        toast.error((t) => (
                            <div>
                                <button className="float-right" onClick={() => toast.dismiss(t.id)}>
                                    Close
                                </button>
                                <div>{res.data.message}</div>
                            </div>
                        ));
                        setError(convertByLang(res.data.message_ar, res.data.message));
                    }
                });
            }
        });
    };

    const inactiveStep = {
        color: 'brown',
        backgroundColor: '#D3D3D3',
        padding: '15px 20px',
        fontFamily: 'Arial',
        borderRadius: '10px',
    };

    const activeStep = {
        color: 'white',
        backgroundColor: 'green',
        padding: '15px 20px',
        fontFamily: 'Arial',
        borderRadius: '10px',
    };

    const category_form_fieldset = {
        padding: '10px 50px 50px 50px',
        border: '1px solid #ccc',
        borderRadius: '10px',
    };
    const category_form_legend = {
        padding: '10px',
        width: 'auto',
    };
    const category_form_container = {
        border: '1px solid #ddd',
        borderRadius: '10px',
        padding: '30px',
    };

    userCookie = cookies.get(LOGIN_ID_COOKIE);
    adminCookie = cookies.get(ADMIN_LOGIN_ID_COOKIE);
    console.log('--user cookie--');
    console.log(userCookie);
    console.log('--admin cookie--');
    console.log(adminCookie);

    return (
        <div>
            <div style={{ display: loading ? 'none' : 'block' }}>
                <Toaster
                    position="top-center"
                    reverseOrder={false}
                    toastOptions={{
                        duration: Infinity,
                    }}
                />
                {error ? (
                    <p className="my-5 mx-1 alert alert-danger" role="alert">
                        {error}
                    </p>
                ) : (
                    ''
                )}
                {applicationsuccess ? (
                    <p className="my-5 mx-1 alert alert-success" role="alert">
                        {applicationsuccess}
                        <br />
                        <span>
                            Your Application Reference Number is: <b>{referenceNum}</b>
                        </span>
                    </p>
                ) : (
                    ''
                )}
                {authorizedUser != null || authorizedAdmin != null ? (
                    <fieldset className="category-form-fieldset" style={category_form_fieldset}>
                        <legend style={category_form_legend}>
                            {categoryData ? categoryData[0].category[0].category_name : ''}
                        </legend>
                        <div>
                            {formSection ? (
                                <div className="container row">
                                    <div>
                                        {categoryData && categoryData[0].category[0] ? (
                                            <div>
                                                <div className="col-md-12 p-2">
                                                    <h2>
                                                        {categoryData[0].category[0].category_name}
                                                    </h2>
                                                </div>

                                                <div
                                                    className="col-md-12 p-2"
                                                    key={categoryData[0].category[0]._id}
                                                >
                                                    <div
                                                        dangerouslySetInnerHTML={{
                                                            __html: htmlString,
                                                        }}
                                                    ></div>
                                                </div>
                                            </div>
                                        ) : (
                                            ''
                                        )}
                                    </div>
                                    <div style={{ width: '100%' }}>
                                        <button
                                            className="btn btn-lg btn-primary float-right"
                                            onClick={proceed_function}
                                        >
                                            Proceed&nbsp;
                                            <BsArrowRight />
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                ''
                            )}
                            <form onSubmit={uploadData} key={formKey}>
                                {categoryData[index] ? (
                                    <div className="steps-container" id={'step_' + index}>
                                        {!onReviewStep && paymentModule != 1 ? (
                                            <div className="row mb-5 steps-number-container">
                                                <div className="col-md-4 offset-md-4 text-center">
                                                    <h5>Application Steps</h5>
                                                    <div className="row align-items-center justify-content-center">
                                                        {categoryData &&
                                                            categoryData.map((item, i) => {
                                                                return item ? (
                                                                    <span
                                                                        style={
                                                                            index === i
                                                                                ? activeStep
                                                                                : inactiveStep
                                                                        }
                                                                        className="step m-2"
                                                                    >
                                                                        {i + 1}
                                                                    </span>
                                                                ) : (
                                                                    ''
                                                                );
                                                            })}
                                                    </div>
                                                </div>
                                                <div className="col-md-4"></div>
                                            </div>
                                        ) : (
                                            ''
                                        )}

                                        {errors ? (
                                            <p
                                                className="mt-5 mx-1 alert alert-danger"
                                                role="alert"
                                            >
                                                {errors}
                                            </p>
                                        ) : (
                                            ''
                                        )}

                                        {!onReviewStep && paymentModule != 1 ? (
                                            <div
                                                className="row category-form-container"
                                                style={category_form_container}
                                            >
                                                <div className="col-md-12">
                                                    <h3 className="mb-4">
                                                        {categoryData[index].step_description}
                                                    </h3>
                                                </div>
                                                {categoryData[index] &&
                                                    categoryData[index].items.map((item) => {
                                                        count = count + 1;
                                                        return item && item.item_enabled && item.item_enabled === 'Y' ? (
                                                            <div
                                                                className="col-md-6 p-2"
                                                                key={item._id}
                                                            >
                                                                <label className="form-label">
                                                                    {item.item_name}
                                                                    {item.required ===
                                                                        'required' ? (
                                                                        <span className="text-danger">
                                                                            *
                                                                        </span>
                                                                    ) : (
                                                                        ''
                                                                    )}
                                                                </label>
                                                                {item.item_type != 'dropdown' ? (
                                                                    item.item_type == 'download' ?
                                                                        <div className="row">
                                                                            <div className="col-md-6">
                                                                                <a href={'/api/eop_application_document/' + item.download_file} target="_blank">
                                                                                    {
                                                                                        item.download_file.split('.').pop() == 'pdf' ?
                                                                                            <GrDocumentPdf
                                                                                                size={80}
                                                                                            />
                                                                                            :
                                                                                            item.download_file.split('.').pop() == 'doc' || item.download_file.split('.').pop() == 'docx' ?
                                                                                                <GrDocumentWord
                                                                                                    size={80}
                                                                                                />
                                                                                                :
                                                                                                <img
                                                                                                    src={'/api/eop_application_document/' + item.download_file}
                                                                                                    alt={previousData.download_text}
                                                                                                    height="100"
                                                                                                />
                                                                                    }
                                                                                    <br />
                                                                                    {item.download_text}
                                                                                </a>
                                                                            </div>
                                                                            <br />
                                                                            <small className="form-text text-muted">
                                                                                {item.item_helptext}
                                                                            </small>
                                                                        </div>
                                                                        :
                                                                        (
                                                                            <div className="row">
                                                                                <div className="col-md-10">
                                                                                    {item.multiline ?
                                                                                        (
                                                                                            <textarea
                                                                                                id={item._id}
                                                                                                name={item._id}
                                                                                                onChange={(e) =>
                                                                                                    onChangeHandler(
                                                                                                        e,
                                                                                                        item
                                                                                                    )
                                                                                                }
                                                                                                onBlur={(e) =>
                                                                                                    onBlurHandler(
                                                                                                        e,
                                                                                                        item
                                                                                                    )
                                                                                                }
                                                                                                className="form-control"
                                                                                                pattern={
                                                                                                    item.validation
                                                                                                        ? item.validation
                                                                                                        : ''
                                                                                                }
                                                                                                required={
                                                                                                    item.required ===
                                                                                                    'required'
                                                                                                }
                                                                                                defaultValue={
                                                                                                    item.item_type !==
                                                                                                        'file' &&
                                                                                                        fields[item._id]
                                                                                                        ? fields[item._id]
                                                                                                        : ''
                                                                                                }
                                                                                            />
                                                                                        )
                                                                                        :
                                                                                        (
                                                                                            <div className={item.item_type == 'file' ? "custom-file" : ""}>
                                                                                                <input
                                                                                                    type={
                                                                                                        item.item_type
                                                                                                    }
                                                                                                    id={item._id}
                                                                                                    name={item._id}
                                                                                                    onChange={(e) =>
                                                                                                        onChangeHandler(
                                                                                                            e,
                                                                                                            item
                                                                                                        )
                                                                                                    }
                                                                                                    onBlur={(e) =>
                                                                                                        onBlurHandler(
                                                                                                            e,
                                                                                                            item
                                                                                                        )
                                                                                                    }
                                                                                                    className={item.item_type == 'file' ? "form-control custom-file-input" : "form-control"}
                                                                                                    pattern={
                                                                                                        item.validation
                                                                                                            ? item.validation
                                                                                                            : ''
                                                                                                    }
                                                                                                    accept={
                                                                                                        item.item_type == 'file'
                                                                                                            ? 'image/*,.pdf,.doc'
                                                                                                            : ''
                                                                                                    }
                                                                                                    defaultValue={
                                                                                                        item.item_type !==
                                                                                                            'file' &&
                                                                                                            fields[item._id]
                                                                                                            ? fields[
                                                                                                            item
                                                                                                                ._id
                                                                                                            ]
                                                                                                            : ''
                                                                                                    }
                                                                                                    required={
                                                                                                        item.required ===
                                                                                                        'required'
                                                                                                    }
                                                                                                />
                                                                                                {item.item_type == 'file' ? <label className="custom-file-label" for={item._id}>{fields[item._id].name ? fields[item._id].name : 'Choose file'}</label> : ''}
                                                                                            </div>

                                                                                        )
                                                                                    }
                                                                                    <small className="form-text text-muted">
                                                                                        {item.item_helptext}
                                                                                    </small>
                                                                                </div>
                                                                                {item.enable_arabic ===
                                                                                    true &&
                                                                                    item.item_type != 'file' ? (
                                                                                    <div className="col-md-6">
                                                                                        {item.multiline ?
                                                                                            (
                                                                                                <textarea
                                                                                                    id={item._id + '_ar'}
                                                                                                    name={
                                                                                                        item._id +
                                                                                                        '_ar'
                                                                                                    }
                                                                                                    onChange={(e) =>
                                                                                                        onChangeHandler(
                                                                                                            e,
                                                                                                            item
                                                                                                        )
                                                                                                    }
                                                                                                    className="form-control"
                                                                                                    dir="rtl"
                                                                                                    pattern={
                                                                                                        item.validation
                                                                                                            ? item.validation
                                                                                                            : ''
                                                                                                    }
                                                                                                    required={
                                                                                                        item.required ===
                                                                                                        'required'
                                                                                                    }
                                                                                                    defaultValue={
                                                                                                        item.item_type !==
                                                                                                            'file' &&
                                                                                                            fields[item._id + '_ar']
                                                                                                            ? fields[item._id + '_ar']
                                                                                                            : ''
                                                                                                    }
                                                                                                />
                                                                                            )
                                                                                            :
                                                                                            (
                                                                                                <input
                                                                                                    type={
                                                                                                        item.item_type ===
                                                                                                            'date'
                                                                                                            ? 'text'
                                                                                                            : item.item_type
                                                                                                    }
                                                                                                    id={
                                                                                                        item._id +
                                                                                                        '_ar'
                                                                                                    }
                                                                                                    name={
                                                                                                        item._id +
                                                                                                        '_ar'
                                                                                                    }
                                                                                                    onChange={(e) =>
                                                                                                        onChangeHandler(
                                                                                                            e,
                                                                                                            item
                                                                                                        )
                                                                                                    }
                                                                                                    className="form-control"
                                                                                                    dir="rtl"
                                                                                                    pattern={
                                                                                                        item.validation
                                                                                                            ? item.validation
                                                                                                            : ''
                                                                                                    }
                                                                                                    accept={
                                                                                                        item.item_type ==
                                                                                                            'file'
                                                                                                            ? 'image/*,.pdf,.doc'
                                                                                                            : ''
                                                                                                    }
                                                                                                    defaultValue={
                                                                                                        item.item_type !==
                                                                                                            'file' &&
                                                                                                            fields[
                                                                                                            item._id +
                                                                                                            '_ar'
                                                                                                            ]
                                                                                                            ? fields[
                                                                                                            item._id +
                                                                                                            '_ar'
                                                                                                            ]
                                                                                                            : ''
                                                                                                    }
                                                                                                    required={
                                                                                                        item.required ===
                                                                                                        'required'
                                                                                                    }
                                                                                                />
                                                                                            )
                                                                                        }
                                                                                        <small
                                                                                            className="form-text text-muted"
                                                                                            dir="rtl"
                                                                                        >
                                                                                            المدخلات العربية
                                                                                        </small>
                                                                                    </div>
                                                                                ) : (
                                                                                    ''
                                                                                )}
                                                                            </div>
                                                                        )
                                                                ) : (
                                                                    <div className="row">
                                                                        {item.dropdown_values_eng ? (
                                                                            <div className="col-md-6">
                                                                                <select
                                                                                    className="form-control"
                                                                                    id={item._id}
                                                                                    name={item._id}
                                                                                    onChange={(e) =>
                                                                                        onChangeHandler(
                                                                                            e,
                                                                                            item
                                                                                        )
                                                                                    }
                                                                                    required={
                                                                                        item.required ===
                                                                                        'required'
                                                                                    }
                                                                                    value={
                                                                                        fields[
                                                                                        item._id
                                                                                        ]
                                                                                    }
                                                                                >
                                                                                    <option value="">
                                                                                        {' '}
                                                                                        Open this to
                                                                                        select{' '}
                                                                                    </option>
                                                                                    {item.dropdown_values_eng &&
                                                                                        item.dropdown_values_eng.map(
                                                                                            (
                                                                                                item,
                                                                                                index
                                                                                            ) => {
                                                                                                return (
                                                                                                    <option
                                                                                                        value={
                                                                                                            item
                                                                                                        }
                                                                                                    >
                                                                                                        {
                                                                                                            item
                                                                                                        }
                                                                                                    </option>
                                                                                                );
                                                                                            }
                                                                                        )}
                                                                                </select>
                                                                                <small className="form-text text-muted">
                                                                                    {
                                                                                        item.item_helptext
                                                                                    }
                                                                                </small>
                                                                            </div>
                                                                        ) : (
                                                                            ''
                                                                        )}
                                                                        {item.enable_arabic ===
                                                                            true &&
                                                                            item.dropdown_values_arb ? (
                                                                            <div className="col-md-6">
                                                                                <select
                                                                                    className="form-control"
                                                                                    id={
                                                                                        item._id +
                                                                                        '_ar'
                                                                                    }
                                                                                    name={
                                                                                        item._id +
                                                                                        '_ar'
                                                                                    }
                                                                                    onChange={(e) =>
                                                                                        onChangeHandler(
                                                                                            e,
                                                                                            item
                                                                                        )
                                                                                    }
                                                                                    required={
                                                                                        item.required ===
                                                                                        'required'
                                                                                    }
                                                                                    value={
                                                                                        fields[
                                                                                        item._id +
                                                                                        '_ar'
                                                                                        ]
                                                                                    }
                                                                                    dir="rtl"
                                                                                >
                                                                                    <option value="">
                                                                                        {' '}
                                                                                        افتح هذا
                                                                                        للتحديد
                                                                                    </option>
                                                                                    {item.dropdown_values_arb &&
                                                                                        item.dropdown_values_arb.map(
                                                                                            (
                                                                                                item,
                                                                                                index
                                                                                            ) => {
                                                                                                return (
                                                                                                    <option
                                                                                                        value={
                                                                                                            item
                                                                                                        }
                                                                                                    >
                                                                                                        {
                                                                                                            item
                                                                                                        }
                                                                                                    </option>
                                                                                                );
                                                                                            }
                                                                                        )}
                                                                                </select>
                                                                            </div>
                                                                        ) : (
                                                                            ''
                                                                        )}
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            ''
                                                        );
                                                    })}
                                                {categoryData.length > 1 ? (
                                                    <div className="col-md-12 mt-5">
                                                        {index === 0 ? (
                                                            <button
                                                                className="btn btn-success float-right"
                                                                onClick={Next}
                                                            >
                                                                Next&nbsp;
                                                                <BsChevronRight />
                                                            </button>
                                                        ) : (
                                                            <div>
                                                                {index ===
                                                                    categoryData.length - 1 ? (
                                                                    ''
                                                                ) : (
                                                                    <div>
                                                                        <button
                                                                            className="btn btn-primary"
                                                                            onClick={Previous}
                                                                        >
                                                                            <BsChevronLeft />
                                                                            &nbsp;Previous
                                                                        </button>

                                                                        <button
                                                                            className="btn btn-success float-right"
                                                                            onClick={Next}
                                                                        >
                                                                            Next&nbsp;
                                                                            <BsChevronRight />
                                                                        </button>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    ''
                                                )}
                                            </div>
                                        ) : (
                                            ''
                                        )}

                                        {!onReviewStep &&
                                            index === categoryData.length - 1 &&
                                            paymentModule != 1 ? (
                                            <div>
                                                <button
                                                    className="btn btn-primary mt-5"
                                                    onClick={Previous}
                                                >
                                                    <BsChevronLeft />
                                                    &nbsp;Previous
                                                </button>

                                                <button
                                                    type="button"
                                                    className="btn btn-success mt-5 float-right"
                                                    onClick={LastStep}
                                                >
                                                    Review &amp; Submit&nbsp;
                                                    <BsChevronRight />
                                                </button>
                                            </div>
                                        ) : (
                                            ''
                                        )}

                                        {onReviewStep && paymentModule != 1 ? (
                                            <div>
                                                <h2>Review Your Submission</h2>
                                                <div>
                                                    {categoryData && categoryData[0].category[0] ? (
                                                        <div>
                                                            <div className="col-md-12 p-2">
                                                                <h2>
                                                                    {
                                                                        categoryData[0].category[0]
                                                                            .category_name
                                                                    }
                                                                </h2>
                                                            </div>

                                                            <div
                                                                className="col-md-12 p-2"
                                                                key={
                                                                    categoryData[0].category[0]._id
                                                                }
                                                            >
                                                                <div
                                                                    dangerouslySetInnerHTML={{
                                                                        __html: htmlString,
                                                                    }}
                                                                ></div>
                                                            </div>
                                                        </div>
                                                    ) : (
                                                        ''
                                                    )}
                                                </div>
                                                <div className="mt-4">
                                                    {categoryData &&
                                                        categoryData.map((step) => {
                                                            return step ? (
                                                                <div className="mb-4">
                                                                    <h3 className="mb-4 mt-5">
                                                                        {step.step_description}
                                                                    </h3>
                                                                    {step.items.map((item) => {
                                                                        console.log('item data');
                                                                        console.log(item);
                                                                        return item ? (
                                                                            <div className="my-2">
                                                                                <label className="font-weight-bold">
                                                                                    {item.item_name}
                                                                                    :{' '}
                                                                                </label>
                                                                                {Arr[item._id] &&
                                                                                    Arr[item._id]
                                                                                        .data ? (
                                                                                    <div>
                                                                                        {Arr[
                                                                                            item._id
                                                                                        ].type ===
                                                                                            'text' ||
                                                                                            Arr[
                                                                                                item._id
                                                                                            ].type ===
                                                                                            'date' ||
                                                                                            Arr[
                                                                                                item._id
                                                                                            ].type ===
                                                                                            'select-one' ? (
                                                                                            item.enable_arabic ===
                                                                                                true ? (
                                                                                                <div>
                                                                                                    <div>
                                                                                                        {Arr[
                                                                                                            item
                                                                                                                ._id
                                                                                                        ] &&
                                                                                                            Arr[
                                                                                                                item
                                                                                                                    ._id
                                                                                                            ]
                                                                                                                .data &&
                                                                                                            Arr[
                                                                                                                item
                                                                                                                    ._id
                                                                                                            ]
                                                                                                                .data
                                                                                                                .en
                                                                                                            ? Arr[
                                                                                                                item
                                                                                                                    ._id
                                                                                                            ]
                                                                                                                .data
                                                                                                                .en
                                                                                                            : Arr[
                                                                                                                item
                                                                                                                    ._id
                                                                                                            ] &&
                                                                                                                Arr[
                                                                                                                    item
                                                                                                                        ._id
                                                                                                                ]
                                                                                                                    .data
                                                                                                                ? Arr[
                                                                                                                    item
                                                                                                                        ._id
                                                                                                                ]
                                                                                                                    .data
                                                                                                                : ''}
                                                                                                    </div>
                                                                                                    <div dir="rtl">
                                                                                                        {Arr[
                                                                                                            item._id +
                                                                                                            '_ar'
                                                                                                        ] &&
                                                                                                            Arr[
                                                                                                                item._id +
                                                                                                                '_ar'
                                                                                                            ]
                                                                                                                .data &&
                                                                                                            Arr[
                                                                                                                item._id +
                                                                                                                '_ar'
                                                                                                            ]
                                                                                                                .data
                                                                                                                .ar
                                                                                                            ? Arr[
                                                                                                                item._id +
                                                                                                                '_ar'
                                                                                                            ]
                                                                                                                .data
                                                                                                                .ar
                                                                                                            : Arr[
                                                                                                                item._id +
                                                                                                                '_ar'
                                                                                                            ] &&
                                                                                                                Arr[
                                                                                                                    item._id +
                                                                                                                    '_ar'
                                                                                                                ]
                                                                                                                    .data &&
                                                                                                                Arr[
                                                                                                                    item._id +
                                                                                                                    '_ar'
                                                                                                                ]
                                                                                                                    .data
                                                                                                                    .en
                                                                                                                ? Arr[
                                                                                                                    item._id +
                                                                                                                    '_ar'
                                                                                                                ]
                                                                                                                    .data
                                                                                                                    .en
                                                                                                                : Arr[
                                                                                                                    item._id +
                                                                                                                    '_ar'
                                                                                                                ] &&
                                                                                                                    Arr[
                                                                                                                        item._id +
                                                                                                                        '_ar'
                                                                                                                    ]
                                                                                                                        .data
                                                                                                                    ? Arr[
                                                                                                                        item._id +
                                                                                                                        '_ar'
                                                                                                                    ]
                                                                                                                        .data
                                                                                                                    : ''}
                                                                                                    </div>
                                                                                                </div>
                                                                                            ) : (
                                                                                                <div>
                                                                                                    <div>
                                                                                                        {Arr[
                                                                                                            item
                                                                                                                ._id
                                                                                                        ] &&
                                                                                                            Arr[
                                                                                                                item
                                                                                                                    ._id
                                                                                                            ]
                                                                                                                .data &&
                                                                                                            Arr[
                                                                                                                item
                                                                                                                    ._id
                                                                                                            ]
                                                                                                                .data
                                                                                                                .en
                                                                                                            ? Arr[
                                                                                                                item
                                                                                                                    ._id
                                                                                                            ]
                                                                                                                .data
                                                                                                                .en
                                                                                                            : Arr[
                                                                                                                item
                                                                                                                    ._id
                                                                                                            ] &&
                                                                                                                Arr[
                                                                                                                    item
                                                                                                                        ._id
                                                                                                                ]
                                                                                                                    .data
                                                                                                                ? Arr[
                                                                                                                    item
                                                                                                                        ._id
                                                                                                                ]
                                                                                                                    .data
                                                                                                                : ''}
                                                                                                    </div>
                                                                                                </div>
                                                                                            )
                                                                                        ) : (
                                                                                            <div>
                                                                                                {DisplayArr[
                                                                                                    item
                                                                                                        ._id
                                                                                                ] &&
                                                                                                    DisplayArr[
                                                                                                        item
                                                                                                            ._id
                                                                                                    ]
                                                                                                        .url &&
                                                                                                    DisplayArr[
                                                                                                        item
                                                                                                            ._id
                                                                                                    ]
                                                                                                        .type ===
                                                                                                    'application/pdf' ? (
                                                                                                    <a
                                                                                                        href={
                                                                                                            DisplayArr[
                                                                                                                item
                                                                                                                    ._id
                                                                                                            ]
                                                                                                                .url
                                                                                                        }
                                                                                                        target="_blank"
                                                                                                    >
                                                                                                        <GrDocumentPdf
                                                                                                            size={
                                                                                                                100
                                                                                                            }
                                                                                                        />
                                                                                                    </a>
                                                                                                ) : (
                                                                                                    <a
                                                                                                        href={
                                                                                                            DisplayArr[
                                                                                                                item
                                                                                                                    ._id
                                                                                                            ]
                                                                                                                .url
                                                                                                        }
                                                                                                        target="_blank"
                                                                                                    >
                                                                                                        <img
                                                                                                            src={
                                                                                                                DisplayArr[
                                                                                                                    item
                                                                                                                        ._id
                                                                                                                ]
                                                                                                                    .url
                                                                                                            }
                                                                                                            height="150"
                                                                                                        />
                                                                                                    </a>
                                                                                                )}
                                                                                            </div>
                                                                                        )}
                                                                                    </div>
                                                                                ) : (
                                                                                    ''
                                                                                )}
                                                                            </div>
                                                                        ) : (
                                                                            ''
                                                                        );
                                                                    })}
                                                                    <hr />
                                                                </div>
                                                            ) : (
                                                                ''
                                                            );
                                                        })}
                                                </div>
                                            </div>
                                        ) : (
                                            ''
                                        )}

                                        {onReviewStep &&
                                            categoryData[0].category[0].terms &&
                                            paymentModule != 1 ? (
                                            <div className="col-md-12 p-2 mt-5">
                                                <div className="form-check">
                                                    <input
                                                        className="form-check-input"
                                                        title="Please accept the term and conditions by marking the checkbox to proceed..."
                                                        type="checkbox"
                                                        value=""
                                                        id="terms"
                                                        required
                                                    />
                                                    <label
                                                        className="form-check-label font-weight-bold text-uppercase"
                                                        for="terms"
                                                    >
                                                        {categoryData[0].category[0].terms}
                                                    </label>
                                                </div>
                                            </div>
                                        ) : (
                                            ''
                                        )}
                                        {onReviewStep && paymentModule != 1 ? (
                                            <div>
                                                <button
                                                    className="btn btn-primary mt-5"
                                                    onClick={backfromReview}
                                                >
                                                    <BsChevronLeft />
                                                    &nbsp;Go back
                                                </button>

                                                <button
                                                    type="submit"
                                                    className="btn btn-success mt-5 float-right"
                                                >
                                                    Confirm &amp; Submit
                                                </button>
                                            </div>
                                        ) : (
                                            ''
                                        )}
                                    </div>
                                ) : (
                                    ''
                                )}
                            </form>
                            {paymentModule === 1 && !onReviewStep && payAmount ? (
                                <div>
                                    <h2 style={{ textAlign: 'center' }}>Payment Method</h2>

                                    <div className="row mt-5">
                                        <div className="col-md-6">
                                            <button
                                                type="button"
                                                className="btn btn-outline-success btn-lg btn-block"
                                                onClick={() => {
                                                    setPaymentWay('payment_online');
                                                }}
                                            >
                                                Pay Online
                                            </button>
                                        </div>
                                        <div className="col-md-6">
                                            <button
                                                type="button"
                                                className="btn btn-outline-primary btn-lg btn-block "
                                                onClick={() => {
                                                    setPaymentWay('payment_offline');
                                                }}
                                            >
                                                Pay Offline
                                            </button>
                                        </div>
                                    </div>
                                    {paymentWay === 'payment_online' ? (
                                        <div className="row justify-content-center m-5">
                                            <div className="col-md-9 alert alert-primary">
                                                <strong>Online Payent</strong><br />Online payment method supports payment using Credit/Debit Card. To proceed with online click the "Proceed to Pay Online" button and follow the on-screen prompts to complete the payment process. Application fee voucher &amp; payment confirmation/receipt will be sent to your registered email address.</div>
                                            <div className="col text-center">
                                                {/* <button
                                                    disabled={!loaded}
                                                    className="btn btn-lg btn-warning m-5"
                                                    onClick={initPayment}
                                                >
                                                    Proceed to Pay Online <BsBoxArrowUpRight />
                                                </button> */}
                                                <button
                                                    disabled={true}
                                                    className="btn btn-lg btn-secondary m-5"
                                                >
                                                    Online Payment processing is currently in maintenance
                                                </button>                                                
                                            </div>
                                        </div>
                                    ) : (
                                        ''
                                    )}
                                    {paymentWay === 'payment_offline' ? (
                                        <div className="row justify-content-center m-5">
                                            <div className="col-md-9 alert alert-primary">
                                                <strong>Offline Payent</strong><br />To proceed with offline payment, please download &amp; print the following fee voucher.<br />Present this voucher alogn with specified application fee in Embassy to proceed with your application process.
                                            </div>
                                            <TemplateOfflinePayment
                                                offlineData={{
                                                    voucher_num: voucher_num,
                                                    issue_date: moment(voucherCD).format('DD-MM-YYYY'),
                                                    referenceNum: referenceNum,
                                                    payAmount: payAmount,
                                                    category: categoryData[0].category[0].category_name,
                                                }}
                                                ref={componentRef}
                                            />
                                            <div className="col-md-9 mt-4">
                                                <ReactToPdf targetRef={componentRef} scale={0.8} filename={'eop_voucher_' + referenceNum + '_' + voucher_num + '.pdf'}>
                                                    {({ toPdf }) => (
                                                        <button className='ml-4 btn btn-danger float-right' onClick={toPdf}>Download Voucher PDF</button>
                                                    )}
                                                </ReactToPdf>
                                                <button
                                                    className="ml-4 btn btn-primary float-right"
                                                    onClick={handlePrint}
                                                >
                                                    Print Voucher
                                                </button>
                                            </div>

                                        </div>
                                    ) : (
                                        ''
                                    )}
                                </div>
                            ) : (
                                ''
                            )}
                            {paymentModule === 1 && !onReviewStep && !payAmount ? (
                                <div className="d-flex justify-content-center">
                                    <AiOutlineFileDone size={300} className="float-center" />
                                </div>
                            ) : (
                                ''
                            )}
                        </div>
                    </fieldset>
                ) : (
                    <div>
                        <AuthorizationText langKey={lang.langKey} />
                    </div>
                )}
            </div>
            <div style={{ display: loading ? 'flex' : 'none' }} className="justify-content-center">
                <div
                    className="spinner-border"
                    style={{ width: '3rem', height: '3rem' }}
                    role="status"
                >
                    <span className="sr-only">Loading...</span>
                </div>
            </div>
        </div>
    );
};
