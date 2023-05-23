import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { ADMIN_FUNCTION_ALLOWED } from '../../config/constants';
import moment from 'moment';
import DataTable from 'react-data-table-component';
import { BsChevronRight, BsDownload } from 'react-icons/bs';
import toast, { Toaster } from 'react-hot-toast';
import { AdminAuthorizationText } from '../Common/AdminAuthorizationText';

let now = new Date();
let day = ('0' + now.getDate()).slice(-2);
let month = ('0' + (now.getMonth() + 1)).slice(-2);
let today = now.getFullYear() + '-' + month + '-' + day;
let startofMonth = now.getFullYear() + '-' + month + '-01';

const convertArrayOfObjectsToCSV = (array) => {
    let result;

    const columnDelimiter = ',';
    const lineDelimiter = '\n';
    const keys = [
        'reference_number',
        'name',
        'relative_name',
        'date_of_death',
        'passport_no',
        'aqama_no',
        'place_of_death',
        'reason_of_death',
        'burial_place',
        'category',
        'submit_time',
        'status',
        'workflow',
        'assigned_user',
    ];

    result = '';
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    array.forEach((item) => {
        let ctr = 0;
        keys.forEach((key) => {
            if (ctr > 0) result += columnDelimiter;

            result += item[key];

            ctr++;
        });
        result += lineDelimiter;
    });

    return result;
};

const downloadCSV = (array) => {
    const link = document.createElement('a');
    let csv = convertArrayOfObjectsToCSV(array);
    if (csv == null) return;

    const filename = 'DeathNOCReport.csv';

    if (!csv.match(/^data:text\/csv/i)) {
        csv = `data:text/csv;charset=utf-8,${csv}`;
    }

    link.setAttribute('href', encodeURI(csv));
    link.setAttribute('download', filename);
    link.click();
};

const Export = ({ onExport }) => (
    <button className="btn btn-dark" onClick={(e) => onExport(e.target.value)}>Export&nbsp;<BsDownload size={10} /></button>
);

export const DeathNOCReport = (props) => {
    const { lang } = props;
    const [loading, setLoading] = useState(true);
    const [authorize, setAuthorize] = useState(false);
    const [places_Data, setPlaces_Data] = useState([]);
    const [reason_Data, setReason_Data] = useState([]);
    const [filteredItems, setfilteredItems] = useState([]);
    const [data, setdata] = useState({
        from_date: startofMonth,
        to_date: today,
        name: '',
        aqama_no: '',
        passport_no: '',
        status: 'all',
        place_of_death: 'all',
        reason_of_death: 'all',
        burial_place: 'all'
    });

    const actionsMemo = React.useMemo(
        () => {
            if (filteredItems.length > 0) {
                return <Export onExport={() => downloadCSV(filteredItems)} />
            }
            else {
                return '';
            }
        },
        [filteredItems]
    );

    useEffect(() => {
        setLoading(true);
        setAuthorize(ADMIN_FUNCTION_ALLOWED);
        setLoading(false);
        Axios.get('/api/reason_of_death', {}).then((res) => {
            // console.log(res);
            let ary = [];
            if (res.data.Result_data) {
                res.data.Result_data.forEach((row) => {
                    ary.push(row);
                });
                // console.log('--ary--setReason_Data');
                // console.log(ary);
                setReason_Data(ary);
            } else {
                // console.log('--empty--');
                setReason_Data([]);
            }
        });
        Axios.get('/api/place_of_death', {}).then((res) => {
            // console.log(res);
            let ary = [];
            if (res.data.Result_data) {
                res.data.Result_data.forEach((row) => {
                    ary.push(row);
                });
                // console.log('--ary--setPlaces_Data');
                // console.log(ary);
                setPlaces_Data(ary);
            } else {
                // console.log('--empty--');
                setPlaces_Data([]);
            }
        });
    }, []);
    const clearInputs = () => {
        setdata({
            from_date: startofMonth,
            to_date: today,
            name: '',
            aqama_no: '',
            passport_no: '',
            status: 'all',
            place_of_death: 'all',
            reason_of_death: 'all',
            burial_place: 'all'
        });
    };

    const collectData = (e) => {
        setdata({ ...data, [e.target.id]: e.target.value });
    };

    const fetch = (e) => {
        e.preventDefault();

        Axios.get('/getCSRFToken').then((response) => {

            if (response.data.csrfToken) {
                Axios.post(
                    '/api/death_noc_report',
                    {
                        ...data
                    },
                    {
                        headers: {
                            'x-xsrf-token': response.data.csrfToken,
                        },
                    }
                ).then((res) => {
                    // console.log(res);
                    if (res.data.find_data && res.data.find_data.length > 0) {
                        setfilteredItems(res.data.find_data);
                    }
                    else {
                        toast.error('No data found based on selected filter criteria');
                    }
                });
            }
        });
    };

    const columns = [
        {
            name: 'Ref. No.',
            selector: (row) => row.reference_number,
            sortable: true,
        },
        {
            name: 'Submission Date',
            selector: (row) =>
                row.submit_time != undefined
                    ? moment(row.submit_time).format('DD-MM-YYYY hh:mm A')
                    : '',
            sortable: true,
            width: '200px',
        },
        {
            name: 'Name',
            selector: (row) => row.name,
            sortable: true,
        },
        {
            name: 'Relative Name',
            selector: (row) => row.relative_name,
            sortable: true,
        },
        {
            name: 'Date of Death',
            selector: (row) => row.date_of_death,
            sortable: true,
        },
        {
            name: 'Passport No.',
            selector: (row) => row.passport_no,
            sortable: true,
        },
        {
            name: 'Aqama No.',
            selector: (row) => row.aqama_no,
            sortable: true,
        },
        {
            name: 'Place of Death',
            selector: (row) => row.place_of_death,
            sortable: true,
        },
        {
            name: 'Reason of Death',
            selector: (row) => row.reason_of_death,
            sortable: true,
        },
        {
            name: 'Burial Place',
            selector: (row) => row.burial_place,
            sortable: true,
        },
        {
            cell: (row) => (
                <a className='mx-2' href={'/' + lang.langKey + '/submitted-application#' + row._id}>
                    <button className="btn btn-sm btn-primary" type='button'>Details&nbsp;<BsChevronRight size={10} /></button>
                </a>
            ),
            width: '100px',
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    return (
        <div style={{ display: loading ? 'none' : 'block' }}>
            <Toaster
                position="top-center"
                reverseOrder={false}
                toastOptions={{
                    duration: 5000,
                }}
            />

            {authorize ? (
                <div>
                    <form
                        onSubmit={fetch}
                        style={{ borderRadius: '10px' }}
                        className="row border col-md-12 m-2 p-3"
                    >
                        <div className="form-group col-md-4 row">
                            <label className="col-sm-6 col-form-label text-right">Date of Death From</label>
                            <div className='col-sm-6'>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="from_date"
                                    value={data.from_date}
                                    onChange={collectData}
                                />
                            </div>
                        </div>
                        <div className="form-group col-md-4 row">
                            <label className="col-sm-6 col-form-label text-right">Date of Death To</label>
                            <div className='col-sm-6'>
                                <input
                                    type="date"
                                    className="form-control"
                                    id="to_date"
                                    value={data.to_date}
                                    onChange={collectData}
                                />
                            </div>
                        </div>
                        <div className="col-md-4"></div>

                        <div className="form-group col-md-4 row">
                            <label className="col-sm-6 col-form-label text-right">Name</label>
                            <div className='col-sm-6'>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="name"
                                    value={data.name}
                                    onChange={collectData}
                                />
                            </div>
                        </div>
                        <div className="form-group col-md-4 row">
                            <label className="col-sm-6 col-form-label text-right">Aqama No.</label>
                            <div className='col-sm-6'>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="aqama_no"
                                    value={data.aqama_no}
                                    onChange={collectData}
                                />
                            </div>
                        </div>
                        <div className="form-group col-md-4 row">
                            <label className="col-sm-6 col-form-label text-right">Passport No.</label>
                            <div className='col-sm-6'>
                                <input
                                    type="text"
                                    className="form-control"
                                    id="passport_no"
                                    value={data.passport_no}
                                    onChange={collectData}
                                />
                            </div>
                        </div>

                        <div className="form-group col-md-4 row">
                            <label htmlFor="place_of_death" className="col-sm-6 col-form-label text-right">
                                Place of Death
                            </label>
                            <div className='col-sm-6'>
                                <select
                                    className="form-control"
                                    id="place_of_death"
                                    onChange={collectData}
                                    value={data.place_of_death}
                                >

                                    <option value="all">All</option>
                                    {places_Data &&
                                        places_Data.map((item, index) => {
                                            return <option value={item}>{item}</option>;
                                        })}
                                </select>
                            </div>
                        </div>
                        <div className="form-group col-md-4 row">
                            <label htmlFor="reason_of_death" className="col-sm-6 col-form-label text-right">
                                Reason Of Death
                            </label>
                            <div className='col-sm-6'>
                                <select
                                    className="form-control"
                                    id="reason_of_death"
                                    onChange={collectData}
                                    value={data.reason_of_death}
                                >

                                    <option value="all">All</option>
                                    {reason_Data &&
                                        reason_Data.map((item, index) => {
                                            return <option value={item}>{item}</option>;
                                        })}
                                </select>
                            </div>
                        </div>
                        <div className="form-group col-md-4 row">
                            <label htmlFor="burial_place" className="col-sm-6 col-form-label text-right">
                                Burial Place
                            </label>
                            <div className='col-sm-6'>
                                <select
                                    className="form-control"
                                    id="burial_place"
                                    onChange={collectData}
                                    value={data.burial_place}
                                >
                                    <option value="all">All</option>
                                    <option value="Local">KSA</option>
                                    <option value="Transportation">Pakistan</option>
                                </select>
                            </div>
                        </div>

                        <div className="form-group col-md-4 row">
                            <label htmlFor="status" className="col-sm-6 col-form-label text-right">
                                Status
                            </label>
                            <div className='col-sm-6'>
                                <select
                                    className="form-control"
                                    id="status"
                                    onChange={collectData}
                                    value={data.status}
                                >
                                    <option value="all">All</option>
                                    <option value="new">New</option>
                                    <option value="open">Open</option>
                                    <option value="review">Review</option>
                                    <option value="rejected">Rejected</option>
                                    <option value="approved">Approved</option>
                                </select>
                            </div>
                        </div>
                        <div className="col-md-12">
                            <button
                                type="submit"
                                className="btn btn-success float-right"
                            >
                                Fetch Report
                            </button>
                            <button
                                className="btn btn-outline-secondary mr-4 float-right"
                                onClick={clearInputs}
                                type="button"
                            >
                                Clear Filters
                            </button>
                        </div>
                    </form>
                    <DataTable
                        striped
                        pagination
                        columns={columns}
                        data={filteredItems}
                        actions={actionsMemo}
                    />
                </div>
            ) : (
                <AdminAuthorizationText langKey={lang.langKey} />
            )}
        </div>
    );
};
