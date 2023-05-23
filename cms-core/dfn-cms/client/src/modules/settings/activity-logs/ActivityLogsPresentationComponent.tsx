import React from 'react';
import { getUserName } from '../../shared/utils/UserUtils';
import WorkflowBadgeComponent from '../../workflows/WorkflowBadgeComponent';
import './shapes.css';
import { getFormattedDateTimeString } from '../../shared/utils/DateTimeUtil';

const ActivityLogsPresentationComponent = (props) => {
    let modifiedUser: string = props.row.modifiedBy ? props.row.modifiedBy : '';

    return (
        <>
            <tr>
                <td scope="col">{getFormattedDateTimeString(props.row.modifiedDate) || ' '}</td>
                <td scope="col">{getUserName(modifiedUser) || ' '}</td>
                <td scope="col">
                    <b>{props.row.title || ' '}</b>
                </td>
                <td scope="col text-center">
                    <WorkflowBadgeComponent currentworkflowId={props.row.state} />
                </td>
                <td scope="col">{props.row.comment || ' '}</td>
            </tr>
        </>
    );
};

export default ActivityLogsPresentationComponent;
