import React from 'react';

export default function TableTitleComponent(props) {
    return (
        <div>
            <div>
                <div className="data--title">
                    {props.title}
                </div>
                <div>
                    <span>
                        Created By : {props.createdUser} , {props.createdDate}
                    </span>
                </div>
            </div>
        </div>
    );
}
