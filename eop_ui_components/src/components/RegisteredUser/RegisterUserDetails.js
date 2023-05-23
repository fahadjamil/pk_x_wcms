import React, { useState, useEffect } from 'react';
import Axios from 'axios';
import { ADMIN_FUNCTION_ALLOWED } from '../../config/constants';
import { AdminAuthorizationText } from '../Common/AdminAuthorizationText';

export const RegisterUserDetails = (props) => {
    const { lang } = props;
    const [loading, setLoading] = useState(true);
    const [authorize, setAuthorize] = useState(false);
    const [userData, setUserData] = useState('');
    const category_form_fieldset = {
        padding: '20px',
        border: '1px solid #ccc',
        borderRadius: '10px',
    };
    const category_form_legend = {
        padding: '10px',
        width: 'auto',
    };
    useEffect(() => {
        setLoading(true);
        setAuthorize(ADMIN_FUNCTION_ALLOWED);
        setLoading(false);
        let hashValue = window.location.hash;
        let userID = hashValue.substring(1);
        Axios.get('/api/auth/eop_single_user/' + userID, {}).then((res) => {
            setUserData(res.data.user_data);
        });
    }, []);

    return (
        <div style={{ display: loading ? 'none' : 'block' }}>
            {authorize ? (
                <div>
                    {userData ? (
                        <div>
                            <fieldset
                                className="row category-form-fieldset"
                                style={category_form_fieldset}
                            >
                                <legend style={category_form_legend}>Personal Information</legend>
                                <div className="col-md-12"></div>
                                <div className="col-md-4 p-2">
                                    <strong>User Name:</strong>&nbsp;&nbsp;&nbsp;&nbsp;
                                    {userData.first_name ? userData.first_name : ''}&nbsp;
                                    {userData.last_name ? userData.last_name : ''}
                                </div>
                                <div className="col-md-4 p-2">
                                    <strong>Gender:</strong>&nbsp;&nbsp;&nbsp;&nbsp;
                                    {userData.gender ? userData.gender : ''}
                                </div>
                                <div className="col-md-4 p-2">
                                    <strong>Email:</strong>&nbsp;&nbsp;&nbsp;&nbsp;
                                    {userData.email ? userData.email : ''}
                                </div>
                                <div className="col-md-4 p-2">
                                    <strong>Mobile Number:</strong>&nbsp;&nbsp;&nbsp;&nbsp;
                                    {userData.mobile ? userData.mobile : ''}
                                </div>
                                <div className="col-md-4 p-2">
                                    <strong>CNIC:</strong>&nbsp;&nbsp;&nbsp;&nbsp;
                                    {userData.cnic ? userData.cnic : ''}
                                </div>
                                <div className="col-md-4 p-2">
                                    <strong>Passport Number:</strong>&nbsp;&nbsp;&nbsp;&nbsp;
                                    {userData.passport_number ? userData.passport_number : ''}
                                </div>
                                <div className="col-md-4 p-2">
                                    <strong>Iqama Number:</strong>&nbsp;&nbsp;&nbsp;&nbsp;
                                    {userData.iqama_number ? userData.iqama_number : ''}
                                </div>
                                <div className="col-md-4 p-2">
                                    <strong>Father Name:</strong>&nbsp;&nbsp;&nbsp;&nbsp;
                                    {userData.father_name ? userData.father_name : ''}
                                </div>
                                <div className="col-md-4 p-2">
                                    <strong>Profession:</strong>&nbsp;&nbsp;&nbsp;&nbsp;
                                    {userData.profession ? userData.profession : ''}
                                </div>
                                <div className="col-md-4 p-2">
                                    <strong>Roshan Digital Account Holder:</strong>
                                    &nbsp;&nbsp;&nbsp;&nbsp;
                                    {userData.account_holder ? userData.account_holder : ''}
                                </div>
                            </fieldset>
                            <fieldset
                                className="row category-form-fieldset"
                                style={category_form_fieldset}
                            >
                                <legend style={category_form_legend}>Permanent Address</legend>
                                <div className="col-md-12"></div>
                                <div className="col-md-8 p-2">
                                    <strong>Address:</strong>&nbsp;&nbsp;&nbsp;&nbsp;
                                    {userData.permanent_address ? userData.permanent_address : ''}
                                </div>
                                <div className="col-md-4 p-2">
                                    <strong>Postal code:</strong>&nbsp;&nbsp;&nbsp;&nbsp;
                                    {userData.permanent_postal_code
                                        ? userData.permanent_postal_code
                                        : ''}
                                </div>
                                <div className="col-md-4 p-2">
                                    <strong>City:</strong>&nbsp;&nbsp;&nbsp;&nbsp;
                                    {userData.permanent_city ? userData.permanent_city : ''}
                                </div>
                                <div className="col-md-4 p-2">
                                    <strong>State/Province:</strong>&nbsp;&nbsp;&nbsp;&nbsp;
                                    {userData.permanent_state ? userData.permanent_state : ''}
                                </div>
                                <div className="col-md-4 p-2">
                                    <strong>Country:</strong>&nbsp;&nbsp;&nbsp;&nbsp;
                                    {userData.permanent_country ? userData.permanent_country : ''}
                                </div>
                            </fieldset>
                            <fieldset
                                className="row category-form-fieldset"
                                style={category_form_fieldset}
                            >
                                <legend style={category_form_legend}>Current Address</legend>
                                <div className="col-md-12"></div>
                                <div className="col-md-8 p-2">
                                    <strong>Address:</strong>&nbsp;&nbsp;&nbsp;&nbsp;
                                    {userData.current_address ? userData.current_address : ''}
                                </div>
                                <div className="col-md-4 p-2">
                                    <strong>Postal code:</strong>&nbsp;&nbsp;&nbsp;&nbsp;
                                    {userData.current_postal_code
                                        ? userData.current_postal_code
                                        : ''}
                                </div>
                                <div className="col-md-4 p-2">
                                    <strong>City:</strong>&nbsp;&nbsp;&nbsp;&nbsp;
                                    {userData.current_city ? userData.current_city : ''}
                                </div>
                                <div className="col-md-4 p-2">
                                    <strong>State/Province:</strong>&nbsp;&nbsp;&nbsp;&nbsp;
                                    {userData.current_state ? userData.current_state : ''}
                                </div>
                                <div className="col-md-4 p-2">
                                    <strong>Country:</strong>&nbsp;&nbsp;&nbsp;&nbsp;
                                    {userData.current_country ? userData.current_country : ''}
                                </div>
                            </fieldset>
                            {userData.dependent_value ? (
                                <fieldset
                                    className="row category-form-fieldset"
                                    style={category_form_fieldset}
                                >
                                    <legend style={category_form_legend}>Dependent Details</legend>
                                    <table className="table table-striped">
                                        <thead className="table-primary">
                                            <tr>
                                                <td style={{backgroundColor: '#ccc', color: '#000'}} scope="col">Name</td>
                                                <td style={{backgroundColor: '#ccc', color: '#000'}} scope="col">Age</td>
                                                <td style={{backgroundColor: '#ccc', color: '#000'}} scope="col">Iqama Number</td>
                                                <td style={{backgroundColor: '#ccc', color: '#000'}} scope="col">Relation</td>
                                            </tr>
                                        </thead>
                                        <tbody>
                                            {userData.dependent_value &&
                                                userData.dependent_value.map((user, index) => {
                                                    return (
                                                        <tr key={userData._id}>
                                                            <td>{user.name ? user.name : ''}</td>
                                                            <td>{user.age ? user.age : ''}</td>
                                                            <td>
                                                                {user.iqamaNo ? user.iqamaNo : ''}
                                                            </td>
                                                            <td>
                                                                {user.relation ? user.relation : ''}
                                                            </td>
                                                        </tr>
                                                    );
                                                })}
                                        </tbody>
                                    </table>
                                    <div className="col-md-12"></div>
                                </fieldset>
                            ) : (
                                ''
                            )}
                            <div className="col-md-6 p-2">
                                <strong>Problem being faced in KSA:</strong>&nbsp;&nbsp;&nbsp;&nbsp;
                                {userData.problem ? userData.problem : ''}
                            </div>
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
