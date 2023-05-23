import { getAuthorizationHeader } from '../../shared/utils/AuthorizationUtils';
import React, { useState, useEffect } from 'react';
import ActivityTableRow from '../../settings/activity-logs/ActivityLogsPresentationComponent';
import Axios from 'axios';
import DocumentHistoryTableRow from './DocumentHistoryTableComponent';
import { ExportExcelJS, ExportToPdf } from '../../shared/utils/ExportHelper';
import { toPascalCase } from '../../shared/utils/CommonUtils';

interface ParamsModel {
    database_name: string;
    lang: any;
    collectionTypes: any;
    menuName: string;
}

export default function DocumentHistoryComponent(props: ParamsModel) {
    const [historyDocuments, setHistoryDocuments] = useState([]);
    const [activityLogs, setActivityLogs] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState<any>(undefined);
    const dbName = props.database_name;
    const collectionTypes = props.collectionTypes;
    const menuName = props.menuName;
    const style: any = {
        position: 'sticky',
        top: '0',
        backgroundColor: 'white',
    };
    const lang = props.lang.langKey;

    useEffect(() => {
        getDocumentHistoryData(dbName, props.collectionTypes);
        getActivityLogs(dbName, collectionTypes);
    }, [dbName, collectionTypes]);

    function getActivityLogs(dbName, collectionTypes) {
        const headerParameter = {
            collection: collectionTypes.customeCollectionName,
            type: collectionTypes.collectionType,
        };
        const httpHeaders = getAuthorizationHeader(headerParameter);

        Axios.get('/api/documents/activity-logs', httpHeaders)
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

    function getDocumentHistoryData(dbName, collectionTypes) {
        const headerParameter = { collection: collectionTypes.customeCollectionName + '-history' };
        const httpHeaders = getAuthorizationHeader(headerParameter);

        Axios.get('/api/documents/history', httpHeaders)
            .then((result) => {
                setIsLoaded(true);
                setHistoryDocuments(result.data);
            })
            .catch((err) => {
                setIsLoaded(false);
                setError(err);
                console.log(err);
            });
    }

    const historyRowsList = historyDocuments.map((row, index) => (
        <DocumentHistoryTableRow
            key={index}
            row={row}
            index={index + 1}
            dbName={dbName}
            lang={lang}
        />
    ));

    const activityRowsList = activityLogs.map((row, index) => (
        <ActivityTableRow key={index} row={row} index={index + 1} />
    ));

    const handlePdfExport = () => {
        ExportToPdf('custom-collections-activity-logs', {
            title: (menuName ? menuName + ' ' : '') + 'Collection Activity Logs',
            saveName:
                toPascalCase(menuName ? menuName : '').replaceAll(' ', '') +
                'CollectionActivityLogs',
            pageFormat: { orientation: 'l', format: 'a4', lang: 'en' },
        });
    };

    const handleExcelExport = () => {
        ExportExcelJS(
            'custom-collections-activity-logs',
            (menuName ? menuName + ' ' : '') + 'Collection Activity Logs',
            toPascalCase(menuName ? menuName : '').replaceAll(' ', '') + 'CollectionActivityLogs',
            'en'
        );
    };

    return (
        <>
            <div
                className="col-12"
                style={{
                    height: '50px',
                }}
            >
                <h4>History {collectionTypes.collectionType}</h4>
            </div>
            <div
                className="col-12"
                style={{
                    height: '280px',
                    overflowY: 'auto',
                }}
            >
                <table
                    className="table-borderless table-hover tbl-thm-01 table"
                    style={{ position: 'relative' }}
                >
                    <thead style={{ position: 'sticky', top: '0' }}>
                        <tr>
                            <th scope="col" style={style}>
                                #
                            </th>
                            <th scope="col" style={style}>
                                {collectionTypes.collectionType.substring(
                                    0,
                                    collectionTypes.collectionType.length - 1
                                )}
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
                            <th scope="col" style={style}>
                                Action
                            </th>
                        </tr>
                    </thead>
                    <tbody>{historyRowsList}</tbody>
                </table>
            </div>
            <div
                className="col-12"
                style={{
                    height: '50px',
                }}
            >
                <h4>Activity Log</h4>
            </div>
            <div
                className="col-12"
                style={{
                    height: '500px',
                    overflowY: 'auto',
                }}
            >
                <div
                    className="col-12"
                    style={{
                        height: '500px',
                        overflowY: 'auto',
                    }}
                    id="custom-collections-activity-logs"
                >
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
                    <table className="table-borderless table-hover tbl-thm-01 table">
                        <thead>
                            <tr>
                                <th scope="col">Modified on</th>
                                <th scope="col">Modified by</th>
                                <th scope="col">Source Name</th>
                                <th scope="col text-center">Status</th>
                                <th scope="col">Comment</th>
                            </tr>
                        </thead>
                        <tbody>{activityRowsList}</tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
