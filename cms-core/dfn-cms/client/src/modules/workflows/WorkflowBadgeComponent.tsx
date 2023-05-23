import React from 'react';
import WorkflowModel from '../shared/models/workflow-models/WorkflowModel';
import { getCurrentWorkflowItem } from '../shared/utils/WorkflowUtils';

interface WorkflowBadgeComponentModel {
    currentworkflowId: string | undefined;
}

function WorkflowBadgeComponent(props: WorkflowBadgeComponentModel) {
    function getWorkflowName(workflowItem: WorkflowModel) {
        if (workflowItem) {
            return workflowItem.workflowName.toUpperCase();
        } else {
            return '';
        }
    }

    if (props.currentworkflowId && props.currentworkflowId !== '') {
        const selectedWorkflow = getCurrentWorkflowItem(props.currentworkflowId);

        if (selectedWorkflow) {
            return (

                    <span
                        className="badge"
                        style={{
                            backgroundColor: selectedWorkflow.backColor,
                            color: selectedWorkflow.textColor,
                        }}
                    >
                        {getWorkflowName(selectedWorkflow)}
                    </span>
            );
        } else {
            return <></>;
        }
    } else {
        return <></>;
    }
}

export default WorkflowBadgeComponent;
