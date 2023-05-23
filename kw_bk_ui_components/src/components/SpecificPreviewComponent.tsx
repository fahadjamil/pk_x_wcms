import * as React from 'react';

export const SpecificPreviewComponent = (props) => {
    const { title } = props;

    return (
        <div className="container">
            <div className="row">
                <div className="col-sm-8 text-center">
                    <div className="card card-block">{title}</div>
                </div>
            </div>
        </div>
    );
};
