import React, { useEffect, useState, useRef } from 'react';
import Axios from 'axios';
import { ADMIN_FUNCTION_ALLOWED } from '../../config/constants';
import { AdminAuthorizationText } from '../Common/AdminAuthorizationText';
import moment from 'moment';
import { cloneDeep } from 'lodash';
import { ADMIN_LOGIN_ID_COOKIE } from '../../config/constants';
import Cookies from 'universal-cookie/es6';
import toast, { Toaster } from 'react-hot-toast';
import { GrDocumentPdf, GrDocumentWord, GrPrint } from 'react-icons/gr';

let Arr = new Array();
let DisplayArr = new Array();

export const EditSubmitedApplication = (props) => {
    const { lang } = props;
    const [loading, setLoading] = useState(true);
    const [authorize, setAuthorize] = useState(false);
    const [applicationData, setApplicationData] = useState('');
    const [fields, setFields] = useState([]);
    const [formKey, setFormKey] = useState('');
    const [applicationId, setApplicationId] = useState('');
    const [passportId, setPassportId] = useState('');
    const cookies = new Cookies();
    let login_cookie = cookies.get(ADMIN_LOGIN_ID_COOKIE);

    useEffect(() => {
        setLoading(true);
        setAuthorize(ADMIN_FUNCTION_ALLOWED);
        setLoading(false);
        let hashValue = window.location.hash;

        let tempID = hashValue.substring(1);
        console.log('Param id value');
        console.log(tempID);
        setApplicationId(tempID);
        Axios.get('/api/submited_application/' + tempID, {}).then((res) => {
            console.log('--res--');
            console.log(res);
            let ary = [];
            if (res.data.find_data) {
                res.data.find_data.forEach((row) => {
                    ary.push(row);
                });
                console.log('--ary--');
                console.log(ary);
                setApplicationData(ary);
            } else {
                console.log('--empty--');
                setApplicationData([]);
            }
        });
        Axios.get('/api/eop_configuraion', {}).then((res) => {
            console.log('--res--');
            console.log(res.data.find_data[0].noc_passport_id);
            setPassportId(res.data.find_data[0].noc_passport_id);
        });
    }, []);

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
        console.log(e.target.id);
        console.log(e.target.type);
        console.log(e.target.name);
        console.log(e.target.value);

        if (e.target.type === 'file') {
            Arr[e.target.name] = { item_id: e.target.name, type: 'file', data: e.target.files[0] };
            DisplayArr[e.target.name] = {
                type: e.target.files[0].type,
                url: URL.createObjectURL(e.target.files[0]),
            };
            setFieldData(e.target.name, e.target.files[0]);
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

            let dropdown_item = applicationData[0].documents.find(
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

        console.log('fields');
        console.log(fields);
        console.log('Arr');
        console.log(Arr);
    };
    const onBlurHandler = (e, item) => {
        if (e.target.type === 'text' && item.autotranslate === true) {
            setFormKey(Math.floor(Math.random() * 1000));
        }
    };

    const update = (e) => {
        e.preventDefault();

        var textItems = new Array();
        var form = new FormData();

        console.log('Arr');
        console.log(Arr);

        applicationData[0].documents.forEach((item) => {
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

        console.log('--textItems--');
        console.log(textItems);
        console.log(JSON.stringify(textItems));
        form.append('id', applicationId);
        form.append('update_by', login_cookie);

        form.append('items', JSON.stringify(textItems));
        console.log('--after form.append -- JSON.stringify --');
        Axios.get('/getCSRFToken').then((response) => {
            if (response.data.csrfToken) {
                Axios.post('/api/eop_edit_application', form, {
                    'Content-Type': 'multipart/form-data',
                    headers: {
                        'x-xsrf-token': response.data.csrfToken,
                    },
                }).then((res) => {
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

    return (
        <div style={{ display: loading ? 'none' : 'block' }}>
            {authorize ? (
                <div>
                    <Toaster
                        position="top-center"
                        reverseOrder={false}
                        toastOptions={{
                            duration: Infinity,
                        }}
                    />
                    {applicationData ? (
                        <form key={formKey}>
                            <div className="row">
                                <div className="col-md-6">
                                    <p>
                                        <strong>Ref. No.:</strong>&nbsp;
                                        {applicationData[0].reference_number}
                                    </p>
                                    <p>
                                        <strong>Applicant Name:</strong>&nbsp;
                                        {applicationData[0].submit_user[0]
                                            ? applicationData[0].submit_user[0].first_name
                                            : ''}
                                        &nbsp;
                                        {applicationData[0].submit_user[0]
                                            ? applicationData[0].submit_user[0].last_name
                                            : ''}
                                    </p>
                                    <p>
                                        <strong>Application Category:</strong>&nbsp;
                                        {applicationData[0].category[0].category_name}
                                    </p>
                                    <p>
                                        <strong>Category Description:</strong>&nbsp;
                                        {applicationData[0].category[0].category_description}
                                    </p>
                                    <p>
                                        <strong>Application Submit Time:</strong>&nbsp;
                                        {moment(applicationData[0].submit_time).format(
                                            'DD-MM-YYYY hh:mm A'
                                        )}
                                    </p>
                                </div>
                                <div className="col-md-6"></div>
                                <div className="col-md-12">
                                    <h3 className="mt-5">Application Details:</h3>
                                    <hr />
                                    <div className="row mt-0 pt-0">
                                        {applicationData[0].documents &&
                                            applicationData[0].documents.map((data, index) => {
                                                let item = applicationData[0].items.find(
                                                    (x) => x.item_id === data._id
                                                );
                                                return data.item_type != 'file' ? (
                                                    <div className="col-md-6 my-2">
                                                        <strong>{data.item_name}</strong>
                                                        {item.type != 'select-one' ? (
                                                            <div>
                                                                {item.enable_arabic &&
                                                                    (item.data.en || item.data.en) ? (
                                                                    <div className="row">
                                                                        <div className="col-md-6">
                                                                            <input
                                                                                defaultValue={
                                                                                    fields[
                                                                                        item.item_id
                                                                                    ]
                                                                                        ? fields[
                                                                                        item
                                                                                            .item_id
                                                                                        ]
                                                                                        : item.data
                                                                                            .en &&
                                                                                            fields[
                                                                                            item
                                                                                                .item_id
                                                                                            ] ===
                                                                                            undefined
                                                                                            ? item.data
                                                                                                .en
                                                                                            : item.data &&
                                                                                                fields[
                                                                                                item
                                                                                                    .item_id
                                                                                                ] ===
                                                                                                undefined
                                                                                                ? item.data
                                                                                                : ''
                                                                                }
                                                                                type={item.type}
                                                                                className="form-control"
                                                                                id={item.item_id}
                                                                                name={item.item_id}
                                                                                onChange={(e) =>
                                                                                    onChangeHandler(
                                                                                        e,
                                                                                        data
                                                                                    )
                                                                                }
                                                                                onBlur={(e) =>
                                                                                    onBlurHandler(
                                                                                        e,
                                                                                        data
                                                                                    )
                                                                                }
                                                                                readOnly={
                                                                                    item.item_id ===
                                                                                    passportId
                                                                                }
                                                                            />
                                                                            {data.item_helptext ? (
                                                                                <small className="form-text text-muted">
                                                                                    {
                                                                                        data.item_helptext
                                                                                    }
                                                                                </small>
                                                                            ) : (
                                                                                ''
                                                                            )}
                                                                        </div>
                                                                        <div className="col-md-6">
                                                                            <input
                                                                                defaultValue={
                                                                                    fields[
                                                                                        item.item_id +
                                                                                        '_ar'
                                                                                    ]
                                                                                        ? fields[
                                                                                        item.item_id +
                                                                                        '_ar'
                                                                                        ]
                                                                                        : item.enable_arabic &&
                                                                                            fields[
                                                                                            item.item_id +
                                                                                            '_ar'
                                                                                            ] ===
                                                                                            undefined
                                                                                            ? item.data
                                                                                                .ar
                                                                                            : ''
                                                                                }
                                                                                type="text"
                                                                                className="form-control"
                                                                                id={
                                                                                    item.item_id +
                                                                                    '_ar'
                                                                                }
                                                                                name={
                                                                                    item.item_id +
                                                                                    '_ar'
                                                                                }
                                                                                onChange={(e) =>
                                                                                    onChangeHandler(
                                                                                        e,
                                                                                        data
                                                                                    )
                                                                                }
                                                                                dir="rtl"
                                                                                readOnly={
                                                                                    item.item_id ===
                                                                                    passportId
                                                                                }
                                                                            />
                                                                            <small
                                                                                className="form-text text-muted"
                                                                                dir="rtl"
                                                                            >
                                                                                المدخلات العربية
                                                                            </small>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <div>
                                                                        <input
                                                                            defaultValue={
                                                                                item.data.en
                                                                                    ? item.data.en
                                                                                    : item.data
                                                                                        ? item.data
                                                                                        : ''
                                                                            }
                                                                            type="text"
                                                                            className="form-control"
                                                                            id={item.item_id}
                                                                            name={item.item_id}
                                                                            onChange={(e) =>
                                                                                onChangeHandler(
                                                                                    e,
                                                                                    data
                                                                                )
                                                                            }
                                                                            readOnly={
                                                                                item.item_id ===
                                                                                passportId
                                                                            }
                                                                        />
                                                                        <small className="form-text text-muted">
                                                                            {data.item_helptext}
                                                                        </small>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        ) : (
                                                            <div>
                                                                {item.enable_arabic &&
                                                                    (item.data.en || item.data.en) ? (
                                                                    <div className="row">
                                                                        <div className="col-md-6">
                                                                            {data.dropdown_values_eng ? (
                                                                                <select
                                                                                    className="form-control"
                                                                                    id={
                                                                                        item.item_id
                                                                                    }
                                                                                    name={
                                                                                        item.item_id
                                                                                    }
                                                                                    onChange={(e) =>
                                                                                        onChangeHandler(
                                                                                            e,
                                                                                            data
                                                                                        )
                                                                                    }
                                                                                    value={
                                                                                        fields[
                                                                                        item
                                                                                            .item_id
                                                                                        ]
                                                                                    }
                                                                                >
                                                                                    <option value="">
                                                                                        {item.data
                                                                                            .en
                                                                                            ? item
                                                                                                .data
                                                                                                .en
                                                                                            : item.data
                                                                                                ? item.data
                                                                                                : ''}
                                                                                    </option>
                                                                                    {data.dropdown_values_eng &&
                                                                                        data.dropdown_values_eng.map(
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
                                                                            ) : (
                                                                                ''
                                                                            )}
                                                                            <small className="form-text text-muted">
                                                                                {data.item_helptext}
                                                                            </small>
                                                                        </div>
                                                                        <div className="col-md-6">
                                                                            {data.enable_arabic ===
                                                                                true &&
                                                                                data.dropdown_values_arb ? (
                                                                                <select
                                                                                    className="form-control"
                                                                                    id={
                                                                                        item.item_id +
                                                                                        '_ar'
                                                                                    }
                                                                                    name={
                                                                                        item.item_id +
                                                                                        '_ar'
                                                                                    }
                                                                                    onChange={(e) =>
                                                                                        onChangeHandler(
                                                                                            e,
                                                                                            data
                                                                                        )
                                                                                    }
                                                                                    value={
                                                                                        fields[
                                                                                        item.item_id +
                                                                                        '_ar'
                                                                                        ]
                                                                                    }
                                                                                    dir="rtl"
                                                                                >
                                                                                    <option value="">
                                                                                        {item.enable_arabic
                                                                                            ? item
                                                                                                .data
                                                                                                .ar
                                                                                            : ''}
                                                                                    </option>
                                                                                    {data.dropdown_values_arb &&
                                                                                        data.dropdown_values_arb.map(
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
                                                                            ) : (
                                                                                ''
                                                                            )}
                                                                            <small
                                                                                className="form-text text-muted"
                                                                                dir="rtl"
                                                                            >
                                                                                المدخلات العربية
                                                                            </small>
                                                                        </div>
                                                                    </div>
                                                                ) : (
                                                                    <div>
                                                                        {data.dropdown_values_eng ? (
                                                                            <select
                                                                                className="form-control"
                                                                                id={item.item_id}
                                                                                name={item.item_id}
                                                                                onChange={(e) =>
                                                                                    onChangeHandler(
                                                                                        e,
                                                                                        data
                                                                                    )
                                                                                }
                                                                            >
                                                                                <option value="">
                                                                                    {item.data.en
                                                                                        ? item.data
                                                                                            .en
                                                                                        : item.data
                                                                                            ? item.data
                                                                                            : ''}
                                                                                </option>
                                                                                {data.dropdown_values_eng &&
                                                                                    data.dropdown_values_eng.map(
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
                                                                        ) : (
                                                                            ''
                                                                        )}
                                                                        <small className="form-text text-muted">
                                                                            {data.item_helptext}
                                                                        </small>
                                                                    </div>
                                                                )}
                                                            </div>
                                                        )}
                                                    </div>
                                                ) : (
                                                    ''
                                                );
                                            })}
                                    </div>
                                </div>
                                <div className="col-md-12">
                                    {applicationData[0].documents ? (
                                        <div>
                                            <h3 className="mt-3">Attached Documents:</h3>
                                            <hr />
                                            <div className="row mt-0 pt-0">
                                                {applicationData[0].documents &&
                                                    applicationData[0].documents.map(
                                                        (data, index) => {
                                                            let document =
                                                                applicationData[0].items.find(
                                                                    (x) => x.item_id === data._id
                                                                );
                                                            return data.item_type == 'file' ? (
                                                                <div className="col-md-4 mb-3">
                                                                    <strong className="mb-2">
                                                                        {data.item_name}
                                                                    </strong>
                                                                    :&nbsp;
                                                                    <br />
                                                                    <a
                                                                        href={`/api/eop_application_document/${document
                                                                            ? document.data
                                                                                .file_name
                                                                            : ''
                                                                            }`}
                                                                        target="_blank"
                                                                    >
                                                                        {document.data.file_name
                                                                            .split('.')
                                                                            .pop() == 'pdf' ? (
                                                                            <GrDocumentPdf
                                                                                size={80}
                                                                            />
                                                                        ) : (
                                                                            document.data.file_name
                                                                                .split('.')
                                                                                .pop() == 'doc' || document.data.file_name
                                                                                    .split('.')
                                                                                    .pop() == 'docx' ? (
                                                                                <GrDocumentWord
                                                                                    size={80}
                                                                                />) :
                                                                                <img
                                                                                    src={`/api/eop_application_document/${document
                                                                                        ? document
                                                                                            .data
                                                                                            .file_name
                                                                                        : ''
                                                                                        }`}
                                                                                    alt="Image"
                                                                                    height="100"
                                                                                />
                                                                        )}
                                                                    </a>
                                                                    <input
                                                                        type={document.type}
                                                                        id={document.item_id}
                                                                        name={document.item_id}
                                                                        onChange={(e) =>
                                                                            onChangeHandler(
                                                                                e,
                                                                                document
                                                                            )
                                                                        }
                                                                        className="form-control mt-2"
                                                                        accept={
                                                                            document.item_type ==
                                                                                'file'
                                                                                ? 'image/*,.pdf,.doc'
                                                                                : ''
                                                                        }
                                                                    />
                                                                    <small className="form-text text-muted">
                                                                        {data.item_helptext}
                                                                    </small>
                                                                </div>
                                                            ) : (
                                                                ''
                                                            );
                                                        }
                                                    )}
                                            </div>
                                        </div>
                                    ) : (
                                        ''
                                    )}
                                </div>
                                <div className="col-md-12">
                                    <button
                                        className="btn btn-primary float-right"
                                        onClick={update}
                                    >
                                        Update
                                    </button>
                                </div>
                            </div>
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
