import Axios from 'axios';
import React, { useState } from 'react';
import styled from 'styled-components';
import md5 from 'md5';
import { registerService } from '../../config/path';
import { passwordRegEx, emailRegEx } from '../../config/regex';
import { productID } from '../../config/constants';

const RegistrationWrapper = styled.div``;
const RegistrationHeadingWrapper = styled.div``;
const RegistrationHeading = styled.h2``;
const CredentialInput = styled.input``;
const CredentialLabel = styled.label``;
const SucessLabel = styled.p`
    color: #4c7f58;
    background: #4c7f5811;
    border: 1px solid #4c7f58;
    padding: 0.4rem;
    border-radius: 4px;
    margin-bottom: 1rem;
`;
const RegistrationCredentialsWrapper = styled.form``;
const RegistrationButtonWrapper = styled.div``;
const Registrationbutton = styled.button`
    background: rgb(197, 150, 74);
    color: white;
`;
const CredentialError = styled.p`
    color: #a31621;
    background: #a3162111;
    border: 1px solid #a31621;
    padding: 0.4rem;
    border-radius: 4px;
    margin-bottom: 1rem;
`;

export const Registration = (props) => {
    const { commonConfigs, lang } = props;

    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [showSucess, setShowSucess] = useState(false);
    const [error, setError] = useState('');

    const handleNameChange = (newValue) => setName(newValue);
    const handleEmailChange = (newValue) => setEmail(newValue);
    const handlePasswordChange = (newValue) => setPassword(newValue);
    const handlePassword2Change = (newValue) => setPassword2(newValue);

    const convertByLang = (arText, enText) => (lang.langKey === 'AR' ? arText : enText);

    const validateEmail = (email) => emailRegEx.test(String(email).toLowerCase());

    const validate = () => {
        if (password) {
            if (!passwordRegEx.test(password)) {
                setError(convertByLang('كلمة السر ضعيفة', 'Password is weak'));
            }
        }
        if (email && !validateEmail(email)) {
            setError(convertByLang('البريد الالكتروني خاطئ', 'Invalid email address'));
        }

        if (password != password2) {
            setError(convertByLang('كلمة السر الجديدة غير متطابقة', 'New Password Mismatch'));
        }

        return (
            email &&
            validateEmail(email) &&
            passwordRegEx.test(password) &&
            password &&
            password2 &&
            password == password2
        );
    };

    const authFunction = (event) => {
        event.preventDefault();
        if (validate()) {
            let md5Hash = md5(password);
            let md5Hash2 = md5(password2);

            Axios.post(registerService(), {
                name: name,
                email: email,
                password: md5Hash.toString(),
                password2: md5Hash2.toString(),
                lang: lang.langKey,
                prodId: productID,
            })
                .then((res) => {
                    if (res.data.code == 1) {
                        setShowSucess(true);
                    } else if (res.data.code == -2) {
                        setError(convertByLang(res.data.message_ar, res.data.message));
                    } else {
                        setError(convertByLang(' يرجى المحاولة مرى أخرى.', 'Registration Failed'));
                    }
                })
                .catch(() =>
                    setError(
                        convertByLang(
                            ' حدث خطأ في الشبكة. يرجى المحاولة مرى أخرى. ',
                            'Network Error - Please try again'
                        )
                    )
                );
        }
    };

    return (
        <RegistrationWrapper>
            {!showSucess ? (
                <RegistrationCredentialsWrapper onSubmit={authFunction}>
                    <div className="form-group">
                        <CredentialLabel for="nameRG" className="mandatory">
                            {convertByLang('الاسم', 'Name')}
                        </CredentialLabel>
                        <CredentialInput
                            name="nameRG"
                            type="text"
                            className="form-control"
                            onChange={(event) => handleNameChange(event.target.value)}
                            required
                            placeholder={convertByLang('الاسم', 'Name')}
                        ></CredentialInput>
                    </div>

                    <div className="form-group">
                        <CredentialLabel for="emailRG" className="mandatory">
                            {convertByLang('البريد الإلكتروني', 'Email address')}
                        </CredentialLabel>
                        <CredentialInput
                            name="emailRG"
                            type="text"
                            className="form-control"
                            onChange={(event) => handleEmailChange(event.target.value)}
                            required
                            placeholder={convertByLang('البريد الإلكتروني', 'Email address')}
                        ></CredentialInput>
                    </div>

                    <div className="form-group">
                        <CredentialLabel for="passwordRG" className="mandatory">
                            {' '}
                            {convertByLang('كلمة السر', 'Password')}
                        </CredentialLabel>
                        <CredentialInput
                            name="passwordRG"
                            className="form-control"
                            type="password"
                            onChange={(event) => handlePasswordChange(event.target.value)}
                            required
                            placeholder={convertByLang('كلمة السر', 'Password')}
                        ></CredentialInput>
                    </div>

                    <div className="form-group">
                        <CredentialLabel for="password2RG" className="mandatory">
                            {' '}
                            {convertByLang('كلمة السر', 'Confirm Password')}
                        </CredentialLabel>
                        <CredentialInput
                            name="password2RG"
                            className="form-control"
                            type="password"
                            onChange={(event) => handlePassword2Change(event.target.value)}
                            required
                            placeholder={convertByLang('كلمة السر', 'Confirm Password')}
                        ></CredentialInput>
                    </div>
                    {error ? (
                        <CredentialError>{error} </CredentialError>
                    ) : (
                        <React.Fragment></React.Fragment>
                    )}
                    <RegistrationButtonWrapper>
                        <Registrationbutton type="submit" className="btn btn-register">
                            {' '}
                            {convertByLang('تسجيل', 'Register')}
                        </Registrationbutton>
                    </RegistrationButtonWrapper>
                    <div>
                        <ul className="password-tips mt-5">
                            <li>
                                {convertByLang(
                                    'اسم المستخدم هو البريد الالكتروني الخاص بك',
                                    'Your username is your email address'
                                )}
                            </li>
                            <li>
                                {convertByLang(
                                    'يجب ان يكون البريد الالكتروني الخاص بك باللغة الإنجليزية',
                                    'Your email address must be in English'
                                )}
                            </li>
                            <li>
                                {convertByLang(
                                    'يجب أن تكون كلمة السر من 6 أحرف أو أكثر',
                                    'Password must be minimum 6 characters long'
                                )}
                            </li>
                            <li>
                                {convertByLang(
                                    'يجب ان تحتوى على الاقل على احد الاحرف الكبيرة',
                                    'Must contain minimum 1 upper case letter'
                                )}
                            </li>
                            <li>
                                {convertByLang(
                                    ' يجب ان تحتوى على الاقل على احد الاحرف الصغيره',
                                    'Must contain minimum 1 lower case letter'
                                )}
                            </li>
                            <li>
                                {convertByLang(
                                    'يجب ان تحتوى على الاقل على احد الاحرف الخاصة: [$، @، !، %، ?، &]',
                                    'Must contain minimum 1 special character: [$, @, !, %, ?, &]'
                                )}
                            </li>
                            <li>
                                {convertByLang(
                                    "يجب ان لا تحتوي على مسافات او '*'",
                                    "Do not contain space or '*'"
                                )}
                            </li>
                        </ul>
                    </div>
                </RegistrationCredentialsWrapper>
            ) : (
                <SucessLabel>
                    {convertByLang(
                        'تم تسجيلكم بنجاح. تم إرسال رسالة إلكترونية إلى عنوان بريدك الإلكتروني الذي يحتوي على رابط تنشيط الحساب. يرجى تفعيل حسابك لاستخدام خدمات بورصة الكويت.',
                        'Your registration was successful. An Email has been sent to your email address containing account activation link. Please activate your account to use Boursa Kuwait services.'
                    )}
                </SucessLabel>
            )}
        </RegistrationWrapper>
    );
};
