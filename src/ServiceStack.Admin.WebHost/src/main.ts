/// <reference path='../typings/main.d.ts'/>

import * as React from 'react';
import { render } from 'react-dom';
import 'jquery';

import App from './App';

$.getJSON("autoquery/metadata", r => 
    render(React.createElement(App, { metadata:r }), document.getElementById('app')));

