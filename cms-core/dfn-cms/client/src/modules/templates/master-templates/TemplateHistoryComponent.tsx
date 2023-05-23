import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import ActivityTableRow from '../../settings/activity-logs/ActivityLogsPresentationComponent';
import { getAuthorizationHeader } from '../../shared/utils/AuthorizationUtils';
import TemplateHistoryTableRow from './TemplateHistoryTableComponent';
import { style } from './TemplateHistoryComponentStyles';

interface ParamsModel {
    database_name: string;
    templateId: string;
    workflowStatus: string | undefined;
    checkOutHandlder: any;
}

export default function TemplateHistoryComponent(props: ParamsModel) {
    const [historyPages, setHistoryPages] = useState([]);
    const [activityLogs, setActivityLogs] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState<any>(undefined);
    const dbName = props.database_name;
    const templateId = props.templateId;

    useEffect(() => {
        let isMounted: boolean = true;

        if (isMounted) {
            getHistoryData(dbName, templateId);
            getActivityLogs(dbName, templateId);
        }

        return () => {
            isMounted = false;
        };
    }, [dbName, templateId, props.workflowStatus]);

    function getActivityLogs(dbName, templateId) {
        const headerParameter = { templateId: templateId };
        const httpHeaders = getAuthorizationHeader(headerParameter);

        Axios.get('/api/templates/activity-logs', httpHeaders)
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

    function getHistoryData(dbName, templateId) {
        const headerParameter = { templateId: templateId };
        const httpHeaders = getAuthorizationHeader(headerParameter);

        Axios.get('/api/templates/history', httpHeaders)
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
        <TemplateHistoryTableRow
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

    return (
        <>
            <div className="row">
                <div className="col-12">
                    <h5>Template History</h5>
                </div>
                <div className="col-12">
                    <table className="table-borderless table-hover tbl-thm-01 table">
                        <thead>
                            <tr>
                                <th scope="col" style={style}>
                                    #
                                </th>
                                <th scope="col" style={style}>
                                    Template
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
                <div className="col-12">
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