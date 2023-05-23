import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { ADMIN_FUNCTION_ALLOWED } from '../../config/constants';
import { eopUpdateItem } from '../../config/path';
import { AdminAuthorizationText } from '../Common/AdminAuthorizationText';
import toast, { Toaster } from 'react-hot-toast';
import { GrDocumentPdf, GrDocumentWord } from 'react-icons/gr';

export const EditItem = (props) => {
    const { lang } = props;
    const [loading, setLoading] = useState(true);
    const [authorize, setAuthorize] = useState(false);
    const convertByLang = (arText, enText) => (lang.langKey === 'AR' ? arText : enText);
    const [previousData, setPreviousData] = useState('');
    const [id, setId] = useState('');
    const [error, setError] = useState('');
    const [itemSuccess, setItemSuccess] = useState('');
    const [chkReq, setChkReq] = useState(false);
    const [chkEnable, setChkEnable] = useState(false);
    const [autoTranslateEnabled, setAutoTranslateEnabled] = useState(false);
    const [multiline, setMultiline] = useState(false);

    useEffect(() => {
        setLoading(true);
        setAuthorize(ADMIN_FUNCTION_ALLOWED);
        setLoading(false);
        let hashValue = window.location.hash;
        let tempID = hashValue.substring(1);
        console.log('Param id value');
        console.log(tempID);
        setId(tempID);
        Axios.get('/api/eop_show_item/' + tempID, {}).then((res) => {
            console.log('--Users res--');
            console.log(res);
            setPreviousData(res.data.find_data);

            if (res.data.find_data.required === 'required') {
                setChkReq(true);
            }
            setChkEnable(res.data.find_data.enable_arabic);
            setAutoTranslateEnabled(res.data.find_data.autotranslate);
            setMultiline(res.data.find_data.multiline);
        });
    }, []);

    const [item, setItem] = useState({
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
        download_text: '',
        download_file: '',
        multiline: '',
        item_order: '',
    });
    const setItemData = (e) => {
        if (e.target.id === 'enable_arabic') {
            setChkEnable(e.target.checked);
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
            setChkReq(e.target.checked);
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
            setAutoTranslateEnabled(e.target.checked);
            setItem({ ...item, autotranslate: e.target.checked });
        }
        if (e.target.id === 'download_text') {
            setItem({ ...item, download_text: e.target.value });
        }
        if (e.target.id === 'download_file') {
            setItem({ ...item, download_file: e.target.files[0] });
        }
        if (e.target.id === 'multiline') {
            setMultiline(e.target.checked);
            setItem({ ...item, multiline: e.target.checked });
        }
    };
    const Update_Step_Item = (e) => {
        e.preventDefault();
        console.log('item');
        console.log(item);
        let name, helptext, type, val, req, enable_ar, eng, arb, changeDate, autotranslate, download_text, download_file, multiline, item_order;

        if (!item.item_name) {
            name = previousData.item_name;
        } else {
            name = item.item_name;
        }
        if (!item.item_helptext) {
            helptext = previousData.item_helptext;
        } else {
            helptext = item.item_helptext;
        }
        if (!item.item_type) {
            type = previousData.item_type;
        } else {
            type = item.item_type;
        }
        if (previousData.item_type == 'text' || item.item_type == 'text') {
            if (!item.validation) {
                val = previousData.validation;
            } else {
                val = item.validation;
            }
        } else {
            val = '';
        }
        if (!item.required) {
            req = previousData.required;
        } else {
            req = item.required;
        }

        if (item.enable_arabic === '') {
            enable_ar = previousData.enable_arabic;
        } else {
            enable_ar = item.enable_arabic;
        }
        if (!item.dropdown_values_eng) {
            eng = previousData.dropdown_values_eng;
        } else {
            eng = item.dropdown_values_eng.split(/\n/);
        }
        if (!item.dropdown_values_arb) {
            arb = previousData.dropdown_values_arb;
        } else {
            arb = item.dropdown_values_arb.split(/\n/);
        }
        if (!item.date_convert) {
            changeDate = previousData.date_convert;
        } else {
            changeDate = item.date_convert;
        }
        if (item.autotranslate === '') {
            autotranslate = previousData.autotranslate;
        } else {
            autotranslate = item.autotranslate;
        }
        if (item.download_text === '') {
            download_text = previousData.download_text;
        } else {
            download_text = item.download_text;
        }
        if (item.multiline === '') {
            multiline = previousData.multiline;
        } else {
            multiline = item.multiline;
        }
        if (item.item_order === '') {
            item_order = previousData.item_order;
        } else {
            item_order = item.item_order;
        }

        var form = new FormData();

        if (item.download_file === '') {
            download_file = previousData.download_file;
        } else {
            download_file = '';
            form.append('download_file', item.download_file);
        }

        let finaldata = {
            id,
            name,
            helptext,
            type,
            val,
            req,
            enable_ar,
            eng,
            arb,
            changeDate,
            autotranslate,
            download_text,
            download_file,
            multiline,
            item_order
        };
        if (finaldata.type === 'file') {
            finaldata.val = '';
            finaldata.eng = '';
            finaldata.arb = '';
            finaldata.changeDate = '';
        }
        if (finaldata.type === 'text') {
            finaldata.eng = '';
            finaldata.arb = '';
            finaldata.changeDate = '';
        }
        if (finaldata.type === 'dropdown') {
            finaldata.val = '';
            finaldata.changeDate = '';
        }
        if (finaldata.type === 'date') {
            finaldata.val = '';
            finaldata.eng = '';
            finaldata.arb = '';
        }

        console.log('finaldata');
        console.log(finaldata);

        form.append('finaldata', JSON.stringify(finaldata));

        Axios.get('/getCSRFToken').then((response) => {
            if (response.data.csrfToken) {
                Axios.post(
                    '/api/eop_update_item',
                    form,
                    {
                        headers: {
                            'Content-Type': 'multipart/form-data',
                            'x-xsrf-token': response.data.csrfToken,
                        },
                    }
                ).then((res) => {
                    console.log(res);
                    if (res.data.status == 'success') {
                        toast.success(res.data.message);
                        setItemSuccess(convertByLang(res.data.message_ar, res.data.message));
                    } else {
                        toast.error(res.data.message);
                        setError(convertByLang(res.data.message_ar, res.data.message));
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
                            duration: 5000,
                        }}
                    />
                    {previousData ? (
                        <form onSubmit={Update_Step_Item}>
                            <div className="col-md-12 mt-2">
                                <div className="form-check">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        checked={chkEnable}
                                        id="enable_arabic"
                                        onClick={setItemData}
                                    />
                                    <label className="form-check-label pt-1" for="enable_arabic">
                                        Enable Arabic Input
                                    </label>
                                </div>
                            </div>
                            <div className="col-md-6 p-2 m-2">
                                <label htmlFor="item_name" className="form-label mt-1">
                                    Item Name
                                </label>
                                <input
                                    type="text"
                                    defaultValue={previousData.item_name}
                                    className="form-control"
                                    id="item_name"
                                    onChange={setItemData}
                                />
                            </div>
                            <div className="col-md-6 p-2 m-2">
                                <label htmlFor="item_helptext" className="form-label mt-1">
                                    Item Help Text
                                </label>
                                <input
                                    type="text"
                                    defaultValue={previousData.item_helptext}
                                    className="form-control"
                                    id="item_helptext"
                                    onChange={setItemData}
                                />
                            </div>
                            <div className="col-md-6 p-2 m-2">
                                <label htmlFor="item_type" className="form-label mt-1">
                                    Item Type
                                </label>
                                <select className="form-control" id="item_type" onChange={setItemData}>
                                    <option
                                        value="text"
                                        selected={previousData.item_type === 'text' ? true : false}
                                    >
                                        Text
                                    </option>
                                    <option
                                        value="file"
                                        selected={previousData.item_type === 'file' ? true : false}
                                    >
                                        File/Attachment Upload
                                    </option>
                                    <option
                                        value="date"
                                        selected={previousData.item_type === 'date' ? true : false}
                                    >
                                        Date Input
                                    </option>
                                    <option
                                        value="dropdown"
                                        selected={previousData.item_type === 'dropdown' ? true : false}
                                    >
                                        Dropdown
                                    </option>
                                    <option
                                        value="download"
                                        selected={previousData.item_type === 'download' ? true : false}
                                    >
                                        Downloadable File
                                    </option>
                                </select>
                            </div>
                            {((item.item_type == 'date' && chkEnable === true) ||
                                (previousData.item_type == 'date' && chkEnable === true)) &&
                                item.item_type != 'text' &&
                                item.item_type != 'file' &&
                                item.item_type != 'dropdown' ? (
                                <div className="row col-md-12">
                                    <div className="col-md-6 mt-2">
                                        <label htmlFor="date_convert" className="form-label mt-1">
                                            Select the method of date conversion
                                        </label>
                                        <select
                                            className="form-control"
                                            id="date_convert"
                                            onChange={setItemData}
                                        >
                                            <option value="">Open this to select</option>
                                            <option
                                                value="arabic"
                                                selected={
                                                    previousData.date_convert === 'arabic'
                                                        ? true
                                                        : false
                                                }
                                            >
                                                Convert to Arabic Numbers
                                            </option>
                                            <option
                                                value="hijri"
                                                selected={
                                                    previousData.date_convert === 'hijri' ? true : false
                                                }
                                            >
                                                Convert to Hijri Date
                                            </option>
                                        </select>
                                    </div>
                                    <div className="col-md-6 mt-2"></div>
                                </div>
                            ) : (
                                ''
                            )}
                            {item.item_type == 'text' || previousData.item_type == 'text' ? (
                                <div className="col-md-3 p-2 m-2">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            id="multiline"
                                            checked={multiline}
                                            onClick={setItemData}
                                        />
                                        <label
                                            className="form-check-label pt-1"
                                            for="multiline"
                                        >
                                            Allow Multiline Text Input (Text Area)
                                        </label>
                                    </div>
                                </div>
                            ) : (
                                ''
                            )}
                            {item.item_type == 'text' || previousData.item_type == 'text' ? (
                                <div className="col-md-6 p-2 m-2">
                                    <label htmlFor="validation" className="form-label mt-1">
                                        Validation Pattern for Input Text
                                    </label>
                                    <select
                                        className="form-control"
                                        id="validation"
                                        onChange={setItemData}
                                    >
                                        <option value="">Open this to select</option>
                                        <option
                                            value="^\d{5}-\d{7}-\d{1}$"
                                            selected={
                                                previousData.validation === '^\\d{5}-\\d{7}-\\d{1}$'
                                                    ? true
                                                    : false
                                            }
                                        >
                                            CNIC
                                        </option>
                                        <option
                                            value="^[2]\d{9}$"
                                            selected={
                                                previousData.validation === '^[2]d{9}$' ? true : false
                                            }
                                        >
                                            Iqama Number
                                        </option>
                                        <option
                                            value="^(\d{1,3}[- ]?)?\d{10}$"
                                            selected={
                                                previousData.validation === '^(d{1,3}[- ]?)?d{10}$'
                                                    ? true
                                                    : false
                                            }
                                        >
                                            Mobile Number
                                        </option>
                                        <option
                                            value="^(?!^0+$)[a-zA-Z0-9]{6,9}$"
                                            selected={
                                                previousData.validation === '^(?!^0+$)[a-zA-Z0-9]{6,9}$'
                                                    ? true
                                                    : false
                                            }
                                        >
                                            Passport
                                        </option>
                                        <option
                                            value="/^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$/"
                                            selected={
                                                previousData.validation ===
                                                    '/^[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$/'
                                                    ? true
                                                    : false
                                            }
                                        >
                                            Email
                                        </option>
                                        <option
                                            value="/^[0-9]+$/"
                                            selected={
                                                previousData.validation === '/^[0-9]+$/' ? true : false
                                            }
                                        >
                                            Numeric
                                        </option>
                                    </select>
                                </div>
                            ) : (
                                ''
                            )}
                            {(item.item_type == 'text' || previousData.item_type == 'text') &&
                                (item.enable_arabic == true || previousData.enable_arabic == true) ? (
                                <div className="col-md-3 p-2 m-2">
                                    <div className="form-check">
                                        <input
                                            className="form-check-input"
                                            type="checkbox"
                                            checked={autoTranslateEnabled}
                                            id="autotranslate"
                                            onClick={setItemData}
                                        />
                                        <label className="form-check-label pt-1" for="autotranslate">
                                            Auto-translate numbers to Arabic
                                        </label>
                                    </div>
                                </div>
                            ) : (
                                ''
                            )}
                            {item.item_type == 'dropdown' || previousData.item_type == 'dropdown' ? (
                                <div className="row">
                                    {previousData.dropdown_values_eng ? (
                                        <div className="col-md-3 p-2 m-2">
                                            <label htmlFor="dropdown_values_eng" className="form-label">
                                                Dropdown Values in English
                                                <span className="text-danger">*</span>
                                            </label>
                                            <textarea
                                                rows="5"
                                                cols="60"
                                                type="text"
                                                defaultValue={
                                                    previousData.dropdown_values_eng
                                                        ? previousData.dropdown_values_eng.join('\n')
                                                        : ''
                                                }
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
                                    ) : (
                                        ''
                                    )}
                                    {chkEnable == true ? (
                                        <div className="col-md-3 p-2 m-2">
                                            <label htmlFor="dropdown_values_arb" className="form-label">
                                                Dropdown Values in Arabic
                                                <span className="text-danger">*</span>
                                            </label>
                                            <textarea
                                                rows="5"
                                                cols="60"
                                                type="text"
                                                defaultValue={
                                                    previousData.dropdown_values_arb
                                                        ? previousData.dropdown_values_arb.join('\n')
                                                        : ''
                                                }
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
                            {(item.item_type == 'download' || previousData.item_type == 'download') ? (
                                <div className='row col-ms-12'>
                                    {previousData.download_file != '' ?
                                        <div className='col-md-6 p-2 m-2'>
                                            <label className="form-label">
                                                Current Downloadable File
                                            </label>
                                            <div className='row'>
                                                <a href={'/api/eop_application_document/' + previousData.download_file} >
                                                    {
                                                        previousData.download_file.split('.').pop() == 'pdf' ?
                                                            <GrDocumentPdf
                                                                size={80}
                                                            />
                                                            :
                                                            previousData.download_file.split('.').pop() == 'doc' || previousData.download_file.split('.').pop() == 'docx' ?
                                                                <GrDocumentWord
                                                                    size={80}
                                                                />
                                                                :
                                                                <img
                                                                    src={'/api/eop_application_document/' + previousData.download_file}
                                                                    alt={previousData.download_text}
                                                                    height="100"
                                                                />
                                                    }
                                                    <br />
                                                    {previousData.download_text}
                                                </a>
                                            </div>
                                        </div>
                                        :
                                        ''
                                    }
                                    <div className="col-md-6 p-2 m-2">
                                        <label htmlFor="download_text" className="form-label">
                                            Download Link Text
                                            <span className="text-danger">*</span>
                                        </label>
                                        <input id="download_text" className="form-control" type="text" onChange={setItemData} title="Download link text" defaultValue={previousData.download_text} />
                                    </div>
                                    <div className="col-md-6 p-2 m-2">
                                        <label htmlFor="download_file" className="form-label">
                                            Downloadable File
                                            <span className="text-danger">*</span>
                                        </label>
                                        <input id="download_file" className="form-control" type="file" onChange={setItemData} title="Downloadable File" accept="image/*,.pdf,.doc" />
                                    </div>
                                </div>
                            ) : (
                                ''
                            )}
                            <div className="col-md-3 ">
                                <div className="form-check py-2">
                                    <input
                                        className="form-check-input"
                                        type="checkbox"
                                        name="required"
                                        checked={chkReq}
                                        id="required"
                                        onChange={setItemData}
                                    />
                                    <label className="form-check-label" for="required">
                                        Required
                                    </label>
                                </div>
                            </div>
                            <div className="col-md-6">
                                <input
                                    type="submit"
                                    className="btn btn-primary my-2 mx-2"
                                    style={{ align: 'right' }}
                                    value="Update"
                                />
                                <a
                                    className="input-group-btn btn btn-secondary float-right"
                                    href={'/' + lang.langKey + '/update-step#' + previousData.step_id}
                                >
                                    Back
                                </a>
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
