import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { ADMIN_FUNCTION_ALLOWED } from '../../config/constants';
import { AdminAuthorizationText } from '../Common/AdminAuthorizationText';
import moment from 'moment';
import { BsChevronRight, BsDownload } from 'react-icons/bs';
import DataTable from 'react-data-table-component';
import { MdClear } from 'react-icons/md';
import Cookies from 'universal-cookie/es6';
import { ADMIN_LOGIN_ID_COOKIE } from '../../config/constants';

const FilterComponent = ({ filterText, onFilter, onClear }) => (
    <div className="input-group col-md-3">
        <input
            type="text"
            className="form-control"
            placeholder="Search"
            value={filterText}
            onChange={onFilter}
        />
        <div className="input-group-append">
            <button className="btn btn-sm btn-primary" onClick={onClear} type="button">
                <MdClear size={25} />
            </button>
        </div>
    </div>
);

const convertArrayOfObjectsToCSV = (array) => {
    let result;

    const columnDelimiter = ',';
    const lineDelimiter = '\n';
    const keys = [
        'voucher_number',
        'category.category_name',
        'application_reference_number',
        'submit_user.first_name',
        'submit_user.last_name',
        'creation_date',
        'is_paid'
    ];

    result = '';
    result += keys.join(columnDelimiter);
    result += lineDelimiter;

    array.forEach((item) => {
        let ctr = 0;
        keys.forEach((key) => {
            if (ctr > 0) result += columnDelimiter;
            if (key.indexOf('.') != -1) {
                var keyParts = key.split(".");
                result += item[keyParts[0]][keyParts[1]];
            }
            else {
                result += item[key];
            }

            ctr++;
        });
        result += lineDelimiter;
    });

    return result;
};

const Export = ({ onExport }) => (
    <button className="btn btn-dark mr-4" onClick={(e) => onExport(e.target.value)}>
        Export&nbsp;
        <BsDownload size={10} />
    </button>
);

export const VouchersListing = (props) => {
    const { lang } = props;
    const [loading, setLoading] = useState(true);
    const [authorize, setAuthorize] = useState(false);
    const [vouchersData, setVouchersData] = useState([]);
    const [filterText, setFilterText] = React.useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false);
    const cookies = new Cookies();
    let login_cookie = cookies.get(ADMIN_LOGIN_ID_COOKIE);
    const [rolePermissions, setRolePermissions] = useState([]);

    const actionsMemo = React.useMemo(() => {
        const downloadCSV = () => {
            const filteredItems = vouchersData.filter(
                (item) =>
                    (item.submit_user.first_name &&
                        item.submit_user.first_name.toLowerCase().includes(filterText.toLowerCase())) ||
                    item.submit_user.last_name.toLowerCase().includes(filterText.toLowerCase()) ||
                    item.category.category_name.toLowerCase().includes(filterText.toLowerCase()) ||
                    item.application_reference_number.toString().includes(filterText.toString()) ||
                    item.voucher_number.toString().includes(filterText.toString())
            );

            const link = document.createElement('a');
            let csv = convertArrayOfObjectsToCSV(filteredItems);
            if (csv == null) return;

            const filename = 'vouchers.csv';

            if (!csv.match(/^data:text\/csv/i)) {
                csv = `data:text/csv;charset=utf-8,${csv}`;
            }

            link.setAttribute('href', encodeURI(csv));
            link.setAttribute('download', filename);
            link.click();
        };

        return <Export onExport={downloadCSV} />;
    }, [vouchersData, filterText]);

    useEffect(() => {
        setLoading(true);
        setAuthorize(ADMIN_FUNCTION_ALLOWED);
        setLoading(false);
        show();
        Axios.get('/api/eop_check_role_permission/' + login_cookie, {}).then((res) => {
            let ary = [];
            if (res.data.permission_data) {
                res.data.permission_data.forEach((row) => {
                    ary.push(row);
                });
                setRolePermissions(ary);
            } else {
                setRolePermissions([]);
            }
        });
    }, []);

    const show = () => {
        Axios.get('/api/eop_voucher_list', {}).then((res) => {
            console.log('--res--');
            console.log(res);
            console.log('--res.data--');
            console.log(res.data);
            setVouchersData(res.data.find_data);
        });
    };

    const columns = [
        {
            name: 'Voucher Number',
            selector: (row) => (row.voucher_number ? row.voucher_number : ''),
            sortable: true,
        },
        {
            name: 'Category',
            selector: (row) => (row.category ? row.category.category_name : ''),
            sortable: true,
        },
        {
            name: 'Application Reference',
            selector: (row) =>
                row.application_reference_number ? row.application_reference_number : '',
            sortable: true,
        },
        {
            name: 'Applicant Name',
            selector: (row) =>
                row.submit_user ? row.submit_user.first_name + ' ' + row.submit_user.last_name : '',
            sortable: true,
        },
        {
            name: 'Creation Date',
            selector: (row) =>
                row.creation_date ? moment(row.creation_date).format('DD-MM-YYYY hh:mm A') : '',
            sortable: true,
        },
        {
            name: 'Payment Status',
            selector: (row) => (row.is_paid ? (row.is_paid === 'Y' ? 'Paid' : 'UnPaid') : ''),
            sortable: true,
        },
        {
            cell: (row) =>
                rolePermissions.find(
                    (x) => x.role_permissions.resource_id === '62f4a40f38720939db01968d'
                ) ? (
                    <a
                        className="btn btn-sm btn-primary"
                        href={'/' + lang.langKey + '/voucher_details#' + row._id}
                    >
                        Details&nbsp;<BsChevronRight size={15} />
                    </a>
                ) : (
                    ''
                ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    const filteredItems = vouchersData.filter(
        (item) =>
            (item.submit_user.first_name &&
                item.submit_user.first_name.toLowerCase().includes(filterText.toLowerCase())) ||
            item.submit_user.last_name.toLowerCase().includes(filterText.toLowerCase()) ||
            item.category.category_name.toLowerCase().includes(filterText.toLowerCase()) ||
            item.application_reference_number.toString().includes(filterText.toString()) ||
            item.voucher_number.toString().includes(filterText.toString())
    );
    const filterMemo = React.useMemo(() => {
        const handleClear = () => {
            if (filterText) {
                setResetPaginationToggle(!resetPaginationToggle);
                setFilterText('');
            }
        };

        return (
            <FilterComponent
                onFilter={(e) => setFilterText(e.target.value)}
                onClear={handleClear}
                filterText={filterText}
            />
        );
    }, [filterText, resetPaginationToggle]);

    return (
        <div style={{ display: loading ? 'none' : 'block' }}>
            {authorize ? (
                <div>
                    <DataTable
                        striped
                        pagination
                        columns={columns}
                        data={filteredItems}
                        paginationResetDefaultPage={resetPaginationToggle}
                        subHeader
                        subHeaderComponent={filterMemo}
                        actions={actionsMemo}
                    />
                </div>
            ) : (
                <div>
                    <AdminAuthorizationText langKey={lang.langKey} />
                </div>
            )}
        </div>
    );
};
