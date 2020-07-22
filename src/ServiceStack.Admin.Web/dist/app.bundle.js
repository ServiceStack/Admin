webpackJsonp([0],{

/***/ 102:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
__webpack_require__(255);
__webpack_require__(256);
__webpack_require__(254);
var React = __webpack_require__(5);
var react_dom_1 = __webpack_require__(65);
var react_router_1 = __webpack_require__(7);
var react_router_dom_1 = __webpack_require__(40);
var shared_1 = __webpack_require__(24);
var AutoQuery_1 = __webpack_require__(105);
var AdminApp = (function (_super) {
    __extends(AdminApp, _super);
    function AdminApp() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    AdminApp.prototype.render = function () {
        return React.createElement(AutoQuery_1.default, { match: { params: { name: "" } } });
    };
    return AdminApp;
}(React.Component));
var AppPath = shared_1.BasePath + "ss_admin";
var AutoQueryPath = AppPath + "/autoquery";
react_dom_1.render((React.createElement(react_router_dom_1.BrowserRouter, null,
    React.createElement("div", null,
        React.createElement(react_router_dom_1.Route, { exact: true, path: AppPath, render: function () {
                return React.createElement(react_router_1.Redirect, { from: AppPath, to: AutoQueryPath });
            } }),
        React.createElement(react_router_dom_1.Route, { exact: true, path: AutoQueryPath, component: AutoQuery_1.default }),
        React.createElement(react_router_dom_1.Route, { path: AutoQueryPath + "/:name", component: AutoQuery_1.default })))), document.getElementById('app'));


/***/ }),

/***/ 105:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__(5);
var Header_1 = __webpack_require__(108);
var Sidebar_1 = __webpack_require__(110);
var Content_1 = __webpack_require__(107);
var ColumnPrefsDialog_1 = __webpack_require__(106);
var shared_1 = __webpack_require__(24);
var AutoQuery = (function (_super) {
    __extends(AutoQuery, _super);
    function AutoQuery(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.state = { metadata: null };
        shared_1.client.get("/autoquery/metadata").then(function (r) {
            var metadata = shared_1.normalize(r, true);
            _this.setState({ metadata: metadata, name: _this.getName() });
        });
        return _this;
    }
    AutoQuery.prototype.render = function () {
        return this.state.metadata
            ? React.createElement(App, { metadata: this.state.metadata, name: this.getName() })
            : null;
    };
    AutoQuery.prototype.getName = function () {
        return this.props.match.params.name || "";
    };
    return AutoQuery;
}(React.Component));
exports.default = AutoQuery;
var App = (function (_super) {
    __extends(App, _super);
    function App(props, context) {
        var _this = _super.call(this, props, context) || this;
        var operationNames = _this.props.metadata.operations.map(function (op) { return op.request; });
        var viewerArgs = {}, operations = {}, types = {};
        operationNames.forEach(function (name) {
            viewerArgs[name] = {};
            var aqViewer = _this.getAutoQueryViewer(name);
            if (aqViewer && aqViewer.args) {
                aqViewer.args.forEach(function (arg) { return viewerArgs[name][arg.name] = arg.value; });
            }
            operations[name] = _this.props.metadata.operations.filter(function (op) { return op.request === name; })[0];
        });
        console.log(_this.props.metadata);
        _this.props.metadata.types.forEach(function (t) { return types[t.name] = t; });
        var operationState = {};
        var json = localStorage.getItem("v1/operationState");
        if (json)
            operationState = JSON.parse(json);
        _this.state = {
            sidebarHidden: false, selected: null,
            operationState: operationState, operationNames: operationNames, viewerArgs: viewerArgs, operations: operations, types: types
        };
        return _this;
    }
    App.prototype.resolveProperties = function (type) {
        var props = (type.properties || []).slice(0);
        var inherits = type.inherits;
        while (inherits) {
            var t = this.state.types[inherits.name];
            if (!t || !t.properties)
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
            conditions: [],
            queries: []
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
    App.prototype.onOperationChange = function (opName, newValues) {
        var op = this.getOperationValues(opName);
        Object.keys(newValues).forEach(function (k) {
            if (newValues[k] != null)
                op[k] = newValues[k];
        });
        this.setOperationValues(opName, op);
    };
    App.prototype.addCondition = function (opName) {
        var op = this.getOperationValues(opName);
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
        this.setOperationValues(opName, op);
    };
    App.prototype.removeCondition = function (opName, condition) {
        var op = this.getOperationValues(opName);
        op.conditions = op.conditions.filter(function (x) { return x.id !== condition.id; });
        this.setOperationValues(opName, op);
    };
    App.prototype.setOperationValues = function (opName, op) {
        var operationState = Object.assign({}, this.state.operationState);
        operationState[opName] = op;
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
    App.prototype.saveQuery = function (opName) {
        var name = prompt("Save Query as:", "My Query");
        if (!name)
            return;
        var op = this.getOperationValues(opName);
        if (!op.queries) {
            op.queries = [];
        }
        op.queries.push({
            name: name,
            searchField: op.searchField,
            searchType: op.searchType,
            searchText: op.searchText,
            conditions: op.conditions.map(function (x) { return Object.assign({}, x); })
        });
        this.setOperationValues(opName, op);
    };
    App.prototype.removeQuery = function (opName, query) {
        var op = this.getOperationValues(opName);
        if (!op.queries)
            return;
        op.queries = op.queries.filter(function (x) { return x.name != query.name; });
        this.setOperationValues(opName, op);
    };
    App.prototype.loadQuery = function (opName, query) {
        var op = this.getOperationValues(opName);
        op.searchField = query.searchField;
        op.searchType = query.searchType;
        op.searchText = query.searchText;
        op.conditions = query.conditions;
        this.setOperationValues(opName, op);
    };
    App.prototype.render = function () {
        var _this = this;
        var selected = this.getSelected(this.props.name);
        var opName = selected && selected.name;
        return (React.createElement("div", { style: { height: '100%' } },
            React.createElement(Header_1.default, { title: this.getTitle(selected), onSidebarToggle: function (e) { return _this.toggleSidebar(); } }),
            React.createElement("div", { id: "body", className: this.state.sidebarHidden ? 'hide-sidebar' : '' },
                React.createElement("div", { className: "inner" },
                    React.createElement(Sidebar_1.default, { name: opName, viewerArgs: this.state.viewerArgs, operations: this.state.operations }),
                    React.createElement(Content_1.default, { config: this.props.metadata.config, userinfo: this.props.metadata.userinfo, selected: selected, values: this.getOperationValues(this.props.name), conventions: this.props.metadata.config.implicitconventions, viewerArgs: this.state.viewerArgs[opName], onChange: function (args) { return _this.onOperationChange(opName, args); }, onAddCondition: function (e) { return _this.addCondition(opName); }, onRemoveCondition: function (c) { return _this.removeCondition(opName, c); }, onShowDialog: function (id) { return _this.showDialog(id); }, onSaveQuery: function () { return _this.saveQuery(opName); }, onRemoveQuery: function (x) { return _this.removeQuery(opName, x); }, onLoadQuery: function (x) { return _this.loadQuery(opName, x); } }))),
            this.state.dialog !== "column-prefs-dialog" ? null : (React.createElement(ColumnPrefsDialog_1.default, { onClose: function (e) { return _this.hideDialog(); }, fields: selected.toTypeFields, values: this.getOperationValues(this.props.name), onChange: function (args) { return _this.onOperationChange(opName, args); } }))));
    };
    return App;
}(React.Component));


/***/ }),

/***/ 106:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__(5);
var ColumnPrefsDialog = (function (_super) {
    __extends(ColumnPrefsDialog, _super);
    function ColumnPrefsDialog(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.state = {};
        return _this;
    }
    ColumnPrefsDialog.prototype.resetFields = function () {
        var fields = [];
        this.props.onChange({ fields: fields });
    };
    ColumnPrefsDialog.prototype.selectField = function (field) {
        var fields = (this.props.values.fields || []);
        if (fields.indexOf(field) >= 0)
            fields = fields.filter(function (x) { return x !== field; });
        else
            fields.push(field);
        this.props.onChange({ fields: fields });
    };
    ColumnPrefsDialog.prototype.render = function () {
        var _this = this;
        var fields = (this.props.values.fields || []);
        var CheckboxStyle = {
            verticalAlign: 'text-bottom', fontSize: '20px', margin: '0 5px 0 0'
        };
        return (React.createElement("div", { id: "column-prefs-dialog" },
            React.createElement("div", { className: "dialog-wrapper", onClick: function (e) { return _this.props.onClose(); } },
                React.createElement("div", { className: "dialog", onClick: function (e) { return e.stopPropagation(); } },
                    React.createElement("div", { className: "dialog-header" },
                        React.createElement("h3", null, "Column Preferences")),
                    React.createElement("div", { className: "dialog-body" },
                        React.createElement("div", { onClick: function (e) { return _this.resetFields(); }, style: {
                                borderBottom: '1px solid #ccc', padding: '0 0 10px 0', margin: '0 0 15px 0', cursor: 'pointer'
                            } },
                            React.createElement("i", { className: "material-icons", style: CheckboxStyle }, fields.length === 0 ? 'radio_button_checked' : 'radio_button_unchecked'),
                            React.createElement("span", null, "Show all columns")),
                        this.props.fields.map(function (f) { return (React.createElement("div", { onClick: function (e) { return _this.selectField(f.name); }, style: { margin: '0 0 5px 0', cursor: 'pointer' } },
                            React.createElement("i", { className: "material-icons", style: CheckboxStyle }, fields.indexOf(f.name) >= 0 ? 'check_box' : 'check_box_outline_blank'),
                            React.createElement("span", null, f.name))); })),
                    React.createElement("div", { className: "dialog-footer", style: { textAlign: 'right' } },
                        React.createElement("div", { className: "btnText", onClick: function (e) { return _this.props.onClose(); } },
                            React.createElement("span", null, "DONE")))))));
    };
    return ColumnPrefsDialog;
}(React.Component));
exports.default = ColumnPrefsDialog;


/***/ }),

/***/ 107:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__(5);
var Results_1 = __webpack_require__(109);
var servicestack_client_1 = __webpack_require__(23);
var shared_1 = __webpack_require__(24);
var Content = (function (_super) {
    __extends(Content, _super);
    function Content(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.state = { results: null };
        return _this;
    }
    Content.prototype.selectField = function (e) {
        var searchField = e.target.options[e.target.selectedIndex].value, searchType = this.props.values.searchType, searchText = this.props.values.searchText;
        var f = this.getSearchField(searchField);
        if (this.isIntField(f)) {
            if (isNaN(searchText))
                searchText = '';
            var convention = this.props.conventions.filter(function (c) { return c.name === searchType; })[0];
            if (!this.matchesConvention(convention, f.type))
                searchType = '';
        }
        this.props.onChange({ searchField: searchField, searchType: searchType, searchText: searchText });
    };
    Content.prototype.selectOperand = function (e) {
        this.props.onChange({ searchType: e.target.options[e.target.selectedIndex].value });
    };
    Content.prototype.changeText = function (e) {
        this.props.onChange({ searchText: e.target.value });
    };
    Content.prototype.selectFormat = function (format) {
        if (format === this.props.values.format)
            format = "";
        this.props.onChange({ format: format });
    };
    Content.prototype.clear = function () {
        this.props.onChange({
            searchField: null, searchType: null, searchText: '', format: '', orderBy: '', offset: 0,
            fields: [], conditions: []
        });
    };
    Content.prototype.getAutoQueryUrl = function (format) {
        var firstRoute = (this.props.selected.operation.routes || []).filter(function (x) { return x.path.indexOf('{') === -1; })[0];
        var path = firstRoute
            ? firstRoute.path
            : "/" + (format || 'html') + "/reply/" + this.props.selected.requestType.name;
        var url = servicestack_client_1.combinePaths(this.props.config.servicebaseurl, path);
        if (firstRoute && format)
            url += "." + format;
        this.getArgs().forEach(function (arg) {
            return url = servicestack_client_1.createUrl(url, arg);
        });
        if (this.props.values.offset)
            url = servicestack_client_1.createUrl(url, { skip: this.props.values.offset });
        if (this.props.values.orderBy)
            url = servicestack_client_1.createUrl(url, { orderBy: this.props.values.orderBy });
        if ((this.props.values.fields || []).length > 0) {
            url = servicestack_client_1.createUrl(url, { fields: this.props.values.fields.join(',') });
            if (!format || format === 'html')
                url = servicestack_client_1.createUrl(url, { jsconfig: 'edv' });
        }
        url = servicestack_client_1.createUrl(url, { include: "Total" });
        url = url.replace(/%2C/g, ",");
        return url;
    };
    Content.prototype.isValidCondition = function () {
        var _a = this.props.values, searchField = _a.searchField, searchType = _a.searchType, searchText = _a.searchText;
        return searchField && searchType && searchText
            && (searchType.toLowerCase() !== 'between' || (searchText.indexOf(',') > 0 && searchText.indexOf(',') < searchText.length - 1));
    };
    Content.prototype.isDirty = function () {
        return this.isValidCondition()
            || this.props.values.format
            || this.props.values.offset
            || (this.props.values.fields || []).length > 0
            || this.props.values.orderBy
            || (this.props.values.conditions || []).length > 0;
    };
    Content.prototype.getArgs = function () {
        var _this = this;
        var args = [];
        var conditions = (this.props.values.conditions || []).slice(0);
        if (this.isValidCondition()) {
            conditions.push(this.props.values);
        }
        conditions.forEach(function (condition) {
            var searchField = condition.searchField, searchType = condition.searchType, searchText = condition.searchText;
            var convention = _this.props.conventions.filter(function (c) { return c.name === searchType; })[0];
            if (convention) {
                var field = convention.value.replace("%", searchField);
                args.push((_a = {}, _a[field] = searchText, _a));
            }
            var _a;
        });
        return args;
    };
    Content.prototype.getSearchField = function (name) {
        return this.props.selected.fromTypeFields.filter(function (f) { return f.name === name; })[0];
    };
    Content.prototype.isIntField = function (f) {
        return f && (f.type || '').toLowerCase().startsWith('int');
    };
    Content.prototype.matchesConvention = function (convention, fieldType) {
        return !convention || !convention.types || !fieldType ||
            convention.types.replace(/ /g, '').toLowerCase().split(',').indexOf(fieldType.toLowerCase()) >= 0;
    };
    Content.prototype.getConventions = function () {
        var _this = this;
        var values = this.props.values;
        if (values && values.searchField) {
            var f_1 = this.getSearchField(values.searchField);
            if (f_1) {
                return this.props.conventions.filter(function (c) { return _this.matchesConvention(c, f_1.type); });
            }
        }
        return this.props.conventions;
    };
    Content.prototype.renderResults = function (response) {
        var _this = this;
        var fieldNames = null, fieldWidths = null;
        var fieldDefs = (this.props.viewerArgs["DefaultFields"] || "")
            .split(',')
            .filter(function (x) { return x.trim().length > 0; });
        if (fieldDefs.length > 0) {
            fieldNames = [], fieldWidths = {};
            fieldDefs.forEach(function (x) {
                var parts = servicestack_client_1.splitOnFirst(x, ':');
                fieldNames.push(parts[0]);
                if (parts.length > 1)
                    fieldWidths[parts[0]] = parts[1];
            });
        }
        var offset = response.offset, results = response.results, total = response.total, maxLimit = this.props.config.maxlimit;
        var Control = function (name, enable, offset) { return enable
            ? React.createElement("i", { className: "material-icons", style: { cursor: 'pointer' }, onClick: function (e) { return _this.props.onChange({ offset: offset }); } }, name)
            : React.createElement("i", { className: "material-icons", style: { color: '#ccc' } }, name); };
        var Paging = (React.createElement("span", { className: "paging", style: { padding: '0 10px 0 0' } },
            Control("skip_previous", offset > 0, 0),
            Control("chevron_left", offset > 0, Math.max(offset - maxLimit, 0)),
            Control("chevron_right", offset + maxLimit < total, offset + maxLimit),
            Control("skip_next", offset + maxLimit < total, Math.floor((total - 1) / maxLimit) * maxLimit)));
        return response.results.length === 0
            ? React.createElement("div", { className: "results-none" }, "There were no results")
            : (React.createElement("div", null,
                React.createElement("div", { className: "noselect", style: { color: '#757575', padding: '15px 0' } },
                    Paging,
                    React.createElement("span", null,
                        "Showing Results ",
                        offset + 1,
                        " - ",
                        offset + results.length,
                        " of ",
                        total),
                    React.createElement("i", { className: "material-icons", title: "show/hide columns", onClick: function (e) { return _this.props.onShowDialog('column-prefs-dialog'); }, style: {
                            verticalAlign: 'text-bottom', margin: '0 0 0 10px', cursor: 'pointer', fontSize: '20px'
                        } }, "view_list")),
                React.createElement(Results_1.default, { results: response.results, fieldNames: fieldNames, fieldWidths: fieldWidths, selected: this.props.selected, values: this.props.values, onOrderByChange: function (orderBy) { return _this.props.onChange({ orderBy: orderBy }); } })));
    };
    Content.prototype.renderBody = function (op, values) {
        var _this = this;
        var url = this.getAutoQueryUrl(this.props.values.format);
        var name = this.props.selected.name;
        var loadingNewQuery = this.state.url !== url;
        if (loadingNewQuery) {
            var newUrl = this.getAutoQueryUrl("json");
            newUrl = servicestack_client_1.createUrl(newUrl, { jsconfig: 'DateHandler:ISO8601DateOnly,TimeSpanHandler:StandardFormat' });
            shared_1.client.get(newUrl)
                .then(function (r) {
                var response = shared_1.normalize(r);
                response.url = url;
                _this.setState({ url: url, name: name, response: response, error: null });
            })
                .catch(function (r) {
                var status = r.responseStatus;
                _this.setState({ url: url, name: name, response: null, error: status.errorCode + ": " + status.message });
            });
        }
        var queries = (this.props.values.queries || []);
        return (React.createElement("div", null,
            React.createElement("div", { id: "query-title" }, this.props.viewerArgs["Description"]),
            React.createElement("div", { id: "url", style: { padding: '0 0 10px 0', whiteSpace: 'nowrap' } },
                React.createElement("a", { href: url, target: "_blank" }, url),
                !this.isDirty() ? null : (React.createElement("i", { className: "material-icons noselect", title: "reset query", onClick: function (e) { return _this.clear(); }, style: {
                        padding: '0 0 0 5px', color: '#757575', fontSize: '16px', verticalAlign: 'bottom', cursor: 'pointer'
                    } }, "clear"))),
            React.createElement("select", { value: values.searchField, onChange: function (e) { return _this.selectField(e); } },
                React.createElement("option", null),
                op.fromTypeFields.map(function (f) { return React.createElement("option", { key: f.name }, f.name); })),
            React.createElement("select", { value: values.searchType, onChange: function (e) { return _this.selectOperand(e); } },
                React.createElement("option", null),
                this.getConventions().map(function (c) { return React.createElement("option", { key: c.name }, c.name); })),
            React.createElement("input", { type: "text", id: "txtSearch", value: values.searchText, autoComplete: "off", onChange: function (e) { return _this.changeText(e); }, onKeyDown: function (e) { return e.keyCode === 13 ? _this.props.onAddCondition() : null; } }),
            this.isValidCondition()
                ? (React.createElement("i", { className: "material-icons", style: { fontSize: '30px', verticalAlign: 'bottom', color: '#00C853', cursor: 'pointer' }, onClick: function (e) { return _this.props.onAddCondition(); }, title: "Add condition" }, "add_circle"))
                : (React.createElement("i", { className: "material-icons", style: { fontSize: '30px', verticalAlign: 'bottom', color: '#ccc' }, title: "Incomplete condition" }, "add_circle")),
            !this.props.config.formats || this.props.config.formats.length === 0 ? null : (React.createElement("span", { className: "formats noselect" }, this.props.config.formats.map(function (f) {
                return React.createElement("span", { key: f, className: values.format === f ? 'active' : '', onClick: function (e) { return _this.selectFormat(f); } }, f);
            }))),
            this.props.values.conditions.length + queries.length > 0 ?
                (React.createElement("div", null,
                    React.createElement("div", { className: "conditions" }, this.props.values.conditions.map(function (c) { return (React.createElement("div", { key: c.id },
                        React.createElement("i", { className: "material-icons", style: { color: '#db4437', cursor: 'pointer', padding: '0 5px 0 0' }, title: "remove condition", onClick: function (e) { return _this.props.onRemoveCondition(c); } }, "remove_circle"),
                        c.searchField,
                        " ",
                        c.searchType,
                        " ",
                        c.searchText)); })),
                    this.props.values.conditions.length > 0
                        ? (React.createElement("div", { style: { display: 'inline-block', verticalAlign: 'top', padding: 10 } },
                            React.createElement("i", { title: "Save Query", className: "material-icons", style: { fontSize: '24px', color: '#444', cursor: 'pointer' }, onClick: function (e) { return _this.props.onSaveQuery(); } }, "save")))
                        : null,
                    React.createElement("div", { className: "queries" }, queries.map(function (x) { return (React.createElement("div", null,
                        React.createElement("i", { className: "material-icons", style: { color: '#db4437', cursor: 'pointer', padding: '0 5px 0 0' }, title: "remove query", onClick: function (e) { return _this.props.onRemoveQuery(x); } }, "remove_circle"),
                        React.createElement("span", { className: "lnk", title: "load query", onClick: function (e) { return _this.props.onLoadQuery(x); } }, x.name))); }))))
                : null,
            this.state.response
                ? (!loadingNewQuery || name === this.state.name
                    ? this.renderResults(this.state.response)
                    : (React.createElement("div", { style: { color: '#757575', padding: '20px 0 0 0' } },
                        React.createElement("i", { className: "material-icons spin", style: { fontSize: '20px', verticalAlign: 'text-bottom' } }, "cached"),
                        React.createElement("span", { style: { padding: '0 0 0 5px' } }, "loading results..."))))
                : this.state.error
                    ? React.createElement("div", { style: { color: '#db4437', padding: 5 } }, this.state.error)
                    : null));
    };
    Content.prototype.render = function () {
        var isMsEdge = /Edge/.test(navigator.userAgent);
        return (React.createElement("div", { id: "content" },
            React.createElement("div", { className: "inner" },
                React.createElement("table", null,
                    React.createElement("tbody", null,
                        React.createElement("tr", null,
                            isMsEdge ? React.createElement("td", { style: { minWidth: '20px' } }) : null,
                            React.createElement("td", null, this.props.selected
                                ? this.renderBody(this.props.selected, this.props.values)
                                : (React.createElement("div", { style: { padding: '15px 0', fontSize: '20px', color: '#757575' } },
                                    React.createElement("i", { className: "material-icons", style: { verticalAlign: 'bottom', margin: '0 10px 0 0' } }, "arrow_back"),
                                    this.props.userinfo.querycount > 0
                                        ? "Please Select a Query"
                                        : this.props.userinfo.isauthenticated
                                            ? "There are no queries available"
                                            : "Please Sign In to see your available queries"))),
                            !isMsEdge ? React.createElement("td", { style: { minWidth: '20px' } }) : null))))));
    };
    return Content;
}(React.Component));
exports.default = Content;


/***/ }),

/***/ 108:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__(5);
var Header = (function (_super) {
    __extends(Header, _super);
    function Header() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Header.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", { id: "header", style: { margin: 'auto', display: 'flex', flexDirection: 'row' } },
            React.createElement("i", { className: "material-icons", style: { cursor: 'pointer' }, onClick: function (e) { return _this.props.onSidebarToggle(); } }, "menu"),
            React.createElement("h1", null, "AutoQuery"),
            this.props.title == null ? React.createElement("div", { style: { flex: 1 } }) : (React.createElement("div", { id: "header-content", style: { display: 'flex', flex: 1 } },
                React.createElement("div", null,
                    React.createElement("div", { className: "seperator" })),
                React.createElement("h2", null, this.props.title),
                React.createElement("div", { style: { margin: 'auto', flex: 1 } })))));
    };
    return Header;
}(React.Component));
exports.default = Header;


/***/ }),

/***/ 109:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__(5);
var shared_1 = __webpack_require__(24);
var servicestack_client_1 = __webpack_require__(23);
var Results = (function (_super) {
    __extends(Results, _super);
    function Results() {
        return _super !== null && _super.apply(this, arguments) || this;
    }
    Results.prototype.renderValue = function (o) {
        return Array.isArray(o)
            ? o.join(', ')
            : typeof o == "undefined"
                ? ""
                : typeof o == "object"
                    ? JSON.stringify(o)
                    : o + "";
    };
    Results.prototype.formatString = function (s) {
        if (s) {
            if (s.startsWith("http"))
                return React.createElement("a", { href: s, target: "_blank" }, s.substring(s.indexOf('://') + 3));
            if (s.toLowerCase() === "false")
                return React.createElement("i", { className: "material-icons", style: { color: '#757575', fontSize: '14px' } }, "check_box_outline_blank");
            if (s.toLowerCase() === "true")
                return React.createElement("i", { className: "material-icons", style: { color: '#66BB6A', fontSize: '14px' } }, "check_box");
        }
        return React.createElement("span", null, s);
    };
    Results.prototype.render = function () {
        var _this = this;
        var Results = React.createElement("div", { className: "results-none" }, "There were no results");
        var results = this.props.results;
        if (results && results.length > 0) {
            var fieldNames = this.props.values.fields || [];
            if (fieldNames.length === 0) {
                fieldNames = this.props.fieldNames ||
                    this.props.selected.toTypeFields.map(function (x) { return x.name; });
            }
            var fieldWidths = this.props.fieldWidths || {};
            var orderBy = (this.props.values.orderBy || '');
            var orderByName = orderBy.startsWith('-') ? orderBy.substr(1) : orderBy;
            Results = (React.createElement("table", { className: "results" },
                React.createElement("thead", null,
                    React.createElement("tr", { className: "noselect" }, fieldNames.map(function (f) { return (React.createElement("th", { key: f, style: { cursor: 'pointer' }, onClick: function (e) { return _this.props.onOrderByChange(f !== orderByName ? '-' + f : !orderBy.startsWith('-') ? '' : orderByName); } },
                        servicestack_client_1.humanize(f),
                        f !== orderByName ? null :
                            React.createElement("i", { className: "material-icons", style: { fontSize: '18px', verticalAlign: 'bottom' } }, orderBy.startsWith('-') ? "arrow_drop_down" : "arrow_drop_up"))); }))),
                React.createElement("tbody", null, results.map(function (r, i) { return (React.createElement("tr", { key: i }, fieldNames.map(function (f, j) { return (React.createElement("td", { key: j, title: _this.renderValue(shared_1.getField(r, f)), style: shared_1.getField(fieldWidths, f) ? { maxWidth: parseInt(shared_1.getField(fieldWidths, f)) } : {} }, _this.formatString(_this.renderValue(shared_1.getField(r, f))))); }))); }))));
        }
        return Results;
    };
    return Results;
}(React.Component));
exports.default = Results;


/***/ }),

/***/ 110:
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var __extends = (this && this.__extends) || (function () {
    var extendStatics = Object.setPrototypeOf ||
        ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
        function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
var React = __webpack_require__(5);
var react_router_dom_1 = __webpack_require__(40);
var servicestack_client_1 = __webpack_require__(23);
var shared_1 = __webpack_require__(24);
var Sidebar = (function (_super) {
    __extends(Sidebar, _super);
    function Sidebar(props, context) {
        var _this = _super.call(this, props, context) || this;
        _this.state = { filter: undefined };
        return _this;
    }
    Sidebar.prototype.handleFilter = function (e) {
        this.setState({ filter: e.target.value.toLowerCase() });
    };
    Sidebar.prototype.renderIcon = function (name) {
        var iconUrl = this.props.viewerArgs[name]["IconUrl"];
        if (iconUrl) {
            if (iconUrl.startsWith('material-icons:'))
                return (React.createElement("i", { className: "material-icons" }, servicestack_client_1.splitOnFirst(iconUrl, ':')[1]));
            if (iconUrl.startsWith('octicon:'))
                return (React.createElement("span", { className: "mega-octicon octicon-" + servicestack_client_1.splitOnFirst(iconUrl, ':')[1] }));
            return (React.createElement("img", { src: iconUrl }));
        }
        return (React.createElement("i", { className: "material-icons" }, "search"));
    };
    Sidebar.prototype.render = function () {
        var _this = this;
        return (React.createElement("div", { id: "sidebar" },
            React.createElement("div", { className: "inner" },
                React.createElement("div", { id: "aq-filter" },
                    React.createElement("input", { type: "text", placeholder: "filter", style: { margin: "10px 15px" }, onChange: function (e) { return _this.handleFilter(e); }, value: this.state.filter })),
                React.createElement("div", { id: "aq-list" }, Object.keys(this.props.operations)
                    .filter(function (op) { return _this.state.filter == null || op.toLowerCase().indexOf(_this.state.filter) >= 0; })
                    .map(function (op, i) { return (React.createElement("div", { key: i, className: "aq-item" + (op === _this.props.name ? " active" : "") },
                    _this.renderIcon(op),
                    React.createElement(react_router_dom_1.Link, { to: shared_1.BasePath + "ss_admin/autoquery/" + op }, _this.props.viewerArgs[op]["Name"] || op))); })))));
    };
    return Sidebar;
}(React.Component));
exports.default = Sidebar;


/***/ }),

/***/ 111:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(41)(undefined);
// imports


// module
exports.push([module.i, "html, body{\r\n  height:100%;\r\n}\r\nbody {\r\n    font-family: 'Roboto', sans-serif;\r\n    margin: 0;\r\n    background: #eee;\r\n}\r\n\r\nh1, h2, h3, h4, h5, h6, form {\r\n    margin: 0;\r\n    padding: 0;\r\n}\r\n\r\ninput, select, button {\r\n    padding: 4px 8px;\r\n    margin: 0 5px 0 0;\r\n}\r\na {\r\n    color: #428bca;\r\n}\r\n\r\ntable {\r\n    margin: 0;\r\n    padding: 0;\r\n    border-collapse: collapse;\r\n}\r\ntable.results {\r\n    -webkit-box-shadow: 0 1px 4px 0 rgba(0,0,0,0.14);\r\n            box-shadow: 0 1px 4px 0 rgba(0,0,0,0.14);\r\n    background: #fefefe;\r\n}\r\ntable.results th {\r\n    text-align: left;\r\n    color: #757575;\r\n    font-size: 13px;\r\n    line-height: 18px;\r\n    border-bottom: 1px solid #e0e0e0;\r\n    padding: 5px;\r\n    overflow: hidden;\r\n    white-space: nowrap;   \r\n}\r\ntable.results td {\r\n    color: #212121;\r\n    font-size: 12px;\r\n    padding: 5px;\r\n    max-width: 300px;\r\n    overflow: hidden;\r\n    white-space: nowrap;   \r\n    text-overflow: ellipsis;\r\n}\r\n\r\n#app {\r\n    height: 100%;\r\n}\r\n\r\n.results-none {\r\n    padding: 15px 0;\r\n}\r\n\r\n#header {\r\n    z-index: 2;\r\n    background: #fff;\r\n    color: #676767;\r\n    -webkit-box-shadow: 0 1px 8px rgba(0,0,0,.3);\r\n            box-shadow: 0 1px 8px rgba(0,0,0,.3);\r\n    position: fixed;\r\n    width: 100%;\r\n    color: #676767;\r\n    padding: 15px 0 15px 15px;\r\n}\r\n    #header > *, #header-content > * {\r\n        margin: auto;\r\n        padding: 0 10px;\r\n    }\r\n    #header table {\r\n        margin: 0;\r\n        border-collapse: collapse;\r\n    }\r\n    #header td {\r\n        height: 30px;\r\n        padding: 0 0 0 20px;\r\n    }\r\n    #header h1, #header h2 {\r\n        font-size: 20px;\r\n        line-height: 40px;\r\n    }\r\n\r\n#txtSearch:focus {\r\n    outline: none;\r\n}\r\n\r\nform:focus {\r\n    border: 1px solid #333;\r\n}\r\n\r\n.seperator {\r\n    background: #ddd;\r\n    width: 1px;\r\n    height: 30px;\r\n}\r\n\r\n#body {\r\n}\r\n#body .inner {\r\n}\r\n\r\n#sidebar {\r\n    z-index: 1;\r\n    background: #eee;\r\n    margin-left: 0;\r\n    -webkit-transition: .3s;\r\n    transition: .3s;\r\n    width: 250px;\r\n    height: 100%;\r\n    position: fixed;\r\n    overflow-y: auto;\r\n    min-width: 250px;\r\n    padding: 0;\r\n}\r\n    #sidebar .inner {\r\n        padding: 90px 0 0 0;\r\n    }\r\n    .hide-sidebar #sidebar {\r\n        margin-left: -250px;\r\n        -webkit-transition: .3s;\r\n        transition: .3s;\r\n        -webkit-transition-timing-function: ease-out;\r\n                transition-timing-function: ease-out;\r\n    }\r\n\r\n#content {\r\n    padding-left: 250px;\r\n}\r\n.hide-sidebar #content {\r\n    padding-left: 0;\r\n    -webkit-transition: .3s;\r\n    transition: .3s;\r\n    -webkit-transition-timing-function: ease-out;\r\n            transition-timing-function: ease-out;\r\n}\r\n#content .inner {\r\n    padding: 90px 0 20px 20px;\r\n}\r\n\r\n#query-title {\r\n    z-index: 2;\r\n    color: #757575;\r\n    position: fixed;\r\n    top: 25px;\r\n    right: 25px;\r\n}\r\n\r\n.aq-item {\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    cursor: pointer;\r\n    overflow: hidden;\r\n    text-overflow: ellipsis;\r\n    white-space: nowrap;\r\n}\r\n    .aq-item i { /*material-icon*/\r\n        color: #757575;\r\n        margin: auto;\r\n        padding: 0 15px;\r\n    }\r\n    .aq-item .mega-octicon { /*octicon*/\r\n        font-size: 24px;\r\n        color: #757575;\r\n        padding: 4px 16px;\r\n        vertical-align: middle;\r\n    }\r\n    .aq-item img {\r\n        width: 24px;\r\n        height: 24px;\r\n        padding: 4px 14px;\r\n        vertical-align: middle;\r\n    }\r\n    .aq-item a {\r\n        display: block;\r\n        text-decoration: none;\r\n        color: rgba(0,0,0,0.87);\r\n        line-height: 40px;\r\n        font-size: 14px;\r\n        -webkit-box-flex: 1;\r\n            -ms-flex: 1;\r\n                flex: 1;\r\n    }\r\n    .aq-item.active, .aq-item:hover {\r\n        background: #e7e7e7;\r\n    }\r\n    .aq-item.active {\r\n        color: #272727;\r\n    }\r\n\r\n.formats {\r\n    padding: 0 0 0 10px;\r\n}\r\n.formats span {\r\n    color: #428bca;\r\n    padding: 0 5px 0 0;\r\n    font-size: 12px;\r\n    cursor: pointer;\r\n}\r\n.formats span.active {\r\n    color: #212121;\r\n}\r\n.conditions {\r\n    color: #757575;\r\n    font-size: 13px;\r\n    padding: 15px;\r\n    line-height: 18px;\r\n    display: inline-block;\r\n}\r\n.conditions .material-icons, .queries .material-icons {\r\n    font-size: 16px;\r\n    vertical-align: text-bottom;\r\n}\r\n.queries {\r\n    display: inline-block;\r\n    vertical-align: top;\r\n    padding: 10px;\r\n}\r\n.lnk {\r\n    color: #428bca;\r\n    font-size: 13px;\r\n    cursor: pointer;\r\n    text-decoration: underline;\r\n}\r\n\r\n.paging i {\r\n    vertical-align: bottom;\r\n}\r\n\r\n.dialog-wrapper {    \r\n    position: fixed;\r\n    top: 0;\r\n    left: 0;\r\n    width: 100%;\r\n    height: 100%;\r\n    overflow: hidden;\r\n    z-index: 2;\r\n}\r\n.active .dialog-wrapper {\r\n    background: rgba(0,0,0,0.1);\r\n    -webkit-transition: .15s cubic-bezier(0.4,0.0,0.2,1) .15s;\r\n    transition: .15s cubic-bezier(0.4,0.0,0.2,1) .15s;\r\n}\r\n\r\n.dialog {\r\n    position: absolute;\r\n    top: 100%;\r\n    left: 50%;\r\n    height: 50%;\r\n    margin: 0 0 0 -300px;\r\n    width: 450px;\r\n    background: #fff;\r\n    -webkit-box-shadow: 0 1px 4px 0 rgba(0,0,0,0.14);\r\n            box-shadow: 0 1px 4px 0 rgba(0,0,0,0.14);\r\n    border-radius: 4px;\r\n    color: #757575;\r\n    display: -webkit-box;\r\n    display: -ms-flexbox;\r\n    display: flex;\r\n    -webkit-box-orient: vertical;\r\n    -webkit-box-direction: normal;\r\n        -ms-flex-direction: column;\r\n            flex-direction: column;\r\n}\r\n.active .dialog {\r\n    top: 25%;\r\n    -webkit-transition: .15s cubic-bezier(0.4,0.0,0.2,1) .15s;\r\n    transition: .15s cubic-bezier(0.4,0.0,0.2,1) .15s;\r\n}\r\n\r\n.dialog {\r\n    padding: 20px;\r\n}\r\n.dialog-header {\r\n    height: 60px;\r\n}\r\n    .dialog-header h3 {\r\n        color: #212121;\r\n    }\r\n\r\n.dialog-body {\r\n    -webkit-box-flex: 1;\r\n        -ms-flex: 1;\r\n            flex: 1;\r\n    overflow-y: auto;\r\n}\r\n.dialog-footer {\r\n    height: 30px;\r\n}\r\n.btnText {\r\n    display: inline-block;\r\n    color: #4285F4;\r\n    font-weight: bold;\r\n    cursor: pointer;\r\n}\r\n.btnText span {\r\n    display: block;\r\n    padding: 6px 12px;\r\n    border-radius: 2px;\r\n}\r\n.btnText:hover span {\r\n    background: rgb(227, 237, 254);\r\n    -webkit-transition: .3s;\r\n    transition: .3s;\r\n    -webkit-transition-timing-function: ease-out;\r\n            transition-timing-function: ease-out;\r\n}\r\n\r\n.spin {\r\n    transform-origin: 50% 50%;\r\n    -webkit-transform-origin: 50% 50%;\r\n    -webkit-animation:spin 1s linear infinite;\r\n    animation: spin 1s linear infinite\r\n}\r\n\r\n@-webkit-keyframes spin { 100% { -webkit-transform: rotate(360deg); } }\r\n@keyframes spin { 100% { -webkit-transform: rotate(360deg); transform:rotate(360deg); } }\r\n\r\n::-webkit-scrollbar {\r\n    width: 7px;\r\n    height: 7px;\r\n}\r\n \r\n::-webkit-scrollbar-track {\r\n    -webkit-box-shadow: inset 0 0 2px rgba(0,0,0,0.3);\r\n}\r\n \r\n::-webkit-scrollbar-thumb {\r\n  background-color: darkgrey;\r\n  outline: 1px solid slategrey;\r\n}\r\n\r\n\r\n.noselect {\r\n  -webkit-touch-callout: none; /* iOS Safari */\r\n  -webkit-user-select: none;   /* Chrome/Safari/Opera */\r\n  -moz-user-select: none;      /* Firefox */\r\n  -ms-user-select: none;       /* IE/Edge */\r\n  user-select: none;           /* non-prefixed version, currently\r\n                                  not supported by any browser */\r\n}\r\n\r\n/* roboto-regular - latin */\r\n@font-face {\r\n    font-family: 'Roboto';\r\n    font-style: normal;\r\n    font-weight: 400;\r\n    src: local('Roboto'), local('Roboto-Regular'), url(" + __webpack_require__(121) + ") format('woff2'), \r\n    url(" + __webpack_require__(120) + ") format('woff'); /* Chrome 6+, Firefox 3.6+, IE 9+, Safari 5.1+ */\r\n}\r\n@font-face {\r\n  font-family: 'octicons';\r\n  src: url(" + __webpack_require__(119) + ") format('woff'),\r\n       url(" + __webpack_require__(118) + ") format('truetype');\r\n  font-weight: normal;\r\n  font-style: normal;\r\n}\r\n\r\n/*\r\n.octicon is optimized for 16px.\r\n.mega-octicon is optimized for 32px but can be used larger.\r\n*/\r\n.octicon, .mega-octicon {\r\n  font: normal normal normal 16px/1 octicons;\r\n  display: inline-block;\r\n  text-decoration: none;\r\n  text-rendering: auto;\r\n  -webkit-font-smoothing: antialiased;\r\n  -moz-osx-font-smoothing: grayscale;\r\n  -webkit-user-select: none;\r\n  -moz-user-select: none;\r\n  -ms-user-select: none;\r\n  user-select: none;\r\n}\r\n.mega-octicon { font-size: 32px; }\r\n\r\n.octicon-alert:before { content: '\\F02D'} /*  */\r\n.octicon-arrow-down:before { content: '\\F03F'} /*  */\r\n.octicon-arrow-left:before { content: '\\F040'} /*  */\r\n.octicon-arrow-right:before { content: '\\F03E'} /*  */\r\n.octicon-arrow-small-down:before { content: '\\F0A0'} /*  */\r\n.octicon-arrow-small-left:before { content: '\\F0A1'} /*  */\r\n.octicon-arrow-small-right:before { content: '\\F071'} /*  */\r\n.octicon-arrow-small-up:before { content: '\\F09F'} /*  */\r\n.octicon-arrow-up:before { content: '\\F03D'} /*  */\r\n.octicon-microscope:before, .octicon-beaker:before { content: '\\F0DD'} /*  */\r\n.octicon-bell:before { content: '\\F0DE'} /*  */\r\n.octicon-bold:before { content: '\\F0E2'} /*  */\r\n.octicon-book:before { content: '\\F007'} /*  */\r\n.octicon-bookmark:before { content: '\\F07B'} /*  */\r\n.octicon-briefcase:before { content: '\\F0D3'} /*  */\r\n.octicon-broadcast:before { content: '\\F048'} /*  */\r\n.octicon-browser:before { content: '\\F0C5'} /*  */\r\n.octicon-bug:before { content: '\\F091'} /*  */\r\n.octicon-calendar:before { content: '\\F068'} /*  */\r\n.octicon-check:before { content: '\\F03A'} /*  */\r\n.octicon-checklist:before { content: '\\F076'} /*  */\r\n.octicon-chevron-down:before { content: '\\F0A3'} /*  */\r\n.octicon-chevron-left:before { content: '\\F0A4'} /*  */\r\n.octicon-chevron-right:before { content: '\\F078'} /*  */\r\n.octicon-chevron-up:before { content: '\\F0A2'} /*  */\r\n.octicon-circle-slash:before { content: '\\F084'} /*  */\r\n.octicon-circuit-board:before { content: '\\F0D6'} /*  */\r\n.octicon-clippy:before { content: '\\F035'} /*  */\r\n.octicon-clock:before { content: '\\F046'} /*  */\r\n.octicon-cloud-download:before { content: '\\F00B'} /*  */\r\n.octicon-cloud-upload:before { content: '\\F00C'} /*  */\r\n.octicon-code:before { content: '\\F05F'} /*  */\r\n.octicon-comment-add:before, .octicon-comment:before { content: '\\F02B'} /*  */\r\n.octicon-comment-discussion:before { content: '\\F04F'} /*  */\r\n.octicon-credit-card:before { content: '\\F045'} /*  */\r\n.octicon-dash:before { content: '\\F0CA'} /*  */\r\n.octicon-dashboard:before { content: '\\F07D'} /*  */\r\n.octicon-database:before { content: '\\F096'} /*  */\r\n.octicon-clone:before, .octicon-desktop-download:before { content: '\\F0DC'} /*  */\r\n.octicon-device-camera:before { content: '\\F056'} /*  */\r\n.octicon-device-camera-video:before { content: '\\F057'} /*  */\r\n.octicon-device-desktop:before { content: '\\F27C'} /*  */\r\n.octicon-device-mobile:before { content: '\\F038'} /*  */\r\n.octicon-diff:before { content: '\\F04D'} /*  */\r\n.octicon-diff-added:before { content: '\\F06B'} /*  */\r\n.octicon-diff-ignored:before { content: '\\F099'} /*  */\r\n.octicon-diff-modified:before { content: '\\F06D'} /*  */\r\n.octicon-diff-removed:before { content: '\\F06C'} /*  */\r\n.octicon-diff-renamed:before { content: '\\F06E'} /*  */\r\n.octicon-ellipsis:before { content: '\\F09A'} /*  */\r\n.octicon-eye-unwatch:before, .octicon-eye-watch:before, .octicon-eye:before { content: '\\F04E'} /*  */\r\n.octicon-file-binary:before { content: '\\F094'} /*  */\r\n.octicon-file-code:before { content: '\\F010'} /*  */\r\n.octicon-file-directory:before { content: '\\F016'} /*  */\r\n.octicon-file-media:before { content: '\\F012'} /*  */\r\n.octicon-file-pdf:before { content: '\\F014'} /*  */\r\n.octicon-file-submodule:before { content: '\\F017'} /*  */\r\n.octicon-file-symlink-directory:before { content: '\\F0B1'} /*  */\r\n.octicon-file-symlink-file:before { content: '\\F0B0'} /*  */\r\n.octicon-file-text:before { content: '\\F011'} /*  */\r\n.octicon-file-zip:before { content: '\\F013'} /*  */\r\n.octicon-flame:before { content: '\\F0D2'} /*  */\r\n.octicon-fold:before { content: '\\F0CC'} /*  */\r\n.octicon-gear:before { content: '\\F02F'} /*  */\r\n.octicon-gift:before { content: '\\F042'} /*  */\r\n.octicon-gist:before { content: '\\F00E'} /*  */\r\n.octicon-gist-secret:before { content: '\\F08C'} /*  */\r\n.octicon-git-branch-create:before, .octicon-git-branch-delete:before, .octicon-git-branch:before { content: '\\F020'} /*  */\r\n.octicon-git-commit:before { content: '\\F01F'} /*  */\r\n.octicon-git-compare:before { content: '\\F0AC'} /*  */\r\n.octicon-git-merge:before { content: '\\F023'} /*  */\r\n.octicon-git-pull-request-abandoned:before, .octicon-git-pull-request:before { content: '\\F009'} /*  */\r\n.octicon-globe:before { content: '\\F0B6'} /*  */\r\n.octicon-graph:before { content: '\\F043'} /*  */\r\n.octicon-heart:before { content: '\\2665'} /* ♥ */\r\n.octicon-history:before { content: '\\F07E'} /*  */\r\n.octicon-home:before { content: '\\F08D'} /*  */\r\n.octicon-horizontal-rule:before { content: '\\F070'} /*  */\r\n.octicon-hubot:before { content: '\\F09D'} /*  */\r\n.octicon-inbox:before { content: '\\F0CF'} /*  */\r\n.octicon-info:before { content: '\\F059'} /*  */\r\n.octicon-issue-closed:before { content: '\\F028'} /*  */\r\n.octicon-issue-opened:before { content: '\\F026'} /*  */\r\n.octicon-issue-reopened:before { content: '\\F027'} /*  */\r\n.octicon-italic:before { content: '\\F0E4'} /*  */\r\n.octicon-jersey:before { content: '\\F019'} /*  */\r\n.octicon-key:before { content: '\\F049'} /*  */\r\n.octicon-keyboard:before { content: '\\F00D'} /*  */\r\n.octicon-law:before { content: '\\F0D8'} /*  */\r\n.octicon-light-bulb:before { content: '\\F000'} /*  */\r\n.octicon-link:before { content: '\\F05C'} /*  */\r\n.octicon-link-external:before { content: '\\F07F'} /*  */\r\n.octicon-list-ordered:before { content: '\\F062'} /*  */\r\n.octicon-list-unordered:before { content: '\\F061'} /*  */\r\n.octicon-location:before { content: '\\F060'} /*  */\r\n.octicon-gist-private:before, .octicon-mirror-private:before, .octicon-git-fork-private:before, .octicon-lock:before { content: '\\F06A'} /*  */\r\n.octicon-logo-gist:before { content: '\\F0AD'} /*  */\r\n.octicon-logo-github:before { content: '\\F092'} /*  */\r\n.octicon-mail:before { content: '\\F03B'} /*  */\r\n.octicon-mail-read:before { content: '\\F03C'} /*  */\r\n.octicon-mail-reply:before { content: '\\F051'} /*  */\r\n.octicon-mark-github:before { content: '\\F00A'} /*  */\r\n.octicon-markdown:before { content: '\\F0C9'} /*  */\r\n.octicon-megaphone:before { content: '\\F077'} /*  */\r\n.octicon-mention:before { content: '\\F0BE'} /*  */\r\n.octicon-milestone:before { content: '\\F075'} /*  */\r\n.octicon-mirror-public:before, .octicon-mirror:before { content: '\\F024'} /*  */\r\n.octicon-mortar-board:before { content: '\\F0D7'} /*  */\r\n.octicon-mute:before { content: '\\F080'} /*  */\r\n.octicon-no-newline:before { content: '\\F09C'} /*  */\r\n.octicon-octoface:before { content: '\\F008'} /*  */\r\n.octicon-organization:before { content: '\\F037'} /*  */\r\n.octicon-package:before { content: '\\F0C4'} /*  */\r\n.octicon-paintcan:before { content: '\\F0D1'} /*  */\r\n.octicon-pencil:before { content: '\\F058'} /*  */\r\n.octicon-person-add:before, .octicon-person-follow:before, .octicon-person:before { content: '\\F018'} /*  */\r\n.octicon-pin:before { content: '\\F041'} /*  */\r\n.octicon-plug:before { content: '\\F0D4'} /*  */\r\n.octicon-repo-create:before, .octicon-gist-new:before, .octicon-file-directory-create:before, .octicon-file-add:before, .octicon-plus:before { content: '\\F05D'} /*  */\r\n.octicon-primitive-dot:before { content: '\\F052'} /*  */\r\n.octicon-primitive-square:before { content: '\\F053'} /*  */\r\n.octicon-pulse:before { content: '\\F085'} /*  */\r\n.octicon-question:before { content: '\\F02C'} /*  */\r\n.octicon-quote:before { content: '\\F063'} /*  */\r\n.octicon-radio-tower:before { content: '\\F030'} /*  */\r\n.octicon-repo-delete:before, .octicon-repo:before { content: '\\F001'} /*  */\r\n.octicon-repo-clone:before { content: '\\F04C'} /*  */\r\n.octicon-repo-force-push:before { content: '\\F04A'} /*  */\r\n.octicon-gist-fork:before, .octicon-repo-forked:before { content: '\\F002'} /*  */\r\n.octicon-repo-pull:before { content: '\\F006'} /*  */\r\n.octicon-repo-push:before { content: '\\F005'} /*  */\r\n.octicon-rocket:before { content: '\\F033'} /*  */\r\n.octicon-rss:before { content: '\\F034'} /*  */\r\n.octicon-ruby:before { content: '\\F047'} /*  */\r\n.octicon-search-save:before, .octicon-search:before { content: '\\F02E'} /*  */\r\n.octicon-server:before { content: '\\F097'} /*  */\r\n.octicon-settings:before { content: '\\F07C'} /*  */\r\n.octicon-shield:before { content: '\\F0E1'} /*  */\r\n.octicon-log-in:before, .octicon-sign-in:before { content: '\\F036'} /*  */\r\n.octicon-log-out:before, .octicon-sign-out:before { content: '\\F032'} /*  */\r\n.octicon-smiley:before { content: '\\F0E7'} /*  */\r\n.octicon-squirrel:before { content: '\\F0B2'} /*  */\r\n.octicon-star-add:before, .octicon-star-delete:before, .octicon-star:before { content: '\\F02A'} /*  */\r\n.octicon-stop:before { content: '\\F08F'} /*  */\r\n.octicon-repo-sync:before, .octicon-sync:before { content: '\\F087'} /*  */\r\n.octicon-tag-remove:before, .octicon-tag-add:before, .octicon-tag:before { content: '\\F015'} /*  */\r\n.octicon-tasklist:before { content: '\\F0E5'} /*  */\r\n.octicon-telescope:before { content: '\\F088'} /*  */\r\n.octicon-terminal:before { content: '\\F0C8'} /*  */\r\n.octicon-text-size:before { content: '\\F0E3'} /*  */\r\n.octicon-three-bars:before { content: '\\F05E'} /*  */\r\n.octicon-thumbsdown:before { content: '\\F0DB'} /*  */\r\n.octicon-thumbsup:before { content: '\\F0DA'} /*  */\r\n.octicon-tools:before { content: '\\F031'} /*  */\r\n.octicon-trashcan:before { content: '\\F0D0'} /*  */\r\n.octicon-triangle-down:before { content: '\\F05B'} /*  */\r\n.octicon-triangle-left:before { content: '\\F044'} /*  */\r\n.octicon-triangle-right:before { content: '\\F05A'} /*  */\r\n.octicon-triangle-up:before { content: '\\F0AA'} /*  */\r\n.octicon-unfold:before { content: '\\F039'} /*  */\r\n.octicon-unmute:before { content: '\\F0BA'} /*  */\r\n.octicon-verified:before { content: '\\F0E6'} /*  */\r\n.octicon-versions:before { content: '\\F064'} /*  */\r\n.octicon-watch:before { content: '\\F0E0'} /*  */\r\n.octicon-remove-close:before, .octicon-x:before { content: '\\F081'} /*  */\r\n.octicon-zap:before { content: '\\26A1'} /* ⚡ */\r\n\r\n\r\n", ""]);

// exports


/***/ }),

/***/ 112:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(41)(undefined);
// imports


// module
exports.push([module.i, "@font-face {\n  font-family: 'Material Icons';\n  font-style: normal;\n  font-weight: 400;\n  src: url(" + __webpack_require__(114) + "); /* For IE6-8 */\n  src: local('Material Icons'),\n       local('MaterialIcons-Regular'),\n       url(" + __webpack_require__(117) + ") format('woff2'),\n       url(" + __webpack_require__(116) + ") format('woff'),\n       url(" + __webpack_require__(115) + ") format('truetype');\n}\n\n.material-icons {\n  font-family: 'Material Icons';\n  font-weight: normal;\n  font-style: normal;\n  font-size: 24px;  /* Preferred icon size */\n  display: inline-block;\n  width: 1em;\n  height: 1em;\n  line-height: 1;\n  text-transform: none;\n  letter-spacing: normal;\n  word-wrap: normal;\n  white-space: nowrap;\n  direction: ltr;\n\n  /* Support for all WebKit browsers. */\n  -webkit-font-smoothing: antialiased;\n  /* Support for Safari and Chrome. */\n  text-rendering: optimizeLegibility;\n\n  /* Support for Firefox. */\n  -moz-osx-font-smoothing: grayscale;\n\n  /* Support for IE. */\n  -webkit-font-feature-settings: 'liga';\n          font-feature-settings: 'liga';\n}\n", ""]);

// exports


/***/ }),

/***/ 113:
/***/ (function(module, exports, __webpack_require__) {

exports = module.exports = __webpack_require__(41)(undefined);
// imports


// module
exports.push([module.i, "/*\r\n.octicon is optimized for 16px.\r\n.mega-octicon is optimized for 32px but can be used larger.\r\n*/\r\n.octicon, .mega-octicon {\r\n  font: normal normal normal 16px/1 octicons;\r\n  display: inline-block;\r\n  text-decoration: none;\r\n  text-rendering: auto;\r\n  -webkit-font-smoothing: antialiased;\r\n  -moz-osx-font-smoothing: grayscale;\r\n  -webkit-user-select: none;\r\n  -moz-user-select: none;\r\n  -ms-user-select: none;\r\n  user-select: none;\r\n}\r\n.mega-octicon { font-size: 32px; }\r\n\r\n.octicon-alert:before { content: '\\F02D'} /*  */\r\n.octicon-arrow-down:before { content: '\\F03F'} /*  */\r\n.octicon-arrow-left:before { content: '\\F040'} /*  */\r\n.octicon-arrow-right:before { content: '\\F03E'} /*  */\r\n.octicon-arrow-small-down:before { content: '\\F0A0'} /*  */\r\n.octicon-arrow-small-left:before { content: '\\F0A1'} /*  */\r\n.octicon-arrow-small-right:before { content: '\\F071'} /*  */\r\n.octicon-arrow-small-up:before { content: '\\F09F'} /*  */\r\n.octicon-arrow-up:before { content: '\\F03D'} /*  */\r\n.octicon-microscope:before, .octicon-beaker:before { content: '\\F0DD'} /*  */\r\n.octicon-bell:before { content: '\\F0DE'} /*  */\r\n.octicon-bold:before { content: '\\F0E2'} /*  */\r\n.octicon-book:before { content: '\\F007'} /*  */\r\n.octicon-bookmark:before { content: '\\F07B'} /*  */\r\n.octicon-briefcase:before { content: '\\F0D3'} /*  */\r\n.octicon-broadcast:before { content: '\\F048'} /*  */\r\n.octicon-browser:before { content: '\\F0C5'} /*  */\r\n.octicon-bug:before { content: '\\F091'} /*  */\r\n.octicon-calendar:before { content: '\\F068'} /*  */\r\n.octicon-check:before { content: '\\F03A'} /*  */\r\n.octicon-checklist:before { content: '\\F076'} /*  */\r\n.octicon-chevron-down:before { content: '\\F0A3'} /*  */\r\n.octicon-chevron-left:before { content: '\\F0A4'} /*  */\r\n.octicon-chevron-right:before { content: '\\F078'} /*  */\r\n.octicon-chevron-up:before { content: '\\F0A2'} /*  */\r\n.octicon-circle-slash:before { content: '\\F084'} /*  */\r\n.octicon-circuit-board:before { content: '\\F0D6'} /*  */\r\n.octicon-clippy:before { content: '\\F035'} /*  */\r\n.octicon-clock:before { content: '\\F046'} /*  */\r\n.octicon-cloud-download:before { content: '\\F00B'} /*  */\r\n.octicon-cloud-upload:before { content: '\\F00C'} /*  */\r\n.octicon-code:before { content: '\\F05F'} /*  */\r\n.octicon-comment-add:before, .octicon-comment:before { content: '\\F02B'} /*  */\r\n.octicon-comment-discussion:before { content: '\\F04F'} /*  */\r\n.octicon-credit-card:before { content: '\\F045'} /*  */\r\n.octicon-dash:before { content: '\\F0CA'} /*  */\r\n.octicon-dashboard:before { content: '\\F07D'} /*  */\r\n.octicon-database:before { content: '\\F096'} /*  */\r\n.octicon-clone:before, .octicon-desktop-download:before { content: '\\F0DC'} /*  */\r\n.octicon-device-camera:before { content: '\\F056'} /*  */\r\n.octicon-device-camera-video:before { content: '\\F057'} /*  */\r\n.octicon-device-desktop:before { content: '\\F27C'} /*  */\r\n.octicon-device-mobile:before { content: '\\F038'} /*  */\r\n.octicon-diff:before { content: '\\F04D'} /*  */\r\n.octicon-diff-added:before { content: '\\F06B'} /*  */\r\n.octicon-diff-ignored:before { content: '\\F099'} /*  */\r\n.octicon-diff-modified:before { content: '\\F06D'} /*  */\r\n.octicon-diff-removed:before { content: '\\F06C'} /*  */\r\n.octicon-diff-renamed:before { content: '\\F06E'} /*  */\r\n.octicon-ellipsis:before { content: '\\F09A'} /*  */\r\n.octicon-eye-unwatch:before, .octicon-eye-watch:before, .octicon-eye:before { content: '\\F04E'} /*  */\r\n.octicon-file-binary:before { content: '\\F094'} /*  */\r\n.octicon-file-code:before { content: '\\F010'} /*  */\r\n.octicon-file-directory:before { content: '\\F016'} /*  */\r\n.octicon-file-media:before { content: '\\F012'} /*  */\r\n.octicon-file-pdf:before { content: '\\F014'} /*  */\r\n.octicon-file-submodule:before { content: '\\F017'} /*  */\r\n.octicon-file-symlink-directory:before { content: '\\F0B1'} /*  */\r\n.octicon-file-symlink-file:before { content: '\\F0B0'} /*  */\r\n.octicon-file-text:before { content: '\\F011'} /*  */\r\n.octicon-file-zip:before { content: '\\F013'} /*  */\r\n.octicon-flame:before { content: '\\F0D2'} /*  */\r\n.octicon-fold:before { content: '\\F0CC'} /*  */\r\n.octicon-gear:before { content: '\\F02F'} /*  */\r\n.octicon-gift:before { content: '\\F042'} /*  */\r\n.octicon-gist:before { content: '\\F00E'} /*  */\r\n.octicon-gist-secret:before { content: '\\F08C'} /*  */\r\n.octicon-git-branch-create:before, .octicon-git-branch-delete:before, .octicon-git-branch:before { content: '\\F020'} /*  */\r\n.octicon-git-commit:before { content: '\\F01F'} /*  */\r\n.octicon-git-compare:before { content: '\\F0AC'} /*  */\r\n.octicon-git-merge:before { content: '\\F023'} /*  */\r\n.octicon-git-pull-request-abandoned:before, .octicon-git-pull-request:before { content: '\\F009'} /*  */\r\n.octicon-globe:before { content: '\\F0B6'} /*  */\r\n.octicon-graph:before { content: '\\F043'} /*  */\r\n.octicon-heart:before { content: '\\2665'} /* ♥ */\r\n.octicon-history:before { content: '\\F07E'} /*  */\r\n.octicon-home:before { content: '\\F08D'} /*  */\r\n.octicon-horizontal-rule:before { content: '\\F070'} /*  */\r\n.octicon-hubot:before { content: '\\F09D'} /*  */\r\n.octicon-inbox:before { content: '\\F0CF'} /*  */\r\n.octicon-info:before { content: '\\F059'} /*  */\r\n.octicon-issue-closed:before { content: '\\F028'} /*  */\r\n.octicon-issue-opened:before { content: '\\F026'} /*  */\r\n.octicon-issue-reopened:before { content: '\\F027'} /*  */\r\n.octicon-italic:before { content: '\\F0E4'} /*  */\r\n.octicon-jersey:before { content: '\\F019'} /*  */\r\n.octicon-key:before { content: '\\F049'} /*  */\r\n.octicon-keyboard:before { content: '\\F00D'} /*  */\r\n.octicon-law:before { content: '\\F0D8'} /*  */\r\n.octicon-light-bulb:before { content: '\\F000'} /*  */\r\n.octicon-link:before { content: '\\F05C'} /*  */\r\n.octicon-link-external:before { content: '\\F07F'} /*  */\r\n.octicon-list-ordered:before { content: '\\F062'} /*  */\r\n.octicon-list-unordered:before { content: '\\F061'} /*  */\r\n.octicon-location:before { content: '\\F060'} /*  */\r\n.octicon-gist-private:before, .octicon-mirror-private:before, .octicon-git-fork-private:before, .octicon-lock:before { content: '\\F06A'} /*  */\r\n.octicon-logo-gist:before { content: '\\F0AD'} /*  */\r\n.octicon-logo-github:before { content: '\\F092'} /*  */\r\n.octicon-mail:before { content: '\\F03B'} /*  */\r\n.octicon-mail-read:before { content: '\\F03C'} /*  */\r\n.octicon-mail-reply:before { content: '\\F051'} /*  */\r\n.octicon-mark-github:before { content: '\\F00A'} /*  */\r\n.octicon-markdown:before { content: '\\F0C9'} /*  */\r\n.octicon-megaphone:before { content: '\\F077'} /*  */\r\n.octicon-mention:before { content: '\\F0BE'} /*  */\r\n.octicon-milestone:before { content: '\\F075'} /*  */\r\n.octicon-mirror-public:before, .octicon-mirror:before { content: '\\F024'} /*  */\r\n.octicon-mortar-board:before { content: '\\F0D7'} /*  */\r\n.octicon-mute:before { content: '\\F080'} /*  */\r\n.octicon-no-newline:before { content: '\\F09C'} /*  */\r\n.octicon-octoface:before { content: '\\F008'} /*  */\r\n.octicon-organization:before { content: '\\F037'} /*  */\r\n.octicon-package:before { content: '\\F0C4'} /*  */\r\n.octicon-paintcan:before { content: '\\F0D1'} /*  */\r\n.octicon-pencil:before { content: '\\F058'} /*  */\r\n.octicon-person-add:before, .octicon-person-follow:before, .octicon-person:before { content: '\\F018'} /*  */\r\n.octicon-pin:before { content: '\\F041'} /*  */\r\n.octicon-plug:before { content: '\\F0D4'} /*  */\r\n.octicon-repo-create:before, .octicon-gist-new:before, .octicon-file-directory-create:before, .octicon-file-add:before, .octicon-plus:before { content: '\\F05D'} /*  */\r\n.octicon-primitive-dot:before { content: '\\F052'} /*  */\r\n.octicon-primitive-square:before { content: '\\F053'} /*  */\r\n.octicon-pulse:before { content: '\\F085'} /*  */\r\n.octicon-question:before { content: '\\F02C'} /*  */\r\n.octicon-quote:before { content: '\\F063'} /*  */\r\n.octicon-radio-tower:before { content: '\\F030'} /*  */\r\n.octicon-repo-delete:before, .octicon-repo:before { content: '\\F001'} /*  */\r\n.octicon-repo-clone:before { content: '\\F04C'} /*  */\r\n.octicon-repo-force-push:before { content: '\\F04A'} /*  */\r\n.octicon-gist-fork:before, .octicon-repo-forked:before { content: '\\F002'} /*  */\r\n.octicon-repo-pull:before { content: '\\F006'} /*  */\r\n.octicon-repo-push:before { content: '\\F005'} /*  */\r\n.octicon-rocket:before { content: '\\F033'} /*  */\r\n.octicon-rss:before { content: '\\F034'} /*  */\r\n.octicon-ruby:before { content: '\\F047'} /*  */\r\n.octicon-search-save:before, .octicon-search:before { content: '\\F02E'} /*  */\r\n.octicon-server:before { content: '\\F097'} /*  */\r\n.octicon-settings:before { content: '\\F07C'} /*  */\r\n.octicon-shield:before { content: '\\F0E1'} /*  */\r\n.octicon-log-in:before, .octicon-sign-in:before { content: '\\F036'} /*  */\r\n.octicon-log-out:before, .octicon-sign-out:before { content: '\\F032'} /*  */\r\n.octicon-smiley:before { content: '\\F0E7'} /*  */\r\n.octicon-squirrel:before { content: '\\F0B2'} /*  */\r\n.octicon-star-add:before, .octicon-star-delete:before, .octicon-star:before { content: '\\F02A'} /*  */\r\n.octicon-stop:before { content: '\\F08F'} /*  */\r\n.octicon-repo-sync:before, .octicon-sync:before { content: '\\F087'} /*  */\r\n.octicon-tag-remove:before, .octicon-tag-add:before, .octicon-tag:before { content: '\\F015'} /*  */\r\n.octicon-tasklist:before { content: '\\F0E5'} /*  */\r\n.octicon-telescope:before { content: '\\F088'} /*  */\r\n.octicon-terminal:before { content: '\\F0C8'} /*  */\r\n.octicon-text-size:before { content: '\\F0E3'} /*  */\r\n.octicon-three-bars:before { content: '\\F05E'} /*  */\r\n.octicon-thumbsdown:before { content: '\\F0DB'} /*  */\r\n.octicon-thumbsup:before { content: '\\F0DA'} /*  */\r\n.octicon-tools:before { content: '\\F031'} /*  */\r\n.octicon-trashcan:before { content: '\\F0D0'} /*  */\r\n.octicon-triangle-down:before { content: '\\F05B'} /*  */\r\n.octicon-triangle-left:before { content: '\\F044'} /*  */\r\n.octicon-triangle-right:before { content: '\\F05A'} /*  */\r\n.octicon-triangle-up:before { content: '\\F0AA'} /*  */\r\n.octicon-unfold:before { content: '\\F039'} /*  */\r\n.octicon-unmute:before { content: '\\F0BA'} /*  */\r\n.octicon-verified:before { content: '\\F0E6'} /*  */\r\n.octicon-versions:before { content: '\\F064'} /*  */\r\n.octicon-watch:before { content: '\\F0E0'} /*  */\r\n.octicon-remove-close:before, .octicon-x:before { content: '\\F081'} /*  */\r\n.octicon-zap:before { content: '\\26A1'} /* ⚡ */\r\n\r\n\r\n", ""]);

// exports


/***/ }),

/***/ 114:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/MaterialIcons-Regular.eot";

/***/ }),

/***/ 115:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/MaterialIcons-Regular.ttf";

/***/ }),

/***/ 116:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/MaterialIcons-Regular.woff";

/***/ }),

/***/ 117:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/MaterialIcons-Regular.woff2";

/***/ }),

/***/ 118:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/octicons.ttf";

/***/ }),

/***/ 119:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/octicons.woff";

/***/ }),

/***/ 120:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/roboto-v15-latin-regular.woff";

/***/ }),

/***/ 121:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__.p + "img/roboto-v15-latin-regular.woff2";

/***/ }),

/***/ 24:
/***/ (function(module, exports, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(global) {
Object.defineProperty(exports, "__esModule", { value: true });
var servicestack_client_1 = __webpack_require__(23);
exports.BasePath = location.pathname.substring(0, location.pathname.indexOf("/ss_admin") + 1);
exports.client = new servicestack_client_1.JsonServiceClient(global.BaseUrl || exports.BasePath);
exports.normalizeKey = function (key) { return key.toLowerCase().replace(/_/g, ''); };
var isArray = function (o) { return Object.prototype.toString.call(o) === '[object Array]'; };
var log = function (o) { console.log(o, typeof (o)); return o; };
exports.normalize = function (dto, deep) {
    if (dto == null)
        return dto;
    if (isArray(dto)) {
        if (!deep)
            return dto;
        var to = [];
        for (var i = 0; i < dto.length; i++) {
            to[i] = exports.normalize(dto[i], deep);
        }
        return to;
    }
    if (typeof dto != "object")
        return dto;
    var o = {};
    for (var k in dto) {
        o[exports.normalizeKey(k)] = deep ? exports.normalize(dto[k], deep) : dto[k];
    }
    return o;
};
exports.getField = function (o, name) {
    return o == null || name == null ? null :
        o[name] ||
            o[Object.keys(o).filter(function (k) { return exports.normalizeKey(k) === exports.normalizeKey(name); })[0] || ''];
};
exports.parseResponseStatus = function (json, defaultMsg) {
    if (defaultMsg === void 0) { defaultMsg = null; }
    try {
        var err = JSON.parse(json);
        return servicestack_client_1.sanitize(err.ResponseStatus || err.responseStatus);
    }
    catch (e) {
        return {
            message: defaultMsg,
            __error: { error: e, json: json }
        };
    }
};

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(64)))

/***/ }),

/***/ 251:
/***/ (function(module, exports) {


/**
 * When source maps are enabled, `style-loader` uses a link element with a data-uri to
 * embed the css on the page. This breaks all relative urls because now they are relative to a
 * bundle instead of the current page.
 *
 * One solution is to only use full urls, but that may be impossible.
 *
 * Instead, this function "fixes" the relative urls to be absolute according to the current page location.
 *
 * A rudimentary test suite is located at `test/fixUrls.js` and can be run via the `npm test` command.
 *
 */

module.exports = function (css) {
  // get current location
  var location = typeof window !== "undefined" && window.location;

  if (!location) {
    throw new Error("fixUrls requires window.location");
  }

	// blank or null?
	if (!css || typeof css !== "string") {
	  return css;
  }

  var baseUrl = location.protocol + "//" + location.host;
  var currentDir = baseUrl + location.pathname.replace(/\/[^\/]*$/, "/");

	// convert each url(...)
	/*
	This regular expression is just a way to recursively match brackets within
	a string.

	 /url\s*\(  = Match on the word "url" with any whitespace after it and then a parens
	   (  = Start a capturing group
	     (?:  = Start a non-capturing group
	         [^)(]  = Match anything that isn't a parentheses
	         |  = OR
	         \(  = Match a start parentheses
	             (?:  = Start another non-capturing groups
	                 [^)(]+  = Match anything that isn't a parentheses
	                 |  = OR
	                 \(  = Match a start parentheses
	                     [^)(]*  = Match anything that isn't a parentheses
	                 \)  = Match a end parentheses
	             )  = End Group
              *\) = Match anything and then a close parens
          )  = Close non-capturing group
          *  = Match anything
       )  = Close capturing group
	 \)  = Match a close parens

	 /gi  = Get all matches, not the first.  Be case insensitive.
	 */
	var fixedCss = css.replace(/url\s*\(((?:[^)(]|\((?:[^)(]+|\([^)(]*\))*\))*)\)/gi, function(fullMatch, origUrl) {
		// strip quotes (if they exist)
		var unquotedOrigUrl = origUrl
			.trim()
			.replace(/^"(.*)"$/, function(o, $1){ return $1; })
			.replace(/^'(.*)'$/, function(o, $1){ return $1; });

		// already a full url? no change
		if (/^(#|data:|http:\/\/|https:\/\/|file:\/\/\/)/i.test(unquotedOrigUrl)) {
		  return fullMatch;
		}

		// convert the url to a full url
		var newUrl;

		if (unquotedOrigUrl.indexOf("//") === 0) {
		  	//TODO: should we add protocol?
			newUrl = unquotedOrigUrl;
		} else if (unquotedOrigUrl.indexOf("/") === 0) {
			// path should be relative to the base url
			newUrl = baseUrl + unquotedOrigUrl; // already starts with '/'
		} else {
			// path should be relative to current directory
			newUrl = currentDir + unquotedOrigUrl.replace(/^\.\//, ""); // Strip leading './'
		}

		// send back the fixed url(...)
		return "url(" + JSON.stringify(newUrl) + ")";
	});

	// send back the fixed css
	return fixedCss;
};


/***/ }),

/***/ 254:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(111);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(63)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../node_modules/css-loader/index.js!../node_modules/postcss-loader/lib/index.js??ref--5-2!./app.css", function() {
			var newContent = require("!!../node_modules/css-loader/index.js!../node_modules/postcss-loader/lib/index.js??ref--5-2!./app.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 255:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(112);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(63)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/postcss-loader/lib/index.js??ref--5-2!./material-icons.css", function() {
			var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/postcss-loader/lib/index.js??ref--5-2!./material-icons.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 256:
/***/ (function(module, exports, __webpack_require__) {

// style-loader: Adds some css to the DOM by adding a <style> tag

// load the styles
var content = __webpack_require__(113);
if(typeof content === 'string') content = [[module.i, content, '']];
// Prepare cssTransformation
var transform;

var options = {}
options.transform = transform
// add the styles to the DOM
var update = __webpack_require__(63)(content, options);
if(content.locals) module.exports = content.locals;
// Hot Module Replacement
if(false) {
	// When the styles change, update the <style> tags
	if(!content.locals) {
		module.hot.accept("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/postcss-loader/lib/index.js??ref--5-2!./octicon.css", function() {
			var newContent = require("!!../../../../node_modules/css-loader/index.js!../../../../node_modules/postcss-loader/lib/index.js??ref--5-2!./octicon.css");
			if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
			update(newContent);
		});
	}
	// When the module is disposed, remove the <style> tags
	module.hot.dispose(function() { update(); });
}

/***/ }),

/***/ 257:
/***/ (function(module, exports, __webpack_require__) {

module.exports = __webpack_require__(102);


/***/ }),

/***/ 41:
/***/ (function(module, exports) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
// css base code, injected by the css-loader
module.exports = function(useSourceMap) {
	var list = [];

	// return the list of modules as css string
	list.toString = function toString() {
		return this.map(function (item) {
			var content = cssWithMappingToString(item, useSourceMap);
			if(item[2]) {
				return "@media " + item[2] + "{" + content + "}";
			} else {
				return content;
			}
		}).join("");
	};

	// import a list of modules into the list
	list.i = function(modules, mediaQuery) {
		if(typeof modules === "string")
			modules = [[null, modules, ""]];
		var alreadyImportedModules = {};
		for(var i = 0; i < this.length; i++) {
			var id = this[i][0];
			if(typeof id === "number")
				alreadyImportedModules[id] = true;
		}
		for(i = 0; i < modules.length; i++) {
			var item = modules[i];
			// skip already imported module
			// this implementation is not 100% perfect for weird media query combinations
			//  when a module is imported multiple times with different media queries.
			//  I hope this will never occur (Hey this way we have smaller bundles)
			if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
				if(mediaQuery && !item[2]) {
					item[2] = mediaQuery;
				} else if(mediaQuery) {
					item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
				}
				list.push(item);
			}
		}
	};
	return list;
};

function cssWithMappingToString(item, useSourceMap) {
	var content = item[1] || '';
	var cssMapping = item[3];
	if (!cssMapping) {
		return content;
	}

	if (useSourceMap && typeof btoa === 'function') {
		var sourceMapping = toComment(cssMapping);
		var sourceURLs = cssMapping.sources.map(function (source) {
			return '/*# sourceURL=' + cssMapping.sourceRoot + source + ' */'
		});

		return [content].concat(sourceURLs).concat([sourceMapping]).join('\n');
	}

	return [content].join('\n');
}

// Adapted from convert-source-map (MIT)
function toComment(sourceMap) {
	// eslint-disable-next-line no-undef
	var base64 = btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap))));
	var data = 'sourceMappingURL=data:application/json;charset=utf-8;base64,' + base64;

	return '/*# ' + data + ' */';
}


/***/ }),

/***/ 63:
/***/ (function(module, exports, __webpack_require__) {

/*
	MIT License http://www.opensource.org/licenses/mit-license.php
	Author Tobias Koppers @sokra
*/
var stylesInDom = {},
	memoize = function(fn) {
		var memo;
		return function () {
			if (typeof memo === "undefined") memo = fn.apply(this, arguments);
			return memo;
		};
	},
	isOldIE = memoize(function() {
		// Test for IE <= 9 as proposed by Browserhacks
		// @see http://browserhacks.com/#hack-e71d8692f65334173fee715c222cb805
		// Tests for existence of standard globals is to allow style-loader 
		// to operate correctly into non-standard environments
		// @see https://github.com/webpack-contrib/style-loader/issues/177
		return window && document && document.all && !window.atob;
	}),
	getElement = (function(fn) {
		var memo = {};
		return function(selector) {
			if (typeof memo[selector] === "undefined") {
				memo[selector] = fn.call(this, selector);
			}
			return memo[selector]
		};
	})(function (styleTarget) {
		return document.querySelector(styleTarget)
	}),
	singletonElement = null,
	singletonCounter = 0,
	styleElementsInsertedAtTop = [],
	fixUrls = __webpack_require__(251);

module.exports = function(list, options) {
	if(typeof DEBUG !== "undefined" && DEBUG) {
		if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
	}

	options = options || {};
	options.attrs = typeof options.attrs === "object" ? options.attrs : {};

	// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
	// tags it will allow on a page
	if (typeof options.singleton === "undefined") options.singleton = isOldIE();

	// By default, add <style> tags to the <head> element
	if (typeof options.insertInto === "undefined") options.insertInto = "head";

	// By default, add <style> tags to the bottom of the target
	if (typeof options.insertAt === "undefined") options.insertAt = "bottom";

	var styles = listToStyles(list, options);
	addStylesToDom(styles, options);

	return function update(newList) {
		var mayRemove = [];
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			domStyle.refs--;
			mayRemove.push(domStyle);
		}
		if(newList) {
			var newStyles = listToStyles(newList, options);
			addStylesToDom(newStyles, options);
		}
		for(var i = 0; i < mayRemove.length; i++) {
			var domStyle = mayRemove[i];
			if(domStyle.refs === 0) {
				for(var j = 0; j < domStyle.parts.length; j++)
					domStyle.parts[j]();
				delete stylesInDom[domStyle.id];
			}
		}
	};
};

function addStylesToDom(styles, options) {
	for(var i = 0; i < styles.length; i++) {
		var item = styles[i];
		var domStyle = stylesInDom[item.id];
		if(domStyle) {
			domStyle.refs++;
			for(var j = 0; j < domStyle.parts.length; j++) {
				domStyle.parts[j](item.parts[j]);
			}
			for(; j < item.parts.length; j++) {
				domStyle.parts.push(addStyle(item.parts[j], options));
			}
		} else {
			var parts = [];
			for(var j = 0; j < item.parts.length; j++) {
				parts.push(addStyle(item.parts[j], options));
			}
			stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
		}
	}
}

function listToStyles(list, options) {
	var styles = [];
	var newStyles = {};
	for(var i = 0; i < list.length; i++) {
		var item = list[i];
		var id = options.base ? item[0] + options.base : item[0];
		var css = item[1];
		var media = item[2];
		var sourceMap = item[3];
		var part = {css: css, media: media, sourceMap: sourceMap};
		if(!newStyles[id])
			styles.push(newStyles[id] = {id: id, parts: [part]});
		else
			newStyles[id].parts.push(part);
	}
	return styles;
}

function insertStyleElement(options, styleElement) {
	var styleTarget = getElement(options.insertInto)
	if (!styleTarget) {
		throw new Error("Couldn't find a style target. This probably means that the value for the 'insertInto' parameter is invalid.");
	}
	var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
	if (options.insertAt === "top") {
		if(!lastStyleElementInsertedAtTop) {
			styleTarget.insertBefore(styleElement, styleTarget.firstChild);
		} else if(lastStyleElementInsertedAtTop.nextSibling) {
			styleTarget.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
		} else {
			styleTarget.appendChild(styleElement);
		}
		styleElementsInsertedAtTop.push(styleElement);
	} else if (options.insertAt === "bottom") {
		styleTarget.appendChild(styleElement);
	} else {
		throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
	}
}

function removeStyleElement(styleElement) {
	styleElement.parentNode.removeChild(styleElement);
	var idx = styleElementsInsertedAtTop.indexOf(styleElement);
	if(idx >= 0) {
		styleElementsInsertedAtTop.splice(idx, 1);
	}
}

function createStyleElement(options) {
	var styleElement = document.createElement("style");
	options.attrs.type = "text/css";

	attachTagAttrs(styleElement, options.attrs);
	insertStyleElement(options, styleElement);
	return styleElement;
}

function createLinkElement(options) {
	var linkElement = document.createElement("link");
	options.attrs.type = "text/css";
	options.attrs.rel = "stylesheet";

	attachTagAttrs(linkElement, options.attrs);
	insertStyleElement(options, linkElement);
	return linkElement;
}

function attachTagAttrs(element, attrs) {
	Object.keys(attrs).forEach(function (key) {
		element.setAttribute(key, attrs[key]);
	});
}

function addStyle(obj, options) {
	var styleElement, update, remove, transformResult;

	// If a transform function was defined, run it on the css
	if (options.transform && obj.css) {
	    transformResult = options.transform(obj.css);
	    
	    if (transformResult) {
	    	// If transform returns a value, use that instead of the original css.
	    	// This allows running runtime transformations on the css.
	    	obj.css = transformResult;
	    } else {
	    	// If the transform function returns a falsy value, don't add this css. 
	    	// This allows conditional loading of css
	    	return function() {
	    		// noop
	    	};
	    }
	}

	if (options.singleton) {
		var styleIndex = singletonCounter++;
		styleElement = singletonElement || (singletonElement = createStyleElement(options));
		update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
		remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
	} else if(obj.sourceMap &&
		typeof URL === "function" &&
		typeof URL.createObjectURL === "function" &&
		typeof URL.revokeObjectURL === "function" &&
		typeof Blob === "function" &&
		typeof btoa === "function") {
		styleElement = createLinkElement(options);
		update = updateLink.bind(null, styleElement, options);
		remove = function() {
			removeStyleElement(styleElement);
			if(styleElement.href)
				URL.revokeObjectURL(styleElement.href);
		};
	} else {
		styleElement = createStyleElement(options);
		update = applyToTag.bind(null, styleElement);
		remove = function() {
			removeStyleElement(styleElement);
		};
	}

	update(obj);

	return function updateStyle(newObj) {
		if(newObj) {
			if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
				return;
			update(obj = newObj);
		} else {
			remove();
		}
	};
}

var replaceText = (function () {
	var textStore = [];

	return function (index, replacement) {
		textStore[index] = replacement;
		return textStore.filter(Boolean).join('\n');
	};
})();

function applyToSingletonTag(styleElement, index, remove, obj) {
	var css = remove ? "" : obj.css;

	if (styleElement.styleSheet) {
		styleElement.styleSheet.cssText = replaceText(index, css);
	} else {
		var cssNode = document.createTextNode(css);
		var childNodes = styleElement.childNodes;
		if (childNodes[index]) styleElement.removeChild(childNodes[index]);
		if (childNodes.length) {
			styleElement.insertBefore(cssNode, childNodes[index]);
		} else {
			styleElement.appendChild(cssNode);
		}
	}
}

function applyToTag(styleElement, obj) {
	var css = obj.css;
	var media = obj.media;

	if(media) {
		styleElement.setAttribute("media", media)
	}

	if(styleElement.styleSheet) {
		styleElement.styleSheet.cssText = css;
	} else {
		while(styleElement.firstChild) {
			styleElement.removeChild(styleElement.firstChild);
		}
		styleElement.appendChild(document.createTextNode(css));
	}
}

function updateLink(linkElement, options, obj) {
	var css = obj.css;
	var sourceMap = obj.sourceMap;

	/* If convertToAbsoluteUrls isn't defined, but sourcemaps are enabled
	and there is no publicPath defined then lets turn convertToAbsoluteUrls
	on by default.  Otherwise default to the convertToAbsoluteUrls option
	directly
	*/
	var autoFixUrls = options.convertToAbsoluteUrls === undefined && sourceMap;

	if (options.convertToAbsoluteUrls || autoFixUrls){
		css = fixUrls(css);
	}

	if(sourceMap) {
		// http://stackoverflow.com/a/26603875
		css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
	}

	var blob = new Blob([css], { type: "text/css" });

	var oldSrc = linkElement.href;

	linkElement.href = URL.createObjectURL(blob);

	if(oldSrc)
		URL.revokeObjectURL(oldSrc);
}


/***/ })

},[257]);
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvYXBwLnRzeCIsIndlYnBhY2s6Ly8vLi9zcmMvQXV0b1F1ZXJ5LnRzeCIsIndlYnBhY2s6Ly8vLi9zcmMvQ29sdW1uUHJlZnNEaWFsb2cudHN4Iiwid2VicGFjazovLy8uL3NyYy9Db250ZW50LnRzeCIsIndlYnBhY2s6Ly8vLi9zcmMvSGVhZGVyLnRzeCIsIndlYnBhY2s6Ly8vLi9zcmMvUmVzdWx0cy50c3giLCJ3ZWJwYWNrOi8vLy4vc3JjL1NpZGViYXIudHN4Iiwid2VicGFjazovLy8uL3NyYy9hcHAuY3NzIiwid2VicGFjazovLy8uL3NyYy9hc3NldHMvaW1nL2ljb25mb250L21hdGVyaWFsLWljb25zLmNzcyIsIndlYnBhY2s6Ly8vLi9zcmMvYXNzZXRzL2ltZy9vY3RpY29uL29jdGljb24uY3NzIiwid2VicGFjazovLy8uL3NyYy9hc3NldHMvaW1nL2ljb25mb250L01hdGVyaWFsSWNvbnMtUmVndWxhci5lb3QiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Fzc2V0cy9pbWcvaWNvbmZvbnQvTWF0ZXJpYWxJY29ucy1SZWd1bGFyLnR0ZiIsIndlYnBhY2s6Ly8vLi9zcmMvYXNzZXRzL2ltZy9pY29uZm9udC9NYXRlcmlhbEljb25zLVJlZ3VsYXIud29mZiIsIndlYnBhY2s6Ly8vLi9zcmMvYXNzZXRzL2ltZy9pY29uZm9udC9NYXRlcmlhbEljb25zLVJlZ3VsYXIud29mZjIiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Fzc2V0cy9pbWcvb2N0aWNvbi9vY3RpY29ucy50dGYiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Fzc2V0cy9pbWcvb2N0aWNvbi9vY3RpY29ucy53b2ZmIiwid2VicGFjazovLy8uL3NyYy9hc3NldHMvaW1nL3JvYm90by9yb2JvdG8tdjE1LWxhdGluLXJlZ3VsYXIud29mZiIsIndlYnBhY2s6Ly8vLi9zcmMvYXNzZXRzL2ltZy9yb2JvdG8vcm9ib3RvLXYxNS1sYXRpbi1yZWd1bGFyLndvZmYyIiwid2VicGFjazovLy8uL3NyYy9zaGFyZWQudHN4Iiwid2VicGFjazovLy8uL34vc3R5bGUtbG9hZGVyL2ZpeFVybHMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC5jc3M/MjAwZiIsIndlYnBhY2s6Ly8vLi9zcmMvYXNzZXRzL2ltZy9pY29uZm9udC9tYXRlcmlhbC1pY29ucy5jc3M/MTU0MCIsIndlYnBhY2s6Ly8vLi9zcmMvYXNzZXRzL2ltZy9vY3RpY29uL29jdGljb24uY3NzP2U0NDMiLCJ3ZWJwYWNrOi8vLy4vfi9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qcyIsIndlYnBhY2s6Ly8vLi9+L3N0eWxlLWxvYWRlci9hZGRTdHlsZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEseUJBQWtEO0FBQ2xELHlCQUEwQztBQUMxQyx5QkFBbUI7QUFFbkIsbUNBQStCO0FBQy9CLDBDQUFtQztBQUNuQyw0Q0FBd0M7QUFDeEMsaURBQXdFO0FBRXhFLHVDQUFvQztBQUNwQywyQ0FBb0M7QUFFcEM7SUFBdUIsNEJBQXlCO0lBQWhEOztJQUlBLENBQUM7SUFIRyx5QkFBTSxHQUFOO1FBQ0ksTUFBTSxDQUFDLG9CQUFDLG1CQUFTLElBQUMsS0FBSyxFQUFHLEVBQUUsTUFBTSxFQUFFLEVBQUUsSUFBSSxFQUFDLEVBQUUsRUFBQyxFQUFFLEdBQUssQ0FBQztJQUMxRCxDQUFDO0lBQ0wsZUFBQztBQUFELENBQUMsQ0FKc0IsS0FBSyxDQUFDLFNBQVMsR0FJckM7QUFFRCxJQUFJLE9BQU8sR0FBRyxpQkFBUSxHQUFHLFVBQVUsQ0FBQztBQUNwQyxJQUFNLGFBQWEsR0FBRyxPQUFPLEdBQUcsWUFBWSxDQUFDO0FBRTdDLGtCQUFNLENBQ0YsQ0FBQyxvQkFBQyxnQ0FBTTtJQUNKO1FBQ0ksb0JBQUMsd0JBQUssSUFBQyxLQUFLLFFBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUU7Z0JBQ2hDLDJCQUFDLHVCQUFRLElBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUUsYUFBYSxHQUFHO1lBQTdDLENBQTZDLEdBQ3pDO1FBQ1Isb0JBQUMsd0JBQUssSUFBQyxLQUFLLFFBQUMsSUFBSSxFQUFFLGFBQWEsRUFBRSxTQUFTLEVBQUUsbUJBQVMsR0FBSTtRQUMxRCxvQkFBQyx3QkFBSyxJQUFDLElBQUksRUFBRSxhQUFhLEdBQUcsUUFBUSxFQUFFLFNBQVMsRUFBRSxtQkFBUyxHQUFJLENBQzdELENBQ0QsQ0FBQyxFQUNWLFFBQVEsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDL0JwQyxtQ0FBK0I7QUFFL0Isd0NBQThCO0FBQzlCLHlDQUFnQztBQUNoQyx5Q0FBZ0M7QUFDaEMsbURBQW9EO0FBRXBELHVDQUE2QztBQUU3QztJQUF1Qyw2QkFBeUI7SUFDNUQsbUJBQVksS0FBTSxFQUFFLE9BQVE7UUFBNUIsWUFDSSxrQkFBTSxLQUFLLEVBQUUsT0FBTyxDQUFDLFNBT3hCO1FBTkcsS0FBSSxDQUFDLEtBQUssR0FBRyxFQUFFLFFBQVEsRUFBRSxJQUFJLEVBQUUsQ0FBQztRQUVoQyxlQUFNLENBQUMsR0FBRyxDQUFDLHFCQUFxQixDQUFDLENBQUMsSUFBSSxDQUFDLFdBQUM7WUFDcEMsSUFBTSxRQUFRLEdBQUcsa0JBQVMsQ0FBQyxDQUFDLEVBQUUsSUFBSSxDQUFDLENBQUM7WUFDcEMsS0FBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLFFBQVEsWUFBRSxJQUFJLEVBQUUsS0FBSSxDQUFDLE9BQU8sRUFBRSxFQUFFLENBQUM7UUFDckQsQ0FBQyxDQUFDLENBQUM7O0lBQ1AsQ0FBQztJQUVELDBCQUFNLEdBQU47UUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRO2NBQ3BCLG9CQUFDLEdBQUcsSUFBQyxRQUFRLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLEVBQUUsSUFBSSxFQUFFLElBQUksQ0FBQyxPQUFPLEVBQUUsR0FBSTtjQUM1RCxJQUFJLENBQUM7SUFDZixDQUFDO0lBRUQsMkJBQU8sR0FBUDtRQUNJLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsSUFBSSxJQUFJLEVBQUUsQ0FBQztJQUM5QyxDQUFDO0lBQ0wsZ0JBQUM7QUFBRCxDQUFDLENBcEJzQyxLQUFLLENBQUMsU0FBUyxHQW9CckQ7O0FBRUQ7SUFBa0IsdUJBQXlCO0lBQ3ZDLGFBQVksS0FBTSxFQUFFLE9BQVE7UUFBNUIsWUFDSSxrQkFBTSxLQUFLLEVBQUUsT0FBTyxDQUFDLFNBMkJ4QjtRQXpCRyxJQUFNLGNBQWMsR0FBRyxLQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLFlBQUUsSUFBSSxTQUFFLENBQUMsT0FBTyxFQUFWLENBQVUsQ0FBQyxDQUFDO1FBRTVFLElBQU0sVUFBVSxHQUFHLEVBQUUsRUFBRSxVQUFVLEdBQUcsRUFBRSxFQUFFLEtBQUssR0FBRyxFQUFFLENBQUM7UUFDbkQsY0FBYyxDQUFDLE9BQU8sQ0FBQyxjQUFJO1lBQ3ZCLFVBQVUsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLENBQUM7WUFDdEIsSUFBTSxRQUFRLEdBQUcsS0FBSSxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxDQUFDO1lBQy9DLEVBQUUsQ0FBQyxDQUFDLFFBQVEsSUFBSSxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQztnQkFDNUIsUUFBUSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsYUFBRyxJQUFJLGlCQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsR0FBRyxDQUFDLElBQUksQ0FBQyxHQUFHLEdBQUcsQ0FBQyxLQUFLLEVBQXRDLENBQXNDLENBQUMsQ0FBQztZQUN6RSxDQUFDO1lBRUQsVUFBVSxDQUFDLElBQUksQ0FBQyxHQUFHLEtBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsWUFBRSxJQUFJLFNBQUUsQ0FBQyxPQUFPLEtBQUssSUFBSSxFQUFuQixDQUFtQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDM0YsQ0FBQyxDQUFDLENBQUM7UUFFSCxPQUFPLENBQUMsR0FBRyxDQUFDLEtBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLENBQUM7UUFDakMsS0FBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxXQUFDLElBQUksWUFBSyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQWpCLENBQWlCLENBQUMsQ0FBQztRQUUxRCxJQUFJLGNBQWMsR0FBRyxFQUFFLENBQUM7UUFDeEIsSUFBSSxJQUFJLEdBQUcsWUFBWSxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO1FBQ3JELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUNMLGNBQWMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBRXRDLEtBQUksQ0FBQyxLQUFLLEdBQUc7WUFDVCxhQUFhLEVBQUUsS0FBSyxFQUFFLFFBQVEsRUFBRSxJQUFJO1lBQ3BDLGNBQWMsa0JBQUUsY0FBYyxrQkFBRSxVQUFVLGNBQUUsVUFBVSxjQUFFLEtBQUs7U0FDaEUsQ0FBQzs7SUFDTixDQUFDO0lBRUQsK0JBQWlCLEdBQWpCLFVBQWtCLElBQUk7UUFDbEIsSUFBSSxLQUFLLEdBQUcsQ0FBQyxJQUFJLENBQUMsVUFBVSxJQUFJLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztRQUU3QyxJQUFJLFFBQVEsR0FBRyxJQUFJLENBQUMsUUFBUSxDQUFDO1FBQzdCLE9BQU8sUUFBUSxFQUFFLENBQUM7WUFDZCxJQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7WUFDMUMsRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsVUFBVSxDQUFDO2dCQUFDLFFBQVEsQ0FBQztZQUNsQyxDQUFDLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxXQUFDLElBQUksWUFBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsRUFBYixDQUFhLENBQUMsQ0FBQztZQUN6QyxRQUFRLEdBQUcsQ0FBQyxDQUFDLFFBQVEsQ0FBQztRQUMxQixDQUFDO1FBRUQsTUFBTSxDQUFDLEtBQUssQ0FBQztJQUNqQixDQUFDO0lBRUQsMkJBQWEsR0FBYjtRQUNJLElBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxhQUFhLEVBQUUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLGFBQWEsRUFBRSxDQUFDLENBQUM7SUFDaEUsQ0FBQztJQUVELHFCQUFPLEdBQVAsVUFBUSxJQUFZO1FBQ2hCLE1BQU0sQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFlBQUUsSUFBSSxTQUFFLENBQUMsSUFBSSxLQUFLLElBQUksRUFBaEIsQ0FBZ0IsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0lBQ3ZFLENBQUM7SUFFRCxnQ0FBa0IsR0FBbEIsVUFBbUIsSUFBVztRQUMxQixJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsT0FBTyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQ2hDLE1BQU0sQ0FBQyxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksQ0FBQyxVQUFVLElBQUksSUFBSTtjQUN4QyxJQUFJLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxjQUFJLElBQUksV0FBSSxDQUFDLElBQUksS0FBSyxpQkFBaUIsRUFBL0IsQ0FBK0IsQ0FBQyxDQUFDLENBQUMsQ0FBQztjQUNsRSxJQUFJLENBQUM7SUFDZixDQUFDO0lBRUQsd0NBQTBCLEdBQTFCLFVBQTJCLElBQVcsRUFBRSxPQUFjO1FBQ2xELElBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMvQyxJQUFNLEdBQUcsR0FBRyxRQUFRO2NBQ2QsUUFBUSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsV0FBQyxJQUFJLFFBQUMsQ0FBQyxJQUFJLEtBQUssT0FBTyxFQUFsQixDQUFrQixDQUFDLENBQUMsQ0FBQyxDQUFDO2NBQ2hELElBQUksQ0FBQztRQUNYLE1BQU0sQ0FBQyxHQUFHLElBQUksSUFBSTtjQUNaLEdBQUcsQ0FBQyxLQUFLO2NBQ1QsSUFBSSxDQUFDO0lBQ2YsQ0FBQztJQUVELHNCQUFRLEdBQVIsVUFBUyxRQUFRO1FBQ2IsTUFBTSxDQUFDLFFBQVE7Y0FDVCxJQUFJLENBQUMsMEJBQTBCLENBQUMsUUFBUSxDQUFDLElBQUksRUFBRSxPQUFPLENBQUMsSUFBSSxRQUFRLENBQUMsSUFBSTtjQUN4RSxJQUFJLENBQUM7SUFDZixDQUFDO0lBRUQsZ0NBQWtCLEdBQWxCLFVBQW1CLElBQVk7UUFDM0IsSUFBTSxVQUFVLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO1FBQ3JELE1BQU0sQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO1lBQ2pCLFdBQVcsRUFBRSxVQUFVLENBQUMsb0JBQW9CLENBQUMsSUFBSSxFQUFFO1lBQ25ELFVBQVUsRUFBRSxVQUFVLENBQUMsbUJBQW1CLENBQUMsSUFBSSxFQUFFO1lBQ2pELFVBQVUsRUFBRSxVQUFVLENBQUMsbUJBQW1CLENBQUM7WUFDM0MsVUFBVSxFQUFFLEVBQUU7WUFDZCxPQUFPLEVBQUUsRUFBRTtTQUNkLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDLENBQUM7SUFDOUMsQ0FBQztJQUVELHlCQUFXLEdBQVgsVUFBWSxJQUFZO1FBQ3BCLElBQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzlDLEVBQUUsQ0FBQyxDQUFDLFNBQVMsSUFBSSxJQUFJLENBQUM7WUFDbEIsTUFBTSxDQUFDLElBQUksQ0FBQztRQUNoQixJQUFNLFdBQVcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUMzQyxJQUFNLFFBQVEsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDbEQsSUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsU0FBUyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1FBQzlDLE1BQU0sQ0FBQztZQUNILElBQUksUUFBRSxTQUFTLGFBQUUsV0FBVztZQUM1QixRQUFRLFlBQUUsY0FBYyxFQUFFLElBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLENBQUM7WUFDeEQsTUFBTSxVQUFFLFlBQVksRUFBRSxJQUFJLENBQUMsaUJBQWlCLENBQUMsTUFBTSxDQUFDO1NBQ3ZELENBQUM7SUFDTixDQUFDO0lBRUQsK0JBQWlCLEdBQWpCLFVBQWtCLE1BQWMsRUFBRSxTQUFjO1FBQzVDLElBQU0sRUFBRSxHQUFHLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUUzQyxNQUFNLENBQUMsSUFBSSxDQUFDLFNBQVMsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxXQUFDO1lBQzVCLEVBQUUsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUMsSUFBSSxJQUFJLENBQUM7Z0JBQ3JCLEVBQUUsQ0FBQyxDQUFDLENBQUMsR0FBRyxTQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDN0IsQ0FBQyxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsa0JBQWtCLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ3hDLENBQUM7SUFFRCwwQkFBWSxHQUFaLFVBQWEsTUFBYTtRQUN0QixJQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDM0MsSUFBTSxTQUFTLEdBQUc7WUFDZCxFQUFFLEVBQUssRUFBRSxDQUFDLFdBQVcsU0FBSSxFQUFFLENBQUMsVUFBVSxTQUFJLEVBQUUsQ0FBQyxVQUFZO1lBQ3pELFdBQVcsRUFBRSxFQUFFLENBQUMsV0FBVztZQUMzQixVQUFVLEVBQUUsRUFBRSxDQUFDLFVBQVU7WUFDekIsVUFBVSxFQUFFLEVBQUUsQ0FBQyxVQUFVO1NBQzVCLENBQUM7UUFFRixFQUFFLENBQUMsQ0FBQyxFQUFFLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxXQUFDLElBQUksUUFBQyxDQUFDLEVBQUUsS0FBSyxTQUFTLENBQUMsRUFBRSxFQUFyQixDQUFxQixDQUFDLENBQUM7WUFDL0MsTUFBTSxDQUFDO1FBRVgsRUFBRSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUM7UUFDbkIsRUFBRSxDQUFDLFVBQVUsQ0FBQyxJQUFJLENBQUMsU0FBUyxDQUFDLENBQUM7UUFFOUIsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQztJQUN4QyxDQUFDO0lBRUQsNkJBQWUsR0FBZixVQUFnQixNQUFjLEVBQUUsU0FBYTtRQUN6QyxJQUFNLEVBQUUsR0FBRyxJQUFJLENBQUMsa0JBQWtCLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDM0MsRUFBRSxDQUFDLFVBQVUsR0FBRyxFQUFFLENBQUMsVUFBVSxDQUFDLE1BQU0sQ0FBQyxXQUFDLElBQUksUUFBQyxDQUFDLEVBQUUsS0FBSyxTQUFTLENBQUMsRUFBRSxFQUFyQixDQUFxQixDQUFDLENBQUM7UUFDakUsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sRUFBRSxFQUFFLENBQUMsQ0FBQztJQUN4QyxDQUFDO0lBRUQsZ0NBQWtCLEdBQWxCLFVBQW1CLE1BQU0sRUFBRSxFQUFFO1FBQ3pCLElBQU0sY0FBYyxHQUFHLE1BQU0sQ0FBQyxNQUFNLENBQUMsRUFBRSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsY0FBYyxDQUFDLENBQUM7UUFDcEUsY0FBYyxDQUFDLE1BQU0sQ0FBQyxHQUFHLEVBQUUsQ0FBQztRQUM1QixJQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsY0FBYyxrQkFBRSxDQUFDLENBQUM7UUFDbEMsWUFBWSxDQUFDLE9BQU8sQ0FBQyxtQkFBbUIsRUFBRSxJQUFJLENBQUMsU0FBUyxDQUFDLGNBQWMsQ0FBQyxDQUFDLENBQUM7SUFDOUUsQ0FBQztJQUVELHdCQUFVLEdBQVYsVUFBVyxNQUFNO1FBQ2IsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLE1BQU0sVUFBRSxDQUFDLENBQUM7UUFDMUIsVUFBVSxDQUFDLGNBQU0sZUFBUSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQyxFQUExRCxDQUEwRCxFQUFFLENBQUMsQ0FBQyxDQUFDO0lBQ3BGLENBQUM7SUFFRCx3QkFBVSxHQUFWO1FBQ0ksSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLE1BQU0sRUFBRSxJQUFJLEVBQUUsQ0FBQyxDQUFDO0lBQ3BDLENBQUM7SUFFRCx1QkFBUyxHQUFULFVBQVUsTUFBYTtRQUNuQixJQUFNLElBQUksR0FBRyxNQUFNLENBQUMsZ0JBQWdCLEVBQUUsVUFBVSxDQUFDLENBQUM7UUFDbEQsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFBQyxNQUFNLENBQUM7UUFFbEIsSUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzNDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7WUFDZCxFQUFFLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztRQUNwQixDQUFDO1FBRUQsRUFBRSxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUM7WUFDWixJQUFJO1lBQ0osV0FBVyxFQUFFLEVBQUUsQ0FBQyxXQUFXO1lBQzNCLFVBQVUsRUFBRSxFQUFFLENBQUMsVUFBVTtZQUN6QixVQUFVLEVBQUUsRUFBRSxDQUFDLFVBQVU7WUFDekIsVUFBVSxFQUFFLEVBQUUsQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLFdBQUMsSUFBSSxhQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxDQUFDLENBQUMsRUFBcEIsQ0FBb0IsQ0FBQztTQUMzRCxDQUFDLENBQUM7UUFFSCxJQUFJLENBQUMsa0JBQWtCLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ3hDLENBQUM7SUFFRCx5QkFBVyxHQUFYLFVBQVksTUFBYyxFQUFFLEtBQVU7UUFDbEMsSUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzNDLEVBQUUsQ0FBQyxDQUFDLENBQUMsRUFBRSxDQUFDLE9BQU8sQ0FBQztZQUFDLE1BQU0sQ0FBQztRQUN4QixFQUFFLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQyxPQUFPLENBQUMsTUFBTSxDQUFDLFdBQUMsSUFBSSxRQUFDLENBQUMsSUFBSSxJQUFJLEtBQUssQ0FBQyxJQUFJLEVBQXBCLENBQW9CLENBQUMsQ0FBQztRQUMxRCxJQUFJLENBQUMsa0JBQWtCLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ3hDLENBQUM7SUFFRCx1QkFBUyxHQUFULFVBQVUsTUFBYyxFQUFFLEtBQVU7UUFDaEMsSUFBTSxFQUFFLEdBQUcsSUFBSSxDQUFDLGtCQUFrQixDQUFDLE1BQU0sQ0FBQyxDQUFDO1FBQzNDLEVBQUUsQ0FBQyxXQUFXLEdBQUcsS0FBSyxDQUFDLFdBQVcsQ0FBQztRQUNuQyxFQUFFLENBQUMsVUFBVSxHQUFHLEtBQUssQ0FBQyxVQUFVLENBQUM7UUFDakMsRUFBRSxDQUFDLFVBQVUsR0FBRyxLQUFLLENBQUMsVUFBVSxDQUFDO1FBQ2pDLEVBQUUsQ0FBQyxVQUFVLEdBQUcsS0FBSyxDQUFDLFVBQVUsQ0FBQztRQUNqQyxJQUFJLENBQUMsa0JBQWtCLENBQUMsTUFBTSxFQUFFLEVBQUUsQ0FBQyxDQUFDO0lBQ3hDLENBQUM7SUFFRCxvQkFBTSxHQUFOO1FBQUEsaUJBd0NDO1FBdkNHLElBQU0sUUFBUSxHQUFHLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztRQUNuRCxJQUFNLE1BQU0sR0FBRyxRQUFRLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQztRQUN6QyxNQUFNLENBQUMsQ0FDSCw2QkFBSyxLQUFLLEVBQUUsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFO1lBQzFCLG9CQUFDLGdCQUFNLElBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxRQUFRLENBQUMsUUFBUSxDQUFDLEVBQUUsZUFBZSxFQUFFLFdBQUMsSUFBSSxZQUFJLENBQUMsYUFBYSxFQUFFLEVBQXBCLENBQW9CLEdBQUs7WUFDdkYsNkJBQUssRUFBRSxFQUFDLE1BQU0sRUFBQyxTQUFTLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxhQUFhLEdBQUcsY0FBYyxHQUFHLEVBQUU7Z0JBQ3BFLDZCQUFLLFNBQVMsRUFBQyxPQUFPO29CQUNsQixvQkFBQyxpQkFBTyxJQUNKLElBQUksRUFBRSxNQUFNLEVBQ1osVUFBVSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUNqQyxVQUFVLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLEdBQy9CO29CQUNOLG9CQUFDLGlCQUFPLElBQ0osTUFBTSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLE1BQU0sRUFDbEMsUUFBUSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLFFBQVEsRUFDdEMsUUFBUSxFQUFFLFFBQVEsRUFDbEIsTUFBTSxFQUFFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUNoRCxXQUFXLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsTUFBTSxDQUFDLG1CQUFtQixFQUMzRCxVQUFVLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsTUFBTSxDQUFDLEVBQ3pDLFFBQVEsRUFBRSxjQUFJLElBQUksWUFBSSxDQUFDLGlCQUFpQixDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsRUFBcEMsQ0FBb0MsRUFDdEQsY0FBYyxFQUFFLFdBQUMsSUFBSSxZQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxFQUF6QixDQUF5QixFQUM5QyxpQkFBaUIsRUFBRSxXQUFDLElBQUksWUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLEVBQUUsQ0FBQyxDQUFDLEVBQS9CLENBQStCLEVBQ3ZELFlBQVksRUFBRSxZQUFFLElBQUksWUFBSSxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsRUFBbkIsQ0FBbUIsRUFDdkMsV0FBVyxFQUFFLGNBQU0sWUFBSSxDQUFDLFNBQVMsQ0FBQyxNQUFNLENBQUMsRUFBdEIsQ0FBc0IsRUFDekMsYUFBYSxFQUFFLFdBQUMsSUFBSSxZQUFJLENBQUMsV0FBVyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsRUFBM0IsQ0FBMkIsRUFDL0MsV0FBVyxFQUFFLFdBQUMsSUFBSSxZQUFJLENBQUMsU0FBUyxDQUFDLE1BQU0sRUFBRSxDQUFDLENBQUMsRUFBekIsQ0FBeUIsR0FDekMsQ0FDSixDQUNKO1lBRUwsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEtBQUsscUJBQXFCLEdBQUcsSUFBSSxHQUFHLENBQ2xELG9CQUFDLDJCQUFpQixJQUFDLE9BQU8sRUFBRSxXQUFDLElBQUksWUFBSSxDQUFDLFVBQVUsRUFBRSxFQUFqQixDQUFpQixFQUM5QyxNQUFNLEVBQUUsUUFBUSxDQUFDLFlBQVksRUFDN0IsTUFBTSxFQUFFLElBQUksQ0FBQyxrQkFBa0IsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxFQUNoRCxRQUFRLEVBQUUsY0FBSSxJQUFJLFlBQUksQ0FBQyxpQkFBaUIsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLEVBQXBDLENBQW9DLEdBQ3BELENBQ1QsQ0FDQyxDQUNULENBQUM7SUFDTixDQUFDO0lBQ0wsVUFBQztBQUFELENBQUMsQ0FyT2lCLEtBQUssQ0FBQyxTQUFTLEdBcU9oQzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDcFFELG1DQUErQjtBQUcvQjtJQUErQyxxQ0FBeUI7SUFDcEUsMkJBQVksS0FBTSxFQUFFLE9BQVE7UUFBNUIsWUFDSSxrQkFBTSxLQUFLLEVBQUUsT0FBTyxDQUFDLFNBRXhCO1FBREcsS0FBSSxDQUFDLEtBQUssR0FBRyxFQUFFLENBQUM7O0lBQ3BCLENBQUM7SUFFRCx1Q0FBVyxHQUFYO1FBQ0ksSUFBSSxNQUFNLEdBQUcsRUFBRSxDQUFDO1FBQ2hCLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsTUFBTSxVQUFFLENBQUMsQ0FBQztJQUNwQyxDQUFDO0lBRUQsdUNBQVcsR0FBWCxVQUFZLEtBQUs7UUFDYixJQUFJLE1BQU0sR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUMsQ0FBQztRQUU5QyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQztZQUMzQixNQUFNLEdBQUcsTUFBTSxDQUFDLE1BQU0sQ0FBQyxXQUFDLElBQUksUUFBQyxLQUFLLEtBQUssRUFBWCxDQUFXLENBQUMsQ0FBQztRQUM3QyxJQUFJO1lBQ0EsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztRQUV2QixJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFLE1BQU0sVUFBRSxDQUFDLENBQUM7SUFDcEMsQ0FBQztJQUVELGtDQUFNLEdBQU47UUFBQSxpQkE2Q0M7UUE1Q0csSUFBSSxNQUFNLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDLENBQUM7UUFFOUMsSUFBSSxhQUFhLEdBQUc7WUFDaEIsYUFBYSxFQUFFLGFBQWEsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxXQUFXO1NBQ3RFLENBQUM7UUFFRixNQUFNLENBQUMsQ0FDSCw2QkFBSyxFQUFFLEVBQUMscUJBQXFCO1lBQ3pCLDZCQUFLLFNBQVMsRUFBQyxnQkFBZ0IsRUFBQyxPQUFPLEVBQUUsV0FBQyxJQUFJLFlBQUksQ0FBQyxLQUFLLENBQUMsT0FBTyxFQUFFLEVBQXBCLENBQW9CO2dCQUM5RCw2QkFBSyxTQUFTLEVBQUMsUUFBUSxFQUFDLE9BQU8sRUFBRSxXQUFDLElBQUksUUFBQyxDQUFDLGVBQWUsRUFBRSxFQUFuQixDQUFtQjtvQkFFckQsNkJBQUssU0FBUyxFQUFDLGVBQWU7d0JBQzFCLHFEQUEyQixDQUN6QjtvQkFFTiw2QkFBSyxTQUFTLEVBQUMsYUFBYTt3QkFDeEIsNkJBQUssT0FBTyxFQUFFLFdBQUMsSUFBSSxZQUFJLENBQUMsV0FBVyxFQUFFLEVBQWxCLENBQWtCLEVBQUUsS0FBSyxFQUFFO2dDQUNyQyxZQUFZLEVBQUUsZ0JBQWdCLEVBQUUsT0FBTyxFQUFFLFlBQVksRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFBRSxTQUFTOzZCQUNsRzs0QkFDRCwyQkFBRyxTQUFTLEVBQUMsZ0JBQWdCLEVBQUMsS0FBSyxFQUFFLGFBQWEsSUFDN0MsTUFBTSxDQUFDLE1BQU0sS0FBSyxDQUFDLEdBQUcsc0JBQXNCLEdBQUcsd0JBQXdCLENBQ3hFOzRCQUNKLHFEQUE2QixDQUMzQjt3QkFFTCxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsV0FBQyxJQUFJLFFBQ3hCLDZCQUFLLE9BQU8sRUFBRSxXQUFDLElBQUksWUFBSSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLEVBQXhCLENBQXdCLEVBQUUsS0FBSyxFQUFFLEVBQUUsTUFBTSxFQUFFLFdBQVcsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFOzRCQUMxRiwyQkFBRyxTQUFTLEVBQUMsZ0JBQWdCLEVBQUUsS0FBSyxFQUFFLGFBQWEsSUFDOUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxHQUFHLFdBQVcsR0FBRyx5QkFBeUIsQ0FDbEU7NEJBQ1Isa0NBQU8sQ0FBQyxDQUFDLElBQUksQ0FBUSxDQUNuQixDQUNULEVBUDJCLENBTzNCLENBQUMsQ0FDQTtvQkFFTiw2QkFBSyxTQUFTLEVBQUMsZUFBZSxFQUFDLEtBQUssRUFBRSxFQUFDLFNBQVMsRUFBQyxPQUFPLEVBQUM7d0JBQ3JELDZCQUFLLFNBQVMsRUFBQyxTQUFTLEVBQUMsT0FBTyxFQUFFLFdBQUMsSUFBSSxZQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sRUFBRSxFQUFwQixDQUFvQjs0QkFDdkQseUNBQWlCLENBQ2YsQ0FDSixDQUNKLENBQ0osQ0FDSixDQUNULENBQUM7SUFDTixDQUFDO0lBQ0wsd0JBQUM7QUFBRCxDQUFDLENBcEU4QyxLQUFLLENBQUMsU0FBUyxHQW9FN0Q7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUN2RUQsbUNBQStCO0FBQy9CLHlDQUFnQztBQUVoQyxvREFBNEU7QUFDNUUsdUNBQWtFO0FBRWxFO0lBQXFDLDJCQUF5QjtJQUMxRCxpQkFBWSxLQUFNLEVBQUUsT0FBUTtRQUE1QixZQUNJLGtCQUFNLEtBQUssRUFBRSxPQUFPLENBQUMsU0FFeEI7UUFERyxLQUFJLENBQUMsS0FBSyxHQUFHLEVBQUUsT0FBTyxFQUFFLElBQUksRUFBRSxDQUFDOztJQUNuQyxDQUFDO0lBRUQsNkJBQVcsR0FBWCxVQUFZLENBQUM7UUFDVCxJQUFJLFdBQVcsR0FBRyxDQUFDLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUMsTUFBTSxDQUFDLGFBQWEsQ0FBQyxDQUFDLEtBQUssRUFDNUQsVUFBVSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFVBQVUsRUFDekMsVUFBVSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQztRQUU5QyxJQUFNLENBQUMsR0FBRyxJQUFJLENBQUMsY0FBYyxDQUFDLFdBQVcsQ0FBQyxDQUFDO1FBQzNDLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ3JCLEVBQUUsQ0FBQyxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsQ0FBQztnQkFDbEIsVUFBVSxHQUFHLEVBQUUsQ0FBQztZQUNwQixJQUFNLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxNQUFNLENBQUMsV0FBQyxJQUFJLFFBQUMsQ0FBQyxJQUFJLEtBQUssVUFBVSxFQUFyQixDQUFxQixDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDaEYsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsaUJBQWlCLENBQUMsVUFBVSxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQztnQkFDNUMsVUFBVSxHQUFHLEVBQUUsQ0FBQztRQUN4QixDQUFDO1FBRUQsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBRSxXQUFXLGVBQUUsVUFBVSxjQUFFLFVBQVUsY0FBRSxDQUFDLENBQUM7SUFDakUsQ0FBQztJQUVELCtCQUFhLEdBQWIsVUFBYyxDQUFDO1FBQ1gsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBRSxVQUFVLEVBQUUsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxhQUFhLENBQUMsQ0FBQyxLQUFLLEVBQUUsQ0FBQyxDQUFDO0lBQ3hGLENBQUM7SUFFRCw0QkFBVSxHQUFWLFVBQVcsQ0FBQztRQUNSLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsVUFBVSxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsS0FBSyxFQUFDLENBQUMsQ0FBQztJQUN2RCxDQUFDO0lBRUQsOEJBQVksR0FBWixVQUFhLE1BQU07UUFDZixFQUFFLENBQUMsQ0FBQyxNQUFNLEtBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxDQUFDO1lBQ3BDLE1BQU0sR0FBRyxFQUFFLENBQUM7UUFFaEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBRSxNQUFNLFVBQUUsQ0FBQyxDQUFDO0lBQ3BDLENBQUM7SUFFRCx1QkFBSyxHQUFMO1FBQ0ksSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUM7WUFDaEIsV0FBVyxFQUFFLElBQUksRUFBRSxVQUFVLEVBQUUsSUFBSSxFQUFFLFVBQVUsRUFBRSxFQUFFLEVBQUUsTUFBTSxFQUFFLEVBQUUsRUFBRSxPQUFPLEVBQUUsRUFBRSxFQUFFLE1BQU0sRUFBRSxDQUFDO1lBQ3ZGLE1BQU0sRUFBRSxFQUFFLEVBQUUsVUFBVSxFQUFFLEVBQUU7U0FDN0IsQ0FBQyxDQUFDO0lBQ1AsQ0FBQztJQUVELGlDQUFlLEdBQWYsVUFBZ0IsTUFBYTtRQUN6QixJQUFNLFVBQVUsR0FBRyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLFNBQVMsQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLFdBQUMsSUFBSSxRQUFDLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUMsRUFBMUIsQ0FBMEIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBRTNHLElBQU0sSUFBSSxHQUFHLFVBQVU7Y0FDakIsVUFBVSxDQUFDLElBQUk7Y0FDZixPQUFJLE1BQU0sSUFBSSxNQUFNLGFBQVMsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDO1FBRTNFLElBQUksR0FBRyxHQUFHLGtDQUFZLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsY0FBYyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBRS9ELEVBQUUsQ0FBQyxDQUFDLFVBQVUsSUFBSSxNQUFNLENBQUM7WUFDckIsR0FBRyxJQUFJLEdBQUcsR0FBRyxNQUFNLENBQUM7UUFFeEIsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDLE9BQU8sQ0FBQyxhQUFHO1lBQ3RCLFVBQUcsR0FBRywrQkFBUyxDQUFDLEdBQUcsRUFBRSxHQUFHLENBQUM7UUFBekIsQ0FBeUIsQ0FBQyxDQUFDO1FBRS9CLEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQztZQUN6QixHQUFHLEdBQUcsK0JBQVMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxJQUFJLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTSxFQUFFLENBQUMsQ0FBQztRQUU3RCxFQUFFLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLENBQUM7WUFDMUIsR0FBRyxHQUFHLCtCQUFTLENBQUMsR0FBRyxFQUFFLEVBQUUsT0FBTyxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE9BQU8sRUFBRSxDQUFDLENBQUM7UUFFakUsRUFBRSxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDOUMsR0FBRyxHQUFHLCtCQUFTLENBQUMsR0FBRyxFQUFFLEVBQUUsTUFBTSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sQ0FBQyxJQUFJLENBQUMsR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBRXJFLEVBQUUsQ0FBQyxDQUFDLENBQUMsTUFBTSxJQUFJLE1BQU0sS0FBSyxNQUFNLENBQUM7Z0JBQzdCLEdBQUcsR0FBRywrQkFBUyxDQUFDLEdBQUcsRUFBRSxFQUFFLFFBQVEsRUFBRSxLQUFLLEVBQUUsQ0FBQyxDQUFDO1FBQ2xELENBQUM7UUFFRCxHQUFHLEdBQUcsK0JBQVMsQ0FBQyxHQUFHLEVBQUUsRUFBRSxPQUFPLEVBQUUsT0FBTyxFQUFFLENBQUMsQ0FBQztRQUUzQyxHQUFHLEdBQUcsR0FBRyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEVBQUUsR0FBRyxDQUFDLENBQUM7UUFFL0IsTUFBTSxDQUFDLEdBQUcsQ0FBQztJQUNmLENBQUM7SUFFRCxrQ0FBZ0IsR0FBaEI7UUFDVSwwQkFBMkQsRUFBekQsNEJBQVcsRUFBRSwwQkFBVSxFQUFFLDBCQUFVLENBQXVCO1FBQ2xFLE1BQU0sQ0FBQyxXQUFXLElBQUksVUFBVSxJQUFJLFVBQVU7ZUFDdkMsQ0FBQyxVQUFVLENBQUMsV0FBVyxFQUFFLEtBQUssU0FBUyxJQUFJLENBQUMsVUFBVSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxDQUFDLElBQUksVUFBVSxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsR0FBRyxVQUFVLENBQUMsTUFBTSxHQUFFLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDdkksQ0FBQztJQUVELHlCQUFPLEdBQVA7UUFDSSxNQUFNLENBQUMsSUFBSSxDQUFDLGdCQUFnQixFQUFFO2VBQ3ZCLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU07ZUFDeEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsTUFBTTtlQUN4QixDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLE1BQU0sSUFBSSxFQUFFLENBQUMsQ0FBQyxNQUFNLEdBQUcsQ0FBQztlQUMzQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPO2VBQ3pCLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBVSxJQUFJLEVBQUUsQ0FBQyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7SUFDM0QsQ0FBQztJQUVELHlCQUFPLEdBQVA7UUFBQSxpQkFpQkM7UUFoQkcsSUFBSSxJQUFJLEdBQUcsRUFBRSxDQUFDO1FBQ2QsSUFBSSxVQUFVLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxVQUFVLElBQUksRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQy9ELEVBQUUsQ0FBQyxDQUFDLElBQUksQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLENBQUMsQ0FBQztZQUMxQixVQUFVLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLENBQUM7UUFDdkMsQ0FBQztRQUVELFVBQVUsQ0FBQyxPQUFPLENBQUMsbUJBQVM7WUFDaEIsdUNBQVcsRUFBRSxpQ0FBVSxFQUFFLGlDQUFVLENBQWU7WUFDMUQsSUFBSSxVQUFVLEdBQUcsS0FBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLFdBQUMsSUFBSSxRQUFDLENBQUMsSUFBSSxLQUFLLFVBQVUsRUFBckIsQ0FBcUIsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQzlFLEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxDQUFDLENBQUM7Z0JBQ2IsSUFBTSxLQUFLLEdBQUcsVUFBVSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxFQUFFLFdBQVcsQ0FBQyxDQUFDO2dCQUN6RCxJQUFJLENBQUMsSUFBSSxXQUFHLEdBQUMsS0FBSyxJQUFHLFVBQVUsTUFBRyxDQUFDO1lBQ3ZDLENBQUM7O1FBQ0wsQ0FBQyxDQUFDLENBQUM7UUFFSCxNQUFNLENBQUMsSUFBSSxDQUFDO0lBQ2hCLENBQUM7SUFFRCxnQ0FBYyxHQUFkLFVBQWUsSUFBWTtRQUN2QixNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsY0FBYyxDQUFDLE1BQU0sQ0FBQyxXQUFDLElBQUksUUFBQyxDQUFDLElBQUksS0FBSyxJQUFJLEVBQWYsQ0FBZSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDOUUsQ0FBQztJQUVELDRCQUFVLEdBQVYsVUFBVyxDQUFDO1FBQ1IsTUFBTSxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxJQUFJLElBQUksRUFBRSxDQUFDLENBQUMsV0FBVyxFQUFFLENBQUMsVUFBVSxDQUFDLEtBQUssQ0FBQyxDQUFDO0lBQy9ELENBQUM7SUFFRCxtQ0FBaUIsR0FBakIsVUFBa0IsVUFBVSxFQUFFLFNBQVM7UUFDbkMsTUFBTSxDQUFDLENBQUMsVUFBVSxJQUFJLENBQUMsVUFBVSxDQUFDLEtBQUssSUFBSSxDQUFDLFNBQVM7WUFDakQsVUFBVSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxDQUFDLFdBQVcsRUFBRSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQyxPQUFPLENBQUMsU0FBUyxDQUFDLFdBQVcsRUFBRSxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzFHLENBQUM7SUFFRCxnQ0FBYyxHQUFkO1FBQUEsaUJBU0M7UUFSRyxJQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQztRQUNqQyxFQUFFLENBQUMsQ0FBQyxNQUFNLElBQUksTUFBTSxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUM7WUFDL0IsSUFBTSxHQUFDLEdBQUcsSUFBSSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsV0FBVyxDQUFDLENBQUM7WUFDbEQsRUFBRSxDQUFDLENBQUMsR0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDSixNQUFNLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLFdBQUMsSUFBSSxZQUFJLENBQUMsaUJBQWlCLENBQUMsQ0FBQyxFQUFFLEdBQUMsQ0FBQyxJQUFJLENBQUMsRUFBakMsQ0FBaUMsQ0FBQyxDQUFDO1lBQ2pGLENBQUM7UUFDTCxDQUFDO1FBQ0QsTUFBTSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsV0FBVyxDQUFDO0lBQ2xDLENBQUM7SUFFRCwrQkFBYSxHQUFiLFVBQWMsUUFBUTtRQUF0QixpQkFvREM7UUFuREcsSUFBSSxVQUFVLEdBQUcsSUFBSSxFQUFFLFdBQVcsR0FBRyxJQUFJLENBQUM7UUFDMUMsSUFBSSxTQUFTLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxlQUFlLENBQUMsSUFBSSxFQUFFLENBQUM7YUFDekQsS0FBSyxDQUFDLEdBQUcsQ0FBQzthQUNWLE1BQU0sQ0FBQyxXQUFDLElBQUksUUFBQyxDQUFDLElBQUksRUFBRSxDQUFDLE1BQU0sR0FBRyxDQUFDLEVBQW5CLENBQW1CLENBQUMsQ0FBQztRQUV0QyxFQUFFLENBQUMsQ0FBQyxTQUFTLENBQUMsTUFBTSxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDdkIsVUFBVSxHQUFHLEVBQUUsRUFBRSxXQUFXLEdBQUcsRUFBRSxDQUFDO1lBQ2xDLFNBQVMsQ0FBQyxPQUFPLENBQUMsV0FBQztnQkFDZixJQUFJLEtBQUssR0FBRyxrQ0FBWSxDQUFDLENBQUMsRUFBRSxHQUFHLENBQUMsQ0FBQztnQkFDakMsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDMUIsRUFBRSxDQUFDLENBQUMsS0FBSyxDQUFDLE1BQU0sR0FBRyxDQUFDLENBQUM7b0JBQ2pCLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsR0FBRyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUM7WUFDekMsQ0FBQyxDQUFDLENBQUM7UUFDUCxDQUFDO1FBRUssNEJBQU0sRUFBRSwwQkFBTyxFQUFFLHNCQUFLLEVBQWUsUUFBUSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFFBQVEsQ0FBQztRQUVqRixJQUFNLE9BQU8sR0FBRyxVQUFDLElBQUksRUFBRSxNQUFNLEVBQUUsTUFBTSxJQUFLLGFBQU07Y0FDMUMsMkJBQUcsU0FBUyxFQUFDLGdCQUFnQixFQUFDLEtBQUssRUFBRSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsRUFBRSxPQUFPLEVBQUUsV0FBQyxJQUFJLFlBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxDQUFDLEVBQUUsTUFBTSxVQUFFLENBQUMsRUFBL0IsQ0FBK0IsSUFBRyxJQUFJLENBQUs7Y0FDckgsMkJBQUcsU0FBUyxFQUFDLGdCQUFnQixFQUFDLEtBQUssRUFBRSxFQUFFLEtBQUssRUFBRSxNQUFNLEVBQUUsSUFBRyxJQUFJLENBQUssRUFGOUIsQ0FFOEIsQ0FBQztRQUV6RSxJQUFJLE1BQU0sR0FBRyxDQUNULDhCQUFNLFNBQVMsRUFBQyxRQUFRLEVBQUMsS0FBSyxFQUFFLEVBQUMsT0FBTyxFQUFDLFlBQVksRUFBQztZQUNqRCxPQUFPLENBQUMsZUFBZSxFQUFFLE1BQU0sR0FBRyxDQUFDLEVBQUUsQ0FBQyxDQUFDO1lBQ3ZDLE9BQU8sQ0FBQyxjQUFjLEVBQUUsTUFBTSxHQUFHLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxDQUFDLE1BQU0sR0FBRyxRQUFRLEVBQUUsQ0FBQyxDQUFDLENBQUM7WUFDbkUsT0FBTyxDQUFDLGVBQWUsRUFBRSxNQUFNLEdBQUcsUUFBUSxHQUFHLEtBQUssRUFBRSxNQUFNLEdBQUcsUUFBUSxDQUFDO1lBQ3RFLE9BQU8sQ0FBQyxXQUFXLEVBQUUsTUFBTSxHQUFHLFFBQVEsR0FBRyxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDLEtBQUssR0FBRyxDQUFDLENBQUMsR0FBRyxRQUFRLENBQUMsR0FBRyxRQUFRLENBQUMsQ0FDNUYsQ0FDVixDQUFDO1FBRUYsTUFBTSxDQUFDLFFBQVEsQ0FBQyxPQUFPLENBQUMsTUFBTSxLQUFLLENBQUM7Y0FDOUIsNkJBQUssU0FBUyxFQUFDLGNBQWMsNEJBQTRCO2NBQ3pELENBQ0U7Z0JBQ0ksNkJBQUssU0FBUyxFQUFDLFVBQVUsRUFBQyxLQUFLLEVBQUUsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUU7b0JBQ25FLE1BQU07b0JBQ1A7O3dCQUNxQixNQUFNLEdBQUcsQ0FBQzs7d0JBQUssTUFBTSxHQUFHLE9BQU8sQ0FBQyxNQUFNOzt3QkFBTSxLQUFLLENBQy9EO29CQUVQLDJCQUFHLFNBQVMsRUFBQyxnQkFBZ0IsRUFBQyxLQUFLLEVBQUMsbUJBQW1CLEVBQUMsT0FBTyxFQUFFLFdBQUMsSUFBSSxZQUFJLENBQUMsS0FBSyxDQUFDLFlBQVksQ0FBQyxxQkFBcUIsQ0FBQyxFQUE5QyxDQUE4QyxFQUFFLEtBQUssRUFBRTs0QkFDekgsYUFBYSxFQUFFLGFBQWEsRUFBRSxNQUFNLEVBQUUsWUFBWSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFDLE1BQU07eUJBQ3pGLGdCQUFlLENBQ2Q7Z0JBRU4sb0JBQUMsaUJBQU8sSUFBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLE9BQU8sRUFBRSxVQUFVLEVBQUUsVUFBVSxFQUFFLFdBQVcsRUFBRSxXQUFXLEVBQ2hGLFFBQVEsRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsRUFDN0IsTUFBTSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxFQUN6QixlQUFlLEVBQUUsaUJBQU8sSUFBSSxZQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFLE9BQU8sV0FBRSxDQUFDLEVBQWhDLENBQWdDLEdBQUksQ0FDbEUsQ0FDVCxDQUFDO0lBQ1YsQ0FBQztJQUVELDRCQUFVLEdBQVYsVUFBVyxFQUFFLEVBQUUsTUFBTTtRQUFyQixpQkE4R0M7UUE3R0csSUFBTSxHQUFHLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLENBQUMsQ0FBQztRQUMzRCxJQUFNLElBQUksR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQyxJQUFJLENBQUM7UUFDdEMsSUFBTSxlQUFlLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHLEtBQUssR0FBRyxDQUFDO1FBQy9DLEVBQUUsQ0FBQyxDQUFDLGVBQWUsQ0FBQyxDQUFDLENBQUM7WUFDbEIsSUFBSSxNQUFNLEdBQUcsSUFBSSxDQUFDLGVBQWUsQ0FBQyxNQUFNLENBQUMsQ0FBQztZQUMxQyxNQUFNLEdBQUcsK0JBQVMsQ0FBQyxNQUFNLEVBQUUsRUFBRSxRQUFRLEVBQUUsNERBQTRELEVBQUUsQ0FBQyxDQUFDO1lBRXZHLGVBQU0sQ0FBQyxHQUFHLENBQUMsTUFBTSxDQUFDO2lCQUNiLElBQUksQ0FBQyxXQUFDO2dCQUNILElBQUksUUFBUSxHQUFHLGtCQUFTLENBQUMsQ0FBQyxDQUFDLENBQUM7Z0JBQzVCLFFBQVEsQ0FBQyxHQUFHLEdBQUcsR0FBRyxDQUFDO2dCQUNuQixLQUFJLENBQUMsUUFBUSxDQUFDLEVBQUUsR0FBRyxPQUFFLElBQUksUUFBRSxRQUFRLFlBQUUsS0FBSyxFQUFDLElBQUksRUFBRSxDQUFDLENBQUM7WUFDdkQsQ0FBQyxDQUFDO2lCQUNELEtBQUssQ0FBQyxXQUFDO2dCQUNKLElBQUksTUFBTSxHQUFHLENBQUMsQ0FBQyxjQUFjLENBQUM7Z0JBQzlCLEtBQUksQ0FBQyxRQUFRLENBQUMsRUFBRSxHQUFHLE9BQUUsSUFBSSxRQUFFLFFBQVEsRUFBQyxJQUFJLEVBQUUsS0FBSyxFQUFLLE1BQU0sQ0FBQyxTQUFTLFVBQUssTUFBTSxDQUFDLE9BQVMsRUFBRSxDQUFDLENBQUM7WUFDakcsQ0FBQyxDQUFDLENBQUM7UUFDWCxDQUFDO1FBRUQsSUFBTSxPQUFPLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLElBQUksRUFBRSxDQUFDLENBQUM7UUFFbEQsTUFBTSxDQUFDLENBQ0g7WUFDSSw2QkFBSyxFQUFFLEVBQUMsYUFBYSxJQUNoQixJQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxhQUFhLENBQUMsQ0FDbkM7WUFDTiw2QkFBSyxFQUFFLEVBQUMsS0FBSyxFQUFDLEtBQUssRUFBRSxFQUFFLE9BQU8sRUFBRSxZQUFZLEVBQUUsVUFBVSxFQUFDLFFBQVEsRUFBRTtnQkFDL0QsMkJBQUcsSUFBSSxFQUFFLEdBQUcsRUFBRSxNQUFNLEVBQUMsUUFBUSxJQUFFLEdBQUcsQ0FBSztnQkFDdEMsQ0FBRyxJQUFJLENBQUMsT0FBTyxFQUFFLEdBQUcsSUFBSSxHQUFHLENBQ3hCLDJCQUFHLFNBQVMsRUFBQyx5QkFBeUIsRUFBQyxLQUFLLEVBQUMsYUFBYSxFQUFDLE9BQU8sRUFBRSxXQUFDLElBQUksWUFBSSxDQUFDLEtBQUssRUFBRSxFQUFaLENBQVksRUFBRyxLQUFLLEVBQUU7d0JBQzNGLE9BQU8sRUFBRSxXQUFXLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLGFBQWEsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLFNBQVM7cUJBQ3ZHLFlBQVcsQ0FDZixDQUNDO1lBRU4sZ0NBQVEsS0FBSyxFQUFFLE1BQU0sQ0FBQyxXQUFXLEVBQUUsUUFBUSxFQUFFLFdBQUMsSUFBSSxZQUFJLENBQUMsV0FBVyxDQUFDLENBQUMsQ0FBQyxFQUFuQixDQUFtQjtnQkFDakUsbUNBQWlCO2dCQUNoQixFQUFFLENBQUMsY0FBYyxDQUFDLEdBQUcsQ0FDbEIsV0FBQyxJQUFJLHVDQUFRLEdBQUcsRUFBRSxDQUFDLENBQUMsSUFBSSxJQUFHLENBQUMsQ0FBQyxJQUFJLENBQVUsRUFBdEMsQ0FBc0MsQ0FBQyxDQUMzQztZQUNULGdDQUFRLEtBQUssRUFBRSxNQUFNLENBQUMsVUFBVSxFQUFFLFFBQVEsRUFBRSxXQUFDLElBQUksWUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDLENBQUMsRUFBckIsQ0FBcUI7Z0JBQ2xFLG1DQUFpQjtnQkFDaEIsSUFBSSxDQUFDLGNBQWMsRUFBRSxDQUFDLEdBQUcsQ0FDdEIsV0FBQyxJQUFJLHVDQUFRLEdBQUcsRUFBRSxDQUFDLENBQUMsSUFBSSxJQUFHLENBQUMsQ0FBQyxJQUFJLENBQVUsRUFBdEMsQ0FBc0MsQ0FBQyxDQUMzQztZQUNULCtCQUFPLElBQUksRUFBQyxNQUFNLEVBQUMsRUFBRSxFQUFDLFdBQVcsRUFBQyxLQUFLLEVBQUUsTUFBTSxDQUFDLFVBQVUsRUFBRSxZQUFZLEVBQUMsS0FBSyxFQUMxRSxRQUFRLEVBQUUsV0FBQyxJQUFJLFlBQUksQ0FBQyxVQUFVLENBQUMsQ0FBQyxDQUFDLEVBQWxCLENBQWtCLEVBQ2pDLFNBQVMsRUFBRSxXQUFDLElBQUksUUFBQyxDQUFDLE9BQU8sS0FBSyxFQUFFLEdBQUcsS0FBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLEVBQUUsR0FBRyxJQUFJLEVBQXJELENBQXFELEdBQUk7WUFFNUUsSUFBSSxDQUFDLGdCQUFnQixFQUFFO2tCQUNsQixDQUFDLDJCQUFHLFNBQVMsRUFBQyxnQkFBZ0IsRUFBQyxLQUFLLEVBQUUsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLGFBQWEsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLFNBQVMsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLEVBQ3RILE9BQU8sRUFBRSxXQUFDLElBQUksWUFBSSxDQUFDLEtBQUssQ0FBQyxjQUFjLEVBQUUsRUFBM0IsQ0FBMkIsRUFBRyxLQUFLLEVBQUMsZUFBZSxpQkFBZSxDQUFDO2tCQUNuRixDQUFDLDJCQUFHLFNBQVMsRUFBQyxnQkFBZ0IsRUFBQyxLQUFLLEVBQUUsRUFBRSxRQUFRLEVBQUUsTUFBTSxFQUFFLGFBQWEsRUFBRSxRQUFRLEVBQUUsS0FBSyxFQUFFLE1BQU0sRUFBRSxFQUNoRyxLQUFLLEVBQUMsc0JBQXNCLGlCQUFlLENBQUM7WUFFbkQsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxPQUFPLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLE1BQU0sS0FBSyxDQUFDLEdBQUcsSUFBSSxHQUFHLENBQzNFLDhCQUFNLFNBQVMsRUFBQyxrQkFBa0IsSUFDN0IsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxXQUFDO2dCQUM1QixxQ0FBTSxHQUFHLEVBQUUsQ0FBQyxFQUFFLFNBQVMsRUFBRSxNQUFNLENBQUMsTUFBTSxLQUFLLENBQUMsR0FBRyxRQUFRLEdBQUcsRUFBRSxFQUFFLE9BQU8sRUFBRSxXQUFDLElBQUksWUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsRUFBcEIsQ0FBb0IsSUFBRyxDQUFDLENBQVE7WUFBNUcsQ0FBNEcsQ0FBQyxDQUM5RyxDQUFDO1lBRVgsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsTUFBTSxHQUFHLENBQUM7Z0JBQ3JELENBQUM7b0JBQ0csNkJBQUssU0FBUyxFQUFDLFlBQVksSUFDdEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxXQUFDLElBQUksUUFDbkMsNkJBQUssR0FBRyxFQUFFLENBQUMsQ0FBQyxFQUFFO3dCQUNWLDJCQUFHLFNBQVMsRUFBQyxnQkFBZ0IsRUFBQyxLQUFLLEVBQUUsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxFQUM5RixLQUFLLEVBQUMsa0JBQWtCLEVBQ3hCLE9BQU8sRUFBRSxXQUFDLElBQUksWUFBSSxDQUFDLEtBQUssQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDLENBQUMsRUFBL0IsQ0FBK0Isb0JBQW9CO3dCQUNwRSxDQUFDLENBQUMsV0FBVzs7d0JBQUcsQ0FBQyxDQUFDLFVBQVU7O3dCQUFHLENBQUMsQ0FBQyxVQUFVLENBQzFDLENBQ1QsRUFQc0MsQ0FPdEMsQ0FBQyxDQUNBO29CQUVMLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxNQUFNLEdBQUcsQ0FBQzswQkFDbEMsQ0FBQyw2QkFBSyxLQUFLLEVBQUUsRUFBRSxPQUFPLEVBQUUsY0FBYyxFQUFFLGFBQWEsRUFBRSxLQUFLLEVBQUUsT0FBTyxFQUFFLEVBQUUsRUFBRTs0QkFDdEUsMkJBQUcsS0FBSyxFQUFDLFlBQVksRUFBQyxTQUFTLEVBQUMsZ0JBQWdCLEVBQUMsS0FBSyxFQUFFLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxLQUFLLEVBQUUsTUFBTSxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsRUFDM0csT0FBTyxFQUFFLFdBQUMsSUFBSSxZQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsRUFBRSxFQUF4QixDQUF3QixXQUFXLENBQ2xELENBQUM7MEJBQ1IsSUFBSTtvQkFFViw2QkFBSyxTQUFTLEVBQUMsU0FBUyxJQUNuQixPQUFPLENBQUMsR0FBRyxDQUFDLFdBQUMsSUFBSSxRQUNkO3dCQUNJLDJCQUFHLFNBQVMsRUFBQyxnQkFBZ0IsRUFBQyxLQUFLLEVBQUUsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsT0FBTyxFQUFFLFdBQVcsRUFBRSxFQUM5RixLQUFLLEVBQUMsY0FBYyxFQUNwQixPQUFPLEVBQUUsV0FBQyxJQUFJLFlBQUksQ0FBQyxLQUFLLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQyxFQUEzQixDQUEyQixvQkFBb0I7d0JBRWpFLDhCQUFNLFNBQVMsRUFBQyxLQUFLLEVBQUMsS0FBSyxFQUFDLFlBQVksRUFDcEMsT0FBTyxFQUFFLFdBQUMsSUFBSSxZQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxDQUFDLENBQUMsRUFBekIsQ0FBeUIsSUFBSSxDQUFDLENBQUMsSUFBSSxDQUFRLENBQzNELENBQ1QsRUFUaUIsQ0FTakIsQ0FBQyxDQUNBLENBQ0osQ0FBQztrQkFDTCxJQUFJO1lBRVIsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRO2tCQUNmLENBQUMsQ0FBQyxlQUFlLElBQUksSUFBSSxLQUFLLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSTtzQkFDekMsSUFBSSxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLFFBQVEsQ0FBQztzQkFDdkMsQ0FBQyw2QkFBSyxLQUFLLEVBQUUsRUFBRSxLQUFLLEVBQUUsU0FBUyxFQUFFLE9BQU8sRUFBQyxZQUFZLEVBQUU7d0JBQ2pELDJCQUFHLFNBQVMsRUFBQyxxQkFBcUIsRUFBQyxLQUFLLEVBQUUsRUFBRSxRQUFRLEVBQUMsTUFBTSxFQUFFLGFBQWEsRUFBRSxhQUFhLEVBQUUsYUFBWTt3QkFDdkcsOEJBQU0sS0FBSyxFQUFFLEVBQUUsT0FBTyxFQUFDLFdBQVcsRUFBQyx5QkFBMkIsQ0FDN0QsQ0FBQyxDQUFDO2tCQUNiLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSztzQkFDWiw2QkFBSyxLQUFLLEVBQUUsRUFBRSxLQUFLLEVBQUMsU0FBUyxFQUFFLE9BQU8sRUFBQyxDQUFDLEVBQUUsSUFBRyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBTztzQkFDcEUsSUFBSSxDQUVaLENBQ1QsQ0FBQztJQUNOLENBQUM7SUFFRCx3QkFBTSxHQUFOO1FBQ0ksSUFBTSxRQUFRLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDbEQsTUFBTSxDQUFDLENBQ0gsNkJBQUssRUFBRSxFQUFDLFNBQVM7WUFDYiw2QkFBSyxTQUFTLEVBQUMsT0FBTztnQkFDbEI7b0JBQ0E7d0JBQ0k7NEJBQ0ssUUFBUSxHQUFHLDRCQUFJLEtBQUssRUFBRSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsR0FBTyxHQUFHLElBQUk7NEJBQ3pELGdDQUNLLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUTtrQ0FDZCxJQUFJLENBQUMsVUFBVSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsUUFBUSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDO2tDQUN2RCxDQUFDLDZCQUFLLEtBQUssRUFBRSxFQUFFLE9BQU8sRUFBRSxRQUFRLEVBQUUsUUFBUSxFQUFDLE1BQU0sRUFBRSxLQUFLLEVBQUMsU0FBUyxFQUFFO29DQUNsRSwyQkFBRyxTQUFTLEVBQUMsZ0JBQWdCLEVBQUMsS0FBSyxFQUFFLEVBQUUsYUFBYSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUMsWUFBWSxFQUFDLGlCQUFnQjtvQ0FDbkcsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsVUFBVSxHQUFHLENBQUM7MENBQzdCLHVCQUF1QjswQ0FDbkIsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsZUFBZTs4Q0FDL0IsZ0NBQWdDOzhDQUNoQyw4Q0FBOEMsQ0FBTyxDQUFDLENBQzNFOzRCQUNKLENBQUMsUUFBUSxHQUFHLDRCQUFJLEtBQUssRUFBRSxFQUFFLFFBQVEsRUFBRSxNQUFNLEVBQUUsR0FBTyxHQUFHLElBQUksQ0FDekQsQ0FDQSxDQUNBLENBQ1AsQ0FDSixDQUNULENBQUM7SUFDTixDQUFDO0lBQ0wsY0FBQztBQUFELENBQUMsQ0E1VW9DLEtBQUssQ0FBQyxTQUFTLEdBNFVuRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ2xWRCxtQ0FBK0I7QUFFL0I7SUFBb0MsMEJBQXlCO0lBQTdEOztJQW9CQSxDQUFDO0lBbkJHLHVCQUFNLEdBQU47UUFBQSxpQkFrQkM7UUFqQkcsTUFBTSxDQUFDLENBQ0gsNkJBQUssRUFBRSxFQUFDLFFBQVEsRUFBQyxLQUFLLEVBQUUsRUFBRSxNQUFNLEVBQUUsTUFBTSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUUsYUFBYSxFQUFFLEtBQUssRUFBRTtZQUM3RSwyQkFBRyxTQUFTLEVBQUMsZ0JBQWdCLEVBQUMsS0FBSyxFQUFFLEVBQUUsTUFBTSxFQUFFLFNBQVMsRUFBRSxFQUFFLE9BQU8sRUFBRSxXQUFDLElBQUksWUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLEVBQUUsRUFBNUIsQ0FBNEIsV0FFbEc7WUFDSiw0Q0FBa0I7WUFDakIsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLElBQUksSUFBSSxHQUFHLDZCQUFLLEtBQUssRUFBRSxFQUFDLElBQUksRUFBQyxDQUFDLEVBQUMsR0FBSSxHQUFHLENBQ25ELDZCQUFLLEVBQUUsRUFBQyxnQkFBZ0IsRUFBQyxLQUFLLEVBQUUsRUFBRSxPQUFPLEVBQUUsTUFBTSxFQUFFLElBQUksRUFBRSxDQUFDLEVBQUU7Z0JBQ3hEO29CQUNJLDZCQUFLLFNBQVMsRUFBQyxXQUFXLEdBQU8sQ0FDL0I7Z0JBQ04sZ0NBQUssSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQU07Z0JBQzNCLDZCQUFLLEtBQUssRUFBRSxFQUFFLE1BQU0sRUFBRSxNQUFNLEVBQUUsSUFBSSxFQUFFLENBQUMsRUFBRSxHQUFRLENBQzdDLENBQ1QsQ0FDQyxDQUNULENBQUM7SUFDTixDQUFDO0lBQ0wsYUFBQztBQUFELENBQUMsQ0FwQm1DLEtBQUssQ0FBQyxTQUFTLEdBb0JsRDs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQ3RCRCxtQ0FBK0I7QUFHL0IsdUNBQW9DO0FBRXBDLG9EQUErQztBQUUvQztJQUFxQywyQkFBeUI7SUFBOUQ7O0lBc0VBLENBQUM7SUFyRUcsNkJBQVcsR0FBWCxVQUFZLENBQU07UUFDZCxNQUFNLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDLENBQUM7Y0FDakIsQ0FBQyxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUM7Y0FDWixPQUFPLENBQUMsSUFBSSxXQUFXO2tCQUN2QixFQUFFO2tCQUNGLE9BQU8sQ0FBQyxJQUFJLFFBQVE7c0JBQ2hCLElBQUksQ0FBQyxTQUFTLENBQUMsQ0FBQyxDQUFDO3NCQUNqQixDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQ3JCLENBQUM7SUFFRCw4QkFBWSxHQUFaLFVBQWEsQ0FBUztRQUNsQixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ0osRUFBRSxDQUFDLENBQUMsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFNLENBQUMsQ0FBQztnQkFDckIsTUFBTSxDQUFDLDJCQUFHLElBQUksRUFBRSxDQUFDLEVBQUUsTUFBTSxFQUFDLFFBQVEsSUFBRSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUMsQ0FBQyxPQUFPLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQU0sQ0FBQztZQUVoRixFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLEtBQUssT0FBTyxDQUFDO2dCQUM1QixNQUFNLENBQUMsMkJBQUcsU0FBUyxFQUFDLGdCQUFnQixFQUFDLEtBQUssRUFBRSxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSw4QkFBNkIsQ0FBQztZQUNwSCxFQUFFLENBQUMsQ0FBQyxDQUFDLENBQUMsV0FBVyxFQUFFLEtBQUssTUFBTSxDQUFDO2dCQUMzQixNQUFNLENBQUMsMkJBQUcsU0FBUyxFQUFDLGdCQUFnQixFQUFDLEtBQUssRUFBRSxFQUFFLEtBQUssRUFBRSxTQUFTLEVBQUUsUUFBUSxFQUFFLE1BQU0sRUFBRSxnQkFBZSxDQUFDO1FBQzFHLENBQUM7UUFFRCxNQUFNLENBQUMsa0NBQU8sQ0FBQyxDQUFRLENBQUM7SUFDNUIsQ0FBQztJQUVELHdCQUFNLEdBQU47UUFBQSxpQkE0Q0M7UUEzQ0csSUFBSSxPQUFPLEdBQUcsNkJBQUssU0FBUyxFQUFDLGNBQWMsNEJBQTRCLENBQUM7UUFFeEUsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUM7UUFDakMsRUFBRSxDQUFDLENBQUMsT0FBTyxJQUFJLE9BQU8sQ0FBQyxNQUFNLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQztZQUNoQyxJQUFJLFVBQVUsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLE1BQU0sQ0FBQyxNQUFNLElBQUksRUFBRSxDQUFDO1lBQ2hELEVBQUUsQ0FBQyxDQUFDLFVBQVUsQ0FBQyxNQUFNLEtBQUssQ0FBQyxDQUFDLENBQUMsQ0FBQztnQkFDMUIsVUFBVSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVTtvQkFDOUIsSUFBSSxDQUFDLEtBQUssQ0FBQyxRQUFRLENBQUMsWUFBWSxDQUFDLEdBQUcsQ0FBQyxXQUFDLElBQUksUUFBQyxDQUFDLElBQUksRUFBTixDQUFNLENBQUMsQ0FBQztZQUMxRCxDQUFDO1lBRUQsSUFBSSxXQUFXLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxXQUFXLElBQUksRUFBRSxDQUFDO1lBRS9DLElBQUksT0FBTyxHQUFHLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLENBQUMsT0FBTyxJQUFJLEVBQUUsQ0FBQyxDQUFDO1lBQ2hELElBQUksV0FBVyxHQUFHLE9BQU8sQ0FBQyxVQUFVLENBQUMsR0FBRyxDQUFDLEdBQUcsT0FBTyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsR0FBRyxPQUFPLENBQUM7WUFFeEUsT0FBTyxHQUFHLENBQ04sK0JBQU8sU0FBUyxFQUFDLFNBQVM7Z0JBQ3RCO29CQUFPLDRCQUFJLFNBQVMsRUFBQyxVQUFVLElBQUcsVUFBVSxDQUFDLEdBQUcsQ0FBQyxXQUFDLElBQUksUUFDbEQsNEJBQUksR0FBRyxFQUFFLENBQUMsRUFBRSxLQUFLLEVBQUUsRUFBRSxNQUFNLEVBQUUsU0FBUyxFQUFFLEVBQ3BDLE9BQU8sRUFBRSxXQUFDLElBQUksWUFBSSxDQUFDLEtBQUssQ0FBQyxlQUFlLENBQUMsQ0FBQyxLQUFLLFdBQVcsR0FBRyxHQUFHLEdBQUcsQ0FBQyxHQUFHLENBQUMsT0FBTyxDQUFDLFVBQVUsQ0FBQyxHQUFHLENBQUMsR0FBRyxFQUFFLEdBQUcsV0FBVyxDQUFDLEVBQXJHLENBQXFHO3dCQUVqSCw4QkFBUSxDQUFDLENBQUMsQ0FBQzt3QkFFWCxDQUFDLEtBQUssV0FBVyxHQUFHLElBQUk7NEJBQ3RCLDJCQUFHLFNBQVMsRUFBQyxnQkFBZ0IsRUFBQyxLQUFLLEVBQUUsRUFBQyxRQUFRLEVBQUMsTUFBTSxFQUFDLGFBQWEsRUFBQyxRQUFRLEVBQUMsSUFBRyxPQUFPLENBQUMsVUFBVSxDQUFDLEdBQUcsQ0FBQyxHQUFHLGlCQUFpQixHQUFHLGVBQWUsQ0FBSyxDQUNySixDQUNSLEVBVHFELENBU3JELENBQUMsQ0FBTSxDQUFRO2dCQUNoQixtQ0FDTSxPQUFPLENBQUMsR0FBRyxDQUFDLFVBQUMsQ0FBQyxFQUFDLENBQUMsSUFBSyxRQUNuQiw0QkFBSSxHQUFHLEVBQUUsQ0FBQyxJQUNMLFVBQVUsQ0FBQyxHQUFHLENBQUMsVUFBQyxDQUFDLEVBQUUsQ0FBQyxJQUFLLFFBQ3RCLDRCQUFJLEdBQUcsRUFBRSxDQUFDLEVBQUUsS0FBSyxFQUFFLEtBQUksQ0FBQyxXQUFXLENBQUMsaUJBQVEsQ0FBQyxDQUFDLEVBQUMsQ0FBQyxDQUFDLENBQUMsRUFBRyxLQUFLLEVBQUUsaUJBQVEsQ0FBQyxXQUFXLEVBQUMsQ0FBQyxDQUFDLEdBQUcsRUFBRSxRQUFRLEVBQUUsUUFBUSxDQUFDLGlCQUFRLENBQUMsV0FBVyxFQUFDLENBQUMsQ0FBQyxDQUFDLEVBQUUsR0FBRyxFQUFFLElBQ3BJLEtBQUksQ0FBQyxZQUFZLENBQUMsS0FBSSxDQUFDLFdBQVcsQ0FBQyxpQkFBUSxDQUFDLENBQUMsRUFBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQ25ELENBQ1IsRUFKeUIsQ0FJekIsQ0FBQyxDQUNELENBQUMsRUFQYSxDQU9iLENBQ1QsQ0FDTyxDQUNSLENBQ1gsQ0FBQztRQUNOLENBQUM7UUFFRCxNQUFNLENBQUMsT0FBTyxDQUFDO0lBQ25CLENBQUM7SUFDTCxjQUFDO0FBQUQsQ0FBQyxDQXRFb0MsS0FBSyxDQUFDLFNBQVMsR0FzRW5EOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FDN0VELG1DQUErQjtBQUUvQixpREFBd0M7QUFDeEMsb0RBQW1EO0FBRW5ELHVDQUFvQztBQUVwQztJQUFxQywyQkFBeUI7SUFDMUQsaUJBQVksS0FBTSxFQUFFLE9BQVE7UUFBNUIsWUFDSSxrQkFBTSxLQUFLLEVBQUUsT0FBTyxDQUFDLFNBRXhCO1FBREcsS0FBSSxDQUFDLEtBQUssR0FBRyxFQUFFLE1BQU0sRUFBRSxTQUFTLEVBQUUsQ0FBQzs7SUFDdkMsQ0FBQztJQUVELDhCQUFZLEdBQVosVUFBYSxDQUFDO1FBQ1YsSUFBSSxDQUFDLFFBQVEsQ0FBQyxFQUFFLE1BQU0sRUFBRSxDQUFDLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxXQUFXLEVBQUUsRUFBRSxDQUFDLENBQUM7SUFDNUQsQ0FBQztJQUVELDRCQUFVLEdBQVYsVUFBVyxJQUFJO1FBQ1gsSUFBSSxPQUFPLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxVQUFVLENBQUMsSUFBSSxDQUFDLENBQUMsU0FBUyxDQUFDLENBQUM7UUFDckQsRUFBRSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztZQUNWLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxVQUFVLENBQUMsaUJBQWlCLENBQUMsQ0FBQztnQkFDdEMsTUFBTSxDQUFDLENBQUMsMkJBQUcsU0FBUyxFQUFDLGdCQUFnQixJQUFFLGtDQUFZLENBQUMsT0FBTyxFQUFFLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFLLENBQUMsQ0FBQztZQUMvRSxFQUFFLENBQUMsQ0FBQyxPQUFPLENBQUMsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDO2dCQUMvQixNQUFNLENBQUMsQ0FBQyw4QkFBTSxTQUFTLEVBQUUsdUJBQXVCLEdBQUcsa0NBQVksQ0FBQyxPQUFPLEVBQUUsR0FBRyxDQUFDLENBQUMsQ0FBQyxDQUFDLEdBQVMsQ0FBQyxDQUFDO1lBQy9GLE1BQU0sQ0FBQyxDQUFDLDZCQUFLLEdBQUcsRUFBRSxPQUFPLEdBQUksQ0FBQyxDQUFDO1FBQ25DLENBQUM7UUFDRCxNQUFNLENBQUMsQ0FBQywyQkFBRyxTQUFTLEVBQUMsZ0JBQWdCLGFBQVcsQ0FBQyxDQUFDO0lBQ3RELENBQUM7SUFFRCx3QkFBTSxHQUFOO1FBQUEsaUJBcUJDO1FBcEJHLE1BQU0sQ0FBQyxDQUNILDZCQUFLLEVBQUUsRUFBQyxTQUFTO1lBQ2IsNkJBQUssU0FBUyxFQUFDLE9BQU87Z0JBQ2xCLDZCQUFLLEVBQUUsRUFBQyxXQUFXO29CQUNmLCtCQUFPLElBQUksRUFBQyxNQUFNLEVBQUMsV0FBVyxFQUFDLFFBQVEsRUFBQyxLQUFLLEVBQUUsRUFBRSxNQUFNLEVBQUUsV0FBVyxFQUFFLEVBQ2xFLFFBQVEsRUFBRSxXQUFDLElBQUksWUFBSSxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUMsRUFBcEIsQ0FBb0IsRUFBRSxLQUFLLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxNQUFNLEdBQUksQ0FDbkU7Z0JBQ04sNkJBQUssRUFBRSxFQUFDLFNBQVMsSUFDWixNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsVUFBVSxDQUFDO3FCQUM5QixNQUFNLENBQUMsWUFBRSxJQUFJLFlBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxJQUFJLElBQUksSUFBSSxFQUFFLENBQUMsV0FBVyxFQUFFLENBQUMsT0FBTyxDQUFDLEtBQUksQ0FBQyxLQUFLLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxFQUE3RSxDQUE2RSxDQUFDO3FCQUMzRixHQUFHLENBQUMsVUFBQyxFQUFFLEVBQUMsQ0FBQyxJQUFLLFFBQ2YsNkJBQUssR0FBRyxFQUFFLENBQUMsRUFBRSxTQUFTLEVBQUUsU0FBUyxHQUFHLENBQUMsRUFBRSxLQUFLLEtBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLFNBQVMsR0FBRyxFQUFFLENBQUM7b0JBQ3hFLEtBQUksQ0FBQyxVQUFVLENBQUMsRUFBRSxDQUFDO29CQUNwQixvQkFBQyx1QkFBSSxJQUFDLEVBQUUsRUFBRSxpQkFBUSxHQUFHLHFCQUFxQixHQUFHLEVBQUUsSUFBRyxLQUFJLENBQUMsS0FBSyxDQUFDLFVBQVUsQ0FBQyxFQUFFLENBQUMsQ0FBQyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQVEsQ0FDL0YsQ0FDVCxFQUxrQixDQUtsQixDQUFDLENBQ0EsQ0FDSixDQUNKLENBQ1QsQ0FBQztJQUNOLENBQUM7SUFDTCxjQUFDO0FBQUQsQ0FBQyxDQTVDb0MsS0FBSyxDQUFDLFNBQVMsR0E0Q25EOzs7Ozs7Ozs7QUNuREQ7QUFDQTs7O0FBR0E7QUFDQSxvQ0FBcUMsa0JBQWtCLEtBQUssVUFBVSwwQ0FBMEMsa0JBQWtCLHlCQUF5QixLQUFLLHNDQUFzQyxrQkFBa0IsbUJBQW1CLEtBQUssK0JBQStCLHlCQUF5QiwwQkFBMEIsS0FBSyxPQUFPLHVCQUF1QixLQUFLLGVBQWUsa0JBQWtCLG1CQUFtQixrQ0FBa0MsS0FBSyxtQkFBbUIseURBQXlELHlEQUF5RCw0QkFBNEIsS0FBSyxzQkFBc0IseUJBQXlCLHVCQUF1Qix3QkFBd0IsMEJBQTBCLHlDQUF5QyxxQkFBcUIseUJBQXlCLDRCQUE0QixRQUFRLHNCQUFzQix1QkFBdUIsd0JBQXdCLHFCQUFxQix5QkFBeUIseUJBQXlCLDRCQUE0QixtQ0FBbUMsS0FBSyxjQUFjLHFCQUFxQixLQUFLLHVCQUF1Qix3QkFBd0IsS0FBSyxpQkFBaUIsbUJBQW1CLHlCQUF5Qix1QkFBdUIscURBQXFELHFEQUFxRCx3QkFBd0Isb0JBQW9CLHVCQUF1QixrQ0FBa0MsS0FBSywwQ0FBMEMseUJBQXlCLDRCQUE0QixTQUFTLHVCQUF1QixzQkFBc0Isc0NBQXNDLFNBQVMsb0JBQW9CLHlCQUF5QixnQ0FBZ0MsU0FBUyxnQ0FBZ0MsNEJBQTRCLDhCQUE4QixTQUFTLDBCQUEwQixzQkFBc0IsS0FBSyxvQkFBb0IsK0JBQStCLEtBQUssb0JBQW9CLHlCQUF5QixtQkFBbUIscUJBQXFCLEtBQUssZUFBZSxLQUFLLGtCQUFrQixLQUFLLGtCQUFrQixtQkFBbUIseUJBQXlCLHVCQUF1QixnQ0FBZ0Msd0JBQXdCLHFCQUFxQixxQkFBcUIsd0JBQXdCLHlCQUF5Qix5QkFBeUIsbUJBQW1CLEtBQUsseUJBQXlCLGdDQUFnQyxTQUFTLGdDQUFnQyxnQ0FBZ0Msb0NBQW9DLDRCQUE0Qix5REFBeUQseURBQXlELFNBQVMsa0JBQWtCLDRCQUE0QixLQUFLLDRCQUE0Qix3QkFBd0IsZ0NBQWdDLHdCQUF3QixxREFBcUQscURBQXFELEtBQUsscUJBQXFCLGtDQUFrQyxLQUFLLHNCQUFzQixtQkFBbUIsdUJBQXVCLHdCQUF3QixrQkFBa0Isb0JBQW9CLEtBQUssa0JBQWtCLDZCQUE2Qiw2QkFBNkIsc0JBQXNCLHdCQUF3Qix5QkFBeUIsZ0NBQWdDLDRCQUE0QixLQUFLLG9CQUFvQiw2Q0FBNkMseUJBQXlCLDRCQUE0QixTQUFTLGdDQUFnQyx3Q0FBd0MsMkJBQTJCLDhCQUE4QixtQ0FBbUMsU0FBUyxzQkFBc0Isd0JBQXdCLHlCQUF5Qiw4QkFBOEIsbUNBQW1DLFNBQVMsb0JBQW9CLDJCQUEyQixrQ0FBa0Msb0NBQW9DLDhCQUE4Qiw0QkFBNEIsZ0NBQWdDLDRCQUE0Qiw0QkFBNEIsU0FBUyx5Q0FBeUMsZ0NBQWdDLFNBQVMseUJBQXlCLDJCQUEyQixTQUFTLGtCQUFrQiw0QkFBNEIsS0FBSyxtQkFBbUIsdUJBQXVCLDJCQUEyQix3QkFBd0Isd0JBQXdCLEtBQUssMEJBQTBCLHVCQUF1QixLQUFLLGlCQUFpQix1QkFBdUIsd0JBQXdCLHNCQUFzQiwwQkFBMEIsOEJBQThCLEtBQUssMkRBQTJELHdCQUF3QixvQ0FBb0MsS0FBSyxjQUFjLDhCQUE4Qiw0QkFBNEIsc0JBQXNCLEtBQUssVUFBVSx1QkFBdUIsd0JBQXdCLHdCQUF3QixtQ0FBbUMsS0FBSyxtQkFBbUIsK0JBQStCLEtBQUsseUJBQXlCLDRCQUE0QixlQUFlLGdCQUFnQixvQkFBb0IscUJBQXFCLHlCQUF5QixtQkFBbUIsS0FBSyw2QkFBNkIsb0NBQW9DLGtFQUFrRSwwREFBMEQsS0FBSyxpQkFBaUIsMkJBQTJCLGtCQUFrQixrQkFBa0Isb0JBQW9CLDZCQUE2QixxQkFBcUIseUJBQXlCLHlEQUF5RCx5REFBeUQsMkJBQTJCLHVCQUF1Qiw2QkFBNkIsNkJBQTZCLHNCQUFzQixxQ0FBcUMsc0NBQXNDLHVDQUF1Qyx1Q0FBdUMsS0FBSyxxQkFBcUIsaUJBQWlCLGtFQUFrRSwwREFBMEQsS0FBSyxpQkFBaUIsc0JBQXNCLEtBQUssb0JBQW9CLHFCQUFxQixLQUFLLDJCQUEyQiwyQkFBMkIsU0FBUyxzQkFBc0IsNEJBQTRCLHdCQUF3Qix3QkFBd0IseUJBQXlCLEtBQUssb0JBQW9CLHFCQUFxQixLQUFLLGNBQWMsOEJBQThCLHVCQUF1QiwwQkFBMEIsd0JBQXdCLEtBQUssbUJBQW1CLHVCQUF1QiwwQkFBMEIsMkJBQTJCLEtBQUsseUJBQXlCLHVDQUF1QyxnQ0FBZ0Msd0JBQXdCLHFEQUFxRCxxREFBcUQsS0FBSyxlQUFlLGtDQUFrQywwQ0FBMEMsa0RBQWtELCtDQUErQyxpQ0FBaUMsT0FBTyxtQ0FBbUMsRUFBRSxFQUFFLHFCQUFxQixPQUFPLG1DQUFtQywwQkFBMEIsRUFBRSxFQUFFLDZCQUE2QixtQkFBbUIsb0JBQW9CLEtBQUssb0NBQW9DLDBEQUEwRCxLQUFLLG9DQUFvQyxpQ0FBaUMsbUNBQW1DLEtBQUssdUJBQXVCLGtDQUFrQyxpREFBaUQseURBQXlELCtDQUErQyw0Q0FBNEMsdUhBQXVILG9EQUFvRCw4QkFBOEIsMkJBQTJCLHlCQUF5QiwyS0FBb1AsdURBQXVELGdCQUFnQiw4QkFBOEIsb0lBQTZLLDBCQUEwQix5QkFBeUIsS0FBSywrSUFBK0ksaURBQWlELDRCQUE0Qiw0QkFBNEIsMkJBQTJCLDBDQUEwQyx5Q0FBeUMsZ0NBQWdDLDZCQUE2Qiw0QkFBNEIsd0JBQXdCLEtBQUssbUJBQW1CLGlCQUFpQixFQUFFLCtCQUErQixtQkFBbUIsd0NBQXdDLG1CQUFtQix3Q0FBd0MsbUJBQW1CLHlDQUF5QyxtQkFBbUIsOENBQThDLG1CQUFtQiw4Q0FBOEMsbUJBQW1CLCtDQUErQyxtQkFBbUIsNENBQTRDLG1CQUFtQixzQ0FBc0MsbUJBQW1CLGdFQUFnRSxtQkFBbUIsa0NBQWtDLG1CQUFtQixrQ0FBa0MsbUJBQW1CLGtDQUFrQyxtQkFBbUIsc0NBQXNDLG1CQUFtQix1Q0FBdUMsbUJBQW1CLHVDQUF1QyxtQkFBbUIscUNBQXFDLG1CQUFtQixpQ0FBaUMsbUJBQW1CLHNDQUFzQyxtQkFBbUIsbUNBQW1DLG1CQUFtQix1Q0FBdUMsbUJBQW1CLDBDQUEwQyxtQkFBbUIsMENBQTBDLG1CQUFtQiwyQ0FBMkMsbUJBQW1CLHdDQUF3QyxtQkFBbUIsMENBQTBDLG1CQUFtQiwyQ0FBMkMsbUJBQW1CLG9DQUFvQyxtQkFBbUIsbUNBQW1DLG1CQUFtQiw0Q0FBNEMsbUJBQW1CLDBDQUEwQyxtQkFBbUIsa0NBQWtDLG1CQUFtQixrRUFBa0UsbUJBQW1CLGdEQUFnRCxtQkFBbUIseUNBQXlDLG1CQUFtQixrQ0FBa0MsbUJBQW1CLHVDQUF1QyxtQkFBbUIsc0NBQXNDLG1CQUFtQixxRUFBcUUsbUJBQW1CLDJDQUEyQyxtQkFBbUIsaURBQWlELG1CQUFtQiw0Q0FBNEMsbUJBQW1CLDJDQUEyQyxtQkFBbUIsa0NBQWtDLG1CQUFtQix3Q0FBd0MsbUJBQW1CLDBDQUEwQyxtQkFBbUIsMkNBQTJDLG1CQUFtQiwwQ0FBMEMsbUJBQW1CLDBDQUEwQyxtQkFBbUIsc0NBQXNDLG1CQUFtQix5RkFBeUYsbUJBQW1CLHlDQUF5QyxtQkFBbUIsdUNBQXVDLG1CQUFtQiw0Q0FBNEMsbUJBQW1CLHdDQUF3QyxtQkFBbUIsc0NBQXNDLG1CQUFtQiw0Q0FBNEMsbUJBQW1CLG9EQUFvRCxtQkFBbUIsK0NBQStDLG1CQUFtQix1Q0FBdUMsbUJBQW1CLHNDQUFzQyxtQkFBbUIsbUNBQW1DLG1CQUFtQixrQ0FBa0MsbUJBQW1CLGtDQUFrQyxtQkFBbUIsa0NBQWtDLG1CQUFtQixrQ0FBa0MsbUJBQW1CLHlDQUF5QyxtQkFBbUIsOEdBQThHLG1CQUFtQix3Q0FBd0MsbUJBQW1CLHlDQUF5QyxtQkFBbUIsdUNBQXVDLG1CQUFtQiwwRkFBMEYsbUJBQW1CLG1DQUFtQyxtQkFBbUIsbUNBQW1DLG1CQUFtQixtQ0FBbUMsbUJBQW1CLHFDQUFxQyxtQkFBbUIsa0NBQWtDLG1CQUFtQiw2Q0FBNkMsbUJBQW1CLG1DQUFtQyxtQkFBbUIsbUNBQW1DLG1CQUFtQixrQ0FBa0MsbUJBQW1CLDBDQUEwQyxtQkFBbUIsMENBQTBDLG1CQUFtQiw0Q0FBNEMsbUJBQW1CLG9DQUFvQyxtQkFBbUIsb0NBQW9DLG1CQUFtQixpQ0FBaUMsbUJBQW1CLHNDQUFzQyxtQkFBbUIsaUNBQWlDLG1CQUFtQix3Q0FBd0MsbUJBQW1CLGtDQUFrQyxtQkFBbUIsMkNBQTJDLG1CQUFtQiwwQ0FBMEMsbUJBQW1CLDRDQUE0QyxtQkFBbUIsc0NBQXNDLG1CQUFtQixrSUFBa0ksbUJBQW1CLHVDQUF1QyxtQkFBbUIseUNBQXlDLG1CQUFtQixrQ0FBa0MsbUJBQW1CLHVDQUF1QyxtQkFBbUIsd0NBQXdDLG1CQUFtQix5Q0FBeUMsbUJBQW1CLHNDQUFzQyxtQkFBbUIsdUNBQXVDLG1CQUFtQixxQ0FBcUMsbUJBQW1CLHVDQUF1QyxtQkFBbUIsbUVBQW1FLG1CQUFtQiwwQ0FBMEMsbUJBQW1CLGtDQUFrQyxtQkFBbUIsd0NBQXdDLG1CQUFtQixzQ0FBc0MsbUJBQW1CLDBDQUEwQyxtQkFBbUIscUNBQXFDLG1CQUFtQixzQ0FBc0MsbUJBQW1CLG9DQUFvQyxtQkFBbUIsK0ZBQStGLG1CQUFtQixpQ0FBaUMsbUJBQW1CLGtDQUFrQyxtQkFBbUIsMEpBQTBKLG1CQUFtQiwyQ0FBMkMsbUJBQW1CLDhDQUE4QyxtQkFBbUIsbUNBQW1DLG1CQUFtQixzQ0FBc0MsbUJBQW1CLG1DQUFtQyxtQkFBbUIseUNBQXlDLG1CQUFtQiwrREFBK0QsbUJBQW1CLHdDQUF3QyxtQkFBbUIsNkNBQTZDLG1CQUFtQixvRUFBb0UsbUJBQW1CLHVDQUF1QyxtQkFBbUIsdUNBQXVDLG1CQUFtQixvQ0FBb0MsbUJBQW1CLGlDQUFpQyxtQkFBbUIsa0NBQWtDLG1CQUFtQixpRUFBaUUsbUJBQW1CLG9DQUFvQyxtQkFBbUIsc0NBQXNDLG1CQUFtQixvQ0FBb0MsbUJBQW1CLDZEQUE2RCxtQkFBbUIsK0RBQStELG1CQUFtQixvQ0FBb0MsbUJBQW1CLHNDQUFzQyxtQkFBbUIseUZBQXlGLG1CQUFtQixrQ0FBa0MsbUJBQW1CLDZEQUE2RCxtQkFBbUIsc0ZBQXNGLG1CQUFtQixzQ0FBc0MsbUJBQW1CLHVDQUF1QyxtQkFBbUIsc0NBQXNDLG1CQUFtQix1Q0FBdUMsbUJBQW1CLHdDQUF3QyxtQkFBbUIsd0NBQXdDLG1CQUFtQixzQ0FBc0MsbUJBQW1CLG1DQUFtQyxtQkFBbUIsc0NBQXNDLG1CQUFtQiwyQ0FBMkMsbUJBQW1CLDJDQUEyQyxtQkFBbUIsNENBQTRDLG1CQUFtQix5Q0FBeUMsbUJBQW1CLG9DQUFvQyxtQkFBbUIsb0NBQW9DLG1CQUFtQixzQ0FBc0MsbUJBQW1CLHNDQUFzQyxtQkFBbUIsbUNBQW1DLG1CQUFtQiw2REFBNkQsbUJBQW1CLGlDQUFpQyxtQkFBbUI7O0FBRTdrbUI7Ozs7Ozs7O0FDUEE7QUFDQTs7O0FBR0E7QUFDQSxxQ0FBc0Msa0NBQWtDLHVCQUF1QixxQkFBcUIsK0NBQTZELHdSQUFxVSxHQUFHLHFCQUFxQixrQ0FBa0Msd0JBQXdCLHVCQUF1QixvQkFBb0IscURBQXFELGVBQWUsZ0JBQWdCLG1CQUFtQix5QkFBeUIsMkJBQTJCLHNCQUFzQix3QkFBd0IsbUJBQW1CLG9GQUFvRiwrRUFBK0UsdUVBQXVFLHFFQUFxRSwwQ0FBMEMsR0FBRzs7QUFFM3FDOzs7Ozs7OztBQ1BBO0FBQ0E7OztBQUdBO0FBQ0EsZ0tBQWlLLGlEQUFpRCw0QkFBNEIsNEJBQTRCLDJCQUEyQiwwQ0FBMEMseUNBQXlDLGdDQUFnQyw2QkFBNkIsNEJBQTRCLHdCQUF3QixLQUFLLG1CQUFtQixpQkFBaUIsRUFBRSwrQkFBK0IsbUJBQW1CLHdDQUF3QyxtQkFBbUIsd0NBQXdDLG1CQUFtQix5Q0FBeUMsbUJBQW1CLDhDQUE4QyxtQkFBbUIsOENBQThDLG1CQUFtQiwrQ0FBK0MsbUJBQW1CLDRDQUE0QyxtQkFBbUIsc0NBQXNDLG1CQUFtQixnRUFBZ0UsbUJBQW1CLGtDQUFrQyxtQkFBbUIsa0NBQWtDLG1CQUFtQixrQ0FBa0MsbUJBQW1CLHNDQUFzQyxtQkFBbUIsdUNBQXVDLG1CQUFtQix1Q0FBdUMsbUJBQW1CLHFDQUFxQyxtQkFBbUIsaUNBQWlDLG1CQUFtQixzQ0FBc0MsbUJBQW1CLG1DQUFtQyxtQkFBbUIsdUNBQXVDLG1CQUFtQiwwQ0FBMEMsbUJBQW1CLDBDQUEwQyxtQkFBbUIsMkNBQTJDLG1CQUFtQix3Q0FBd0MsbUJBQW1CLDBDQUEwQyxtQkFBbUIsMkNBQTJDLG1CQUFtQixvQ0FBb0MsbUJBQW1CLG1DQUFtQyxtQkFBbUIsNENBQTRDLG1CQUFtQiwwQ0FBMEMsbUJBQW1CLGtDQUFrQyxtQkFBbUIsa0VBQWtFLG1CQUFtQixnREFBZ0QsbUJBQW1CLHlDQUF5QyxtQkFBbUIsa0NBQWtDLG1CQUFtQix1Q0FBdUMsbUJBQW1CLHNDQUFzQyxtQkFBbUIscUVBQXFFLG1CQUFtQiwyQ0FBMkMsbUJBQW1CLGlEQUFpRCxtQkFBbUIsNENBQTRDLG1CQUFtQiwyQ0FBMkMsbUJBQW1CLGtDQUFrQyxtQkFBbUIsd0NBQXdDLG1CQUFtQiwwQ0FBMEMsbUJBQW1CLDJDQUEyQyxtQkFBbUIsMENBQTBDLG1CQUFtQiwwQ0FBMEMsbUJBQW1CLHNDQUFzQyxtQkFBbUIseUZBQXlGLG1CQUFtQix5Q0FBeUMsbUJBQW1CLHVDQUF1QyxtQkFBbUIsNENBQTRDLG1CQUFtQix3Q0FBd0MsbUJBQW1CLHNDQUFzQyxtQkFBbUIsNENBQTRDLG1CQUFtQixvREFBb0QsbUJBQW1CLCtDQUErQyxtQkFBbUIsdUNBQXVDLG1CQUFtQixzQ0FBc0MsbUJBQW1CLG1DQUFtQyxtQkFBbUIsa0NBQWtDLG1CQUFtQixrQ0FBa0MsbUJBQW1CLGtDQUFrQyxtQkFBbUIsa0NBQWtDLG1CQUFtQix5Q0FBeUMsbUJBQW1CLDhHQUE4RyxtQkFBbUIsd0NBQXdDLG1CQUFtQix5Q0FBeUMsbUJBQW1CLHVDQUF1QyxtQkFBbUIsMEZBQTBGLG1CQUFtQixtQ0FBbUMsbUJBQW1CLG1DQUFtQyxtQkFBbUIsbUNBQW1DLG1CQUFtQixxQ0FBcUMsbUJBQW1CLGtDQUFrQyxtQkFBbUIsNkNBQTZDLG1CQUFtQixtQ0FBbUMsbUJBQW1CLG1DQUFtQyxtQkFBbUIsa0NBQWtDLG1CQUFtQiwwQ0FBMEMsbUJBQW1CLDBDQUEwQyxtQkFBbUIsNENBQTRDLG1CQUFtQixvQ0FBb0MsbUJBQW1CLG9DQUFvQyxtQkFBbUIsaUNBQWlDLG1CQUFtQixzQ0FBc0MsbUJBQW1CLGlDQUFpQyxtQkFBbUIsd0NBQXdDLG1CQUFtQixrQ0FBa0MsbUJBQW1CLDJDQUEyQyxtQkFBbUIsMENBQTBDLG1CQUFtQiw0Q0FBNEMsbUJBQW1CLHNDQUFzQyxtQkFBbUIsa0lBQWtJLG1CQUFtQix1Q0FBdUMsbUJBQW1CLHlDQUF5QyxtQkFBbUIsa0NBQWtDLG1CQUFtQix1Q0FBdUMsbUJBQW1CLHdDQUF3QyxtQkFBbUIseUNBQXlDLG1CQUFtQixzQ0FBc0MsbUJBQW1CLHVDQUF1QyxtQkFBbUIscUNBQXFDLG1CQUFtQix1Q0FBdUMsbUJBQW1CLG1FQUFtRSxtQkFBbUIsMENBQTBDLG1CQUFtQixrQ0FBa0MsbUJBQW1CLHdDQUF3QyxtQkFBbUIsc0NBQXNDLG1CQUFtQiwwQ0FBMEMsbUJBQW1CLHFDQUFxQyxtQkFBbUIsc0NBQXNDLG1CQUFtQixvQ0FBb0MsbUJBQW1CLCtGQUErRixtQkFBbUIsaUNBQWlDLG1CQUFtQixrQ0FBa0MsbUJBQW1CLDBKQUEwSixtQkFBbUIsMkNBQTJDLG1CQUFtQiw4Q0FBOEMsbUJBQW1CLG1DQUFtQyxtQkFBbUIsc0NBQXNDLG1CQUFtQixtQ0FBbUMsbUJBQW1CLHlDQUF5QyxtQkFBbUIsK0RBQStELG1CQUFtQix3Q0FBd0MsbUJBQW1CLDZDQUE2QyxtQkFBbUIsb0VBQW9FLG1CQUFtQix1Q0FBdUMsbUJBQW1CLHVDQUF1QyxtQkFBbUIsb0NBQW9DLG1CQUFtQixpQ0FBaUMsbUJBQW1CLGtDQUFrQyxtQkFBbUIsaUVBQWlFLG1CQUFtQixvQ0FBb0MsbUJBQW1CLHNDQUFzQyxtQkFBbUIsb0NBQW9DLG1CQUFtQiw2REFBNkQsbUJBQW1CLCtEQUErRCxtQkFBbUIsb0NBQW9DLG1CQUFtQixzQ0FBc0MsbUJBQW1CLHlGQUF5RixtQkFBbUIsa0NBQWtDLG1CQUFtQiw2REFBNkQsbUJBQW1CLHNGQUFzRixtQkFBbUIsc0NBQXNDLG1CQUFtQix1Q0FBdUMsbUJBQW1CLHNDQUFzQyxtQkFBbUIsdUNBQXVDLG1CQUFtQix3Q0FBd0MsbUJBQW1CLHdDQUF3QyxtQkFBbUIsc0NBQXNDLG1CQUFtQixtQ0FBbUMsbUJBQW1CLHNDQUFzQyxtQkFBbUIsMkNBQTJDLG1CQUFtQiwyQ0FBMkMsbUJBQW1CLDRDQUE0QyxtQkFBbUIseUNBQXlDLG1CQUFtQixvQ0FBb0MsbUJBQW1CLG9DQUFvQyxtQkFBbUIsc0NBQXNDLG1CQUFtQixzQ0FBc0MsbUJBQW1CLG1DQUFtQyxtQkFBbUIsNkRBQTZELG1CQUFtQixpQ0FBaUMsbUJBQW1COztBQUV4c1Y7Ozs7Ozs7O0FDUEEseUU7Ozs7Ozs7QUNBQSx5RTs7Ozs7OztBQ0FBLDBFOzs7Ozs7O0FDQUEsMkU7Ozs7Ozs7QUNBQSw0RDs7Ozs7OztBQ0FBLDZEOzs7Ozs7O0FDQUEsNkU7Ozs7Ozs7QUNBQSw4RTs7Ozs7Ozs7OztBQ0FBLG9EQUFrRTtBQUl2RCxnQkFBUSxHQUFHLFFBQVEsQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLENBQUMsRUFBRSxRQUFRLENBQUMsUUFBUSxDQUFDLE9BQU8sQ0FBQyxXQUFXLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQztBQUV0RixjQUFNLEdBQUcsSUFBSSx1Q0FBaUIsQ0FBQyxNQUFNLENBQUMsT0FBTyxJQUFJLGdCQUFRLENBQUMsQ0FBQztBQUV6RCxvQkFBWSxHQUFHLFVBQUMsR0FBVyxJQUFLLFVBQUcsQ0FBQyxXQUFXLEVBQUUsQ0FBQyxPQUFPLENBQUMsSUFBSSxFQUFFLEVBQUUsQ0FBQyxFQUFuQyxDQUFtQyxDQUFDO0FBRWpGLElBQU0sT0FBTyxHQUFHLFVBQUMsQ0FBTSxJQUFLLGFBQU0sQ0FBQyxTQUFTLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsS0FBSyxnQkFBZ0IsRUFBdEQsQ0FBc0QsQ0FBQztBQUVuRixJQUFNLEdBQUcsR0FBRyxVQUFDLENBQU0sSUFBTyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsRUFBRSxPQUFNLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLE1BQU0sQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0FBRW5ELGlCQUFTLEdBQUcsVUFBQyxHQUFRLEVBQUUsSUFBYztJQUM5QyxFQUFFLENBQUMsQ0FBQyxHQUFHLElBQUksSUFBSSxDQUFDO1FBQ1osTUFBTSxDQUFDLEdBQUcsQ0FBQztJQUNmLEVBQUUsQ0FBQyxDQUFDLE9BQU8sQ0FBQyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDZixFQUFFLENBQUMsQ0FBQyxDQUFDLElBQUksQ0FBQztZQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7UUFDdEIsSUFBTSxFQUFFLEdBQUcsRUFBRSxDQUFDO1FBQ2QsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxFQUFFLENBQUMsR0FBRyxHQUFHLENBQUMsTUFBTSxFQUFFLENBQUMsRUFBRSxFQUFFLENBQUM7WUFDbEMsRUFBRSxDQUFDLENBQUMsQ0FBQyxHQUFHLGlCQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxFQUFFLElBQUksQ0FBQyxDQUFDO1FBQ3BDLENBQUM7UUFDRCxNQUFNLENBQUMsRUFBRSxDQUFDO0lBQ2QsQ0FBQztJQUNELEVBQUUsQ0FBQyxDQUFDLE9BQU8sR0FBRyxJQUFJLFFBQVEsQ0FBQztRQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUM7SUFDdkMsSUFBTSxDQUFDLEdBQUcsRUFBRSxDQUFDO0lBQ2IsR0FBRyxDQUFDLENBQUMsSUFBSSxDQUFDLElBQUksR0FBRyxDQUFDLENBQUMsQ0FBQztRQUNoQixDQUFDLENBQUMsb0JBQVksQ0FBQyxDQUFDLENBQUMsQ0FBQyxHQUFHLElBQUksR0FBRyxpQkFBUyxDQUFDLEdBQUcsQ0FBQyxDQUFDLENBQUMsRUFBRSxJQUFJLENBQUMsR0FBRyxHQUFHLENBQUMsQ0FBQyxDQUFDLENBQUM7SUFDakUsQ0FBQztJQUNELE1BQU0sQ0FBQyxDQUFDLENBQUM7QUFDYixDQUFDO0FBRVksZ0JBQVEsR0FBRyxVQUFDLENBQU0sRUFBRSxJQUFZO0lBQ3pDLFFBQUMsSUFBSSxJQUFJLElBQUksSUFBSSxJQUFJLElBQUksR0FBRyxJQUFJO1FBQzVCLENBQUMsQ0FBQyxJQUFJLENBQUM7WUFDUCxDQUFDLENBQUMsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsV0FBQyxJQUFJLDJCQUFZLENBQUMsQ0FBQyxDQUFDLEtBQUssb0JBQVksQ0FBQyxJQUFJLENBQUMsRUFBdEMsQ0FBc0MsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLEVBQUUsQ0FBQztBQUZsRixDQUVrRixDQUFDO0FBRTFFLDJCQUFtQixHQUFHLFVBQUMsSUFBSSxFQUFFLFVBQWU7SUFBZiw4Q0FBZTtJQUNyRCxJQUFJLENBQUM7UUFDRCxJQUFNLEdBQUcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDO1FBQzdCLE1BQU0sQ0FBQyw4QkFBUSxDQUFDLEdBQUcsQ0FBQyxjQUFjLElBQUksR0FBRyxDQUFDLGNBQWMsQ0FBQyxDQUFDO0lBQzlELENBQUM7SUFBQyxLQUFLLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1FBQ1QsTUFBTSxDQUFDO1lBQ0gsT0FBTyxFQUFFLFVBQVU7WUFDbkIsT0FBTyxFQUFFLEVBQUUsS0FBSyxFQUFFLENBQUMsRUFBRSxJQUFJLEVBQUUsSUFBSSxFQUFFO1NBQ3BDLENBQUM7SUFDTixDQUFDO0FBQ0wsQ0FBQyxDQUFDOzs7Ozs7Ozs7O0FDL0NGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLHdDQUF3QyxXQUFXLEVBQUU7QUFDckQsd0NBQXdDLFdBQVcsRUFBRTs7QUFFckQ7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSxzQ0FBc0M7QUFDdEMsR0FBRztBQUNIO0FBQ0EsOERBQThEO0FBQzlEOztBQUVBO0FBQ0E7QUFDQSxFQUFFOztBQUVGO0FBQ0E7QUFDQTs7Ozs7Ozs7QUN4RkE7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0EsZ0NBQWdDLFVBQVUsRUFBRTtBQUM1QyxDOzs7Ozs7O0FDekJBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBLGdDQUFnQyxVQUFVLEVBQUU7QUFDNUMsQzs7Ozs7OztBQ3pCQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQSxnQ0FBZ0MsVUFBVSxFQUFFO0FBQzVDLEM7Ozs7Ozs7Ozs7Ozs7OztBQ3pCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsbUNBQW1DLGdCQUFnQjtBQUNuRCxJQUFJO0FBQ0o7QUFDQTtBQUNBLEdBQUc7QUFDSDs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsZ0JBQWdCLGlCQUFpQjtBQUNqQztBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQVksb0JBQW9CO0FBQ2hDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxLQUFLO0FBQ0w7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHOztBQUVIO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9EQUFvRCxjQUFjOztBQUVsRTtBQUNBOzs7Ozs7OztBQzNFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLG9CQUFvQjtBQUNwQjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsZ0JBQWdCLG1CQUFtQjtBQUNuQztBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxnQkFBZ0Isc0JBQXNCO0FBQ3RDO0FBQ0E7QUFDQSxrQkFBa0IsMkJBQTJCO0FBQzdDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBLGVBQWUsbUJBQW1CO0FBQ2xDO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsaUJBQWlCLDJCQUEyQjtBQUM1QztBQUNBO0FBQ0EsUUFBUSx1QkFBdUI7QUFDL0I7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBLGlCQUFpQix1QkFBdUI7QUFDeEM7QUFDQTtBQUNBLDJCQUEyQjtBQUMzQjtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsZUFBZSxpQkFBaUI7QUFDaEM7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLGNBQWM7QUFDZDtBQUNBLGdDQUFnQyxzQkFBc0I7QUFDdEQ7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsTUFBTTtBQUNOO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxDQUFDOztBQUVEO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsR0FBRztBQUNIO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLHVEQUF1RDtBQUN2RDs7QUFFQSw2QkFBNkIsbUJBQW1COztBQUVoRDs7QUFFQTs7QUFFQTtBQUNBO0FBQ0EiLCJmaWxlIjoiYXBwLmJ1bmRsZS5qcyIsInNvdXJjZXNDb250ZW50IjpbImltcG9ydCAnLi9hc3NldHMvaW1nL2ljb25mb250L21hdGVyaWFsLWljb25zLmNzcyc7XHJcbmltcG9ydCAnLi9hc3NldHMvaW1nL29jdGljb24vb2N0aWNvbi5jc3MnO1xyXG5pbXBvcnQgJy4vYXBwLmNzcyc7XHJcblxyXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7IHJlbmRlciB9IGZyb20gJ3JlYWN0LWRvbSc7XHJcbmltcG9ydCB7IFJlZGlyZWN0IH0gZnJvbSAncmVhY3Qtcm91dGVyJztcclxuaW1wb3J0IHsgQnJvd3NlclJvdXRlciBhcyBSb3V0ZXIsIFJvdXRlLCBMaW5rIH0gZnJvbSAncmVhY3Qtcm91dGVyLWRvbSc7XHJcblxyXG5pbXBvcnQgeyBCYXNlUGF0aCB9IGZyb20gJy4vc2hhcmVkJztcclxuaW1wb3J0IEF1dG9RdWVyeSBmcm9tICcuL0F1dG9RdWVyeSc7XHJcblxyXG5jbGFzcyBBZG1pbkFwcCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudDxhbnksIGFueT4ge1xyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHJldHVybiA8QXV0b1F1ZXJ5IG1hdGNoPXsgeyBwYXJhbXM6IHsgbmFtZTpcIlwifSB9IH0gLz47XHJcbiAgICB9XHJcbn1cclxuIFxyXG52YXIgQXBwUGF0aCA9IEJhc2VQYXRoICsgXCJzc19hZG1pblwiO1xyXG5jb25zdCBBdXRvUXVlcnlQYXRoID0gQXBwUGF0aCArIFwiL2F1dG9xdWVyeVwiO1xyXG5cclxucmVuZGVyKFxyXG4gICAgKDxSb3V0ZXI+XHJcbiAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgPFJvdXRlIGV4YWN0IHBhdGg9e0FwcFBhdGh9IHJlbmRlcj17KCkgPT4gXHJcbiAgICAgICAgICAgICAgICA8UmVkaXJlY3QgZnJvbT17QXBwUGF0aH0gdG89e0F1dG9RdWVyeVBhdGh9Lz5cclxuICAgICAgICAgICAgICAgIH0gLz5cclxuICAgICAgICAgICAgPFJvdXRlIGV4YWN0IHBhdGg9e0F1dG9RdWVyeVBhdGh9IGNvbXBvbmVudD17QXV0b1F1ZXJ5fSAvPlxyXG4gICAgICAgICAgICA8Um91dGUgcGF0aD17QXV0b1F1ZXJ5UGF0aCArIFwiLzpuYW1lXCJ9IGNvbXBvbmVudD17QXV0b1F1ZXJ5fSAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgPC9Sb3V0ZXI+KSwgXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBwJykpO1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvYXBwLnRzeCIsImltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHsgcmVuZGVyIH0gZnJvbSAncmVhY3QtZG9tJztcclxuaW1wb3J0IEhlYWRlciBmcm9tICcuL0hlYWRlcic7XHJcbmltcG9ydCBTaWRlYmFyIGZyb20gJy4vU2lkZWJhcic7XHJcbmltcG9ydCBDb250ZW50IGZyb20gJy4vQ29udGVudCc7XHJcbmltcG9ydCBDb2x1bW5QcmVmc0RpYWxvZyBmcm9tICcuL0NvbHVtblByZWZzRGlhbG9nJztcclxuXHJcbmltcG9ydCB7IGNsaWVudCwgbm9ybWFsaXplIH0gZnJvbSAnLi9zaGFyZWQnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXV0b1F1ZXJ5IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PGFueSwgYW55PiB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcz8sIGNvbnRleHQ/KSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMsIGNvbnRleHQpO1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7IG1ldGFkYXRhOiBudWxsIH07XHJcblxyXG4gICAgICAgIGNsaWVudC5nZXQoXCIvYXV0b3F1ZXJ5L21ldGFkYXRhXCIpLnRoZW4ociA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IG1ldGFkYXRhID0gbm9ybWFsaXplKHIsIHRydWUpO1xyXG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgbWV0YWRhdGEsIG5hbWU6IHRoaXMuZ2V0TmFtZSgpIH0pXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnN0YXRlLm1ldGFkYXRhXHJcbiAgICAgICAgICAgID8gPEFwcCBtZXRhZGF0YT17dGhpcy5zdGF0ZS5tZXRhZGF0YX0gbmFtZT17dGhpcy5nZXROYW1lKCl9IC8+XHJcbiAgICAgICAgICAgIDogbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBnZXROYW1lKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnByb3BzLm1hdGNoLnBhcmFtcy5uYW1lIHx8IFwiXCI7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIEFwcCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudDxhbnksIGFueT4ge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHM/LCBjb250ZXh0Pykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzLCBjb250ZXh0KTtcclxuXHJcbiAgICAgICAgY29uc3Qgb3BlcmF0aW9uTmFtZXMgPSB0aGlzLnByb3BzLm1ldGFkYXRhLm9wZXJhdGlvbnMubWFwKG9wID0+IG9wLnJlcXVlc3QpO1xyXG5cclxuICAgICAgICBjb25zdCB2aWV3ZXJBcmdzID0ge30sIG9wZXJhdGlvbnMgPSB7fSwgdHlwZXMgPSB7fTtcclxuICAgICAgICBvcGVyYXRpb25OYW1lcy5mb3JFYWNoKG5hbWUgPT4ge1xyXG4gICAgICAgICAgICB2aWV3ZXJBcmdzW25hbWVdID0ge307XHJcbiAgICAgICAgICAgIGNvbnN0IGFxVmlld2VyID0gdGhpcy5nZXRBdXRvUXVlcnlWaWV3ZXIobmFtZSk7XHJcbiAgICAgICAgICAgIGlmIChhcVZpZXdlciAmJiBhcVZpZXdlci5hcmdzKSB7XHJcbiAgICAgICAgICAgICAgICBhcVZpZXdlci5hcmdzLmZvckVhY2goYXJnID0+IHZpZXdlckFyZ3NbbmFtZV1bYXJnLm5hbWVdID0gYXJnLnZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgb3BlcmF0aW9uc1tuYW1lXSA9IHRoaXMucHJvcHMubWV0YWRhdGEub3BlcmF0aW9ucy5maWx0ZXIob3AgPT4gb3AucmVxdWVzdCA9PT0gbmFtZSlbMF07XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIGNvbnNvbGUubG9nKHRoaXMucHJvcHMubWV0YWRhdGEpO1xyXG4gICAgICAgIHRoaXMucHJvcHMubWV0YWRhdGEudHlwZXMuZm9yRWFjaCh0ID0+IHR5cGVzW3QubmFtZV0gPSB0KTtcclxuXHJcbiAgICAgICAgbGV0IG9wZXJhdGlvblN0YXRlID0ge307XHJcbiAgICAgICAgbGV0IGpzb24gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInYxL29wZXJhdGlvblN0YXRlXCIpO1xyXG4gICAgICAgIGlmIChqc29uKVxyXG4gICAgICAgICAgICBvcGVyYXRpb25TdGF0ZSA9IEpTT04ucGFyc2UoanNvbik7XHJcblxyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgICAgICAgIHNpZGViYXJIaWRkZW46IGZhbHNlLCBzZWxlY3RlZDogbnVsbCwgXHJcbiAgICAgICAgICAgIG9wZXJhdGlvblN0YXRlLCBvcGVyYXRpb25OYW1lcywgdmlld2VyQXJncywgb3BlcmF0aW9ucywgdHlwZXNcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHJlc29sdmVQcm9wZXJ0aWVzKHR5cGUpIHtcclxuICAgICAgICB2YXIgcHJvcHMgPSAodHlwZS5wcm9wZXJ0aWVzIHx8IFtdKS5zbGljZSgwKTtcclxuXHJcbiAgICAgICAgbGV0IGluaGVyaXRzID0gdHlwZS5pbmhlcml0cztcclxuICAgICAgICB3aGlsZSAoaW5oZXJpdHMpIHtcclxuICAgICAgICAgICAgY29uc3QgdCA9IHRoaXMuc3RhdGUudHlwZXNbaW5oZXJpdHMubmFtZV07XHJcbiAgICAgICAgICAgIGlmICghdCB8fCAhdC5wcm9wZXJ0aWVzKSBjb250aW51ZTtcclxuICAgICAgICAgICAgdC5wcm9wZXJ0aWVzLmZvckVhY2gocCA9PiBwcm9wcy5wdXNoKHApKTtcclxuICAgICAgICAgICAgaW5oZXJpdHMgPSB0LmluaGVyaXRzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHByb3BzO1xyXG4gICAgfVxyXG5cclxuICAgIHRvZ2dsZVNpZGViYXIoKSB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHNpZGViYXJIaWRkZW46ICF0aGlzLnN0YXRlLnNpZGViYXJIaWRkZW4gfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0VHlwZShuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wcm9wcy5tZXRhZGF0YS50eXBlcy5maWx0ZXIob3AgPT4gb3AubmFtZSA9PT0gbmFtZSlbMF07XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0QXV0b1F1ZXJ5Vmlld2VyKG5hbWU6c3RyaW5nKSB7XHJcbiAgICAgICAgY29uc3QgdHlwZSA9IHRoaXMuZ2V0VHlwZShuYW1lKTtcclxuICAgICAgICByZXR1cm4gdHlwZSAhPSBudWxsICYmIHR5cGUuYXR0cmlidXRlcyAhPSBudWxsXHJcbiAgICAgICAgICAgID8gdHlwZS5hdHRyaWJ1dGVzLmZpbHRlcihhdHRyID0+IGF0dHIubmFtZSA9PT0gXCJBdXRvUXVlcnlWaWV3ZXJcIilbMF1cclxuICAgICAgICAgICAgOiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEF1dG9RdWVyeVZpZXdlckFyZ1ZhbHVlKG5hbWU6c3RyaW5nLCBhcmdOYW1lOnN0cmluZykge1xyXG4gICAgICAgIGNvbnN0IGFxVmlld2VyID0gdGhpcy5nZXRBdXRvUXVlcnlWaWV3ZXIobmFtZSk7XHJcbiAgICAgICAgY29uc3QgYXJnID0gYXFWaWV3ZXJcclxuICAgICAgICAgICAgPyBhcVZpZXdlci5hcmdzLmZpbHRlcih4ID0+IHgubmFtZSA9PT0gYXJnTmFtZSlbMF1cclxuICAgICAgICAgICAgOiBudWxsO1xyXG4gICAgICAgIHJldHVybiBhcmcgIT0gbnVsbFxyXG4gICAgICAgICAgICA/IGFyZy52YWx1ZVxyXG4gICAgICAgICAgICA6IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0VGl0bGUoc2VsZWN0ZWQpIHtcclxuICAgICAgICByZXR1cm4gc2VsZWN0ZWRcclxuICAgICAgICAgICAgPyB0aGlzLmdldEF1dG9RdWVyeVZpZXdlckFyZ1ZhbHVlKHNlbGVjdGVkLm5hbWUsICdUaXRsZScpIHx8IHNlbGVjdGVkLm5hbWVcclxuICAgICAgICAgICAgOiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGdldE9wZXJhdGlvblZhbHVlcyhuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICBjb25zdCB2aWV3ZXJBcmdzID0gdGhpcy5zdGF0ZS52aWV3ZXJBcmdzW25hbWVdIHx8IHt9O1xyXG4gICAgICAgIHJldHVybiBPYmplY3QuYXNzaWduKHtcclxuICAgICAgICAgICAgc2VhcmNoRmllbGQ6IHZpZXdlckFyZ3NbXCJEZWZhdWx0U2VhcmNoRmllbGRcIl0gfHwgXCJcIixcclxuICAgICAgICAgICAgc2VhcmNoVHlwZTogdmlld2VyQXJnc1tcIkRlZmF1bHRTZWFyY2hUeXBlXCJdIHx8IFwiXCIsXHJcbiAgICAgICAgICAgIHNlYXJjaFRleHQ6IHZpZXdlckFyZ3NbXCJEZWZhdWx0U2VhcmNoVGV4dFwiXSxcclxuICAgICAgICAgICAgY29uZGl0aW9uczogW10sXHJcbiAgICAgICAgICAgIHF1ZXJpZXM6IFtdXHJcbiAgICAgICAgfSwgdGhpcy5zdGF0ZS5vcGVyYXRpb25TdGF0ZVtuYW1lXSB8fCB7fSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0U2VsZWN0ZWQobmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgY29uc3Qgb3BlcmF0aW9uID0gdGhpcy5zdGF0ZS5vcGVyYXRpb25zW25hbWVdO1xyXG4gICAgICAgIGlmIChvcGVyYXRpb24gPT0gbnVsbClcclxuICAgICAgICAgICAgcmV0dXJuIG51bGw7XHJcbiAgICAgICAgY29uc3QgcmVxdWVzdFR5cGUgPSB0aGlzLnN0YXRlLnR5cGVzW25hbWVdO1xyXG4gICAgICAgIGNvbnN0IGZyb21UeXBlID0gdGhpcy5zdGF0ZS50eXBlc1tvcGVyYXRpb24uZnJvbV07XHJcbiAgICAgICAgY29uc3QgdG9UeXBlID0gdGhpcy5zdGF0ZS50eXBlc1tvcGVyYXRpb24udG9dO1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIG5hbWUsIG9wZXJhdGlvbiwgcmVxdWVzdFR5cGUsXHJcbiAgICAgICAgICAgIGZyb21UeXBlLCBmcm9tVHlwZUZpZWxkczogdGhpcy5yZXNvbHZlUHJvcGVydGllcyh0b1R5cGUpLFxyXG4gICAgICAgICAgICB0b1R5cGUsIHRvVHlwZUZpZWxkczogdGhpcy5yZXNvbHZlUHJvcGVydGllcyh0b1R5cGUpXHJcbiAgICAgICAgfTtcclxuICAgIH1cclxuXHJcbiAgICBvbk9wZXJhdGlvbkNoYW5nZShvcE5hbWU6IHN0cmluZywgbmV3VmFsdWVzOiBhbnkpIHtcclxuICAgICAgICBjb25zdCBvcCA9IHRoaXMuZ2V0T3BlcmF0aW9uVmFsdWVzKG9wTmFtZSk7XHJcblxyXG4gICAgICAgIE9iamVjdC5rZXlzKG5ld1ZhbHVlcykuZm9yRWFjaChrID0+IHtcclxuICAgICAgICAgICAgaWYgKG5ld1ZhbHVlc1trXSAhPSBudWxsKVxyXG4gICAgICAgICAgICAgICAgb3Bba10gPSBuZXdWYWx1ZXNba107XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0T3BlcmF0aW9uVmFsdWVzKG9wTmFtZSwgb3ApO1xyXG4gICAgfVxyXG5cclxuICAgIGFkZENvbmRpdGlvbihvcE5hbWU6c3RyaW5nKSB7XHJcbiAgICAgICAgY29uc3Qgb3AgPSB0aGlzLmdldE9wZXJhdGlvblZhbHVlcyhvcE5hbWUpO1xyXG4gICAgICAgIGNvbnN0IGNvbmRpdGlvbiA9IHtcclxuICAgICAgICAgICAgaWQ6IGAke29wLnNlYXJjaEZpZWxkfXwke29wLnNlYXJjaFR5cGV9fCR7b3Auc2VhcmNoVGV4dH1gLFxyXG4gICAgICAgICAgICBzZWFyY2hGaWVsZDogb3Auc2VhcmNoRmllbGQsXHJcbiAgICAgICAgICAgIHNlYXJjaFR5cGU6IG9wLnNlYXJjaFR5cGUsXHJcbiAgICAgICAgICAgIHNlYXJjaFRleHQ6IG9wLnNlYXJjaFRleHRcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICBpZiAob3AuY29uZGl0aW9ucy5zb21lKHggPT4geC5pZCA9PT0gY29uZGl0aW9uLmlkKSlcclxuICAgICAgICAgICAgcmV0dXJuO1xyXG5cclxuICAgICAgICBvcC5zZWFyY2hUZXh0ID0gXCJcIjtcclxuICAgICAgICBvcC5jb25kaXRpb25zLnB1c2goY29uZGl0aW9uKTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRPcGVyYXRpb25WYWx1ZXMob3BOYW1lLCBvcCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlQ29uZGl0aW9uKG9wTmFtZTogc3RyaW5nLCBjb25kaXRpb246YW55KSB7XHJcbiAgICAgICAgY29uc3Qgb3AgPSB0aGlzLmdldE9wZXJhdGlvblZhbHVlcyhvcE5hbWUpO1xyXG4gICAgICAgIG9wLmNvbmRpdGlvbnMgPSBvcC5jb25kaXRpb25zLmZpbHRlcih4ID0+IHguaWQgIT09IGNvbmRpdGlvbi5pZCk7XHJcbiAgICAgICAgdGhpcy5zZXRPcGVyYXRpb25WYWx1ZXMob3BOYW1lLCBvcCk7XHJcbiAgICB9XHJcblxyXG4gICAgc2V0T3BlcmF0aW9uVmFsdWVzKG9wTmFtZSwgb3ApIHtcclxuICAgICAgICBjb25zdCBvcGVyYXRpb25TdGF0ZSA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3RhdGUub3BlcmF0aW9uU3RhdGUpO1xyXG4gICAgICAgIG9wZXJhdGlvblN0YXRlW29wTmFtZV0gPSBvcDtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgb3BlcmF0aW9uU3RhdGUgfSk7XHJcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJ2MS9vcGVyYXRpb25TdGF0ZVwiLCBKU09OLnN0cmluZ2lmeShvcGVyYXRpb25TdGF0ZSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHNob3dEaWFsb2coZGlhbG9nKSB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGRpYWxvZyB9KTtcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGRpYWxvZykuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJyksIDApO1xyXG4gICAgfVxyXG5cclxuICAgIGhpZGVEaWFsb2coKSB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGRpYWxvZzogbnVsbCB9KTtcclxuICAgIH1cclxuXHJcbiAgICBzYXZlUXVlcnkob3BOYW1lOnN0cmluZykge1xyXG4gICAgICAgIGNvbnN0IG5hbWUgPSBwcm9tcHQoXCJTYXZlIFF1ZXJ5IGFzOlwiLCBcIk15IFF1ZXJ5XCIpO1xyXG4gICAgICAgIGlmICghbmFtZSkgcmV0dXJuO1xyXG5cclxuICAgICAgICBjb25zdCBvcCA9IHRoaXMuZ2V0T3BlcmF0aW9uVmFsdWVzKG9wTmFtZSk7XHJcbiAgICAgICAgaWYgKCFvcC5xdWVyaWVzKSB7XHJcbiAgICAgICAgICAgIG9wLnF1ZXJpZXMgPSBbXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG9wLnF1ZXJpZXMucHVzaCh7XHJcbiAgICAgICAgICAgIG5hbWUsXHJcbiAgICAgICAgICAgIHNlYXJjaEZpZWxkOiBvcC5zZWFyY2hGaWVsZCxcclxuICAgICAgICAgICAgc2VhcmNoVHlwZTogb3Auc2VhcmNoVHlwZSxcclxuICAgICAgICAgICAgc2VhcmNoVGV4dDogb3Auc2VhcmNoVGV4dCxcclxuICAgICAgICAgICAgY29uZGl0aW9uczogb3AuY29uZGl0aW9ucy5tYXAoeCA9PiBPYmplY3QuYXNzaWduKHt9LCB4KSlcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRPcGVyYXRpb25WYWx1ZXMob3BOYW1lLCBvcCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlUXVlcnkob3BOYW1lOiBzdHJpbmcsIHF1ZXJ5OiBhbnkpIHtcclxuICAgICAgICBjb25zdCBvcCA9IHRoaXMuZ2V0T3BlcmF0aW9uVmFsdWVzKG9wTmFtZSk7XHJcbiAgICAgICAgaWYgKCFvcC5xdWVyaWVzKSByZXR1cm47XHJcbiAgICAgICAgb3AucXVlcmllcyA9IG9wLnF1ZXJpZXMuZmlsdGVyKHggPT4geC5uYW1lICE9IHF1ZXJ5Lm5hbWUpO1xyXG4gICAgICAgIHRoaXMuc2V0T3BlcmF0aW9uVmFsdWVzKG9wTmFtZSwgb3ApO1xyXG4gICAgfVxyXG5cclxuICAgIGxvYWRRdWVyeShvcE5hbWU6IHN0cmluZywgcXVlcnk6IGFueSkge1xyXG4gICAgICAgIGNvbnN0IG9wID0gdGhpcy5nZXRPcGVyYXRpb25WYWx1ZXMob3BOYW1lKTtcclxuICAgICAgICBvcC5zZWFyY2hGaWVsZCA9IHF1ZXJ5LnNlYXJjaEZpZWxkO1xyXG4gICAgICAgIG9wLnNlYXJjaFR5cGUgPSBxdWVyeS5zZWFyY2hUeXBlO1xyXG4gICAgICAgIG9wLnNlYXJjaFRleHQgPSBxdWVyeS5zZWFyY2hUZXh0O1xyXG4gICAgICAgIG9wLmNvbmRpdGlvbnMgPSBxdWVyeS5jb25kaXRpb25zO1xyXG4gICAgICAgIHRoaXMuc2V0T3BlcmF0aW9uVmFsdWVzKG9wTmFtZSwgb3ApO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCBzZWxlY3RlZCA9IHRoaXMuZ2V0U2VsZWN0ZWQodGhpcy5wcm9wcy5uYW1lKTtcclxuICAgICAgICBjb25zdCBvcE5hbWUgPSBzZWxlY3RlZCAmJiBzZWxlY3RlZC5uYW1lO1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgaGVpZ2h0OiAnMTAwJScgfX0+XHJcbiAgICAgICAgICAgICAgICA8SGVhZGVyIHRpdGxlPXt0aGlzLmdldFRpdGxlKHNlbGVjdGVkKX0gb25TaWRlYmFyVG9nZ2xlPXtlID0+IHRoaXMudG9nZ2xlU2lkZWJhcigpIH0gLz5cclxuICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJib2R5XCIgY2xhc3NOYW1lPXt0aGlzLnN0YXRlLnNpZGViYXJIaWRkZW4gPyAnaGlkZS1zaWRlYmFyJyA6ICcnfT5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImlubmVyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxTaWRlYmFyXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBuYW1lPXtvcE5hbWV9ICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2aWV3ZXJBcmdzPXt0aGlzLnN0YXRlLnZpZXdlckFyZ3N9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvcGVyYXRpb25zPXt0aGlzLnN0YXRlLm9wZXJhdGlvbnN9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8Q29udGVudFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29uZmlnPXt0aGlzLnByb3BzLm1ldGFkYXRhLmNvbmZpZ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHVzZXJpbmZvPXt0aGlzLnByb3BzLm1ldGFkYXRhLnVzZXJpbmZvfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgc2VsZWN0ZWQ9e3NlbGVjdGVkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVzPXt0aGlzLmdldE9wZXJhdGlvblZhbHVlcyh0aGlzLnByb3BzLm5hbWUpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgY29udmVudGlvbnM9e3RoaXMucHJvcHMubWV0YWRhdGEuY29uZmlnLmltcGxpY2l0Y29udmVudGlvbnN9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2aWV3ZXJBcmdzPXt0aGlzLnN0YXRlLnZpZXdlckFyZ3Nbb3BOYW1lXX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXthcmdzID0+IHRoaXMub25PcGVyYXRpb25DaGFuZ2Uob3BOYW1lLCBhcmdzKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQWRkQ29uZGl0aW9uPXtlID0+IHRoaXMuYWRkQ29uZGl0aW9uKG9wTmFtZSl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvblJlbW92ZUNvbmRpdGlvbj17YyA9PiB0aGlzLnJlbW92ZUNvbmRpdGlvbihvcE5hbWUsIGMpIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uU2hvd0RpYWxvZz17aWQgPT4gdGhpcy5zaG93RGlhbG9nKGlkKSB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvblNhdmVRdWVyeT17KCkgPT4gdGhpcy5zYXZlUXVlcnkob3BOYW1lKSB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvblJlbW92ZVF1ZXJ5PXt4ID0+IHRoaXMucmVtb3ZlUXVlcnkob3BOYW1lLCB4KSB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkxvYWRRdWVyeT17eCA9PiB0aGlzLmxvYWRRdWVyeShvcE5hbWUsIHgpIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICB7dGhpcy5zdGF0ZS5kaWFsb2cgIT09IFwiY29sdW1uLXByZWZzLWRpYWxvZ1wiID8gbnVsbCA6IChcclxuICAgICAgICAgICAgICAgICAgICA8Q29sdW1uUHJlZnNEaWFsb2cgb25DbG9zZT17ZSA9PiB0aGlzLmhpZGVEaWFsb2coKSB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpZWxkcz17c2VsZWN0ZWQudG9UeXBlRmllbGRzfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZXM9e3RoaXMuZ2V0T3BlcmF0aW9uVmFsdWVzKHRoaXMucHJvcHMubmFtZSl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXthcmdzID0+IHRoaXMub25PcGVyYXRpb25DaGFuZ2Uob3BOYW1lLCBhcmdzKSB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICApfVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9BdXRvUXVlcnkudHN4IiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgeyByZW5kZXIgfSBmcm9tICdyZWFjdC1kb20nO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29sdW1uUHJlZnNEaWFsb2cgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQ8YW55LCBhbnk+IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzPywgY29udGV4dD8pIHtcclxuICAgICAgICBzdXBlcihwcm9wcywgY29udGV4dCk7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHt9O1xyXG4gICAgfVxyXG5cclxuICAgIHJlc2V0RmllbGRzKCkge1xyXG4gICAgICAgIHZhciBmaWVsZHMgPSBbXTtcclxuICAgICAgICB0aGlzLnByb3BzLm9uQ2hhbmdlKHsgZmllbGRzIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHNlbGVjdEZpZWxkKGZpZWxkKSB7XHJcbiAgICAgICAgbGV0IGZpZWxkcyA9ICh0aGlzLnByb3BzLnZhbHVlcy5maWVsZHMgfHwgW10pO1xyXG5cclxuICAgICAgICBpZiAoZmllbGRzLmluZGV4T2YoZmllbGQpID49IDApXHJcbiAgICAgICAgICAgIGZpZWxkcyA9IGZpZWxkcy5maWx0ZXIoeCA9PiB4ICE9PSBmaWVsZCk7XHJcbiAgICAgICAgZWxzZVxyXG4gICAgICAgICAgICBmaWVsZHMucHVzaChmaWVsZCk7XHJcblxyXG4gICAgICAgIHRoaXMucHJvcHMub25DaGFuZ2UoeyBmaWVsZHMgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHZhciBmaWVsZHMgPSAodGhpcy5wcm9wcy52YWx1ZXMuZmllbGRzIHx8IFtdKTtcclxuXHJcbiAgICAgICAgdmFyIENoZWNrYm94U3R5bGUgPSB7XHJcbiAgICAgICAgICAgIHZlcnRpY2FsQWxpZ246ICd0ZXh0LWJvdHRvbScsIGZvbnRTaXplOiAnMjBweCcsIG1hcmdpbjogJzAgNXB4IDAgMCdcclxuICAgICAgICB9O1xyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IGlkPVwiY29sdW1uLXByZWZzLWRpYWxvZ1wiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJkaWFsb2ctd3JhcHBlclwiIG9uQ2xpY2s9e2UgPT4gdGhpcy5wcm9wcy5vbkNsb3NlKCl9PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZGlhbG9nXCIgb25DbGljaz17ZSA9PiBlLnN0b3BQcm9wYWdhdGlvbigpIH0+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImRpYWxvZy1oZWFkZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxoMz5Db2x1bW4gUHJlZmVyZW5jZXM8L2gzPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZGlhbG9nLWJvZHlcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgb25DbGljaz17ZSA9PiB0aGlzLnJlc2V0RmllbGRzKCl9IHN0eWxlPXt7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBib3JkZXJCb3R0b206ICcxcHggc29saWQgI2NjYycsIHBhZGRpbmc6ICcwIDAgMTBweCAwJywgbWFyZ2luOiAnMCAwIDE1cHggMCcsIGN1cnNvcjogJ3BvaW50ZXInXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwibWF0ZXJpYWwtaWNvbnNcIiBzdHlsZT17Q2hlY2tib3hTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtmaWVsZHMubGVuZ3RoID09PSAwID8gJ3JhZGlvX2J1dHRvbl9jaGVja2VkJyA6ICdyYWRpb19idXR0b25fdW5jaGVja2VkJ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2k+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+U2hvdyBhbGwgY29sdW1uczwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLmZpZWxkcy5tYXAoZiA9PiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBvbkNsaWNrPXtlID0+IHRoaXMuc2VsZWN0RmllbGQoZi5uYW1lKX0gc3R5bGU9e3sgbWFyZ2luOiAnMCAwIDVweCAwJywgY3Vyc29yOiAncG9pbnRlcicgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cIm1hdGVyaWFsLWljb25zXCIgIHN0eWxlPXtDaGVja2JveFN0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtmaWVsZHMuaW5kZXhPZihmLm5hbWUpID49IDAgPyAnY2hlY2tfYm94JyA6ICdjaGVja19ib3hfb3V0bGluZV9ibGFuayd9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2k+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPntmLm5hbWV9PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKSl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJkaWFsb2ctZm9vdGVyXCIgc3R5bGU9e3t0ZXh0QWxpZ246J3JpZ2h0J319PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJidG5UZXh0XCIgb25DbGljaz17ZSA9PiB0aGlzLnByb3BzLm9uQ2xvc2UoKX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+RE9ORTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL0NvbHVtblByZWZzRGlhbG9nLnRzeCIsImltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IFJlc3VsdHMgZnJvbSAnLi9SZXN1bHRzJztcclxuXHJcbmltcG9ydCB7IGNvbWJpbmVQYXRocywgY3JlYXRlVXJsLCBzcGxpdE9uRmlyc3QgfSBmcm9tICdzZXJ2aWNlc3RhY2stY2xpZW50JztcclxuaW1wb3J0IHsgY2xpZW50LCBub3JtYWxpemUsIHBhcnNlUmVzcG9uc2VTdGF0dXMgfSBmcm9tICcuL3NoYXJlZCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb250ZW50IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PGFueSwgYW55PiB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcz8sIGNvbnRleHQ/KSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMsIGNvbnRleHQpO1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7IHJlc3VsdHM6IG51bGwgfTtcclxuICAgIH1cclxuXHJcbiAgICBzZWxlY3RGaWVsZChlKSB7XHJcbiAgICAgICAgdmFyIHNlYXJjaEZpZWxkID0gZS50YXJnZXQub3B0aW9uc1tlLnRhcmdldC5zZWxlY3RlZEluZGV4XS52YWx1ZSxcclxuICAgICAgICAgICAgc2VhcmNoVHlwZSA9IHRoaXMucHJvcHMudmFsdWVzLnNlYXJjaFR5cGUsXHJcbiAgICAgICAgICAgIHNlYXJjaFRleHQgPSB0aGlzLnByb3BzLnZhbHVlcy5zZWFyY2hUZXh0O1xyXG5cclxuICAgICAgICBjb25zdCBmID0gdGhpcy5nZXRTZWFyY2hGaWVsZChzZWFyY2hGaWVsZCk7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNJbnRGaWVsZChmKSkge1xyXG4gICAgICAgICAgICBpZiAoaXNOYU4oc2VhcmNoVGV4dCkpXHJcbiAgICAgICAgICAgICAgICBzZWFyY2hUZXh0ID0gJyc7XHJcbiAgICAgICAgICAgIGNvbnN0IGNvbnZlbnRpb24gPSB0aGlzLnByb3BzLmNvbnZlbnRpb25zLmZpbHRlcihjID0+IGMubmFtZSA9PT0gc2VhcmNoVHlwZSlbMF07XHJcbiAgICAgICAgICAgIGlmICghdGhpcy5tYXRjaGVzQ29udmVudGlvbihjb252ZW50aW9uLCBmLnR5cGUpKVxyXG4gICAgICAgICAgICAgICAgc2VhcmNoVHlwZSA9ICcnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5wcm9wcy5vbkNoYW5nZSh7IHNlYXJjaEZpZWxkLCBzZWFyY2hUeXBlLCBzZWFyY2hUZXh0IH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHNlbGVjdE9wZXJhbmQoZSkge1xyXG4gICAgICAgIHRoaXMucHJvcHMub25DaGFuZ2UoeyBzZWFyY2hUeXBlOiBlLnRhcmdldC5vcHRpb25zW2UudGFyZ2V0LnNlbGVjdGVkSW5kZXhdLnZhbHVlIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGNoYW5nZVRleHQoZSkge1xyXG4gICAgICAgIHRoaXMucHJvcHMub25DaGFuZ2UoeyBzZWFyY2hUZXh0OiBlLnRhcmdldC52YWx1ZX0pO1xyXG4gICAgfVxyXG5cclxuICAgIHNlbGVjdEZvcm1hdChmb3JtYXQpIHtcclxuICAgICAgICBpZiAoZm9ybWF0ID09PSB0aGlzLnByb3BzLnZhbHVlcy5mb3JtYXQpIC8vdG9nZ2xlXHJcbiAgICAgICAgICAgIGZvcm1hdCA9IFwiXCI7XHJcblxyXG4gICAgICAgIHRoaXMucHJvcHMub25DaGFuZ2UoeyBmb3JtYXQgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgY2xlYXIoKSB7XHJcbiAgICAgICAgdGhpcy5wcm9wcy5vbkNoYW5nZSh7XHJcbiAgICAgICAgICAgIHNlYXJjaEZpZWxkOiBudWxsLCBzZWFyY2hUeXBlOiBudWxsLCBzZWFyY2hUZXh0OiAnJywgZm9ybWF0OiAnJywgb3JkZXJCeTogJycsIG9mZnNldDogMCxcclxuICAgICAgICAgICAgZmllbGRzOiBbXSwgY29uZGl0aW9uczogW11cclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRBdXRvUXVlcnlVcmwoZm9ybWF0OnN0cmluZykge1xyXG4gICAgICAgIGNvbnN0IGZpcnN0Um91dGUgPSAodGhpcy5wcm9wcy5zZWxlY3RlZC5vcGVyYXRpb24ucm91dGVzIHx8IFtdKS5maWx0ZXIoeCA9PiB4LnBhdGguaW5kZXhPZigneycpID09PSAtMSlbMF07XHJcblxyXG4gICAgICAgIGNvbnN0IHBhdGggPSBmaXJzdFJvdXRlXHJcbiAgICAgICAgICAgID8gZmlyc3RSb3V0ZS5wYXRoXHJcbiAgICAgICAgICAgIDogYC8ke2Zvcm1hdCB8fCAnaHRtbCd9L3JlcGx5L2AgKyB0aGlzLnByb3BzLnNlbGVjdGVkLnJlcXVlc3RUeXBlLm5hbWU7XHJcblxyXG4gICAgICAgIGxldCB1cmwgPSBjb21iaW5lUGF0aHModGhpcy5wcm9wcy5jb25maWcuc2VydmljZWJhc2V1cmwsIHBhdGgpO1xyXG5cclxuICAgICAgICBpZiAoZmlyc3RSb3V0ZSAmJiBmb3JtYXQpXHJcbiAgICAgICAgICAgIHVybCArPSBcIi5cIiArIGZvcm1hdDtcclxuXHJcbiAgICAgICAgdGhpcy5nZXRBcmdzKCkuZm9yRWFjaChhcmcgPT5cclxuICAgICAgICAgICAgdXJsID0gY3JlYXRlVXJsKHVybCwgYXJnKSk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnByb3BzLnZhbHVlcy5vZmZzZXQpXHJcbiAgICAgICAgICAgIHVybCA9IGNyZWF0ZVVybCh1cmwsIHsgc2tpcDogdGhpcy5wcm9wcy52YWx1ZXMub2Zmc2V0IH0pO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5wcm9wcy52YWx1ZXMub3JkZXJCeSlcclxuICAgICAgICAgICAgdXJsID0gY3JlYXRlVXJsKHVybCwgeyBvcmRlckJ5OiB0aGlzLnByb3BzLnZhbHVlcy5vcmRlckJ5IH0pO1xyXG5cclxuICAgICAgICBpZiAoKHRoaXMucHJvcHMudmFsdWVzLmZpZWxkcyB8fCBbXSkubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICB1cmwgPSBjcmVhdGVVcmwodXJsLCB7IGZpZWxkczogdGhpcy5wcm9wcy52YWx1ZXMuZmllbGRzLmpvaW4oJywnKSB9KTtcclxuXHJcbiAgICAgICAgICAgIGlmICghZm9ybWF0IHx8IGZvcm1hdCA9PT0gJ2h0bWwnKVxyXG4gICAgICAgICAgICAgICAgdXJsID0gY3JlYXRlVXJsKHVybCwgeyBqc2NvbmZpZzogJ2VkdicgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB1cmwgPSBjcmVhdGVVcmwodXJsLCB7IGluY2x1ZGU6IFwiVG90YWxcIiB9KTtcclxuXHJcbiAgICAgICAgdXJsID0gdXJsLnJlcGxhY2UoLyUyQy9nLCBcIixcIik7XHJcblxyXG4gICAgICAgIHJldHVybiB1cmw7XHJcbiAgICB9XHJcblxyXG4gICAgaXNWYWxpZENvbmRpdGlvbigpIHtcclxuICAgICAgICBjb25zdCB7IHNlYXJjaEZpZWxkLCBzZWFyY2hUeXBlLCBzZWFyY2hUZXh0IH0gPSB0aGlzLnByb3BzLnZhbHVlcztcclxuICAgICAgICByZXR1cm4gc2VhcmNoRmllbGQgJiYgc2VhcmNoVHlwZSAmJiBzZWFyY2hUZXh0XHJcbiAgICAgICAgICAgICYmIChzZWFyY2hUeXBlLnRvTG93ZXJDYXNlKCkgIT09ICdiZXR3ZWVuJyB8fCAoc2VhcmNoVGV4dC5pbmRleE9mKCcsJykgPiAwICYmIHNlYXJjaFRleHQuaW5kZXhPZignLCcpIDwgc2VhcmNoVGV4dC5sZW5ndGggLTEpKTtcclxuICAgIH1cclxuXHJcbiAgICBpc0RpcnR5KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmlzVmFsaWRDb25kaXRpb24oKVxyXG4gICAgICAgICAgICB8fCB0aGlzLnByb3BzLnZhbHVlcy5mb3JtYXRcclxuICAgICAgICAgICAgfHwgdGhpcy5wcm9wcy52YWx1ZXMub2Zmc2V0XHJcbiAgICAgICAgICAgIHx8ICh0aGlzLnByb3BzLnZhbHVlcy5maWVsZHMgfHwgW10pLmxlbmd0aCA+IDBcclxuICAgICAgICAgICAgfHwgdGhpcy5wcm9wcy52YWx1ZXMub3JkZXJCeVxyXG4gICAgICAgICAgICB8fCAodGhpcy5wcm9wcy52YWx1ZXMuY29uZGl0aW9ucyB8fCBbXSkubGVuZ3RoID4gMDtcclxuICAgIH1cclxuXHJcbiAgICBnZXRBcmdzKCkge1xyXG4gICAgICAgIHZhciBhcmdzID0gW107XHJcbiAgICAgICAgdmFyIGNvbmRpdGlvbnMgPSAodGhpcy5wcm9wcy52YWx1ZXMuY29uZGl0aW9ucyB8fCBbXSkuc2xpY2UoMCk7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNWYWxpZENvbmRpdGlvbigpKSB7XHJcbiAgICAgICAgICAgIGNvbmRpdGlvbnMucHVzaCh0aGlzLnByb3BzLnZhbHVlcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25kaXRpb25zLmZvckVhY2goY29uZGl0aW9uID0+IHtcclxuICAgICAgICAgICAgY29uc3QgeyBzZWFyY2hGaWVsZCwgc2VhcmNoVHlwZSwgc2VhcmNoVGV4dCB9ID0gY29uZGl0aW9uO1xyXG4gICAgICAgICAgICB2YXIgY29udmVudGlvbiA9IHRoaXMucHJvcHMuY29udmVudGlvbnMuZmlsdGVyKGMgPT4gYy5uYW1lID09PSBzZWFyY2hUeXBlKVswXTtcclxuICAgICAgICAgICAgaWYgKGNvbnZlbnRpb24pIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGZpZWxkID0gY29udmVudGlvbi52YWx1ZS5yZXBsYWNlKFwiJVwiLCBzZWFyY2hGaWVsZCk7XHJcbiAgICAgICAgICAgICAgICBhcmdzLnB1c2goeyBbZmllbGRdOiBzZWFyY2hUZXh0IH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBhcmdzO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFNlYXJjaEZpZWxkKG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnByb3BzLnNlbGVjdGVkLmZyb21UeXBlRmllbGRzLmZpbHRlcihmID0+IGYubmFtZSA9PT0gbmFtZSlbMF07XHJcbiAgICB9XHJcblxyXG4gICAgaXNJbnRGaWVsZChmKSB7XHJcbiAgICAgICAgcmV0dXJuIGYgJiYgKGYudHlwZSB8fCAnJykudG9Mb3dlckNhc2UoKS5zdGFydHNXaXRoKCdpbnQnKTtcclxuICAgIH1cclxuXHJcbiAgICBtYXRjaGVzQ29udmVudGlvbihjb252ZW50aW9uLCBmaWVsZFR5cGUpIHtcclxuICAgICAgICByZXR1cm4gIWNvbnZlbnRpb24gfHwgIWNvbnZlbnRpb24udHlwZXMgfHwgIWZpZWxkVHlwZSB8fFxyXG4gICAgICAgICAgICBjb252ZW50aW9uLnR5cGVzLnJlcGxhY2UoLyAvZywgJycpLnRvTG93ZXJDYXNlKCkuc3BsaXQoJywnKS5pbmRleE9mKGZpZWxkVHlwZS50b0xvd2VyQ2FzZSgpKSA+PSAwO1xyXG4gICAgfVxyXG5cclxuICAgIGdldENvbnZlbnRpb25zKCkge1xyXG4gICAgICAgIGNvbnN0IHZhbHVlcyA9IHRoaXMucHJvcHMudmFsdWVzO1xyXG4gICAgICAgIGlmICh2YWx1ZXMgJiYgdmFsdWVzLnNlYXJjaEZpZWxkKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGYgPSB0aGlzLmdldFNlYXJjaEZpZWxkKHZhbHVlcy5zZWFyY2hGaWVsZCk7XHJcbiAgICAgICAgICAgIGlmIChmKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9wcy5jb252ZW50aW9ucy5maWx0ZXIoYyA9PiB0aGlzLm1hdGNoZXNDb252ZW50aW9uKGMsIGYudHlwZSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLnByb3BzLmNvbnZlbnRpb25zO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlclJlc3VsdHMocmVzcG9uc2UpIHtcclxuICAgICAgICB2YXIgZmllbGROYW1lcyA9IG51bGwsIGZpZWxkV2lkdGhzID0gbnVsbDtcclxuICAgICAgICB2YXIgZmllbGREZWZzID0gKHRoaXMucHJvcHMudmlld2VyQXJnc1tcIkRlZmF1bHRGaWVsZHNcIl0gfHwgXCJcIilcclxuICAgICAgICAgICAgLnNwbGl0KCcsJylcclxuICAgICAgICAgICAgLmZpbHRlcih4ID0+IHgudHJpbSgpLmxlbmd0aCA+IDApO1xyXG5cclxuICAgICAgICBpZiAoZmllbGREZWZzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgZmllbGROYW1lcyA9IFtdLCBmaWVsZFdpZHRocyA9IHt9O1xyXG4gICAgICAgICAgICBmaWVsZERlZnMuZm9yRWFjaCh4ID0+IHtcclxuICAgICAgICAgICAgICAgIHZhciBwYXJ0cyA9IHNwbGl0T25GaXJzdCh4LCAnOicpO1xyXG4gICAgICAgICAgICAgICAgZmllbGROYW1lcy5wdXNoKHBhcnRzWzBdKTtcclxuICAgICAgICAgICAgICAgIGlmIChwYXJ0cy5sZW5ndGggPiAxKVxyXG4gICAgICAgICAgICAgICAgICAgIGZpZWxkV2lkdGhzW3BhcnRzWzBdXSA9IHBhcnRzWzFdO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciB7IG9mZnNldCwgcmVzdWx0cywgdG90YWwgfSA9IHJlc3BvbnNlLCBtYXhMaW1pdCA9IHRoaXMucHJvcHMuY29uZmlnLm1heGxpbWl0O1xyXG5cclxuICAgICAgICBjb25zdCBDb250cm9sID0gKG5hbWUsIGVuYWJsZSwgb2Zmc2V0KSA9PiBlbmFibGVcclxuICAgICAgICAgICAgPyA8aSBjbGFzc05hbWU9XCJtYXRlcmlhbC1pY29uc1wiIHN0eWxlPXt7IGN1cnNvcjogJ3BvaW50ZXInIH19IG9uQ2xpY2s9e2UgPT4gdGhpcy5wcm9wcy5vbkNoYW5nZSh7IG9mZnNldCB9KX0+e25hbWV9PC9pPlxyXG4gICAgICAgICAgICA6IDxpIGNsYXNzTmFtZT1cIm1hdGVyaWFsLWljb25zXCIgc3R5bGU9e3sgY29sb3I6ICcjY2NjJyB9fT57bmFtZX08L2k+O1xyXG5cclxuICAgICAgICB2YXIgUGFnaW5nID0gKFxyXG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJwYWdpbmdcIiBzdHlsZT17e3BhZGRpbmc6JzAgMTBweCAwIDAnfX0+XHJcbiAgICAgICAgICAgICAgICB7Q29udHJvbChcInNraXBfcHJldmlvdXNcIiwgb2Zmc2V0ID4gMCwgMCkgfVxyXG4gICAgICAgICAgICAgICAge0NvbnRyb2woXCJjaGV2cm9uX2xlZnRcIiwgb2Zmc2V0ID4gMCwgTWF0aC5tYXgob2Zmc2V0IC0gbWF4TGltaXQsIDApKSB9XHJcbiAgICAgICAgICAgICAgICB7Q29udHJvbChcImNoZXZyb25fcmlnaHRcIiwgb2Zmc2V0ICsgbWF4TGltaXQgPCB0b3RhbCwgb2Zmc2V0ICsgbWF4TGltaXQpIH1cclxuICAgICAgICAgICAgICAgIHtDb250cm9sKFwic2tpcF9uZXh0XCIsIG9mZnNldCArIG1heExpbWl0IDwgdG90YWwsIE1hdGguZmxvb3IoKHRvdGFsIC0gMSkgLyBtYXhMaW1pdCkgKiBtYXhMaW1pdCl9XHJcbiAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICApO1xyXG5cclxuICAgICAgICByZXR1cm4gcmVzcG9uc2UucmVzdWx0cy5sZW5ndGggPT09IDBcclxuICAgICAgICAgICAgPyA8ZGl2IGNsYXNzTmFtZT1cInJlc3VsdHMtbm9uZVwiPlRoZXJlIHdlcmUgbm8gcmVzdWx0czwvZGl2PlxyXG4gICAgICAgICAgICA6IChcclxuICAgICAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJub3NlbGVjdFwiIHN0eWxlPXt7IGNvbG9yOiAnIzc1NzU3NScsIHBhZGRpbmc6ICcxNXB4IDAnIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7UGFnaW5nfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNob3dpbmcgUmVzdWx0cyB7b2Zmc2V0ICsgMX0gLSB7b2Zmc2V0ICsgcmVzdWx0cy5sZW5ndGh9IG9mIHt0b3RhbH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwibWF0ZXJpYWwtaWNvbnNcIiB0aXRsZT1cInNob3cvaGlkZSBjb2x1bW5zXCIgb25DbGljaz17ZSA9PiB0aGlzLnByb3BzLm9uU2hvd0RpYWxvZygnY29sdW1uLXByZWZzLWRpYWxvZycpfSBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmVydGljYWxBbGlnbjogJ3RleHQtYm90dG9tJywgbWFyZ2luOiAnMCAwIDAgMTBweCcsIGN1cnNvcjogJ3BvaW50ZXInLCBmb250U2l6ZTonMjBweCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgfX0+dmlld19saXN0PC9pPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgICAgICA8UmVzdWx0cyByZXN1bHRzPXtyZXNwb25zZS5yZXN1bHRzfSBmaWVsZE5hbWVzPXtmaWVsZE5hbWVzfSBmaWVsZFdpZHRocz17ZmllbGRXaWR0aHN9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkPXt0aGlzLnByb3BzLnNlbGVjdGVkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZXM9e3RoaXMucHJvcHMudmFsdWVzfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbk9yZGVyQnlDaGFuZ2U9e29yZGVyQnkgPT4gdGhpcy5wcm9wcy5vbkNoYW5nZSh7IG9yZGVyQnkgfSl9IC8+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXJCb2R5KG9wLCB2YWx1ZXMpIHtcclxuICAgICAgICBjb25zdCB1cmwgPSB0aGlzLmdldEF1dG9RdWVyeVVybCh0aGlzLnByb3BzLnZhbHVlcy5mb3JtYXQpO1xyXG4gICAgICAgIGNvbnN0IG5hbWUgPSB0aGlzLnByb3BzLnNlbGVjdGVkLm5hbWU7XHJcbiAgICAgICAgY29uc3QgbG9hZGluZ05ld1F1ZXJ5ID0gdGhpcy5zdGF0ZS51cmwgIT09IHVybDtcclxuICAgICAgICBpZiAobG9hZGluZ05ld1F1ZXJ5KSB7XHJcbiAgICAgICAgICAgIGxldCBuZXdVcmwgPSB0aGlzLmdldEF1dG9RdWVyeVVybChcImpzb25cIik7XHJcbiAgICAgICAgICAgIG5ld1VybCA9IGNyZWF0ZVVybChuZXdVcmwsIHsganNjb25maWc6ICdEYXRlSGFuZGxlcjpJU084NjAxRGF0ZU9ubHksVGltZVNwYW5IYW5kbGVyOlN0YW5kYXJkRm9ybWF0JyB9KTtcclxuXHJcbiAgICAgICAgICAgIGNsaWVudC5nZXQobmV3VXJsKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4ociA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0gbm9ybWFsaXplKHIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlLnVybCA9IHVybDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgdXJsLCBuYW1lLCByZXNwb25zZSwgZXJyb3I6bnVsbCB9KTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2gociA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHN0YXR1cyA9IHIucmVzcG9uc2VTdGF0dXM7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHVybCwgbmFtZSwgcmVzcG9uc2U6bnVsbCwgZXJyb3I6IGAke3N0YXR1cy5lcnJvckNvZGV9OiAke3N0YXR1cy5tZXNzYWdlfWAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHF1ZXJpZXMgPSAodGhpcy5wcm9wcy52YWx1ZXMucXVlcmllcyB8fCBbXSk7XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGlkPVwicXVlcnktdGl0bGVcIj5cclxuICAgICAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy52aWV3ZXJBcmdzW1wiRGVzY3JpcHRpb25cIl0gfVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGlkPVwidXJsXCIgc3R5bGU9e3sgcGFkZGluZzogJzAgMCAxMHB4IDAnLCB3aGl0ZVNwYWNlOidub3dyYXAnIH19PlxyXG4gICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9e3VybH0gdGFyZ2V0PVwiX2JsYW5rXCI+e3VybH08L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgeyEgIHRoaXMuaXNEaXJ0eSgpID8gbnVsbCA6IChcclxuICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwibWF0ZXJpYWwtaWNvbnMgbm9zZWxlY3RcIiB0aXRsZT1cInJlc2V0IHF1ZXJ5XCIgb25DbGljaz17ZSA9PiB0aGlzLmNsZWFyKCkgfSBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogJzAgMCAwIDVweCcsIGNvbG9yOiAnIzc1NzU3NScsIGZvbnRTaXplOiAnMTZweCcsIHZlcnRpY2FsQWxpZ246ICdib3R0b20nLCBjdXJzb3I6ICdwb2ludGVyJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9fT5jbGVhcjwvaT5cclxuICAgICAgICAgICAgICAgICAgICApfVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgPHNlbGVjdCB2YWx1ZT17dmFsdWVzLnNlYXJjaEZpZWxkfSBvbkNoYW5nZT17ZSA9PiB0aGlzLnNlbGVjdEZpZWxkKGUpIH0+XHJcbiAgICAgICAgICAgICAgICAgICAgPG9wdGlvbj48L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICB7b3AuZnJvbVR5cGVGaWVsZHMubWFwKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmID0+IDxvcHRpb24ga2V5PXtmLm5hbWV9PntmLm5hbWV9PC9vcHRpb24+KSB9XHJcbiAgICAgICAgICAgICAgICA8L3NlbGVjdD5cclxuICAgICAgICAgICAgICAgIDxzZWxlY3QgdmFsdWU9e3ZhbHVlcy5zZWFyY2hUeXBlfSBvbkNoYW5nZT17ZSA9PiB0aGlzLnNlbGVjdE9wZXJhbmQoZSkgfT5cclxuICAgICAgICAgICAgICAgICAgICA8b3B0aW9uPjwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgIHt0aGlzLmdldENvbnZlbnRpb25zKCkubWFwKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjID0+IDxvcHRpb24ga2V5PXtjLm5hbWV9PntjLm5hbWV9PC9vcHRpb24+KSB9XHJcbiAgICAgICAgICAgICAgICA8L3NlbGVjdD5cclxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGlkPVwidHh0U2VhcmNoXCIgdmFsdWU9e3ZhbHVlcy5zZWFyY2hUZXh0fSBhdXRvQ29tcGxldGU9XCJvZmZcIlxyXG4gICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtlID0+IHRoaXMuY2hhbmdlVGV4dChlKSB9XHJcbiAgICAgICAgICAgICAgICAgICAgb25LZXlEb3duPXtlID0+IGUua2V5Q29kZSA9PT0gMTMgPyB0aGlzLnByb3BzLm9uQWRkQ29uZGl0aW9uKCkgOiBudWxsfSAvPlxyXG5cclxuICAgICAgICAgICAgICAgIHt0aGlzLmlzVmFsaWRDb25kaXRpb24oKVxyXG4gICAgICAgICAgICAgICAgICAgID8gKDxpIGNsYXNzTmFtZT1cIm1hdGVyaWFsLWljb25zXCIgc3R5bGU9e3sgZm9udFNpemU6ICczMHB4JywgdmVydGljYWxBbGlnbjogJ2JvdHRvbScsIGNvbG9yOiAnIzAwQzg1MycsIGN1cnNvcjogJ3BvaW50ZXInIH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e2UgPT4gdGhpcy5wcm9wcy5vbkFkZENvbmRpdGlvbigpIH0gdGl0bGU9XCJBZGQgY29uZGl0aW9uXCI+YWRkX2NpcmNsZTwvaT4pXHJcbiAgICAgICAgICAgICAgICAgICAgOiAoPGkgY2xhc3NOYW1lPVwibWF0ZXJpYWwtaWNvbnNcIiBzdHlsZT17eyBmb250U2l6ZTogJzMwcHgnLCB2ZXJ0aWNhbEFsaWduOiAnYm90dG9tJywgY29sb3I6ICcjY2NjJyB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZT1cIkluY29tcGxldGUgY29uZGl0aW9uXCI+YWRkX2NpcmNsZTwvaT4pfVxyXG5cclxuICAgICAgICAgICAgICAgIHshdGhpcy5wcm9wcy5jb25maWcuZm9ybWF0cyB8fCB0aGlzLnByb3BzLmNvbmZpZy5mb3JtYXRzLmxlbmd0aCA9PT0gMCA/IG51bGwgOiAoXHJcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZm9ybWF0cyBub3NlbGVjdFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5jb25maWcuZm9ybWF0cy5tYXAoZiA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4ga2V5PXtmfSBjbGFzc05hbWU9e3ZhbHVlcy5mb3JtYXQgPT09IGYgPyAnYWN0aXZlJyA6ICcnfSBvbkNsaWNrPXtlID0+IHRoaXMuc2VsZWN0Rm9ybWF0KGYpfT57Zn08L3NwYW4+KSB9XHJcbiAgICAgICAgICAgICAgICAgICAgPC9zcGFuPikgfVxyXG5cclxuICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLnZhbHVlcy5jb25kaXRpb25zLmxlbmd0aCArIHF1ZXJpZXMubGVuZ3RoID4gMCA/XHJcbiAgICAgICAgICAgICAgICAgICAgKDxkaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29uZGl0aW9uc1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3RoaXMucHJvcHMudmFsdWVzLmNvbmRpdGlvbnMubWFwKGMgPT4gKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYga2V5PXtjLmlkfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwibWF0ZXJpYWwtaWNvbnNcIiBzdHlsZT17eyBjb2xvcjogJyNkYjQ0MzcnLCBjdXJzb3I6ICdwb2ludGVyJywgcGFkZGluZzogJzAgNXB4IDAgMCcgfX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlPVwicmVtb3ZlIGNvbmRpdGlvblwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXtlID0+IHRoaXMucHJvcHMub25SZW1vdmVDb25kaXRpb24oYykgfT5yZW1vdmVfY2lyY2xlPC9pPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Yy5zZWFyY2hGaWVsZH0ge2Muc2VhcmNoVHlwZX0ge2Muc2VhcmNoVGV4dH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICkpIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy52YWx1ZXMuY29uZGl0aW9ucy5sZW5ndGggPiAwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICg8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLCB2ZXJ0aWNhbEFsaWduOiAndG9wJywgcGFkZGluZzogMTAgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgdGl0bGU9XCJTYXZlIFF1ZXJ5XCIgY2xhc3NOYW1lPVwibWF0ZXJpYWwtaWNvbnNcIiBzdHlsZT17eyBmb250U2l6ZTogJzI0cHgnLCBjb2xvcjogJyM0NDQnLCBjdXJzb3I6ICdwb2ludGVyJyB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e2UgPT4gdGhpcy5wcm9wcy5vblNhdmVRdWVyeSgpIH0+c2F2ZTwvaT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogbnVsbH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicXVlcmllc1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3F1ZXJpZXMubWFwKHggPT4gKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cIm1hdGVyaWFsLWljb25zXCIgc3R5bGU9e3sgY29sb3I6ICcjZGI0NDM3JywgY3Vyc29yOiAncG9pbnRlcicsIHBhZGRpbmc6ICcwIDVweCAwIDAnIH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZT1cInJlbW92ZSBxdWVyeVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXtlID0+IHRoaXMucHJvcHMub25SZW1vdmVRdWVyeSh4KSB9PnJlbW92ZV9jaXJjbGU8L2k+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJsbmtcIiB0aXRsZT1cImxvYWQgcXVlcnlcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17ZSA9PiB0aGlzLnByb3BzLm9uTG9hZFF1ZXJ5KHgpIH0+e3gubmFtZX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+KVxyXG4gICAgICAgICAgICAgICAgICAgIDogbnVsbH1cclxuXHJcbiAgICAgICAgICAgICAgICB7IHRoaXMuc3RhdGUucmVzcG9uc2VcclxuICAgICAgICAgICAgICAgICAgICA/ICghbG9hZGluZ05ld1F1ZXJ5IHx8IG5hbWUgPT09IHRoaXMuc3RhdGUubmFtZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA/IHRoaXMucmVuZGVyUmVzdWx0cyh0aGlzLnN0YXRlLnJlc3BvbnNlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA6ICg8ZGl2IHN0eWxlPXt7IGNvbG9yOiAnIzc1NzU3NScsIHBhZGRpbmc6JzIwcHggMCAwIDAnIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cIm1hdGVyaWFsLWljb25zIHNwaW5cIiBzdHlsZT17eyBmb250U2l6ZTonMjBweCcsIHZlcnRpY2FsQWxpZ246ICd0ZXh0LWJvdHRvbScgfX0+Y2FjaGVkPC9pPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IHBhZGRpbmc6JzAgMCAwIDVweCd9fT5sb2FkaW5nIHJlc3VsdHMuLi48L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PikpXHJcbiAgICAgICAgICAgICAgICAgICAgOiB0aGlzLnN0YXRlLmVycm9yXHJcbiAgICAgICAgICAgICAgICAgICAgICAgID8gPGRpdiBzdHlsZT17eyBjb2xvcjonI2RiNDQzNycsIHBhZGRpbmc6NSB9fT57dGhpcy5zdGF0ZS5lcnJvcn08L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgOiBudWxsIH1cclxuXHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IGlzTXNFZGdlID0gL0VkZ2UvLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBpZD1cImNvbnRlbnRcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5uZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICA8dGFibGU+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRib2R5PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dHI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7aXNNc0VkZ2UgPyA8dGQgc3R5bGU9e3sgbWluV2lkdGg6ICcyMHB4JyB9fT48L3RkPiA6IG51bGx9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3RoaXMucHJvcHMuc2VsZWN0ZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyB0aGlzLnJlbmRlckJvZHkodGhpcy5wcm9wcy5zZWxlY3RlZCwgdGhpcy5wcm9wcy52YWx1ZXMpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogKDxkaXYgc3R5bGU9e3sgcGFkZGluZzogJzE1cHggMCcsIGZvbnRTaXplOicyMHB4JywgY29sb3I6JyM3NTc1NzUnIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwibWF0ZXJpYWwtaWNvbnNcIiBzdHlsZT17eyB2ZXJ0aWNhbEFsaWduOiAnYm90dG9tJywgbWFyZ2luOicwIDEwcHggMCAwJ319PmFycm93X2JhY2s8L2k+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy51c2VyaW5mby5xdWVyeWNvdW50ID4gMFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gXCJQbGVhc2UgU2VsZWN0IGEgUXVlcnlcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IHRoaXMucHJvcHMudXNlcmluZm8uaXNhdXRoZW50aWNhdGVkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IFwiVGhlcmUgYXJlIG5vIHF1ZXJpZXMgYXZhaWxhYmxlXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogXCJQbGVhc2UgU2lnbiBJbiB0byBzZWUgeW91ciBhdmFpbGFibGUgcXVlcmllc1wifTwvZGl2PikgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHshaXNNc0VkZ2UgPyA8dGQgc3R5bGU9e3sgbWluV2lkdGg6ICcyMHB4JyB9fT48L3RkPiA6IG51bGx9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XHJcbiAgICAgICAgICAgICAgICAgICAgIDwvdGJvZHk+XHJcbiAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9Db250ZW50LnRzeCIsImltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0JztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEhlYWRlciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudDxhbnksIGFueT4ge1xyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgaWQ9XCJoZWFkZXJcIiBzdHlsZT17eyBtYXJnaW46ICdhdXRvJywgZGlzcGxheTogJ2ZsZXgnLCBmbGV4RGlyZWN0aW9uOiAncm93JyB9fT5cclxuICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cIm1hdGVyaWFsLWljb25zXCIgc3R5bGU9e3sgY3Vyc29yOiAncG9pbnRlcicgfX0gb25DbGljaz17ZSA9PiB0aGlzLnByb3BzLm9uU2lkZWJhclRvZ2dsZSgpIH0+XHJcbiAgICAgICAgICAgICAgICAgICAgbWVudVxyXG4gICAgICAgICAgICAgICAgPC9pPlxyXG4gICAgICAgICAgICAgICAgPGgxPkF1dG9RdWVyeTwvaDE+XHJcbiAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy50aXRsZSA9PSBudWxsID8gPGRpdiBzdHlsZT17e2ZsZXg6MX19IC8+IDogKFxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJoZWFkZXItY29udGVudFwiIHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgZmxleDogMSB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2VwZXJhdG9yXCI+PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aDI+e3RoaXMucHJvcHMudGl0bGV9PC9oMj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBtYXJnaW46ICdhdXRvJywgZmxleDogMSB9fT48L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvSGVhZGVyLnRzeCIsImltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHsgcmVuZGVyIH0gZnJvbSAncmVhY3QtZG9tJztcclxuaW1wb3J0IHsgTGluayB9IGZyb20gJ3JlYWN0LXJvdXRlci1kb20nO1xyXG5pbXBvcnQgeyBnZXRGaWVsZCB9IGZyb20gJy4vc2hhcmVkJztcclxuXHJcbmltcG9ydCB7IGh1bWFuaXplIH0gZnJvbSAnc2VydmljZXN0YWNrLWNsaWVudCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZXN1bHRzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PGFueSwgYW55PiB7XHJcbiAgICByZW5kZXJWYWx1ZShvOiBhbnkpIHtcclxuICAgICAgICByZXR1cm4gQXJyYXkuaXNBcnJheShvKVxyXG4gICAgICAgICAgICA/IG8uam9pbignLCAnKSBcclxuICAgICAgICAgICAgOiB0eXBlb2YgbyA9PSBcInVuZGVmaW5lZFwiXHJcbiAgICAgICAgICAgID8gXCJcIiBcclxuICAgICAgICAgICAgOiB0eXBlb2YgbyA9PSBcIm9iamVjdFwiXHJcbiAgICAgICAgICAgICAgICA/IEpTT04uc3RyaW5naWZ5KG8pXHJcbiAgICAgICAgICAgICAgICA6IG8gKyBcIlwiO1xyXG4gICAgfVxyXG5cclxuICAgIGZvcm1hdFN0cmluZyhzOiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAocykge1xyXG4gICAgICAgICAgICBpZiAocy5zdGFydHNXaXRoKFwiaHR0cFwiKSlcclxuICAgICAgICAgICAgICAgIHJldHVybiA8YSBocmVmPXtzfSB0YXJnZXQ9XCJfYmxhbmtcIj57cy5zdWJzdHJpbmcocy5pbmRleE9mKCc6Ly8nKSArIDMpIH08L2E+O1xyXG5cclxuICAgICAgICAgICAgaWYgKHMudG9Mb3dlckNhc2UoKSA9PT0gXCJmYWxzZVwiKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDxpIGNsYXNzTmFtZT1cIm1hdGVyaWFsLWljb25zXCIgc3R5bGU9e3sgY29sb3I6ICcjNzU3NTc1JywgZm9udFNpemU6ICcxNHB4JyB9fT5jaGVja19ib3hfb3V0bGluZV9ibGFuazwvaT47XHJcbiAgICAgICAgICAgIGlmIChzLnRvTG93ZXJDYXNlKCkgPT09IFwidHJ1ZVwiKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDxpIGNsYXNzTmFtZT1cIm1hdGVyaWFsLWljb25zXCIgc3R5bGU9e3sgY29sb3I6ICcjNjZCQjZBJywgZm9udFNpemU6ICcxNHB4JyB9fT5jaGVja19ib3g8L2k+O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIDxzcGFuPntzfTwvc3Bhbj47XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHZhciBSZXN1bHRzID0gPGRpdiBjbGFzc05hbWU9XCJyZXN1bHRzLW5vbmVcIj5UaGVyZSB3ZXJlIG5vIHJlc3VsdHM8L2Rpdj47XHJcblxyXG4gICAgICAgIHZhciByZXN1bHRzID0gdGhpcy5wcm9wcy5yZXN1bHRzO1xyXG4gICAgICAgIGlmIChyZXN1bHRzICYmIHJlc3VsdHMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICB2YXIgZmllbGROYW1lcyA9IHRoaXMucHJvcHMudmFsdWVzLmZpZWxkcyB8fCBbXTtcclxuICAgICAgICAgICAgaWYgKGZpZWxkTmFtZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBmaWVsZE5hbWVzID0gdGhpcy5wcm9wcy5maWVsZE5hbWVzIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9wcy5zZWxlY3RlZC50b1R5cGVGaWVsZHMubWFwKHggPT4geC5uYW1lKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIGZpZWxkV2lkdGhzID0gdGhpcy5wcm9wcy5maWVsZFdpZHRocyB8fCB7fTtcclxuXHJcbiAgICAgICAgICAgIHZhciBvcmRlckJ5ID0gKHRoaXMucHJvcHMudmFsdWVzLm9yZGVyQnkgfHwgJycpO1xyXG4gICAgICAgICAgICB2YXIgb3JkZXJCeU5hbWUgPSBvcmRlckJ5LnN0YXJ0c1dpdGgoJy0nKSA/IG9yZGVyQnkuc3Vic3RyKDEpIDogb3JkZXJCeTtcclxuXHJcbiAgICAgICAgICAgIFJlc3VsdHMgPSAoXHJcbiAgICAgICAgICAgICAgICA8dGFibGUgY2xhc3NOYW1lPVwicmVzdWx0c1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0aGVhZD48dHIgY2xhc3NOYW1lPVwibm9zZWxlY3RcIj57IGZpZWxkTmFtZXMubWFwKGYgPT4gKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGgga2V5PXtmfSBzdHlsZT17eyBjdXJzb3I6ICdwb2ludGVyJyB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17ZSA9PiB0aGlzLnByb3BzLm9uT3JkZXJCeUNoYW5nZShmICE9PSBvcmRlckJ5TmFtZSA/ICctJyArIGYgOiAhb3JkZXJCeS5zdGFydHNXaXRoKCctJykgPyAnJyA6IG9yZGVyQnlOYW1lKSB9PlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgaHVtYW5pemUoZikgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgZiAhPT0gb3JkZXJCeU5hbWUgPyBudWxsIDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJtYXRlcmlhbC1pY29uc1wiIHN0eWxlPXt7Zm9udFNpemU6JzE4cHgnLHZlcnRpY2FsQWxpZ246J2JvdHRvbSd9fT57b3JkZXJCeS5zdGFydHNXaXRoKCctJykgPyBcImFycm93X2Ryb3BfZG93blwiIDogXCJhcnJvd19kcm9wX3VwXCJ9PC9pPn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC90aD5cclxuICAgICAgICAgICAgICAgICAgICApKX08L3RyPjwvdGhlYWQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRib2R5PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7IHJlc3VsdHMubWFwKChyLGkpID0+IChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ciBrZXk9e2l9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtmaWVsZE5hbWVzLm1hcCgoZiwgaikgPT4gKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQga2V5PXtqfSB0aXRsZT17dGhpcy5yZW5kZXJWYWx1ZShnZXRGaWVsZChyLGYpKSB9IHN0eWxlPXtnZXRGaWVsZChmaWVsZFdpZHRocyxmKSA/IHsgbWF4V2lkdGg6IHBhcnNlSW50KGdldEZpZWxkKGZpZWxkV2lkdGhzLGYpKSB9IDoge319PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB0aGlzLmZvcm1hdFN0cmluZyh0aGlzLnJlbmRlclZhbHVlKGdldEZpZWxkKHIsZikpKSB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSkgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj4pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICkgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3Rib2R5PlxyXG4gICAgICAgICAgICAgICAgPC90YWJsZT4gICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gUmVzdWx0cztcclxuICAgIH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvUmVzdWx0cy50c3giLCJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7IHJlbmRlciB9IGZyb20gJ3JlYWN0LWRvbSc7XHJcbmltcG9ydCB7IExpbmsgfSBmcm9tICdyZWFjdC1yb3V0ZXItZG9tJztcclxuaW1wb3J0IHsgc3BsaXRPbkZpcnN0IH0gZnJvbSAnc2VydmljZXN0YWNrLWNsaWVudCc7XHJcblxyXG5pbXBvcnQgeyBCYXNlUGF0aCB9IGZyb20gJy4vc2hhcmVkJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNpZGViYXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQ8YW55LCBhbnk+IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzPywgY29udGV4dD8pIHtcclxuICAgICAgICBzdXBlcihwcm9wcywgY29udGV4dCk7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHsgZmlsdGVyOiB1bmRlZmluZWQgfTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVGaWx0ZXIoZSkge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBmaWx0ZXI6IGUudGFyZ2V0LnZhbHVlLnRvTG93ZXJDYXNlKCkgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVySWNvbihuYW1lKSB7XHJcbiAgICAgICAgdmFyIGljb25VcmwgPSB0aGlzLnByb3BzLnZpZXdlckFyZ3NbbmFtZV1bXCJJY29uVXJsXCJdO1xyXG4gICAgICAgIGlmIChpY29uVXJsKSB7XHJcbiAgICAgICAgICAgIGlmIChpY29uVXJsLnN0YXJ0c1dpdGgoJ21hdGVyaWFsLWljb25zOicpKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuICg8aSBjbGFzc05hbWU9XCJtYXRlcmlhbC1pY29uc1wiPntzcGxpdE9uRmlyc3QoaWNvblVybCwgJzonKVsxXX08L2k+KTtcclxuICAgICAgICAgICAgaWYgKGljb25Vcmwuc3RhcnRzV2l0aCgnb2N0aWNvbjonKSlcclxuICAgICAgICAgICAgICAgIHJldHVybiAoPHNwYW4gY2xhc3NOYW1lPXtcIm1lZ2Etb2N0aWNvbiBvY3RpY29uLVwiICsgc3BsaXRPbkZpcnN0KGljb25VcmwsICc6JylbMV19Pjwvc3Bhbj4pO1xyXG4gICAgICAgICAgICByZXR1cm4gKDxpbWcgc3JjPXtpY29uVXJsfSAvPik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAoPGkgY2xhc3NOYW1lPVwibWF0ZXJpYWwtaWNvbnNcIj5zZWFyY2g8L2k+KTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBpZD1cInNpZGViYXJcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5uZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPVwiYXEtZmlsdGVyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwiZmlsdGVyXCIgc3R5bGU9e3sgbWFyZ2luOiBcIjEwcHggMTVweFwiIH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17ZSA9PiB0aGlzLmhhbmRsZUZpbHRlcihlKX0gdmFsdWU9e3RoaXMuc3RhdGUuZmlsdGVyfSAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJhcS1saXN0XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtPYmplY3Qua2V5cyh0aGlzLnByb3BzLm9wZXJhdGlvbnMpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKG9wID0+IHRoaXMuc3RhdGUuZmlsdGVyID09IG51bGwgfHwgb3AudG9Mb3dlckNhc2UoKS5pbmRleE9mKHRoaXMuc3RhdGUuZmlsdGVyKSA+PSAwKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCgob3AsaSkgPT4gKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBrZXk9e2l9IGNsYXNzTmFtZT17XCJhcS1pdGVtXCIgKyAob3AgPT09IHRoaXMucHJvcHMubmFtZSA/IFwiIGFjdGl2ZVwiIDogXCJcIil9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLnJlbmRlckljb24ob3ApfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxMaW5rIHRvPXtCYXNlUGF0aCArIFwic3NfYWRtaW4vYXV0b3F1ZXJ5L1wiICsgb3B9Pnt0aGlzLnByb3BzLnZpZXdlckFyZ3Nbb3BdW1wiTmFtZVwiXSB8fCBvcH08L0xpbms+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgKSl9XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9TaWRlYmFyLnRzeCIsImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcIikodW5kZWZpbmVkKTtcbi8vIGltcG9ydHNcblxuXG4vLyBtb2R1bGVcbmV4cG9ydHMucHVzaChbbW9kdWxlLmlkLCBcImh0bWwsIGJvZHl7XFxyXFxuICBoZWlnaHQ6MTAwJTtcXHJcXG59XFxyXFxuYm9keSB7XFxyXFxuICAgIGZvbnQtZmFtaWx5OiAnUm9ib3RvJywgc2Fucy1zZXJpZjtcXHJcXG4gICAgbWFyZ2luOiAwO1xcclxcbiAgICBiYWNrZ3JvdW5kOiAjZWVlO1xcclxcbn1cXHJcXG5cXHJcXG5oMSwgaDIsIGgzLCBoNCwgaDUsIGg2LCBmb3JtIHtcXHJcXG4gICAgbWFyZ2luOiAwO1xcclxcbiAgICBwYWRkaW5nOiAwO1xcclxcbn1cXHJcXG5cXHJcXG5pbnB1dCwgc2VsZWN0LCBidXR0b24ge1xcclxcbiAgICBwYWRkaW5nOiA0cHggOHB4O1xcclxcbiAgICBtYXJnaW46IDAgNXB4IDAgMDtcXHJcXG59XFxyXFxuYSB7XFxyXFxuICAgIGNvbG9yOiAjNDI4YmNhO1xcclxcbn1cXHJcXG5cXHJcXG50YWJsZSB7XFxyXFxuICAgIG1hcmdpbjogMDtcXHJcXG4gICAgcGFkZGluZzogMDtcXHJcXG4gICAgYm9yZGVyLWNvbGxhcHNlOiBjb2xsYXBzZTtcXHJcXG59XFxyXFxudGFibGUucmVzdWx0cyB7XFxyXFxuICAgIC13ZWJraXQtYm94LXNoYWRvdzogMCAxcHggNHB4IDAgcmdiYSgwLDAsMCwwLjE0KTtcXHJcXG4gICAgICAgICAgICBib3gtc2hhZG93OiAwIDFweCA0cHggMCByZ2JhKDAsMCwwLDAuMTQpO1xcclxcbiAgICBiYWNrZ3JvdW5kOiAjZmVmZWZlO1xcclxcbn1cXHJcXG50YWJsZS5yZXN1bHRzIHRoIHtcXHJcXG4gICAgdGV4dC1hbGlnbjogbGVmdDtcXHJcXG4gICAgY29sb3I6ICM3NTc1NzU7XFxyXFxuICAgIGZvbnQtc2l6ZTogMTNweDtcXHJcXG4gICAgbGluZS1oZWlnaHQ6IDE4cHg7XFxyXFxuICAgIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAjZTBlMGUwO1xcclxcbiAgICBwYWRkaW5nOiA1cHg7XFxyXFxuICAgIG92ZXJmbG93OiBoaWRkZW47XFxyXFxuICAgIHdoaXRlLXNwYWNlOiBub3dyYXA7ICAgXFxyXFxufVxcclxcbnRhYmxlLnJlc3VsdHMgdGQge1xcclxcbiAgICBjb2xvcjogIzIxMjEyMTtcXHJcXG4gICAgZm9udC1zaXplOiAxMnB4O1xcclxcbiAgICBwYWRkaW5nOiA1cHg7XFxyXFxuICAgIG1heC13aWR0aDogMzAwcHg7XFxyXFxuICAgIG92ZXJmbG93OiBoaWRkZW47XFxyXFxuICAgIHdoaXRlLXNwYWNlOiBub3dyYXA7ICAgXFxyXFxuICAgIHRleHQtb3ZlcmZsb3c6IGVsbGlwc2lzO1xcclxcbn1cXHJcXG5cXHJcXG4jYXBwIHtcXHJcXG4gICAgaGVpZ2h0OiAxMDAlO1xcclxcbn1cXHJcXG5cXHJcXG4ucmVzdWx0cy1ub25lIHtcXHJcXG4gICAgcGFkZGluZzogMTVweCAwO1xcclxcbn1cXHJcXG5cXHJcXG4jaGVhZGVyIHtcXHJcXG4gICAgei1pbmRleDogMjtcXHJcXG4gICAgYmFja2dyb3VuZDogI2ZmZjtcXHJcXG4gICAgY29sb3I6ICM2NzY3Njc7XFxyXFxuICAgIC13ZWJraXQtYm94LXNoYWRvdzogMCAxcHggOHB4IHJnYmEoMCwwLDAsLjMpO1xcclxcbiAgICAgICAgICAgIGJveC1zaGFkb3c6IDAgMXB4IDhweCByZ2JhKDAsMCwwLC4zKTtcXHJcXG4gICAgcG9zaXRpb246IGZpeGVkO1xcclxcbiAgICB3aWR0aDogMTAwJTtcXHJcXG4gICAgY29sb3I6ICM2NzY3Njc7XFxyXFxuICAgIHBhZGRpbmc6IDE1cHggMCAxNXB4IDE1cHg7XFxyXFxufVxcclxcbiAgICAjaGVhZGVyID4gKiwgI2hlYWRlci1jb250ZW50ID4gKiB7XFxyXFxuICAgICAgICBtYXJnaW46IGF1dG87XFxyXFxuICAgICAgICBwYWRkaW5nOiAwIDEwcHg7XFxyXFxuICAgIH1cXHJcXG4gICAgI2hlYWRlciB0YWJsZSB7XFxyXFxuICAgICAgICBtYXJnaW46IDA7XFxyXFxuICAgICAgICBib3JkZXItY29sbGFwc2U6IGNvbGxhcHNlO1xcclxcbiAgICB9XFxyXFxuICAgICNoZWFkZXIgdGQge1xcclxcbiAgICAgICAgaGVpZ2h0OiAzMHB4O1xcclxcbiAgICAgICAgcGFkZGluZzogMCAwIDAgMjBweDtcXHJcXG4gICAgfVxcclxcbiAgICAjaGVhZGVyIGgxLCAjaGVhZGVyIGgyIHtcXHJcXG4gICAgICAgIGZvbnQtc2l6ZTogMjBweDtcXHJcXG4gICAgICAgIGxpbmUtaGVpZ2h0OiA0MHB4O1xcclxcbiAgICB9XFxyXFxuXFxyXFxuI3R4dFNlYXJjaDpmb2N1cyB7XFxyXFxuICAgIG91dGxpbmU6IG5vbmU7XFxyXFxufVxcclxcblxcclxcbmZvcm06Zm9jdXMge1xcclxcbiAgICBib3JkZXI6IDFweCBzb2xpZCAjMzMzO1xcclxcbn1cXHJcXG5cXHJcXG4uc2VwZXJhdG9yIHtcXHJcXG4gICAgYmFja2dyb3VuZDogI2RkZDtcXHJcXG4gICAgd2lkdGg6IDFweDtcXHJcXG4gICAgaGVpZ2h0OiAzMHB4O1xcclxcbn1cXHJcXG5cXHJcXG4jYm9keSB7XFxyXFxufVxcclxcbiNib2R5IC5pbm5lciB7XFxyXFxufVxcclxcblxcclxcbiNzaWRlYmFyIHtcXHJcXG4gICAgei1pbmRleDogMTtcXHJcXG4gICAgYmFja2dyb3VuZDogI2VlZTtcXHJcXG4gICAgbWFyZ2luLWxlZnQ6IDA7XFxyXFxuICAgIC13ZWJraXQtdHJhbnNpdGlvbjogLjNzO1xcclxcbiAgICB0cmFuc2l0aW9uOiAuM3M7XFxyXFxuICAgIHdpZHRoOiAyNTBweDtcXHJcXG4gICAgaGVpZ2h0OiAxMDAlO1xcclxcbiAgICBwb3NpdGlvbjogZml4ZWQ7XFxyXFxuICAgIG92ZXJmbG93LXk6IGF1dG87XFxyXFxuICAgIG1pbi13aWR0aDogMjUwcHg7XFxyXFxuICAgIHBhZGRpbmc6IDA7XFxyXFxufVxcclxcbiAgICAjc2lkZWJhciAuaW5uZXIge1xcclxcbiAgICAgICAgcGFkZGluZzogOTBweCAwIDAgMDtcXHJcXG4gICAgfVxcclxcbiAgICAuaGlkZS1zaWRlYmFyICNzaWRlYmFyIHtcXHJcXG4gICAgICAgIG1hcmdpbi1sZWZ0OiAtMjUwcHg7XFxyXFxuICAgICAgICAtd2Via2l0LXRyYW5zaXRpb246IC4zcztcXHJcXG4gICAgICAgIHRyYW5zaXRpb246IC4zcztcXHJcXG4gICAgICAgIC13ZWJraXQtdHJhbnNpdGlvbi10aW1pbmctZnVuY3Rpb246IGVhc2Utb3V0O1xcclxcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uLXRpbWluZy1mdW5jdGlvbjogZWFzZS1vdXQ7XFxyXFxuICAgIH1cXHJcXG5cXHJcXG4jY29udGVudCB7XFxyXFxuICAgIHBhZGRpbmctbGVmdDogMjUwcHg7XFxyXFxufVxcclxcbi5oaWRlLXNpZGViYXIgI2NvbnRlbnQge1xcclxcbiAgICBwYWRkaW5nLWxlZnQ6IDA7XFxyXFxuICAgIC13ZWJraXQtdHJhbnNpdGlvbjogLjNzO1xcclxcbiAgICB0cmFuc2l0aW9uOiAuM3M7XFxyXFxuICAgIC13ZWJraXQtdHJhbnNpdGlvbi10aW1pbmctZnVuY3Rpb246IGVhc2Utb3V0O1xcclxcbiAgICAgICAgICAgIHRyYW5zaXRpb24tdGltaW5nLWZ1bmN0aW9uOiBlYXNlLW91dDtcXHJcXG59XFxyXFxuI2NvbnRlbnQgLmlubmVyIHtcXHJcXG4gICAgcGFkZGluZzogOTBweCAwIDIwcHggMjBweDtcXHJcXG59XFxyXFxuXFxyXFxuI3F1ZXJ5LXRpdGxlIHtcXHJcXG4gICAgei1pbmRleDogMjtcXHJcXG4gICAgY29sb3I6ICM3NTc1NzU7XFxyXFxuICAgIHBvc2l0aW9uOiBmaXhlZDtcXHJcXG4gICAgdG9wOiAyNXB4O1xcclxcbiAgICByaWdodDogMjVweDtcXHJcXG59XFxyXFxuXFxyXFxuLmFxLWl0ZW0ge1xcclxcbiAgICBkaXNwbGF5OiAtd2Via2l0LWJveDtcXHJcXG4gICAgZGlzcGxheTogLW1zLWZsZXhib3g7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGN1cnNvcjogcG9pbnRlcjtcXHJcXG4gICAgb3ZlcmZsb3c6IGhpZGRlbjtcXHJcXG4gICAgdGV4dC1vdmVyZmxvdzogZWxsaXBzaXM7XFxyXFxuICAgIHdoaXRlLXNwYWNlOiBub3dyYXA7XFxyXFxufVxcclxcbiAgICAuYXEtaXRlbSBpIHsgLyptYXRlcmlhbC1pY29uKi9cXHJcXG4gICAgICAgIGNvbG9yOiAjNzU3NTc1O1xcclxcbiAgICAgICAgbWFyZ2luOiBhdXRvO1xcclxcbiAgICAgICAgcGFkZGluZzogMCAxNXB4O1xcclxcbiAgICB9XFxyXFxuICAgIC5hcS1pdGVtIC5tZWdhLW9jdGljb24geyAvKm9jdGljb24qL1xcclxcbiAgICAgICAgZm9udC1zaXplOiAyNHB4O1xcclxcbiAgICAgICAgY29sb3I6ICM3NTc1NzU7XFxyXFxuICAgICAgICBwYWRkaW5nOiA0cHggMTZweDtcXHJcXG4gICAgICAgIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XFxyXFxuICAgIH1cXHJcXG4gICAgLmFxLWl0ZW0gaW1nIHtcXHJcXG4gICAgICAgIHdpZHRoOiAyNHB4O1xcclxcbiAgICAgICAgaGVpZ2h0OiAyNHB4O1xcclxcbiAgICAgICAgcGFkZGluZzogNHB4IDE0cHg7XFxyXFxuICAgICAgICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xcclxcbiAgICB9XFxyXFxuICAgIC5hcS1pdGVtIGEge1xcclxcbiAgICAgICAgZGlzcGxheTogYmxvY2s7XFxyXFxuICAgICAgICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XFxyXFxuICAgICAgICBjb2xvcjogcmdiYSgwLDAsMCwwLjg3KTtcXHJcXG4gICAgICAgIGxpbmUtaGVpZ2h0OiA0MHB4O1xcclxcbiAgICAgICAgZm9udC1zaXplOiAxNHB4O1xcclxcbiAgICAgICAgLXdlYmtpdC1ib3gtZmxleDogMTtcXHJcXG4gICAgICAgICAgICAtbXMtZmxleDogMTtcXHJcXG4gICAgICAgICAgICAgICAgZmxleDogMTtcXHJcXG4gICAgfVxcclxcbiAgICAuYXEtaXRlbS5hY3RpdmUsIC5hcS1pdGVtOmhvdmVyIHtcXHJcXG4gICAgICAgIGJhY2tncm91bmQ6ICNlN2U3ZTc7XFxyXFxuICAgIH1cXHJcXG4gICAgLmFxLWl0ZW0uYWN0aXZlIHtcXHJcXG4gICAgICAgIGNvbG9yOiAjMjcyNzI3O1xcclxcbiAgICB9XFxyXFxuXFxyXFxuLmZvcm1hdHMge1xcclxcbiAgICBwYWRkaW5nOiAwIDAgMCAxMHB4O1xcclxcbn1cXHJcXG4uZm9ybWF0cyBzcGFuIHtcXHJcXG4gICAgY29sb3I6ICM0MjhiY2E7XFxyXFxuICAgIHBhZGRpbmc6IDAgNXB4IDAgMDtcXHJcXG4gICAgZm9udC1zaXplOiAxMnB4O1xcclxcbiAgICBjdXJzb3I6IHBvaW50ZXI7XFxyXFxufVxcclxcbi5mb3JtYXRzIHNwYW4uYWN0aXZlIHtcXHJcXG4gICAgY29sb3I6ICMyMTIxMjE7XFxyXFxufVxcclxcbi5jb25kaXRpb25zIHtcXHJcXG4gICAgY29sb3I6ICM3NTc1NzU7XFxyXFxuICAgIGZvbnQtc2l6ZTogMTNweDtcXHJcXG4gICAgcGFkZGluZzogMTVweDtcXHJcXG4gICAgbGluZS1oZWlnaHQ6IDE4cHg7XFxyXFxuICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcXHJcXG59XFxyXFxuLmNvbmRpdGlvbnMgLm1hdGVyaWFsLWljb25zLCAucXVlcmllcyAubWF0ZXJpYWwtaWNvbnMge1xcclxcbiAgICBmb250LXNpemU6IDE2cHg7XFxyXFxuICAgIHZlcnRpY2FsLWFsaWduOiB0ZXh0LWJvdHRvbTtcXHJcXG59XFxyXFxuLnF1ZXJpZXMge1xcclxcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XFxyXFxuICAgIHZlcnRpY2FsLWFsaWduOiB0b3A7XFxyXFxuICAgIHBhZGRpbmc6IDEwcHg7XFxyXFxufVxcclxcbi5sbmsge1xcclxcbiAgICBjb2xvcjogIzQyOGJjYTtcXHJcXG4gICAgZm9udC1zaXplOiAxM3B4O1xcclxcbiAgICBjdXJzb3I6IHBvaW50ZXI7XFxyXFxuICAgIHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lO1xcclxcbn1cXHJcXG5cXHJcXG4ucGFnaW5nIGkge1xcclxcbiAgICB2ZXJ0aWNhbC1hbGlnbjogYm90dG9tO1xcclxcbn1cXHJcXG5cXHJcXG4uZGlhbG9nLXdyYXBwZXIgeyAgICBcXHJcXG4gICAgcG9zaXRpb246IGZpeGVkO1xcclxcbiAgICB0b3A6IDA7XFxyXFxuICAgIGxlZnQ6IDA7XFxyXFxuICAgIHdpZHRoOiAxMDAlO1xcclxcbiAgICBoZWlnaHQ6IDEwMCU7XFxyXFxuICAgIG92ZXJmbG93OiBoaWRkZW47XFxyXFxuICAgIHotaW5kZXg6IDI7XFxyXFxufVxcclxcbi5hY3RpdmUgLmRpYWxvZy13cmFwcGVyIHtcXHJcXG4gICAgYmFja2dyb3VuZDogcmdiYSgwLDAsMCwwLjEpO1xcclxcbiAgICAtd2Via2l0LXRyYW5zaXRpb246IC4xNXMgY3ViaWMtYmV6aWVyKDAuNCwwLjAsMC4yLDEpIC4xNXM7XFxyXFxuICAgIHRyYW5zaXRpb246IC4xNXMgY3ViaWMtYmV6aWVyKDAuNCwwLjAsMC4yLDEpIC4xNXM7XFxyXFxufVxcclxcblxcclxcbi5kaWFsb2cge1xcclxcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XFxyXFxuICAgIHRvcDogMTAwJTtcXHJcXG4gICAgbGVmdDogNTAlO1xcclxcbiAgICBoZWlnaHQ6IDUwJTtcXHJcXG4gICAgbWFyZ2luOiAwIDAgMCAtMzAwcHg7XFxyXFxuICAgIHdpZHRoOiA0NTBweDtcXHJcXG4gICAgYmFja2dyb3VuZDogI2ZmZjtcXHJcXG4gICAgLXdlYmtpdC1ib3gtc2hhZG93OiAwIDFweCA0cHggMCByZ2JhKDAsMCwwLDAuMTQpO1xcclxcbiAgICAgICAgICAgIGJveC1zaGFkb3c6IDAgMXB4IDRweCAwIHJnYmEoMCwwLDAsMC4xNCk7XFxyXFxuICAgIGJvcmRlci1yYWRpdXM6IDRweDtcXHJcXG4gICAgY29sb3I6ICM3NTc1NzU7XFxyXFxuICAgIGRpc3BsYXk6IC13ZWJraXQtYm94O1xcclxcbiAgICBkaXNwbGF5OiAtbXMtZmxleGJveDtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgLXdlYmtpdC1ib3gtb3JpZW50OiB2ZXJ0aWNhbDtcXHJcXG4gICAgLXdlYmtpdC1ib3gtZGlyZWN0aW9uOiBub3JtYWw7XFxyXFxuICAgICAgICAtbXMtZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXHJcXG4gICAgICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcclxcbn1cXHJcXG4uYWN0aXZlIC5kaWFsb2cge1xcclxcbiAgICB0b3A6IDI1JTtcXHJcXG4gICAgLXdlYmtpdC10cmFuc2l0aW9uOiAuMTVzIGN1YmljLWJlemllcigwLjQsMC4wLDAuMiwxKSAuMTVzO1xcclxcbiAgICB0cmFuc2l0aW9uOiAuMTVzIGN1YmljLWJlemllcigwLjQsMC4wLDAuMiwxKSAuMTVzO1xcclxcbn1cXHJcXG5cXHJcXG4uZGlhbG9nIHtcXHJcXG4gICAgcGFkZGluZzogMjBweDtcXHJcXG59XFxyXFxuLmRpYWxvZy1oZWFkZXIge1xcclxcbiAgICBoZWlnaHQ6IDYwcHg7XFxyXFxufVxcclxcbiAgICAuZGlhbG9nLWhlYWRlciBoMyB7XFxyXFxuICAgICAgICBjb2xvcjogIzIxMjEyMTtcXHJcXG4gICAgfVxcclxcblxcclxcbi5kaWFsb2ctYm9keSB7XFxyXFxuICAgIC13ZWJraXQtYm94LWZsZXg6IDE7XFxyXFxuICAgICAgICAtbXMtZmxleDogMTtcXHJcXG4gICAgICAgICAgICBmbGV4OiAxO1xcclxcbiAgICBvdmVyZmxvdy15OiBhdXRvO1xcclxcbn1cXHJcXG4uZGlhbG9nLWZvb3RlciB7XFxyXFxuICAgIGhlaWdodDogMzBweDtcXHJcXG59XFxyXFxuLmJ0blRleHQge1xcclxcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XFxyXFxuICAgIGNvbG9yOiAjNDI4NUY0O1xcclxcbiAgICBmb250LXdlaWdodDogYm9sZDtcXHJcXG4gICAgY3Vyc29yOiBwb2ludGVyO1xcclxcbn1cXHJcXG4uYnRuVGV4dCBzcGFuIHtcXHJcXG4gICAgZGlzcGxheTogYmxvY2s7XFxyXFxuICAgIHBhZGRpbmc6IDZweCAxMnB4O1xcclxcbiAgICBib3JkZXItcmFkaXVzOiAycHg7XFxyXFxufVxcclxcbi5idG5UZXh0OmhvdmVyIHNwYW4ge1xcclxcbiAgICBiYWNrZ3JvdW5kOiByZ2IoMjI3LCAyMzcsIDI1NCk7XFxyXFxuICAgIC13ZWJraXQtdHJhbnNpdGlvbjogLjNzO1xcclxcbiAgICB0cmFuc2l0aW9uOiAuM3M7XFxyXFxuICAgIC13ZWJraXQtdHJhbnNpdGlvbi10aW1pbmctZnVuY3Rpb246IGVhc2Utb3V0O1xcclxcbiAgICAgICAgICAgIHRyYW5zaXRpb24tdGltaW5nLWZ1bmN0aW9uOiBlYXNlLW91dDtcXHJcXG59XFxyXFxuXFxyXFxuLnNwaW4ge1xcclxcbiAgICB0cmFuc2Zvcm0tb3JpZ2luOiA1MCUgNTAlO1xcclxcbiAgICAtd2Via2l0LXRyYW5zZm9ybS1vcmlnaW46IDUwJSA1MCU7XFxyXFxuICAgIC13ZWJraXQtYW5pbWF0aW9uOnNwaW4gMXMgbGluZWFyIGluZmluaXRlO1xcclxcbiAgICBhbmltYXRpb246IHNwaW4gMXMgbGluZWFyIGluZmluaXRlXFxyXFxufVxcclxcblxcclxcbkAtd2Via2l0LWtleWZyYW1lcyBzcGluIHsgMTAwJSB7IC13ZWJraXQtdHJhbnNmb3JtOiByb3RhdGUoMzYwZGVnKTsgfSB9XFxyXFxuQGtleWZyYW1lcyBzcGluIHsgMTAwJSB7IC13ZWJraXQtdHJhbnNmb3JtOiByb3RhdGUoMzYwZGVnKTsgdHJhbnNmb3JtOnJvdGF0ZSgzNjBkZWcpOyB9IH1cXHJcXG5cXHJcXG46Oi13ZWJraXQtc2Nyb2xsYmFyIHtcXHJcXG4gICAgd2lkdGg6IDdweDtcXHJcXG4gICAgaGVpZ2h0OiA3cHg7XFxyXFxufVxcclxcbiBcXHJcXG46Oi13ZWJraXQtc2Nyb2xsYmFyLXRyYWNrIHtcXHJcXG4gICAgLXdlYmtpdC1ib3gtc2hhZG93OiBpbnNldCAwIDAgMnB4IHJnYmEoMCwwLDAsMC4zKTtcXHJcXG59XFxyXFxuIFxcclxcbjo6LXdlYmtpdC1zY3JvbGxiYXItdGh1bWIge1xcclxcbiAgYmFja2dyb3VuZC1jb2xvcjogZGFya2dyZXk7XFxyXFxuICBvdXRsaW5lOiAxcHggc29saWQgc2xhdGVncmV5O1xcclxcbn1cXHJcXG5cXHJcXG5cXHJcXG4ubm9zZWxlY3Qge1xcclxcbiAgLXdlYmtpdC10b3VjaC1jYWxsb3V0OiBub25lOyAvKiBpT1MgU2FmYXJpICovXFxyXFxuICAtd2Via2l0LXVzZXItc2VsZWN0OiBub25lOyAgIC8qIENocm9tZS9TYWZhcmkvT3BlcmEgKi9cXHJcXG4gIC1tb3otdXNlci1zZWxlY3Q6IG5vbmU7ICAgICAgLyogRmlyZWZveCAqL1xcclxcbiAgLW1zLXVzZXItc2VsZWN0OiBub25lOyAgICAgICAvKiBJRS9FZGdlICovXFxyXFxuICB1c2VyLXNlbGVjdDogbm9uZTsgICAgICAgICAgIC8qIG5vbi1wcmVmaXhlZCB2ZXJzaW9uLCBjdXJyZW50bHlcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm90IHN1cHBvcnRlZCBieSBhbnkgYnJvd3NlciAqL1xcclxcbn1cXHJcXG5cXHJcXG4vKiByb2JvdG8tcmVndWxhciAtIGxhdGluICovXFxyXFxuQGZvbnQtZmFjZSB7XFxyXFxuICAgIGZvbnQtZmFtaWx5OiAnUm9ib3RvJztcXHJcXG4gICAgZm9udC1zdHlsZTogbm9ybWFsO1xcclxcbiAgICBmb250LXdlaWdodDogNDAwO1xcclxcbiAgICBzcmM6IGxvY2FsKCdSb2JvdG8nKSwgbG9jYWwoJ1JvYm90by1SZWd1bGFyJyksIHVybChcIiArIHJlcXVpcmUoXCIuL2Fzc2V0cy9pbWcvcm9ib3RvL3JvYm90by12MTUtbGF0aW4tcmVndWxhci53b2ZmMlwiKSArIFwiKSBmb3JtYXQoJ3dvZmYyJyksIFxcclxcbiAgICB1cmwoXCIgKyByZXF1aXJlKFwiLi9hc3NldHMvaW1nL3JvYm90by9yb2JvdG8tdjE1LWxhdGluLXJlZ3VsYXIud29mZlwiKSArIFwiKSBmb3JtYXQoJ3dvZmYnKTsgLyogQ2hyb21lIDYrLCBGaXJlZm94IDMuNissIElFIDkrLCBTYWZhcmkgNS4xKyAqL1xcclxcbn1cXHJcXG5AZm9udC1mYWNlIHtcXHJcXG4gIGZvbnQtZmFtaWx5OiAnb2N0aWNvbnMnO1xcclxcbiAgc3JjOiB1cmwoXCIgKyByZXF1aXJlKFwiLi9hc3NldHMvaW1nL29jdGljb24vb2N0aWNvbnMud29mZlwiKSArIFwiKSBmb3JtYXQoJ3dvZmYnKSxcXHJcXG4gICAgICAgdXJsKFwiICsgcmVxdWlyZShcIi4vYXNzZXRzL2ltZy9vY3RpY29uL29jdGljb25zLnR0ZlwiKSArIFwiKSBmb3JtYXQoJ3RydWV0eXBlJyk7XFxyXFxuICBmb250LXdlaWdodDogbm9ybWFsO1xcclxcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xcclxcbn1cXHJcXG5cXHJcXG4vKlxcclxcbi5vY3RpY29uIGlzIG9wdGltaXplZCBmb3IgMTZweC5cXHJcXG4ubWVnYS1vY3RpY29uIGlzIG9wdGltaXplZCBmb3IgMzJweCBidXQgY2FuIGJlIHVzZWQgbGFyZ2VyLlxcclxcbiovXFxyXFxuLm9jdGljb24sIC5tZWdhLW9jdGljb24ge1xcclxcbiAgZm9udDogbm9ybWFsIG5vcm1hbCBub3JtYWwgMTZweC8xIG9jdGljb25zO1xcclxcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xcclxcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xcclxcbiAgdGV4dC1yZW5kZXJpbmc6IGF1dG87XFxyXFxuICAtd2Via2l0LWZvbnQtc21vb3RoaW5nOiBhbnRpYWxpYXNlZDtcXHJcXG4gIC1tb3otb3N4LWZvbnQtc21vb3RoaW5nOiBncmF5c2NhbGU7XFxyXFxuICAtd2Via2l0LXVzZXItc2VsZWN0OiBub25lO1xcclxcbiAgLW1vei11c2VyLXNlbGVjdDogbm9uZTtcXHJcXG4gIC1tcy11c2VyLXNlbGVjdDogbm9uZTtcXHJcXG4gIHVzZXItc2VsZWN0OiBub25lO1xcclxcbn1cXHJcXG4ubWVnYS1vY3RpY29uIHsgZm9udC1zaXplOiAzMnB4OyB9XFxyXFxuXFxyXFxuLm9jdGljb24tYWxlcnQ6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDJEJ30gLyog74CtICovXFxyXFxuLm9jdGljb24tYXJyb3ctZG93bjpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwM0YnfSAvKiDvgL8gKi9cXHJcXG4ub2N0aWNvbi1hcnJvdy1sZWZ0OmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA0MCd9IC8qIO+BgCAqL1xcclxcbi5vY3RpY29uLWFycm93LXJpZ2h0OmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAzRSd9IC8qIO+AviAqL1xcclxcbi5vY3RpY29uLWFycm93LXNtYWxsLWRvd246YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMEEwJ30gLyog74KgICovXFxyXFxuLm9jdGljb24tYXJyb3ctc21hbGwtbGVmdDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwQTEnfSAvKiDvgqEgKi9cXHJcXG4ub2N0aWNvbi1hcnJvdy1zbWFsbC1yaWdodDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNzEnfSAvKiDvgbEgKi9cXHJcXG4ub2N0aWNvbi1hcnJvdy1zbWFsbC11cDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwOUYnfSAvKiDvgp8gKi9cXHJcXG4ub2N0aWNvbi1hcnJvdy11cDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwM0QnfSAvKiDvgL0gKi9cXHJcXG4ub2N0aWNvbi1taWNyb3Njb3BlOmJlZm9yZSwgLm9jdGljb24tYmVha2VyOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjBERCd9IC8qIO+DnSAqL1xcclxcbi5vY3RpY29uLWJlbGw6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMERFJ30gLyog74OeICovXFxyXFxuLm9jdGljb24tYm9sZDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwRTInfSAvKiDvg6IgKi9cXHJcXG4ub2N0aWNvbi1ib29rOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAwNyd9IC8qIO+AhyAqL1xcclxcbi5vY3RpY29uLWJvb2ttYXJrOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA3Qid9IC8qIO+BuyAqL1xcclxcbi5vY3RpY29uLWJyaWVmY2FzZTpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwRDMnfSAvKiDvg5MgKi9cXHJcXG4ub2N0aWNvbi1icm9hZGNhc3Q6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDQ4J30gLyog74GIICovXFxyXFxuLm9jdGljb24tYnJvd3NlcjpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwQzUnfSAvKiDvg4UgKi9cXHJcXG4ub2N0aWNvbi1idWc6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDkxJ30gLyog74KRICovXFxyXFxuLm9jdGljb24tY2FsZW5kYXI6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDY4J30gLyog74GoICovXFxyXFxuLm9jdGljb24tY2hlY2s6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDNBJ30gLyog74C6ICovXFxyXFxuLm9jdGljb24tY2hlY2tsaXN0OmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA3Nid9IC8qIO+BtiAqL1xcclxcbi5vY3RpY29uLWNoZXZyb24tZG93bjpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwQTMnfSAvKiDvgqMgKi9cXHJcXG4ub2N0aWNvbi1jaGV2cm9uLWxlZnQ6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMEE0J30gLyog74KkICovXFxyXFxuLm9jdGljb24tY2hldnJvbi1yaWdodDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNzgnfSAvKiDvgbggKi9cXHJcXG4ub2N0aWNvbi1jaGV2cm9uLXVwOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjBBMid9IC8qIO+CoiAqL1xcclxcbi5vY3RpY29uLWNpcmNsZS1zbGFzaDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwODQnfSAvKiDvgoQgKi9cXHJcXG4ub2N0aWNvbi1jaXJjdWl0LWJvYXJkOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjBENid9IC8qIO+DliAqL1xcclxcbi5vY3RpY29uLWNsaXBweTpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMzUnfSAvKiDvgLUgKi9cXHJcXG4ub2N0aWNvbi1jbG9jazpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNDYnfSAvKiDvgYYgKi9cXHJcXG4ub2N0aWNvbi1jbG91ZC1kb3dubG9hZDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMEInfSAvKiDvgIsgKi9cXHJcXG4ub2N0aWNvbi1jbG91ZC11cGxvYWQ6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDBDJ30gLyog74CMICovXFxyXFxuLm9jdGljb24tY29kZTpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNUYnfSAvKiDvgZ8gKi9cXHJcXG4ub2N0aWNvbi1jb21tZW50LWFkZDpiZWZvcmUsIC5vY3RpY29uLWNvbW1lbnQ6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDJCJ30gLyog74CrICovXFxyXFxuLm9jdGljb24tY29tbWVudC1kaXNjdXNzaW9uOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA0Rid9IC8qIO+BjyAqL1xcclxcbi5vY3RpY29uLWNyZWRpdC1jYXJkOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA0NSd9IC8qIO+BhSAqL1xcclxcbi5vY3RpY29uLWRhc2g6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMENBJ30gLyog74OKICovXFxyXFxuLm9jdGljb24tZGFzaGJvYXJkOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA3RCd9IC8qIO+BvSAqL1xcclxcbi5vY3RpY29uLWRhdGFiYXNlOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA5Nid9IC8qIO+CliAqL1xcclxcbi5vY3RpY29uLWNsb25lOmJlZm9yZSwgLm9jdGljb24tZGVza3RvcC1kb3dubG9hZDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwREMnfSAvKiDvg5wgKi9cXHJcXG4ub2N0aWNvbi1kZXZpY2UtY2FtZXJhOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA1Nid9IC8qIO+BliAqL1xcclxcbi5vY3RpY29uLWRldmljZS1jYW1lcmEtdmlkZW86YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDU3J30gLyog74GXICovXFxyXFxuLm9jdGljb24tZGV2aWNlLWRlc2t0b3A6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMjdDJ30gLyog74m8ICovXFxyXFxuLm9jdGljb24tZGV2aWNlLW1vYmlsZTpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMzgnfSAvKiDvgLggKi9cXHJcXG4ub2N0aWNvbi1kaWZmOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA0RCd9IC8qIO+BjSAqL1xcclxcbi5vY3RpY29uLWRpZmYtYWRkZWQ6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDZCJ30gLyog74GrICovXFxyXFxuLm9jdGljb24tZGlmZi1pZ25vcmVkOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA5OSd9IC8qIO+CmSAqL1xcclxcbi5vY3RpY29uLWRpZmYtbW9kaWZpZWQ6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDZEJ30gLyog74GtICovXFxyXFxuLm9jdGljb24tZGlmZi1yZW1vdmVkOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA2Qyd9IC8qIO+BrCAqL1xcclxcbi5vY3RpY29uLWRpZmYtcmVuYW1lZDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNkUnfSAvKiDvga4gKi9cXHJcXG4ub2N0aWNvbi1lbGxpcHNpczpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwOUEnfSAvKiDvgpogKi9cXHJcXG4ub2N0aWNvbi1leWUtdW53YXRjaDpiZWZvcmUsIC5vY3RpY29uLWV5ZS13YXRjaDpiZWZvcmUsIC5vY3RpY29uLWV5ZTpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNEUnfSAvKiDvgY4gKi9cXHJcXG4ub2N0aWNvbi1maWxlLWJpbmFyeTpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwOTQnfSAvKiDvgpQgKi9cXHJcXG4ub2N0aWNvbi1maWxlLWNvZGU6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDEwJ30gLyog74CQICovXFxyXFxuLm9jdGljb24tZmlsZS1kaXJlY3Rvcnk6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDE2J30gLyog74CWICovXFxyXFxuLm9jdGljb24tZmlsZS1tZWRpYTpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMTInfSAvKiDvgJIgKi9cXHJcXG4ub2N0aWNvbi1maWxlLXBkZjpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMTQnfSAvKiDvgJQgKi9cXHJcXG4ub2N0aWNvbi1maWxlLXN1Ym1vZHVsZTpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMTcnfSAvKiDvgJcgKi9cXHJcXG4ub2N0aWNvbi1maWxlLXN5bWxpbmstZGlyZWN0b3J5OmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjBCMSd9IC8qIO+CsSAqL1xcclxcbi5vY3RpY29uLWZpbGUtc3ltbGluay1maWxlOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjBCMCd9IC8qIO+CsCAqL1xcclxcbi5vY3RpY29uLWZpbGUtdGV4dDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMTEnfSAvKiDvgJEgKi9cXHJcXG4ub2N0aWNvbi1maWxlLXppcDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMTMnfSAvKiDvgJMgKi9cXHJcXG4ub2N0aWNvbi1mbGFtZTpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwRDInfSAvKiDvg5IgKi9cXHJcXG4ub2N0aWNvbi1mb2xkOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjBDQyd9IC8qIO+DjCAqL1xcclxcbi5vY3RpY29uLWdlYXI6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDJGJ30gLyog74CvICovXFxyXFxuLm9jdGljb24tZ2lmdDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNDInfSAvKiDvgYIgKi9cXHJcXG4ub2N0aWNvbi1naXN0OmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAwRSd9IC8qIO+AjiAqL1xcclxcbi5vY3RpY29uLWdpc3Qtc2VjcmV0OmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA4Qyd9IC8qIO+CjCAqL1xcclxcbi5vY3RpY29uLWdpdC1icmFuY2gtY3JlYXRlOmJlZm9yZSwgLm9jdGljb24tZ2l0LWJyYW5jaC1kZWxldGU6YmVmb3JlLCAub2N0aWNvbi1naXQtYnJhbmNoOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAyMCd9IC8qIO+AoCAqL1xcclxcbi5vY3RpY29uLWdpdC1jb21taXQ6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDFGJ30gLyog74CfICovXFxyXFxuLm9jdGljb24tZ2l0LWNvbXBhcmU6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMEFDJ30gLyog74KsICovXFxyXFxuLm9jdGljb24tZ2l0LW1lcmdlOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAyMyd9IC8qIO+AoyAqL1xcclxcbi5vY3RpY29uLWdpdC1wdWxsLXJlcXVlc3QtYWJhbmRvbmVkOmJlZm9yZSwgLm9jdGljb24tZ2l0LXB1bGwtcmVxdWVzdDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMDknfSAvKiDvgIkgKi9cXHJcXG4ub2N0aWNvbi1nbG9iZTpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwQjYnfSAvKiDvgrYgKi9cXHJcXG4ub2N0aWNvbi1ncmFwaDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNDMnfSAvKiDvgYMgKi9cXHJcXG4ub2N0aWNvbi1oZWFydDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXDI2NjUnfSAvKiDimaUgKi9cXHJcXG4ub2N0aWNvbi1oaXN0b3J5OmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA3RSd9IC8qIO+BviAqL1xcclxcbi5vY3RpY29uLWhvbWU6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDhEJ30gLyog74KNICovXFxyXFxuLm9jdGljb24taG9yaXpvbnRhbC1ydWxlOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA3MCd9IC8qIO+BsCAqL1xcclxcbi5vY3RpY29uLWh1Ym90OmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA5RCd9IC8qIO+CnSAqL1xcclxcbi5vY3RpY29uLWluYm94OmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjBDRid9IC8qIO+DjyAqL1xcclxcbi5vY3RpY29uLWluZm86YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDU5J30gLyog74GZICovXFxyXFxuLm9jdGljb24taXNzdWUtY2xvc2VkOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAyOCd9IC8qIO+AqCAqL1xcclxcbi5vY3RpY29uLWlzc3VlLW9wZW5lZDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMjYnfSAvKiDvgKYgKi9cXHJcXG4ub2N0aWNvbi1pc3N1ZS1yZW9wZW5lZDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMjcnfSAvKiDvgKcgKi9cXHJcXG4ub2N0aWNvbi1pdGFsaWM6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMEU0J30gLyog74OkICovXFxyXFxuLm9jdGljb24tamVyc2V5OmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAxOSd9IC8qIO+AmSAqL1xcclxcbi5vY3RpY29uLWtleTpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNDknfSAvKiDvgYkgKi9cXHJcXG4ub2N0aWNvbi1rZXlib2FyZDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMEQnfSAvKiDvgI0gKi9cXHJcXG4ub2N0aWNvbi1sYXc6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMEQ4J30gLyog74OYICovXFxyXFxuLm9jdGljb24tbGlnaHQtYnVsYjpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMDAnfSAvKiDvgIAgKi9cXHJcXG4ub2N0aWNvbi1saW5rOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA1Qyd9IC8qIO+BnCAqL1xcclxcbi5vY3RpY29uLWxpbmstZXh0ZXJuYWw6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDdGJ30gLyog74G/ICovXFxyXFxuLm9jdGljb24tbGlzdC1vcmRlcmVkOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA2Mid9IC8qIO+BoiAqL1xcclxcbi5vY3RpY29uLWxpc3QtdW5vcmRlcmVkOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA2MSd9IC8qIO+BoSAqL1xcclxcbi5vY3RpY29uLWxvY2F0aW9uOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA2MCd9IC8qIO+BoCAqL1xcclxcbi5vY3RpY29uLWdpc3QtcHJpdmF0ZTpiZWZvcmUsIC5vY3RpY29uLW1pcnJvci1wcml2YXRlOmJlZm9yZSwgLm9jdGljb24tZ2l0LWZvcmstcHJpdmF0ZTpiZWZvcmUsIC5vY3RpY29uLWxvY2s6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDZBJ30gLyog74GqICovXFxyXFxuLm9jdGljb24tbG9nby1naXN0OmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjBBRCd9IC8qIO+CrSAqL1xcclxcbi5vY3RpY29uLWxvZ28tZ2l0aHViOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA5Mid9IC8qIO+CkiAqL1xcclxcbi5vY3RpY29uLW1haWw6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDNCJ30gLyog74C7ICovXFxyXFxuLm9jdGljb24tbWFpbC1yZWFkOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAzQyd9IC8qIO+AvCAqL1xcclxcbi5vY3RpY29uLW1haWwtcmVwbHk6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDUxJ30gLyog74GRICovXFxyXFxuLm9jdGljb24tbWFyay1naXRodWI6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDBBJ30gLyog74CKICovXFxyXFxuLm9jdGljb24tbWFya2Rvd246YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMEM5J30gLyog74OJICovXFxyXFxuLm9jdGljb24tbWVnYXBob25lOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA3Nyd9IC8qIO+BtyAqL1xcclxcbi5vY3RpY29uLW1lbnRpb246YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMEJFJ30gLyog74K+ICovXFxyXFxuLm9jdGljb24tbWlsZXN0b25lOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA3NSd9IC8qIO+BtSAqL1xcclxcbi5vY3RpY29uLW1pcnJvci1wdWJsaWM6YmVmb3JlLCAub2N0aWNvbi1taXJyb3I6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDI0J30gLyog74CkICovXFxyXFxuLm9jdGljb24tbW9ydGFyLWJvYXJkOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjBENyd9IC8qIO+DlyAqL1xcclxcbi5vY3RpY29uLW11dGU6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDgwJ30gLyog74KAICovXFxyXFxuLm9jdGljb24tbm8tbmV3bGluZTpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwOUMnfSAvKiDvgpwgKi9cXHJcXG4ub2N0aWNvbi1vY3RvZmFjZTpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMDgnfSAvKiDvgIggKi9cXHJcXG4ub2N0aWNvbi1vcmdhbml6YXRpb246YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDM3J30gLyog74C3ICovXFxyXFxuLm9jdGljb24tcGFja2FnZTpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwQzQnfSAvKiDvg4QgKi9cXHJcXG4ub2N0aWNvbi1wYWludGNhbjpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwRDEnfSAvKiDvg5EgKi9cXHJcXG4ub2N0aWNvbi1wZW5jaWw6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDU4J30gLyog74GYICovXFxyXFxuLm9jdGljb24tcGVyc29uLWFkZDpiZWZvcmUsIC5vY3RpY29uLXBlcnNvbi1mb2xsb3c6YmVmb3JlLCAub2N0aWNvbi1wZXJzb246YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDE4J30gLyog74CYICovXFxyXFxuLm9jdGljb24tcGluOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA0MSd9IC8qIO+BgSAqL1xcclxcbi5vY3RpY29uLXBsdWc6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMEQ0J30gLyog74OUICovXFxyXFxuLm9jdGljb24tcmVwby1jcmVhdGU6YmVmb3JlLCAub2N0aWNvbi1naXN0LW5ldzpiZWZvcmUsIC5vY3RpY29uLWZpbGUtZGlyZWN0b3J5LWNyZWF0ZTpiZWZvcmUsIC5vY3RpY29uLWZpbGUtYWRkOmJlZm9yZSwgLm9jdGljb24tcGx1czpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNUQnfSAvKiDvgZ0gKi9cXHJcXG4ub2N0aWNvbi1wcmltaXRpdmUtZG90OmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA1Mid9IC8qIO+BkiAqL1xcclxcbi5vY3RpY29uLXByaW1pdGl2ZS1zcXVhcmU6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDUzJ30gLyog74GTICovXFxyXFxuLm9jdGljb24tcHVsc2U6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDg1J30gLyog74KFICovXFxyXFxuLm9jdGljb24tcXVlc3Rpb246YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDJDJ30gLyog74CsICovXFxyXFxuLm9jdGljb24tcXVvdGU6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDYzJ30gLyog74GjICovXFxyXFxuLm9jdGljb24tcmFkaW8tdG93ZXI6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDMwJ30gLyog74CwICovXFxyXFxuLm9jdGljb24tcmVwby1kZWxldGU6YmVmb3JlLCAub2N0aWNvbi1yZXBvOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAwMSd9IC8qIO+AgSAqL1xcclxcbi5vY3RpY29uLXJlcG8tY2xvbmU6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDRDJ30gLyog74GMICovXFxyXFxuLm9jdGljb24tcmVwby1mb3JjZS1wdXNoOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA0QSd9IC8qIO+BiiAqL1xcclxcbi5vY3RpY29uLWdpc3QtZm9yazpiZWZvcmUsIC5vY3RpY29uLXJlcG8tZm9ya2VkOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAwMid9IC8qIO+AgiAqL1xcclxcbi5vY3RpY29uLXJlcG8tcHVsbDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMDYnfSAvKiDvgIYgKi9cXHJcXG4ub2N0aWNvbi1yZXBvLXB1c2g6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDA1J30gLyog74CFICovXFxyXFxuLm9jdGljb24tcm9ja2V0OmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAzMyd9IC8qIO+AsyAqL1xcclxcbi5vY3RpY29uLXJzczpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMzQnfSAvKiDvgLQgKi9cXHJcXG4ub2N0aWNvbi1ydWJ5OmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA0Nyd9IC8qIO+BhyAqL1xcclxcbi5vY3RpY29uLXNlYXJjaC1zYXZlOmJlZm9yZSwgLm9jdGljb24tc2VhcmNoOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAyRSd9IC8qIO+AriAqL1xcclxcbi5vY3RpY29uLXNlcnZlcjpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwOTcnfSAvKiDvgpcgKi9cXHJcXG4ub2N0aWNvbi1zZXR0aW5nczpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwN0MnfSAvKiDvgbwgKi9cXHJcXG4ub2N0aWNvbi1zaGllbGQ6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMEUxJ30gLyog74OhICovXFxyXFxuLm9jdGljb24tbG9nLWluOmJlZm9yZSwgLm9jdGljb24tc2lnbi1pbjpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMzYnfSAvKiDvgLYgKi9cXHJcXG4ub2N0aWNvbi1sb2ctb3V0OmJlZm9yZSwgLm9jdGljb24tc2lnbi1vdXQ6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDMyJ30gLyog74CyICovXFxyXFxuLm9jdGljb24tc21pbGV5OmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjBFNyd9IC8qIO+DpyAqL1xcclxcbi5vY3RpY29uLXNxdWlycmVsOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjBCMid9IC8qIO+CsiAqL1xcclxcbi5vY3RpY29uLXN0YXItYWRkOmJlZm9yZSwgLm9jdGljb24tc3Rhci1kZWxldGU6YmVmb3JlLCAub2N0aWNvbi1zdGFyOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAyQSd9IC8qIO+AqiAqL1xcclxcbi5vY3RpY29uLXN0b3A6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDhGJ30gLyog74KPICovXFxyXFxuLm9jdGljb24tcmVwby1zeW5jOmJlZm9yZSwgLm9jdGljb24tc3luYzpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwODcnfSAvKiDvgocgKi9cXHJcXG4ub2N0aWNvbi10YWctcmVtb3ZlOmJlZm9yZSwgLm9jdGljb24tdGFnLWFkZDpiZWZvcmUsIC5vY3RpY29uLXRhZzpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMTUnfSAvKiDvgJUgKi9cXHJcXG4ub2N0aWNvbi10YXNrbGlzdDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwRTUnfSAvKiDvg6UgKi9cXHJcXG4ub2N0aWNvbi10ZWxlc2NvcGU6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDg4J30gLyog74KIICovXFxyXFxuLm9jdGljb24tdGVybWluYWw6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMEM4J30gLyog74OIICovXFxyXFxuLm9jdGljb24tdGV4dC1zaXplOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjBFMyd9IC8qIO+DoyAqL1xcclxcbi5vY3RpY29uLXRocmVlLWJhcnM6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDVFJ30gLyog74GeICovXFxyXFxuLm9jdGljb24tdGh1bWJzZG93bjpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwREInfSAvKiDvg5sgKi9cXHJcXG4ub2N0aWNvbi10aHVtYnN1cDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwREEnfSAvKiDvg5ogKi9cXHJcXG4ub2N0aWNvbi10b29sczpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMzEnfSAvKiDvgLEgKi9cXHJcXG4ub2N0aWNvbi10cmFzaGNhbjpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwRDAnfSAvKiDvg5AgKi9cXHJcXG4ub2N0aWNvbi10cmlhbmdsZS1kb3duOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA1Qid9IC8qIO+BmyAqL1xcclxcbi5vY3RpY29uLXRyaWFuZ2xlLWxlZnQ6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDQ0J30gLyog74GEICovXFxyXFxuLm9jdGljb24tdHJpYW5nbGUtcmlnaHQ6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDVBJ30gLyog74GaICovXFxyXFxuLm9jdGljb24tdHJpYW5nbGUtdXA6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMEFBJ30gLyog74KqICovXFxyXFxuLm9jdGljb24tdW5mb2xkOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAzOSd9IC8qIO+AuSAqL1xcclxcbi5vY3RpY29uLXVubXV0ZTpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwQkEnfSAvKiDvgrogKi9cXHJcXG4ub2N0aWNvbi12ZXJpZmllZDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwRTYnfSAvKiDvg6YgKi9cXHJcXG4ub2N0aWNvbi12ZXJzaW9uczpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNjQnfSAvKiDvgaQgKi9cXHJcXG4ub2N0aWNvbi13YXRjaDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwRTAnfSAvKiDvg6AgKi9cXHJcXG4ub2N0aWNvbi1yZW1vdmUtY2xvc2U6YmVmb3JlLCAub2N0aWNvbi14OmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA4MSd9IC8qIO+CgSAqL1xcclxcbi5vY3RpY29uLXphcDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXDI2QTEnfSAvKiDimqEgKi9cXHJcXG5cXHJcXG5cXHJcXG5cIiwgXCJcIl0pO1xuXG4vLyBleHBvcnRzXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY3NzLWxvYWRlciEuL34vcG9zdGNzcy1sb2FkZXIvbGliP3tcInBsdWdpbnNcIjpbbnVsbCxudWxsXX0hLi9zcmMvYXBwLmNzc1xuLy8gbW9kdWxlIGlkID0gMTExXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcIikodW5kZWZpbmVkKTtcbi8vIGltcG9ydHNcblxuXG4vLyBtb2R1bGVcbmV4cG9ydHMucHVzaChbbW9kdWxlLmlkLCBcIkBmb250LWZhY2Uge1xcbiAgZm9udC1mYW1pbHk6ICdNYXRlcmlhbCBJY29ucyc7XFxuICBmb250LXN0eWxlOiBub3JtYWw7XFxuICBmb250LXdlaWdodDogNDAwO1xcbiAgc3JjOiB1cmwoXCIgKyByZXF1aXJlKFwiLi9NYXRlcmlhbEljb25zLVJlZ3VsYXIuZW90XCIpICsgXCIpOyAvKiBGb3IgSUU2LTggKi9cXG4gIHNyYzogbG9jYWwoJ01hdGVyaWFsIEljb25zJyksXFxuICAgICAgIGxvY2FsKCdNYXRlcmlhbEljb25zLVJlZ3VsYXInKSxcXG4gICAgICAgdXJsKFwiICsgcmVxdWlyZShcIi4vTWF0ZXJpYWxJY29ucy1SZWd1bGFyLndvZmYyXCIpICsgXCIpIGZvcm1hdCgnd29mZjInKSxcXG4gICAgICAgdXJsKFwiICsgcmVxdWlyZShcIi4vTWF0ZXJpYWxJY29ucy1SZWd1bGFyLndvZmZcIikgKyBcIikgZm9ybWF0KCd3b2ZmJyksXFxuICAgICAgIHVybChcIiArIHJlcXVpcmUoXCIuL01hdGVyaWFsSWNvbnMtUmVndWxhci50dGZcIikgKyBcIikgZm9ybWF0KCd0cnVldHlwZScpO1xcbn1cXG5cXG4ubWF0ZXJpYWwtaWNvbnMge1xcbiAgZm9udC1mYW1pbHk6ICdNYXRlcmlhbCBJY29ucyc7XFxuICBmb250LXdlaWdodDogbm9ybWFsO1xcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xcbiAgZm9udC1zaXplOiAyNHB4OyAgLyogUHJlZmVycmVkIGljb24gc2l6ZSAqL1xcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xcbiAgd2lkdGg6IDFlbTtcXG4gIGhlaWdodDogMWVtO1xcbiAgbGluZS1oZWlnaHQ6IDE7XFxuICB0ZXh0LXRyYW5zZm9ybTogbm9uZTtcXG4gIGxldHRlci1zcGFjaW5nOiBub3JtYWw7XFxuICB3b3JkLXdyYXA6IG5vcm1hbDtcXG4gIHdoaXRlLXNwYWNlOiBub3dyYXA7XFxuICBkaXJlY3Rpb246IGx0cjtcXG5cXG4gIC8qIFN1cHBvcnQgZm9yIGFsbCBXZWJLaXQgYnJvd3NlcnMuICovXFxuICAtd2Via2l0LWZvbnQtc21vb3RoaW5nOiBhbnRpYWxpYXNlZDtcXG4gIC8qIFN1cHBvcnQgZm9yIFNhZmFyaSBhbmQgQ2hyb21lLiAqL1xcbiAgdGV4dC1yZW5kZXJpbmc6IG9wdGltaXplTGVnaWJpbGl0eTtcXG5cXG4gIC8qIFN1cHBvcnQgZm9yIEZpcmVmb3guICovXFxuICAtbW96LW9zeC1mb250LXNtb290aGluZzogZ3JheXNjYWxlO1xcblxcbiAgLyogU3VwcG9ydCBmb3IgSUUuICovXFxuICAtd2Via2l0LWZvbnQtZmVhdHVyZS1zZXR0aW5nczogJ2xpZ2EnO1xcbiAgICAgICAgICBmb250LWZlYXR1cmUtc2V0dGluZ3M6ICdsaWdhJztcXG59XFxuXCIsIFwiXCJdKTtcblxuLy8gZXhwb3J0c1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2Nzcy1sb2FkZXIhLi9+L3Bvc3Rjc3MtbG9hZGVyL2xpYj97XCJwbHVnaW5zXCI6W251bGwsbnVsbF19IS4vc3JjL2Fzc2V0cy9pbWcvaWNvbmZvbnQvbWF0ZXJpYWwtaWNvbnMuY3NzXG4vLyBtb2R1bGUgaWQgPSAxMTJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1wiKSh1bmRlZmluZWQpO1xuLy8gaW1wb3J0c1xuXG5cbi8vIG1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiLypcXHJcXG4ub2N0aWNvbiBpcyBvcHRpbWl6ZWQgZm9yIDE2cHguXFxyXFxuLm1lZ2Etb2N0aWNvbiBpcyBvcHRpbWl6ZWQgZm9yIDMycHggYnV0IGNhbiBiZSB1c2VkIGxhcmdlci5cXHJcXG4qL1xcclxcbi5vY3RpY29uLCAubWVnYS1vY3RpY29uIHtcXHJcXG4gIGZvbnQ6IG5vcm1hbCBub3JtYWwgbm9ybWFsIDE2cHgvMSBvY3RpY29ucztcXHJcXG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcXHJcXG4gIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcXHJcXG4gIHRleHQtcmVuZGVyaW5nOiBhdXRvO1xcclxcbiAgLXdlYmtpdC1mb250LXNtb290aGluZzogYW50aWFsaWFzZWQ7XFxyXFxuICAtbW96LW9zeC1mb250LXNtb290aGluZzogZ3JheXNjYWxlO1xcclxcbiAgLXdlYmtpdC11c2VyLXNlbGVjdDogbm9uZTtcXHJcXG4gIC1tb3otdXNlci1zZWxlY3Q6IG5vbmU7XFxyXFxuICAtbXMtdXNlci1zZWxlY3Q6IG5vbmU7XFxyXFxuICB1c2VyLXNlbGVjdDogbm9uZTtcXHJcXG59XFxyXFxuLm1lZ2Etb2N0aWNvbiB7IGZvbnQtc2l6ZTogMzJweDsgfVxcclxcblxcclxcbi5vY3RpY29uLWFsZXJ0OmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAyRCd9IC8qIO+ArSAqL1xcclxcbi5vY3RpY29uLWFycm93LWRvd246YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDNGJ30gLyog74C/ICovXFxyXFxuLm9jdGljb24tYXJyb3ctbGVmdDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNDAnfSAvKiDvgYAgKi9cXHJcXG4ub2N0aWNvbi1hcnJvdy1yaWdodDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwM0UnfSAvKiDvgL4gKi9cXHJcXG4ub2N0aWNvbi1hcnJvdy1zbWFsbC1kb3duOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjBBMCd9IC8qIO+CoCAqL1xcclxcbi5vY3RpY29uLWFycm93LXNtYWxsLWxlZnQ6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMEExJ30gLyog74KhICovXFxyXFxuLm9jdGljb24tYXJyb3ctc21hbGwtcmlnaHQ6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDcxJ30gLyog74GxICovXFxyXFxuLm9jdGljb24tYXJyb3ctc21hbGwtdXA6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDlGJ30gLyog74KfICovXFxyXFxuLm9jdGljb24tYXJyb3ctdXA6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDNEJ30gLyog74C9ICovXFxyXFxuLm9jdGljb24tbWljcm9zY29wZTpiZWZvcmUsIC5vY3RpY29uLWJlYWtlcjpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwREQnfSAvKiDvg50gKi9cXHJcXG4ub2N0aWNvbi1iZWxsOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjBERSd9IC8qIO+DniAqL1xcclxcbi5vY3RpY29uLWJvbGQ6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMEUyJ30gLyog74OiICovXFxyXFxuLm9jdGljb24tYm9vazpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMDcnfSAvKiDvgIcgKi9cXHJcXG4ub2N0aWNvbi1ib29rbWFyazpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwN0InfSAvKiDvgbsgKi9cXHJcXG4ub2N0aWNvbi1icmllZmNhc2U6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMEQzJ30gLyog74OTICovXFxyXFxuLm9jdGljb24tYnJvYWRjYXN0OmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA0OCd9IC8qIO+BiCAqL1xcclxcbi5vY3RpY29uLWJyb3dzZXI6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMEM1J30gLyog74OFICovXFxyXFxuLm9jdGljb24tYnVnOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA5MSd9IC8qIO+CkSAqL1xcclxcbi5vY3RpY29uLWNhbGVuZGFyOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA2OCd9IC8qIO+BqCAqL1xcclxcbi5vY3RpY29uLWNoZWNrOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAzQSd9IC8qIO+AuiAqL1xcclxcbi5vY3RpY29uLWNoZWNrbGlzdDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNzYnfSAvKiDvgbYgKi9cXHJcXG4ub2N0aWNvbi1jaGV2cm9uLWRvd246YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMEEzJ30gLyog74KjICovXFxyXFxuLm9jdGljb24tY2hldnJvbi1sZWZ0OmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjBBNCd9IC8qIO+CpCAqL1xcclxcbi5vY3RpY29uLWNoZXZyb24tcmlnaHQ6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDc4J30gLyog74G4ICovXFxyXFxuLm9jdGljb24tY2hldnJvbi11cDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwQTInfSAvKiDvgqIgKi9cXHJcXG4ub2N0aWNvbi1jaXJjbGUtc2xhc2g6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDg0J30gLyog74KEICovXFxyXFxuLm9jdGljb24tY2lyY3VpdC1ib2FyZDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwRDYnfSAvKiDvg5YgKi9cXHJcXG4ub2N0aWNvbi1jbGlwcHk6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDM1J30gLyog74C1ICovXFxyXFxuLm9jdGljb24tY2xvY2s6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDQ2J30gLyog74GGICovXFxyXFxuLm9jdGljb24tY2xvdWQtZG93bmxvYWQ6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDBCJ30gLyog74CLICovXFxyXFxuLm9jdGljb24tY2xvdWQtdXBsb2FkOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAwQyd9IC8qIO+AjCAqL1xcclxcbi5vY3RpY29uLWNvZGU6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDVGJ30gLyog74GfICovXFxyXFxuLm9jdGljb24tY29tbWVudC1hZGQ6YmVmb3JlLCAub2N0aWNvbi1jb21tZW50OmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAyQid9IC8qIO+AqyAqL1xcclxcbi5vY3RpY29uLWNvbW1lbnQtZGlzY3Vzc2lvbjpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNEYnfSAvKiDvgY8gKi9cXHJcXG4ub2N0aWNvbi1jcmVkaXQtY2FyZDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNDUnfSAvKiDvgYUgKi9cXHJcXG4ub2N0aWNvbi1kYXNoOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjBDQSd9IC8qIO+DiiAqL1xcclxcbi5vY3RpY29uLWRhc2hib2FyZDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwN0QnfSAvKiDvgb0gKi9cXHJcXG4ub2N0aWNvbi1kYXRhYmFzZTpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwOTYnfSAvKiDvgpYgKi9cXHJcXG4ub2N0aWNvbi1jbG9uZTpiZWZvcmUsIC5vY3RpY29uLWRlc2t0b3AtZG93bmxvYWQ6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMERDJ30gLyog74OcICovXFxyXFxuLm9jdGljb24tZGV2aWNlLWNhbWVyYTpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNTYnfSAvKiDvgZYgKi9cXHJcXG4ub2N0aWNvbi1kZXZpY2UtY2FtZXJhLXZpZGVvOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA1Nyd9IC8qIO+BlyAqL1xcclxcbi5vY3RpY29uLWRldmljZS1kZXNrdG9wOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjI3Qyd9IC8qIO+JvCAqL1xcclxcbi5vY3RpY29uLWRldmljZS1tb2JpbGU6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDM4J30gLyog74C4ICovXFxyXFxuLm9jdGljb24tZGlmZjpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNEQnfSAvKiDvgY0gKi9cXHJcXG4ub2N0aWNvbi1kaWZmLWFkZGVkOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA2Qid9IC8qIO+BqyAqL1xcclxcbi5vY3RpY29uLWRpZmYtaWdub3JlZDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwOTknfSAvKiDvgpkgKi9cXHJcXG4ub2N0aWNvbi1kaWZmLW1vZGlmaWVkOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA2RCd9IC8qIO+BrSAqL1xcclxcbi5vY3RpY29uLWRpZmYtcmVtb3ZlZDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNkMnfSAvKiDvgawgKi9cXHJcXG4ub2N0aWNvbi1kaWZmLXJlbmFtZWQ6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDZFJ30gLyog74GuICovXFxyXFxuLm9jdGljb24tZWxsaXBzaXM6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDlBJ30gLyog74KaICovXFxyXFxuLm9jdGljb24tZXllLXVud2F0Y2g6YmVmb3JlLCAub2N0aWNvbi1leWUtd2F0Y2g6YmVmb3JlLCAub2N0aWNvbi1leWU6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDRFJ30gLyog74GOICovXFxyXFxuLm9jdGljb24tZmlsZS1iaW5hcnk6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDk0J30gLyog74KUICovXFxyXFxuLm9jdGljb24tZmlsZS1jb2RlOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAxMCd9IC8qIO+AkCAqL1xcclxcbi5vY3RpY29uLWZpbGUtZGlyZWN0b3J5OmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAxNid9IC8qIO+AliAqL1xcclxcbi5vY3RpY29uLWZpbGUtbWVkaWE6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDEyJ30gLyog74CSICovXFxyXFxuLm9jdGljb24tZmlsZS1wZGY6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDE0J30gLyog74CUICovXFxyXFxuLm9jdGljb24tZmlsZS1zdWJtb2R1bGU6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDE3J30gLyog74CXICovXFxyXFxuLm9jdGljb24tZmlsZS1zeW1saW5rLWRpcmVjdG9yeTpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwQjEnfSAvKiDvgrEgKi9cXHJcXG4ub2N0aWNvbi1maWxlLXN5bWxpbmstZmlsZTpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwQjAnfSAvKiDvgrAgKi9cXHJcXG4ub2N0aWNvbi1maWxlLXRleHQ6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDExJ30gLyog74CRICovXFxyXFxuLm9jdGljb24tZmlsZS16aXA6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDEzJ30gLyog74CTICovXFxyXFxuLm9jdGljb24tZmxhbWU6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMEQyJ30gLyog74OSICovXFxyXFxuLm9jdGljb24tZm9sZDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwQ0MnfSAvKiDvg4wgKi9cXHJcXG4ub2N0aWNvbi1nZWFyOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAyRid9IC8qIO+AryAqL1xcclxcbi5vY3RpY29uLWdpZnQ6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDQyJ30gLyog74GCICovXFxyXFxuLm9jdGljb24tZ2lzdDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMEUnfSAvKiDvgI4gKi9cXHJcXG4ub2N0aWNvbi1naXN0LXNlY3JldDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwOEMnfSAvKiDvgowgKi9cXHJcXG4ub2N0aWNvbi1naXQtYnJhbmNoLWNyZWF0ZTpiZWZvcmUsIC5vY3RpY29uLWdpdC1icmFuY2gtZGVsZXRlOmJlZm9yZSwgLm9jdGljb24tZ2l0LWJyYW5jaDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMjAnfSAvKiDvgKAgKi9cXHJcXG4ub2N0aWNvbi1naXQtY29tbWl0OmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAxRid9IC8qIO+AnyAqL1xcclxcbi5vY3RpY29uLWdpdC1jb21wYXJlOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjBBQyd9IC8qIO+CrCAqL1xcclxcbi5vY3RpY29uLWdpdC1tZXJnZTpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMjMnfSAvKiDvgKMgKi9cXHJcXG4ub2N0aWNvbi1naXQtcHVsbC1yZXF1ZXN0LWFiYW5kb25lZDpiZWZvcmUsIC5vY3RpY29uLWdpdC1wdWxsLXJlcXVlc3Q6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDA5J30gLyog74CJICovXFxyXFxuLm9jdGljb24tZ2xvYmU6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMEI2J30gLyog74K2ICovXFxyXFxuLm9jdGljb24tZ3JhcGg6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDQzJ30gLyog74GDICovXFxyXFxuLm9jdGljb24taGVhcnQ6YmVmb3JlIHsgY29udGVudDogJ1xcXFwyNjY1J30gLyog4pmlICovXFxyXFxuLm9jdGljb24taGlzdG9yeTpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwN0UnfSAvKiDvgb4gKi9cXHJcXG4ub2N0aWNvbi1ob21lOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA4RCd9IC8qIO+CjSAqL1xcclxcbi5vY3RpY29uLWhvcml6b250YWwtcnVsZTpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNzAnfSAvKiDvgbAgKi9cXHJcXG4ub2N0aWNvbi1odWJvdDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwOUQnfSAvKiDvgp0gKi9cXHJcXG4ub2N0aWNvbi1pbmJveDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwQ0YnfSAvKiDvg48gKi9cXHJcXG4ub2N0aWNvbi1pbmZvOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA1OSd9IC8qIO+BmSAqL1xcclxcbi5vY3RpY29uLWlzc3VlLWNsb3NlZDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMjgnfSAvKiDvgKggKi9cXHJcXG4ub2N0aWNvbi1pc3N1ZS1vcGVuZWQ6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDI2J30gLyog74CmICovXFxyXFxuLm9jdGljb24taXNzdWUtcmVvcGVuZWQ6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDI3J30gLyog74CnICovXFxyXFxuLm9jdGljb24taXRhbGljOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjBFNCd9IC8qIO+DpCAqL1xcclxcbi5vY3RpY29uLWplcnNleTpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMTknfSAvKiDvgJkgKi9cXHJcXG4ub2N0aWNvbi1rZXk6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDQ5J30gLyog74GJICovXFxyXFxuLm9jdGljb24ta2V5Ym9hcmQ6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDBEJ30gLyog74CNICovXFxyXFxuLm9jdGljb24tbGF3OmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjBEOCd9IC8qIO+DmCAqL1xcclxcbi5vY3RpY29uLWxpZ2h0LWJ1bGI6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDAwJ30gLyog74CAICovXFxyXFxuLm9jdGljb24tbGluazpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNUMnfSAvKiDvgZwgKi9cXHJcXG4ub2N0aWNvbi1saW5rLWV4dGVybmFsOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA3Rid9IC8qIO+BvyAqL1xcclxcbi5vY3RpY29uLWxpc3Qtb3JkZXJlZDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNjInfSAvKiDvgaIgKi9cXHJcXG4ub2N0aWNvbi1saXN0LXVub3JkZXJlZDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNjEnfSAvKiDvgaEgKi9cXHJcXG4ub2N0aWNvbi1sb2NhdGlvbjpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNjAnfSAvKiDvgaAgKi9cXHJcXG4ub2N0aWNvbi1naXN0LXByaXZhdGU6YmVmb3JlLCAub2N0aWNvbi1taXJyb3ItcHJpdmF0ZTpiZWZvcmUsIC5vY3RpY29uLWdpdC1mb3JrLXByaXZhdGU6YmVmb3JlLCAub2N0aWNvbi1sb2NrOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA2QSd9IC8qIO+BqiAqL1xcclxcbi5vY3RpY29uLWxvZ28tZ2lzdDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwQUQnfSAvKiDvgq0gKi9cXHJcXG4ub2N0aWNvbi1sb2dvLWdpdGh1YjpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwOTInfSAvKiDvgpIgKi9cXHJcXG4ub2N0aWNvbi1tYWlsOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAzQid9IC8qIO+AuyAqL1xcclxcbi5vY3RpY29uLW1haWwtcmVhZDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwM0MnfSAvKiDvgLwgKi9cXHJcXG4ub2N0aWNvbi1tYWlsLXJlcGx5OmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA1MSd9IC8qIO+BkSAqL1xcclxcbi5vY3RpY29uLW1hcmstZ2l0aHViOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAwQSd9IC8qIO+AiiAqL1xcclxcbi5vY3RpY29uLW1hcmtkb3duOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjBDOSd9IC8qIO+DiSAqL1xcclxcbi5vY3RpY29uLW1lZ2FwaG9uZTpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNzcnfSAvKiDvgbcgKi9cXHJcXG4ub2N0aWNvbi1tZW50aW9uOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjBCRSd9IC8qIO+CviAqL1xcclxcbi5vY3RpY29uLW1pbGVzdG9uZTpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNzUnfSAvKiDvgbUgKi9cXHJcXG4ub2N0aWNvbi1taXJyb3ItcHVibGljOmJlZm9yZSwgLm9jdGljb24tbWlycm9yOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAyNCd9IC8qIO+ApCAqL1xcclxcbi5vY3RpY29uLW1vcnRhci1ib2FyZDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwRDcnfSAvKiDvg5cgKi9cXHJcXG4ub2N0aWNvbi1tdXRlOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA4MCd9IC8qIO+CgCAqL1xcclxcbi5vY3RpY29uLW5vLW5ld2xpbmU6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDlDJ30gLyog74KcICovXFxyXFxuLm9jdGljb24tb2N0b2ZhY2U6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDA4J30gLyog74CIICovXFxyXFxuLm9jdGljb24tb3JnYW5pemF0aW9uOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAzNyd9IC8qIO+AtyAqL1xcclxcbi5vY3RpY29uLXBhY2thZ2U6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMEM0J30gLyog74OEICovXFxyXFxuLm9jdGljb24tcGFpbnRjYW46YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMEQxJ30gLyog74ORICovXFxyXFxuLm9jdGljb24tcGVuY2lsOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA1OCd9IC8qIO+BmCAqL1xcclxcbi5vY3RpY29uLXBlcnNvbi1hZGQ6YmVmb3JlLCAub2N0aWNvbi1wZXJzb24tZm9sbG93OmJlZm9yZSwgLm9jdGljb24tcGVyc29uOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAxOCd9IC8qIO+AmCAqL1xcclxcbi5vY3RpY29uLXBpbjpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNDEnfSAvKiDvgYEgKi9cXHJcXG4ub2N0aWNvbi1wbHVnOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjBENCd9IC8qIO+DlCAqL1xcclxcbi5vY3RpY29uLXJlcG8tY3JlYXRlOmJlZm9yZSwgLm9jdGljb24tZ2lzdC1uZXc6YmVmb3JlLCAub2N0aWNvbi1maWxlLWRpcmVjdG9yeS1jcmVhdGU6YmVmb3JlLCAub2N0aWNvbi1maWxlLWFkZDpiZWZvcmUsIC5vY3RpY29uLXBsdXM6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDVEJ30gLyog74GdICovXFxyXFxuLm9jdGljb24tcHJpbWl0aXZlLWRvdDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNTInfSAvKiDvgZIgKi9cXHJcXG4ub2N0aWNvbi1wcmltaXRpdmUtc3F1YXJlOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA1Myd9IC8qIO+BkyAqL1xcclxcbi5vY3RpY29uLXB1bHNlOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA4NSd9IC8qIO+ChSAqL1xcclxcbi5vY3RpY29uLXF1ZXN0aW9uOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAyQyd9IC8qIO+ArCAqL1xcclxcbi5vY3RpY29uLXF1b3RlOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA2Myd9IC8qIO+BoyAqL1xcclxcbi5vY3RpY29uLXJhZGlvLXRvd2VyOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAzMCd9IC8qIO+AsCAqL1xcclxcbi5vY3RpY29uLXJlcG8tZGVsZXRlOmJlZm9yZSwgLm9jdGljb24tcmVwbzpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMDEnfSAvKiDvgIEgKi9cXHJcXG4ub2N0aWNvbi1yZXBvLWNsb25lOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA0Qyd9IC8qIO+BjCAqL1xcclxcbi5vY3RpY29uLXJlcG8tZm9yY2UtcHVzaDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNEEnfSAvKiDvgYogKi9cXHJcXG4ub2N0aWNvbi1naXN0LWZvcms6YmVmb3JlLCAub2N0aWNvbi1yZXBvLWZvcmtlZDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMDInfSAvKiDvgIIgKi9cXHJcXG4ub2N0aWNvbi1yZXBvLXB1bGw6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDA2J30gLyog74CGICovXFxyXFxuLm9jdGljb24tcmVwby1wdXNoOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAwNSd9IC8qIO+AhSAqL1xcclxcbi5vY3RpY29uLXJvY2tldDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMzMnfSAvKiDvgLMgKi9cXHJcXG4ub2N0aWNvbi1yc3M6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDM0J30gLyog74C0ICovXFxyXFxuLm9jdGljb24tcnVieTpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNDcnfSAvKiDvgYcgKi9cXHJcXG4ub2N0aWNvbi1zZWFyY2gtc2F2ZTpiZWZvcmUsIC5vY3RpY29uLXNlYXJjaDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMkUnfSAvKiDvgK4gKi9cXHJcXG4ub2N0aWNvbi1zZXJ2ZXI6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDk3J30gLyog74KXICovXFxyXFxuLm9jdGljb24tc2V0dGluZ3M6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDdDJ30gLyog74G8ICovXFxyXFxuLm9jdGljb24tc2hpZWxkOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjBFMSd9IC8qIO+DoSAqL1xcclxcbi5vY3RpY29uLWxvZy1pbjpiZWZvcmUsIC5vY3RpY29uLXNpZ24taW46YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDM2J30gLyog74C2ICovXFxyXFxuLm9jdGljb24tbG9nLW91dDpiZWZvcmUsIC5vY3RpY29uLXNpZ24tb3V0OmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAzMid9IC8qIO+AsiAqL1xcclxcbi5vY3RpY29uLXNtaWxleTpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwRTcnfSAvKiDvg6cgKi9cXHJcXG4ub2N0aWNvbi1zcXVpcnJlbDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwQjInfSAvKiDvgrIgKi9cXHJcXG4ub2N0aWNvbi1zdGFyLWFkZDpiZWZvcmUsIC5vY3RpY29uLXN0YXItZGVsZXRlOmJlZm9yZSwgLm9jdGljb24tc3RhcjpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMkEnfSAvKiDvgKogKi9cXHJcXG4ub2N0aWNvbi1zdG9wOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA4Rid9IC8qIO+CjyAqL1xcclxcbi5vY3RpY29uLXJlcG8tc3luYzpiZWZvcmUsIC5vY3RpY29uLXN5bmM6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDg3J30gLyog74KHICovXFxyXFxuLm9jdGljb24tdGFnLXJlbW92ZTpiZWZvcmUsIC5vY3RpY29uLXRhZy1hZGQ6YmVmb3JlLCAub2N0aWNvbi10YWc6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDE1J30gLyog74CVICovXFxyXFxuLm9jdGljb24tdGFza2xpc3Q6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMEU1J30gLyog74OlICovXFxyXFxuLm9jdGljb24tdGVsZXNjb3BlOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA4OCd9IC8qIO+CiCAqL1xcclxcbi5vY3RpY29uLXRlcm1pbmFsOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjBDOCd9IC8qIO+DiCAqL1xcclxcbi5vY3RpY29uLXRleHQtc2l6ZTpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwRTMnfSAvKiDvg6MgKi9cXHJcXG4ub2N0aWNvbi10aHJlZS1iYXJzOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA1RSd9IC8qIO+BniAqL1xcclxcbi5vY3RpY29uLXRodW1ic2Rvd246YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMERCJ30gLyog74ObICovXFxyXFxuLm9jdGljb24tdGh1bWJzdXA6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMERBJ30gLyog74OaICovXFxyXFxuLm9jdGljb24tdG9vbHM6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDMxJ30gLyog74CxICovXFxyXFxuLm9jdGljb24tdHJhc2hjYW46YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMEQwJ30gLyog74OQICovXFxyXFxuLm9jdGljb24tdHJpYW5nbGUtZG93bjpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNUInfSAvKiDvgZsgKi9cXHJcXG4ub2N0aWNvbi10cmlhbmdsZS1sZWZ0OmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA0NCd9IC8qIO+BhCAqL1xcclxcbi5vY3RpY29uLXRyaWFuZ2xlLXJpZ2h0OmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA1QSd9IC8qIO+BmiAqL1xcclxcbi5vY3RpY29uLXRyaWFuZ2xlLXVwOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjBBQSd9IC8qIO+CqiAqL1xcclxcbi5vY3RpY29uLXVuZm9sZDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMzknfSAvKiDvgLkgKi9cXHJcXG4ub2N0aWNvbi11bm11dGU6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMEJBJ30gLyog74K6ICovXFxyXFxuLm9jdGljb24tdmVyaWZpZWQ6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMEU2J30gLyog74OmICovXFxyXFxuLm9jdGljb24tdmVyc2lvbnM6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDY0J30gLyog74GkICovXFxyXFxuLm9jdGljb24td2F0Y2g6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMEUwJ30gLyog74OgICovXFxyXFxuLm9jdGljb24tcmVtb3ZlLWNsb3NlOmJlZm9yZSwgLm9jdGljb24teDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwODEnfSAvKiDvgoEgKi9cXHJcXG4ub2N0aWNvbi16YXA6YmVmb3JlIHsgY29udGVudDogJ1xcXFwyNkExJ30gLyog4pqhICovXFxyXFxuXFxyXFxuXFxyXFxuXCIsIFwiXCJdKTtcblxuLy8gZXhwb3J0c1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2Nzcy1sb2FkZXIhLi9+L3Bvc3Rjc3MtbG9hZGVyL2xpYj97XCJwbHVnaW5zXCI6W251bGwsbnVsbF19IS4vc3JjL2Fzc2V0cy9pbWcvb2N0aWNvbi9vY3RpY29uLmNzc1xuLy8gbW9kdWxlIGlkID0gMTEzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gX193ZWJwYWNrX3B1YmxpY19wYXRoX18gKyBcImltZy9NYXRlcmlhbEljb25zLVJlZ3VsYXIuZW90XCI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvYXNzZXRzL2ltZy9pY29uZm9udC9NYXRlcmlhbEljb25zLVJlZ3VsYXIuZW90XG4vLyBtb2R1bGUgaWQgPSAxMTRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyArIFwiaW1nL01hdGVyaWFsSWNvbnMtUmVndWxhci50dGZcIjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9hc3NldHMvaW1nL2ljb25mb250L01hdGVyaWFsSWNvbnMtUmVndWxhci50dGZcbi8vIG1vZHVsZSBpZCA9IDExNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IF9fd2VicGFja19wdWJsaWNfcGF0aF9fICsgXCJpbWcvTWF0ZXJpYWxJY29ucy1SZWd1bGFyLndvZmZcIjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9hc3NldHMvaW1nL2ljb25mb250L01hdGVyaWFsSWNvbnMtUmVndWxhci53b2ZmXG4vLyBtb2R1bGUgaWQgPSAxMTZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyArIFwiaW1nL01hdGVyaWFsSWNvbnMtUmVndWxhci53b2ZmMlwiO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2Fzc2V0cy9pbWcvaWNvbmZvbnQvTWF0ZXJpYWxJY29ucy1SZWd1bGFyLndvZmYyXG4vLyBtb2R1bGUgaWQgPSAxMTdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyArIFwiaW1nL29jdGljb25zLnR0ZlwiO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2Fzc2V0cy9pbWcvb2N0aWNvbi9vY3RpY29ucy50dGZcbi8vIG1vZHVsZSBpZCA9IDExOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IF9fd2VicGFja19wdWJsaWNfcGF0aF9fICsgXCJpbWcvb2N0aWNvbnMud29mZlwiO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2Fzc2V0cy9pbWcvb2N0aWNvbi9vY3RpY29ucy53b2ZmXG4vLyBtb2R1bGUgaWQgPSAxMTlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyArIFwiaW1nL3JvYm90by12MTUtbGF0aW4tcmVndWxhci53b2ZmXCI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvYXNzZXRzL2ltZy9yb2JvdG8vcm9ib3RvLXYxNS1sYXRpbi1yZWd1bGFyLndvZmZcbi8vIG1vZHVsZSBpZCA9IDEyMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IF9fd2VicGFja19wdWJsaWNfcGF0aF9fICsgXCJpbWcvcm9ib3RvLXYxNS1sYXRpbi1yZWd1bGFyLndvZmYyXCI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvYXNzZXRzL2ltZy9yb2JvdG8vcm9ib3RvLXYxNS1sYXRpbi1yZWd1bGFyLndvZmYyXG4vLyBtb2R1bGUgaWQgPSAxMjFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgSnNvblNlcnZpY2VDbGllbnQsIHNhbml0aXplIH0gZnJvbSAnc2VydmljZXN0YWNrLWNsaWVudCc7XHJcblxyXG5kZWNsYXJlIHZhciBnbG9iYWw7IC8vcG9wdWxhdGVkIGZyb20gcGFja2FnZS5qc29uL2plc3RcclxuXHJcbmV4cG9ydCB2YXIgQmFzZVBhdGggPSBsb2NhdGlvbi5wYXRobmFtZS5zdWJzdHJpbmcoMCwgbG9jYXRpb24ucGF0aG5hbWUuaW5kZXhPZihcIi9zc19hZG1pblwiKSArIDEpO1xyXG5cclxuZXhwb3J0IHZhciBjbGllbnQgPSBuZXcgSnNvblNlcnZpY2VDbGllbnQoZ2xvYmFsLkJhc2VVcmwgfHwgQmFzZVBhdGgpO1xyXG5cclxuZXhwb3J0IGNvbnN0IG5vcm1hbGl6ZUtleSA9IChrZXk6IHN0cmluZykgPT4ga2V5LnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvXy9nLCAnJyk7XHJcblxyXG5jb25zdCBpc0FycmF5ID0gKG86IGFueSkgPT4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG8pID09PSAnW29iamVjdCBBcnJheV0nO1xyXG5cclxuY29uc3QgbG9nID0gKG86IGFueSkgPT4geyBjb25zb2xlLmxvZyhvLCB0eXBlb2YobykpOyByZXR1cm4gbzsgfVxyXG5cclxuZXhwb3J0IGNvbnN0IG5vcm1hbGl6ZSA9IChkdG86IGFueSwgZGVlcD86IGJvb2xlYW4pID0+IHtcclxuICAgIGlmIChkdG8gPT0gbnVsbClcclxuICAgICAgICByZXR1cm4gZHRvO1xyXG4gICAgaWYgKGlzQXJyYXkoZHRvKSkge1xyXG4gICAgICAgIGlmICghZGVlcCkgcmV0dXJuIGR0bztcclxuICAgICAgICBjb25zdCB0byA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZHRvLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRvW2ldID0gbm9ybWFsaXplKGR0b1tpXSwgZGVlcCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0bztcclxuICAgIH1cclxuICAgIGlmICh0eXBlb2YgZHRvICE9IFwib2JqZWN0XCIpIHJldHVybiBkdG87XHJcbiAgICBjb25zdCBvID0ge307XHJcbiAgICBmb3IgKGxldCBrIGluIGR0bykge1xyXG4gICAgICAgIG9bbm9ybWFsaXplS2V5KGspXSA9IGRlZXAgPyBub3JtYWxpemUoZHRvW2tdLCBkZWVwKSA6IGR0b1trXTtcclxuICAgIH1cclxuICAgIHJldHVybiBvO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0RmllbGQgPSAobzogYW55LCBuYW1lOiBzdHJpbmcpID0+XHJcbiAgICBvID09IG51bGwgfHwgbmFtZSA9PSBudWxsID8gbnVsbCA6XHJcbiAgICAgICAgb1tuYW1lXSB8fFxyXG4gICAgICAgIG9bT2JqZWN0LmtleXMobykuZmlsdGVyKGsgPT4gbm9ybWFsaXplS2V5KGspID09PSBub3JtYWxpemVLZXkobmFtZSkpWzBdIHx8ICcnXTtcclxuXHJcbmV4cG9ydCBjb25zdCBwYXJzZVJlc3BvbnNlU3RhdHVzID0gKGpzb24sIGRlZmF1bHRNc2c9bnVsbCkgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICBjb25zdCBlcnIgPSBKU09OLnBhcnNlKGpzb24pO1xyXG4gICAgICAgIHJldHVybiBzYW5pdGl6ZShlcnIuUmVzcG9uc2VTdGF0dXMgfHwgZXJyLnJlc3BvbnNlU3RhdHVzKTtcclxuICAgIH0gY2F0Y2ggKGUpIHtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBtZXNzYWdlOiBkZWZhdWx0TXNnLFxyXG4gICAgICAgICAgICBfX2Vycm9yOiB7IGVycm9yOiBlLCBqc29uOiBqc29uIH1cclxuICAgICAgICB9O1xyXG4gICAgfVxyXG59O1xuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9zaGFyZWQudHN4IiwiXG4vKipcbiAqIFdoZW4gc291cmNlIG1hcHMgYXJlIGVuYWJsZWQsIGBzdHlsZS1sb2FkZXJgIHVzZXMgYSBsaW5rIGVsZW1lbnQgd2l0aCBhIGRhdGEtdXJpIHRvXG4gKiBlbWJlZCB0aGUgY3NzIG9uIHRoZSBwYWdlLiBUaGlzIGJyZWFrcyBhbGwgcmVsYXRpdmUgdXJscyBiZWNhdXNlIG5vdyB0aGV5IGFyZSByZWxhdGl2ZSB0byBhXG4gKiBidW5kbGUgaW5zdGVhZCBvZiB0aGUgY3VycmVudCBwYWdlLlxuICpcbiAqIE9uZSBzb2x1dGlvbiBpcyB0byBvbmx5IHVzZSBmdWxsIHVybHMsIGJ1dCB0aGF0IG1heSBiZSBpbXBvc3NpYmxlLlxuICpcbiAqIEluc3RlYWQsIHRoaXMgZnVuY3Rpb24gXCJmaXhlc1wiIHRoZSByZWxhdGl2ZSB1cmxzIHRvIGJlIGFic29sdXRlIGFjY29yZGluZyB0byB0aGUgY3VycmVudCBwYWdlIGxvY2F0aW9uLlxuICpcbiAqIEEgcnVkaW1lbnRhcnkgdGVzdCBzdWl0ZSBpcyBsb2NhdGVkIGF0IGB0ZXN0L2ZpeFVybHMuanNgIGFuZCBjYW4gYmUgcnVuIHZpYSB0aGUgYG5wbSB0ZXN0YCBjb21tYW5kLlxuICpcbiAqL1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uIChjc3MpIHtcbiAgLy8gZ2V0IGN1cnJlbnQgbG9jYXRpb25cbiAgdmFyIGxvY2F0aW9uID0gdHlwZW9mIHdpbmRvdyAhPT0gXCJ1bmRlZmluZWRcIiAmJiB3aW5kb3cubG9jYXRpb247XG5cbiAgaWYgKCFsb2NhdGlvbikge1xuICAgIHRocm93IG5ldyBFcnJvcihcImZpeFVybHMgcmVxdWlyZXMgd2luZG93LmxvY2F0aW9uXCIpO1xuICB9XG5cblx0Ly8gYmxhbmsgb3IgbnVsbD9cblx0aWYgKCFjc3MgfHwgdHlwZW9mIGNzcyAhPT0gXCJzdHJpbmdcIikge1xuXHQgIHJldHVybiBjc3M7XG4gIH1cblxuICB2YXIgYmFzZVVybCA9IGxvY2F0aW9uLnByb3RvY29sICsgXCIvL1wiICsgbG9jYXRpb24uaG9zdDtcbiAgdmFyIGN1cnJlbnREaXIgPSBiYXNlVXJsICsgbG9jYXRpb24ucGF0aG5hbWUucmVwbGFjZSgvXFwvW15cXC9dKiQvLCBcIi9cIik7XG5cblx0Ly8gY29udmVydCBlYWNoIHVybCguLi4pXG5cdC8qXG5cdFRoaXMgcmVndWxhciBleHByZXNzaW9uIGlzIGp1c3QgYSB3YXkgdG8gcmVjdXJzaXZlbHkgbWF0Y2ggYnJhY2tldHMgd2l0aGluXG5cdGEgc3RyaW5nLlxuXG5cdCAvdXJsXFxzKlxcKCAgPSBNYXRjaCBvbiB0aGUgd29yZCBcInVybFwiIHdpdGggYW55IHdoaXRlc3BhY2UgYWZ0ZXIgaXQgYW5kIHRoZW4gYSBwYXJlbnNcblx0ICAgKCAgPSBTdGFydCBhIGNhcHR1cmluZyBncm91cFxuXHQgICAgICg/OiAgPSBTdGFydCBhIG5vbi1jYXB0dXJpbmcgZ3JvdXBcblx0ICAgICAgICAgW14pKF0gID0gTWF0Y2ggYW55dGhpbmcgdGhhdCBpc24ndCBhIHBhcmVudGhlc2VzXG5cdCAgICAgICAgIHwgID0gT1Jcblx0ICAgICAgICAgXFwoICA9IE1hdGNoIGEgc3RhcnQgcGFyZW50aGVzZXNcblx0ICAgICAgICAgICAgICg/OiAgPSBTdGFydCBhbm90aGVyIG5vbi1jYXB0dXJpbmcgZ3JvdXBzXG5cdCAgICAgICAgICAgICAgICAgW14pKF0rICA9IE1hdGNoIGFueXRoaW5nIHRoYXQgaXNuJ3QgYSBwYXJlbnRoZXNlc1xuXHQgICAgICAgICAgICAgICAgIHwgID0gT1Jcblx0ICAgICAgICAgICAgICAgICBcXCggID0gTWF0Y2ggYSBzdGFydCBwYXJlbnRoZXNlc1xuXHQgICAgICAgICAgICAgICAgICAgICBbXikoXSogID0gTWF0Y2ggYW55dGhpbmcgdGhhdCBpc24ndCBhIHBhcmVudGhlc2VzXG5cdCAgICAgICAgICAgICAgICAgXFwpICA9IE1hdGNoIGEgZW5kIHBhcmVudGhlc2VzXG5cdCAgICAgICAgICAgICApICA9IEVuZCBHcm91cFxuICAgICAgICAgICAgICAqXFwpID0gTWF0Y2ggYW55dGhpbmcgYW5kIHRoZW4gYSBjbG9zZSBwYXJlbnNcbiAgICAgICAgICApICA9IENsb3NlIG5vbi1jYXB0dXJpbmcgZ3JvdXBcbiAgICAgICAgICAqICA9IE1hdGNoIGFueXRoaW5nXG4gICAgICAgKSAgPSBDbG9zZSBjYXB0dXJpbmcgZ3JvdXBcblx0IFxcKSAgPSBNYXRjaCBhIGNsb3NlIHBhcmVuc1xuXG5cdCAvZ2kgID0gR2V0IGFsbCBtYXRjaGVzLCBub3QgdGhlIGZpcnN0LiAgQmUgY2FzZSBpbnNlbnNpdGl2ZS5cblx0ICovXG5cdHZhciBmaXhlZENzcyA9IGNzcy5yZXBsYWNlKC91cmxcXHMqXFwoKCg/OlteKShdfFxcKCg/OlteKShdK3xcXChbXikoXSpcXCkpKlxcKSkqKVxcKS9naSwgZnVuY3Rpb24oZnVsbE1hdGNoLCBvcmlnVXJsKSB7XG5cdFx0Ly8gc3RyaXAgcXVvdGVzIChpZiB0aGV5IGV4aXN0KVxuXHRcdHZhciB1bnF1b3RlZE9yaWdVcmwgPSBvcmlnVXJsXG5cdFx0XHQudHJpbSgpXG5cdFx0XHQucmVwbGFjZSgvXlwiKC4qKVwiJC8sIGZ1bmN0aW9uKG8sICQxKXsgcmV0dXJuICQxOyB9KVxuXHRcdFx0LnJlcGxhY2UoL14nKC4qKSckLywgZnVuY3Rpb24obywgJDEpeyByZXR1cm4gJDE7IH0pO1xuXG5cdFx0Ly8gYWxyZWFkeSBhIGZ1bGwgdXJsPyBubyBjaGFuZ2Vcblx0XHRpZiAoL14oI3xkYXRhOnxodHRwOlxcL1xcL3xodHRwczpcXC9cXC98ZmlsZTpcXC9cXC9cXC8pL2kudGVzdCh1bnF1b3RlZE9yaWdVcmwpKSB7XG5cdFx0ICByZXR1cm4gZnVsbE1hdGNoO1xuXHRcdH1cblxuXHRcdC8vIGNvbnZlcnQgdGhlIHVybCB0byBhIGZ1bGwgdXJsXG5cdFx0dmFyIG5ld1VybDtcblxuXHRcdGlmICh1bnF1b3RlZE9yaWdVcmwuaW5kZXhPZihcIi8vXCIpID09PSAwKSB7XG5cdFx0ICBcdC8vVE9ETzogc2hvdWxkIHdlIGFkZCBwcm90b2NvbD9cblx0XHRcdG5ld1VybCA9IHVucXVvdGVkT3JpZ1VybDtcblx0XHR9IGVsc2UgaWYgKHVucXVvdGVkT3JpZ1VybC5pbmRleE9mKFwiL1wiKSA9PT0gMCkge1xuXHRcdFx0Ly8gcGF0aCBzaG91bGQgYmUgcmVsYXRpdmUgdG8gdGhlIGJhc2UgdXJsXG5cdFx0XHRuZXdVcmwgPSBiYXNlVXJsICsgdW5xdW90ZWRPcmlnVXJsOyAvLyBhbHJlYWR5IHN0YXJ0cyB3aXRoICcvJ1xuXHRcdH0gZWxzZSB7XG5cdFx0XHQvLyBwYXRoIHNob3VsZCBiZSByZWxhdGl2ZSB0byBjdXJyZW50IGRpcmVjdG9yeVxuXHRcdFx0bmV3VXJsID0gY3VycmVudERpciArIHVucXVvdGVkT3JpZ1VybC5yZXBsYWNlKC9eXFwuXFwvLywgXCJcIik7IC8vIFN0cmlwIGxlYWRpbmcgJy4vJ1xuXHRcdH1cblxuXHRcdC8vIHNlbmQgYmFjayB0aGUgZml4ZWQgdXJsKC4uLilcblx0XHRyZXR1cm4gXCJ1cmwoXCIgKyBKU09OLnN0cmluZ2lmeShuZXdVcmwpICsgXCIpXCI7XG5cdH0pO1xuXG5cdC8vIHNlbmQgYmFjayB0aGUgZml4ZWQgY3NzXG5cdHJldHVybiBmaXhlZENzcztcbn07XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vc3R5bGUtbG9hZGVyL2ZpeFVybHMuanNcbi8vIG1vZHVsZSBpZCA9IDI1MVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyBzdHlsZS1sb2FkZXI6IEFkZHMgc29tZSBjc3MgdG8gdGhlIERPTSBieSBhZGRpbmcgYSA8c3R5bGU+IHRhZ1xuXG4vLyBsb2FkIHRoZSBzdHlsZXNcbnZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2xpYi9pbmRleC5qcz8/cmVmLS01LTIhLi9hcHAuY3NzXCIpO1xuaWYodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG4vLyBQcmVwYXJlIGNzc1RyYW5zZm9ybWF0aW9uXG52YXIgdHJhbnNmb3JtO1xuXG52YXIgb3B0aW9ucyA9IHt9XG5vcHRpb25zLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVxuLy8gYWRkIHRoZSBzdHlsZXMgdG8gdGhlIERPTVxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9hZGRTdHlsZXMuanNcIikoY29udGVudCwgb3B0aW9ucyk7XG5pZihjb250ZW50LmxvY2FscykgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2Fscztcbi8vIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnRcbmlmKG1vZHVsZS5ob3QpIHtcblx0Ly8gV2hlbiB0aGUgc3R5bGVzIGNoYW5nZSwgdXBkYXRlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0aWYoIWNvbnRlbnQubG9jYWxzKSB7XG5cdFx0bW9kdWxlLmhvdC5hY2NlcHQoXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzIS4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9saWIvaW5kZXguanM/P3JlZi0tNS0yIS4vYXBwLmNzc1wiLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBuZXdDb250ZW50ID0gcmVxdWlyZShcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2xpYi9pbmRleC5qcz8/cmVmLS01LTIhLi9hcHAuY3NzXCIpO1xuXHRcdFx0aWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG5cdFx0XHR1cGRhdGUobmV3Q29udGVudCk7XG5cdFx0fSk7XG5cdH1cblx0Ly8gV2hlbiB0aGUgbW9kdWxlIGlzIGRpc3Bvc2VkLCByZW1vdmUgdGhlIDxzdHlsZT4gdGFnc1xuXHRtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHVwZGF0ZSgpOyB9KTtcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9hcHAuY3NzXG4vLyBtb2R1bGUgaWQgPSAyNTRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gc3R5bGUtbG9hZGVyOiBBZGRzIHNvbWUgY3NzIHRvIHRoZSBET00gYnkgYWRkaW5nIGEgPHN0eWxlPiB0YWdcblxuLy8gbG9hZCB0aGUgc3R5bGVzXG52YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzIS4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9saWIvaW5kZXguanM/P3JlZi0tNS0yIS4vbWF0ZXJpYWwtaWNvbnMuY3NzXCIpO1xuaWYodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG4vLyBQcmVwYXJlIGNzc1RyYW5zZm9ybWF0aW9uXG52YXIgdHJhbnNmb3JtO1xuXG52YXIgb3B0aW9ucyA9IHt9XG5vcHRpb25zLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVxuLy8gYWRkIHRoZSBzdHlsZXMgdG8gdGhlIERPTVxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9hZGRTdHlsZXMuanNcIikoY29udGVudCwgb3B0aW9ucyk7XG5pZihjb250ZW50LmxvY2FscykgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2Fscztcbi8vIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnRcbmlmKG1vZHVsZS5ob3QpIHtcblx0Ly8gV2hlbiB0aGUgc3R5bGVzIGNoYW5nZSwgdXBkYXRlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0aWYoIWNvbnRlbnQubG9jYWxzKSB7XG5cdFx0bW9kdWxlLmhvdC5hY2NlcHQoXCIhIS4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzIS4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9saWIvaW5kZXguanM/P3JlZi0tNS0yIS4vbWF0ZXJpYWwtaWNvbnMuY3NzXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvbGliL2luZGV4LmpzPz9yZWYtLTUtMiEuL21hdGVyaWFsLWljb25zLmNzc1wiKTtcblx0XHRcdGlmKHR5cGVvZiBuZXdDb250ZW50ID09PSAnc3RyaW5nJykgbmV3Q29udGVudCA9IFtbbW9kdWxlLmlkLCBuZXdDb250ZW50LCAnJ11dO1xuXHRcdFx0dXBkYXRlKG5ld0NvbnRlbnQpO1xuXHRcdH0pO1xuXHR9XG5cdC8vIFdoZW4gdGhlIG1vZHVsZSBpcyBkaXNwb3NlZCwgcmVtb3ZlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0bW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyB1cGRhdGUoKTsgfSk7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvYXNzZXRzL2ltZy9pY29uZm9udC9tYXRlcmlhbC1pY29ucy5jc3Ncbi8vIG1vZHVsZSBpZCA9IDI1NVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyBzdHlsZS1sb2FkZXI6IEFkZHMgc29tZSBjc3MgdG8gdGhlIERPTSBieSBhZGRpbmcgYSA8c3R5bGU+IHRhZ1xuXG4vLyBsb2FkIHRoZSBzdHlsZXNcbnZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2xpYi9pbmRleC5qcz8/cmVmLS01LTIhLi9vY3RpY29uLmNzc1wiKTtcbmlmKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykgY29udGVudCA9IFtbbW9kdWxlLmlkLCBjb250ZW50LCAnJ11dO1xuLy8gUHJlcGFyZSBjc3NUcmFuc2Zvcm1hdGlvblxudmFyIHRyYW5zZm9ybTtcblxudmFyIG9wdGlvbnMgPSB7fVxub3B0aW9ucy50cmFuc2Zvcm0gPSB0cmFuc2Zvcm1cbi8vIGFkZCB0aGUgc3R5bGVzIHRvIHRoZSBET01cbnZhciB1cGRhdGUgPSByZXF1aXJlKFwiIS4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvYWRkU3R5bGVzLmpzXCIpKGNvbnRlbnQsIG9wdGlvbnMpO1xuaWYoY29udGVudC5sb2NhbHMpIG1vZHVsZS5leHBvcnRzID0gY29udGVudC5sb2NhbHM7XG4vLyBIb3QgTW9kdWxlIFJlcGxhY2VtZW50XG5pZihtb2R1bGUuaG90KSB7XG5cdC8vIFdoZW4gdGhlIHN0eWxlcyBjaGFuZ2UsIHVwZGF0ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdGlmKCFjb250ZW50LmxvY2Fscykge1xuXHRcdG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvbGliL2luZGV4LmpzPz9yZWYtLTUtMiEuL29jdGljb24uY3NzXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvbGliL2luZGV4LmpzPz9yZWYtLTUtMiEuL29jdGljb24uY3NzXCIpO1xuXHRcdFx0aWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG5cdFx0XHR1cGRhdGUobmV3Q29udGVudCk7XG5cdFx0fSk7XG5cdH1cblx0Ly8gV2hlbiB0aGUgbW9kdWxlIGlzIGRpc3Bvc2VkLCByZW1vdmUgdGhlIDxzdHlsZT4gdGFnc1xuXHRtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHVwZGF0ZSgpOyB9KTtcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9hc3NldHMvaW1nL29jdGljb24vb2N0aWNvbi5jc3Ncbi8vIG1vZHVsZSBpZCA9IDI1NlxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKlxuXHRNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuXHRBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xuLy8gY3NzIGJhc2UgY29kZSwgaW5qZWN0ZWQgYnkgdGhlIGNzcy1sb2FkZXJcbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24odXNlU291cmNlTWFwKSB7XG5cdHZhciBsaXN0ID0gW107XG5cblx0Ly8gcmV0dXJuIHRoZSBsaXN0IG9mIG1vZHVsZXMgYXMgY3NzIHN0cmluZ1xuXHRsaXN0LnRvU3RyaW5nID0gZnVuY3Rpb24gdG9TdHJpbmcoKSB7XG5cdFx0cmV0dXJuIHRoaXMubWFwKGZ1bmN0aW9uIChpdGVtKSB7XG5cdFx0XHR2YXIgY29udGVudCA9IGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSwgdXNlU291cmNlTWFwKTtcblx0XHRcdGlmKGl0ZW1bMl0pIHtcblx0XHRcdFx0cmV0dXJuIFwiQG1lZGlhIFwiICsgaXRlbVsyXSArIFwie1wiICsgY29udGVudCArIFwifVwiO1xuXHRcdFx0fSBlbHNlIHtcblx0XHRcdFx0cmV0dXJuIGNvbnRlbnQ7XG5cdFx0XHR9XG5cdFx0fSkuam9pbihcIlwiKTtcblx0fTtcblxuXHQvLyBpbXBvcnQgYSBsaXN0IG9mIG1vZHVsZXMgaW50byB0aGUgbGlzdFxuXHRsaXN0LmkgPSBmdW5jdGlvbihtb2R1bGVzLCBtZWRpYVF1ZXJ5KSB7XG5cdFx0aWYodHlwZW9mIG1vZHVsZXMgPT09IFwic3RyaW5nXCIpXG5cdFx0XHRtb2R1bGVzID0gW1tudWxsLCBtb2R1bGVzLCBcIlwiXV07XG5cdFx0dmFyIGFscmVhZHlJbXBvcnRlZE1vZHVsZXMgPSB7fTtcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgdGhpcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGlkID0gdGhpc1tpXVswXTtcblx0XHRcdGlmKHR5cGVvZiBpZCA9PT0gXCJudW1iZXJcIilcblx0XHRcdFx0YWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpZF0gPSB0cnVlO1xuXHRcdH1cblx0XHRmb3IoaSA9IDA7IGkgPCBtb2R1bGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgaXRlbSA9IG1vZHVsZXNbaV07XG5cdFx0XHQvLyBza2lwIGFscmVhZHkgaW1wb3J0ZWQgbW9kdWxlXG5cdFx0XHQvLyB0aGlzIGltcGxlbWVudGF0aW9uIGlzIG5vdCAxMDAlIHBlcmZlY3QgZm9yIHdlaXJkIG1lZGlhIHF1ZXJ5IGNvbWJpbmF0aW9uc1xuXHRcdFx0Ly8gIHdoZW4gYSBtb2R1bGUgaXMgaW1wb3J0ZWQgbXVsdGlwbGUgdGltZXMgd2l0aCBkaWZmZXJlbnQgbWVkaWEgcXVlcmllcy5cblx0XHRcdC8vICBJIGhvcGUgdGhpcyB3aWxsIG5ldmVyIG9jY3VyIChIZXkgdGhpcyB3YXkgd2UgaGF2ZSBzbWFsbGVyIGJ1bmRsZXMpXG5cdFx0XHRpZih0eXBlb2YgaXRlbVswXSAhPT0gXCJudW1iZXJcIiB8fCAhYWxyZWFkeUltcG9ydGVkTW9kdWxlc1tpdGVtWzBdXSkge1xuXHRcdFx0XHRpZihtZWRpYVF1ZXJ5ICYmICFpdGVtWzJdKSB7XG5cdFx0XHRcdFx0aXRlbVsyXSA9IG1lZGlhUXVlcnk7XG5cdFx0XHRcdH0gZWxzZSBpZihtZWRpYVF1ZXJ5KSB7XG5cdFx0XHRcdFx0aXRlbVsyXSA9IFwiKFwiICsgaXRlbVsyXSArIFwiKSBhbmQgKFwiICsgbWVkaWFRdWVyeSArIFwiKVwiO1xuXHRcdFx0XHR9XG5cdFx0XHRcdGxpc3QucHVzaChpdGVtKTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG5cdHJldHVybiBsaXN0O1xufTtcblxuZnVuY3Rpb24gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtLCB1c2VTb3VyY2VNYXApIHtcblx0dmFyIGNvbnRlbnQgPSBpdGVtWzFdIHx8ICcnO1xuXHR2YXIgY3NzTWFwcGluZyA9IGl0ZW1bM107XG5cdGlmICghY3NzTWFwcGluZykge1xuXHRcdHJldHVybiBjb250ZW50O1xuXHR9XG5cblx0aWYgKHVzZVNvdXJjZU1hcCAmJiB0eXBlb2YgYnRvYSA9PT0gJ2Z1bmN0aW9uJykge1xuXHRcdHZhciBzb3VyY2VNYXBwaW5nID0gdG9Db21tZW50KGNzc01hcHBpbmcpO1xuXHRcdHZhciBzb3VyY2VVUkxzID0gY3NzTWFwcGluZy5zb3VyY2VzLm1hcChmdW5jdGlvbiAoc291cmNlKSB7XG5cdFx0XHRyZXR1cm4gJy8qIyBzb3VyY2VVUkw9JyArIGNzc01hcHBpbmcuc291cmNlUm9vdCArIHNvdXJjZSArICcgKi8nXG5cdFx0fSk7XG5cblx0XHRyZXR1cm4gW2NvbnRlbnRdLmNvbmNhdChzb3VyY2VVUkxzKS5jb25jYXQoW3NvdXJjZU1hcHBpbmddKS5qb2luKCdcXG4nKTtcblx0fVxuXG5cdHJldHVybiBbY29udGVudF0uam9pbignXFxuJyk7XG59XG5cbi8vIEFkYXB0ZWQgZnJvbSBjb252ZXJ0LXNvdXJjZS1tYXAgKE1JVClcbmZ1bmN0aW9uIHRvQ29tbWVudChzb3VyY2VNYXApIHtcblx0Ly8gZXNsaW50LWRpc2FibGUtbmV4dC1saW5lIG5vLXVuZGVmXG5cdHZhciBiYXNlNjQgPSBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpO1xuXHR2YXIgZGF0YSA9ICdzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtjaGFyc2V0PXV0Zi04O2Jhc2U2NCwnICsgYmFzZTY0O1xuXG5cdHJldHVybiAnLyojICcgKyBkYXRhICsgJyAqLyc7XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcbi8vIG1vZHVsZSBpZCA9IDQxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qXG5cdE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG5cdEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG52YXIgc3R5bGVzSW5Eb20gPSB7fSxcblx0bWVtb2l6ZSA9IGZ1bmN0aW9uKGZuKSB7XG5cdFx0dmFyIG1lbW87XG5cdFx0cmV0dXJuIGZ1bmN0aW9uICgpIHtcblx0XHRcdGlmICh0eXBlb2YgbWVtbyA9PT0gXCJ1bmRlZmluZWRcIikgbWVtbyA9IGZuLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG5cdFx0XHRyZXR1cm4gbWVtbztcblx0XHR9O1xuXHR9LFxuXHRpc09sZElFID0gbWVtb2l6ZShmdW5jdGlvbigpIHtcblx0XHQvLyBUZXN0IGZvciBJRSA8PSA5IGFzIHByb3Bvc2VkIGJ5IEJyb3dzZXJoYWNrc1xuXHRcdC8vIEBzZWUgaHR0cDovL2Jyb3dzZXJoYWNrcy5jb20vI2hhY2stZTcxZDg2OTJmNjUzMzQxNzNmZWU3MTVjMjIyY2I4MDVcblx0XHQvLyBUZXN0cyBmb3IgZXhpc3RlbmNlIG9mIHN0YW5kYXJkIGdsb2JhbHMgaXMgdG8gYWxsb3cgc3R5bGUtbG9hZGVyIFxuXHRcdC8vIHRvIG9wZXJhdGUgY29ycmVjdGx5IGludG8gbm9uLXN0YW5kYXJkIGVudmlyb25tZW50c1xuXHRcdC8vIEBzZWUgaHR0cHM6Ly9naXRodWIuY29tL3dlYnBhY2stY29udHJpYi9zdHlsZS1sb2FkZXIvaXNzdWVzLzE3N1xuXHRcdHJldHVybiB3aW5kb3cgJiYgZG9jdW1lbnQgJiYgZG9jdW1lbnQuYWxsICYmICF3aW5kb3cuYXRvYjtcblx0fSksXG5cdGdldEVsZW1lbnQgPSAoZnVuY3Rpb24oZm4pIHtcblx0XHR2YXIgbWVtbyA9IHt9O1xuXHRcdHJldHVybiBmdW5jdGlvbihzZWxlY3Rvcikge1xuXHRcdFx0aWYgKHR5cGVvZiBtZW1vW3NlbGVjdG9yXSA9PT0gXCJ1bmRlZmluZWRcIikge1xuXHRcdFx0XHRtZW1vW3NlbGVjdG9yXSA9IGZuLmNhbGwodGhpcywgc2VsZWN0b3IpO1xuXHRcdFx0fVxuXHRcdFx0cmV0dXJuIG1lbW9bc2VsZWN0b3JdXG5cdFx0fTtcblx0fSkoZnVuY3Rpb24gKHN0eWxlVGFyZ2V0KSB7XG5cdFx0cmV0dXJuIGRvY3VtZW50LnF1ZXJ5U2VsZWN0b3Ioc3R5bGVUYXJnZXQpXG5cdH0pLFxuXHRzaW5nbGV0b25FbGVtZW50ID0gbnVsbCxcblx0c2luZ2xldG9uQ291bnRlciA9IDAsXG5cdHN0eWxlRWxlbWVudHNJbnNlcnRlZEF0VG9wID0gW10sXG5cdGZpeFVybHMgPSByZXF1aXJlKFwiLi9maXhVcmxzXCIpO1xuXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKGxpc3QsIG9wdGlvbnMpIHtcblx0aWYodHlwZW9mIERFQlVHICE9PSBcInVuZGVmaW5lZFwiICYmIERFQlVHKSB7XG5cdFx0aWYodHlwZW9mIGRvY3VtZW50ICE9PSBcIm9iamVjdFwiKSB0aHJvdyBuZXcgRXJyb3IoXCJUaGUgc3R5bGUtbG9hZGVyIGNhbm5vdCBiZSB1c2VkIGluIGEgbm9uLWJyb3dzZXIgZW52aXJvbm1lbnRcIik7XG5cdH1cblxuXHRvcHRpb25zID0gb3B0aW9ucyB8fCB7fTtcblx0b3B0aW9ucy5hdHRycyA9IHR5cGVvZiBvcHRpb25zLmF0dHJzID09PSBcIm9iamVjdFwiID8gb3B0aW9ucy5hdHRycyA6IHt9O1xuXG5cdC8vIEZvcmNlIHNpbmdsZS10YWcgc29sdXRpb24gb24gSUU2LTksIHdoaWNoIGhhcyBhIGhhcmQgbGltaXQgb24gdGhlICMgb2YgPHN0eWxlPlxuXHQvLyB0YWdzIGl0IHdpbGwgYWxsb3cgb24gYSBwYWdlXG5cdGlmICh0eXBlb2Ygb3B0aW9ucy5zaW5nbGV0b24gPT09IFwidW5kZWZpbmVkXCIpIG9wdGlvbnMuc2luZ2xldG9uID0gaXNPbGRJRSgpO1xuXG5cdC8vIEJ5IGRlZmF1bHQsIGFkZCA8c3R5bGU+IHRhZ3MgdG8gdGhlIDxoZWFkPiBlbGVtZW50XG5cdGlmICh0eXBlb2Ygb3B0aW9ucy5pbnNlcnRJbnRvID09PSBcInVuZGVmaW5lZFwiKSBvcHRpb25zLmluc2VydEludG8gPSBcImhlYWRcIjtcblxuXHQvLyBCeSBkZWZhdWx0LCBhZGQgPHN0eWxlPiB0YWdzIHRvIHRoZSBib3R0b20gb2YgdGhlIHRhcmdldFxuXHRpZiAodHlwZW9mIG9wdGlvbnMuaW5zZXJ0QXQgPT09IFwidW5kZWZpbmVkXCIpIG9wdGlvbnMuaW5zZXJ0QXQgPSBcImJvdHRvbVwiO1xuXG5cdHZhciBzdHlsZXMgPSBsaXN0VG9TdHlsZXMobGlzdCwgb3B0aW9ucyk7XG5cdGFkZFN0eWxlc1RvRG9tKHN0eWxlcywgb3B0aW9ucyk7XG5cblx0cmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZShuZXdMaXN0KSB7XG5cdFx0dmFyIG1heVJlbW92ZSA9IFtdO1xuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCBzdHlsZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBpdGVtID0gc3R5bGVzW2ldO1xuXHRcdFx0dmFyIGRvbVN0eWxlID0gc3R5bGVzSW5Eb21baXRlbS5pZF07XG5cdFx0XHRkb21TdHlsZS5yZWZzLS07XG5cdFx0XHRtYXlSZW1vdmUucHVzaChkb21TdHlsZSk7XG5cdFx0fVxuXHRcdGlmKG5ld0xpc3QpIHtcblx0XHRcdHZhciBuZXdTdHlsZXMgPSBsaXN0VG9TdHlsZXMobmV3TGlzdCwgb3B0aW9ucyk7XG5cdFx0XHRhZGRTdHlsZXNUb0RvbShuZXdTdHlsZXMsIG9wdGlvbnMpO1xuXHRcdH1cblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgbWF5UmVtb3ZlLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgZG9tU3R5bGUgPSBtYXlSZW1vdmVbaV07XG5cdFx0XHRpZihkb21TdHlsZS5yZWZzID09PSAwKSB7XG5cdFx0XHRcdGZvcih2YXIgaiA9IDA7IGogPCBkb21TdHlsZS5wYXJ0cy5sZW5ndGg7IGorKylcblx0XHRcdFx0XHRkb21TdHlsZS5wYXJ0c1tqXSgpO1xuXHRcdFx0XHRkZWxldGUgc3R5bGVzSW5Eb21bZG9tU3R5bGUuaWRdO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcbn07XG5cbmZ1bmN0aW9uIGFkZFN0eWxlc1RvRG9tKHN0eWxlcywgb3B0aW9ucykge1xuXHRmb3IodmFyIGkgPSAwOyBpIDwgc3R5bGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIGl0ZW0gPSBzdHlsZXNbaV07XG5cdFx0dmFyIGRvbVN0eWxlID0gc3R5bGVzSW5Eb21baXRlbS5pZF07XG5cdFx0aWYoZG9tU3R5bGUpIHtcblx0XHRcdGRvbVN0eWxlLnJlZnMrKztcblx0XHRcdGZvcih2YXIgaiA9IDA7IGogPCBkb21TdHlsZS5wYXJ0cy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRkb21TdHlsZS5wYXJ0c1tqXShpdGVtLnBhcnRzW2pdKTtcblx0XHRcdH1cblx0XHRcdGZvcig7IGogPCBpdGVtLnBhcnRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdGRvbVN0eWxlLnBhcnRzLnB1c2goYWRkU3R5bGUoaXRlbS5wYXJ0c1tqXSwgb3B0aW9ucykpO1xuXHRcdFx0fVxuXHRcdH0gZWxzZSB7XG5cdFx0XHR2YXIgcGFydHMgPSBbXTtcblx0XHRcdGZvcih2YXIgaiA9IDA7IGogPCBpdGVtLnBhcnRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdHBhcnRzLnB1c2goYWRkU3R5bGUoaXRlbS5wYXJ0c1tqXSwgb3B0aW9ucykpO1xuXHRcdFx0fVxuXHRcdFx0c3R5bGVzSW5Eb21baXRlbS5pZF0gPSB7aWQ6IGl0ZW0uaWQsIHJlZnM6IDEsIHBhcnRzOiBwYXJ0c307XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIGxpc3RUb1N0eWxlcyhsaXN0LCBvcHRpb25zKSB7XG5cdHZhciBzdHlsZXMgPSBbXTtcblx0dmFyIG5ld1N0eWxlcyA9IHt9O1xuXHRmb3IodmFyIGkgPSAwOyBpIDwgbGlzdC5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBpdGVtID0gbGlzdFtpXTtcblx0XHR2YXIgaWQgPSBvcHRpb25zLmJhc2UgPyBpdGVtWzBdICsgb3B0aW9ucy5iYXNlIDogaXRlbVswXTtcblx0XHR2YXIgY3NzID0gaXRlbVsxXTtcblx0XHR2YXIgbWVkaWEgPSBpdGVtWzJdO1xuXHRcdHZhciBzb3VyY2VNYXAgPSBpdGVtWzNdO1xuXHRcdHZhciBwYXJ0ID0ge2NzczogY3NzLCBtZWRpYTogbWVkaWEsIHNvdXJjZU1hcDogc291cmNlTWFwfTtcblx0XHRpZighbmV3U3R5bGVzW2lkXSlcblx0XHRcdHN0eWxlcy5wdXNoKG5ld1N0eWxlc1tpZF0gPSB7aWQ6IGlkLCBwYXJ0czogW3BhcnRdfSk7XG5cdFx0ZWxzZVxuXHRcdFx0bmV3U3R5bGVzW2lkXS5wYXJ0cy5wdXNoKHBhcnQpO1xuXHR9XG5cdHJldHVybiBzdHlsZXM7XG59XG5cbmZ1bmN0aW9uIGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zLCBzdHlsZUVsZW1lbnQpIHtcblx0dmFyIHN0eWxlVGFyZ2V0ID0gZ2V0RWxlbWVudChvcHRpb25zLmluc2VydEludG8pXG5cdGlmICghc3R5bGVUYXJnZXQpIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJDb3VsZG4ndCBmaW5kIGEgc3R5bGUgdGFyZ2V0LiBUaGlzIHByb2JhYmx5IG1lYW5zIHRoYXQgdGhlIHZhbHVlIGZvciB0aGUgJ2luc2VydEludG8nIHBhcmFtZXRlciBpcyBpbnZhbGlkLlwiKTtcblx0fVxuXHR2YXIgbGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3AgPSBzdHlsZUVsZW1lbnRzSW5zZXJ0ZWRBdFRvcFtzdHlsZUVsZW1lbnRzSW5zZXJ0ZWRBdFRvcC5sZW5ndGggLSAxXTtcblx0aWYgKG9wdGlvbnMuaW5zZXJ0QXQgPT09IFwidG9wXCIpIHtcblx0XHRpZighbGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3ApIHtcblx0XHRcdHN0eWxlVGFyZ2V0Lmluc2VydEJlZm9yZShzdHlsZUVsZW1lbnQsIHN0eWxlVGFyZ2V0LmZpcnN0Q2hpbGQpO1xuXHRcdH0gZWxzZSBpZihsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcC5uZXh0U2libGluZykge1xuXHRcdFx0c3R5bGVUYXJnZXQuaW5zZXJ0QmVmb3JlKHN0eWxlRWxlbWVudCwgbGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3AubmV4dFNpYmxpbmcpO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRzdHlsZVRhcmdldC5hcHBlbmRDaGlsZChzdHlsZUVsZW1lbnQpO1xuXHRcdH1cblx0XHRzdHlsZUVsZW1lbnRzSW5zZXJ0ZWRBdFRvcC5wdXNoKHN0eWxlRWxlbWVudCk7XG5cdH0gZWxzZSBpZiAob3B0aW9ucy5pbnNlcnRBdCA9PT0gXCJib3R0b21cIikge1xuXHRcdHN0eWxlVGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlRWxlbWVudCk7XG5cdH0gZWxzZSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiSW52YWxpZCB2YWx1ZSBmb3IgcGFyYW1ldGVyICdpbnNlcnRBdCcuIE11c3QgYmUgJ3RvcCcgb3IgJ2JvdHRvbScuXCIpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpIHtcblx0c3R5bGVFbGVtZW50LnBhcmVudE5vZGUucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50KTtcblx0dmFyIGlkeCA9IHN0eWxlRWxlbWVudHNJbnNlcnRlZEF0VG9wLmluZGV4T2Yoc3R5bGVFbGVtZW50KTtcblx0aWYoaWR4ID49IDApIHtcblx0XHRzdHlsZUVsZW1lbnRzSW5zZXJ0ZWRBdFRvcC5zcGxpY2UoaWR4LCAxKTtcblx0fVxufVxuXG5mdW5jdGlvbiBjcmVhdGVTdHlsZUVsZW1lbnQob3B0aW9ucykge1xuXHR2YXIgc3R5bGVFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcInN0eWxlXCIpO1xuXHRvcHRpb25zLmF0dHJzLnR5cGUgPSBcInRleHQvY3NzXCI7XG5cblx0YXR0YWNoVGFnQXR0cnMoc3R5bGVFbGVtZW50LCBvcHRpb25zLmF0dHJzKTtcblx0aW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMsIHN0eWxlRWxlbWVudCk7XG5cdHJldHVybiBzdHlsZUVsZW1lbnQ7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUxpbmtFbGVtZW50KG9wdGlvbnMpIHtcblx0dmFyIGxpbmtFbGVtZW50ID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChcImxpbmtcIik7XG5cdG9wdGlvbnMuYXR0cnMudHlwZSA9IFwidGV4dC9jc3NcIjtcblx0b3B0aW9ucy5hdHRycy5yZWwgPSBcInN0eWxlc2hlZXRcIjtcblxuXHRhdHRhY2hUYWdBdHRycyhsaW5rRWxlbWVudCwgb3B0aW9ucy5hdHRycyk7XG5cdGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zLCBsaW5rRWxlbWVudCk7XG5cdHJldHVybiBsaW5rRWxlbWVudDtcbn1cblxuZnVuY3Rpb24gYXR0YWNoVGFnQXR0cnMoZWxlbWVudCwgYXR0cnMpIHtcblx0T2JqZWN0LmtleXMoYXR0cnMpLmZvckVhY2goZnVuY3Rpb24gKGtleSkge1xuXHRcdGVsZW1lbnQuc2V0QXR0cmlidXRlKGtleSwgYXR0cnNba2V5XSk7XG5cdH0pO1xufVxuXG5mdW5jdGlvbiBhZGRTdHlsZShvYmosIG9wdGlvbnMpIHtcblx0dmFyIHN0eWxlRWxlbWVudCwgdXBkYXRlLCByZW1vdmUsIHRyYW5zZm9ybVJlc3VsdDtcblxuXHQvLyBJZiBhIHRyYW5zZm9ybSBmdW5jdGlvbiB3YXMgZGVmaW5lZCwgcnVuIGl0IG9uIHRoZSBjc3Ncblx0aWYgKG9wdGlvbnMudHJhbnNmb3JtICYmIG9iai5jc3MpIHtcblx0ICAgIHRyYW5zZm9ybVJlc3VsdCA9IG9wdGlvbnMudHJhbnNmb3JtKG9iai5jc3MpO1xuXHQgICAgXG5cdCAgICBpZiAodHJhbnNmb3JtUmVzdWx0KSB7XG5cdCAgICBcdC8vIElmIHRyYW5zZm9ybSByZXR1cm5zIGEgdmFsdWUsIHVzZSB0aGF0IGluc3RlYWQgb2YgdGhlIG9yaWdpbmFsIGNzcy5cblx0ICAgIFx0Ly8gVGhpcyBhbGxvd3MgcnVubmluZyBydW50aW1lIHRyYW5zZm9ybWF0aW9ucyBvbiB0aGUgY3NzLlxuXHQgICAgXHRvYmouY3NzID0gdHJhbnNmb3JtUmVzdWx0O1xuXHQgICAgfSBlbHNlIHtcblx0ICAgIFx0Ly8gSWYgdGhlIHRyYW5zZm9ybSBmdW5jdGlvbiByZXR1cm5zIGEgZmFsc3kgdmFsdWUsIGRvbid0IGFkZCB0aGlzIGNzcy4gXG5cdCAgICBcdC8vIFRoaXMgYWxsb3dzIGNvbmRpdGlvbmFsIGxvYWRpbmcgb2YgY3NzXG5cdCAgICBcdHJldHVybiBmdW5jdGlvbigpIHtcblx0ICAgIFx0XHQvLyBub29wXG5cdCAgICBcdH07XG5cdCAgICB9XG5cdH1cblxuXHRpZiAob3B0aW9ucy5zaW5nbGV0b24pIHtcblx0XHR2YXIgc3R5bGVJbmRleCA9IHNpbmdsZXRvbkNvdW50ZXIrKztcblx0XHRzdHlsZUVsZW1lbnQgPSBzaW5nbGV0b25FbGVtZW50IHx8IChzaW5nbGV0b25FbGVtZW50ID0gY3JlYXRlU3R5bGVFbGVtZW50KG9wdGlvbnMpKTtcblx0XHR1cGRhdGUgPSBhcHBseVRvU2luZ2xldG9uVGFnLmJpbmQobnVsbCwgc3R5bGVFbGVtZW50LCBzdHlsZUluZGV4LCBmYWxzZSk7XG5cdFx0cmVtb3ZlID0gYXBwbHlUb1NpbmdsZXRvblRhZy5iaW5kKG51bGwsIHN0eWxlRWxlbWVudCwgc3R5bGVJbmRleCwgdHJ1ZSk7XG5cdH0gZWxzZSBpZihvYmouc291cmNlTWFwICYmXG5cdFx0dHlwZW9mIFVSTCA9PT0gXCJmdW5jdGlvblwiICYmXG5cdFx0dHlwZW9mIFVSTC5jcmVhdGVPYmplY3RVUkwgPT09IFwiZnVuY3Rpb25cIiAmJlxuXHRcdHR5cGVvZiBVUkwucmV2b2tlT2JqZWN0VVJMID09PSBcImZ1bmN0aW9uXCIgJiZcblx0XHR0eXBlb2YgQmxvYiA9PT0gXCJmdW5jdGlvblwiICYmXG5cdFx0dHlwZW9mIGJ0b2EgPT09IFwiZnVuY3Rpb25cIikge1xuXHRcdHN0eWxlRWxlbWVudCA9IGNyZWF0ZUxpbmtFbGVtZW50KG9wdGlvbnMpO1xuXHRcdHVwZGF0ZSA9IHVwZGF0ZUxpbmsuYmluZChudWxsLCBzdHlsZUVsZW1lbnQsIG9wdGlvbnMpO1xuXHRcdHJlbW92ZSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCk7XG5cdFx0XHRpZihzdHlsZUVsZW1lbnQuaHJlZilcblx0XHRcdFx0VVJMLnJldm9rZU9iamVjdFVSTChzdHlsZUVsZW1lbnQuaHJlZik7XG5cdFx0fTtcblx0fSBlbHNlIHtcblx0XHRzdHlsZUVsZW1lbnQgPSBjcmVhdGVTdHlsZUVsZW1lbnQob3B0aW9ucyk7XG5cdFx0dXBkYXRlID0gYXBwbHlUb1RhZy5iaW5kKG51bGwsIHN0eWxlRWxlbWVudCk7XG5cdFx0cmVtb3ZlID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRyZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KTtcblx0XHR9O1xuXHR9XG5cblx0dXBkYXRlKG9iaik7XG5cblx0cmV0dXJuIGZ1bmN0aW9uIHVwZGF0ZVN0eWxlKG5ld09iaikge1xuXHRcdGlmKG5ld09iaikge1xuXHRcdFx0aWYobmV3T2JqLmNzcyA9PT0gb2JqLmNzcyAmJiBuZXdPYmoubWVkaWEgPT09IG9iai5tZWRpYSAmJiBuZXdPYmouc291cmNlTWFwID09PSBvYmouc291cmNlTWFwKVxuXHRcdFx0XHRyZXR1cm47XG5cdFx0XHR1cGRhdGUob2JqID0gbmV3T2JqKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0cmVtb3ZlKCk7XG5cdFx0fVxuXHR9O1xufVxuXG52YXIgcmVwbGFjZVRleHQgPSAoZnVuY3Rpb24gKCkge1xuXHR2YXIgdGV4dFN0b3JlID0gW107XG5cblx0cmV0dXJuIGZ1bmN0aW9uIChpbmRleCwgcmVwbGFjZW1lbnQpIHtcblx0XHR0ZXh0U3RvcmVbaW5kZXhdID0gcmVwbGFjZW1lbnQ7XG5cdFx0cmV0dXJuIHRleHRTdG9yZS5maWx0ZXIoQm9vbGVhbikuam9pbignXFxuJyk7XG5cdH07XG59KSgpO1xuXG5mdW5jdGlvbiBhcHBseVRvU2luZ2xldG9uVGFnKHN0eWxlRWxlbWVudCwgaW5kZXgsIHJlbW92ZSwgb2JqKSB7XG5cdHZhciBjc3MgPSByZW1vdmUgPyBcIlwiIDogb2JqLmNzcztcblxuXHRpZiAoc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQpIHtcblx0XHRzdHlsZUVsZW1lbnQuc3R5bGVTaGVldC5jc3NUZXh0ID0gcmVwbGFjZVRleHQoaW5kZXgsIGNzcyk7XG5cdH0gZWxzZSB7XG5cdFx0dmFyIGNzc05vZGUgPSBkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpO1xuXHRcdHZhciBjaGlsZE5vZGVzID0gc3R5bGVFbGVtZW50LmNoaWxkTm9kZXM7XG5cdFx0aWYgKGNoaWxkTm9kZXNbaW5kZXhdKSBzdHlsZUVsZW1lbnQucmVtb3ZlQ2hpbGQoY2hpbGROb2Rlc1tpbmRleF0pO1xuXHRcdGlmIChjaGlsZE5vZGVzLmxlbmd0aCkge1xuXHRcdFx0c3R5bGVFbGVtZW50Lmluc2VydEJlZm9yZShjc3NOb2RlLCBjaGlsZE5vZGVzW2luZGV4XSk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHN0eWxlRWxlbWVudC5hcHBlbmRDaGlsZChjc3NOb2RlKTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gYXBwbHlUb1RhZyhzdHlsZUVsZW1lbnQsIG9iaikge1xuXHR2YXIgY3NzID0gb2JqLmNzcztcblx0dmFyIG1lZGlhID0gb2JqLm1lZGlhO1xuXG5cdGlmKG1lZGlhKSB7XG5cdFx0c3R5bGVFbGVtZW50LnNldEF0dHJpYnV0ZShcIm1lZGlhXCIsIG1lZGlhKVxuXHR9XG5cblx0aWYoc3R5bGVFbGVtZW50LnN0eWxlU2hlZXQpIHtcblx0XHRzdHlsZUVsZW1lbnQuc3R5bGVTaGVldC5jc3NUZXh0ID0gY3NzO1xuXHR9IGVsc2Uge1xuXHRcdHdoaWxlKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKSB7XG5cdFx0XHRzdHlsZUVsZW1lbnQucmVtb3ZlQ2hpbGQoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpO1xuXHRcdH1cblx0XHRzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKSk7XG5cdH1cbn1cblxuZnVuY3Rpb24gdXBkYXRlTGluayhsaW5rRWxlbWVudCwgb3B0aW9ucywgb2JqKSB7XG5cdHZhciBjc3MgPSBvYmouY3NzO1xuXHR2YXIgc291cmNlTWFwID0gb2JqLnNvdXJjZU1hcDtcblxuXHQvKiBJZiBjb252ZXJ0VG9BYnNvbHV0ZVVybHMgaXNuJ3QgZGVmaW5lZCwgYnV0IHNvdXJjZW1hcHMgYXJlIGVuYWJsZWRcblx0YW5kIHRoZXJlIGlzIG5vIHB1YmxpY1BhdGggZGVmaW5lZCB0aGVuIGxldHMgdHVybiBjb252ZXJ0VG9BYnNvbHV0ZVVybHNcblx0b24gYnkgZGVmYXVsdC4gIE90aGVyd2lzZSBkZWZhdWx0IHRvIHRoZSBjb252ZXJ0VG9BYnNvbHV0ZVVybHMgb3B0aW9uXG5cdGRpcmVjdGx5XG5cdCovXG5cdHZhciBhdXRvRml4VXJscyA9IG9wdGlvbnMuY29udmVydFRvQWJzb2x1dGVVcmxzID09PSB1bmRlZmluZWQgJiYgc291cmNlTWFwO1xuXG5cdGlmIChvcHRpb25zLmNvbnZlcnRUb0Fic29sdXRlVXJscyB8fCBhdXRvRml4VXJscyl7XG5cdFx0Y3NzID0gZml4VXJscyhjc3MpO1xuXHR9XG5cblx0aWYoc291cmNlTWFwKSB7XG5cdFx0Ly8gaHR0cDovL3N0YWNrb3ZlcmZsb3cuY29tL2EvMjY2MDM4NzVcblx0XHRjc3MgKz0gXCJcXG4vKiMgc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247YmFzZTY0LFwiICsgYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKSArIFwiICovXCI7XG5cdH1cblxuXHR2YXIgYmxvYiA9IG5ldyBCbG9iKFtjc3NdLCB7IHR5cGU6IFwidGV4dC9jc3NcIiB9KTtcblxuXHR2YXIgb2xkU3JjID0gbGlua0VsZW1lbnQuaHJlZjtcblxuXHRsaW5rRWxlbWVudC5ocmVmID0gVVJMLmNyZWF0ZU9iamVjdFVSTChibG9iKTtcblxuXHRpZihvbGRTcmMpXG5cdFx0VVJMLnJldm9rZU9iamVjdFVSTChvbGRTcmMpO1xufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3N0eWxlLWxvYWRlci9hZGRTdHlsZXMuanNcbi8vIG1vZHVsZSBpZCA9IDYzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCJdLCJzb3VyY2VSb290IjoiIn0=