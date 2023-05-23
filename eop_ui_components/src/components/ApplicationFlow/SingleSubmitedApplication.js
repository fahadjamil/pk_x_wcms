import React, { useEffect, useState, useRef } from 'react';
import Axios from 'axios';
import { ADMIN_FUNCTION_ALLOWED, ADMIN_NAME_COOKIE } from '../../config/constants';
import Cookies from 'universal-cookie/es6';

import { GrDocumentPdf, GrPrint } from 'react-icons/gr';
import moment from 'moment';
import { AdminAuthorizationText } from '../Common/AdminAuthorizationText';
import { useReactToPrint } from 'react-to-print';
import { TemplateNOC } from '../Common/templates/TemplateNOC';
import { BsChevronRight } from 'react-icons/bs';

export const SingleSubmitedApplication = (props) => {
    const { lang } = props;
    const [loading, setLoading] = useState(true);
    const [authorize, setAuthorize] = useState(false);
    const [applicationData, setApplicationData] = useState('');

    const cookies = new Cookies();
    let userName = cookies.get(ADMIN_NAME_COOKIE);

    const appDetailRef = useRef();
    const handleApplicationPrint = useReactToPrint({
        content: () => appDetailRef.current,
    });

    const printTemplateRef = useRef();
    const handleNOCPrint = useReactToPrint({
        content: () => printTemplateRef.current,
    });

    useEffect(() => {
        setLoading(true);
        setAuthorize(ADMIN_FUNCTION_ALLOWED);
        setLoading(false);
        show();
    }, []);

    const show = () => {
        let hashValue = window.location.hash;

        let tempID = hashValue.substring(1);
        console.log('Param id value');
        console.log(tempID);
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
    };
    console.log(applicationData);

    return (
        <div style={{ display: loading ? 'none' : 'block' }}>
            {authorize ? (
                <div>
                    {applicationData ? (
                        <div>
                            <div className="text-right">
                                <button
                                    type="button"
                                    className="btn btn-lg btn-primary m-4"
                                    onClick={handleApplicationPrint}
                                >
                                    <GrPrint size={30} />
                                    &nbsp;Print
                                </button>
                            </div>

                            <div ref={appDetailRef} className="mt-5">
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
                                    {applicationData[0] && applicationData[0].voucher ? (
                                        <div className="col-md-6">
                                            <p>
                                                <strong>Voucher. No.:</strong>&nbsp;
                                                {applicationData[0].voucher.voucher_number}
                                                <a
                                                    className="mx-2"
                                                    href={
                                                        '/' +
                                                        lang.langKey +
                                                        '/voucher_details#' +
                                                        applicationData[0].voucher._id
                                                    }
                                                >
                                                    <button
                                                        className="btn btn-primary float-right mt-4 mx-2"
                                                        type="button"
                                                    >
                                                        Voucher Details&nbsp;
                                                        <BsChevronRight size={15} />
                                                    </button>
                                                </a>
                                            </p>
                                            <p>
                                                <strong>Amount:</strong>&nbsp;
                                                {applicationData[0].voucher.amount}&nbsp;SAR
                                            </p>
                                            <p>
                                                <strong>Payment Status:</strong>&nbsp;
                                                {applicationData[0].voucher.is_paid === 'Y'
                                                    ? 'Paid'
                                                    : 'Unpaid'}
                                            </p>
                                            <p>
                                                <strong>Voucher Creation Date:</strong>&nbsp;
                                                {moment(
                                                    applicationData[0].voucher.creation_date
                                                ).format('DD-MM-YYYY hh:mm A')}
                                            </p>
                                        </div>
                                    ) : (
                                        ''
                                    )}
                                </div>
                                <h3 className="mt-5">Application Details:</h3>
                                <hr />
                                <div className="row mt-0 pt-0">
                                    {applicationData[0].documents &&
                                        applicationData[0].documents.map((data, index) => {
                                            let item = applicationData[0].items.find(
                                                (x) => x.item_id === data._id
                                            );
                                            return data.item_type != 'file' ? (
                                                <div className="col-md-5 m-2">
                                                    <strong>{data.item_name}</strong>:
                                                    {item.enable_arabic ? (
                                                        <div>
                                                            <div>{item.data.en}</div>
                                                            <div dir="rtl">{item.data.ar}</div>
                                                        </div>
                                                    ) : item.data.en ? (
                                                        item.data.en
                                                    ) : item.data ? (
                                                        item.data
                                                    ) : (
                                                        ''
                                                    )}
                                                </div>
                                            ) : (
                                                ''
                                            );
                                        })}
                                </div>
                                {applicationData[0].documents ? (
                                    <div>
                                        <h3 className="mt-5">Attached Documents:</h3>
                                        <hr />
                                        <div className="row mt-0 pt-0">
                                            {applicationData[0].documents &&
                                                applicationData[0].documents.map((data, index) => {
                                                    let document = applicationData[0].items.find(
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
                                                                    ? document.data.file_name
                                                                    : ''
                                                                    }`}
                                                                target="_blank"
                                                            >
                                                                {document.data.file_name
                                                                    .split('.')
                                                                    .pop() == 'pdf' ? (
                                                                    <GrDocumentPdf size={80} />
                                                                ) : (
                                                                    <img
                                                                        src={`/api/eop_application_document/${document
                                                                            ? document.data
                                                                                .file_name
                                                                            : ''
                                                                            }`}
                                                                        alt="Image"
                                                                        height="100"
                                                                    />
                                                                )}
                                                            </a>
                                                        </div>
                                                    ) : (
                                                        ''
                                                    );
                                                })}
                                        </div>
                                    </div>
                                ) : (
                                    ''
                                )}
                            </div>

                            {applicationData[0].category[0].category_name ==
                                'NOC - Death Certificate' ? (
                                <div>
                                    <h3>NOC Print Preview</h3>
                                    <hr />
                                    <div className="text-right">
                                        <button
                                            type="button"
                                            className="btn btn-lg btn-primary m-4"
                                            onClick={handleNOCPrint}
                                        >
                                            <GrPrint size={30} />
                                            &nbsp;Print NOC
                                        </button>
                                    </div>

                                    <TemplateNOC
                                        nocData={{
                                            noc_id_en: applicationData[0].reference_number,
                                            noc_id_ar:
                                                applicationData[0].reference_number.toLocaleString(
                                                    'ar-SA',
                                                    {
                                                        useGrouping: false,
                                                        maximumSignificantDigits: 10,
                                                    }
                                                ),
                                            noc_year_en: moment(
                                                applicationData[0].items.find(
                                                    (i) => i.item_id === '6293d75c35aef500115646b6'
                                                ).data.en,
                                                'YYYY-MM-DD'
                                            ).format('YYYY'),
                                            noc_year_ar: Number(
                                                moment(
                                                    applicationData[0].items.find(
                                                        (i) =>
                                                            i.item_id === '6293d75c35aef500115646b6'
                                                    ).data.en,
                                                    'YYYY-MM-DD'
                                                ).format('YYYY')
                                            ).toLocaleString('ar-SA', {
                                                useGrouping: false,
                                            }),
                                            noc_date_en: moment(
                                                applicationData[0].items.find(
                                                    (i) => i.item_id === '6293d75c35aef500115646b6'
                                                ).data.en,
                                                'YYYY-MM-DD'
                                            ).format('DD/MM/YYYY'),
                                            noc_date_ar: applicationData[0].items.find(
                                                (i) => i.item_id === '6293d75c35aef500115646b6'
                                            ).data.ar,
                                            noc_burial_type: applicationData[0].items.find(
                                                (i) => i.item_id === '6293d75c35aef500115646ab'
                                            ).data,
                                            noc_deceased_name_en: applicationData[0].items.find(
                                                (i) => i.item_id === '6293d75c35aef500115646ac'
                                            ).data.en,
                                            noc_deceased_name_ar: applicationData[0].items.find(
                                                (i) => i.item_id === '6293d75c35aef500115646ac'
                                            ).data.ar,
                                            noc_relative_name_en: applicationData[0].items.find(
                                                (i) => i.item_id === '6293d75c35aef500115646ad'
                                            ).data.en,
                                            noc_relative_name_ar: applicationData[0].items.find(
                                                (i) => i.item_id === '6293d75c35aef500115646ad'
                                            ).data.ar,
                                            noc_relation: applicationData[0].items.find(
                                                (i) => i.item_id === '62af0d74d22380001291d334'
                                            ).data,
                                            noc_passportno_en: applicationData[0].items.find(
                                                (i) => i.item_id === '6293d75c35aef500115646ae'
                                            ).data.en,
                                            noc_passportno_ar: applicationData[0].items.find(
                                                (i) => i.item_id === '6293d75c35aef500115646ae'
                                            ).data.ar,
                                            noc_passportissuedate_en: moment(
                                                applicationData[0].items.find(
                                                    (i) => i.item_id === '6293d75c35aef500115646af'
                                                ).data.en,
                                                'YYYY-MM-DD'
                                            ).format('DD/MM/YYYY'),
                                            noc_passportissuedate_ar: applicationData[0].items.find(
                                                (i) => i.item_id === '6293d75c35aef500115646af'
                                            ).data.ar,
                                            noc_dateofdeath_en: moment(
                                                applicationData[0].items.find(
                                                    (i) => i.item_id === '6293d75c35aef500115646b2'
                                                ).data.en,
                                                'YYYY-MM-DD'
                                            ).format('DD/MM/YYYY'),
                                            noc_dateofdeath_ar: applicationData[0].items.find(
                                                (i) => i.item_id === '6293d75c35aef500115646b2'
                                            ).data.ar,
                                            noc_reasonofdeath_en: applicationData[0].items.find(
                                                (i) => i.item_id === '6293d75c35aef500115646b4'
                                            ).data.en,
                                            noc_reasonofdeath_ar: applicationData[0].items.find(
                                                (i) => i.item_id === '6293d75c35aef500115646b4'
                                            ).data.ar,
                                            noc_placeofdeath_en: applicationData[0].items.find(
                                                (i) => i.item_id === '6293d75c35aef500115646b3'
                                            ).data.en,
                                            noc_placeofdeath_ar: applicationData[0].items.find(
                                                (i) => i.item_id === '6293d75c35aef500115646b3'
                                            ).data.ar,
                                            noc_employername_en: applicationData[0].items.find(
                                                (i) => i.item_id === '6293d75c35aef500115646b7'
                                            ).data.en,
                                            noc_employername_ar: applicationData[0].items.find(
                                                (i) => i.item_id === '6293d75c35aef500115646b7'
                                            ).data.ar,
                                            noc_addressinpakistan_en: applicationData[0].items.find(
                                                (i) => i.item_id === '6293d75c35aef500115646b5'
                                            ).data.en,
                                            noc_addressinpakistan_ar: applicationData[0].items.find(
                                                (i) => i.item_id === '6293d75c35aef500115646b5'
                                            ).data.ar,
                                            noc_custodianname_ar: applicationData[0].items.find(
                                                (i) => i.item_id === '6293d75c35aef500115646b8'
                                            ).data.ar,
                                            noc_custodianiqamano_ar: applicationData[0].items.find(
                                                (i) => i.item_id === '6293d75c35aef500115646b9'
                                            ).data.ar,
                                            noc_custodianmobile_ar: applicationData[0].items.find(
                                                (i) => i.item_id === '6293d75c35aef500115646ba'
                                            ).data.ar,
                                            noc_printedby: userName,
                                        }}
                                        // style={{ display: 'none' }}
                                        ref={printTemplateRef}
                                    />
                                </div>
                            ) : (
                                ''
                            )}
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
