import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import md5 from 'md5';
import { forgotPasswrodService, otpValidationService } from '../../config/path';
import { passwordRegEx } from '../../config/regex';
import { productID } from '../../config/constants';

const ForgotPasswordWrapper = styled.div``;
const ForgotPasswordHeadingWrapper = styled.div``;
const ForgotPasswordHeading = styled.h2`
    font-size: 1.3rem;
    color: rgb(198, 151, 75) !important;
    font-weight: 600 !important;
    margin-top: 1rem;
`;
const CredentialInput = styled.input``;
const CredentialLabel = styled.label``;
const CredentialError = styled.p`
    color: #a31621;
    background: #a3162111;
    border: 1px solid #a31621;
    padding: 0.4rem;
    border-radius: 4px;
    margin-bottom: 1rem;
`;
const CredentialSuccess = styled.p`
    color: #24d464;
    background: #a3162111;
    border: 1px solid #24d464;
    padding: 0.4rem;
    border-radius: 4px;
    margin-bottom: 1rem;
`;
const ForgotPasswordCredentialsWrapper = styled.form``;
const ForgotPasswordButtonWrapper = styled.div``;
const ForgotPasswordbutton = styled.button`
    background: rgb(197, 150, 74);
    color: white;
`;

export const ForgotPassword = (props) => {
    const { lang } = props;

    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const [otp, setOtp] = useState('');
    const [password, setPassword] = useState();
    const [password2, setPassword2] = useState();
    const [showOTP, setShowOTP] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleEmailChange = (newValue) => setEmail(newValue);
    const handleOtpChange = (newValue) => setOtp(newValue);
    const handlePasswordChange = (newValue) => setPassword(newValue);
    const handlePassword2change = (newValue) => setPassword2(newValue);

    const convertByLang = (arText, enText) => (lang.langKey === 'AR' ? arText : enText);

    const validateEmail = (email) => {
        const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(String(email).toLowerCase());
    };

    const authFunction = (event) => {
        event.preventDefault();
        if (validateEmail(email)) {
            Axios.post(forgotPasswrodService(), {
                email: email,
                prodId : productID
            })
                .then((res) => {
                    if (res.data.code == 1) {
                        setShowOTP(true);
                        setError('');
                    } else if (res.data.code == -2) {
                        setError(convertByLang(res.data.message_ar, res.data.message));
                    } else {
                        setError(convertByLang('فشل تسجيل الدخول', ' Password reset error'));
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
        } else {
            setError(
                convertByLang(
                    ' البريد الالكتروني خاطئ ',
                    'The Email address you entered is invalid'
                )
            );
        }
    };
    const validatate = () => {
        if (!otp) {
            setError(convertByLang('رمز التحقق خطأ', 'Wrong OTP code'));
        }
        if (password) {
            if (!passwordRegEx.test(password)) {
                setError(convertByLang(' كلمة السر ضعيفة', 'Password is weak'));
            }
        }
        if (password && password2 && password != password2) {
            setError(convertByLang('كلمة السر الجديدة غير متطابقة', 'New Password Mismatch'));
        }
        return (
            otp && password && passwordRegEx.test(password) && password2 && password == password2
        );
    };

    const OTPvalidation = (event) => {
        setError('');
        let md5Hash = md5(password);
        event.preventDefault();
        const reqObj = {
            email: email,
            otp: otp,
            newPassword: md5Hash.toString(),
            newPassword2: md5Hash.toString(),
            prodId : productID
        };
        if (validatate()) {
            Axios.post(otpValidationService(), reqObj)
                .then((res) => {
                    if (res.data.code == 1) {
                        setSuccess(true);
                        if (typeof window !== 'undefined') {
                            // window.location = convertByLang('/ar', '/en');
                        }
                    } else if (res.data.code == -2) {
                        setError(convertByLang(res.data.message_ar, res.data.message));
                    } else {
                        setError(convertByLang('فشل تسجيل الدخول', 'Error'));
                    }
                })
                .catch(() =>
                    setError(
                        convertByLang(
                            ' حدث خطأ في الشبكة. يرجى المحاولة مرى أخرى.',
                            'Network error - Please try again'
                        )
                    )
                );
        } else {
            // setError("Error")
        }
    };

    const passwordsNotMatched = () => password && password2 && password != password2;

    return (
        <ForgotPasswordWrapper className="mb-5">
            <ForgotPasswordHeadingWrapper>
                <ForgotPasswordHeading>
                    {convertByLang('نسيت كلمة السر', 'Forgot Password')}
                </ForgotPasswordHeading>
            </ForgotPasswordHeadingWrapper>
            {showOTP ? (
                // Second step of Forgot Password
                <ForgotPasswordCredentialsWrapper
                    className="ForgotPassword"
                    onSubmit={OTPvalidation}
                >
                    <div className="form-group">
                        <CredentialLabel for="email" className="mandatory">
                            {convertByLang(
                                'تم ارسال رمز التحقق (OTP) الى بريدك الإلكتروني',
                                ` Enter the OTP code sent to "${email}"`
                            )}
                        </CredentialLabel>
                        <CredentialInput
                            name="otp"
                            type="number"
                            className="form-control"
                            onChange={(event) => handleOtpChange(event.target.value)}
                            required
                            placeholder={convertByLang(
                                'تم ارسال رمز التحقق (OTP) الى بريدك الإلكتروني',
                                ` Enter the OTP code sent to "${email}"`
                            )}
                        ></CredentialInput>
                    </div>

                    <div className="form-group">
                        <CredentialLabel for="email" className="mandatory">
                            {convertByLang('كلمة مرور جديدة', 'New Password')}
                        </CredentialLabel>
                        <CredentialInput
                            name="password"
                            type="password"
                            className="form-control"
                            onChange={(event) => handlePasswordChange(event.target.value)}
                            required
                        ></CredentialInput>
                    </div>
                    <div className="form-group">
                        <CredentialLabel for="email" className="mandatory">
                            {convertByLang('تأكيد كلمة المرور الجديدة', 'Confirm New Password')}
                        </CredentialLabel>
                        <CredentialInput
                            name="password2"
                            type="password"
                            className="form-control"
                            onChange={(event) => handlePassword2change(event.target.value)}
                            required
                        ></CredentialInput>
                    </div>
                    {error ? (
                        <CredentialError>{error} </CredentialError>
                    ) : (
                        <React.Fragment></React.Fragment>
                    )}
                    {success ? (
                        <CredentialSuccess>
                            {convertByLang(
                                'تم تحديث كلمة السر بنجاح',
                                'Password reset successfully'
                            )}
                        </CredentialSuccess>
                    ) : (
                        <React.Fragment></React.Fragment>
                    )}

                    <ForgotPasswordButtonWrapper>
                        <ForgotPasswordbutton className="btn forgot-password-button" type="submit">
                            {convertByLang('موافق', ' Submit')}
                        </ForgotPasswordbutton>
                    </ForgotPasswordButtonWrapper>
                </ForgotPasswordCredentialsWrapper>
            ) : (
                // First step of Forgot Password
                <ForgotPasswordCredentialsWrapper onSubmit={authFunction}>
                    <div className="form-group">
                        <CredentialLabel for="email" className="mandatory">
                            {convertByLang('البريد الإلكتروني', 'Email address')}
                        </CredentialLabel>
                        <CredentialInput
                            name="email"
                            type="text"
                            className="form-control"
                            onChange={(event) => handleEmailChange(event.target.value)}
                            required
                            placeholder={convertByLang('البريد الإلكتروني', 'Email address')}
                        ></CredentialInput>
                    </div>

                    {passwordsNotMatched() ? (
                        <CredentialError>
                            {convertByLang(
                                'كلمة السر الجديدة غير متطابقة',
                                'Passwords do not match'
                            )}
                        </CredentialError>
                    ) : (
                        <React.Fragment></React.Fragment>
                    )}

                    {error ? (
                        <CredentialError>{error} </CredentialError>
                    ) : (
                        <React.Fragment></React.Fragment>
                    )}

                    <ForgotPasswordButtonWrapper>
                        <ForgotPasswordbutton className="btn forgot-password-button" type="submit">
                            {convertByLang('موافق', ' Submit')}
                        </ForgotPasswordbutton>
                    </ForgotPasswordButtonWrapper>
                </ForgotPasswordCredentialsWrapper>
            )}
        </ForgotPasswordWrapper>
    );
};
