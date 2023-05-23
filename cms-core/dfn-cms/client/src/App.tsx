// FIXME : Try to apply the same modules structure defined in the headless-cms-service

import React, { useState } from 'react';
import Routes from './routes';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap/dist/js/bootstrap.min.js';
import 'bootstrap/dist/js/bootstrap.bundle.js';
import 'bootstrap-v4-rtl/dist/css/bootstrap-rtl.min.css';
import 'bootstrap-v4-rtl/dist/js/bootstrap.min.js';
import 'react-lazy-load-image-component/src/effects/blur.css';
import 'react-sortable-tree/style.css';
import './App.css';
import './dashboard.css';
import MasterTemplate from './modules/shared/ui-components/MasterTemplate';
import PreviewContentComponentWrapper from './modules/pages/preview/preview-content-component/PreviewContentComponentWrapper';
import LoginComponent from './modules/login/LoginComponent';
import ActiveDirectoryLoginComponent from './modules/login/ActiveDirectoryLoginComponent';
import ADSuccessResponseComponent from './modules/login/ADSuccessResponseComponent';
import ActiveDirectoryLogoutComponent from './modules/login/ActiveDirectoryLogoutComponent';
import ADFailResponseComponent from './modules/login/ADFailResponseComponent';
import ResponsivePreviewComponent from './modules/pages/preview/responsive-preview/ResponsivePreviewComponent';
import ConfirmationModal from './modules/shared/ui-components/modals/confirmation-modal';

const UserConfirmationComponent = (props) => {
    function allowTransition() {
        props.setConfirm(false);
        props.confirmCallback(true);
    }

    function blockTransition() {
        props.setConfirm(false);
        props.confirmCallback(false);
    }

    return (
        <ConfirmationModal
            modalTitle="Confirmation"
            show={props.show}
            handleClose={blockTransition}
            handleConfirme={allowTransition}
        >
            <div className="alert alert-warning" role="alert">
                {props.message}
            </div>
        </ConfirmationModal>
    );
};

function App() {
    const [confirm, setConfirm] = useState(false);
    const [message, setMessage] = useState('');
    const [confirmCallback, setConfirmCallback] = useState(null);

    function getUserConfirmation(message, callback) {
        setConfirmCallback(() => callback);
        setConfirm(true);
        setMessage(message);
    }

    return (
        <>
            <Router getUserConfirmation={getUserConfirmation}>
                <Switch>
                    <Route exact path="/">
                        <LoginComponent />
                    </Route>
                    <Route exact path="/superlogin" component={ActiveDirectoryLoginComponent} />
                    <Route exact path="/logout-ad" component={ActiveDirectoryLogoutComponent} />
                    <Route
                        exact
                        path="/login/BKSuccess/:username/:sessionid"
                        component={ADSuccessResponseComponent}
                    />
                    <Route
                        exact
                        path="/login/BKError/:errorcode"
                        component={ADFailResponseComponent}
                    />
                    <Route
                        exact
                        path="/preview/:website/:lang/:page"
                        component={PreviewContentComponentWrapper}
                    />
                    <Route
                        exact
                        path="/responsive-preview/:website/:lang/:page"
                        component={ResponsivePreviewComponent}
                    />
                    <Route>
                        <MasterTemplate />
                    </Route>
                </Switch>
            </Router>
            {confirm && (
                <UserConfirmationComponent
                    confirmCallback={confirmCallback}
                    setConfirm={setConfirm}
                    message={message}
                    show={confirm}
                />
            )}
        </>
    );
}

export default App;
