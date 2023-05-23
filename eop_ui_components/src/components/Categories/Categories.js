import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { eopAddCategories } from '../../config/path';
import { ADMIN_FUNCTION_ALLOWED } from '../../config/constants';
import { AdminAuthorizationText } from '../Common/AdminAuthorizationText';

// import CKEditor from '@ckeditor/ckeditor5-react';
// import ClassicEditor from 'ckeditor5-build-classic';
import toast, { Toaster } from 'react-hot-toast';

export const Categories = (props) => {
    const { lang } = props;
    const [loading, setLoading] = useState(true);
    const [authorize, setAuthorize] = useState(false);
    const [userDepartments, setUserDepartments] = useState('');
    const [data, setdata] = useState({
        category_name: '',
        category_fee: '',
        department: '',
        category_description: '',
        prerequisites: '',
        terms: '',
        is_deleted: 'N',
        is_enabled: 'Y',
    });
    useEffect(() => {
        setLoading(true);
        setAuthorize(ADMIN_FUNCTION_ALLOWED);
        setLoading(false);
        Axios.get('/api/eop_show_user_department', {}).then((res) => {
            console.log(res);
            setUserDepartments(res.data.user_data);
        });
    }, []);

    const [categorysuccess, setCategorySuccess] = useState('');
    const [error, setError] = useState('');
    const convertByLang = (arText, enText) => (lang.langKey === 'AR' ? arText : enText);

    const categories = (e) => {
        if (e.target.id === 'category_name') {
            setdata({ ...data, category_name: e.target.value });
        }
        if (e.target.id === 'category_fee') {
            setdata({ ...data, category_fee: e.target.value });
        }
        if (e.target.id === 'department') {
            setdata({ ...data, department: e.target.value });
        }
        if (e.target.id === 'category_description') {
            setdata({ ...data, category_description: e.target.value });
        }
        if (e.target.id === 'terms') {
            setdata({ ...data, terms: e.target.value });
        }
        if (e.target.id === 'prerequisites') {
            setdata({ ...data, prerequisites: e.target.value });
        }
    };

    const CategoriesSubmit = (e) => {
        e.preventDefault();
        console.log(data);
        Axios.get('/getCSRFToken').then((response) => {

            if (response.data.csrfToken) {
                Axios.post(
                    eopAddCategories(),
                    {
                        category_name: data.category_name,
                        category_fee: data.category_fee,
                        department: data.department,
                        category_description: data.category_description,
                        terms: data.terms,
                        prerequisites: data.prerequisites,
                        is_deleted: data.is_deleted,
                        is_enabled: data.is_enabled,
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

    return (
        <div className="row " style={{ display: loading ? 'none' : 'block' }}>
            <Toaster
                position="top-center"
                reverseOrder={false}
                toastOptions={{
                    duration: 5000,
                }}
            />

            {authorize ? (
                <div className="row col-md-12">
                    <div className="col-md-8">
                        <form className="row" onSubmit={CategoriesSubmit}>
                            <div className="col-md-6 col-sm-12 mt-4">
                                <label htmlFor="category_name" className="form-label">
                                    Category Name
                                    <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="text"
                                    title="Please enter the category name..."
                                    className="form-control"
                                    placeholder="Category Name"
                                    onChange={categories}
                                    id="category_name"
                                    required
                                />
                            </div>
                            <div className="col-md-6 col-sm-12 mt-4">
                                <label htmlFor="category_fee" className="form-label">
                                    Category Fee
                                    <span className="text-danger">*</span>
                                </label>
                                <input
                                    type="number"
                                    min="0"
                                    title="Please enter the category fee..."
                                    className="form-control"
                                    placeholder="Category Fee"
                                    onChange={categories}
                                    id="category_fee"
                                />
                            </div>
                            <div className="col-md-12 mt-4">
                                <label htmlFor="department" className="form-label">
                                    Department
                                    <span className="text-danger">*</span>
                                </label>
                                <select
                                    className="form-control"
                                    id="department"
                                    onChange={categories}
                                    required
                                >
                                    <option value="">Open this to select</option>
                                    {userDepartments &&
                                        userDepartments.map((item, index) => {
                                            let data = item.department_name;
                                            return data ? (
                                                <option key={item._id} value={item._id}>
                                                    {item.department_name}
                                                </option>
                                            ) : (
                                                ''
                                            );
                                        })}
                                </select>
                            </div>
                            <div className="col-md-12 mt-4">
                                <label
                                    htmlFor="category_description"
                                    className="form-label"
                                >
                                    Category Description
                                    <span className="text-danger">*</span>
                                </label>
                                <textarea
                                    rows="5"
                                    cols="60"
                                    type="text"
                                    height="500px"
                                    title="Please enter the category description..."
                                    placeholder="Category Description"
                                    className="form-control"
                                    onChange={categories}
                                    id="category_description"
                                    required
                                />
                                {/* <CKEditor
                                        editor={ClassicEditor}
                                        data="<p>Hello from CKEditor 5!</p>"
                                        onReady={(editor) => {
                                            // You can store the "editor" and use when it is needed.
                                            console.log('Editor is ready to use!', editor);
                                        }}
                                        onChange={(event, editor) => {
                                            const data = editor.getData();
                                            console.log({ event, editor, data });
                                        }}
                                        onBlur={(event, editor) => {
                                            console.log('Blur.', editor);
                                        }}
                                        onFocus={(event, editor) => {
                                            console.log('Focus.', editor);
                                        }}
                                    /> */}
                            </div>
                            <div className="col-md-12 mt-4">
                                <label htmlFor="prerequisites" className="form-label">
                                    Prerequisites
                                    <span className="text-danger">*</span>
                                </label>
                                <textarea
                                    rows="5"
                                    cols="60"
                                    type="text"
                                    height="500px"
                                    title="Please enter the prerequisites..."
                                    placeholder="Prerequisites"
                                    className="form-control"
                                    onChange={categories}
                                    id="prerequisites"
                                    required
                                />
                            </div>
                            <div className="col-md-12 mt-4">
                                <label htmlFor="terms" className="form-label">
                                    Terms & Conditions
                                    <span className="text-danger">*</span>
                                </label>
                                <textarea
                                    rows="5"
                                    cols="60"
                                    type="text"
                                    height="500px"
                                    title="Please enter the Terms & Conditions..."
                                    placeholder="Terms & Conditions"
                                    className="form-control"
                                    onChange={categories}
                                    id="terms"
                                    required
                                />
                            </div>

                            <input
                                type="submit"
                                className="btn btn-lg btn-primary mt-4 mx-3"
                                value="Submit"
                            />
                        </form>
                    </div>
                </div>
            ) : (
                <div>
                    <AdminAuthorizationText langKey={lang.langKey} />
                </div>
            )}
        </div>
    );
};
