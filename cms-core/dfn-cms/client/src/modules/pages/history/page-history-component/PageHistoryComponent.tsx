import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import ActivityTableRow from '../../../settings/activity-logs/ActivityLogsPresentationComponent';
import { getAuthorizationHeader } from '../../../shared/utils/AuthorizationUtils';
import { toPascalCase } from '../../../shared/utils/CommonUtils';
import { ExportExcelJS, ExportToPdf } from '../../../shared/utils/ExportHelper';
import PageHistoryTableRow from '../page-history-table-component';
import { style } from './PageHistoryComponentStyles';

interface ParamsModel {
    database_name: string;
    pageId: string;
    workflowStatus: string | undefined;
    pageTitle: string | undefined;
    checkOutHandlder: any;
}

export default function PageHistoryComponent(props: ParamsModel) {
    const [historyPages, setHistoryPages] = useState([]);
    const [activityLogs, setActivityLogs] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState<any>(undefined);
    const dbName = props.database_name;
    const pageId = props.pageId;
    const pageTitle = props.pageTitle;

    useEffect(() => {
        let isMounted: boolean = true;

        if (isMounted) {
            getHistoryData(dbName, pageId);
            getActivityLogs(dbName, pageId);
        }

        return () => {
            isMounted = false;
        };
    }, [dbName, pageId, props.workflowStatus]);

    function getActivityLogs(dbName, pageId) {
        const headerParameter = { pageId: pageId };
        const httpHeaders = getAuthorizationHeader(headerParameter);
        // const jwt = localStorage.getItem('jwt-token');
        // const httpHeaders = {
        //     headers: {
        //         Authorization: jwt,
        //     },
        //     params: {
        //         pageId: pageId,
        //         dbName: dbName,
        //     },
        // };

        Axios.get('/api/pages/activity-logs', httpHeaders)
            .then((result) => {
                setIsLoaded(true);
                setActivityLogs(result.data);
            })
            .catch((err) => {
                setIsLoaded(false);
                setError(err);
                console.log(err);
            });
    }

    function getHistoryData(dbName, pageId) {
        const headerParameter = { pageId: pageId };
        const httpHeaders = getAuthorizationHeader(headerParameter);
        // const jwt = localStorage.getItem('jwt-token');
        // const httpHeaders = {
        //     headers: {
        //         Authorization: jwt,
        //     },
        //     params: {
        //         dbName: dbName,
        //         pageId: pageId,
        //     },
        // };

        Axios.get('/api/pages/history', httpHeaders)
            .then((result) => {
                setIsLoaded(true);
                setHistoryPages(result.data);
            })
            .catch((err) => {
                setIsLoaded(false);
                setError(err);
                console.log(err);
            });
    }

    const historyRowsList = historyPages.map((row, index) => (
        <PageHistoryTableRow
            key={index}
            row={row}
            index={index + 1}
            dbName={dbName}
            onCheckout={props.checkOutHandlder}
        />
    ));

    function getActivityRowList() {
        let activityRows: any[] = [];
        for (let index = activityLogs.length - 1; index >= 0; index--) {
            const element = activityLogs[index];
            activityRows.push(<ActivityTableRow key={`ActivityLog${index}`} row={element} />);
        }

        return activityRows;
    }

    const handlePdfExport = () => {
        ExportToPdf('page-activity-logs', {
            title: (pageTitle ? pageTitle + ' ' : '') + 'Page Activity Logs',
            saveName:
                toPascalCase(pageTitle ? pageTitle : '').replaceAll(' ', '') + 'PageActivityLogs',
            pageFormat: { orientation: 'l', format: 'a4', lang: 'en' },
        });
    };

    const handleExcelExport = () => {
        ExportExcelJS(
            'page-activity-logs',
            (pageTitle ? pageTitle + ' ' : '') + 'Page Activity Logs',
            toPascalCase(pageTitle ? pageTitle : '').replaceAll(' ', '') + 'PageActivityLogs',
            'en'
        );
    };

    return (
        <>
            <div className="row">
                <div className="col-12">
                    <h5>History Pages</h5>
                </div>
                <div className="col-12">
                    <table className="table-borderless table-hover tbl-thm-01 table">
                        <thead>
                            <tr>
                                <th scope="col" style={style}>
                                    #
                                </th>
                                <th scope="col" style={style}>
                                    Page
                                </th>
                                <th scope="col" style={style}>
                                    Comment
                                </th>
                                <th scope="col" style={style}>
                                    Version
                                </th>
                                <th scope="col" style={style}>
                                    Status
                                </th>
                                <th scope="col" style={style}>
                                    Created Date
                                </th>
                                <th scope="col" className="text-right" style={style}>
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody>{historyRowsList}</tbody>
                    </table>
                </div>
            </div>

            <div className="row">
                <div className="col-12">
                    <h5>Activity Log</h5>
                </div>
                <div className="col-12" id="page-activity-logs">
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

                    <table className="table table-borderless table-hover tbl-thm-01 table">
                        <thead>
                            <tr>
                                <th scope="col">Modified on</th>
                                <th scope="col">Modified by</th>
                                <th scope="col">Source Name</th>
                                <th scope="col text-center">Status</th>
                                <th scope="col">Comment</th>
                            </tr>
                        </thead>
                        <tbody>{getActivityRowList()}</tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
