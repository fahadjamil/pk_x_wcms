import React from 'react';
import WorkflowBadgeComponent from '../../../workflows/WorkflowBadgeComponent';
import WorkflowStateModel from '../../../shared/models/workflow-models/WorkflowStateModel';
import { getUserName } from '../../../shared/utils/UserUtils';
import { getFormattedDateTimeString } from '../../../shared/utils/DateTimeUtil';

interface TableStatusComponentModel {
    currentWorkflowStatus?: WorkflowStateModel;
}

export default function TableStatusComponent(props: TableStatusComponentModel) {
    return (
        <div>
            <div className="container">
                <div className="row">
                    <div className="col-sm-12">
                        <div className="d-flex align-items-center justify-content-left">
                            <WorkflowBadgeComponent
                                currentworkflowId={props.currentWorkflowStatus?.state}
                            />
                        </div>
                    </div>
                </div>
                <div className="row">
                    <div className="col-sm-12">
                        <label
                            className="col-form-label col-form-label-sm"
                            style={{ color: '#868a91' }}
                        >
                            Approved By :{' '}
                            {props.currentWorkflowStatus !== undefined
                                ? getUserName(props.currentWorkflowStatus.modifiedBy)
                                : ''}{' '}
                            ,{' '}
                            {getFormattedDateTimeString(props.currentWorkflowStatus?.modifiedDate)}
                        </label>
                    </div>
                </div>
            </div>
        </div>
    );
}
