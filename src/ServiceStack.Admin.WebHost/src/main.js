/// <reference path='../typings/main.d.ts'/>
System.register(['react', 'react-dom', 'react-router', 'jquery', './AutoQuery'], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var React, react_dom_1, react_router_1, AutoQuery_1;
    var App;
    return {
        setters:[
            function (React_1) {
                React = React_1;
            },
            function (react_dom_1_1) {
                react_dom_1 = react_dom_1_1;
            },
            function (react_router_1_1) {
                react_router_1 = react_router_1_1;
            },
            function (_1) {},
            function (AutoQuery_1_1) {
                AutoQuery_1 = AutoQuery_1_1;
            }],
        execute: function() {
            App = (function (_super) {
                __extends(App, _super);
                function App() {
                    _super.apply(this, arguments);
                }
                App.prototype.render = function () {
                    return this.props.children;
                };
                return App;
            })(React.Component);
            react_dom_1.render((React.createElement(react_router_1.Router, {"history": react_router_1.browserHistory}, React.createElement(react_router_1.Redirect, {"from": "/", "to": "/ss-admin/autoquery"}), React.createElement(react_router_1.Redirect, {"from": "/ss-admin", "to": "/ss-admin/autoquery"}), React.createElement(react_router_1.Route, {"path": "/ss-admin", "component": App}, React.createElement(react_router_1.Route, {"path": "/ss-admin/autoquery(/:name)", "component": AutoQuery_1.default})))), document.getElementById('app'));
        }
    }
});
//# sourceMappingURL=main.js.map