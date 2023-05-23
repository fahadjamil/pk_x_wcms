import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import md5 from 'md5';
import Cookies from 'universal-cookie/es6';
import { useUserAgent } from '../../customHooks/useUserAgent';
import { changePasswordService } from '../../config/path';
import { EMAIL_COOKIE, productID } from '../../config/constants';
import { passwordRegEx } from '../../config/regex';

const ChangeDefaultPasswordWrapper = styled.div``;
const CredentialInput = styled.input`
    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
        margin: 0;
    }
    input[type='number'] {
        -moz-appearance: textfield;
    }
`;

const CredentialLabel = styled.label`
    color: #94979a;
    ::after {
        content: ' *';
        color: red;
    }
`;
const CredentialError = styled.p`
    color: #a31621;
    background: #a3162111;
    border: 1px solid #a31621;
    padding: 0.4rem;
    border-radius: 4px;
    margin-bottom: 1rem;
`;
const InstructionLabel = styled.label``;
const ChangeDefaultPasswordCredentialsWrapper = styled.form``;
const ChangePasswordButtonWrapper = styled.div``;

const ChangePasswordbutton = styled.button`
    padding: 5px 10px 5px 5px;
    width: ${(props) => (props.isMobile ? '100%' : '100px')};
    background: #c5964a;
    color: white;
    text-align: center;
    border-style: none;
    border-radius: 2px;
`;

const PasswordGuideWrapper = styled.div``;
const ContentWrapper = styled.div``;

export const ChangeDefaultPassword = (props) => {
    const { commonConfigs, lang } = props;
    const [oldPassword, setOldPassword] = useState('');
    const [password, setPassword] = useState('');
    const [password2, setPassword2] = useState('');
    const [userName, setUserName] = useState('');
    const [error, setError] = useState('');

    const [success, setSuccess] = useState(false);
    const isMobile = useUserAgent();
    const handleOldChange = (newValue) => setOldPassword(newValue);
    const handlePasswordChange = (newValue) => setPassword(newValue);
    const handlePassword2change = (newValue) => setPassword2(newValue);

    const cookies = new Cookies();

    const convertByLang = (arText, enText) => (lang.langKey === 'AR' ? arText : enText);

    // get user email from bk-web-email cookie
    useEffect(() => {
        let userEmail = cookies.get(EMAIL_COOKIE);
        if (userEmail) {
            setUserName(userEmail);
        }
    }, []);

    const validate = () => {
        if (!userName) {
            // no username
            setError(
                convertByLang(
                    ' حدث خطأ في الشبكة. يرجى المحاولة مرى أخرى. ',
                    'Network Error - Please try again'
                )
            );
            return false;
        }
        if (password.trim() != password2.trim()) {
            // password mismatch
            setError(convertByLang('كلمة السر الجديدة غير متطابقة', 'New Password Mismatch'));
            return false;
        }
        if (!passwordRegEx.test(password)) {
            // pasword is too weak
            setError(convertByLang('كلمة السر ضعيفة', 'Password is weak'));
            return false;
        }
        if (oldPassword == password) {
            // new password is the same as the old password
            setError(
                convertByLang(
                    ' يجب أن تكون كلمة السر الجديدة مختلفة عن كلمة السر القديمة',
                    'The New Password cannot be the same as the old password'
                )
            );
            return false;
        }

        return userName && password == password2 && passwordRegEx.test(password);
    };

    const authFunction = (event) => {
        event.preventDefault();
        if (validate()) {
            setError('');
            const authObject = {
                userName: userName,
                oldPassword: md5(oldPassword).toString(),
                newPassword: md5(password).toString(),
                newPassword2: md5(password2).toString(),
                prodId: productID,
            };

            Axios.post(changePasswordService(), { ...authObject })
                .then((res) => {
                    if (res.data.code == 1) {
                        // sucess
                        setSuccess(true);
                    } else if (res.data.code == -2) {
                        setError(res.data.message);
                    } else {
                        setError(
                            convertByLang(
                                ' حدث خطأ في الشبكة. يرجى المحاولة مرى أخرى. ',
                                'Network Error - Please try again'
                            )
                        );
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
        <ChangeDefaultPasswordWrapper isMobile={isMobile}>
            <ChangeDefaultPasswordCredentialsWrapper onSubmit={authFunction}>
                <InstructionLabel>
                    {success ? (
                        <p>
                            {convertByLang(
                                ' تم تغيير كلمة السر بنجاح',
                                'Password Changed Successfully'
                            )}{' '}
                            <a href={convertByLang('/ar', '/en')}>
                                {' '}
                                {convertByLang('اذهب الى الصفحة الرئيسية', 'Go to home')}
                            </a>
                        </p>
                    ) : (
                        <React.Fragment></React.Fragment>
                    )}
                </InstructionLabel>
                <ContentWrapper>
                    <div>
                        <p>
                            {convertByLang(': اسم المستخدم', 'Username:')}{' '}
                            <strong>{userName}</strong>
                        </p>
                        <div className="form-group">
                            <CredentialLabel for="oldpassword">
                                {convertByLang(' كلمة السر الحالية', 'Current Password')}
                            </CredentialLabel>
                            <CredentialInput
                                name="oldpassword"
                                className="form-control"
                                type="password"
                                onChange={(event) => handleOldChange(event.target.value)}
                                required
                            ></CredentialInput>
                        </div>
                        <div className="form-group">
                            <CredentialLabel for="newpassword">
                                {convertByLang('كلمة السر الجديدة', 'New Password')}
                            </CredentialLabel>
                            <CredentialInput
                                name="newpassword"
                                className="form-control"
                                type="password"
                                onChange={(event) => handlePasswordChange(event.target.value)}
                                required
                            ></CredentialInput>
                        </div>
                        <div className="form-group">
                            <CredentialLabel for="confirmnewpassword">
                                {convertByLang('تأكيد كلمة السر الجديدة', 'Confirm New Password')}
                            </CredentialLabel>
                            <CredentialInput
                                name="confirmnewpassword"
                                className="form-control"
                                type="password"
                                onChange={(event) => handlePassword2change(event.target.value)}
                                required
                            ></CredentialInput>
                        </div>
                        {error ? (
                            <CredentialError>{error}</CredentialError>
                        ) : (
                            <React.Fragment></React.Fragment>
                        )}
                        <ChangePasswordButtonWrapper>
                            <ChangePasswordbutton
                                type="submit"
                                className="btn btn-login"
                                isMobile={isMobile}
                            >
                                {convertByLang(' تحديث', ' Update')}
                            </ChangePasswordbutton>
                        </ChangePasswordButtonWrapper>
                    </div>
                    <PasswordGuideWrapper>
                        <ul className="password-tips mt-5">
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
                    </PasswordGuideWrapper>
                </ContentWrapper>
            </ChangeDefaultPasswordCredentialsWrapper>
        </ChangeDefaultPasswordWrapper>
    );
};
