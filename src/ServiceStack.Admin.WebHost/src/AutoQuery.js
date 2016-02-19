/// <reference path='../typings/main.d.ts'/>
System.register(['react', './Header', './Sidebar', './Content', './ColumnPrefsDialog', 'jquery', 'ss-utils'], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var React, Header_1, Sidebar_1, Content_1, ColumnPrefsDialog_1;
    var AutoQuery, App;
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
            function (ColumnPrefsDialog_1_1) {
                ColumnPrefsDialog_1 = ColumnPrefsDialog_1_1;
            },
            function (_1) {},
            function (_2) {}],
        execute: function() {
            AutoQuery = (function (_super) {
                __extends(AutoQuery, _super);
                function AutoQuery(props, context) {
                    var _this = this;
                    _super.call(this, props, context);
                    this.state = {
                        basePath: location.pathname.substring(0, location.pathname.indexOf("/ss_admin") + 1)
                    };
                    $.getJSON(this.state.basePath + "autoquery/metadata", function (r) {
                        return _this.setState({ metadata: $.ss.normalize(r, true), name: _this.props.params.name });
                    });
                }
                AutoQuery.prototype.render = function () {
                    return this.state.metadata
                        ? React.createElement(App, {"basePath": this.state.basePath, "metadata": this.state.metadata, "name": this.props.params.name})
                        : null;
                };
                return AutoQuery;
            })(React.Component);
            exports_1("default", AutoQuery);
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
                    var operationState = {};
                    var json = localStorage.getItem("v1/operationState");
                    if (json)
                        operationState = JSON.parse(json);
                    this.state = {
                        sidebarHidden: false, selected: null,
                        operationState: operationState, operationNames: operationNames, viewerArgs: viewerArgs, operations: operations, types: types
                    };
                }
                App.prototype.resolveProperties = function (type) {
                    var props = (type.properties || []).slice(0);
                    var inherits = type.inherits;
                    while (inherits) {
                        var t = this.state.types[inherits.name];
                        if (!t && !t.properties)
                            continue;
                        t.properties.forEach(function (p) { return props.push(p); });
                        inherits = t.inherits;
                    }
                    return props;
                };
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
                App.prototype.getTitle = function (selected) {
                    return selected
                        ? this.getAutoQueryViewerArgValue(selected.name, 'Title') || selected.name
                        : null;
                };
                App.prototype.getOperationValues = function (name) {
                    var viewerArgs = this.state.viewerArgs[name] || {};
                    return Object.assign({
                        searchField: viewerArgs["DefaultSearchField"] || "",
                        searchType: viewerArgs["DefaultSearchType"] || "",
                        searchText: viewerArgs["DefaultSearchText"],
                        conditions: []
                    }, this.state.operationState[name] || {});
                };
                App.prototype.getSelected = function (name) {
                    var operation = this.state.operations[name];
                    if (operation == null)
                        return null;
                    var requestType = this.state.types[name];
                    var fromType = this.state.types[operation.from];
                    var toType = this.state.types[operation.to];
                    return {
                        name: name, operation: operation, requestType: requestType,
                        fromType: fromType, fromTypeFields: this.resolveProperties(toType),
                        toType: toType, toTypeFields: this.resolveProperties(toType)
                    };
                };
                App.prototype.onOperationChange = function (name, newValues) {
                    var op = this.getOperationValues(name);
                    Object.keys(newValues).forEach(function (k) {
                        if (newValues[k] != null)
                            op[k] = newValues[k];
                    });
                    this.setOperationValues(name, op);
                };
                App.prototype.addCondition = function (name) {
                    var op = this.getOperationValues(name);
                    var condition = {
                        id: op.searchField + "|" + op.searchType + "|" + op.searchText,
                        searchField: op.searchField,
                        searchType: op.searchType,
                        searchText: op.searchText
                    };
                    if (op.conditions.some(function (x) { return x.id === condition.id; }))
                        return;
                    op.searchText = "";
                    op.conditions.push(condition);
                    this.setOperationValues(name, op);
                };
                App.prototype.removeCondition = function (name, condition) {
                    var op = this.getOperationValues(name);
                    op.conditions = op.conditions.filter(function (x) { return x.id !== condition.id; });
                    this.setOperationValues(name, op);
                };
                App.prototype.setOperationValues = function (name, op) {
                    var operationState = Object.assign({}, this.state.operationState);
                    operationState[name] = op;
                    this.setState({ operationState: operationState });
                    localStorage.setItem("v1/operationState", JSON.stringify(operationState));
                };
                App.prototype.showDialog = function (dialog) {
                    this.setState({ dialog: dialog });
                    setTimeout(function () { return document.getElementById(dialog).classList.toggle('active'); }, 0);
                };
                App.prototype.hideDialog = function () {
                    this.setState({ dialog: null });
                };
                App.prototype.render = function () {
                    var _this = this;
                    var selected = this.getSelected(this.props.name);
                    var opName = selected && selected.name;
                    return (React.createElement("div", {"style": { height: '100%' }}, React.createElement(Header_1.default, {"title": this.getTitle(selected), "onSidebarToggle": function (e) { return _this.toggleSidebar(); }}), React.createElement("div", {"id": "body", "style": { display: 'flex', height: '100%' }}, React.createElement("div", {"style": { height: '100%', display: 'flex', flexDirection: 'row' }}, React.createElement(Sidebar_1.default, {"basePath": this.props.basePath, "hide": this.state.sidebarHidden, "name": opName, "viewerArgs": this.state.viewerArgs, "operations": this.state.operations}), React.createElement(Content_1.default, {"config": this.props.metadata.config, "selected": selected, "values": this.getOperationValues(this.props.name), "conventions": this.props.metadata.config.implicitconventions, "viewerArgs": this.state.viewerArgs[opName], "onChange": function (args) { return _this.onOperationChange(opName, args); }, "onAddCondition": function (e) { return _this.addCondition(opName); }, "onRemoveCondition": function (c) { return _this.removeCondition(opName, c); }, "onShowDialog": function (id) { return _this.showDialog(id); }}))), this.state.dialog !== "column-prefs-dialog" ? null : (React.createElement(ColumnPrefsDialog_1.default, {"onClose": function (e) { return _this.hideDialog(); }, "fields": selected.toTypeFields, "values": this.getOperationValues(this.props.name), "onChange": function (args) { return _this.onOperationChange(opName, args); }}))));
                };
                return App;
            })(React.Component);
        }
    }
});
//# sourceMappingURL=AutoQuery.js.map