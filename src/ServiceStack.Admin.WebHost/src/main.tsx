/// <reference path='../typings/main.d.ts'/>

import * as React from 'react';
import { render } from 'react-dom';
import { Router, Route, IndexRoute, Link, Redirect, browserHistory } from 'react-router';

import 'react-router';
import 'jquery';

import AutoQuery from './AutoQuery';

class App extends React.Component<any, any> {
    render() {
        return this.props.children;
    }
}

render(
    (<Router history={browserHistory}>
        <Redirect from="/" to="/ss_admin/autoquery"/>
        <Redirect from="/ss_admin" to="/ss_admin/autoquery"/>
        <Route path="/ss_admin" component={App}>
            <Route path="/ss_admin/autoquery(/:name)" component={AutoQuery} />
        </Route>
    </Router>), 
    document.getElementById('app'));
