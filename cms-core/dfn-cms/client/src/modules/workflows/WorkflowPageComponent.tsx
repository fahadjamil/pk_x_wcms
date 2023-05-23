import Axios from 'axios';
import React, { useEffect, useState } from 'react';
import { connect, useDispatch } from 'react-redux';
import { switchPage } from '../redux/action';
import WorkflowModel from '../shared/models/workflow-models/WorkflowModel';
import WorkflowStateModel from '../shared/models/workflow-models/WorkflowStateModel';
import MasterRepository from '../shared/repository/MasterRepository';
import TopPanelComponent from '../shared/ui-components/TopPanelComponent';
import { getAuthorizationHeader } from '../shared/utils/AuthorizationUtils';
import { getUserName } from '../shared/utils/UserUtils';
import { getAllWorkflowItems } from '../shared/utils/WorkflowUtils';
import { getFormattedDateTimeString } from '../shared/utils/DateTimeUtil';
import WorkflowBadgeComponent from './WorkflowBadgeComponent';

function WorkflowPageComponent(props) {
    const [workflowDocuments, setWorkflowDocuments] = useState<WorkflowStateModel[]>([]);
    const database = props.website;
    const dispatch = useDispatch();
    const workflows: WorkflowModel[] | undefined = getAllWorkflowItems();

    useEffect(() => {
        getMyWorkflowStatus();
        dispatch(switchPage('Workflow'));
    }, [database]);

    function getMyWorkflowStatus() {
        const headerParameter = {
            query: JSON.stringify({
                $or: [
                    { createdBy: MasterRepository.getCurrentUser().docId },
                    { modifiedBy: MasterRepository.getCurrentUser().docId },
                ],
            }),
            sorter: JSON.stringify({ modifiedDate: -1, createdDate: -1 }),
        };
        const httpHeaders = getAuthorizationHeader(headerParameter);
        // const jwt = localStorage.getItem('jwt-token');
        // const httpHeaders = {
        //     headers: {
        //         Authorization: jwt,
        //     },
        //     params: {
        //         dbName: database,
        //         query: JSON.stringify({
        //             $or: [
        //                 { createdBy: MasterRepository.getCurrentUser().docId },
        //                 { modifiedBy: MasterRepository.getCurrentUser().docId },
        //             ],
        //         }),
        //         sorter: JSON.stringify({ modifiedDate: -1, createdDate: -1 }),
        //     },
        // };

        Axios.get('/api/workflow/filter', httpHeaders)
            .then((result) => {
                if (result && result.data) {
                    setWorkflowDocuments(result.data);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function getWorkflowsByStatus(workflowId: string) {
        const headerParameter = {
            query: JSON.stringify({ state: workflowId }),
            sorter: JSON.stringify({ modifiedDate: -1, createdDate: -1 }),
        };
        const httpHeaders = getAuthorizationHeader(headerParameter);
        // const jwt = localStorage.getItem('jwt-token');
        // const httpHeaders = {
        //     headers: {
        //         Authorization: jwt,
        //     },
        //     params: {
        //         dbName: database,
        //         query: JSON.stringify({ state: workflowId }),
        //         sorter: JSON.stringify({ modifiedDate: -1, createdDate: -1 }),
        //     },
        // };

        Axios.get('/api/workflow/filter', httpHeaders)
            .then((result) => {
                if (result && result.data) {
                    setWorkflowDocuments(result.data);
                }
            })
            .catch((err) => {
                console.log(err);
            });
    }

    function onTabClicked(workflowId: string, isMyRecords: boolean) {
        if (isMyRecords) {
            getMyWorkflowStatus();
        } else {
            getWorkflowsByStatus(workflowId);
        }
    }

    return (
        <div className="row" style={{ marginLeft: '16px', width: '100%', marginRight: '50px' }}>
            <div className="col-12" style={{ width: '100%' }}>
                <TopPanelComponent />
                <br />
                <ul className="nav nav-tabs" id="workflowTab" role="tablist">
                    <li className="nav-item">
                        <a
                            className="nav-link active"
                            id="myrecords-tab"
                            data-toggle="tab"
                            href="#myrecords"
                            role="tab"
                            aria-controls="myrecords"
                            aria-selected="true"
                            onClick={() => {
                                onTabClicked('', true);
                            }}
                        >
                            My Records
                        </a>
                    </li>
                    {workflows &&
                        workflows.map((workflow, index) => {
                            //let active = index === 0 ? ' active' : '';
                            let workflowTabIndex = workflow.workflowId + index.toString();

                            return (
                                <li key={workflowTabIndex} className="nav-item">
                                    <a
                                        //className={'nav-link' + active}
                                        className="nav-link"
                                        id={workflowTabIndex + '-tab'}
                                        data-toggle="tab"
                                        href={'#' + workflowTabIndex}
                                        role="tab"
                                        aria-controls={workflowTabIndex}
                                        aria-selected="true"
                                        onClick={() => {
                                            onTabClicked(workflow.workflowId, false);
                                        }}
                                    >
                                        {workflow.workflowName}
                                    </a>
                                </li>
                            );
                        })}
                </ul>
                <div className="tab-content" id="workflowTabContent">
                    <div
                        className="tab-pane fade show active"
                        id="myrecords"
                        role="tabpanel"
                        aria-labelledby="myrecords-tab"
                    >
                        <div>
                            <table className="table-borderless table-hover tbl-thm-01 table">
                                <thead>
                                    <tr>
                                        <th scope="col" style={{ width: '1%' }}>
                                            #
                                        </th>
                                        <th scope="col" style={{ width: '11%' }}>
                                            Page
                                        </th>
                                        <th scope="col" style={{ width: '2%' }}>
                                            Type
                                        </th>
                                        <th scope="col" style={{ width: '30%' }}>
                                            Comment
                                        </th>
                                        <th
                                            className="text-left"
                                            scope="col"
                                            style={{ width: '3%' }}
                                        >
                                            Status
                                        </th>
                                        <th scope="col" style={{ width: '10%' }}>
                                            Created By
                                        </th>
                                        <th scope="col" style={{ width: '10%' }}>
                                            Modified By
                                        </th>
                                        <th scope="col" style={{ width: '16%' }}>
                                            Created Date
                                        </th>
                                        <th scope="col" style={{ width: '16%' }}>
                                            Modified Date
                                        </th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {workflowDocuments &&
                                        workflowDocuments.map((workflowDoc, index) => {
                                            return (
                                                <tr key={'myRecords' + String(index)}>
                                                    <th scope="row">{index + 1}</th>
                                                    <td>{workflowDoc.fileTitle}</td>
                                                    <td>{workflowDoc.fileType}</td>
                                                    <td>{workflowDoc.comment}</td>
                                                    <td className="d-flex align-items-center justify-content-left">
                                                        <WorkflowBadgeComponent
                                                            currentworkflowId={workflowDoc.state}
                                                        />
                                                    </td>
                                                    <td>{getUserName(workflowDoc.createdBy)}</td>
                                                    <td>{getUserName(workflowDoc.modifiedBy)}</td>
                                                    <td>
                                                        {getFormattedDateTimeString(
                                                            workflowDoc.createdDate
                                                        )}
                                                    </td>
                                                    <td>
                                                        {getFormattedDateTimeString(
                                                            workflowDoc.modifiedDate
                                                        )}
                                                    </td>
                                                </tr>
                                            );
                                        })}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    {workflows &&
                        workflows.map((workflow, index) => {
                            //let active = index === 0 ? ' show active' : '';
                            let workflowTabIndex = workflow.workflowId + index.toString();
                            let pagecount = 0;

                            return (
                                <div
                                    key={workflowTabIndex}
                                    //className={'tab-pane fade' + active}
                                    className="tab-pane fade"
                                    id={workflowTabIndex}
                                    role="tabpanel"
                                    aria-labelledby={workflowTabIndex + '-tab'}
                                >
                                    <div>
                                        <table className="table-borderless table-hover tbl-thm-01 table">
                                            <thead>
                                                <tr>
                                                    <th scope="col" style={{ width: '1%' }}>
                                                        #
                                                    </th>
                                                    <th scope="col" style={{ width: '11%' }}>
                                                        Page
                                                    </th>
                                                    <th scope="col" style={{ width: '3%' }}>
                                                        Type
                                                    </th>
                                                    <th scope="col" style={{ width: '35%' }}>
                                                        Comment
                                                    </th>
                                                    <th scope="col" style={{ width: '10%' }}>
                                                        Created By
                                                    </th>
                                                    <th scope="col" style={{ width: '10%' }}>
                                                        Modified By
                                                    </th>
                                                    <th scope="col" style={{ width: '15%' }}>
                                                        Created Date
                                                    </th>
                                                    <th scope="col" style={{ width: '15%' }}>
                                                        Modified Date
                                                    </th>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {workflowDocuments &&
                                                    workflowDocuments.map((workflowDoc, index) => {
                                                        pagecount++;

                                                        return (
                                                            <tr key={String(index)}>
                                                                <th scope="row">{pagecount}</th>
                                                                <td>{workflowDoc.fileTitle}</td>
                                                                <td>{workflowDoc.fileType}</td>
                                                                <td>{workflowDoc.comment}</td>
                                                                <td>
                                                                    {getUserName(
                                                                        workflowDoc.createdBy
                                                                    )}
                                                                </td>
                                                                <td>
                                                                    {getUserName(
                                                                        workflowDoc.modifiedBy
                                                                    )}
                                                                </td>
                                                                <td>
                                                                    {getFormattedDateTimeString(
                                                                        workflowDoc.createdDate
                                                                    )}
                                                                </td>
                                                                <td>
                                                                    {getFormattedDateTimeString(
                                                                        workflowDoc.modifiedDate
                                                                    )}
                                                                </td>
                                                            </tr>
                                                        );
                                                    })}
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            );
                        })}
                </div>
            </div>
        </div>
    );
}

const mapStateToProps = (state) => {
    return {
        website: state.websiteReducer.website?.databaseName,
    };
};

export default connect(mapStateToProps)(WorkflowPageComponent);
