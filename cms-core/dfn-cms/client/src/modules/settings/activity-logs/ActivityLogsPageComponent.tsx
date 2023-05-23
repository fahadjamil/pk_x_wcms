import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import MultiSelect from 'react-multi-select-component';
import { WorkflowsStatus } from '../../shared/config/WorkflowsStatus';
import { getAuthorizationHeader } from '../../shared/utils/AuthorizationUtils';
import { getUserName } from '../../shared/utils/UserUtils';
import WorkflowBadgeComponent from '../../workflows/WorkflowBadgeComponent';
import ActivityLogModel from './models/ActivityLogCommonModel';
import {
    getFormattedDateString,
    getFormattedDateTimeString,
} from '../../shared/utils/DateTimeUtil';
import { DatePickerComponent } from '../../shared/ui-components/input-fields/date-picker-component';
import { ExportToPdf, ExportExcelJS } from '../../shared/utils/ExportHelper';

export default function ActivityLogsPageComponent(props) {
    const [activityLogs, setActivityLogs] = useState<ActivityLogModel[]>([]);
    const [activityLogsFetched, setActivityLogsFetched] = useState<ActivityLogModel[]>([]);
    const [typesSelected, setTypesSelected] = useState([]);
    const [statesSelected, setStatesSelected] = useState([]);
    const [titleAdded, setTitleAdded] = useState('');
    const [commentAdded, setCommentAdded] = useState('');
    const [toDate, setToDate] = useState<Date>(new Date());
    const [fromDate, setFromDate] = useState<Date>(
        new Date(toDate.getTime() - 7 * 24 * 60 * 60 * 1000)
    );
    const database = props.website;
    const typeOptions = [
        { label: 'Page 📄', value: 'Page' },
        { label: 'Doc 📃', value: 'Documents' },
        { label: 'Post 📋', value: 'Posts' },
        { label: 'Media 📹', value: 'Media' },
    ];
    const statesOptions = [
        { label: 'SUBMIT PENDING', value: WorkflowsStatus.initial },
        { label: 'PENDING APPROVAL', value: WorkflowsStatus.pendingApproval },
        { label: 'APPROVED', value: WorkflowsStatus.approved },
        { label: 'REJECTED', value: WorkflowsStatus.rejected },
        { label: 'DELETED', value: 'deleted' },
    ];

    useEffect(() => {
        getAllActivityLogsFromDB();
    }, [database]);

    /* useEffect(() => {
        filter();
    }, [typesSelected, statesSelected, titleAdded, commentAdded]);*/

    function getAllActivityLogsFromDB() {
        const headerParameter = {};
        const httpHeaders = getAuthorizationHeader(headerParameter);
        // const jwt = localStorage.getItem('jwt-token');
        // const httpHeaders = {
        //     headers: {
        //         Authorization: jwt,
        //     },
        //     params: {
        //         dbName: database,
        //     },
        // };
        let logSearch = {
            searchQ: getSearchQuery(),
            dbName: database,
        };

        Axios.post('/api/activity-logs', logSearch, httpHeaders)
            .then((result) => {
                if (result && result.data) {
                    setActivityLogsFetched(result.data);
                    setActivityLogs(result.data);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function getSearchQuery() {
        return {
            ...(typesSelected.length > 0 && {
                types: typesSelected.map(({ value }) => value),
            }),
            ...(statesSelected.length > 0 && {
                states: statesSelected.map(({ value }) => value),
            }),
            ...(titleAdded.length > 0 && { title: titleAdded }),
            ...(commentAdded.length > 0 && { comment: commentAdded }),
            ...(fromDate && { fromDate: formattedSelectedFromDate(fromDate) }),
            ...(toDate && { toDate: formattedSelectedToDate(toDate) }),
        };
    }

    function filter() {
        if (activityLogsFetched.length > 0) {
            let tempArray: ActivityLogModel[] = [];
            tempArray.push(...activityLogsFetched);

            if (typesSelected.length > 0) {
                let types: string[] = typesSelected.map(({ value }) => value);

                for (let i = tempArray.length - 1; i >= 0; i--) {
                    if (!types.includes(tempArray[i].type)) {
                        tempArray.splice(i, 1);
                    }
                }
            }

            if (statesSelected.length > 0) {
                let states: string[] = statesSelected.map(({ value }) => value);

                for (let i = tempArray.length - 1; i >= 0; i--) {
                    if (!states.includes(tempArray[i].state)) {
                        tempArray.splice(i, 1);
                    }
                }
            }

            if (titleAdded.length > 0) {
                for (let i = tempArray.length - 1; i >= 0; i--) {
                    if (tempArray[i].title && tempArray[i].title.length > 0) {
                        if (!tempArray[i].title.includes(titleAdded)) {
                            tempArray.splice(i, 1);
                        }
                    } else {
                        tempArray.splice(i, 1);
                    }
                }
            }

            if (commentAdded.length > 0) {
                for (let i = tempArray.length - 1; i >= 0; i--) {
                    if (tempArray[i].comment && tempArray[i].comment.length > 0) {
                        if (!tempArray[i].comment.includes(commentAdded)) {
                            tempArray.splice(i, 1);
                        }
                    } else {
                        tempArray.splice(i, 1);
                    }
                }
            }

            setActivityLogs(tempArray);
        }
    }

    function getActiveLogs() {
        let itemCount = 0;
        return (
            <>
                {activityLogs &&
                    activityLogs.map((item, index) => {
                        const { deleted, restored } = item;

                        itemCount++;
                        return (
                            <tr key={String(index)}>
                                <td>{itemCount}</td>
                                <td>{item.type || ' '}</td>
                                <td>{item.title || ' '}</td>
                                <td>{item.version || ' '}</td>
                                <td>
                                    {deleted
                                        ? deleted.comment || ' '
                                        : restored
                                        ? restored.comment
                                        : item.comment || ' '}
                                </td>
                                {/* <td>{restored ? restored.comment : item.comment || ' '}</td> */}
                                <td className="d-flex align-items-center justify-content-left">
                                    {item.state.includes('deleted') ? (
                                        <span className="badge badge-danger">DELETED</span>
                                    ) : restored ? (
                                        <span className="badge badge-info">RESTORED</span>
                                    ) : (
                                        <>
                                            <WorkflowBadgeComponent
                                                currentworkflowId={item.state}
                                            />{' '}
                                        </>
                                    )}
                                </td>
                                <td>
                                    {deleted
                                        ? getUserName(deleted.deletedBy)
                                        : getUserName(item.createdBy)}{' '}
                                </td>
                                <td>
                                    {deleted
                                        ? getUserName(deleted.deletedBy)
                                        : getUserName(item.modifiedBy)}{' '}
                                </td>
                                <td>
                                    {deleted
                                        ? getFormattedDateTimeString(deleted.deletedDate)
                                        : getFormattedDateTimeString(item.createdDate)}{' '}
                                </td>
                                <td>
                                    {deleted
                                        ? getFormattedDateTimeString(deleted.deletedDate)
                                        : getFormattedDateTimeString(item.modifiedDate)}{' '}
                                </td>
                            </tr>
                        );
                    })}
            </>
        );
    }

    function formattedSelectedFromDate(date) {
        const newDate = new Date();

        if (date && date.setHours) {
            date.setHours(0, 0, 0, 0);
            return date;
        }

        newDate.setHours(0, 0, 0, 0);
        return newDate;
    }

    function formattedSelectedToDate(date) {
        const newDate = new Date();

        if (date && date.setHours) {
            date.setHours(23, 59, 59, 59);
            return date;
        }

        newDate.setHours(23, 59, 59, 59);
        return newDate;
    }

    const handlePdfExport = () => {
        ExportToPdf('audit-data', {
            title: 'Activity Logs',
            saveName:
                'ActivityLogs_' +
                getFormattedDateString(fromDate) +
                '_' +
                getFormattedDateString(toDate),
            pageFormat: { orientation: 'l', format: 'a4', lang: 'en' },
        });
    };

    const handleExcelExport = () => {
        ExportExcelJS(
            'audit-data',
            'Activity Logs',
            'ActivityLogs_' +
                getFormattedDateString(fromDate) +
                '_' +
                getFormattedDateString(toDate),
            'en'
        );
    };

    return (
        <>
            <h5>Activity Logs</h5>
            <br />
            {/* Activity Logs Tab content*/}
            <div>
                {/* Filter for activity logs*/}
                <div className="row align-items-center">
                    <div className="col-1 form-group">
                        <label className="">From:</label>
                        <DatePickerComponent
                            handleValueChange={(date) => {
                                setFromDate(date);
                            }}
                            selected={fromDate}
                        />
                    </div>
                    <div className="col-1 form-group">
                        <label className="">To:</label>
                        <DatePickerComponent
                            handleValueChange={(date) => {
                                setToDate(date);
                            }}
                            selected={toDate}
                        />
                    </div>
                    <div className="col-2 form-group">
                        <label className="">Type:</label>
                        <MultiSelect
                            className="multi-select"
                            options={typeOptions}
                            value={typesSelected}
                            onChange={setTypesSelected}
                            labelledBy={'Select'}
                        />
                    </div>
                    <div className="col-2 form-group">
                        <label className="">Status:</label>
                        <MultiSelect
                            className="multi-select"
                            options={statesOptions}
                            value={statesSelected}
                            onChange={setStatesSelected}
                            labelledBy={'Select'}
                        />
                    </div>
                    <div className="col-3 form-group">
                        <label className="">Comment:</label>
                        <input
                            className="form-control"
                            onChange={(e) => setCommentAdded(e.target.value)}
                            value={commentAdded}
                        />
                    </div>
                    <div className="col-2 form-group">
                        <label className="">Title:</label>
                        <input
                            className="form-control"
                            onChange={(e) => setTitleAdded(e.target.value)}
                            value={titleAdded}
                        />
                    </div>
                    <div className="col-1 form-group pt-4">
                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={getAllActivityLogsFromDB}
                        >
                            Search
                        </button>
                    </div>
                </div>
                <div className="row p-3 justify-content-end">
                    <div>
                        <button
                            className="btn btn-sm btn-outline-secondary mr-1"
                            onClick={handlePdfExport}
                        >
                            <i className="btn-icon btn-icon-sm pdf-icon"></i>
                            Export To PDF
                        </button>
                        <button
                            className="btn btn-sm btn-outline-secondary"
                            onClick={handleExcelExport}
                        >
                            <i className="btn-icon btn-icon-sm xls-icon"></i>
                            Export To Excel
                        </button>
                    </div>
                </div>
                <div id="audit-data" className="row">
                    <table className="table-borderless table-hover tbl-thm-01 table">
                        <thead>
                            <tr>
                                <th>#</th>
                                <th>type</th>
                                <th>title</th>
                                <th>version</th>
                                <th>Comment</th>
                                <th>Status</th>
                                <th>Created By</th>
                                <th>Modified By</th>
                                <th>Created Date</th>
                                <th>Modified Date</th>
                            </tr>
                        </thead>
                        <tbody style={{}}>{getActiveLogs()}</tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
