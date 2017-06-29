import './assets/img/iconfont/material-icons.css';
import './assets/img/octicon/octicon.css';
import './app.css';

import * as React from 'react';
import { render } from 'react-dom';
import { Redirect } from 'react-router';
import { BrowserRouter as Router, Route, Link } from 'react-router-dom';

import { BasePath } from './shared';
import AutoQuery from './AutoQuery';

class AdminApp extends React.Component<any, any> {
    render() {
        return <AutoQuery match={ { params: { name:""} } } />;
    }
}
 
var AppPath = BasePath + "ss_admin";
const AutoQueryPath = AppPath + "/autoquery";

render(
    (<Router>
        <div>
            <Route exact path={AppPath} render={() => 
                <Redirect from={AppPath} to={AutoQueryPath}/>
                } />
            <Route exact path={AutoQueryPath} component={AutoQuery} />
            <Route path={AutoQueryPath + "/:name"} component={AutoQuery} />
        </div>
    </Router>), 
    document.getElementById('app'));
