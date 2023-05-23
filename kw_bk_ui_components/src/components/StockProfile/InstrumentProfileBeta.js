import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import styled from 'styled-components';
import { useUserAgent } from '../../customHooks/useUserAgent';
import { marketBackEndProxyPass } from '../../config/path';
import { displayDDMonthNameYYYYFormat } from '../../helper/date';
import { formatAsCurrency } from '../Common/helper';
import { useURLparam } from '../../customHooks/useURLparam';

const AvailabilityDiv = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
`;

export const InstrumentProfileBeta = (props) => {
    const [showMore, setShowMore] = useState(false);
    const [profileData, setProfileData] = useState({});
    const [dataUnavailable, setDataUnavailable] = useState(false);
    const stockID = useURLparam();
    const isMobile = useUserAgent();

    const { lang } = props;
    const convertByLang = (arText, enText) => (lang.langKey === 'AR' ? arText : enText);

    useEffect(() => {
        if (stockID) {
            Axios.get(marketBackEndProxyPass(), {
                params: {
                    RT: 3517,
                    SYMC: stockID,
                    L: convertByLang('A', 'E'),
                },
            })
                .then((res) => {
                    if (
                        res &&
                        res.data &&
                        res.data['Company Information'] &&
                        Array.isArray(res.data['Company Information']) &&
                        res.data['Company Information'].length > 0
                    ) {
                        let [tempCompanyInfo] = res.data['Company Information'];
                        setProfileData(tempCompanyInfo);
                    } else {
                        setDataUnavailable(true);
                    }
                })
                .catch((err) => setDataUnavailable(true));
        }
    }, [stockID]);
    const toggleShowMore = () => setShowMore(!showMore);
    const SHOW__MORE = showMore
        ? convertByLang(' اقل', 'Show Less')
        : convertByLang('المزيد', 'Show More');

    // --- dynamic classNames ---
    const firstColumn = isMobile ? 'w-100' : 'w-50';
    const propertyName = isMobile ? 'w-50' : 'w-25';
    const longDesc = isMobile ? 'w-50' : 'w-75';

    // --- Property Names ---

    const COMPANY_NAME = convertByLang('إسم الشركة', 'Company Name');
    const ESTABLISHED_DATE = convertByLang('تاريخ التأسيس', 'Established Date');
    const ADDRESS = convertByLang('العنوان', 'Address');
    const PO_BOX = convertByLang('صندوق البريد', 'P.O Box');
    const TELEPHONE = convertByLang('الهاتف', 'Telephone');
    const WEBSITE = convertByLang('الموقع الإلكترونى', 'Website');
    const CONTACT_PERSON = convertByLang('اسم مسؤول الاتصال', 'Contact person');
    const LOCAL_BRANCHES = convertByLang('عدد الفروع المحلية', 'Local branches');
    const NO_OF_EMPLOYEES = convertByLang('عدد الموظفين', 'No. of employees');
    const PRINCIPAL_ACTIVITIES = convertByLang('أغراض الشركة', 'Principal activities');
    const AUTH_SHARE_CAPITAL = convertByLang('رأس المال المصرح به', 'Authorized share capital');
    const PAID_UP_SHARE_CAPITAL = convertByLang('رأس المال المدفوع', 'Paid-up share capital');
    const NO_OF_ISSUES_SHARES = convertByLang('عدد الاسهم المصدرة', 'No. of issued shares');
    const NO_OF_SHARES_OUTSTANDING = convertByLang(
        'عدد الاسهم القائمة',
        'No. of shares outstanding'
    );
    const COMMENTS = convertByLang('ملاحظـات', 'Comments');
    const LISTING_DATE = convertByLang('تاريخ الادراج في السوق', 'Listing Date');
    const FAX_TELEFAX = convertByLang('فاكس', 'Fax / Telefax');
    const EMAIL_ADDRESS = convertByLang('عنوان البريد الالكتروني', 'Email Address');
    const CONTACT_NUMBER = convertByLang('هاتف مسؤول الاتصال', 'Contact number');
    const EXTERNAL_BRANCHES = convertByLang('عدد الفروع الخارجية', 'External branches');
    const FISCAL_YEAR = convertByLang('السنة المالية', 'Fiscal year');
    const ISSUED_SHARE_CAPITAL = convertByLang('رأس المال المصدر', 'Issued share capital');
    const SHARE_PAR_VALUE = convertByLang('القيمة الاسمية للسهم', 'Share par value');
    const NO_OF_TREASURY_SHARE = convertByLang('عدد اسهم الخزينة', 'No. of treasury share');

    // --- value types ---
    const textType = 'text';
    const dateType = 'date';
    const amountType = 'amount';
    const shareType = 'share';
    const currencyType = 'currency';

    const getValue = (property, type = textType, currency = '') => {
        if (profileData && property && (profileData[property] || profileData[property] === 0)) {
            switch (type) {
                case textType:
                    return profileData[property];
                case dateType:
                    return displayDDMonthNameYYYYFormat(profileData[property], lang);
                case amountType:
                    return formatAsCurrency(profileData[property]);
                case shareType:
                    return `${formatAsCurrency(profileData[property])} ${convertByLang(
                        'سهم',
                        'shares'
                    )}`;
                case currencyType:
                    return `${formatAsCurrency(profileData[property])} ${
                        profileData[currency] || ''
                    }`;
                default:
                    break;
            }
        } else {
            return ' -- ';
        }
    };
    return dataUnavailable ? (
        <AvailabilityDiv>
            {convertByLang('البيانات غير متاحة', 'Data Not Available')}
        </AvailabilityDiv>
    ) : (
        <div>
            <ul className="list-group list-group-flush ">
                <li className="list-group-item py-1 ">
                    <div className={''}>
                        <span className={propertyName}>{COMPANY_NAME} </span>{' '}
                        <span className={` ${longDesc} float-right`}>{getValue('NameEng')}</span>
                    </div>
                </li>
                <li className="list-group-item py-1">
                    <div className="d-flex">
                        <div className={firstColumn}>
                            <span className={propertyName}> {ESTABLISHED_DATE}</span>
                            <span className=" float-right w-50">
                                {getValue('EstablishedOn', dateType)}
                            </span>
                        </div>

                        {!isMobile ? (
                            <div className="w-50 ">
                                <span className={propertyName}>{LISTING_DATE} </span>{' '}
                                <span className=" float-right w-50">
                                    {getValue('ListingDate', dateType)}
                                </span>
                            </div>
                        ) : (
                            <React.Fragment />
                        )}
                    </div>
                </li>
                <li className="list-group-item py-1">
                    <div className={''}>
                        <span className={propertyName}>{ADDRESS}</span>
                        <span className={` ${longDesc} float-right`}>{getValue('AddressEng')}</span>
                    </div>
                </li>
                <li className="list-group-item py-1">
                    <div className={''}>
                        <span className={propertyName}>{PO_BOX}</span>
                        <span className={` ${longDesc} float-right`}>{getValue('POBoxEng')}</span>
                    </div>
                </li>
                <li className="list-group-item py-1">
                    <div className="d-flex">
                        <div className={firstColumn}>
                            <span className={propertyName}>{TELEPHONE}</span>
                            <span className=" float-right w-50">{getValue('Telephone')}</span>
                        </div>
                        {!isMobile ? (
                            <div className="w-50 ">
                                <span className={propertyName}>{FAX_TELEFAX} </span>{' '}
                                <span className=" float-right w-50">{getValue('TeleFax')}</span>
                            </div>
                        ) : (
                            <React.Fragment />
                        )}
                    </div>
                </li>
                <li className="list-group-item py-1">
                    <div className="d-flex">
                        <div className={firstColumn}>
                            <span className={propertyName}>{WEBSITE}</span>
                            <span className=" float-right w-50">
                                <a
                                    href={getValue('Website')}
                                    target="_blank"
                                    className="text-secondary"
                                >
                                    {getValue('Website')}
                                </a>
                            </span>
                        </div>
                        {!isMobile ? (
                            <div className="w-50 ">
                                <span className={propertyName}>{EMAIL_ADDRESS} </span>{' '}
                                <span className=" float-right w-50"> {getValue('EMail')}</span>
                            </div>
                        ) : (
                            <React.Fragment />
                        )}
                    </div>
                </li>
                <li className="list-group-item py-1">
                    <div className="d-flex">
                        <div className={firstColumn}>
                            <span className={propertyName}>{CONTACT_PERSON}</span>
                            <span className=" float-right w-50"> {getValue('ContactNameE')}</span>
                        </div>
                        {!isMobile ? (
                            <div className="w-50 ">
                                <span className={propertyName}>{CONTACT_NUMBER} </span>{' '}
                                <span className=" float-right w-50">
                                    {' '}
                                    {getValue('ContactPhone')}
                                </span>
                            </div>
                        ) : (
                            <React.Fragment />
                        )}
                    </div>
                </li>
                <li className="list-group-item py-1">
                    <div className="d-flex">
                        <div className={firstColumn}>
                            <span className={propertyName}>{LOCAL_BRANCHES}</span>
                            <span className=" float-right w-50 "> {getValue('LocalBranches')}</span>
                        </div>
                        {!isMobile ? (
                            <div className="w-50 ">
                                <span className={propertyName}>{EXTERNAL_BRANCHES}</span>{' '}
                                <span className=" float-right w-50">
                                    {getValue('ExternalBranches')}
                                </span>
                            </div>
                        ) : (
                            <React.Fragment />
                        )}
                    </div>
                </li>
                <li className="list-group-item py-1">
                    <div className="d-flex">
                        <div className={firstColumn}>
                            <span className={propertyName}>{NO_OF_EMPLOYEES}</span>
                            <span className=" float-right w-50">
                                {getValue('NoofEmployee', amountType)}
                            </span>
                        </div>
                        {!isMobile ? (
                            <div className="w-50 ">
                                <span className={propertyName}>{FISCAL_YEAR} </span>{' '}
                                <span className=" float-right w-50">
                                    {getValue('FiscalYearEnd')}
                                </span>
                            </div>
                        ) : (
                            <React.Fragment />
                        )}
                    </div>
                </li>
                <li className="list-group-item py-1">
                    <div className={''}>
                        <span className={propertyName}>{PRINCIPAL_ACTIVITIES}</span>
                        <span className={` ${longDesc} float-right`}>
                            {getValue('ActivitiesEng')}
                        </span>
                    </div>
                </li>
                <li className="list-group-item py-1">
                    <div className="d-flex">
                        <div className={firstColumn}>
                            <span className={propertyName}>{AUTH_SHARE_CAPITAL}</span>
                            <span className=" float-right w-50">
                                {getValue(
                                    'AuthorizedCapitalOrShare',
                                    currencyType,
                                    'AuthorizedCapitalOrShareCurrency'
                                )}
                            </span>
                        </div>
                        {!isMobile ? (
                            <div className="w-50 ">
                                <span className={propertyName}>{ISSUED_SHARE_CAPITAL} </span>{' '}
                                <span className=" float-right w-50">
                                    {getValue('IssuedShares', currencyType, 'IssuedSharesCurrency')}
                                </span>
                            </div>
                        ) : (
                            <React.Fragment />
                        )}
                    </div>
                </li>
                <li className="list-group-item py-1">
                    <div className="d-flex">
                        <div className={firstColumn}>
                            <span className={propertyName}>{PAID_UP_SHARE_CAPITAL}</span>
                            <span className=" float-right w-50">
                                {getValue('PiadUpCapital', currencyType, 'PaidUpCapitalCurrency')}
                            </span>
                        </div>
                        {!isMobile ? (
                            <div className="w-50 ">
                                <span className={propertyName}>{SHARE_PAR_VALUE} </span>{' '}
                                <span className=" float-right w-50">
                                    {getValue(
                                        'SharePerValue',
                                        currencyType,
                                        'SharePerValueCurrency'
                                    )}
                                </span>
                            </div>
                        ) : (
                            <React.Fragment />
                        )}
                    </div>
                </li>
                <li className="list-group-item py-1">
                    <div className="d-flex">
                        <div className={firstColumn}>
                            <span className={propertyName}>{NO_OF_ISSUES_SHARES}</span>
                            <span className=" float-right w-50">
                                {' '}
                                {getValue('IssuedShares', shareType)}
                            </span>
                        </div>
                        {!isMobile ? (
                            <div className="w-50 ">
                                <span className={propertyName}>{NO_OF_TREASURY_SHARE}</span>{' '}
                                <span className=" float-right w-50">
                                    {' '}
                                    {getValue('TreasuryStock', shareType)}
                                </span>
                            </div>
                        ) : (
                            <React.Fragment />
                        )}
                    </div>
                </li>
                <li className="list-group-item py-1">
                    <div className={firstColumn}>
                        <span className={propertyName}>{NO_OF_SHARES_OUTSTANDING}</span>
                        <span className=" float-right w-50">
                            {' '}
                            {getValue('SharesOutstanding', shareType)}
                        </span>
                    </div>
                </li>
                <li className="list-group-item py-1">
                    <div className={firstColumn}>
                        <span className={propertyName}>{COMMENTS}</span>
                        <span className=" float-right w-50">{getValue('Comments')}</span>
                    </div>
                </li>
                {/*  */}
                {showMore ? (
                    <React.Fragment>
                        <li className="list-group-item py-1">
                            <div>
                                <span className="w-50 ">{LISTING_DATE}</span>
                                <span className=" float-right w-50">
                                    {getValue('ListingDate', dateType)}
                                </span>
                            </div>
                        </li>
                        <li className="list-group-item py-1">
                            <div>
                                <span className="w-50 ">{FAX_TELEFAX}</span>
                                <span className=" float-right w-50">{getValue('TeleFax')}</span>
                            </div>
                        </li>
                        <li className="list-group-item py-1">
                            <div>
                                <span className="w-50 ">{EMAIL_ADDRESS}</span>
                                <span className=" float-right w-50">{getValue('EMail')}</span>
                            </div>
                        </li>
                        <li className="list-group-item py-1">
                            <div>
                                <span className="w-50 ">{CONTACT_NUMBER}</span>
                                <span className=" float-right w-50">
                                    {getValue('ContactPhone')}
                                </span>
                            </div>
                        </li>
                        <li className="list-group-item py-1">
                            <div>
                                <span className="w-50 ">{EXTERNAL_BRANCHES}</span>
                                <span className=" float-right w-50">
                                    {getValue('ExternalBranches', amountType)}
                                </span>
                            </div>
                        </li>
                        <li className="list-group-item py-1">
                            <div>
                                <span className="w-50 ">{FISCAL_YEAR}</span>
                                <span className=" float-right w-50">
                                    {getValue('FiscalYearEnd')}
                                </span>
                            </div>
                        </li>
                        <li className="list-group-item py-1">
                            <div>
                                <span className="w-50 ">{ISSUED_SHARE_CAPITAL}</span>
                                <span className=" float-right w-50">
                                    {getValue('IssuedShares', currencyType, 'IssuedSharesCurrency')}
                                </span>
                            </div>
                        </li>
                        <li className="list-group-item py-1">
                            <div>
                                <span className="w-50 ">{SHARE_PAR_VALUE}</span>
                                <span className=" float-right w-50">
                                    {getValue(
                                        'SharePerValue',
                                        currencyType,
                                        'SharePerValueCurrency'
                                    )}
                                </span>
                            </div>
                        </li>
                        <li className="list-group-item py-1">
                            <div>
                                <span className="w-50 ">{NO_OF_TREASURY_SHARE}</span>
                                <span className=" float-right w-50">
                                    {getValue('TreasuryStock', shareType)}
                                </span>
                            </div>
                        </li>
                    </React.Fragment>
                ) : (
                    <React.Fragment />
                )}
            </ul>
            {isMobile ? (
                <button type="button" class="btn btn-link" onClick={() => toggleShowMore()}>
                    {SHOW__MORE}
                </button>
            ) : (
                <React.Fragment />
            )}
        </div>
    );
};
