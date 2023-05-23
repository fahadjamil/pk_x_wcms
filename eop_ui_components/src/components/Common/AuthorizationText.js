import React from 'react';

export const AuthorizationText = (props) => {
    const { lang } = props;
    return (
        <section className="container p-5 my-5">
            <h1>Access Denied</h1>
            <p>This page is not available publically.</p>
            <p>You need to login with your registered application portal account.</p>
            <a className="btn btn-primary" href={'/' + props.langKey + '/login'}>
                Click here to Login
            </a>
        </section>
    );
};
