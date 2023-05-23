import React, { useState, Fragment } from 'react';
import styled from 'styled-components';
import ReCAPTCHA from 'react-google-recaptcha';
import Axios from 'axios';

const FormBox = styled.div`
    border-style: groove;
    padding: 10px;
`;

const FormLabelRow = styled.div`
    min-height: 30px;
    width: 100%;
    padding-top: 8px;
    padding-bottom: 3px;
`;

const FormRow = styled.div`
    min-height: 50px;
    width: 100%;
`;

const SpanStar = styled.span`
    color: red;
`;

const SpanError = styled.span`
    display: flex;
    justify-content: center;
    color: red;
    padding-top: 8px;
    padding-bottom: 3px;
    font-family: Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
        sans-serif;
`;

const SpanSuccess = styled.span`
    display: flex;
    justify-content: center;
    color: green;
    padding-top: 8px;
    padding-bottom: 3px;
    font-family: Segoe UI, Roboto, Oxygen, Ubuntu, Cantarell, Fira Sans, Droid Sans, Helvetica Neue,
        sans-serif;
`;

export const ContactForm = (props) => {
    const { data, commonConfigs, lang } = props;
    const [contactName, setContactName] = useState('');
    const [contactEmail, setContactEmail] = useState('');
    const [error, setError] = useState(false);
    const [success, setSuccess] = useState(false);
    const [mobileNo, setMobileNo] = useState('');
    const [formError, setFormError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');
    const [message, setMessage] = useState('');
    const [errorObj, setErrorObj] = useState({});
    const [token, setToken] = useState(false);
    const emailRegex = RegExp(
        '^(([^<>()\\[\\]\\\\.,;:\\s@"]+(\\.[^<>()\\[\\]\\\\.,;:\\s@"]+)*)|(".+"))@((\\[[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\.[0-9]{1,3}\\])|(([a-zA-Z\\-0-9]+\\.)+[a-zA-Z]{2,}))$'
    );
    const mobileNoRegex = RegExp('^([0-9]+)$');
    const language = lang && lang.langKey;
    const onCaptchaSuccessful = (value) => {
        setToken(true);
    };

    const validateForm = (data) => {
        let errors = {};
        let languageEng = language == 'en' || language == 'EN';
        if (!data.name) {
            errors.name = languageEng ? 'Name Required !' : 'مطلوب اسم';
        } else if (!data.email) {
            errors.email = languageEng ? 'Email Required !' : 'البريد الالكتروني مطلوب';
        } else if (!emailRegex.test(data.email)) {
            errors.email = languageEng ? 'Invalid Email !' : 'بريد إلكتروني خاطئ';
        } else if (!data.mobileNo) {
            errors.mobileNo = languageEng ? 'Phone number Required !' : 'رقم الهاتف مطلوب';
        } else if (!mobileNoRegex.test(data.mobileNo)) {
            errors.mobileNo = languageEng ? 'Invalid Phone number !' : 'رقم الهاتف غير صحيح';
        } else if (!data.message) {
            errors.message = languageEng ? 'Message Required !' : 'الرسالة مطلوبة';
        } else if (!/^[a-zA-Z0-9*[\]|\\,.?: -]*$/.test(data.message)) {
            errors.message = 'Invalid Characters !';
        }

        return errors;
    };

    const formSubmit = (event) => {
        event.preventDefault();

        if (token) {
            if (!contactName && !contactEmail && !mobileNo && !message) {
                setErrorObj({
                    all: 'Required !',
                    email: 'Required !',
                    password: 'Required !',
                });
                // let displayMessage =
                //     language == 'en' || language == 'EN'
                //         ? 'Please Fill Required Fields !'
                //         : 'يرجى ملء الحقول المطلوبة';
                setError(true);
                // setFormError(displayMessage);
                return false;
            } else {
                setError(false);
                const contactForm = {
                    name: contactName,
                    email: contactEmail,
                    mobileNo: mobileNo,
                    message: message,
                    type: data.settings.collection.value,
                };
                const errors = validateForm(contactForm);

                if (!Object.keys(errors).length) {
                    Axios.post(`/api/web/contact-us`, contactForm).then((res) => {
                        if (res.data.code == 1) {
                            let displaySuccessMessage =
                                language == 'en' || language == 'EN'
                                    ? 'Successfully Submitted !'
                                    : 'قدمت بنجاح';
                            setSuccess(true);
                            setSuccessMessage(displaySuccessMessage);
                        } else if (res.data.error) {
                            let displayErrorMessage =
                                language == 'en' || language == 'EN'
                                    ? 'Error Occurred, Please try again'
                                    : 'حدث خطأ ، يرجى المحاولة مرة أخرى';
                            setError(true);
                            setFormError(displayErrorMessage);
                        } else {
                            setError(true);
                            setFormError(res.data.message);
                        }
                    });
                    setTimeout(() => {
                        setSuccess(false);
                        setError(false);
                        setToken(false);
                        setSuccessMessage('');
                        setFormError('');
                    }, 3000);
                } else {
                    setErrorObj(errors);
                }
            }
        } else {
            let displayMessage =
                language == 'en' || language == 'EN'
                    ? 'Please Fill Required Fields !'
                    : 'يرجى ملء الحقول المطلوبة';
            setError(true);
            setFormError(displayMessage);
            setTimeout(() => {
                setError(false);
                setToken(false);
            }, 3000);
        }
    };

    return (
        <FormBox>
            <form onSubmit={formSubmit}>
                <FormLabelRow>
                    {language == 'en' || language == 'EN' ? 'Name' : 'الإسم'}{' '}
                    <SpanStar> * </SpanStar>
                </FormLabelRow>
                <FormRow>
                    <input
                        type="text"
                        name="contactName"
                        style={{ width: '100%' }}
                        value={contactName}
                        onChange={(e) => {
                            setError(false),
                                setErrorObj({}),
                                setContactName(e.target.value.replace(/[^\w\s]/gi, ''));
                        }}
                    />
                    <SpanStar>
                        {errorObj.all || (errorObj.name && <SpanError>{errorObj.name}</SpanError>)}
                    </SpanStar>
                </FormRow>
                <FormLabelRow>
                    {language == 'en' || language == 'EN' ? 'Email Address' : 'البريد الإلكتروني'}{' '}
                    <SpanStar> * </SpanStar>{' '}
                </FormLabelRow>
                <FormRow>
                    <input
                        type="email"
                        name="contactEmail"
                        style={{ width: '100%' }}
                        value={contactEmail}
                        onChange={(e) => {
                            setError(false), setContactEmail(e.target.value), setErrorObj({});
                        }}
                    />
                    <SpanStar>{errorObj.email && <SpanError>{errorObj.email}</SpanError>}</SpanStar>
                </FormRow>
                <FormLabelRow>
                    {language == 'en' || language == 'EN' ? 'Mobile Number' : 'رقم الهاتف النقال'}{' '}
                    <SpanStar> * </SpanStar>
                </FormLabelRow>
                <FormRow>
                    <input
                        type="text"
                        name="mobileNo"
                        style={{ width: '100%' }}
                        value={mobileNo}
                        onChange={(e) => {
                            setError(false), setMobileNo(e.target.value), setErrorObj({});
                        }}
                    />
                    <SpanStar>
                        {errorObj.mobileNo && <SpanError>{errorObj.mobileNo}</SpanError>}
                    </SpanStar>
                </FormRow>
                <FormLabelRow>
                    {language == 'en' || language == 'EN' ? 'Message' : 'الرسالة'}{' '}
                    <SpanStar> * </SpanStar>
                </FormLabelRow>
                <FormRow>
                    <textarea
                        name="message"
                        style={{ width: '100%' }}
                        value={message}
                        onChange={(e) => {
                            setError(false), setMessage(e.target.value), setErrorObj({});
                        }}
                    />
                    <SpanStar>
                        {errorObj.message && <SpanError>{errorObj.message}</SpanError>}
                    </SpanStar>
                </FormRow>
                <FormRow style={{ paddingTop: '25px' }}>
                    <ReCAPTCHA
                        sitekey="6Lc0mhsaAAAAAAd6P7TtqtNmcAM8ChbdoWYJ2IEX"
                        onChange={onCaptchaSuccessful}
                    />
                </FormRow>

                <FormRow style={{ paddingTop: '50px' }}>
                    <input
                        type="submit"
                        name="heading"
                        value={language == 'en' || language == 'EN' ? 'Submit' : 'إرسال'}
                    />{' '}
                </FormRow>
                {error ? <SpanError>{formError}</SpanError> : <Fragment />}
                {success ? <SpanSuccess>{successMessage}</SpanSuccess> : <Fragment />}
            </form>
        </FormBox>
    );
};
