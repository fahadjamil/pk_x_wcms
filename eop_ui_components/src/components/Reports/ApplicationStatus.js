import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { cssBarChart } from '../../config/path';
import { ADMIN_FUNCTION_ALLOWED } from '../../config/constants';
import DataTable from 'react-data-table-component';
import { AdminAuthorizationText } from '../Common/AdminAuthorizationText';
import { BsDownload } from 'react-icons/bs';

const convertArrayOfObjectsToCSV = (array) => {
    let result;

    const columnDelimiter = ',';
    const lineDelimiter = '\n';
    const keys = ['category', 'pending', 'processing', 'completed', 'open', 'new', 'total'];

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
    console.log('filteredItems');
    console.log(array);
    const link = document.createElement('a');
    let csv = convertArrayOfObjectsToCSV(array);
    if (csv == null) return;

    const filename = 'ApplicationStatusReport.csv';

    if (!csv.match(/^data:text\/csv/i)) {
        csv = `data:text/csv;charset=utf-8,${csv}`;
    }

    link.setAttribute('href', encodeURI(csv));
    link.setAttribute('download', filename);
    link.click();
};

const Export = ({ onExport }) => (
    <button className="btn btn-dark mr-4" onClick={(e) => onExport(e.target.value)}>
        Export&nbsp;<BsDownload size={10} />
    </button>
);

export const ApplicationStatus = (props) => {
    const { lang } = props;
    const [loading, setLoading] = useState(true);
    const [authorize, setAuthorize] = useState(false);
    const [tableData, setTableData] = useState([]);

    const actionsMemo = React.useMemo(
        () => <Export onExport={() => downloadCSV(tableData)} />,
        [tableData]
    );

    useEffect(() => {
        setLoading(true);
        setAuthorize(ADMIN_FUNCTION_ALLOWED);
        setLoading(false);
        Axios.get(cssBarChart(), {}).then((res) => {
            let Arr = [];
            console.log('res.data.find_data');
            console.log(res.data.find_data);
            res.data.find_data.forEach((element) => {
                Arr.push({
                    category: element._id.category ? element._id.category.category_name : '',
                    pending: element.pending,
                    processing: element.processing,
                    completed: element.completed,
                    open: element.open,
                    new: element.new,
                    total:
                        element.pending +
                        element.processing +
                        element.completed +
                        element.open +
                        element.new,
                });
            });
            console.log('Arr');
            console.log(Arr);
            setTableData(Arr);
        });
    }, []);

    const columns = [
        {
            name: 'Category',
            selector: (row) => (row.category != undefined ? row.category : ''),
        },
        {
            name: 'Pending',
            selector: (row) => (row.pending != undefined ? row.pending : ''),
            sortable: true,
        },
        {
            name: 'Processing',
            selector: (row) => (row.processing != undefined ? row.processing : ''),
        },
        {
            name: 'Completed',
            selector: (row) => (row.completed != undefined ? row.completed : ''),
            sortable: true,
        },
        {
            name: 'Open',
            selector: (row) => (row.open != undefined ? row.open : ''),
        },
        {
            name: 'New',
            selector: (row) => (row.new != undefined ? row.new : ''),
        },
        {
            name: 'Total',
            selector: (row) => (row.total != undefined ? row.total : ''),
        },
    ];

    return (
        <div style={{ display: loading ? 'none' : 'block' }}>
            {authorize ? (
                <div>
                    <DataTable
                        striped
                        pagination
                        columns={columns}
                        data={tableData}
                        actions={actionsMemo}
                    />
                </div>
            ) : (
                <AdminAuthorizationText langKey={lang.langKey} />
            )}
        </div>
    );
};
