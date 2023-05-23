import React, { useEffect, useState } from 'react';
import Axios from 'axios';
import { submittedApplications } from '../../config/path';
import { ADMIN_FUNCTION_ALLOWED } from '../../config/constants';
import { HiArrowNarrowRight } from 'react-icons/hi';
import { BsChevronRight } from 'react-icons/bs';
import moment from 'moment';
import Cookies from 'universal-cookie/es6';
import { ADMIN_LOGIN_ID_COOKIE } from '../../config/constants';
import { AdminAuthorizationText } from '../Common/AdminAuthorizationText';
import DataTable from 'react-data-table-component';

export const SubmitApplications = (props) => {
  const { lang } = props;
  const [loading, setLoading] = useState(true);
  const [authorize, setAuthorize] = useState(false);
  const [applicationData, setApplicationData] = useState('');
  const cookies = new Cookies();
  let login_cookie = cookies.get(ADMIN_LOGIN_ID_COOKIE);
  const [rolePermissions, setRolePermissions] = useState([]);
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
    Axios.get('/api/submited_applications', {category_id: '6292233535aef500115646a1'}).then((res) => {
      console.log('--res--');
      console.log(res);
      console.log('--res.data--');
      console.log(res.data);
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

  const columns = [
    {
      name: 'Ref. No.',
      selector: (row) => row.reference_number,
      sortable: true,
    },
    {
      name: 'Submitted By',
      selector: (row) => row.submit_user[0] ? row.submit_user[0].first_name + ' ' + row.submit_user[0].last_name : '',
      sortable: true,
    },
    {
      name: 'CNIC',
      selector: (row) => row.submit_user[0] ? row.submit_user[0].cnic : '',
      sortable: true,
    },
    {
      name: 'Category',
      selector: (row) => row.category[0].category_name,
      sortable: true,
    },
    {
      name: 'Submission Time',
      selector: (row) => moment(row.submit_time).format('DD-MM-YYYY hh:mm A'),
      sortable: true,
    },
    {
      cell: (row) => (
        <a
          href={'/' + lang.langKey + '/submitted-application#' + row._id}
          className="btn btn-primary mx-2"
        >
          <button className="btn btn-primary mx-2" type='button'>Details&nbsp;<BsChevronRight size={15} /></button>
        </a>
      ),
      ignoreRowClick: true,
      allowOverflow: true,
      button: true,
    },
  ];

  return (
    <div style={{ display: loading ? 'none' : 'block' }}>
      {authorize ? (
        <div>
          <DataTable striped pagination columns={columns} data={applicationData} />
        </div>
      ) : (
        <div>
          <AdminAuthorizationText langKey={lang.langKey} />
        </div>
      )}
    </div>
  );
};
