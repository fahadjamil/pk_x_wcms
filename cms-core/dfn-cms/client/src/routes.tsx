import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import Login from './modules/login/LoginComponent';
import AddSite from './modules/websites/AddSiteComponent';
import AddPage from './modules/pages/add-page-component';
import ThemeEditorComponent from './modules/settings/themes/theme-editor-component/ThemeEditorComponent';
import MasterTemplate from './modules/shared/ui-components/MasterTemplate';

export default function Routes() {
    console.log('inside router');
    return (
        <Router>
            <Switch>
                <Route path="/login" component={Login} exact />
                <Route path="/site/add" component={AddSite} exact />
                <Route path="/page/add" component={AddPage} exact />
                <Route path="/theme-editor" component={ThemeEditorComponent} exact />
                <Route path="/" component={MasterTemplate} exact />
            </Switch>
        </Router>
    );
}
