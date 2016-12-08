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
 
var BasePath = location.pathname.substring(0, location.pathname.indexOf("/ss_admin") + 1);
var AppPath = BasePath + "ss_admin";
const AutoQueryPath = AppPath + "/autoquery";

render(
    (<Router history={browserHistory}>
        <Redirect from="/" to={AutoQueryPath}/>
        <Redirect from={AppPath} to={AutoQueryPath}/>
        <Route path={AppPath} component={App}>
            <Route path={AutoQueryPath + "(/:name)"} component={AutoQuery} />
        </Route>
    </Router>), 
    document.getElementById('app'));
