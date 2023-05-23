import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { eopUpdateCategory } from '../../config/path';
import { FaEdit } from 'react-icons/fa';
import { MdClear } from 'react-icons/md';
import { AiFillDelete } from 'react-icons/ai';
import { eopShowCategories } from '../../config/path';
import { ADMIN_FUNCTION_ALLOWED } from '../../config/constants';
import Cookies from 'universal-cookie/es6';
import { ADMIN_LOGIN_ID_COOKIE } from '../../config/constants';
import toast, { Toaster } from 'react-hot-toast';
import DataTable from 'react-data-table-component';
import { AdminAuthorizationText } from '../Common/AdminAuthorizationText';
import { BsDownload } from 'react-icons/bs';

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
            <button
                className="btn btn-sm btn-primary"
                onClick={onClear}
                type="button"
            >
                <MdClear size={25} />
            </button>
        </div>
    </div>
);
const convertArrayOfObjectsToCSV = (array) => {
    let result;

    const columnDelimiter = ',';
    const lineDelimiter = '\n';
    const keys = ['_id', 'category_name', 'category_description', 'is_enabled'];

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

const Export = ({ onExport }) => (
    <button className="btn btn-dark mr-4" onClick={(e) => onExport(e.target.value)}>
        Export&nbsp;<BsDownload size={10} />
    </button>
);

export const ShowCategory = (props) => {
    const { lang } = props;
    const [loading, setLoading] = useState(true);
    const [authorize, setAuthorize] = useState(false);
    console.log(lang);
    const cookies = new Cookies();
    let login_cookie = cookies.get(ADMIN_LOGIN_ID_COOKIE);
    const [rolePermissions, setRolePermissions] = useState([]);
    const convertByLang = (arText, enText) => (lang.langKey === 'AR' ? arText : enText);
    const [categorysuccess, setCategorySuccess] = useState('');
    const [error, setError] = useState('');
    const [categoriesData, setCategoriesData] = useState([]);
    const [filterText, setFilterText] = React.useState('');
    const [resetPaginationToggle, setResetPaginationToggle] = React.useState(false);

    const deleteRecord = (value) => {
        console.log('deleted value id');
        console.log(value);
        Axios.get('/getCSRFToken').then((response) => {

            if (response.data.csrfToken) {
                Axios.post(
                    eopUpdateCategory(),
                    {
                        id: value,
                        is_deleted: 'Y',
                    },
                    {
                        headers: {
                            'x-xsrf-token': response.data.csrfToken,
                        },
                    }
                ).then((res) => {
                    console.log(res);
                    if (res.data.status == 'success') {
                        toast.success(res.data.message);
                        setCategorySuccess(convertByLang(res.data.message_ar, res.data.message));
                        show();
                    } else {
                        toast.error(res.data.message);
                        setError(convertByLang(res.data.message_ar, res.data.message));
                    }
                });
            }
        });
    };

    const actionsMemo = React.useMemo(() => {
        const downloadCSV = () => {

            const filteredItems = categoriesData.filter(
                (item) =>
                    item.category_name &&
                    item.category_name.toLowerCase().includes(filterText.toLowerCase())
            );

            const link = document.createElement('a');
            let csv = convertArrayOfObjectsToCSV(filteredItems);
            if (csv == null) return;

            const filename = 'export.csv';

            if (!csv.match(/^data:text\/csv/i)) {
                csv = `data:text/csv;charset=utf-8,${csv}`;
            }

            link.setAttribute('href', encodeURI(csv));
            link.setAttribute('download', filename);
            link.click();
        };

        return <Export onExport={downloadCSV} />;
    }, [categoriesData, filterText]);

    useEffect(() => {
        setLoading(true);
        setAuthorize(ADMIN_FUNCTION_ALLOWED);
        setLoading(false);
        // login_cookie = '61dd5fa5af785000138209d6';
        Axios.get('/api/eop_check_role_permission/' + login_cookie, {}).then((res) => {
            let ary = [];
            if (res.data.permission_data) {
                res.data.permission_data.forEach((row) => {
                    ary.push(row);
                });
                setRolePermissions(ary);

                Axios.get('/api/eop_show_categories_admin').then((res) => {
                    console.log('--res--');
                    console.log(res);
                    let ary = [];
                    if (res.data.user_data.showCategories) {
                        res.data.user_data.showCategories.forEach((row) => {
                            ary.push(row);
                        });
                        console.log('--ary--setCategoriesData');
                        console.log(ary);
                        setCategoriesData(ary);
                    } else {
                        console.log('--empty--');
                        setCategoriesData([]);
                    }
                });
            } else {
                setRolePermissions([]);
            }
        });
    }, []);

    const columns = [
        {
            name: 'Category Name',
            cell: (row) => row.category_name,
            sortable: true,
        },
        {
            name: 'Category Description',
            cell: (row) => row.category_description,
            sortable: true,
        },
        {
            name: 'Status',
            selector: (row) => row.is_enabled ? 'Enabled' : 'Disabled',
            sortable: true,
        },
        {
            cell: (row) => (
                <span>
                    {
                        rolePermissions.find(
                            (x) => x.role_permissions.resource_id === '62498ff9c8f16c48984a28ac'
                        ) ? (

                            <a
                                className="btn btn-primary"
                                href={'/' + lang.langKey + '/update-category#' + row._id}
                            >
                                <FaEdit size={25} />
                            </a>
                        ) : ''
                    }
                </span>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
        {
            cell: (row) => (
                <span>
                    {
                        rolePermissions.find(
                            (x) => x.role_permissions.resource_id === '62499059c8f16c48984a297c'
                        ) ? (

                            <button
                                className="btn btn-danger"
                                onClick={() => {
                                    if (window.confirm('Are you sure you wish to delete this category?')) {
                                        deleteRecord(row._id);
                                    }
                                }}
                            >
                                <AiFillDelete size={25} />
                            </button>
                        ) : ''
                    }
                </span>
            ),
            ignoreRowClick: true,
            allowOverflow: true,
            button: true,
        },
    ];

    const filteredItems = categoriesData.filter(
        (item) =>
            item.category_name &&
            item.category_name.toLowerCase().includes(filterText.toLowerCase()) ||
            item.category_description.toLowerCase().includes(filterText.toLowerCase())
    );

    const subHeaderComponentMemo = React.useMemo(() => {
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
            <Toaster
                position="top-center"
                reverseOrder={false}
                toastOptions={{
                    duration: 5000,
                }}
            />
            {authorize ? (
                <div>
                    {rolePermissions.find(
                        (x) => x.role_permissions.resource_id === '62498fd6c8f16c48984a285f'
                    ) ? (
                        <a
                            className="input-group-btn btn btn-primary float-right mb-2 mr-2"
                            href={'/' + lang.langKey + '/add-category'}
                        >
                            Add Category
                        </a>
                    ) : (
                        ''
                    )}
                    <DataTable
                        columns={columns}
                        data={filteredItems}
                        striped
                        pagination
                        defaultSortField="category_name"
                        defaultSortAsc={true}
                        paginationResetDefaultPage={resetPaginationToggle}
                        subHeader
                        subHeaderComponent={subHeaderComponentMemo}
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
