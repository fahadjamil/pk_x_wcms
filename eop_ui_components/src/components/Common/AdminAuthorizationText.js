import React from 'react';

export const AdminAuthorizationText = (props) => {
    const { lang } = props;
    return (
        <section className="container p-5 my-5">
            <h1>No Authorization Found.</h1>
            <p>
                This page is not publically available.
                <br />
                To access it please login first.
            </p>

            <a className="input-group-btn btn btn-primary" href={'/' + props.langKey + '/admin'}>
                RETURN TO LOGIN
            </a>
        </section>
    );
};
