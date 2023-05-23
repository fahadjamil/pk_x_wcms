import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import Axios from 'axios';
import { activateUserAccountService } from '../../config/path';
import { useURLparam } from '../../customHooks/useURLparam';
import { productID } from '../../config/constants';

const SuccessText = styled.p`
    color: green;
`;
const ErrorText = styled.p`
    color: red;
`;
const ActivationWrapper = styled.div`
    width: 100%;
    text-align: center;
`;

export const ActivateUser = (props) => {
    const { commonConfigs, lang } = props;
    const validationToken = useURLparam();
    const [isSuccess, setIsSuccess] = useState(false);
    const [error, setError] = useState('');

    const convertByLang = (arText, enText) => (lang.langKey === 'AR' ? arText : enText);

    useEffect(() => {
        if (validationToken) {
            Axios.get(activateUserAccountService(), {
                params: {
                    code: validationToken,
                    prodId : productID
                }
            })
                .then((res) => {
                    if (res.data.code == 1) {
                        setIsSuccess(true);
                    } else if (res.data.code == -2) {
                        setError(convertByLang(res.data.message_ar, res.data.message));
                    } else {
                        setError(
                            convertByLang('فشل تسجيل الدخول', 'Account activation failed')
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
    }, [validationToken]);

    return (
        <ActivationWrapper>
            {isSuccess ? (
                <SuccessText>
                    {convertByLang(
                        'تهانينا! تم تنشيط حسابك.',
                        'Congratulations! Your account has been activated.'
                    )}
                </SuccessText>
            ) : (
                <ErrorText>{error}</ErrorText>
            )}
        </ActivationWrapper>
    );
};
