/// <reference path='../typings/main.d.ts'/>
System.register(['react', './Header', './Sidebar', './Content', 'jquery', 'ss-utils'], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var React, Header_1, Sidebar_1, Content_1;
    var App;
    return {
        setters:[
            function (React_1) {
                React = React_1;
            },
            function (Header_1_1) {
                Header_1 = Header_1_1;
            },
            function (Sidebar_1_1) {
                Sidebar_1 = Sidebar_1_1;
            },
            function (Content_1_1) {
                Content_1 = Content_1_1;
            },
            function (_1) {},
            function (_2) {}],
        execute: function() {
            App = (function (_super) {
                __extends(App, _super);
                function App(props, context) {
                    var _this = this;
                    _super.call(this, props, context);
                    var operationNames = this.props.metadata.operations.map(function (op) { return op.request; });
                    var viewerArgs = {}, operations = {}, types = {};
                    operationNames.forEach(function (name) {
                        viewerArgs[name] = {};
                        var aqViewer = _this.getAutoQueryViewer(name);
                        if (aqViewer && aqViewer.args) {
                            aqViewer.args.forEach(function (arg) { return viewerArgs[name][arg.name] = arg.value; });
                        }
                        operations[name] = _this.props.metadata.operations.filter(function (op) { return op.request === name; })[0];
                    });
                    this.props.metadata.types.forEach(function (t) { return types[t.name] = t; });
                    this.state = {
                        sidebarHidden: false, selected: null, defaults: {},
                        operationNames: operationNames, viewerArgs: viewerArgs, operations: operations, types: types
                    };
                }
                App.prototype.toggleSidebar = function () {
                    this.setState({ sidebarHidden: !this.state.sidebarHidden });
                };
                App.prototype.getType = function (name) {
                    return this.props.metadata.types.filter(function (op) { return op.name === name; })[0];
                };
                App.prototype.getAutoQueryViewer = function (name) {
                    var type = this.getType(name);
                    return type != null && type.attributes != null
                        ? type.attributes.filter(function (attr) { return attr.name === "AutoQueryViewer"; })[0]
                        : null;
                };
                App.prototype.getAutoQueryViewerArgValue = function (name, argName) {
                    var aqViewer = this.getAutoQueryViewer(name);
                    var arg = aqViewer
                        ? aqViewer.args.filter(function (x) { return x.name === argName; })[0]
                        : null;
                    return arg != null
                        ? arg.value
                        : null;
                };
                App.prototype.getSelectedTitle = function () {
                    return this.state.selected
                        ? this.getAutoQueryViewerArgValue(this.state.selected.name, 'Title') || this.state.selected.name
                        : null;
                };
                App.prototype.selectQuery = function (name) {
                    var operation = this.state.operations[name];
                    var from = this.state.types[operation.from];
                    var defaults = this.state.defaults;
                    var viewerArgs = this.state.viewerArgs[name] || {};
                    var op = defaults[name] || {};
                    op.searchField = op.searchField || viewerArgs["DefaultSearchField"];
                    op.searchType = op.searchType || viewerArgs["DefaultSearchType"];
                    op.searchText = op.searchText || viewerArgs["DefaultSearchText"];
                    defaults[name] = op;
                    this.setState({ selected: { name: name, operation: operation, from: from }, defaults: defaults });
                };
                App.prototype.render = function () {
                    var _this = this;
                    var opName = this.state.selected && this.state.selected.name;
                    return (React.createElement("div", null, React.createElement(Header_1.default, {"title": this.getSelectedTitle(), "onSidebarToggle": this.toggleSidebar}), React.createElement("div", {"id": "body", "style": { position: 'absolute', top: 90, display: 'flex', flexDirection: 'row', width: '100%', height: '100%' }}, React.createElement(Sidebar_1.default, {"hide": this.state.sidebarHidden, "name": opName, "viewerArgs": this.state.viewerArgs, "operations": this.state.operations, "onChange": function (op) { return _this.selectQuery(op); }}), React.createElement(Content_1.default, {"selected": this.state.selected, "defaults": this.state.defaults[opName], "implicitConventions": this.props.metadata.config.implicitConventions, "viewerArgs": this.state.viewerArgs}))));
                };
                return App;
            })(React.Component);
            exports_1("default", App);
        }
    }
});
//# sourceMappingURL=app.js.map