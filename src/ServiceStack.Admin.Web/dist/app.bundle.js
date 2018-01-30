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
        var firstRoute = (this.props.selected.requestType.routes || []).filter(function (x) { return x.path.indexOf('{') === -1; })[0];
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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvYXBwLnRzeCIsIndlYnBhY2s6Ly8vLi9zcmMvQXV0b1F1ZXJ5LnRzeCIsIndlYnBhY2s6Ly8vLi9zcmMvQ29sdW1uUHJlZnNEaWFsb2cudHN4Iiwid2VicGFjazovLy8uL3NyYy9Db250ZW50LnRzeCIsIndlYnBhY2s6Ly8vLi9zcmMvSGVhZGVyLnRzeCIsIndlYnBhY2s6Ly8vLi9zcmMvUmVzdWx0cy50c3giLCJ3ZWJwYWNrOi8vLy4vc3JjL1NpZGViYXIudHN4Iiwid2VicGFjazovLy8uL3NyYy9hcHAuY3NzIiwid2VicGFjazovLy8uL3NyYy9hc3NldHMvaW1nL2ljb25mb250L21hdGVyaWFsLWljb25zLmNzcyIsIndlYnBhY2s6Ly8vLi9zcmMvYXNzZXRzL2ltZy9vY3RpY29uL29jdGljb24uY3NzIiwid2VicGFjazovLy8uL3NyYy9hc3NldHMvaW1nL2ljb25mb250L01hdGVyaWFsSWNvbnMtUmVndWxhci5lb3QiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Fzc2V0cy9pbWcvaWNvbmZvbnQvTWF0ZXJpYWxJY29ucy1SZWd1bGFyLnR0ZiIsIndlYnBhY2s6Ly8vLi9zcmMvYXNzZXRzL2ltZy9pY29uZm9udC9NYXRlcmlhbEljb25zLVJlZ3VsYXIud29mZiIsIndlYnBhY2s6Ly8vLi9zcmMvYXNzZXRzL2ltZy9pY29uZm9udC9NYXRlcmlhbEljb25zLVJlZ3VsYXIud29mZjIiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Fzc2V0cy9pbWcvb2N0aWNvbi9vY3RpY29ucy50dGYiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Fzc2V0cy9pbWcvb2N0aWNvbi9vY3RpY29ucy53b2ZmIiwid2VicGFjazovLy8uL3NyYy9hc3NldHMvaW1nL3JvYm90by9yb2JvdG8tdjE1LWxhdGluLXJlZ3VsYXIud29mZiIsIndlYnBhY2s6Ly8vLi9zcmMvYXNzZXRzL2ltZy9yb2JvdG8vcm9ib3RvLXYxNS1sYXRpbi1yZWd1bGFyLndvZmYyIiwid2VicGFjazovLy8uL3NyYy9zaGFyZWQudHN4Iiwid2VicGFjazovLy8uL34vc3R5bGUtbG9hZGVyL2ZpeFVybHMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC5jc3M/MjAwZiIsIndlYnBhY2s6Ly8vLi9zcmMvYXNzZXRzL2ltZy9pY29uZm9udC9tYXRlcmlhbC1pY29ucy5jc3M/MTU0MCIsIndlYnBhY2s6Ly8vLi9zcmMvYXNzZXRzL2ltZy9vY3RpY29uL29jdGljb24uY3NzP2U0NDMiLCJ3ZWJwYWNrOi8vLy4vfi9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qcyIsIndlYnBhY2s6Ly8vLi9+L3N0eWxlLWxvYWRlci9hZGRTdHlsZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEseUJBQWtEO0FBQ2xELHlCQUEwQztBQUMxQyx5QkFBbUI7QUFFbkIsbUNBQStCO0FBQy9CLDBDQUFtQztBQUNuQyw0Q0FBd0M7QUFDeEMsaURBQXdFO0FBRXhFLHVDQUFvQztBQUNwQywyQ0FBb0M7QUFFcEM7SUFBdUIsNEJBQXlCO0lBQWhEOztJQUlBLENBQUM7SUFIRyx5QkFBTSxHQUFOO1FBQ0ksTUFBTSxDQUFDLG9CQUFDLG1CQUFTLElBQUMsS0FBSyxFQUFHLEVBQUUsTUFBTSxFQUFFLEVBQUUsSUFBSSxFQUFDLEVBQUUsRUFBQyxFQUFFLEdBQUssQ0FBQztJQUMxRCxDQUFDO0lBQ0wsZUFBQztBQUFELENBQUMsQ0FKc0IsS0FBSyxDQUFDLFNBQVMsR0FJckM7QUFFRCxJQUFJLE9BQU8sR0FBRyxpQkFBUSxHQUFHLFVBQVUsQ0FBQztBQUNwQyxJQUFNLGFBQWEsR0FBRyxPQUFPLEdBQUcsWUFBWSxDQUFDO0FBRTdDLGtCQUFNLENBQ0YsQ0FBQyxvQkFBQyxnQ0FBTTtJQUNKO1FBQ0ksb0JBQUMsd0JBQUssSUFBQyxLQUFLLFFBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUU7Z0JBQ2hDLDJCQUFDLHVCQUFRLElBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUUsYUFBYSxH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cG9ydCAnLi9hc3NldHMvaW1nL2ljb25mb250L21hdGVyaWFsLWljb25zLmNzcyc7XHJcbmltcG9ydCAnLi9hc3NldHMvaW1nL29jdGljb24vb2N0aWNvbi5jc3MnO1xyXG5pbXBvcnQgJy4vYXBwLmNzcyc7XHJcblxyXG5pbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7IHJlbmRlciB9IGZyb20gJ3JlYWN0LWRvbSc7XHJcbmltcG9ydCB7IFJlZGlyZWN0IH0gZnJvbSAncmVhY3Qtcm91dGVyJztcclxuaW1wb3J0IHsgQnJvd3NlclJvdXRlciBhcyBSb3V0ZXIsIFJvdXRlLCBMaW5rIH0gZnJvbSAncmVhY3Qtcm91dGVyLWRvbSc7XHJcblxyXG5pbXBvcnQgeyBCYXNlUGF0aCB9IGZyb20gJy4vc2hhcmVkJztcclxuaW1wb3J0IEF1dG9RdWVyeSBmcm9tICcuL0F1dG9RdWVyeSc7XHJcblxyXG5jbGFzcyBBZG1pbkFwcCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudDxhbnksIGFueT4ge1xyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHJldHVybiA8QXV0b1F1ZXJ5IG1hdGNoPXsgeyBwYXJhbXM6IHsgbmFtZTpcIlwifSB9IH0gLz47XHJcbiAgICB9XHJcbn1cclxuIFxyXG52YXIgQXBwUGF0aCA9IEJhc2VQYXRoICsgXCJzc19hZG1pblwiO1xyXG5jb25zdCBBdXRvUXVlcnlQYXRoID0gQXBwUGF0aCArIFwiL2F1dG9xdWVyeVwiO1xyXG5cclxucmVuZGVyKFxyXG4gICAgKDxSb3V0ZXI+XHJcbiAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgPFJvdXRlIGV4YWN0IHBhdGg9e0FwcFBhdGh9IHJlbmRlcj17KCkgPT4gXHJcbiAgICAgICAgICAgICAgICA8UmVkaXJlY3QgZnJvbT17QXBwUGF0aH0gdG89e0F1dG9RdWVyeVBhdGh9Lz5cclxuICAgICAgICAgICAgICAgIH0gLz5cclxuICAgICAgICAgICAgPFJvdXRlIGV4YWN0IHBhdGg9e0F1dG9RdWVyeVBhdGh9IGNvbXBvbmVudD17QXV0b1F1ZXJ5fSAvPlxyXG4gICAgICAgICAgICA8Um91dGUgcGF0aD17QXV0b1F1ZXJ5UGF0aCArIFwiLzpuYW1lXCJ9IGNvbXBvbmVudD17QXV0b1F1ZXJ5fSAvPlxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgPC9Sb3V0ZXI+KSwgXHJcbiAgICBkb2N1bWVudC5nZXRFbGVtZW50QnlJZCgnYXBwJykpO1xyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvYXBwLnRzeCIsImltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHsgcmVuZGVyIH0gZnJvbSAncmVhY3QtZG9tJztcclxuaW1wb3J0IEhlYWRlciBmcm9tICcuL0hlYWRlcic7XHJcbmltcG9ydCBTaWRlYmFyIGZyb20gJy4vU2lkZWJhcic7XHJcbmltcG9ydCBDb250ZW50IGZyb20gJy4vQ29udGVudCc7XHJcbmltcG9ydCBDb2x1bW5QcmVmc0RpYWxvZyBmcm9tICcuL0NvbHVtblByZWZzRGlhbG9nJztcclxuXHJcbmltcG9ydCB7IGNsaWVudCwgbm9ybWFsaXplIH0gZnJvbSAnLi9zaGFyZWQnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQXV0b1F1ZXJ5IGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PGFueSwgYW55PiB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcz8sIGNvbnRleHQ/KSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMsIGNvbnRleHQpO1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7IG1ldGFkYXRhOiBudWxsIH07XHJcblxyXG4gICAgICAgIGNsaWVudC5nZXQoXCIvYXV0b3F1ZXJ5L21ldGFkYXRhXCIpLnRoZW4ociA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IG1ldGFkYXRhID0gbm9ybWFsaXplKHIsIHRydWUpO1xyXG4gICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgbWV0YWRhdGEsIG5hbWU6IHRoaXMuZ2V0TmFtZSgpIH0pXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnN0YXRlLm1ldGFkYXRhXHJcbiAgICAgICAgICAgID8gPEFwcCBtZXRhZGF0YT17dGhpcy5zdGF0ZS5tZXRhZGF0YX0gbmFtZT17dGhpcy5nZXROYW1lKCl9IC8+XHJcbiAgICAgICAgICAgIDogbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBnZXROYW1lKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnByb3BzLm1hdGNoLnBhcmFtcy5uYW1lIHx8IFwiXCI7XHJcbiAgICB9XHJcbn1cclxuXHJcbmNsYXNzIEFwcCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudDxhbnksIGFueT4ge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHM/LCBjb250ZXh0Pykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzLCBjb250ZXh0KTtcclxuXHJcbiAgICAgICAgdmFyIG9wZXJhdGlvbk5hbWVzID0gdGhpcy5wcm9wcy5tZXRhZGF0YS5vcGVyYXRpb25zLm1hcChvcCA9PiBvcC5yZXF1ZXN0KTtcclxuXHJcbiAgICAgICAgdmFyIHZpZXdlckFyZ3MgPSB7fSwgb3BlcmF0aW9ucyA9IHt9LCB0eXBlcyA9IHt9O1xyXG4gICAgICAgIG9wZXJhdGlvbk5hbWVzLmZvckVhY2gobmFtZSA9PiB7XHJcbiAgICAgICAgICAgIHZpZXdlckFyZ3NbbmFtZV0gPSB7fTtcclxuICAgICAgICAgICAgdmFyIGFxVmlld2VyID0gdGhpcy5nZXRBdXRvUXVlcnlWaWV3ZXIobmFtZSk7XHJcbiAgICAgICAgICAgIGlmIChhcVZpZXdlciAmJiBhcVZpZXdlci5hcmdzKSB7XHJcbiAgICAgICAgICAgICAgICBhcVZpZXdlci5hcmdzLmZvckVhY2goYXJnID0+IHZpZXdlckFyZ3NbbmFtZV1bYXJnLm5hbWVdID0gYXJnLnZhbHVlKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgb3BlcmF0aW9uc1tuYW1lXSA9IHRoaXMucHJvcHMubWV0YWRhdGEub3BlcmF0aW9ucy5maWx0ZXIob3AgPT4gb3AucmVxdWVzdCA9PT0gbmFtZSlbMF07XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHRoaXMucHJvcHMubWV0YWRhdGEudHlwZXMuZm9yRWFjaCh0ID0+IHR5cGVzW3QubmFtZV0gPSB0KTtcclxuXHJcbiAgICAgICAgdmFyIG9wZXJhdGlvblN0YXRlID0ge307XHJcbiAgICAgICAgdmFyIGpzb24gPSBsb2NhbFN0b3JhZ2UuZ2V0SXRlbShcInYxL29wZXJhdGlvblN0YXRlXCIpO1xyXG4gICAgICAgIGlmIChqc29uKVxyXG4gICAgICAgICAgICBvcGVyYXRpb25TdGF0ZSA9IEpTT04ucGFyc2UoanNvbik7XHJcblxyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7XHJcbiAgICAgICAgICAgIHNpZGViYXJIaWRkZW46IGZhbHNlLCBzZWxlY3RlZDogbnVsbCwgXHJcbiAgICAgICAgICAgIG9wZXJhdGlvblN0YXRlLCBvcGVyYXRpb25OYW1lcywgdmlld2VyQXJncywgb3BlcmF0aW9ucywgdHlwZXNcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIHJlc29sdmVQcm9wZXJ0aWVzKHR5cGUpIHtcclxuICAgICAgICB2YXIgcHJvcHMgPSAodHlwZS5wcm9wZXJ0aWVzIHx8IFtdKS5zbGljZSgwKTtcclxuXHJcbiAgICAgICAgbGV0IGluaGVyaXRzID0gdHlwZS5pbmhlcml0cztcclxuICAgICAgICB3aGlsZSAoaW5oZXJpdHMpIHtcclxuICAgICAgICAgICAgY29uc3QgdCA9IHRoaXMuc3RhdGUudHlwZXNbaW5oZXJpdHMubmFtZV07XHJcbiAgICAgICAgICAgIGlmICghdCAmJiAhdC5wcm9wZXJ0aWVzKSBjb250aW51ZTtcclxuICAgICAgICAgICAgdC5wcm9wZXJ0aWVzLmZvckVhY2gocCA9PiBwcm9wcy5wdXNoKHApKTtcclxuICAgICAgICAgICAgaW5oZXJpdHMgPSB0LmluaGVyaXRzO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHByb3BzO1xyXG4gICAgfVxyXG5cclxuICAgIHRvZ2dsZVNpZGViYXIoKSB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHNpZGViYXJIaWRkZW46ICF0aGlzLnN0YXRlLnNpZGViYXJIaWRkZW4gfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0VHlwZShuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wcm9wcy5tZXRhZGF0YS50eXBlcy5maWx0ZXIob3AgPT4gb3AubmFtZSA9PT0gbmFtZSlbMF07XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0QXV0b1F1ZXJ5Vmlld2VyKG5hbWU6c3RyaW5nKSB7XHJcbiAgICAgICAgY29uc3QgdHlwZSA9IHRoaXMuZ2V0VHlwZShuYW1lKTtcclxuICAgICAgICByZXR1cm4gdHlwZSAhPSBudWxsICYmIHR5cGUuYXR0cmlidXRlcyAhPSBudWxsXHJcbiAgICAgICAgICAgID8gdHlwZS5hdHRyaWJ1dGVzLmZpbHRlcihhdHRyID0+IGF0dHIubmFtZSA9PT0gXCJBdXRvUXVlcnlWaWV3ZXJcIilbMF1cclxuICAgICAgICAgICAgOiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEF1dG9RdWVyeVZpZXdlckFyZ1ZhbHVlKG5hbWU6c3RyaW5nLCBhcmdOYW1lOnN0cmluZykge1xyXG4gICAgICAgIHZhciBhcVZpZXdlciA9IHRoaXMuZ2V0QXV0b1F1ZXJ5Vmlld2VyKG5hbWUpO1xyXG4gICAgICAgIHZhciBhcmcgPSBhcVZpZXdlclxyXG4gICAgICAgICAgICA/IGFxVmlld2VyLmFyZ3MuZmlsdGVyKHggPT4geC5uYW1lID09PSBhcmdOYW1lKVswXVxyXG4gICAgICAgICAgICA6IG51bGw7XHJcbiAgICAgICAgcmV0dXJuIGFyZyAhPSBudWxsXHJcbiAgICAgICAgICAgID8gYXJnLnZhbHVlXHJcbiAgICAgICAgICAgIDogbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBnZXRUaXRsZShzZWxlY3RlZCkge1xyXG4gICAgICAgIHJldHVybiBzZWxlY3RlZFxyXG4gICAgICAgICAgICA/IHRoaXMuZ2V0QXV0b1F1ZXJ5Vmlld2VyQXJnVmFsdWUoc2VsZWN0ZWQubmFtZSwgJ1RpdGxlJykgfHwgc2VsZWN0ZWQubmFtZVxyXG4gICAgICAgICAgICA6IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0T3BlcmF0aW9uVmFsdWVzKG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIGNvbnN0IHZpZXdlckFyZ3MgPSB0aGlzLnN0YXRlLnZpZXdlckFyZ3NbbmFtZV0gfHwge307XHJcbiAgICAgICAgcmV0dXJuIE9iamVjdC5hc3NpZ24oe1xyXG4gICAgICAgICAgICBzZWFyY2hGaWVsZDogdmlld2VyQXJnc1tcIkRlZmF1bHRTZWFyY2hGaWVsZFwiXSB8fCBcIlwiLFxyXG4gICAgICAgICAgICBzZWFyY2hUeXBlOiB2aWV3ZXJBcmdzW1wiRGVmYXVsdFNlYXJjaFR5cGVcIl0gfHwgXCJcIixcclxuICAgICAgICAgICAgc2VhcmNoVGV4dDogdmlld2VyQXJnc1tcIkRlZmF1bHRTZWFyY2hUZXh0XCJdLFxyXG4gICAgICAgICAgICBjb25kaXRpb25zOiBbXSxcclxuICAgICAgICAgICAgcXVlcmllczogW11cclxuICAgICAgICB9LCB0aGlzLnN0YXRlLm9wZXJhdGlvblN0YXRlW25hbWVdIHx8IHt9KTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRTZWxlY3RlZChuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICBjb25zdCBvcGVyYXRpb24gPSB0aGlzLnN0YXRlLm9wZXJhdGlvbnNbbmFtZV07XHJcbiAgICAgICAgaWYgKG9wZXJhdGlvbiA9PSBudWxsKVxyXG4gICAgICAgICAgICByZXR1cm4gbnVsbDtcclxuICAgICAgICBjb25zdCByZXF1ZXN0VHlwZSA9IHRoaXMuc3RhdGUudHlwZXNbbmFtZV07XHJcbiAgICAgICAgY29uc3QgZnJvbVR5cGUgPSB0aGlzLnN0YXRlLnR5cGVzW29wZXJhdGlvbi5mcm9tXTtcclxuICAgICAgICBjb25zdCB0b1R5cGUgPSB0aGlzLnN0YXRlLnR5cGVzW29wZXJhdGlvbi50b107XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgbmFtZSwgb3BlcmF0aW9uLCByZXF1ZXN0VHlwZSxcclxuICAgICAgICAgICAgZnJvbVR5cGUsIGZyb21UeXBlRmllbGRzOiB0aGlzLnJlc29sdmVQcm9wZXJ0aWVzKHRvVHlwZSksXHJcbiAgICAgICAgICAgIHRvVHlwZSwgdG9UeXBlRmllbGRzOiB0aGlzLnJlc29sdmVQcm9wZXJ0aWVzKHRvVHlwZSlcclxuICAgICAgICB9O1xyXG4gICAgfVxyXG5cclxuICAgIG9uT3BlcmF0aW9uQ2hhbmdlKG9wTmFtZTogc3RyaW5nLCBuZXdWYWx1ZXM6IGFueSkge1xyXG4gICAgICAgIGNvbnN0IG9wID0gdGhpcy5nZXRPcGVyYXRpb25WYWx1ZXMob3BOYW1lKTtcclxuXHJcbiAgICAgICAgT2JqZWN0LmtleXMobmV3VmFsdWVzKS5mb3JFYWNoKGsgPT4ge1xyXG4gICAgICAgICAgICBpZiAobmV3VmFsdWVzW2tdICE9IG51bGwpXHJcbiAgICAgICAgICAgICAgICBvcFtrXSA9IG5ld1ZhbHVlc1trXTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRPcGVyYXRpb25WYWx1ZXMob3BOYW1lLCBvcCk7XHJcbiAgICB9XHJcblxyXG4gICAgYWRkQ29uZGl0aW9uKG9wTmFtZTpzdHJpbmcpIHtcclxuICAgICAgICBjb25zdCBvcCA9IHRoaXMuZ2V0T3BlcmF0aW9uVmFsdWVzKG9wTmFtZSk7XHJcbiAgICAgICAgY29uc3QgY29uZGl0aW9uID0ge1xyXG4gICAgICAgICAgICBpZDogYCR7b3Auc2VhcmNoRmllbGR9fCR7b3Auc2VhcmNoVHlwZX18JHtvcC5zZWFyY2hUZXh0fWAsXHJcbiAgICAgICAgICAgIHNlYXJjaEZpZWxkOiBvcC5zZWFyY2hGaWVsZCxcclxuICAgICAgICAgICAgc2VhcmNoVHlwZTogb3Auc2VhcmNoVHlwZSxcclxuICAgICAgICAgICAgc2VhcmNoVGV4dDogb3Auc2VhcmNoVGV4dFxyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIGlmIChvcC5jb25kaXRpb25zLnNvbWUoeCA9PiB4LmlkID09PSBjb25kaXRpb24uaWQpKVxyXG4gICAgICAgICAgICByZXR1cm47XHJcblxyXG4gICAgICAgIG9wLnNlYXJjaFRleHQgPSBcIlwiO1xyXG4gICAgICAgIG9wLmNvbmRpdGlvbnMucHVzaChjb25kaXRpb24pO1xyXG5cclxuICAgICAgICB0aGlzLnNldE9wZXJhdGlvblZhbHVlcyhvcE5hbWUsIG9wKTtcclxuICAgIH1cclxuXHJcbiAgICByZW1vdmVDb25kaXRpb24ob3BOYW1lOiBzdHJpbmcsIGNvbmRpdGlvbjphbnkpIHtcclxuICAgICAgICBjb25zdCBvcCA9IHRoaXMuZ2V0T3BlcmF0aW9uVmFsdWVzKG9wTmFtZSk7XHJcbiAgICAgICAgb3AuY29uZGl0aW9ucyA9IG9wLmNvbmRpdGlvbnMuZmlsdGVyKHggPT4geC5pZCAhPT0gY29uZGl0aW9uLmlkKTtcclxuICAgICAgICB0aGlzLnNldE9wZXJhdGlvblZhbHVlcyhvcE5hbWUsIG9wKTtcclxuICAgIH1cclxuXHJcbiAgICBzZXRPcGVyYXRpb25WYWx1ZXMob3BOYW1lLCBvcCkge1xyXG4gICAgICAgIHZhciBvcGVyYXRpb25TdGF0ZSA9IE9iamVjdC5hc3NpZ24oe30sIHRoaXMuc3RhdGUub3BlcmF0aW9uU3RhdGUpO1xyXG4gICAgICAgIG9wZXJhdGlvblN0YXRlW29wTmFtZV0gPSBvcDtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgb3BlcmF0aW9uU3RhdGUgfSk7XHJcbiAgICAgICAgbG9jYWxTdG9yYWdlLnNldEl0ZW0oXCJ2MS9vcGVyYXRpb25TdGF0ZVwiLCBKU09OLnN0cmluZ2lmeShvcGVyYXRpb25TdGF0ZSkpO1xyXG4gICAgfVxyXG5cclxuICAgIHNob3dEaWFsb2coZGlhbG9nKSB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGRpYWxvZyB9KTtcclxuICAgICAgICBzZXRUaW1lb3V0KCgpID0+IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKGRpYWxvZykuY2xhc3NMaXN0LnRvZ2dsZSgnYWN0aXZlJyksIDApO1xyXG4gICAgfVxyXG5cclxuICAgIGhpZGVEaWFsb2coKSB7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IGRpYWxvZzogbnVsbCB9KTtcclxuICAgIH1cclxuXHJcbiAgICBzYXZlUXVlcnkob3BOYW1lOnN0cmluZykge1xyXG4gICAgICAgIGNvbnN0IG5hbWUgPSBwcm9tcHQoXCJTYXZlIFF1ZXJ5IGFzOlwiLCBcIk15IFF1ZXJ5XCIpO1xyXG4gICAgICAgIGlmICghbmFtZSkgcmV0dXJuO1xyXG5cclxuICAgICAgICBjb25zdCBvcCA9IHRoaXMuZ2V0T3BlcmF0aW9uVmFsdWVzKG9wTmFtZSk7XHJcbiAgICAgICAgaWYgKCFvcC5xdWVyaWVzKSB7XHJcbiAgICAgICAgICAgIG9wLnF1ZXJpZXMgPSBbXTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIG9wLnF1ZXJpZXMucHVzaCh7XHJcbiAgICAgICAgICAgIG5hbWUsXHJcbiAgICAgICAgICAgIHNlYXJjaEZpZWxkOiBvcC5zZWFyY2hGaWVsZCxcclxuICAgICAgICAgICAgc2VhcmNoVHlwZTogb3Auc2VhcmNoVHlwZSxcclxuICAgICAgICAgICAgc2VhcmNoVGV4dDogb3Auc2VhcmNoVGV4dCxcclxuICAgICAgICAgICAgY29uZGl0aW9uczogb3AuY29uZGl0aW9ucy5tYXAoeCA9PiBPYmplY3QuYXNzaWduKHt9LCB4KSlcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5zZXRPcGVyYXRpb25WYWx1ZXMob3BOYW1lLCBvcCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVtb3ZlUXVlcnkob3BOYW1lOiBzdHJpbmcsIHF1ZXJ5OiBhbnkpIHtcclxuICAgICAgICBjb25zdCBvcCA9IHRoaXMuZ2V0T3BlcmF0aW9uVmFsdWVzKG9wTmFtZSk7XHJcbiAgICAgICAgaWYgKCFvcC5xdWVyaWVzKSByZXR1cm47XHJcbiAgICAgICAgb3AucXVlcmllcyA9IG9wLnF1ZXJpZXMuZmlsdGVyKHggPT4geC5uYW1lICE9IHF1ZXJ5Lm5hbWUpO1xyXG4gICAgICAgIHRoaXMuc2V0T3BlcmF0aW9uVmFsdWVzKG9wTmFtZSwgb3ApO1xyXG4gICAgfVxyXG5cclxuICAgIGxvYWRRdWVyeShvcE5hbWU6IHN0cmluZywgcXVlcnk6IGFueSkge1xyXG4gICAgICAgIGNvbnN0IG9wID0gdGhpcy5nZXRPcGVyYXRpb25WYWx1ZXMob3BOYW1lKTtcclxuICAgICAgICBvcC5zZWFyY2hGaWVsZCA9IHF1ZXJ5LnNlYXJjaEZpZWxkO1xyXG4gICAgICAgIG9wLnNlYXJjaFR5cGUgPSBxdWVyeS5zZWFyY2hUeXBlO1xyXG4gICAgICAgIG9wLnNlYXJjaFRleHQgPSBxdWVyeS5zZWFyY2hUZXh0O1xyXG4gICAgICAgIG9wLmNvbmRpdGlvbnMgPSBxdWVyeS5jb25kaXRpb25zO1xyXG4gICAgICAgIHRoaXMuc2V0T3BlcmF0aW9uVmFsdWVzKG9wTmFtZSwgb3ApO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICB2YXIgc2VsZWN0ZWQgPSB0aGlzLmdldFNlbGVjdGVkKHRoaXMucHJvcHMubmFtZSk7XHJcbiAgICAgICAgdmFyIG9wTmFtZSA9IHNlbGVjdGVkICYmIHNlbGVjdGVkLm5hbWU7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBoZWlnaHQ6ICcxMDAlJyB9fT5cclxuICAgICAgICAgICAgICAgIDxIZWFkZXIgdGl0bGU9e3RoaXMuZ2V0VGl0bGUoc2VsZWN0ZWQpfSBvblNpZGViYXJUb2dnbGU9e2UgPT4gdGhpcy50b2dnbGVTaWRlYmFyKCkgfSAvPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBpZD1cImJvZHlcIiBjbGFzc05hbWU9e3RoaXMuc3RhdGUuc2lkZWJhckhpZGRlbiA/ICdoaWRlLXNpZGViYXInIDogJyd9PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5uZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPFNpZGViYXJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5hbWU9e29wTmFtZX0gICAgICAgICAgICAgICAgICAgICAgICBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZpZXdlckFyZ3M9e3RoaXMuc3RhdGUudmlld2VyQXJnc31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZXJhdGlvbnM9e3RoaXMuc3RhdGUub3BlcmF0aW9uc31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxDb250ZW50XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb25maWc9e3RoaXMucHJvcHMubWV0YWRhdGEuY29uZmlnfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdXNlcmluZm89e3RoaXMucHJvcHMubWV0YWRhdGEudXNlcmluZm99XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZD17c2VsZWN0ZWR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZXM9e3RoaXMuZ2V0T3BlcmF0aW9uVmFsdWVzKHRoaXMucHJvcHMubmFtZSl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjb252ZW50aW9ucz17dGhpcy5wcm9wcy5tZXRhZGF0YS5jb25maWcuaW1wbGljaXRjb252ZW50aW9uc31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZpZXdlckFyZ3M9e3RoaXMuc3RhdGUudmlld2VyQXJnc1tvcE5hbWVdfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e2FyZ3MgPT4gdGhpcy5vbk9wZXJhdGlvbkNoYW5nZShvcE5hbWUsIGFyZ3MpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25BZGRDb25kaXRpb249e2UgPT4gdGhpcy5hZGRDb25kaXRpb24ob3BOYW1lKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uUmVtb3ZlQ29uZGl0aW9uPXtjID0+IHRoaXMucmVtb3ZlQ29uZGl0aW9uKG9wTmFtZSwgYykgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25TaG93RGlhbG9nPXtpZCA9PiB0aGlzLnNob3dEaWFsb2coaWQpIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uU2F2ZVF1ZXJ5PXsoKSA9PiB0aGlzLnNhdmVRdWVyeShvcE5hbWUpIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uUmVtb3ZlUXVlcnk9e3ggPT4gdGhpcy5yZW1vdmVRdWVyeShvcE5hbWUsIHgpIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uTG9hZFF1ZXJ5PXt4ID0+IHRoaXMubG9hZFF1ZXJ5KG9wTmFtZSwgeCkgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgIHt0aGlzLnN0YXRlLmRpYWxvZyAhPT0gXCJjb2x1bW4tcHJlZnMtZGlhbG9nXCIgPyBudWxsIDogKFxyXG4gICAgICAgICAgICAgICAgICAgIDxDb2x1bW5QcmVmc0RpYWxvZyBvbkNsb3NlPXtlID0+IHRoaXMuaGlkZURpYWxvZygpIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZmllbGRzPXtzZWxlY3RlZC50b1R5cGVGaWVsZHN9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlcz17dGhpcy5nZXRPcGVyYXRpb25WYWx1ZXModGhpcy5wcm9wcy5uYW1lKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e2FyZ3MgPT4gdGhpcy5vbk9wZXJhdGlvbkNoYW5nZShvcE5hbWUsIGFyZ3MpIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL0F1dG9RdWVyeS50c3giLCJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7IHJlbmRlciB9IGZyb20gJ3JlYWN0LWRvbSc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBDb2x1bW5QcmVmc0RpYWxvZyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudDxhbnksIGFueT4ge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHM/LCBjb250ZXh0Pykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzLCBjb250ZXh0KTtcclxuICAgICAgICB0aGlzLnN0YXRlID0ge307XHJcbiAgICB9XHJcblxyXG4gICAgcmVzZXRGaWVsZHMoKSB7XHJcbiAgICAgICAgdmFyIGZpZWxkcyA9IFtdO1xyXG4gICAgICAgIHRoaXMucHJvcHMub25DaGFuZ2UoeyBmaWVsZHMgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2VsZWN0RmllbGQoZmllbGQpIHtcclxuICAgICAgICBsZXQgZmllbGRzID0gKHRoaXMucHJvcHMudmFsdWVzLmZpZWxkcyB8fCBbXSk7XHJcblxyXG4gICAgICAgIGlmIChmaWVsZHMuaW5kZXhPZihmaWVsZCkgPj0gMClcclxuICAgICAgICAgICAgZmllbGRzID0gZmllbGRzLmZpbHRlcih4ID0+IHggIT09IGZpZWxkKTtcclxuICAgICAgICBlbHNlXHJcbiAgICAgICAgICAgIGZpZWxkcy5wdXNoKGZpZWxkKTtcclxuXHJcbiAgICAgICAgdGhpcy5wcm9wcy5vbkNoYW5nZSh7IGZpZWxkcyB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgdmFyIGZpZWxkcyA9ICh0aGlzLnByb3BzLnZhbHVlcy5maWVsZHMgfHwgW10pO1xyXG5cclxuICAgICAgICB2YXIgQ2hlY2tib3hTdHlsZSA9IHtcclxuICAgICAgICAgICAgdmVydGljYWxBbGlnbjogJ3RleHQtYm90dG9tJywgZm9udFNpemU6ICcyMHB4JywgbWFyZ2luOiAnMCA1cHggMCAwJ1xyXG4gICAgICAgIH07XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgaWQ9XCJjb2x1bW4tcHJlZnMtZGlhbG9nXCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImRpYWxvZy13cmFwcGVyXCIgb25DbGljaz17ZSA9PiB0aGlzLnByb3BzLm9uQ2xvc2UoKX0+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJkaWFsb2dcIiBvbkNsaWNrPXtlID0+IGUuc3RvcFByb3BhZ2F0aW9uKCkgfT5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZGlhbG9nLWhlYWRlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGgzPkNvbHVtbiBQcmVmZXJlbmNlczwvaDM+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJkaWFsb2ctYm9keVwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBvbkNsaWNrPXtlID0+IHRoaXMucmVzZXRGaWVsZHMoKX0gc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJvcmRlckJvdHRvbTogJzFweCBzb2xpZCAjY2NjJywgcGFkZGluZzogJzAgMCAxMHB4IDAnLCBtYXJnaW46ICcwIDAgMTVweCAwJywgY3Vyc29yOiAncG9pbnRlcidcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJtYXRlcmlhbC1pY29uc1wiIHN0eWxlPXtDaGVja2JveFN0eWxlfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2ZpZWxkcy5sZW5ndGggPT09IDAgPyAncmFkaW9fYnV0dG9uX2NoZWNrZWQnIDogJ3JhZGlvX2J1dHRvbl91bmNoZWNrZWQnfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvaT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj5TaG93IGFsbCBjb2x1bW5zPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3RoaXMucHJvcHMuZmllbGRzLm1hcChmID0+IChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IG9uQ2xpY2s9e2UgPT4gdGhpcy5zZWxlY3RGaWVsZChmLm5hbWUpfSBzdHlsZT17eyBtYXJnaW46ICcwIDAgNXB4IDAnLCBjdXJzb3I6ICdwb2ludGVyJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwibWF0ZXJpYWwtaWNvbnNcIiAgc3R5bGU9e0NoZWNrYm94U3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2ZpZWxkcy5pbmRleE9mKGYubmFtZSkgPj0gMCA/ICdjaGVja19ib3gnIDogJ2NoZWNrX2JveF9vdXRsaW5lX2JsYW5rJ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvaT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+e2YubmFtZX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImRpYWxvZy1mb290ZXJcIiBzdHlsZT17e3RleHRBbGlnbjoncmlnaHQnfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImJ0blRleHRcIiBvbkNsaWNrPXtlID0+IHRoaXMucHJvcHMub25DbG9zZSgpfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj5ET05FPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvQ29sdW1uUHJlZnNEaWFsb2cudHN4IiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgUmVzdWx0cyBmcm9tICcuL1Jlc3VsdHMnO1xyXG5cclxuaW1wb3J0IHsgY29tYmluZVBhdGhzLCBjcmVhdGVVcmwsIHNwbGl0T25GaXJzdCB9IGZyb20gJ3NlcnZpY2VzdGFjay1jbGllbnQnO1xyXG5pbXBvcnQgeyBjbGllbnQsIG5vcm1hbGl6ZSwgcGFyc2VSZXNwb25zZVN0YXR1cyB9IGZyb20gJy4vc2hhcmVkJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbnRlbnQgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQ8YW55LCBhbnk+IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzPywgY29udGV4dD8pIHtcclxuICAgICAgICBzdXBlcihwcm9wcywgY29udGV4dCk7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHsgcmVzdWx0czogbnVsbCB9O1xyXG4gICAgfVxyXG5cclxuICAgIHNlbGVjdEZpZWxkKGUpIHtcclxuICAgICAgICB2YXIgc2VhcmNoRmllbGQgPSBlLnRhcmdldC5vcHRpb25zW2UudGFyZ2V0LnNlbGVjdGVkSW5kZXhdLnZhbHVlLFxyXG4gICAgICAgICAgICBzZWFyY2hUeXBlID0gdGhpcy5wcm9wcy52YWx1ZXMuc2VhcmNoVHlwZSxcclxuICAgICAgICAgICAgc2VhcmNoVGV4dCA9IHRoaXMucHJvcHMudmFsdWVzLnNlYXJjaFRleHQ7XHJcblxyXG4gICAgICAgIGNvbnN0IGYgPSB0aGlzLmdldFNlYXJjaEZpZWxkKHNlYXJjaEZpZWxkKTtcclxuICAgICAgICBpZiAodGhpcy5pc0ludEZpZWxkKGYpKSB7XHJcbiAgICAgICAgICAgIGlmIChpc05hTihzZWFyY2hUZXh0KSlcclxuICAgICAgICAgICAgICAgIHNlYXJjaFRleHQgPSAnJztcclxuICAgICAgICAgICAgY29uc3QgY29udmVudGlvbiA9IHRoaXMucHJvcHMuY29udmVudGlvbnMuZmlsdGVyKGMgPT4gYy5uYW1lID09PSBzZWFyY2hUeXBlKVswXTtcclxuICAgICAgICAgICAgaWYgKCF0aGlzLm1hdGNoZXNDb252ZW50aW9uKGNvbnZlbnRpb24sIGYudHlwZSkpXHJcbiAgICAgICAgICAgICAgICBzZWFyY2hUeXBlID0gJyc7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLnByb3BzLm9uQ2hhbmdlKHsgc2VhcmNoRmllbGQsIHNlYXJjaFR5cGUsIHNlYXJjaFRleHQgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2VsZWN0T3BlcmFuZChlKSB7XHJcbiAgICAgICAgdGhpcy5wcm9wcy5vbkNoYW5nZSh7IHNlYXJjaFR5cGU6IGUudGFyZ2V0Lm9wdGlvbnNbZS50YXJnZXQuc2VsZWN0ZWRJbmRleF0udmFsdWUgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgY2hhbmdlVGV4dChlKSB7XHJcbiAgICAgICAgdGhpcy5wcm9wcy5vbkNoYW5nZSh7IHNlYXJjaFRleHQ6IGUudGFyZ2V0LnZhbHVlfSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2VsZWN0Rm9ybWF0KGZvcm1hdCkge1xyXG4gICAgICAgIGlmIChmb3JtYXQgPT09IHRoaXMucHJvcHMudmFsdWVzLmZvcm1hdCkgLy90b2dnbGVcclxuICAgICAgICAgICAgZm9ybWF0ID0gXCJcIjtcclxuXHJcbiAgICAgICAgdGhpcy5wcm9wcy5vbkNoYW5nZSh7IGZvcm1hdCB9KTtcclxuICAgIH1cclxuXHJcbiAgICBjbGVhcigpIHtcclxuICAgICAgICB0aGlzLnByb3BzLm9uQ2hhbmdlKHtcclxuICAgICAgICAgICAgc2VhcmNoRmllbGQ6IG51bGwsIHNlYXJjaFR5cGU6IG51bGwsIHNlYXJjaFRleHQ6ICcnLCBmb3JtYXQ6ICcnLCBvcmRlckJ5OiAnJywgb2Zmc2V0OiAwLFxyXG4gICAgICAgICAgICBmaWVsZHM6IFtdLCBjb25kaXRpb25zOiBbXVxyXG4gICAgICAgIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGdldEF1dG9RdWVyeVVybChmb3JtYXQ6c3RyaW5nKSB7XHJcbiAgICAgICAgY29uc3QgZmlyc3RSb3V0ZSA9ICh0aGlzLnByb3BzLnNlbGVjdGVkLnJlcXVlc3RUeXBlLnJvdXRlcyB8fCBbXSkuZmlsdGVyKHggPT4geC5wYXRoLmluZGV4T2YoJ3snKSA9PT0gLTEpWzBdO1xyXG5cclxuICAgICAgICBjb25zdCBwYXRoID0gZmlyc3RSb3V0ZVxyXG4gICAgICAgICAgICA/IGZpcnN0Um91dGUucGF0aFxyXG4gICAgICAgICAgICA6IGAvJHtmb3JtYXQgfHwgJ2h0bWwnfS9yZXBseS9gICsgdGhpcy5wcm9wcy5zZWxlY3RlZC5yZXF1ZXN0VHlwZS5uYW1lO1xyXG5cclxuICAgICAgICB2YXIgdXJsID0gY29tYmluZVBhdGhzKHRoaXMucHJvcHMuY29uZmlnLnNlcnZpY2ViYXNldXJsLCBwYXRoKTtcclxuXHJcbiAgICAgICAgaWYgKGZpcnN0Um91dGUgJiYgZm9ybWF0KVxyXG4gICAgICAgICAgICB1cmwgKz0gXCIuXCIgKyBmb3JtYXQ7XHJcblxyXG4gICAgICAgIHRoaXMuZ2V0QXJncygpLmZvckVhY2goYXJnID0+XHJcbiAgICAgICAgICAgIHVybCA9IGNyZWF0ZVVybCh1cmwsIGFyZykpO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5wcm9wcy52YWx1ZXMub2Zmc2V0KVxyXG4gICAgICAgICAgICB1cmwgPSBjcmVhdGVVcmwodXJsLCB7IHNraXA6IHRoaXMucHJvcHMudmFsdWVzLm9mZnNldCB9KTtcclxuXHJcbiAgICAgICAgaWYgKHRoaXMucHJvcHMudmFsdWVzLm9yZGVyQnkpXHJcbiAgICAgICAgICAgIHVybCA9IGNyZWF0ZVVybCh1cmwsIHsgb3JkZXJCeTogdGhpcy5wcm9wcy52YWx1ZXMub3JkZXJCeSB9KTtcclxuXHJcbiAgICAgICAgaWYgKCh0aGlzLnByb3BzLnZhbHVlcy5maWVsZHMgfHwgW10pLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgdXJsID0gY3JlYXRlVXJsKHVybCwgeyBmaWVsZHM6IHRoaXMucHJvcHMudmFsdWVzLmZpZWxkcy5qb2luKCcsJykgfSk7XHJcblxyXG4gICAgICAgICAgICBpZiAoIWZvcm1hdCB8fCBmb3JtYXQgPT09ICdodG1sJylcclxuICAgICAgICAgICAgICAgIHVybCA9IGNyZWF0ZVVybCh1cmwsIHsganNjb25maWc6ICdlZHYnIH0pO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdXJsID0gY3JlYXRlVXJsKHVybCwgeyBpbmNsdWRlOiBcIlRvdGFsXCIgfSk7XHJcblxyXG4gICAgICAgIHVybCA9IHVybC5yZXBsYWNlKC8lMkMvZywgXCIsXCIpO1xyXG5cclxuICAgICAgICByZXR1cm4gdXJsO1xyXG4gICAgfVxyXG5cclxuICAgIGlzVmFsaWRDb25kaXRpb24oKSB7XHJcbiAgICAgICAgY29uc3QgeyBzZWFyY2hGaWVsZCwgc2VhcmNoVHlwZSwgc2VhcmNoVGV4dCB9ID0gdGhpcy5wcm9wcy52YWx1ZXM7XHJcbiAgICAgICAgcmV0dXJuIHNlYXJjaEZpZWxkICYmIHNlYXJjaFR5cGUgJiYgc2VhcmNoVGV4dFxyXG4gICAgICAgICAgICAmJiAoc2VhcmNoVHlwZS50b0xvd2VyQ2FzZSgpICE9PSAnYmV0d2VlbicgfHwgKHNlYXJjaFRleHQuaW5kZXhPZignLCcpID4gMCAmJiBzZWFyY2hUZXh0LmluZGV4T2YoJywnKSA8IHNlYXJjaFRleHQubGVuZ3RoIC0xKSk7XHJcbiAgICB9XHJcblxyXG4gICAgaXNEaXJ0eSgpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5pc1ZhbGlkQ29uZGl0aW9uKClcclxuICAgICAgICAgICAgfHwgdGhpcy5wcm9wcy52YWx1ZXMuZm9ybWF0XHJcbiAgICAgICAgICAgIHx8IHRoaXMucHJvcHMudmFsdWVzLm9mZnNldFxyXG4gICAgICAgICAgICB8fCAodGhpcy5wcm9wcy52YWx1ZXMuZmllbGRzIHx8IFtdKS5sZW5ndGggPiAwXHJcbiAgICAgICAgICAgIHx8IHRoaXMucHJvcHMudmFsdWVzLm9yZGVyQnlcclxuICAgICAgICAgICAgfHwgKHRoaXMucHJvcHMudmFsdWVzLmNvbmRpdGlvbnMgfHwgW10pLmxlbmd0aCA+IDA7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0QXJncygpIHtcclxuICAgICAgICB2YXIgYXJncyA9IFtdO1xyXG4gICAgICAgIHZhciBjb25kaXRpb25zID0gKHRoaXMucHJvcHMudmFsdWVzLmNvbmRpdGlvbnMgfHwgW10pLnNsaWNlKDApO1xyXG4gICAgICAgIGlmICh0aGlzLmlzVmFsaWRDb25kaXRpb24oKSkge1xyXG4gICAgICAgICAgICBjb25kaXRpb25zLnB1c2godGhpcy5wcm9wcy52YWx1ZXMpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgY29uZGl0aW9ucy5mb3JFYWNoKGNvbmRpdGlvbiA9PiB7XHJcbiAgICAgICAgICAgIGNvbnN0IHsgc2VhcmNoRmllbGQsIHNlYXJjaFR5cGUsIHNlYXJjaFRleHQgfSA9IGNvbmRpdGlvbjtcclxuICAgICAgICAgICAgdmFyIGNvbnZlbnRpb24gPSB0aGlzLnByb3BzLmNvbnZlbnRpb25zLmZpbHRlcihjID0+IGMubmFtZSA9PT0gc2VhcmNoVHlwZSlbMF07XHJcbiAgICAgICAgICAgIGlmIChjb252ZW50aW9uKSB7XHJcbiAgICAgICAgICAgICAgICBjb25zdCBmaWVsZCA9IGNvbnZlbnRpb24udmFsdWUucmVwbGFjZShcIiVcIiwgc2VhcmNoRmllbGQpO1xyXG4gICAgICAgICAgICAgICAgYXJncy5wdXNoKHsgW2ZpZWxkXTogc2VhcmNoVGV4dCB9KTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICByZXR1cm4gYXJncztcclxuICAgIH1cclxuXHJcbiAgICBnZXRTZWFyY2hGaWVsZChuYW1lOiBzdHJpbmcpIHtcclxuICAgICAgICByZXR1cm4gdGhpcy5wcm9wcy5zZWxlY3RlZC5mcm9tVHlwZUZpZWxkcy5maWx0ZXIoZiA9PiBmLm5hbWUgPT09IG5hbWUpWzBdO1xyXG4gICAgfVxyXG5cclxuICAgIGlzSW50RmllbGQoZikge1xyXG4gICAgICAgIHJldHVybiBmICYmIChmLnR5cGUgfHwgJycpLnRvTG93ZXJDYXNlKCkuc3RhcnRzV2l0aCgnaW50Jyk7XHJcbiAgICB9XHJcblxyXG4gICAgbWF0Y2hlc0NvbnZlbnRpb24oY29udmVudGlvbiwgZmllbGRUeXBlKSB7XHJcbiAgICAgICAgcmV0dXJuICFjb252ZW50aW9uIHx8ICFjb252ZW50aW9uLnR5cGVzIHx8ICFmaWVsZFR5cGUgfHxcclxuICAgICAgICAgICAgY29udmVudGlvbi50eXBlcy5yZXBsYWNlKC8gL2csICcnKS50b0xvd2VyQ2FzZSgpLnNwbGl0KCcsJykuaW5kZXhPZihmaWVsZFR5cGUudG9Mb3dlckNhc2UoKSkgPj0gMDtcclxuICAgIH1cclxuXHJcbiAgICBnZXRDb252ZW50aW9ucygpIHtcclxuICAgICAgICBjb25zdCB2YWx1ZXMgPSB0aGlzLnByb3BzLnZhbHVlcztcclxuICAgICAgICBpZiAodmFsdWVzICYmIHZhbHVlcy5zZWFyY2hGaWVsZCkge1xyXG4gICAgICAgICAgICBjb25zdCBmID0gdGhpcy5nZXRTZWFyY2hGaWVsZCh2YWx1ZXMuc2VhcmNoRmllbGQpO1xyXG4gICAgICAgICAgICBpZiAoZikge1xyXG4gICAgICAgICAgICAgICAgcmV0dXJuIHRoaXMucHJvcHMuY29udmVudGlvbnMuZmlsdGVyKGMgPT4gdGhpcy5tYXRjaGVzQ29udmVudGlvbihjLCBmLnR5cGUpKTtcclxuICAgICAgICAgICAgfVxyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gdGhpcy5wcm9wcy5jb252ZW50aW9ucztcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXJSZXN1bHRzKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgdmFyIGZpZWxkTmFtZXMgPSBudWxsLCBmaWVsZFdpZHRocyA9IG51bGw7XHJcbiAgICAgICAgdmFyIGZpZWxkRGVmcyA9ICh0aGlzLnByb3BzLnZpZXdlckFyZ3NbXCJEZWZhdWx0RmllbGRzXCJdIHx8IFwiXCIpXHJcbiAgICAgICAgICAgIC5zcGxpdCgnLCcpXHJcbiAgICAgICAgICAgIC5maWx0ZXIoeCA9PiB4LnRyaW0oKS5sZW5ndGggPiAwKTtcclxuXHJcbiAgICAgICAgaWYgKGZpZWxkRGVmcy5sZW5ndGggPiAwKSB7XHJcbiAgICAgICAgICAgIGZpZWxkTmFtZXMgPSBbXSwgZmllbGRXaWR0aHMgPSB7fTtcclxuICAgICAgICAgICAgZmllbGREZWZzLmZvckVhY2goeCA9PiB7XHJcbiAgICAgICAgICAgICAgICB2YXIgcGFydHMgPSBzcGxpdE9uRmlyc3QoeCwgJzonKTtcclxuICAgICAgICAgICAgICAgIGZpZWxkTmFtZXMucHVzaChwYXJ0c1swXSk7XHJcbiAgICAgICAgICAgICAgICBpZiAocGFydHMubGVuZ3RoID4gMSlcclxuICAgICAgICAgICAgICAgICAgICBmaWVsZFdpZHRoc1twYXJ0c1swXV0gPSBwYXJ0c1sxXTtcclxuICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB2YXIgeyBvZmZzZXQsIHJlc3VsdHMsIHRvdGFsIH0gPSByZXNwb25zZSwgbWF4TGltaXQgPSB0aGlzLnByb3BzLmNvbmZpZy5tYXhsaW1pdDtcclxuXHJcbiAgICAgICAgY29uc3QgQ29udHJvbCA9IChuYW1lLCBlbmFibGUsIG9mZnNldCkgPT4gZW5hYmxlXHJcbiAgICAgICAgICAgID8gPGkgY2xhc3NOYW1lPVwibWF0ZXJpYWwtaWNvbnNcIiBzdHlsZT17eyBjdXJzb3I6ICdwb2ludGVyJyB9fSBvbkNsaWNrPXtlID0+IHRoaXMucHJvcHMub25DaGFuZ2UoeyBvZmZzZXQgfSl9PntuYW1lfTwvaT5cclxuICAgICAgICAgICAgOiA8aSBjbGFzc05hbWU9XCJtYXRlcmlhbC1pY29uc1wiIHN0eWxlPXt7IGNvbG9yOiAnI2NjYycgfX0+e25hbWV9PC9pPjtcclxuXHJcbiAgICAgICAgdmFyIFBhZ2luZyA9IChcclxuICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwicGFnaW5nXCIgc3R5bGU9e3twYWRkaW5nOicwIDEwcHggMCAwJ319PlxyXG4gICAgICAgICAgICAgICAge0NvbnRyb2woXCJza2lwX3ByZXZpb3VzXCIsIG9mZnNldCA+IDAsIDApIH1cclxuICAgICAgICAgICAgICAgIHtDb250cm9sKFwiY2hldnJvbl9sZWZ0XCIsIG9mZnNldCA+IDAsIE1hdGgubWF4KG9mZnNldCAtIG1heExpbWl0LCAwKSkgfVxyXG4gICAgICAgICAgICAgICAge0NvbnRyb2woXCJjaGV2cm9uX3JpZ2h0XCIsIG9mZnNldCArIG1heExpbWl0IDwgdG90YWwsIG9mZnNldCArIG1heExpbWl0KSB9XHJcbiAgICAgICAgICAgICAgICB7Q29udHJvbChcInNraXBfbmV4dFwiLCBvZmZzZXQgKyBtYXhMaW1pdCA8IHRvdGFsLCBNYXRoLmZsb29yKCh0b3RhbCAtIDEpIC8gbWF4TGltaXQpICogbWF4TGltaXQpfVxyXG4gICAgICAgICAgICA8L3NwYW4+XHJcbiAgICAgICAgKTtcclxuXHJcbiAgICAgICAgcmV0dXJuIHJlc3BvbnNlLnJlc3VsdHMubGVuZ3RoID09PSAwXHJcbiAgICAgICAgICAgID8gPGRpdiBjbGFzc05hbWU9XCJyZXN1bHRzLW5vbmVcIj5UaGVyZSB3ZXJlIG5vIHJlc3VsdHM8L2Rpdj5cclxuICAgICAgICAgICAgOiAoXHJcbiAgICAgICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibm9zZWxlY3RcIiBzdHlsZT17eyBjb2xvcjogJyM3NTc1NzUnLCBwYWRkaW5nOiAnMTVweCAwJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAge1BhZ2luZ31cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBTaG93aW5nIFJlc3VsdHMge29mZnNldCArIDF9IC0ge29mZnNldCArIHJlc3VsdHMubGVuZ3RofSBvZiB7dG90YWx9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvc3Bhbj5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cIm1hdGVyaWFsLWljb25zXCIgdGl0bGU9XCJzaG93L2hpZGUgY29sdW1uc1wiIG9uQ2xpY2s9e2UgPT4gdGhpcy5wcm9wcy5vblNob3dEaWFsb2coJ2NvbHVtbi1wcmVmcy1kaWFsb2cnKX0gc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZlcnRpY2FsQWxpZ246ICd0ZXh0LWJvdHRvbScsIG1hcmdpbjogJzAgMCAwIDEwcHgnLCBjdXJzb3I6ICdwb2ludGVyJywgZm9udFNpemU6JzIwcHgnXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH19PnZpZXdfbGlzdDwvaT5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgPFJlc3VsdHMgcmVzdWx0cz17cmVzcG9uc2UucmVzdWx0c30gZmllbGROYW1lcz17ZmllbGROYW1lc30gZmllbGRXaWR0aHM9e2ZpZWxkV2lkdGhzfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBzZWxlY3RlZD17dGhpcy5wcm9wcy5zZWxlY3RlZH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVzPXt0aGlzLnByb3BzLnZhbHVlc31cclxuICAgICAgICAgICAgICAgICAgICAgICAgb25PcmRlckJ5Q2hhbmdlPXtvcmRlckJ5ID0+IHRoaXMucHJvcHMub25DaGFuZ2UoeyBvcmRlckJ5IH0pfSAvPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyQm9keShvcCwgdmFsdWVzKSB7XHJcbiAgICAgICAgY29uc3QgdXJsID0gdGhpcy5nZXRBdXRvUXVlcnlVcmwodGhpcy5wcm9wcy52YWx1ZXMuZm9ybWF0KTtcclxuICAgICAgICBjb25zdCBuYW1lID0gdGhpcy5wcm9wcy5zZWxlY3RlZC5uYW1lO1xyXG4gICAgICAgIGNvbnN0IGxvYWRpbmdOZXdRdWVyeSA9IHRoaXMuc3RhdGUudXJsICE9PSB1cmw7XHJcbiAgICAgICAgaWYgKGxvYWRpbmdOZXdRdWVyeSkge1xyXG4gICAgICAgICAgICBsZXQgbmV3VXJsID0gdGhpcy5nZXRBdXRvUXVlcnlVcmwoXCJqc29uXCIpO1xyXG4gICAgICAgICAgICBuZXdVcmwgPSBjcmVhdGVVcmwobmV3VXJsLCB7IGpzY29uZmlnOiAnRGF0ZUhhbmRsZXI6SVNPODYwMURhdGVPbmx5LFRpbWVTcGFuSGFuZGxlcjpTdGFuZGFyZEZvcm1hdCcgfSk7XHJcblxyXG4gICAgICAgICAgICBjbGllbnQuZ2V0KG5ld1VybClcclxuICAgICAgICAgICAgICAgIC50aGVuKHIgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciByZXNwb25zZSA9IG5vcm1hbGl6ZShyKTtcclxuICAgICAgICAgICAgICAgICAgICByZXNwb25zZS51cmwgPSB1cmw7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHVybCwgbmFtZSwgcmVzcG9uc2UsIGVycm9yOm51bGwgfSk7XHJcbiAgICAgICAgICAgICAgICB9KVxyXG4gICAgICAgICAgICAgICAgLmNhdGNoKHIgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgIHZhciBzdGF0dXMgPSByLnJlc3BvbnNlU3RhdHVzO1xyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyB1cmwsIG5hbWUsIHJlc3BvbnNlOm51bGwsIGVycm9yOiBgJHtzdGF0dXMuZXJyb3JDb2RlfTogJHtzdGF0dXMubWVzc2FnZX1gIH0pO1xyXG4gICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25zdCBxdWVyaWVzID0gKHRoaXMucHJvcHMudmFsdWVzLnF1ZXJpZXMgfHwgW10pO1xyXG5cclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBpZD1cInF1ZXJ5LXRpdGxlXCI+XHJcbiAgICAgICAgICAgICAgICAgICAge3RoaXMucHJvcHMudmlld2VyQXJnc1tcIkRlc2NyaXB0aW9uXCJdIH1cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPGRpdiBpZD1cInVybFwiIHN0eWxlPXt7IHBhZGRpbmc6ICcwIDAgMTBweCAwJywgd2hpdGVTcGFjZTonbm93cmFwJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICA8YSBocmVmPXt1cmx9IHRhcmdldD1cIl9ibGFua1wiPnt1cmx9PC9hPlxyXG4gICAgICAgICAgICAgICAgICAgIHshICB0aGlzLmlzRGlydHkoKSA/IG51bGwgOiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cIm1hdGVyaWFsLWljb25zIG5vc2VsZWN0XCIgdGl0bGU9XCJyZXNldCBxdWVyeVwiIG9uQ2xpY2s9e2UgPT4gdGhpcy5jbGVhcigpIH0gc3R5bGU9e3tcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHBhZGRpbmc6ICcwIDAgMCA1cHgnLCBjb2xvcjogJyM3NTc1NzUnLCBmb250U2l6ZTogJzE2cHgnLCB2ZXJ0aWNhbEFsaWduOiAnYm90dG9tJywgY3Vyc29yOiAncG9pbnRlcidcclxuICAgICAgICAgICAgICAgICAgICAgICAgfX0+Y2xlYXI8L2k+XHJcbiAgICAgICAgICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgIDxzZWxlY3QgdmFsdWU9e3ZhbHVlcy5zZWFyY2hGaWVsZH0gb25DaGFuZ2U9e2UgPT4gdGhpcy5zZWxlY3RGaWVsZChlKSB9PlxyXG4gICAgICAgICAgICAgICAgICAgIDxvcHRpb24+PC9vcHRpb24+XHJcbiAgICAgICAgICAgICAgICAgICAge29wLmZyb21UeXBlRmllbGRzLm1hcChcclxuICAgICAgICAgICAgICAgICAgICAgICAgZiA9PiA8b3B0aW9uIGtleT17Zi5uYW1lfT57Zi5uYW1lfTwvb3B0aW9uPikgfVxyXG4gICAgICAgICAgICAgICAgPC9zZWxlY3Q+XHJcbiAgICAgICAgICAgICAgICA8c2VsZWN0IHZhbHVlPXt2YWx1ZXMuc2VhcmNoVHlwZX0gb25DaGFuZ2U9e2UgPT4gdGhpcy5zZWxlY3RPcGVyYW5kKGUpIH0+XHJcbiAgICAgICAgICAgICAgICAgICAgPG9wdGlvbj48L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICB7dGhpcy5nZXRDb252ZW50aW9ucygpLm1hcChcclxuICAgICAgICAgICAgICAgICAgICAgICAgYyA9PiA8b3B0aW9uIGtleT17Yy5uYW1lfT57Yy5uYW1lfTwvb3B0aW9uPikgfVxyXG4gICAgICAgICAgICAgICAgPC9zZWxlY3Q+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBpZD1cInR4dFNlYXJjaFwiIHZhbHVlPXt2YWx1ZXMuc2VhcmNoVGV4dH0gYXV0b0NvbXBsZXRlPVwib2ZmXCJcclxuICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17ZSA9PiB0aGlzLmNoYW5nZVRleHQoZSkgfVxyXG4gICAgICAgICAgICAgICAgICAgIG9uS2V5RG93bj17ZSA9PiBlLmtleUNvZGUgPT09IDEzID8gdGhpcy5wcm9wcy5vbkFkZENvbmRpdGlvbigpIDogbnVsbH0gLz5cclxuXHJcbiAgICAgICAgICAgICAgICB7dGhpcy5pc1ZhbGlkQ29uZGl0aW9uKClcclxuICAgICAgICAgICAgICAgICAgICA/ICg8aSBjbGFzc05hbWU9XCJtYXRlcmlhbC1pY29uc1wiIHN0eWxlPXt7IGZvbnRTaXplOiAnMzBweCcsIHZlcnRpY2FsQWxpZ246ICdib3R0b20nLCBjb2xvcjogJyMwMEM4NTMnLCBjdXJzb3I6ICdwb2ludGVyJyB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXtlID0+IHRoaXMucHJvcHMub25BZGRDb25kaXRpb24oKSB9IHRpdGxlPVwiQWRkIGNvbmRpdGlvblwiPmFkZF9jaXJjbGU8L2k+KVxyXG4gICAgICAgICAgICAgICAgICAgIDogKDxpIGNsYXNzTmFtZT1cIm1hdGVyaWFsLWljb25zXCIgc3R5bGU9e3sgZm9udFNpemU6ICczMHB4JywgdmVydGljYWxBbGlnbjogJ2JvdHRvbScsIGNvbG9yOiAnI2NjYycgfX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU9XCJJbmNvbXBsZXRlIGNvbmRpdGlvblwiPmFkZF9jaXJjbGU8L2k+KX1cclxuXHJcbiAgICAgICAgICAgICAgICB7IXRoaXMucHJvcHMuY29uZmlnLmZvcm1hdHMgfHwgdGhpcy5wcm9wcy5jb25maWcuZm9ybWF0cy5sZW5ndGggPT09IDAgPyBudWxsIDogKFxyXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImZvcm1hdHMgbm9zZWxlY3RcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAge3RoaXMucHJvcHMuY29uZmlnLmZvcm1hdHMubWFwKGYgPT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGtleT17Zn0gY2xhc3NOYW1lPXt2YWx1ZXMuZm9ybWF0ID09PSBmID8gJ2FjdGl2ZScgOiAnJ30gb25DbGljaz17ZSA9PiB0aGlzLnNlbGVjdEZvcm1hdChmKX0+e2Z9PC9zcGFuPikgfVxyXG4gICAgICAgICAgICAgICAgICAgIDwvc3Bhbj4pIH1cclxuXHJcbiAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy52YWx1ZXMuY29uZGl0aW9ucy5sZW5ndGggKyBxdWVyaWVzLmxlbmd0aCA+IDAgP1xyXG4gICAgICAgICAgICAgICAgICAgICg8ZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNvbmRpdGlvbnNcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLnZhbHVlcy5jb25kaXRpb25zLm1hcChjID0+IChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGtleT17Yy5pZH0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cIm1hdGVyaWFsLWljb25zXCIgc3R5bGU9e3sgY29sb3I6ICcjZGI0NDM3JywgY3Vyc29yOiAncG9pbnRlcicsIHBhZGRpbmc6ICcwIDVweCAwIDAnIH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZT1cInJlbW92ZSBjb25kaXRpb25cIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17ZSA9PiB0aGlzLnByb3BzLm9uUmVtb3ZlQ29uZGl0aW9uKGMpIH0+cmVtb3ZlX2NpcmNsZTwvaT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge2Muc2VhcmNoRmllbGR9IHtjLnNlYXJjaFR5cGV9IHtjLnNlYXJjaFRleHR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApKSB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAge3RoaXMucHJvcHMudmFsdWVzLmNvbmRpdGlvbnMubGVuZ3RoID4gMFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPyAoPGRpdiBzdHlsZT17eyBkaXNwbGF5OiAnaW5saW5lLWJsb2NrJywgdmVydGljYWxBbGlnbjogJ3RvcCcsIHBhZGRpbmc6IDEwIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIHRpdGxlPVwiU2F2ZSBRdWVyeVwiIGNsYXNzTmFtZT1cIm1hdGVyaWFsLWljb25zXCIgc3R5bGU9e3sgZm9udFNpemU6ICcyNHB4JywgY29sb3I6ICcjNDQ0JywgY3Vyc29yOiAncG9pbnRlcicgfX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXtlID0+IHRoaXMucHJvcHMub25TYXZlUXVlcnkoKSB9PnNhdmU8L2k+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj4pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IG51bGx9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInF1ZXJpZXNcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtxdWVyaWVzLm1hcCh4ID0+IChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJtYXRlcmlhbC1pY29uc1wiIHN0eWxlPXt7IGNvbG9yOiAnI2RiNDQzNycsIGN1cnNvcjogJ3BvaW50ZXInLCBwYWRkaW5nOiAnMCA1cHggMCAwJyB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGl0bGU9XCJyZW1vdmUgcXVlcnlcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17ZSA9PiB0aGlzLnByb3BzLm9uUmVtb3ZlUXVlcnkoeCkgfT5yZW1vdmVfY2lyY2xlPC9pPlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwibG5rXCIgdGl0bGU9XCJsb2FkIHF1ZXJ5XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e2UgPT4gdGhpcy5wcm9wcy5vbkxvYWRRdWVyeSh4KSB9Pnt4Lm5hbWV9PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKSl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PilcclxuICAgICAgICAgICAgICAgICAgICA6IG51bGx9XHJcblxyXG4gICAgICAgICAgICAgICAgeyB0aGlzLnN0YXRlLnJlc3BvbnNlXHJcbiAgICAgICAgICAgICAgICAgICAgPyAoIWxvYWRpbmdOZXdRdWVyeSB8fCBuYW1lID09PSB0aGlzLnN0YXRlLm5hbWVcclxuICAgICAgICAgICAgICAgICAgICAgICAgPyB0aGlzLnJlbmRlclJlc3VsdHModGhpcy5zdGF0ZS5yZXNwb25zZSlcclxuICAgICAgICAgICAgICAgICAgICAgICAgOiAoPGRpdiBzdHlsZT17eyBjb2xvcjogJyM3NTc1NzUnLCBwYWRkaW5nOicyMHB4IDAgMCAwJyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJtYXRlcmlhbC1pY29ucyBzcGluXCIgc3R5bGU9e3sgZm9udFNpemU6JzIwcHgnLCB2ZXJ0aWNhbEFsaWduOiAndGV4dC1ib3R0b20nIH19PmNhY2hlZDwvaT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBzdHlsZT17eyBwYWRkaW5nOicwIDAgMCA1cHgnfX0+bG9hZGluZyByZXN1bHRzLi4uPC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj4pKVxyXG4gICAgICAgICAgICAgICAgICAgIDogdGhpcy5zdGF0ZS5lcnJvclxyXG4gICAgICAgICAgICAgICAgICAgICAgICA/IDxkaXYgc3R5bGU9e3sgY29sb3I6JyNkYjQ0MzcnLCBwYWRkaW5nOjUgfX0+e3RoaXMuc3RhdGUuZXJyb3J9PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDogbnVsbCB9XHJcblxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICBjb25zdCBpc01zRWRnZSA9IC9FZGdlLy50ZXN0KG5hdmlnYXRvci51c2VyQWdlbnQpO1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgaWQ9XCJjb250ZW50XCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImlubmVyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRhYmxlPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0Ym9keT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPHRyPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge2lzTXNFZGdlID8gPHRkIHN0eWxlPXt7IG1pbldpZHRoOiAnMjBweCcgfX0+PC90ZD4gOiBudWxsfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLnNlbGVjdGVkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gdGhpcy5yZW5kZXJCb2R5KHRoaXMucHJvcHMuc2VsZWN0ZWQsIHRoaXMucHJvcHMudmFsdWVzKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6ICg8ZGl2IHN0eWxlPXt7IHBhZGRpbmc6ICcxNXB4IDAnLCBmb250U2l6ZTonMjBweCcsIGNvbG9yOicjNzU3NTc1JyB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cIm1hdGVyaWFsLWljb25zXCIgc3R5bGU9e3sgdmVydGljYWxBbGlnbjogJ2JvdHRvbScsIG1hcmdpbjonMCAxMHB4IDAgMCd9fT5hcnJvd19iYWNrPC9pPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3RoaXMucHJvcHMudXNlcmluZm8ucXVlcnljb3VudCA+IDBcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IFwiUGxlYXNlIFNlbGVjdCBhIFF1ZXJ5XCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgOiB0aGlzLnByb3BzLnVzZXJpbmZvLmlzYXV0aGVudGljYXRlZFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyBcIlRoZXJlIGFyZSBubyBxdWVyaWVzIGF2YWlsYWJsZVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IFwiUGxlYXNlIFNpZ24gSW4gdG8gc2VlIHlvdXIgYXZhaWxhYmxlIHF1ZXJpZXNcIn08L2Rpdj4pIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IWlzTXNFZGdlID8gPHRkIHN0eWxlPXt7IG1pbldpZHRoOiAnMjBweCcgfX0+PC90ZD4gOiBudWxsfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3RyPlxyXG4gICAgICAgICAgICAgICAgICAgICA8L3Rib2R5PlxyXG4gICAgICAgICAgICAgICAgICAgICA8L3RhYmxlPlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvQ29udGVudC50c3giLCJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBIZWFkZXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQ8YW55LCBhbnk+IHtcclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IGlkPVwiaGVhZGVyXCIgc3R5bGU9e3sgbWFyZ2luOiAnYXV0bycsIGRpc3BsYXk6ICdmbGV4JywgZmxleERpcmVjdGlvbjogJ3JvdycgfX0+XHJcbiAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJtYXRlcmlhbC1pY29uc1wiIHN0eWxlPXt7IGN1cnNvcjogJ3BvaW50ZXInIH19IG9uQ2xpY2s9e2UgPT4gdGhpcy5wcm9wcy5vblNpZGViYXJUb2dnbGUoKSB9PlxyXG4gICAgICAgICAgICAgICAgICAgIG1lbnVcclxuICAgICAgICAgICAgICAgIDwvaT5cclxuICAgICAgICAgICAgICAgIDxoMT5BdXRvUXVlcnk8L2gxPlxyXG4gICAgICAgICAgICAgICAge3RoaXMucHJvcHMudGl0bGUgPT0gbnVsbCA/IDxkaXYgc3R5bGU9e3tmbGV4OjF9fSAvPiA6IChcclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPVwiaGVhZGVyLWNvbnRlbnRcIiBzdHlsZT17eyBkaXNwbGF5OiAnZmxleCcsIGZsZXg6IDEgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cInNlcGVyYXRvclwiPjwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGgyPnt0aGlzLnByb3BzLnRpdGxlfTwvaDI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3sgbWFyZ2luOiAnYXV0bycsIGZsZXg6IDEgfX0+PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICApfVxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL0hlYWRlci50c3giLCJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7IHJlbmRlciB9IGZyb20gJ3JlYWN0LWRvbSc7XHJcbmltcG9ydCB7IExpbmsgfSBmcm9tICdyZWFjdC1yb3V0ZXItZG9tJztcclxuaW1wb3J0IHsgZ2V0RmllbGQgfSBmcm9tICcuL3NoYXJlZCc7XHJcblxyXG5pbXBvcnQgeyBodW1hbml6ZSB9IGZyb20gJ3NlcnZpY2VzdGFjay1jbGllbnQnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgUmVzdWx0cyBleHRlbmRzIFJlYWN0LkNvbXBvbmVudDxhbnksIGFueT4ge1xyXG4gICAgcmVuZGVyVmFsdWUobzogYW55KSB7XHJcbiAgICAgICAgcmV0dXJuIEFycmF5LmlzQXJyYXkobylcclxuICAgICAgICAgICAgPyBvLmpvaW4oJywgJykgXHJcbiAgICAgICAgICAgIDogdHlwZW9mIG8gPT0gXCJ1bmRlZmluZWRcIlxyXG4gICAgICAgICAgICA/IFwiXCIgXHJcbiAgICAgICAgICAgIDogdHlwZW9mIG8gPT0gXCJvYmplY3RcIlxyXG4gICAgICAgICAgICAgICAgPyBKU09OLnN0cmluZ2lmeShvKVxyXG4gICAgICAgICAgICAgICAgOiBvICsgXCJcIjtcclxuICAgIH1cclxuXHJcbiAgICBmb3JtYXRTdHJpbmcoczogc3RyaW5nKSB7XHJcbiAgICAgICAgaWYgKHMpIHtcclxuICAgICAgICAgICAgaWYgKHMuc3RhcnRzV2l0aChcImh0dHBcIikpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gPGEgaHJlZj17c30gdGFyZ2V0PVwiX2JsYW5rXCI+e3Muc3Vic3RyaW5nKHMuaW5kZXhPZignOi8vJykgKyAzKSB9PC9hPjtcclxuXHJcbiAgICAgICAgICAgIGlmIChzLnRvTG93ZXJDYXNlKCkgPT09IFwiZmFsc2VcIilcclxuICAgICAgICAgICAgICAgIHJldHVybiA8aSBjbGFzc05hbWU9XCJtYXRlcmlhbC1pY29uc1wiIHN0eWxlPXt7IGNvbG9yOiAnIzc1NzU3NScsIGZvbnRTaXplOiAnMTRweCcgfX0+Y2hlY2tfYm94X291dGxpbmVfYmxhbms8L2k+O1xyXG4gICAgICAgICAgICBpZiAocy50b0xvd2VyQ2FzZSgpID09PSBcInRydWVcIilcclxuICAgICAgICAgICAgICAgIHJldHVybiA8aSBjbGFzc05hbWU9XCJtYXRlcmlhbC1pY29uc1wiIHN0eWxlPXt7IGNvbG9yOiAnIzY2QkI2QScsIGZvbnRTaXplOiAnMTRweCcgfX0+Y2hlY2tfYm94PC9pPjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiA8c3Bhbj57c308L3NwYW4+O1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICB2YXIgUmVzdWx0cyA9IDxkaXYgY2xhc3NOYW1lPVwicmVzdWx0cy1ub25lXCI+VGhlcmUgd2VyZSBubyByZXN1bHRzPC9kaXY+O1xyXG5cclxuICAgICAgICB2YXIgcmVzdWx0cyA9IHRoaXMucHJvcHMucmVzdWx0cztcclxuICAgICAgICBpZiAocmVzdWx0cyAmJiByZXN1bHRzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgdmFyIGZpZWxkTmFtZXMgPSB0aGlzLnByb3BzLnZhbHVlcy5maWVsZHMgfHwgW107XHJcbiAgICAgICAgICAgIGlmIChmaWVsZE5hbWVzLmxlbmd0aCA9PT0gMCkge1xyXG4gICAgICAgICAgICAgICAgZmllbGROYW1lcyA9IHRoaXMucHJvcHMuZmllbGROYW1lcyB8fFxyXG4gICAgICAgICAgICAgICAgICAgIHRoaXMucHJvcHMuc2VsZWN0ZWQudG9UeXBlRmllbGRzLm1hcCh4ID0+IHgubmFtZSk7XHJcbiAgICAgICAgICAgIH1cclxuXHJcbiAgICAgICAgICAgIHZhciBmaWVsZFdpZHRocyA9IHRoaXMucHJvcHMuZmllbGRXaWR0aHMgfHwge307XHJcblxyXG4gICAgICAgICAgICB2YXIgb3JkZXJCeSA9ICh0aGlzLnByb3BzLnZhbHVlcy5vcmRlckJ5IHx8ICcnKTtcclxuICAgICAgICAgICAgdmFyIG9yZGVyQnlOYW1lID0gb3JkZXJCeS5zdGFydHNXaXRoKCctJykgPyBvcmRlckJ5LnN1YnN0cigxKSA6IG9yZGVyQnk7XHJcblxyXG4gICAgICAgICAgICBSZXN1bHRzID0gKFxyXG4gICAgICAgICAgICAgICAgPHRhYmxlIGNsYXNzTmFtZT1cInJlc3VsdHNcIj5cclxuICAgICAgICAgICAgICAgICAgICA8dGhlYWQ+PHRyIGNsYXNzTmFtZT1cIm5vc2VsZWN0XCI+eyBmaWVsZE5hbWVzLm1hcChmID0+IChcclxuICAgICAgICAgICAgICAgICAgICAgICAgPHRoIGtleT17Zn0gc3R5bGU9e3sgY3Vyc29yOiAncG9pbnRlcicgfX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e2UgPT4gdGhpcy5wcm9wcy5vbk9yZGVyQnlDaGFuZ2UoZiAhPT0gb3JkZXJCeU5hbWUgPyAnLScgKyBmIDogIW9yZGVyQnkuc3RhcnRzV2l0aCgnLScpID8gJycgOiBvcmRlckJ5TmFtZSkgfT5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGh1bWFuaXplKGYpIH1cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7IGYgIT09IG9yZGVyQnlOYW1lID8gbnVsbCA6XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwibWF0ZXJpYWwtaWNvbnNcIiBzdHlsZT17e2ZvbnRTaXplOicxOHB4Jyx2ZXJ0aWNhbEFsaWduOidib3R0b20nfX0+e29yZGVyQnkuc3RhcnRzV2l0aCgnLScpID8gXCJhcnJvd19kcm9wX2Rvd25cIiA6IFwiYXJyb3dfZHJvcF91cFwifTwvaT59XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdGg+XHJcbiAgICAgICAgICAgICAgICAgICAgKSl9PC90cj48L3RoZWFkPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0Ym9keT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgeyByZXN1bHRzLm1hcCgocixpKSA9PiAoXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dHIga2V5PXtpfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7ZmllbGROYW1lcy5tYXAoKGYsIGopID0+IChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPHRkIGtleT17an0gdGl0bGU9e3RoaXMucmVuZGVyVmFsdWUoZ2V0RmllbGQocixmKSkgfSBzdHlsZT17Z2V0RmllbGQoZmllbGRXaWR0aHMsZikgPyB7IG1heFdpZHRoOiBwYXJzZUludChnZXRGaWVsZChmaWVsZFdpZHRocyxmKSkgfSA6IHt9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgdGhpcy5mb3JtYXRTdHJpbmcodGhpcy5yZW5kZXJWYWx1ZShnZXRGaWVsZChyLGYpKSkgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L3RkPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICkpIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+KVxyXG4gICAgICAgICAgICAgICAgICAgICAgICApIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC90Ym9keT5cclxuICAgICAgICAgICAgICAgIDwvdGFibGU+ICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIFJlc3VsdHM7XHJcbiAgICB9XHJcbn1cclxuXG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL1Jlc3VsdHMudHN4IiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgeyByZW5kZXIgfSBmcm9tICdyZWFjdC1kb20nO1xyXG5pbXBvcnQgeyBMaW5rIH0gZnJvbSAncmVhY3Qtcm91dGVyLWRvbSc7XHJcbmltcG9ydCB7IHNwbGl0T25GaXJzdCB9IGZyb20gJ3NlcnZpY2VzdGFjay1jbGllbnQnO1xyXG5cclxuaW1wb3J0IHsgQmFzZVBhdGggfSBmcm9tICcuL3NoYXJlZCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBTaWRlYmFyIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PGFueSwgYW55PiB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcz8sIGNvbnRleHQ/KSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMsIGNvbnRleHQpO1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7IGZpbHRlcjogdW5kZWZpbmVkIH07XHJcbiAgICB9XHJcblxyXG4gICAgaGFuZGxlRmlsdGVyKGUpIHtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgZmlsdGVyOiBlLnRhcmdldC52YWx1ZS50b0xvd2VyQ2FzZSgpIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlckljb24obmFtZSkge1xyXG4gICAgICAgIHZhciBpY29uVXJsID0gdGhpcy5wcm9wcy52aWV3ZXJBcmdzW25hbWVdW1wiSWNvblVybFwiXTtcclxuICAgICAgICBpZiAoaWNvblVybCkge1xyXG4gICAgICAgICAgICBpZiAoaWNvblVybC5zdGFydHNXaXRoKCdtYXRlcmlhbC1pY29uczonKSlcclxuICAgICAgICAgICAgICAgIHJldHVybiAoPGkgY2xhc3NOYW1lPVwibWF0ZXJpYWwtaWNvbnNcIj57c3BsaXRPbkZpcnN0KGljb25VcmwsICc6JylbMV19PC9pPik7XHJcbiAgICAgICAgICAgIGlmIChpY29uVXJsLnN0YXJ0c1dpdGgoJ29jdGljb246JykpXHJcbiAgICAgICAgICAgICAgICByZXR1cm4gKDxzcGFuIGNsYXNzTmFtZT17XCJtZWdhLW9jdGljb24gb2N0aWNvbi1cIiArIHNwbGl0T25GaXJzdChpY29uVXJsLCAnOicpWzFdfT48L3NwYW4+KTtcclxuICAgICAgICAgICAgcmV0dXJuICg8aW1nIHNyYz17aWNvblVybH0gLz4pO1xyXG4gICAgICAgIH1cclxuICAgICAgICByZXR1cm4gKDxpIGNsYXNzTmFtZT1cIm1hdGVyaWFsLWljb25zXCI+c2VhcmNoPC9pPik7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgaWQ9XCJzaWRlYmFyXCI+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImlubmVyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBpZD1cImFxLWZpbHRlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInRleHRcIiBwbGFjZWhvbGRlcj1cImZpbHRlclwiIHN0eWxlPXt7IG1hcmdpbjogXCIxMHB4IDE1cHhcIiB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DaGFuZ2U9e2UgPT4gdGhpcy5oYW5kbGVGaWx0ZXIoZSl9IHZhbHVlPXt0aGlzLnN0YXRlLmZpbHRlcn0gLz5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPVwiYXEtbGlzdFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7T2JqZWN0LmtleXModGhpcy5wcm9wcy5vcGVyYXRpb25zKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLmZpbHRlcihvcCA9PiB0aGlzLnN0YXRlLmZpbHRlciA9PSBudWxsIHx8IG9wLnRvTG93ZXJDYXNlKCkuaW5kZXhPZih0aGlzLnN0YXRlLmZpbHRlcikgPj0gMClcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIC5tYXAoKG9wLGkpID0+IChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYga2V5PXtpfSBjbGFzc05hbWU9e1wiYXEtaXRlbVwiICsgKG9wID09PSB0aGlzLnByb3BzLm5hbWUgPyBcIiBhY3RpdmVcIiA6IFwiXCIpfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5yZW5kZXJJY29uKG9wKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8TGluayB0bz17QmFzZVBhdGggKyBcInNzX2FkbWluL2F1dG9xdWVyeS9cIiArIG9wfT57dGhpcy5wcm9wcy52aWV3ZXJBcmdzW29wXVtcIk5hbWVcIl0gfHwgb3B9PC9MaW5rPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICkpfVxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvU2lkZWJhci50c3giLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKHVuZGVmaW5lZCk7XG4vLyBpbXBvcnRzXG5cblxuLy8gbW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCJodG1sLCBib2R5e1xcclxcbiAgaGVpZ2h0OjEwMCU7XFxyXFxufVxcclxcbmJvZHkge1xcclxcbiAgICBmb250LWZhbWlseTogJ1JvYm90bycsIHNhbnMtc2VyaWY7XFxyXFxuICAgIG1hcmdpbjogMDtcXHJcXG4gICAgYmFja2dyb3VuZDogI2VlZTtcXHJcXG59XFxyXFxuXFxyXFxuaDEsIGgyLCBoMywgaDQsIGg1LCBoNiwgZm9ybSB7XFxyXFxuICAgIG1hcmdpbjogMDtcXHJcXG4gICAgcGFkZGluZzogMDtcXHJcXG59XFxyXFxuXFxyXFxuaW5wdXQsIHNlbGVjdCwgYnV0dG9uIHtcXHJcXG4gICAgcGFkZGluZzogNHB4IDhweDtcXHJcXG4gICAgbWFyZ2luOiAwIDVweCAwIDA7XFxyXFxufVxcclxcbmEge1xcclxcbiAgICBjb2xvcjogIzQyOGJjYTtcXHJcXG59XFxyXFxuXFxyXFxudGFibGUge1xcclxcbiAgICBtYXJnaW46IDA7XFxyXFxuICAgIHBhZGRpbmc6IDA7XFxyXFxuICAgIGJvcmRlci1jb2xsYXBzZTogY29sbGFwc2U7XFxyXFxufVxcclxcbnRhYmxlLnJlc3VsdHMge1xcclxcbiAgICAtd2Via2l0LWJveC1zaGFkb3c6IDAgMXB4IDRweCAwIHJnYmEoMCwwLDAsMC4xNCk7XFxyXFxuICAgICAgICAgICAgYm94LXNoYWRvdzogMCAxcHggNHB4IDAgcmdiYSgwLDAsMCwwLjE0KTtcXHJcXG4gICAgYmFja2dyb3VuZDogI2ZlZmVmZTtcXHJcXG59XFxyXFxudGFibGUucmVzdWx0cyB0aCB7XFxyXFxuICAgIHRleHQtYWxpZ246IGxlZnQ7XFxyXFxuICAgIGNvbG9yOiAjNzU3NTc1O1xcclxcbiAgICBmb250LXNpemU6IDEzcHg7XFxyXFxuICAgIGxpbmUtaGVpZ2h0OiAxOHB4O1xcclxcbiAgICBib3JkZXItYm90dG9tOiAxcHggc29saWQgI2UwZTBlMDtcXHJcXG4gICAgcGFkZGluZzogNXB4O1xcclxcbiAgICBvdmVyZmxvdzogaGlkZGVuO1xcclxcbiAgICB3aGl0ZS1zcGFjZTogbm93cmFwOyAgIFxcclxcbn1cXHJcXG50YWJsZS5yZXN1bHRzIHRkIHtcXHJcXG4gICAgY29sb3I6ICMyMTIxMjE7XFxyXFxuICAgIGZvbnQtc2l6ZTogMTJweDtcXHJcXG4gICAgcGFkZGluZzogNXB4O1xcclxcbiAgICBtYXgtd2lkdGg6IDMwMHB4O1xcclxcbiAgICBvdmVyZmxvdzogaGlkZGVuO1xcclxcbiAgICB3aGl0ZS1zcGFjZTogbm93cmFwOyAgIFxcclxcbiAgICB0ZXh0LW92ZXJmbG93OiBlbGxpcHNpcztcXHJcXG59XFxyXFxuXFxyXFxuI2FwcCB7XFxyXFxuICAgIGhlaWdodDogMTAwJTtcXHJcXG59XFxyXFxuXFxyXFxuLnJlc3VsdHMtbm9uZSB7XFxyXFxuICAgIHBhZGRpbmc6IDE1cHggMDtcXHJcXG59XFxyXFxuXFxyXFxuI2hlYWRlciB7XFxyXFxuICAgIHotaW5kZXg6IDI7XFxyXFxuICAgIGJhY2tncm91bmQ6ICNmZmY7XFxyXFxuICAgIGNvbG9yOiAjNjc2NzY3O1xcclxcbiAgICAtd2Via2l0LWJveC1zaGFkb3c6IDAgMXB4IDhweCByZ2JhKDAsMCwwLC4zKTtcXHJcXG4gICAgICAgICAgICBib3gtc2hhZG93OiAwIDFweCA4cHggcmdiYSgwLDAsMCwuMyk7XFxyXFxuICAgIHBvc2l0aW9uOiBmaXhlZDtcXHJcXG4gICAgd2lkdGg6IDEwMCU7XFxyXFxuICAgIGNvbG9yOiAjNjc2NzY3O1xcclxcbiAgICBwYWRkaW5nOiAxNXB4IDAgMTVweCAxNXB4O1xcclxcbn1cXHJcXG4gICAgI2hlYWRlciA+ICosICNoZWFkZXItY29udGVudCA+ICoge1xcclxcbiAgICAgICAgbWFyZ2luOiBhdXRvO1xcclxcbiAgICAgICAgcGFkZGluZzogMCAxMHB4O1xcclxcbiAgICB9XFxyXFxuICAgICNoZWFkZXIgdGFibGUge1xcclxcbiAgICAgICAgbWFyZ2luOiAwO1xcclxcbiAgICAgICAgYm9yZGVyLWNvbGxhcHNlOiBjb2xsYXBzZTtcXHJcXG4gICAgfVxcclxcbiAgICAjaGVhZGVyIHRkIHtcXHJcXG4gICAgICAgIGhlaWdodDogMzBweDtcXHJcXG4gICAgICAgIHBhZGRpbmc6IDAgMCAwIDIwcHg7XFxyXFxuICAgIH1cXHJcXG4gICAgI2hlYWRlciBoMSwgI2hlYWRlciBoMiB7XFxyXFxuICAgICAgICBmb250LXNpemU6IDIwcHg7XFxyXFxuICAgICAgICBsaW5lLWhlaWdodDogNDBweDtcXHJcXG4gICAgfVxcclxcblxcclxcbiN0eHRTZWFyY2g6Zm9jdXMge1xcclxcbiAgICBvdXRsaW5lOiBub25lO1xcclxcbn1cXHJcXG5cXHJcXG5mb3JtOmZvY3VzIHtcXHJcXG4gICAgYm9yZGVyOiAxcHggc29saWQgIzMzMztcXHJcXG59XFxyXFxuXFxyXFxuLnNlcGVyYXRvciB7XFxyXFxuICAgIGJhY2tncm91bmQ6ICNkZGQ7XFxyXFxuICAgIHdpZHRoOiAxcHg7XFxyXFxuICAgIGhlaWdodDogMzBweDtcXHJcXG59XFxyXFxuXFxyXFxuI2JvZHkge1xcclxcbn1cXHJcXG4jYm9keSAuaW5uZXIge1xcclxcbn1cXHJcXG5cXHJcXG4jc2lkZWJhciB7XFxyXFxuICAgIHotaW5kZXg6IDE7XFxyXFxuICAgIGJhY2tncm91bmQ6ICNlZWU7XFxyXFxuICAgIG1hcmdpbi1sZWZ0OiAwO1xcclxcbiAgICAtd2Via2l0LXRyYW5zaXRpb246IC4zcztcXHJcXG4gICAgdHJhbnNpdGlvbjogLjNzO1xcclxcbiAgICB3aWR0aDogMjUwcHg7XFxyXFxuICAgIGhlaWdodDogMTAwJTtcXHJcXG4gICAgcG9zaXRpb246IGZpeGVkO1xcclxcbiAgICBvdmVyZmxvdy15OiBhdXRvO1xcclxcbiAgICBtaW4td2lkdGg6IDI1MHB4O1xcclxcbiAgICBwYWRkaW5nOiAwO1xcclxcbn1cXHJcXG4gICAgI3NpZGViYXIgLmlubmVyIHtcXHJcXG4gICAgICAgIHBhZGRpbmc6IDkwcHggMCAwIDA7XFxyXFxuICAgIH1cXHJcXG4gICAgLmhpZGUtc2lkZWJhciAjc2lkZWJhciB7XFxyXFxuICAgICAgICBtYXJnaW4tbGVmdDogLTI1MHB4O1xcclxcbiAgICAgICAgLXdlYmtpdC10cmFuc2l0aW9uOiAuM3M7XFxyXFxuICAgICAgICB0cmFuc2l0aW9uOiAuM3M7XFxyXFxuICAgICAgICAtd2Via2l0LXRyYW5zaXRpb24tdGltaW5nLWZ1bmN0aW9uOiBlYXNlLW91dDtcXHJcXG4gICAgICAgICAgICAgICAgdHJhbnNpdGlvbi10aW1pbmctZnVuY3Rpb246IGVhc2Utb3V0O1xcclxcbiAgICB9XFxyXFxuXFxyXFxuI2NvbnRlbnQge1xcclxcbiAgICBwYWRkaW5nLWxlZnQ6IDI1MHB4O1xcclxcbn1cXHJcXG4uaGlkZS1zaWRlYmFyICNjb250ZW50IHtcXHJcXG4gICAgcGFkZGluZy1sZWZ0OiAwO1xcclxcbiAgICAtd2Via2l0LXRyYW5zaXRpb246IC4zcztcXHJcXG4gICAgdHJhbnNpdGlvbjogLjNzO1xcclxcbiAgICAtd2Via2l0LXRyYW5zaXRpb24tdGltaW5nLWZ1bmN0aW9uOiBlYXNlLW91dDtcXHJcXG4gICAgICAgICAgICB0cmFuc2l0aW9uLXRpbWluZy1mdW5jdGlvbjogZWFzZS1vdXQ7XFxyXFxufVxcclxcbiNjb250ZW50IC5pbm5lciB7XFxyXFxuICAgIHBhZGRpbmc6IDkwcHggMCAyMHB4IDIwcHg7XFxyXFxufVxcclxcblxcclxcbiNxdWVyeS10aXRsZSB7XFxyXFxuICAgIHotaW5kZXg6IDI7XFxyXFxuICAgIGNvbG9yOiAjNzU3NTc1O1xcclxcbiAgICBwb3NpdGlvbjogZml4ZWQ7XFxyXFxuICAgIHRvcDogMjVweDtcXHJcXG4gICAgcmlnaHQ6IDI1cHg7XFxyXFxufVxcclxcblxcclxcbi5hcS1pdGVtIHtcXHJcXG4gICAgZGlzcGxheTogLXdlYmtpdC1ib3g7XFxyXFxuICAgIGRpc3BsYXk6IC1tcy1mbGV4Ym94O1xcclxcbiAgICBkaXNwbGF5OiBmbGV4O1xcclxcbiAgICBjdXJzb3I6IHBvaW50ZXI7XFxyXFxuICAgIG92ZXJmbG93OiBoaWRkZW47XFxyXFxuICAgIHRleHQtb3ZlcmZsb3c6IGVsbGlwc2lzO1xcclxcbiAgICB3aGl0ZS1zcGFjZTogbm93cmFwO1xcclxcbn1cXHJcXG4gICAgLmFxLWl0ZW0gaSB7IC8qbWF0ZXJpYWwtaWNvbiovXFxyXFxuICAgICAgICBjb2xvcjogIzc1NzU3NTtcXHJcXG4gICAgICAgIG1hcmdpbjogYXV0bztcXHJcXG4gICAgICAgIHBhZGRpbmc6IDAgMTVweDtcXHJcXG4gICAgfVxcclxcbiAgICAuYXEtaXRlbSAubWVnYS1vY3RpY29uIHsgLypvY3RpY29uKi9cXHJcXG4gICAgICAgIGZvbnQtc2l6ZTogMjRweDtcXHJcXG4gICAgICAgIGNvbG9yOiAjNzU3NTc1O1xcclxcbiAgICAgICAgcGFkZGluZzogNHB4IDE2cHg7XFxyXFxuICAgICAgICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xcclxcbiAgICB9XFxyXFxuICAgIC5hcS1pdGVtIGltZyB7XFxyXFxuICAgICAgICB3aWR0aDogMjRweDtcXHJcXG4gICAgICAgIGhlaWdodDogMjRweDtcXHJcXG4gICAgICAgIHBhZGRpbmc6IDRweCAxNHB4O1xcclxcbiAgICAgICAgdmVydGljYWwtYWxpZ246IG1pZGRsZTtcXHJcXG4gICAgfVxcclxcbiAgICAuYXEtaXRlbSBhIHtcXHJcXG4gICAgICAgIGRpc3BsYXk6IGJsb2NrO1xcclxcbiAgICAgICAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xcclxcbiAgICAgICAgY29sb3I6IHJnYmEoMCwwLDAsMC44Nyk7XFxyXFxuICAgICAgICBsaW5lLWhlaWdodDogNDBweDtcXHJcXG4gICAgICAgIGZvbnQtc2l6ZTogMTRweDtcXHJcXG4gICAgICAgIC13ZWJraXQtYm94LWZsZXg6IDE7XFxyXFxuICAgICAgICAgICAgLW1zLWZsZXg6IDE7XFxyXFxuICAgICAgICAgICAgICAgIGZsZXg6IDE7XFxyXFxuICAgIH1cXHJcXG4gICAgLmFxLWl0ZW0uYWN0aXZlLCAuYXEtaXRlbTpob3ZlciB7XFxyXFxuICAgICAgICBiYWNrZ3JvdW5kOiAjZTdlN2U3O1xcclxcbiAgICB9XFxyXFxuICAgIC5hcS1pdGVtLmFjdGl2ZSB7XFxyXFxuICAgICAgICBjb2xvcjogIzI3MjcyNztcXHJcXG4gICAgfVxcclxcblxcclxcbi5mb3JtYXRzIHtcXHJcXG4gICAgcGFkZGluZzogMCAwIDAgMTBweDtcXHJcXG59XFxyXFxuLmZvcm1hdHMgc3BhbiB7XFxyXFxuICAgIGNvbG9yOiAjNDI4YmNhO1xcclxcbiAgICBwYWRkaW5nOiAwIDVweCAwIDA7XFxyXFxuICAgIGZvbnQtc2l6ZTogMTJweDtcXHJcXG4gICAgY3Vyc29yOiBwb2ludGVyO1xcclxcbn1cXHJcXG4uZm9ybWF0cyBzcGFuLmFjdGl2ZSB7XFxyXFxuICAgIGNvbG9yOiAjMjEyMTIxO1xcclxcbn1cXHJcXG4uY29uZGl0aW9ucyB7XFxyXFxuICAgIGNvbG9yOiAjNzU3NTc1O1xcclxcbiAgICBmb250LXNpemU6IDEzcHg7XFxyXFxuICAgIHBhZGRpbmc6IDE1cHg7XFxyXFxuICAgIGxpbmUtaGVpZ2h0OiAxOHB4O1xcclxcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XFxyXFxufVxcclxcbi5jb25kaXRpb25zIC5tYXRlcmlhbC1pY29ucywgLnF1ZXJpZXMgLm1hdGVyaWFsLWljb25zIHtcXHJcXG4gICAgZm9udC1zaXplOiAxNnB4O1xcclxcbiAgICB2ZXJ0aWNhbC1hbGlnbjogdGV4dC1ib3R0b207XFxyXFxufVxcclxcbi5xdWVyaWVzIHtcXHJcXG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xcclxcbiAgICB2ZXJ0aWNhbC1hbGlnbjogdG9wO1xcclxcbiAgICBwYWRkaW5nOiAxMHB4O1xcclxcbn1cXHJcXG4ubG5rIHtcXHJcXG4gICAgY29sb3I6ICM0MjhiY2E7XFxyXFxuICAgIGZvbnQtc2l6ZTogMTNweDtcXHJcXG4gICAgY3Vyc29yOiBwb2ludGVyO1xcclxcbiAgICB0ZXh0LWRlY29yYXRpb246IHVuZGVybGluZTtcXHJcXG59XFxyXFxuXFxyXFxuLnBhZ2luZyBpIHtcXHJcXG4gICAgdmVydGljYWwtYWxpZ246IGJvdHRvbTtcXHJcXG59XFxyXFxuXFxyXFxuLmRpYWxvZy13cmFwcGVyIHsgICAgXFxyXFxuICAgIHBvc2l0aW9uOiBmaXhlZDtcXHJcXG4gICAgdG9wOiAwO1xcclxcbiAgICBsZWZ0OiAwO1xcclxcbiAgICB3aWR0aDogMTAwJTtcXHJcXG4gICAgaGVpZ2h0OiAxMDAlO1xcclxcbiAgICBvdmVyZmxvdzogaGlkZGVuO1xcclxcbiAgICB6LWluZGV4OiAyO1xcclxcbn1cXHJcXG4uYWN0aXZlIC5kaWFsb2ctd3JhcHBlciB7XFxyXFxuICAgIGJhY2tncm91bmQ6IHJnYmEoMCwwLDAsMC4xKTtcXHJcXG4gICAgLXdlYmtpdC10cmFuc2l0aW9uOiAuMTVzIGN1YmljLWJlemllcigwLjQsMC4wLDAuMiwxKSAuMTVzO1xcclxcbiAgICB0cmFuc2l0aW9uOiAuMTVzIGN1YmljLWJlemllcigwLjQsMC4wLDAuMiwxKSAuMTVzO1xcclxcbn1cXHJcXG5cXHJcXG4uZGlhbG9nIHtcXHJcXG4gICAgcG9zaXRpb246IGFic29sdXRlO1xcclxcbiAgICB0b3A6IDEwMCU7XFxyXFxuICAgIGxlZnQ6IDUwJTtcXHJcXG4gICAgaGVpZ2h0OiA1MCU7XFxyXFxuICAgIG1hcmdpbjogMCAwIDAgLTMwMHB4O1xcclxcbiAgICB3aWR0aDogNDUwcHg7XFxyXFxuICAgIGJhY2tncm91bmQ6ICNmZmY7XFxyXFxuICAgIC13ZWJraXQtYm94LXNoYWRvdzogMCAxcHggNHB4IDAgcmdiYSgwLDAsMCwwLjE0KTtcXHJcXG4gICAgICAgICAgICBib3gtc2hhZG93OiAwIDFweCA0cHggMCByZ2JhKDAsMCwwLDAuMTQpO1xcclxcbiAgICBib3JkZXItcmFkaXVzOiA0cHg7XFxyXFxuICAgIGNvbG9yOiAjNzU3NTc1O1xcclxcbiAgICBkaXNwbGF5OiAtd2Via2l0LWJveDtcXHJcXG4gICAgZGlzcGxheTogLW1zLWZsZXhib3g7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIC13ZWJraXQtYm94LW9yaWVudDogdmVydGljYWw7XFxyXFxuICAgIC13ZWJraXQtYm94LWRpcmVjdGlvbjogbm9ybWFsO1xcclxcbiAgICAgICAgLW1zLWZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XFxyXFxuICAgICAgICAgICAgZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXHJcXG59XFxyXFxuLmFjdGl2ZSAuZGlhbG9nIHtcXHJcXG4gICAgdG9wOiAyNSU7XFxyXFxuICAgIC13ZWJraXQtdHJhbnNpdGlvbjogLjE1cyBjdWJpYy1iZXppZXIoMC40LDAuMCwwLjIsMSkgLjE1cztcXHJcXG4gICAgdHJhbnNpdGlvbjogLjE1cyBjdWJpYy1iZXppZXIoMC40LDAuMCwwLjIsMSkgLjE1cztcXHJcXG59XFxyXFxuXFxyXFxuLmRpYWxvZyB7XFxyXFxuICAgIHBhZGRpbmc6IDIwcHg7XFxyXFxufVxcclxcbi5kaWFsb2ctaGVhZGVyIHtcXHJcXG4gICAgaGVpZ2h0OiA2MHB4O1xcclxcbn1cXHJcXG4gICAgLmRpYWxvZy1oZWFkZXIgaDMge1xcclxcbiAgICAgICAgY29sb3I6ICMyMTIxMjE7XFxyXFxuICAgIH1cXHJcXG5cXHJcXG4uZGlhbG9nLWJvZHkge1xcclxcbiAgICAtd2Via2l0LWJveC1mbGV4OiAxO1xcclxcbiAgICAgICAgLW1zLWZsZXg6IDE7XFxyXFxuICAgICAgICAgICAgZmxleDogMTtcXHJcXG4gICAgb3ZlcmZsb3cteTogYXV0bztcXHJcXG59XFxyXFxuLmRpYWxvZy1mb290ZXIge1xcclxcbiAgICBoZWlnaHQ6IDMwcHg7XFxyXFxufVxcclxcbi5idG5UZXh0IHtcXHJcXG4gICAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xcclxcbiAgICBjb2xvcjogIzQyODVGNDtcXHJcXG4gICAgZm9udC13ZWlnaHQ6IGJvbGQ7XFxyXFxuICAgIGN1cnNvcjogcG9pbnRlcjtcXHJcXG59XFxyXFxuLmJ0blRleHQgc3BhbiB7XFxyXFxuICAgIGRpc3BsYXk6IGJsb2NrO1xcclxcbiAgICBwYWRkaW5nOiA2cHggMTJweDtcXHJcXG4gICAgYm9yZGVyLXJhZGl1czogMnB4O1xcclxcbn1cXHJcXG4uYnRuVGV4dDpob3ZlciBzcGFuIHtcXHJcXG4gICAgYmFja2dyb3VuZDogcmdiKDIyNywgMjM3LCAyNTQpO1xcclxcbiAgICAtd2Via2l0LXRyYW5zaXRpb246IC4zcztcXHJcXG4gICAgdHJhbnNpdGlvbjogLjNzO1xcclxcbiAgICAtd2Via2l0LXRyYW5zaXRpb24tdGltaW5nLWZ1bmN0aW9uOiBlYXNlLW91dDtcXHJcXG4gICAgICAgICAgICB0cmFuc2l0aW9uLXRpbWluZy1mdW5jdGlvbjogZWFzZS1vdXQ7XFxyXFxufVxcclxcblxcclxcbi5zcGluIHtcXHJcXG4gICAgdHJhbnNmb3JtLW9yaWdpbjogNTAlIDUwJTtcXHJcXG4gICAgLXdlYmtpdC10cmFuc2Zvcm0tb3JpZ2luOiA1MCUgNTAlO1xcclxcbiAgICAtd2Via2l0LWFuaW1hdGlvbjpzcGluIDFzIGxpbmVhciBpbmZpbml0ZTtcXHJcXG4gICAgYW5pbWF0aW9uOiBzcGluIDFzIGxpbmVhciBpbmZpbml0ZVxcclxcbn1cXHJcXG5cXHJcXG5ALXdlYmtpdC1rZXlmcmFtZXMgc3BpbiB7IDEwMCUgeyAtd2Via2l0LXRyYW5zZm9ybTogcm90YXRlKDM2MGRlZyk7IH0gfVxcclxcbkBrZXlmcmFtZXMgc3BpbiB7IDEwMCUgeyAtd2Via2l0LXRyYW5zZm9ybTogcm90YXRlKDM2MGRlZyk7IHRyYW5zZm9ybTpyb3RhdGUoMzYwZGVnKTsgfSB9XFxyXFxuXFxyXFxuOjotd2Via2l0LXNjcm9sbGJhciB7XFxyXFxuICAgIHdpZHRoOiA3cHg7XFxyXFxuICAgIGhlaWdodDogN3B4O1xcclxcbn1cXHJcXG4gXFxyXFxuOjotd2Via2l0LXNjcm9sbGJhci10cmFjayB7XFxyXFxuICAgIC13ZWJraXQtYm94LXNoYWRvdzogaW5zZXQgMCAwIDJweCByZ2JhKDAsMCwwLDAuMyk7XFxyXFxufVxcclxcbiBcXHJcXG46Oi13ZWJraXQtc2Nyb2xsYmFyLXRodW1iIHtcXHJcXG4gIGJhY2tncm91bmQtY29sb3I6IGRhcmtncmV5O1xcclxcbiAgb3V0bGluZTogMXB4IHNvbGlkIHNsYXRlZ3JleTtcXHJcXG59XFxyXFxuXFxyXFxuXFxyXFxuLm5vc2VsZWN0IHtcXHJcXG4gIC13ZWJraXQtdG91Y2gtY2FsbG91dDogbm9uZTsgLyogaU9TIFNhZmFyaSAqL1xcclxcbiAgLXdlYmtpdC11c2VyLXNlbGVjdDogbm9uZTsgICAvKiBDaHJvbWUvU2FmYXJpL09wZXJhICovXFxyXFxuICAtbW96LXVzZXItc2VsZWN0OiBub25lOyAgICAgIC8qIEZpcmVmb3ggKi9cXHJcXG4gIC1tcy11c2VyLXNlbGVjdDogbm9uZTsgICAgICAgLyogSUUvRWRnZSAqL1xcclxcbiAgdXNlci1zZWxlY3Q6IG5vbmU7ICAgICAgICAgICAvKiBub24tcHJlZml4ZWQgdmVyc2lvbiwgY3VycmVudGx5XFxyXFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG5vdCBzdXBwb3J0ZWQgYnkgYW55IGJyb3dzZXIgKi9cXHJcXG59XFxyXFxuXFxyXFxuLyogcm9ib3RvLXJlZ3VsYXIgLSBsYXRpbiAqL1xcclxcbkBmb250LWZhY2Uge1xcclxcbiAgICBmb250LWZhbWlseTogJ1JvYm90byc7XFxyXFxuICAgIGZvbnQtc3R5bGU6IG5vcm1hbDtcXHJcXG4gICAgZm9udC13ZWlnaHQ6IDQwMDtcXHJcXG4gICAgc3JjOiBsb2NhbCgnUm9ib3RvJyksIGxvY2FsKCdSb2JvdG8tUmVndWxhcicpLCB1cmwoXCIgKyByZXF1aXJlKFwiLi9hc3NldHMvaW1nL3JvYm90by9yb2JvdG8tdjE1LWxhdGluLXJlZ3VsYXIud29mZjJcIikgKyBcIikgZm9ybWF0KCd3b2ZmMicpLCBcXHJcXG4gICAgdXJsKFwiICsgcmVxdWlyZShcIi4vYXNzZXRzL2ltZy9yb2JvdG8vcm9ib3RvLXYxNS1sYXRpbi1yZWd1bGFyLndvZmZcIikgKyBcIikgZm9ybWF0KCd3b2ZmJyk7IC8qIENocm9tZSA2KywgRmlyZWZveCAzLjYrLCBJRSA5KywgU2FmYXJpIDUuMSsgKi9cXHJcXG59XFxyXFxuQGZvbnQtZmFjZSB7XFxyXFxuICBmb250LWZhbWlseTogJ29jdGljb25zJztcXHJcXG4gIHNyYzogdXJsKFwiICsgcmVxdWlyZShcIi4vYXNzZXRzL2ltZy9vY3RpY29uL29jdGljb25zLndvZmZcIikgKyBcIikgZm9ybWF0KCd3b2ZmJyksXFxyXFxuICAgICAgIHVybChcIiArIHJlcXVpcmUoXCIuL2Fzc2V0cy9pbWcvb2N0aWNvbi9vY3RpY29ucy50dGZcIikgKyBcIikgZm9ybWF0KCd0cnVldHlwZScpO1xcclxcbiAgZm9udC13ZWlnaHQ6IG5vcm1hbDtcXHJcXG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcXHJcXG59XFxyXFxuXFxyXFxuLypcXHJcXG4ub2N0aWNvbiBpcyBvcHRpbWl6ZWQgZm9yIDE2cHguXFxyXFxuLm1lZ2Etb2N0aWNvbiBpcyBvcHRpbWl6ZWQgZm9yIDMycHggYnV0IGNhbiBiZSB1c2VkIGxhcmdlci5cXHJcXG4qL1xcclxcbi5vY3RpY29uLCAubWVnYS1vY3RpY29uIHtcXHJcXG4gIGZvbnQ6IG5vcm1hbCBub3JtYWwgbm9ybWFsIDE2cHgvMSBvY3RpY29ucztcXHJcXG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcXHJcXG4gIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcXHJcXG4gIHRleHQtcmVuZGVyaW5nOiBhdXRvO1xcclxcbiAgLXdlYmtpdC1mb250LXNtb290aGluZzogYW50aWFsaWFzZWQ7XFxyXFxuICAtbW96LW9zeC1mb250LXNtb290aGluZzogZ3JheXNjYWxlO1xcclxcbiAgLXdlYmtpdC11c2VyLXNlbGVjdDogbm9uZTtcXHJcXG4gIC1tb3otdXNlci1zZWxlY3Q6IG5vbmU7XFxyXFxuICAtbXMtdXNlci1zZWxlY3Q6IG5vbmU7XFxyXFxuICB1c2VyLXNlbGVjdDogbm9uZTtcXHJcXG59XFxyXFxuLm1lZ2Etb2N0aWNvbiB7IGZvbnQtc2l6ZTogMzJweDsgfVxcclxcblxcclxcbi5vY3RpY29uLWFsZXJ0OmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAyRCd9IC8qIO+ArSAqL1xcclxcbi5vY3RpY29uLWFycm93LWRvd246YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDNGJ30gLyog74C/ICovXFxyXFxuLm9jdGljb24tYXJyb3ctbGVmdDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNDAnfSAvKiDvgYAgKi9cXHJcXG4ub2N0aWNvbi1hcnJvdy1yaWdodDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwM0UnfSAvKiDvgL4gKi9cXHJcXG4ub2N0aWNvbi1hcnJvdy1zbWFsbC1kb3duOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjBBMCd9IC8qIO+CoCAqL1xcclxcbi5vY3RpY29uLWFycm93LXNtYWxsLWxlZnQ6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMEExJ30gLyog74KhICovXFxyXFxuLm9jdGljb24tYXJyb3ctc21hbGwtcmlnaHQ6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDcxJ30gLyog74GxICovXFxyXFxuLm9jdGljb24tYXJyb3ctc21hbGwtdXA6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDlGJ30gLyog74KfICovXFxyXFxuLm9jdGljb24tYXJyb3ctdXA6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDNEJ30gLyog74C9ICovXFxyXFxuLm9jdGljb24tbWljcm9zY29wZTpiZWZvcmUsIC5vY3RpY29uLWJlYWtlcjpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwREQnfSAvKiDvg50gKi9cXHJcXG4ub2N0aWNvbi1iZWxsOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjBERSd9IC8qIO+DniAqL1xcclxcbi5vY3RpY29uLWJvbGQ6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMEUyJ30gLyog74OiICovXFxyXFxuLm9jdGljb24tYm9vazpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMDcnfSAvKiDvgIcgKi9cXHJcXG4ub2N0aWNvbi1ib29rbWFyazpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwN0InfSAvKiDvgbsgKi9cXHJcXG4ub2N0aWNvbi1icmllZmNhc2U6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMEQzJ30gLyog74OTICovXFxyXFxuLm9jdGljb24tYnJvYWRjYXN0OmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA0OCd9IC8qIO+BiCAqL1xcclxcbi5vY3RpY29uLWJyb3dzZXI6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMEM1J30gLyog74OFICovXFxyXFxuLm9jdGljb24tYnVnOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA5MSd9IC8qIO+CkSAqL1xcclxcbi5vY3RpY29uLWNhbGVuZGFyOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA2OCd9IC8qIO+BqCAqL1xcclxcbi5vY3RpY29uLWNoZWNrOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAzQSd9IC8qIO+AuiAqL1xcclxcbi5vY3RpY29uLWNoZWNrbGlzdDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNzYnfSAvKiDvgbYgKi9cXHJcXG4ub2N0aWNvbi1jaGV2cm9uLWRvd246YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMEEzJ30gLyog74KjICovXFxyXFxuLm9jdGljb24tY2hldnJvbi1sZWZ0OmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjBBNCd9IC8qIO+CpCAqL1xcclxcbi5vY3RpY29uLWNoZXZyb24tcmlnaHQ6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDc4J30gLyog74G4ICovXFxyXFxuLm9jdGljb24tY2hldnJvbi11cDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwQTInfSAvKiDvgqIgKi9cXHJcXG4ub2N0aWNvbi1jaXJjbGUtc2xhc2g6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDg0J30gLyog74KEICovXFxyXFxuLm9jdGljb24tY2lyY3VpdC1ib2FyZDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwRDYnfSAvKiDvg5YgKi9cXHJcXG4ub2N0aWNvbi1jbGlwcHk6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDM1J30gLyog74C1ICovXFxyXFxuLm9jdGljb24tY2xvY2s6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDQ2J30gLyog74GGICovXFxyXFxuLm9jdGljb24tY2xvdWQtZG93bmxvYWQ6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDBCJ30gLyog74CLICovXFxyXFxuLm9jdGljb24tY2xvdWQtdXBsb2FkOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAwQyd9IC8qIO+AjCAqL1xcclxcbi5vY3RpY29uLWNvZGU6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDVGJ30gLyog74GfICovXFxyXFxuLm9jdGljb24tY29tbWVudC1hZGQ6YmVmb3JlLCAub2N0aWNvbi1jb21tZW50OmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAyQid9IC8qIO+AqyAqL1xcclxcbi5vY3RpY29uLWNvbW1lbnQtZGlzY3Vzc2lvbjpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNEYnfSAvKiDvgY8gKi9cXHJcXG4ub2N0aWNvbi1jcmVkaXQtY2FyZDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNDUnfSAvKiDvgYUgKi9cXHJcXG4ub2N0aWNvbi1kYXNoOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjBDQSd9IC8qIO+DiiAqL1xcclxcbi5vY3RpY29uLWRhc2hib2FyZDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwN0QnfSAvKiDvgb0gKi9cXHJcXG4ub2N0aWNvbi1kYXRhYmFzZTpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwOTYnfSAvKiDvgpYgKi9cXHJcXG4ub2N0aWNvbi1jbG9uZTpiZWZvcmUsIC5vY3RpY29uLWRlc2t0b3AtZG93bmxvYWQ6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMERDJ30gLyog74OcICovXFxyXFxuLm9jdGljb24tZGV2aWNlLWNhbWVyYTpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNTYnfSAvKiDvgZYgKi9cXHJcXG4ub2N0aWNvbi1kZXZpY2UtY2FtZXJhLXZpZGVvOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA1Nyd9IC8qIO+BlyAqL1xcclxcbi5vY3RpY29uLWRldmljZS1kZXNrdG9wOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjI3Qyd9IC8qIO+JvCAqL1xcclxcbi5vY3RpY29uLWRldmljZS1tb2JpbGU6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDM4J30gLyog74C4ICovXFxyXFxuLm9jdGljb24tZGlmZjpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNEQnfSAvKiDvgY0gKi9cXHJcXG4ub2N0aWNvbi1kaWZmLWFkZGVkOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA2Qid9IC8qIO+BqyAqL1xcclxcbi5vY3RpY29uLWRpZmYtaWdub3JlZDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwOTknfSAvKiDvgpkgKi9cXHJcXG4ub2N0aWNvbi1kaWZmLW1vZGlmaWVkOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA2RCd9IC8qIO+BrSAqL1xcclxcbi5vY3RpY29uLWRpZmYtcmVtb3ZlZDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNkMnfSAvKiDvgawgKi9cXHJcXG4ub2N0aWNvbi1kaWZmLXJlbmFtZWQ6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDZFJ30gLyog74GuICovXFxyXFxuLm9jdGljb24tZWxsaXBzaXM6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDlBJ30gLyog74KaICovXFxyXFxuLm9jdGljb24tZXllLXVud2F0Y2g6YmVmb3JlLCAub2N0aWNvbi1leWUtd2F0Y2g6YmVmb3JlLCAub2N0aWNvbi1leWU6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDRFJ30gLyog74GOICovXFxyXFxuLm9jdGljb24tZmlsZS1iaW5hcnk6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDk0J30gLyog74KUICovXFxyXFxuLm9jdGljb24tZmlsZS1jb2RlOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAxMCd9IC8qIO+AkCAqL1xcclxcbi5vY3RpY29uLWZpbGUtZGlyZWN0b3J5OmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAxNid9IC8qIO+AliAqL1xcclxcbi5vY3RpY29uLWZpbGUtbWVkaWE6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDEyJ30gLyog74CSICovXFxyXFxuLm9jdGljb24tZmlsZS1wZGY6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDE0J30gLyog74CUICovXFxyXFxuLm9jdGljb24tZmlsZS1zdWJtb2R1bGU6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDE3J30gLyog74CXICovXFxyXFxuLm9jdGljb24tZmlsZS1zeW1saW5rLWRpcmVjdG9yeTpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwQjEnfSAvKiDvgrEgKi9cXHJcXG4ub2N0aWNvbi1maWxlLXN5bWxpbmstZmlsZTpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwQjAnfSAvKiDvgrAgKi9cXHJcXG4ub2N0aWNvbi1maWxlLXRleHQ6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDExJ30gLyog74CRICovXFxyXFxuLm9jdGljb24tZmlsZS16aXA6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDEzJ30gLyog74CTICovXFxyXFxuLm9jdGljb24tZmxhbWU6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMEQyJ30gLyog74OSICovXFxyXFxuLm9jdGljb24tZm9sZDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwQ0MnfSAvKiDvg4wgKi9cXHJcXG4ub2N0aWNvbi1nZWFyOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAyRid9IC8qIO+AryAqL1xcclxcbi5vY3RpY29uLWdpZnQ6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDQyJ30gLyog74GCICovXFxyXFxuLm9jdGljb24tZ2lzdDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMEUnfSAvKiDvgI4gKi9cXHJcXG4ub2N0aWNvbi1naXN0LXNlY3JldDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwOEMnfSAvKiDvgowgKi9cXHJcXG4ub2N0aWNvbi1naXQtYnJhbmNoLWNyZWF0ZTpiZWZvcmUsIC5vY3RpY29uLWdpdC1icmFuY2gtZGVsZXRlOmJlZm9yZSwgLm9jdGljb24tZ2l0LWJyYW5jaDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMjAnfSAvKiDvgKAgKi9cXHJcXG4ub2N0aWNvbi1naXQtY29tbWl0OmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAxRid9IC8qIO+AnyAqL1xcclxcbi5vY3RpY29uLWdpdC1jb21wYXJlOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjBBQyd9IC8qIO+CrCAqL1xcclxcbi5vY3RpY29uLWdpdC1tZXJnZTpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMjMnfSAvKiDvgKMgKi9cXHJcXG4ub2N0aWNvbi1naXQtcHVsbC1yZXF1ZXN0LWFiYW5kb25lZDpiZWZvcmUsIC5vY3RpY29uLWdpdC1wdWxsLXJlcXVlc3Q6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDA5J30gLyog74CJICovXFxyXFxuLm9jdGljb24tZ2xvYmU6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMEI2J30gLyog74K2ICovXFxyXFxuLm9jdGljb24tZ3JhcGg6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDQzJ30gLyog74GDICovXFxyXFxuLm9jdGljb24taGVhcnQ6YmVmb3JlIHsgY29udGVudDogJ1xcXFwyNjY1J30gLyog4pmlICovXFxyXFxuLm9jdGljb24taGlzdG9yeTpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwN0UnfSAvKiDvgb4gKi9cXHJcXG4ub2N0aWNvbi1ob21lOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA4RCd9IC8qIO+CjSAqL1xcclxcbi5vY3RpY29uLWhvcml6b250YWwtcnVsZTpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNzAnfSAvKiDvgbAgKi9cXHJcXG4ub2N0aWNvbi1odWJvdDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwOUQnfSAvKiDvgp0gKi9cXHJcXG4ub2N0aWNvbi1pbmJveDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwQ0YnfSAvKiDvg48gKi9cXHJcXG4ub2N0aWNvbi1pbmZvOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA1OSd9IC8qIO+BmSAqL1xcclxcbi5vY3RpY29uLWlzc3VlLWNsb3NlZDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMjgnfSAvKiDvgKggKi9cXHJcXG4ub2N0aWNvbi1pc3N1ZS1vcGVuZWQ6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDI2J30gLyog74CmICovXFxyXFxuLm9jdGljb24taXNzdWUtcmVvcGVuZWQ6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDI3J30gLyog74CnICovXFxyXFxuLm9jdGljb24taXRhbGljOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjBFNCd9IC8qIO+DpCAqL1xcclxcbi5vY3RpY29uLWplcnNleTpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMTknfSAvKiDvgJkgKi9cXHJcXG4ub2N0aWNvbi1rZXk6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDQ5J30gLyog74GJICovXFxyXFxuLm9jdGljb24ta2V5Ym9hcmQ6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDBEJ30gLyog74CNICovXFxyXFxuLm9jdGljb24tbGF3OmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjBEOCd9IC8qIO+DmCAqL1xcclxcbi5vY3RpY29uLWxpZ2h0LWJ1bGI6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDAwJ30gLyog74CAICovXFxyXFxuLm9jdGljb24tbGluazpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNUMnfSAvKiDvgZwgKi9cXHJcXG4ub2N0aWNvbi1saW5rLWV4dGVybmFsOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA3Rid9IC8qIO+BvyAqL1xcclxcbi5vY3RpY29uLWxpc3Qtb3JkZXJlZDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNjInfSAvKiDvgaIgKi9cXHJcXG4ub2N0aWNvbi1saXN0LXVub3JkZXJlZDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNjEnfSAvKiDvgaEgKi9cXHJcXG4ub2N0aWNvbi1sb2NhdGlvbjpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNjAnfSAvKiDvgaAgKi9cXHJcXG4ub2N0aWNvbi1naXN0LXByaXZhdGU6YmVmb3JlLCAub2N0aWNvbi1taXJyb3ItcHJpdmF0ZTpiZWZvcmUsIC5vY3RpY29uLWdpdC1mb3JrLXByaXZhdGU6YmVmb3JlLCAub2N0aWNvbi1sb2NrOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA2QSd9IC8qIO+BqiAqL1xcclxcbi5vY3RpY29uLWxvZ28tZ2lzdDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwQUQnfSAvKiDvgq0gKi9cXHJcXG4ub2N0aWNvbi1sb2dvLWdpdGh1YjpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwOTInfSAvKiDvgpIgKi9cXHJcXG4ub2N0aWNvbi1tYWlsOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAzQid9IC8qIO+AuyAqL1xcclxcbi5vY3RpY29uLW1haWwtcmVhZDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwM0MnfSAvKiDvgLwgKi9cXHJcXG4ub2N0aWNvbi1tYWlsLXJlcGx5OmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA1MSd9IC8qIO+BkSAqL1xcclxcbi5vY3RpY29uLW1hcmstZ2l0aHViOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAwQSd9IC8qIO+AiiAqL1xcclxcbi5vY3RpY29uLW1hcmtkb3duOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjBDOSd9IC8qIO+DiSAqL1xcclxcbi5vY3RpY29uLW1lZ2FwaG9uZTpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNzcnfSAvKiDvgbcgKi9cXHJcXG4ub2N0aWNvbi1tZW50aW9uOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjBCRSd9IC8qIO+CviAqL1xcclxcbi5vY3RpY29uLW1pbGVzdG9uZTpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNzUnfSAvKiDvgbUgKi9cXHJcXG4ub2N0aWNvbi1taXJyb3ItcHVibGljOmJlZm9yZSwgLm9jdGljb24tbWlycm9yOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAyNCd9IC8qIO+ApCAqL1xcclxcbi5vY3RpY29uLW1vcnRhci1ib2FyZDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwRDcnfSAvKiDvg5cgKi9cXHJcXG4ub2N0aWNvbi1tdXRlOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA4MCd9IC8qIO+CgCAqL1xcclxcbi5vY3RpY29uLW5vLW5ld2xpbmU6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDlDJ30gLyog74KcICovXFxyXFxuLm9jdGljb24tb2N0b2ZhY2U6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDA4J30gLyog74CIICovXFxyXFxuLm9jdGljb24tb3JnYW5pemF0aW9uOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAzNyd9IC8qIO+AtyAqL1xcclxcbi5vY3RpY29uLXBhY2thZ2U6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMEM0J30gLyog74OEICovXFxyXFxuLm9jdGljb24tcGFpbnRjYW46YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMEQxJ30gLyog74ORICovXFxyXFxuLm9jdGljb24tcGVuY2lsOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA1OCd9IC8qIO+BmCAqL1xcclxcbi5vY3RpY29uLXBlcnNvbi1hZGQ6YmVmb3JlLCAub2N0aWNvbi1wZXJzb24tZm9sbG93OmJlZm9yZSwgLm9jdGljb24tcGVyc29uOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAxOCd9IC8qIO+AmCAqL1xcclxcbi5vY3RpY29uLXBpbjpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNDEnfSAvKiDvgYEgKi9cXHJcXG4ub2N0aWNvbi1wbHVnOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjBENCd9IC8qIO+DlCAqL1xcclxcbi5vY3RpY29uLXJlcG8tY3JlYXRlOmJlZm9yZSwgLm9jdGljb24tZ2lzdC1uZXc6YmVmb3JlLCAub2N0aWNvbi1maWxlLWRpcmVjdG9yeS1jcmVhdGU6YmVmb3JlLCAub2N0aWNvbi1maWxlLWFkZDpiZWZvcmUsIC5vY3RpY29uLXBsdXM6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDVEJ30gLyog74GdICovXFxyXFxuLm9jdGljb24tcHJpbWl0aXZlLWRvdDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNTInfSAvKiDvgZIgKi9cXHJcXG4ub2N0aWNvbi1wcmltaXRpdmUtc3F1YXJlOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA1Myd9IC8qIO+BkyAqL1xcclxcbi5vY3RpY29uLXB1bHNlOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA4NSd9IC8qIO+ChSAqL1xcclxcbi5vY3RpY29uLXF1ZXN0aW9uOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAyQyd9IC8qIO+ArCAqL1xcclxcbi5vY3RpY29uLXF1b3RlOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA2Myd9IC8qIO+BoyAqL1xcclxcbi5vY3RpY29uLXJhZGlvLXRvd2VyOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAzMCd9IC8qIO+AsCAqL1xcclxcbi5vY3RpY29uLXJlcG8tZGVsZXRlOmJlZm9yZSwgLm9jdGljb24tcmVwbzpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMDEnfSAvKiDvgIEgKi9cXHJcXG4ub2N0aWNvbi1yZXBvLWNsb25lOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA0Qyd9IC8qIO+BjCAqL1xcclxcbi5vY3RpY29uLXJlcG8tZm9yY2UtcHVzaDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNEEnfSAvKiDvgYogKi9cXHJcXG4ub2N0aWNvbi1naXN0LWZvcms6YmVmb3JlLCAub2N0aWNvbi1yZXBvLWZvcmtlZDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMDInfSAvKiDvgIIgKi9cXHJcXG4ub2N0aWNvbi1yZXBvLXB1bGw6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDA2J30gLyog74CGICovXFxyXFxuLm9jdGljb24tcmVwby1wdXNoOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAwNSd9IC8qIO+AhSAqL1xcclxcbi5vY3RpY29uLXJvY2tldDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMzMnfSAvKiDvgLMgKi9cXHJcXG4ub2N0aWNvbi1yc3M6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDM0J30gLyog74C0ICovXFxyXFxuLm9jdGljb24tcnVieTpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNDcnfSAvKiDvgYcgKi9cXHJcXG4ub2N0aWNvbi1zZWFyY2gtc2F2ZTpiZWZvcmUsIC5vY3RpY29uLXNlYXJjaDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMkUnfSAvKiDvgK4gKi9cXHJcXG4ub2N0aWNvbi1zZXJ2ZXI6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDk3J30gLyog74KXICovXFxyXFxuLm9jdGljb24tc2V0dGluZ3M6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDdDJ30gLyog74G8ICovXFxyXFxuLm9jdGljb24tc2hpZWxkOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjBFMSd9IC8qIO+DoSAqL1xcclxcbi5vY3RpY29uLWxvZy1pbjpiZWZvcmUsIC5vY3RpY29uLXNpZ24taW46YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDM2J30gLyog74C2ICovXFxyXFxuLm9jdGljb24tbG9nLW91dDpiZWZvcmUsIC5vY3RpY29uLXNpZ24tb3V0OmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAzMid9IC8qIO+AsiAqL1xcclxcbi5vY3RpY29uLXNtaWxleTpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwRTcnfSAvKiDvg6cgKi9cXHJcXG4ub2N0aWNvbi1zcXVpcnJlbDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwQjInfSAvKiDvgrIgKi9cXHJcXG4ub2N0aWNvbi1zdGFyLWFkZDpiZWZvcmUsIC5vY3RpY29uLXN0YXItZGVsZXRlOmJlZm9yZSwgLm9jdGljb24tc3RhcjpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMkEnfSAvKiDvgKogKi9cXHJcXG4ub2N0aWNvbi1zdG9wOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA4Rid9IC8qIO+CjyAqL1xcclxcbi5vY3RpY29uLXJlcG8tc3luYzpiZWZvcmUsIC5vY3RpY29uLXN5bmM6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDg3J30gLyog74KHICovXFxyXFxuLm9jdGljb24tdGFnLXJlbW92ZTpiZWZvcmUsIC5vY3RpY29uLXRhZy1hZGQ6YmVmb3JlLCAub2N0aWNvbi10YWc6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDE1J30gLyog74CVICovXFxyXFxuLm9jdGljb24tdGFza2xpc3Q6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMEU1J30gLyog74OlICovXFxyXFxuLm9jdGljb24tdGVsZXNjb3BlOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA4OCd9IC8qIO+CiCAqL1xcclxcbi5vY3RpY29uLXRlcm1pbmFsOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjBDOCd9IC8qIO+DiCAqL1xcclxcbi5vY3RpY29uLXRleHQtc2l6ZTpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwRTMnfSAvKiDvg6MgKi9cXHJcXG4ub2N0aWNvbi10aHJlZS1iYXJzOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA1RSd9IC8qIO+BniAqL1xcclxcbi5vY3RpY29uLXRodW1ic2Rvd246YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMERCJ30gLyog74ObICovXFxyXFxuLm9jdGljb24tdGh1bWJzdXA6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMERBJ30gLyog74OaICovXFxyXFxuLm9jdGljb24tdG9vbHM6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDMxJ30gLyog74CxICovXFxyXFxuLm9jdGljb24tdHJhc2hjYW46YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMEQwJ30gLyog74OQICovXFxyXFxuLm9jdGljb24tdHJpYW5nbGUtZG93bjpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNUInfSAvKiDvgZsgKi9cXHJcXG4ub2N0aWNvbi10cmlhbmdsZS1sZWZ0OmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA0NCd9IC8qIO+BhCAqL1xcclxcbi5vY3RpY29uLXRyaWFuZ2xlLXJpZ2h0OmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA1QSd9IC8qIO+BmiAqL1xcclxcbi5vY3RpY29uLXRyaWFuZ2xlLXVwOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjBBQSd9IC8qIO+CqiAqL1xcclxcbi5vY3RpY29uLXVuZm9sZDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMzknfSAvKiDvgLkgKi9cXHJcXG4ub2N0aWNvbi11bm11dGU6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMEJBJ30gLyog74K6ICovXFxyXFxuLm9jdGljb24tdmVyaWZpZWQ6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMEU2J30gLyog74OmICovXFxyXFxuLm9jdGljb24tdmVyc2lvbnM6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDY0J30gLyog74GkICovXFxyXFxuLm9jdGljb24td2F0Y2g6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMEUwJ30gLyog74OgICovXFxyXFxuLm9jdGljb24tcmVtb3ZlLWNsb3NlOmJlZm9yZSwgLm9jdGljb24teDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwODEnfSAvKiDvgoEgKi9cXHJcXG4ub2N0aWNvbi16YXA6YmVmb3JlIHsgY29udGVudDogJ1xcXFwyNkExJ30gLyog4pqhICovXFxyXFxuXFxyXFxuXFxyXFxuXCIsIFwiXCJdKTtcblxuLy8gZXhwb3J0c1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2Nzcy1sb2FkZXIhLi9+L3Bvc3Rjc3MtbG9hZGVyL2xpYj97XCJwbHVnaW5zXCI6W251bGwsbnVsbF19IS4vc3JjL2FwcC5jc3Ncbi8vIG1vZHVsZSBpZCA9IDExMVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJleHBvcnRzID0gbW9kdWxlLmV4cG9ydHMgPSByZXF1aXJlKFwiLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXCIpKHVuZGVmaW5lZCk7XG4vLyBpbXBvcnRzXG5cblxuLy8gbW9kdWxlXG5leHBvcnRzLnB1c2goW21vZHVsZS5pZCwgXCJAZm9udC1mYWNlIHtcXG4gIGZvbnQtZmFtaWx5OiAnTWF0ZXJpYWwgSWNvbnMnO1xcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xcbiAgZm9udC13ZWlnaHQ6IDQwMDtcXG4gIHNyYzogdXJsKFwiICsgcmVxdWlyZShcIi4vTWF0ZXJpYWxJY29ucy1SZWd1bGFyLmVvdFwiKSArIFwiKTsgLyogRm9yIElFNi04ICovXFxuICBzcmM6IGxvY2FsKCdNYXRlcmlhbCBJY29ucycpLFxcbiAgICAgICBsb2NhbCgnTWF0ZXJpYWxJY29ucy1SZWd1bGFyJyksXFxuICAgICAgIHVybChcIiArIHJlcXVpcmUoXCIuL01hdGVyaWFsSWNvbnMtUmVndWxhci53b2ZmMlwiKSArIFwiKSBmb3JtYXQoJ3dvZmYyJyksXFxuICAgICAgIHVybChcIiArIHJlcXVpcmUoXCIuL01hdGVyaWFsSWNvbnMtUmVndWxhci53b2ZmXCIpICsgXCIpIGZvcm1hdCgnd29mZicpLFxcbiAgICAgICB1cmwoXCIgKyByZXF1aXJlKFwiLi9NYXRlcmlhbEljb25zLVJlZ3VsYXIudHRmXCIpICsgXCIpIGZvcm1hdCgndHJ1ZXR5cGUnKTtcXG59XFxuXFxuLm1hdGVyaWFsLWljb25zIHtcXG4gIGZvbnQtZmFtaWx5OiAnTWF0ZXJpYWwgSWNvbnMnO1xcbiAgZm9udC13ZWlnaHQ6IG5vcm1hbDtcXG4gIGZvbnQtc3R5bGU6IG5vcm1hbDtcXG4gIGZvbnQtc2l6ZTogMjRweDsgIC8qIFByZWZlcnJlZCBpY29uIHNpemUgKi9cXG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcXG4gIHdpZHRoOiAxZW07XFxuICBoZWlnaHQ6IDFlbTtcXG4gIGxpbmUtaGVpZ2h0OiAxO1xcbiAgdGV4dC10cmFuc2Zvcm06IG5vbmU7XFxuICBsZXR0ZXItc3BhY2luZzogbm9ybWFsO1xcbiAgd29yZC13cmFwOiBub3JtYWw7XFxuICB3aGl0ZS1zcGFjZTogbm93cmFwO1xcbiAgZGlyZWN0aW9uOiBsdHI7XFxuXFxuICAvKiBTdXBwb3J0IGZvciBhbGwgV2ViS2l0IGJyb3dzZXJzLiAqL1xcbiAgLXdlYmtpdC1mb250LXNtb290aGluZzogYW50aWFsaWFzZWQ7XFxuICAvKiBTdXBwb3J0IGZvciBTYWZhcmkgYW5kIENocm9tZS4gKi9cXG4gIHRleHQtcmVuZGVyaW5nOiBvcHRpbWl6ZUxlZ2liaWxpdHk7XFxuXFxuICAvKiBTdXBwb3J0IGZvciBGaXJlZm94LiAqL1xcbiAgLW1vei1vc3gtZm9udC1zbW9vdGhpbmc6IGdyYXlzY2FsZTtcXG5cXG4gIC8qIFN1cHBvcnQgZm9yIElFLiAqL1xcbiAgLXdlYmtpdC1mb250LWZlYXR1cmUtc2V0dGluZ3M6ICdsaWdhJztcXG4gICAgICAgICAgZm9udC1mZWF0dXJlLXNldHRpbmdzOiAnbGlnYSc7XFxufVxcblwiLCBcIlwiXSk7XG5cbi8vIGV4cG9ydHNcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jc3MtbG9hZGVyIS4vfi9wb3N0Y3NzLWxvYWRlci9saWI/e1wicGx1Z2luc1wiOltudWxsLG51bGxdfSEuL3NyYy9hc3NldHMvaW1nL2ljb25mb250L21hdGVyaWFsLWljb25zLmNzc1xuLy8gbW9kdWxlIGlkID0gMTEyXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcIikodW5kZWZpbmVkKTtcbi8vIGltcG9ydHNcblxuXG4vLyBtb2R1bGVcbmV4cG9ydHMucHVzaChbbW9kdWxlLmlkLCBcIi8qXFxyXFxuLm9jdGljb24gaXMgb3B0aW1pemVkIGZvciAxNnB4Llxcclxcbi5tZWdhLW9jdGljb24gaXMgb3B0aW1pemVkIGZvciAzMnB4IGJ1dCBjYW4gYmUgdXNlZCBsYXJnZXIuXFxyXFxuKi9cXHJcXG4ub2N0aWNvbiwgLm1lZ2Etb2N0aWNvbiB7XFxyXFxuICBmb250OiBub3JtYWwgbm9ybWFsIG5vcm1hbCAxNnB4LzEgb2N0aWNvbnM7XFxyXFxuICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XFxyXFxuICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XFxyXFxuICB0ZXh0LXJlbmRlcmluZzogYXV0bztcXHJcXG4gIC13ZWJraXQtZm9udC1zbW9vdGhpbmc6IGFudGlhbGlhc2VkO1xcclxcbiAgLW1vei1vc3gtZm9udC1zbW9vdGhpbmc6IGdyYXlzY2FsZTtcXHJcXG4gIC13ZWJraXQtdXNlci1zZWxlY3Q6IG5vbmU7XFxyXFxuICAtbW96LXVzZXItc2VsZWN0OiBub25lO1xcclxcbiAgLW1zLXVzZXItc2VsZWN0OiBub25lO1xcclxcbiAgdXNlci1zZWxlY3Q6IG5vbmU7XFxyXFxufVxcclxcbi5tZWdhLW9jdGljb24geyBmb250LXNpemU6IDMycHg7IH1cXHJcXG5cXHJcXG4ub2N0aWNvbi1hbGVydDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMkQnfSAvKiDvgK0gKi9cXHJcXG4ub2N0aWNvbi1hcnJvdy1kb3duOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAzRid9IC8qIO+AvyAqL1xcclxcbi5vY3RpY29uLWFycm93LWxlZnQ6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDQwJ30gLyog74GAICovXFxyXFxuLm9jdGljb24tYXJyb3ctcmlnaHQ6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDNFJ30gLyog74C+ICovXFxyXFxuLm9jdGljb24tYXJyb3ctc21hbGwtZG93bjpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwQTAnfSAvKiDvgqAgKi9cXHJcXG4ub2N0aWNvbi1hcnJvdy1zbWFsbC1sZWZ0OmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjBBMSd9IC8qIO+CoSAqL1xcclxcbi5vY3RpY29uLWFycm93LXNtYWxsLXJpZ2h0OmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA3MSd9IC8qIO+BsSAqL1xcclxcbi5vY3RpY29uLWFycm93LXNtYWxsLXVwOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA5Rid9IC8qIO+CnyAqL1xcclxcbi5vY3RpY29uLWFycm93LXVwOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAzRCd9IC8qIO+AvSAqL1xcclxcbi5vY3RpY29uLW1pY3Jvc2NvcGU6YmVmb3JlLCAub2N0aWNvbi1iZWFrZXI6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMEREJ30gLyog74OdICovXFxyXFxuLm9jdGljb24tYmVsbDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwREUnfSAvKiDvg54gKi9cXHJcXG4ub2N0aWNvbi1ib2xkOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjBFMid9IC8qIO+DoiAqL1xcclxcbi5vY3RpY29uLWJvb2s6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDA3J30gLyog74CHICovXFxyXFxuLm9jdGljb24tYm9va21hcms6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDdCJ30gLyog74G7ICovXFxyXFxuLm9jdGljb24tYnJpZWZjYXNlOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjBEMyd9IC8qIO+DkyAqL1xcclxcbi5vY3RpY29uLWJyb2FkY2FzdDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNDgnfSAvKiDvgYggKi9cXHJcXG4ub2N0aWNvbi1icm93c2VyOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjBDNSd9IC8qIO+DhSAqL1xcclxcbi5vY3RpY29uLWJ1ZzpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwOTEnfSAvKiDvgpEgKi9cXHJcXG4ub2N0aWNvbi1jYWxlbmRhcjpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNjgnfSAvKiDvgaggKi9cXHJcXG4ub2N0aWNvbi1jaGVjazpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwM0EnfSAvKiDvgLogKi9cXHJcXG4ub2N0aWNvbi1jaGVja2xpc3Q6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDc2J30gLyog74G2ICovXFxyXFxuLm9jdGljb24tY2hldnJvbi1kb3duOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjBBMyd9IC8qIO+CoyAqL1xcclxcbi5vY3RpY29uLWNoZXZyb24tbGVmdDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwQTQnfSAvKiDvgqQgKi9cXHJcXG4ub2N0aWNvbi1jaGV2cm9uLXJpZ2h0OmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA3OCd9IC8qIO+BuCAqL1xcclxcbi5vY3RpY29uLWNoZXZyb24tdXA6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMEEyJ30gLyog74KiICovXFxyXFxuLm9jdGljb24tY2lyY2xlLXNsYXNoOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA4NCd9IC8qIO+ChCAqL1xcclxcbi5vY3RpY29uLWNpcmN1aXQtYm9hcmQ6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMEQ2J30gLyog74OWICovXFxyXFxuLm9jdGljb24tY2xpcHB5OmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAzNSd9IC8qIO+AtSAqL1xcclxcbi5vY3RpY29uLWNsb2NrOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA0Nid9IC8qIO+BhiAqL1xcclxcbi5vY3RpY29uLWNsb3VkLWRvd25sb2FkOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAwQid9IC8qIO+AiyAqL1xcclxcbi5vY3RpY29uLWNsb3VkLXVwbG9hZDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMEMnfSAvKiDvgIwgKi9cXHJcXG4ub2N0aWNvbi1jb2RlOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA1Rid9IC8qIO+BnyAqL1xcclxcbi5vY3RpY29uLWNvbW1lbnQtYWRkOmJlZm9yZSwgLm9jdGljb24tY29tbWVudDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMkInfSAvKiDvgKsgKi9cXHJcXG4ub2N0aWNvbi1jb21tZW50LWRpc2N1c3Npb246YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDRGJ30gLyog74GPICovXFxyXFxuLm9jdGljb24tY3JlZGl0LWNhcmQ6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDQ1J30gLyog74GFICovXFxyXFxuLm9jdGljb24tZGFzaDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwQ0EnfSAvKiDvg4ogKi9cXHJcXG4ub2N0aWNvbi1kYXNoYm9hcmQ6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDdEJ30gLyog74G9ICovXFxyXFxuLm9jdGljb24tZGF0YWJhc2U6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDk2J30gLyog74KWICovXFxyXFxuLm9jdGljb24tY2xvbmU6YmVmb3JlLCAub2N0aWNvbi1kZXNrdG9wLWRvd25sb2FkOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjBEQyd9IC8qIO+DnCAqL1xcclxcbi5vY3RpY29uLWRldmljZS1jYW1lcmE6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDU2J30gLyog74GWICovXFxyXFxuLm9jdGljb24tZGV2aWNlLWNhbWVyYS12aWRlbzpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNTcnfSAvKiDvgZcgKi9cXHJcXG4ub2N0aWNvbi1kZXZpY2UtZGVza3RvcDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYyN0MnfSAvKiDvibwgKi9cXHJcXG4ub2N0aWNvbi1kZXZpY2UtbW9iaWxlOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAzOCd9IC8qIO+AuCAqL1xcclxcbi5vY3RpY29uLWRpZmY6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDREJ30gLyog74GNICovXFxyXFxuLm9jdGljb24tZGlmZi1hZGRlZDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNkInfSAvKiDvgasgKi9cXHJcXG4ub2N0aWNvbi1kaWZmLWlnbm9yZWQ6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDk5J30gLyog74KZICovXFxyXFxuLm9jdGljb24tZGlmZi1tb2RpZmllZDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNkQnfSAvKiDvga0gKi9cXHJcXG4ub2N0aWNvbi1kaWZmLXJlbW92ZWQ6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDZDJ30gLyog74GsICovXFxyXFxuLm9jdGljb24tZGlmZi1yZW5hbWVkOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA2RSd9IC8qIO+BriAqL1xcclxcbi5vY3RpY29uLWVsbGlwc2lzOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA5QSd9IC8qIO+CmiAqL1xcclxcbi5vY3RpY29uLWV5ZS11bndhdGNoOmJlZm9yZSwgLm9jdGljb24tZXllLXdhdGNoOmJlZm9yZSwgLm9jdGljb24tZXllOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA0RSd9IC8qIO+BjiAqL1xcclxcbi5vY3RpY29uLWZpbGUtYmluYXJ5OmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA5NCd9IC8qIO+ClCAqL1xcclxcbi5vY3RpY29uLWZpbGUtY29kZTpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMTAnfSAvKiDvgJAgKi9cXHJcXG4ub2N0aWNvbi1maWxlLWRpcmVjdG9yeTpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMTYnfSAvKiDvgJYgKi9cXHJcXG4ub2N0aWNvbi1maWxlLW1lZGlhOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAxMid9IC8qIO+AkiAqL1xcclxcbi5vY3RpY29uLWZpbGUtcGRmOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAxNCd9IC8qIO+AlCAqL1xcclxcbi5vY3RpY29uLWZpbGUtc3VibW9kdWxlOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAxNyd9IC8qIO+AlyAqL1xcclxcbi5vY3RpY29uLWZpbGUtc3ltbGluay1kaXJlY3Rvcnk6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMEIxJ30gLyog74KxICovXFxyXFxuLm9jdGljb24tZmlsZS1zeW1saW5rLWZpbGU6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMEIwJ30gLyog74KwICovXFxyXFxuLm9jdGljb24tZmlsZS10ZXh0OmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAxMSd9IC8qIO+AkSAqL1xcclxcbi5vY3RpY29uLWZpbGUtemlwOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAxMyd9IC8qIO+AkyAqL1xcclxcbi5vY3RpY29uLWZsYW1lOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjBEMid9IC8qIO+DkiAqL1xcclxcbi5vY3RpY29uLWZvbGQ6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMENDJ30gLyog74OMICovXFxyXFxuLm9jdGljb24tZ2VhcjpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMkYnfSAvKiDvgK8gKi9cXHJcXG4ub2N0aWNvbi1naWZ0OmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA0Mid9IC8qIO+BgiAqL1xcclxcbi5vY3RpY29uLWdpc3Q6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDBFJ30gLyog74COICovXFxyXFxuLm9jdGljb24tZ2lzdC1zZWNyZXQ6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDhDJ30gLyog74KMICovXFxyXFxuLm9jdGljb24tZ2l0LWJyYW5jaC1jcmVhdGU6YmVmb3JlLCAub2N0aWNvbi1naXQtYnJhbmNoLWRlbGV0ZTpiZWZvcmUsIC5vY3RpY29uLWdpdC1icmFuY2g6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDIwJ30gLyog74CgICovXFxyXFxuLm9jdGljb24tZ2l0LWNvbW1pdDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMUYnfSAvKiDvgJ8gKi9cXHJcXG4ub2N0aWNvbi1naXQtY29tcGFyZTpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwQUMnfSAvKiDvgqwgKi9cXHJcXG4ub2N0aWNvbi1naXQtbWVyZ2U6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDIzJ30gLyog74CjICovXFxyXFxuLm9jdGljb24tZ2l0LXB1bGwtcmVxdWVzdC1hYmFuZG9uZWQ6YmVmb3JlLCAub2N0aWNvbi1naXQtcHVsbC1yZXF1ZXN0OmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAwOSd9IC8qIO+AiSAqL1xcclxcbi5vY3RpY29uLWdsb2JlOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjBCNid9IC8qIO+CtiAqL1xcclxcbi5vY3RpY29uLWdyYXBoOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA0Myd9IC8qIO+BgyAqL1xcclxcbi5vY3RpY29uLWhlYXJ0OmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcMjY2NSd9IC8qIOKZpSAqL1xcclxcbi5vY3RpY29uLWhpc3Rvcnk6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDdFJ30gLyog74G+ICovXFxyXFxuLm9jdGljb24taG9tZTpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwOEQnfSAvKiDvgo0gKi9cXHJcXG4ub2N0aWNvbi1ob3Jpem9udGFsLXJ1bGU6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDcwJ30gLyog74GwICovXFxyXFxuLm9jdGljb24taHVib3Q6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDlEJ30gLyog74KdICovXFxyXFxuLm9jdGljb24taW5ib3g6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMENGJ30gLyog74OPICovXFxyXFxuLm9jdGljb24taW5mbzpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNTknfSAvKiDvgZkgKi9cXHJcXG4ub2N0aWNvbi1pc3N1ZS1jbG9zZWQ6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDI4J30gLyog74CoICovXFxyXFxuLm9jdGljb24taXNzdWUtb3BlbmVkOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAyNid9IC8qIO+ApiAqL1xcclxcbi5vY3RpY29uLWlzc3VlLXJlb3BlbmVkOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAyNyd9IC8qIO+ApyAqL1xcclxcbi5vY3RpY29uLWl0YWxpYzpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwRTQnfSAvKiDvg6QgKi9cXHJcXG4ub2N0aWNvbi1qZXJzZXk6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDE5J30gLyog74CZICovXFxyXFxuLm9jdGljb24ta2V5OmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA0OSd9IC8qIO+BiSAqL1xcclxcbi5vY3RpY29uLWtleWJvYXJkOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAwRCd9IC8qIO+AjSAqL1xcclxcbi5vY3RpY29uLWxhdzpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwRDgnfSAvKiDvg5ggKi9cXHJcXG4ub2N0aWNvbi1saWdodC1idWxiOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAwMCd9IC8qIO+AgCAqL1xcclxcbi5vY3RpY29uLWxpbms6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDVDJ30gLyog74GcICovXFxyXFxuLm9jdGljb24tbGluay1leHRlcm5hbDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwN0YnfSAvKiDvgb8gKi9cXHJcXG4ub2N0aWNvbi1saXN0LW9yZGVyZWQ6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDYyJ30gLyog74GiICovXFxyXFxuLm9jdGljb24tbGlzdC11bm9yZGVyZWQ6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDYxJ30gLyog74GhICovXFxyXFxuLm9jdGljb24tbG9jYXRpb246YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDYwJ30gLyog74GgICovXFxyXFxuLm9jdGljb24tZ2lzdC1wcml2YXRlOmJlZm9yZSwgLm9jdGljb24tbWlycm9yLXByaXZhdGU6YmVmb3JlLCAub2N0aWNvbi1naXQtZm9yay1wcml2YXRlOmJlZm9yZSwgLm9jdGljb24tbG9jazpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNkEnfSAvKiDvgaogKi9cXHJcXG4ub2N0aWNvbi1sb2dvLWdpc3Q6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMEFEJ30gLyog74KtICovXFxyXFxuLm9jdGljb24tbG9nby1naXRodWI6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDkyJ30gLyog74KSICovXFxyXFxuLm9jdGljb24tbWFpbDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwM0InfSAvKiDvgLsgKi9cXHJcXG4ub2N0aWNvbi1tYWlsLXJlYWQ6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDNDJ30gLyog74C8ICovXFxyXFxuLm9jdGljb24tbWFpbC1yZXBseTpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNTEnfSAvKiDvgZEgKi9cXHJcXG4ub2N0aWNvbi1tYXJrLWdpdGh1YjpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMEEnfSAvKiDvgIogKi9cXHJcXG4ub2N0aWNvbi1tYXJrZG93bjpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwQzknfSAvKiDvg4kgKi9cXHJcXG4ub2N0aWNvbi1tZWdhcGhvbmU6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDc3J30gLyog74G3ICovXFxyXFxuLm9jdGljb24tbWVudGlvbjpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwQkUnfSAvKiDvgr4gKi9cXHJcXG4ub2N0aWNvbi1taWxlc3RvbmU6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDc1J30gLyog74G1ICovXFxyXFxuLm9jdGljb24tbWlycm9yLXB1YmxpYzpiZWZvcmUsIC5vY3RpY29uLW1pcnJvcjpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMjQnfSAvKiDvgKQgKi9cXHJcXG4ub2N0aWNvbi1tb3J0YXItYm9hcmQ6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMEQ3J30gLyog74OXICovXFxyXFxuLm9jdGljb24tbXV0ZTpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwODAnfSAvKiDvgoAgKi9cXHJcXG4ub2N0aWNvbi1uby1uZXdsaW5lOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA5Qyd9IC8qIO+CnCAqL1xcclxcbi5vY3RpY29uLW9jdG9mYWNlOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAwOCd9IC8qIO+AiCAqL1xcclxcbi5vY3RpY29uLW9yZ2FuaXphdGlvbjpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMzcnfSAvKiDvgLcgKi9cXHJcXG4ub2N0aWNvbi1wYWNrYWdlOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjBDNCd9IC8qIO+DhCAqL1xcclxcbi5vY3RpY29uLXBhaW50Y2FuOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjBEMSd9IC8qIO+DkSAqL1xcclxcbi5vY3RpY29uLXBlbmNpbDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNTgnfSAvKiDvgZggKi9cXHJcXG4ub2N0aWNvbi1wZXJzb24tYWRkOmJlZm9yZSwgLm9jdGljb24tcGVyc29uLWZvbGxvdzpiZWZvcmUsIC5vY3RpY29uLXBlcnNvbjpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMTgnfSAvKiDvgJggKi9cXHJcXG4ub2N0aWNvbi1waW46YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDQxJ30gLyog74GBICovXFxyXFxuLm9jdGljb24tcGx1ZzpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwRDQnfSAvKiDvg5QgKi9cXHJcXG4ub2N0aWNvbi1yZXBvLWNyZWF0ZTpiZWZvcmUsIC5vY3RpY29uLWdpc3QtbmV3OmJlZm9yZSwgLm9jdGljb24tZmlsZS1kaXJlY3RvcnktY3JlYXRlOmJlZm9yZSwgLm9jdGljb24tZmlsZS1hZGQ6YmVmb3JlLCAub2N0aWNvbi1wbHVzOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA1RCd9IC8qIO+BnSAqL1xcclxcbi5vY3RpY29uLXByaW1pdGl2ZS1kb3Q6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDUyJ30gLyog74GSICovXFxyXFxuLm9jdGljb24tcHJpbWl0aXZlLXNxdWFyZTpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNTMnfSAvKiDvgZMgKi9cXHJcXG4ub2N0aWNvbi1wdWxzZTpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwODUnfSAvKiDvgoUgKi9cXHJcXG4ub2N0aWNvbi1xdWVzdGlvbjpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMkMnfSAvKiDvgKwgKi9cXHJcXG4ub2N0aWNvbi1xdW90ZTpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNjMnfSAvKiDvgaMgKi9cXHJcXG4ub2N0aWNvbi1yYWRpby10b3dlcjpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMzAnfSAvKiDvgLAgKi9cXHJcXG4ub2N0aWNvbi1yZXBvLWRlbGV0ZTpiZWZvcmUsIC5vY3RpY29uLXJlcG86YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDAxJ30gLyog74CBICovXFxyXFxuLm9jdGljb24tcmVwby1jbG9uZTpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNEMnfSAvKiDvgYwgKi9cXHJcXG4ub2N0aWNvbi1yZXBvLWZvcmNlLXB1c2g6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDRBJ30gLyog74GKICovXFxyXFxuLm9jdGljb24tZ2lzdC1mb3JrOmJlZm9yZSwgLm9jdGljb24tcmVwby1mb3JrZWQ6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDAyJ30gLyog74CCICovXFxyXFxuLm9jdGljb24tcmVwby1wdWxsOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAwNid9IC8qIO+AhiAqL1xcclxcbi5vY3RpY29uLXJlcG8tcHVzaDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMDUnfSAvKiDvgIUgKi9cXHJcXG4ub2N0aWNvbi1yb2NrZXQ6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDMzJ30gLyog74CzICovXFxyXFxuLm9jdGljb24tcnNzOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAzNCd9IC8qIO+AtCAqL1xcclxcbi5vY3RpY29uLXJ1Ynk6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDQ3J30gLyog74GHICovXFxyXFxuLm9jdGljb24tc2VhcmNoLXNhdmU6YmVmb3JlLCAub2N0aWNvbi1zZWFyY2g6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDJFJ30gLyog74CuICovXFxyXFxuLm9jdGljb24tc2VydmVyOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA5Nyd9IC8qIO+ClyAqL1xcclxcbi5vY3RpY29uLXNldHRpbmdzOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA3Qyd9IC8qIO+BvCAqL1xcclxcbi5vY3RpY29uLXNoaWVsZDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwRTEnfSAvKiDvg6EgKi9cXHJcXG4ub2N0aWNvbi1sb2ctaW46YmVmb3JlLCAub2N0aWNvbi1zaWduLWluOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAzNid9IC8qIO+AtiAqL1xcclxcbi5vY3RpY29uLWxvZy1vdXQ6YmVmb3JlLCAub2N0aWNvbi1zaWduLW91dDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMzInfSAvKiDvgLIgKi9cXHJcXG4ub2N0aWNvbi1zbWlsZXk6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMEU3J30gLyog74OnICovXFxyXFxuLm9jdGljb24tc3F1aXJyZWw6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMEIyJ30gLyog74KyICovXFxyXFxuLm9jdGljb24tc3Rhci1hZGQ6YmVmb3JlLCAub2N0aWNvbi1zdGFyLWRlbGV0ZTpiZWZvcmUsIC5vY3RpY29uLXN0YXI6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDJBJ30gLyog74CqICovXFxyXFxuLm9jdGljb24tc3RvcDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwOEYnfSAvKiDvgo8gKi9cXHJcXG4ub2N0aWNvbi1yZXBvLXN5bmM6YmVmb3JlLCAub2N0aWNvbi1zeW5jOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA4Nyd9IC8qIO+ChyAqL1xcclxcbi5vY3RpY29uLXRhZy1yZW1vdmU6YmVmb3JlLCAub2N0aWNvbi10YWctYWRkOmJlZm9yZSwgLm9jdGljb24tdGFnOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAxNSd9IC8qIO+AlSAqL1xcclxcbi5vY3RpY29uLXRhc2tsaXN0OmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjBFNSd9IC8qIO+DpSAqL1xcclxcbi5vY3RpY29uLXRlbGVzY29wZTpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwODgnfSAvKiDvgoggKi9cXHJcXG4ub2N0aWNvbi10ZXJtaW5hbDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwQzgnfSAvKiDvg4ggKi9cXHJcXG4ub2N0aWNvbi10ZXh0LXNpemU6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMEUzJ30gLyog74OjICovXFxyXFxuLm9jdGljb24tdGhyZWUtYmFyczpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNUUnfSAvKiDvgZ4gKi9cXHJcXG4ub2N0aWNvbi10aHVtYnNkb3duOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjBEQid9IC8qIO+DmyAqL1xcclxcbi5vY3RpY29uLXRodW1ic3VwOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjBEQSd9IC8qIO+DmiAqL1xcclxcbi5vY3RpY29uLXRvb2xzOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAzMSd9IC8qIO+AsSAqL1xcclxcbi5vY3RpY29uLXRyYXNoY2FuOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjBEMCd9IC8qIO+DkCAqL1xcclxcbi5vY3RpY29uLXRyaWFuZ2xlLWRvd246YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDVCJ30gLyog74GbICovXFxyXFxuLm9jdGljb24tdHJpYW5nbGUtbGVmdDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNDQnfSAvKiDvgYQgKi9cXHJcXG4ub2N0aWNvbi10cmlhbmdsZS1yaWdodDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNUEnfSAvKiDvgZogKi9cXHJcXG4ub2N0aWNvbi10cmlhbmdsZS11cDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwQUEnfSAvKiDvgqogKi9cXHJcXG4ub2N0aWNvbi11bmZvbGQ6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDM5J30gLyog74C5ICovXFxyXFxuLm9jdGljb24tdW5tdXRlOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjBCQSd9IC8qIO+CuiAqL1xcclxcbi5vY3RpY29uLXZlcmlmaWVkOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjBFNid9IC8qIO+DpiAqL1xcclxcbi5vY3RpY29uLXZlcnNpb25zOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA2NCd9IC8qIO+BpCAqL1xcclxcbi5vY3RpY29uLXdhdGNoOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjBFMCd9IC8qIO+DoCAqL1xcclxcbi5vY3RpY29uLXJlbW92ZS1jbG9zZTpiZWZvcmUsIC5vY3RpY29uLXg6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDgxJ30gLyog74KBICovXFxyXFxuLm9jdGljb24temFwOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcMjZBMSd9IC8qIOKaoSAqL1xcclxcblxcclxcblxcclxcblwiLCBcIlwiXSk7XG5cbi8vIGV4cG9ydHNcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jc3MtbG9hZGVyIS4vfi9wb3N0Y3NzLWxvYWRlci9saWI/e1wicGx1Z2luc1wiOltudWxsLG51bGxdfSEuL3NyYy9hc3NldHMvaW1nL29jdGljb24vb2N0aWNvbi5jc3Ncbi8vIG1vZHVsZSBpZCA9IDExM1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IF9fd2VicGFja19wdWJsaWNfcGF0aF9fICsgXCJpbWcvTWF0ZXJpYWxJY29ucy1SZWd1bGFyLmVvdFwiO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2Fzc2V0cy9pbWcvaWNvbmZvbnQvTWF0ZXJpYWxJY29ucy1SZWd1bGFyLmVvdFxuLy8gbW9kdWxlIGlkID0gMTE0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gX193ZWJwYWNrX3B1YmxpY19wYXRoX18gKyBcImltZy9NYXRlcmlhbEljb25zLVJlZ3VsYXIudHRmXCI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvYXNzZXRzL2ltZy9pY29uZm9udC9NYXRlcmlhbEljb25zLVJlZ3VsYXIudHRmXG4vLyBtb2R1bGUgaWQgPSAxMTVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyArIFwiaW1nL01hdGVyaWFsSWNvbnMtUmVndWxhci53b2ZmXCI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvYXNzZXRzL2ltZy9pY29uZm9udC9NYXRlcmlhbEljb25zLVJlZ3VsYXIud29mZlxuLy8gbW9kdWxlIGlkID0gMTE2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gX193ZWJwYWNrX3B1YmxpY19wYXRoX18gKyBcImltZy9NYXRlcmlhbEljb25zLVJlZ3VsYXIud29mZjJcIjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9hc3NldHMvaW1nL2ljb25mb250L01hdGVyaWFsSWNvbnMtUmVndWxhci53b2ZmMlxuLy8gbW9kdWxlIGlkID0gMTE3XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gX193ZWJwYWNrX3B1YmxpY19wYXRoX18gKyBcImltZy9vY3RpY29ucy50dGZcIjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9hc3NldHMvaW1nL29jdGljb24vb2N0aWNvbnMudHRmXG4vLyBtb2R1bGUgaWQgPSAxMThcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyArIFwiaW1nL29jdGljb25zLndvZmZcIjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9hc3NldHMvaW1nL29jdGljb24vb2N0aWNvbnMud29mZlxuLy8gbW9kdWxlIGlkID0gMTE5XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gX193ZWJwYWNrX3B1YmxpY19wYXRoX18gKyBcImltZy9yb2JvdG8tdjE1LWxhdGluLXJlZ3VsYXIud29mZlwiO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2Fzc2V0cy9pbWcvcm9ib3RvL3JvYm90by12MTUtbGF0aW4tcmVndWxhci53b2ZmXG4vLyBtb2R1bGUgaWQgPSAxMjBcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyArIFwiaW1nL3JvYm90by12MTUtbGF0aW4tcmVndWxhci53b2ZmMlwiO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2Fzc2V0cy9pbWcvcm9ib3RvL3JvYm90by12MTUtbGF0aW4tcmVndWxhci53b2ZmMlxuLy8gbW9kdWxlIGlkID0gMTIxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImltcG9ydCB7IEpzb25TZXJ2aWNlQ2xpZW50LCBzYW5pdGl6ZSB9IGZyb20gJ3NlcnZpY2VzdGFjay1jbGllbnQnO1xyXG5cclxuZGVjbGFyZSB2YXIgZ2xvYmFsOyAvL3BvcHVsYXRlZCBmcm9tIHBhY2thZ2UuanNvbi9qZXN0XHJcblxyXG5leHBvcnQgdmFyIEJhc2VQYXRoID0gbG9jYXRpb24ucGF0aG5hbWUuc3Vic3RyaW5nKDAsIGxvY2F0aW9uLnBhdGhuYW1lLmluZGV4T2YoXCIvc3NfYWRtaW5cIikgKyAxKTtcclxuXHJcbmV4cG9ydCB2YXIgY2xpZW50ID0gbmV3IEpzb25TZXJ2aWNlQ2xpZW50KGdsb2JhbC5CYXNlVXJsIHx8IEJhc2VQYXRoKTtcclxuXHJcbmV4cG9ydCBjb25zdCBub3JtYWxpemVLZXkgPSAoa2V5OiBzdHJpbmcpID0+IGtleS50b0xvd2VyQ2FzZSgpLnJlcGxhY2UoL18vZywgJycpO1xyXG5cclxuY29uc3QgaXNBcnJheSA9IChvOiBhbnkpID0+IE9iamVjdC5wcm90b3R5cGUudG9TdHJpbmcuY2FsbChvKSA9PT0gJ1tvYmplY3QgQXJyYXldJztcclxuXHJcbmNvbnN0IGxvZyA9IChvOiBhbnkpID0+IHsgY29uc29sZS5sb2cobywgdHlwZW9mKG8pKTsgcmV0dXJuIG87IH1cclxuXHJcbmV4cG9ydCBjb25zdCBub3JtYWxpemUgPSAoZHRvOiBhbnksIGRlZXA/OiBib29sZWFuKSA9PiB7XHJcbiAgICBpZiAoaXNBcnJheShkdG8pKSB7XHJcbiAgICAgICAgaWYgKCFkZWVwKSByZXR1cm4gZHRvO1xyXG4gICAgICAgIGNvbnN0IHRvID0gW107XHJcbiAgICAgICAgZm9yIChsZXQgaSA9IDA7IGkgPCBkdG8ubGVuZ3RoOyBpKyspIHtcclxuICAgICAgICAgICAgdG9baV0gPSBub3JtYWxpemUoZHRvW2ldLCBkZWVwKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgcmV0dXJuIHRvO1xyXG4gICAgfVxyXG4gICAgaWYgKHR5cGVvZiBkdG8gIT0gXCJvYmplY3RcIikgcmV0dXJuIGR0bztcclxuICAgIHZhciBvID0ge307XHJcbiAgICBmb3IgKGxldCBrIGluIGR0bykge1xyXG4gICAgICAgIG9bbm9ybWFsaXplS2V5KGspXSA9IGRlZXAgPyBub3JtYWxpemUoZHRvW2tdLCBkZWVwKSA6IGR0b1trXTtcclxuICAgIH1cclxuICAgIHJldHVybiBvO1xyXG59XHJcblxyXG5leHBvcnQgY29uc3QgZ2V0RmllbGQgPSAobzogYW55LCBuYW1lOiBzdHJpbmcpID0+XHJcbiAgICBvID09IG51bGwgfHwgbmFtZSA9PSBudWxsID8gbnVsbCA6XHJcbiAgICAgICAgb1tuYW1lXSB8fFxyXG4gICAgICAgIG9bT2JqZWN0LmtleXMobykuZmlsdGVyKGsgPT4gbm9ybWFsaXplS2V5KGspID09PSBub3JtYWxpemVLZXkobmFtZSkpWzBdIHx8ICcnXTtcclxuXHJcbmV4cG9ydCBjb25zdCBwYXJzZVJlc3BvbnNlU3RhdHVzID0gKGpzb24sIGRlZmF1bHRNc2c9bnVsbCkgPT4ge1xyXG4gICAgdHJ5IHtcclxuICAgICAgICB2YXIgZXJyID0gSlNPTi5wYXJzZShqc29uKTtcclxuICAgICAgICByZXR1cm4gc2FuaXRpemUoZXJyLlJlc3BvbnNlU3RhdHVzIHx8IGVyci5yZXNwb25zZVN0YXR1cyk7XHJcbiAgICB9IGNhdGNoIChlKSB7XHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgbWVzc2FnZTogZGVmYXVsdE1zZyxcclxuICAgICAgICAgICAgX19lcnJvcjogeyBlcnJvcjogZSwganNvbjoganNvbiB9XHJcbiAgICAgICAgfTtcclxuICAgIH1cclxufTtcblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvc2hhcmVkLnRzeCIsIlxuLyoqXG4gKiBXaGVuIHNvdXJjZSBtYXBzIGFyZSBlbmFibGVkLCBgc3R5bGUtbG9hZGVyYCB1c2VzIGEgbGluayBlbGVtZW50IHdpdGggYSBkYXRhLXVyaSB0b1xuICogZW1iZWQgdGhlIGNzcyBvbiB0aGUgcGFnZS4gVGhpcyBicmVha3MgYWxsIHJlbGF0aXZlIHVybHMgYmVjYXVzZSBub3cgdGhleSBhcmUgcmVsYXRpdmUgdG8gYVxuICogYnVuZGxlIGluc3RlYWQgb2YgdGhlIGN1cnJlbnQgcGFnZS5cbiAqXG4gKiBPbmUgc29sdXRpb24gaXMgdG8gb25seSB1c2UgZnVsbCB1cmxzLCBidXQgdGhhdCBtYXkgYmUgaW1wb3NzaWJsZS5cbiAqXG4gKiBJbnN0ZWFkLCB0aGlzIGZ1bmN0aW9uIFwiZml4ZXNcIiB0aGUgcmVsYXRpdmUgdXJscyB0byBiZSBhYnNvbHV0ZSBhY2NvcmRpbmcgdG8gdGhlIGN1cnJlbnQgcGFnZSBsb2NhdGlvbi5cbiAqXG4gKiBBIHJ1ZGltZW50YXJ5IHRlc3Qgc3VpdGUgaXMgbG9jYXRlZCBhdCBgdGVzdC9maXhVcmxzLmpzYCBhbmQgY2FuIGJlIHJ1biB2aWEgdGhlIGBucG0gdGVzdGAgY29tbWFuZC5cbiAqXG4gKi9cblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbiAoY3NzKSB7XG4gIC8vIGdldCBjdXJyZW50IGxvY2F0aW9uXG4gIHZhciBsb2NhdGlvbiA9IHR5cGVvZiB3aW5kb3cgIT09IFwidW5kZWZpbmVkXCIgJiYgd2luZG93LmxvY2F0aW9uO1xuXG4gIGlmICghbG9jYXRpb24pIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoXCJmaXhVcmxzIHJlcXVpcmVzIHdpbmRvdy5sb2NhdGlvblwiKTtcbiAgfVxuXG5cdC8vIGJsYW5rIG9yIG51bGw/XG5cdGlmICghY3NzIHx8IHR5cGVvZiBjc3MgIT09IFwic3RyaW5nXCIpIHtcblx0ICByZXR1cm4gY3NzO1xuICB9XG5cbiAgdmFyIGJhc2VVcmwgPSBsb2NhdGlvbi5wcm90b2NvbCArIFwiLy9cIiArIGxvY2F0aW9uLmhvc3Q7XG4gIHZhciBjdXJyZW50RGlyID0gYmFzZVVybCArIGxvY2F0aW9uLnBhdGhuYW1lLnJlcGxhY2UoL1xcL1teXFwvXSokLywgXCIvXCIpO1xuXG5cdC8vIGNvbnZlcnQgZWFjaCB1cmwoLi4uKVxuXHQvKlxuXHRUaGlzIHJlZ3VsYXIgZXhwcmVzc2lvbiBpcyBqdXN0IGEgd2F5IHRvIHJlY3Vyc2l2ZWx5IG1hdGNoIGJyYWNrZXRzIHdpdGhpblxuXHRhIHN0cmluZy5cblxuXHQgL3VybFxccypcXCggID0gTWF0Y2ggb24gdGhlIHdvcmQgXCJ1cmxcIiB3aXRoIGFueSB3aGl0ZXNwYWNlIGFmdGVyIGl0IGFuZCB0aGVuIGEgcGFyZW5zXG5cdCAgICggID0gU3RhcnQgYSBjYXB0dXJpbmcgZ3JvdXBcblx0ICAgICAoPzogID0gU3RhcnQgYSBub24tY2FwdHVyaW5nIGdyb3VwXG5cdCAgICAgICAgIFteKShdICA9IE1hdGNoIGFueXRoaW5nIHRoYXQgaXNuJ3QgYSBwYXJlbnRoZXNlc1xuXHQgICAgICAgICB8ICA9IE9SXG5cdCAgICAgICAgIFxcKCAgPSBNYXRjaCBhIHN0YXJ0IHBhcmVudGhlc2VzXG5cdCAgICAgICAgICAgICAoPzogID0gU3RhcnQgYW5vdGhlciBub24tY2FwdHVyaW5nIGdyb3Vwc1xuXHQgICAgICAgICAgICAgICAgIFteKShdKyAgPSBNYXRjaCBhbnl0aGluZyB0aGF0IGlzbid0IGEgcGFyZW50aGVzZXNcblx0ICAgICAgICAgICAgICAgICB8ICA9IE9SXG5cdCAgICAgICAgICAgICAgICAgXFwoICA9IE1hdGNoIGEgc3RhcnQgcGFyZW50aGVzZXNcblx0ICAgICAgICAgICAgICAgICAgICAgW14pKF0qICA9IE1hdGNoIGFueXRoaW5nIHRoYXQgaXNuJ3QgYSBwYXJlbnRoZXNlc1xuXHQgICAgICAgICAgICAgICAgIFxcKSAgPSBNYXRjaCBhIGVuZCBwYXJlbnRoZXNlc1xuXHQgICAgICAgICAgICAgKSAgPSBFbmQgR3JvdXBcbiAgICAgICAgICAgICAgKlxcKSA9IE1hdGNoIGFueXRoaW5nIGFuZCB0aGVuIGEgY2xvc2UgcGFyZW5zXG4gICAgICAgICAgKSAgPSBDbG9zZSBub24tY2FwdHVyaW5nIGdyb3VwXG4gICAgICAgICAgKiAgPSBNYXRjaCBhbnl0aGluZ1xuICAgICAgICkgID0gQ2xvc2UgY2FwdHVyaW5nIGdyb3VwXG5cdCBcXCkgID0gTWF0Y2ggYSBjbG9zZSBwYXJlbnNcblxuXHQgL2dpICA9IEdldCBhbGwgbWF0Y2hlcywgbm90IHRoZSBmaXJzdC4gIEJlIGNhc2UgaW5zZW5zaXRpdmUuXG5cdCAqL1xuXHR2YXIgZml4ZWRDc3MgPSBjc3MucmVwbGFjZSgvdXJsXFxzKlxcKCgoPzpbXikoXXxcXCgoPzpbXikoXSt8XFwoW14pKF0qXFwpKSpcXCkpKilcXCkvZ2ksIGZ1bmN0aW9uKGZ1bGxNYXRjaCwgb3JpZ1VybCkge1xuXHRcdC8vIHN0cmlwIHF1b3RlcyAoaWYgdGhleSBleGlzdClcblx0XHR2YXIgdW5xdW90ZWRPcmlnVXJsID0gb3JpZ1VybFxuXHRcdFx0LnRyaW0oKVxuXHRcdFx0LnJlcGxhY2UoL15cIiguKilcIiQvLCBmdW5jdGlvbihvLCAkMSl7IHJldHVybiAkMTsgfSlcblx0XHRcdC5yZXBsYWNlKC9eJyguKiknJC8sIGZ1bmN0aW9uKG8sICQxKXsgcmV0dXJuICQxOyB9KTtcblxuXHRcdC8vIGFscmVhZHkgYSBmdWxsIHVybD8gbm8gY2hhbmdlXG5cdFx0aWYgKC9eKCN8ZGF0YTp8aHR0cDpcXC9cXC98aHR0cHM6XFwvXFwvfGZpbGU6XFwvXFwvXFwvKS9pLnRlc3QodW5xdW90ZWRPcmlnVXJsKSkge1xuXHRcdCAgcmV0dXJuIGZ1bGxNYXRjaDtcblx0XHR9XG5cblx0XHQvLyBjb252ZXJ0IHRoZSB1cmwgdG8gYSBmdWxsIHVybFxuXHRcdHZhciBuZXdVcmw7XG5cblx0XHRpZiAodW5xdW90ZWRPcmlnVXJsLmluZGV4T2YoXCIvL1wiKSA9PT0gMCkge1xuXHRcdCAgXHQvL1RPRE86IHNob3VsZCB3ZSBhZGQgcHJvdG9jb2w/XG5cdFx0XHRuZXdVcmwgPSB1bnF1b3RlZE9yaWdVcmw7XG5cdFx0fSBlbHNlIGlmICh1bnF1b3RlZE9yaWdVcmwuaW5kZXhPZihcIi9cIikgPT09IDApIHtcblx0XHRcdC8vIHBhdGggc2hvdWxkIGJlIHJlbGF0aXZlIHRvIHRoZSBiYXNlIHVybFxuXHRcdFx0bmV3VXJsID0gYmFzZVVybCArIHVucXVvdGVkT3JpZ1VybDsgLy8gYWxyZWFkeSBzdGFydHMgd2l0aCAnLydcblx0XHR9IGVsc2Uge1xuXHRcdFx0Ly8gcGF0aCBzaG91bGQgYmUgcmVsYXRpdmUgdG8gY3VycmVudCBkaXJlY3Rvcnlcblx0XHRcdG5ld1VybCA9IGN1cnJlbnREaXIgKyB1bnF1b3RlZE9yaWdVcmwucmVwbGFjZSgvXlxcLlxcLy8sIFwiXCIpOyAvLyBTdHJpcCBsZWFkaW5nICcuLydcblx0XHR9XG5cblx0XHQvLyBzZW5kIGJhY2sgdGhlIGZpeGVkIHVybCguLi4pXG5cdFx0cmV0dXJuIFwidXJsKFwiICsgSlNPTi5zdHJpbmdpZnkobmV3VXJsKSArIFwiKVwiO1xuXHR9KTtcblxuXHQvLyBzZW5kIGJhY2sgdGhlIGZpeGVkIGNzc1xuXHRyZXR1cm4gZml4ZWRDc3M7XG59O1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L3N0eWxlLWxvYWRlci9maXhVcmxzLmpzXG4vLyBtb2R1bGUgaWQgPSAyNTFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gc3R5bGUtbG9hZGVyOiBBZGRzIHNvbWUgY3NzIHRvIHRoZSBET00gYnkgYWRkaW5nIGEgPHN0eWxlPiB0YWdcblxuLy8gbG9hZCB0aGUgc3R5bGVzXG52YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzIS4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9saWIvaW5kZXguanM/P3JlZi0tNS0yIS4vYXBwLmNzc1wiKTtcbmlmKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykgY29udGVudCA9IFtbbW9kdWxlLmlkLCBjb250ZW50LCAnJ11dO1xuLy8gUHJlcGFyZSBjc3NUcmFuc2Zvcm1hdGlvblxudmFyIHRyYW5zZm9ybTtcblxudmFyIG9wdGlvbnMgPSB7fVxub3B0aW9ucy50cmFuc2Zvcm0gPSB0cmFuc2Zvcm1cbi8vIGFkZCB0aGUgc3R5bGVzIHRvIHRoZSBET01cbnZhciB1cGRhdGUgPSByZXF1aXJlKFwiIS4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvYWRkU3R5bGVzLmpzXCIpKGNvbnRlbnQsIG9wdGlvbnMpO1xuaWYoY29udGVudC5sb2NhbHMpIG1vZHVsZS5leHBvcnRzID0gY29udGVudC5sb2NhbHM7XG4vLyBIb3QgTW9kdWxlIFJlcGxhY2VtZW50XG5pZihtb2R1bGUuaG90KSB7XG5cdC8vIFdoZW4gdGhlIHN0eWxlcyBjaGFuZ2UsIHVwZGF0ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdGlmKCFjb250ZW50LmxvY2Fscykge1xuXHRcdG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvbGliL2luZGV4LmpzPz9yZWYtLTUtMiEuL2FwcC5jc3NcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgbmV3Q29udGVudCA9IHJlcXVpcmUoXCIhIS4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzIS4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9saWIvaW5kZXguanM/P3JlZi0tNS0yIS4vYXBwLmNzc1wiKTtcblx0XHRcdGlmKHR5cGVvZiBuZXdDb250ZW50ID09PSAnc3RyaW5nJykgbmV3Q29udGVudCA9IFtbbW9kdWxlLmlkLCBuZXdDb250ZW50LCAnJ11dO1xuXHRcdFx0dXBkYXRlKG5ld0NvbnRlbnQpO1xuXHRcdH0pO1xuXHR9XG5cdC8vIFdoZW4gdGhlIG1vZHVsZSBpcyBkaXNwb3NlZCwgcmVtb3ZlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0bW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyB1cGRhdGUoKTsgfSk7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvYXBwLmNzc1xuLy8gbW9kdWxlIGlkID0gMjU0XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIHN0eWxlLWxvYWRlcjogQWRkcyBzb21lIGNzcyB0byB0aGUgRE9NIGJ5IGFkZGluZyBhIDxzdHlsZT4gdGFnXG5cbi8vIGxvYWQgdGhlIHN0eWxlc1xudmFyIGNvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvbGliL2luZGV4LmpzPz9yZWYtLTUtMiEuL21hdGVyaWFsLWljb25zLmNzc1wiKTtcbmlmKHR5cGVvZiBjb250ZW50ID09PSAnc3RyaW5nJykgY29udGVudCA9IFtbbW9kdWxlLmlkLCBjb250ZW50LCAnJ11dO1xuLy8gUHJlcGFyZSBjc3NUcmFuc2Zvcm1hdGlvblxudmFyIHRyYW5zZm9ybTtcblxudmFyIG9wdGlvbnMgPSB7fVxub3B0aW9ucy50cmFuc2Zvcm0gPSB0cmFuc2Zvcm1cbi8vIGFkZCB0aGUgc3R5bGVzIHRvIHRoZSBET01cbnZhciB1cGRhdGUgPSByZXF1aXJlKFwiIS4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9zdHlsZS1sb2FkZXIvYWRkU3R5bGVzLmpzXCIpKGNvbnRlbnQsIG9wdGlvbnMpO1xuaWYoY29udGVudC5sb2NhbHMpIG1vZHVsZS5leHBvcnRzID0gY29udGVudC5sb2NhbHM7XG4vLyBIb3QgTW9kdWxlIFJlcGxhY2VtZW50XG5pZihtb2R1bGUuaG90KSB7XG5cdC8vIFdoZW4gdGhlIHN0eWxlcyBjaGFuZ2UsIHVwZGF0ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdGlmKCFjb250ZW50LmxvY2Fscykge1xuXHRcdG1vZHVsZS5ob3QuYWNjZXB0KFwiISEuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvbGliL2luZGV4LmpzPz9yZWYtLTUtMiEuL21hdGVyaWFsLWljb25zLmNzc1wiLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBuZXdDb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2xpYi9pbmRleC5qcz8/cmVmLS01LTIhLi9tYXRlcmlhbC1pY29ucy5jc3NcIik7XG5cdFx0XHRpZih0eXBlb2YgbmV3Q29udGVudCA9PT0gJ3N0cmluZycpIG5ld0NvbnRlbnQgPSBbW21vZHVsZS5pZCwgbmV3Q29udGVudCwgJyddXTtcblx0XHRcdHVwZGF0ZShuZXdDb250ZW50KTtcblx0XHR9KTtcblx0fVxuXHQvLyBXaGVuIHRoZSBtb2R1bGUgaXMgZGlzcG9zZWQsIHJlbW92ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdG1vZHVsZS5ob3QuZGlzcG9zZShmdW5jdGlvbigpIHsgdXBkYXRlKCk7IH0pO1xufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2Fzc2V0cy9pbWcvaWNvbmZvbnQvbWF0ZXJpYWwtaWNvbnMuY3NzXG4vLyBtb2R1bGUgaWQgPSAyNTVcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLy8gc3R5bGUtbG9hZGVyOiBBZGRzIHNvbWUgY3NzIHRvIHRoZSBET00gYnkgYWRkaW5nIGEgPHN0eWxlPiB0YWdcblxuLy8gbG9hZCB0aGUgc3R5bGVzXG52YXIgY29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzIS4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9saWIvaW5kZXguanM/P3JlZi0tNS0yIS4vb2N0aWNvbi5jc3NcIik7XG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcbi8vIFByZXBhcmUgY3NzVHJhbnNmb3JtYXRpb25cbnZhciB0cmFuc2Zvcm07XG5cbnZhciBvcHRpb25zID0ge31cbm9wdGlvbnMudHJhbnNmb3JtID0gdHJhbnNmb3JtXG4vLyBhZGQgdGhlIHN0eWxlcyB0byB0aGUgRE9NXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2FkZFN0eWxlcy5qc1wiKShjb250ZW50LCBvcHRpb25zKTtcbmlmKGNvbnRlbnQubG9jYWxzKSBtb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzO1xuLy8gSG90IE1vZHVsZSBSZXBsYWNlbWVudFxuaWYobW9kdWxlLmhvdCkge1xuXHQvLyBXaGVuIHRoZSBzdHlsZXMgY2hhbmdlLCB1cGRhdGUgdGhlIDxzdHlsZT4gdGFnc1xuXHRpZighY29udGVudC5sb2NhbHMpIHtcblx0XHRtb2R1bGUuaG90LmFjY2VwdChcIiEhLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2xpYi9pbmRleC5qcz8/cmVmLS01LTIhLi9vY3RpY29uLmNzc1wiLCBmdW5jdGlvbigpIHtcblx0XHRcdHZhciBuZXdDb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2xpYi9pbmRleC5qcz8/cmVmLS01LTIhLi9vY3RpY29uLmNzc1wiKTtcblx0XHRcdGlmKHR5cGVvZiBuZXdDb250ZW50ID09PSAnc3RyaW5nJykgbmV3Q29udGVudCA9IFtbbW9kdWxlLmlkLCBuZXdDb250ZW50LCAnJ11dO1xuXHRcdFx0dXBkYXRlKG5ld0NvbnRlbnQpO1xuXHRcdH0pO1xuXHR9XG5cdC8vIFdoZW4gdGhlIG1vZHVsZSBpcyBkaXNwb3NlZCwgcmVtb3ZlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0bW9kdWxlLmhvdC5kaXNwb3NlKGZ1bmN0aW9uKCkgeyB1cGRhdGUoKTsgfSk7XG59XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvYXNzZXRzL2ltZy9vY3RpY29uL29jdGljb24uY3NzXG4vLyBtb2R1bGUgaWQgPSAyNTZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLypcblx0TUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcblx0QXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbi8vIGNzcyBiYXNlIGNvZGUsIGluamVjdGVkIGJ5IHRoZSBjc3MtbG9hZGVyXG5tb2R1bGUuZXhwb3J0cyA9IGZ1bmN0aW9uKHVzZVNvdXJjZU1hcCkge1xuXHR2YXIgbGlzdCA9IFtdO1xuXG5cdC8vIHJldHVybiB0aGUgbGlzdCBvZiBtb2R1bGVzIGFzIGNzcyBzdHJpbmdcblx0bGlzdC50b1N0cmluZyA9IGZ1bmN0aW9uIHRvU3RyaW5nKCkge1xuXHRcdHJldHVybiB0aGlzLm1hcChmdW5jdGlvbiAoaXRlbSkge1xuXHRcdFx0dmFyIGNvbnRlbnQgPSBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0sIHVzZVNvdXJjZU1hcCk7XG5cdFx0XHRpZihpdGVtWzJdKSB7XG5cdFx0XHRcdHJldHVybiBcIkBtZWRpYSBcIiArIGl0ZW1bMl0gKyBcIntcIiArIGNvbnRlbnQgKyBcIn1cIjtcblx0XHRcdH0gZWxzZSB7XG5cdFx0XHRcdHJldHVybiBjb250ZW50O1xuXHRcdFx0fVxuXHRcdH0pLmpvaW4oXCJcIik7XG5cdH07XG5cblx0Ly8gaW1wb3J0IGEgbGlzdCBvZiBtb2R1bGVzIGludG8gdGhlIGxpc3Rcblx0bGlzdC5pID0gZnVuY3Rpb24obW9kdWxlcywgbWVkaWFRdWVyeSkge1xuXHRcdGlmKHR5cGVvZiBtb2R1bGVzID09PSBcInN0cmluZ1wiKVxuXHRcdFx0bW9kdWxlcyA9IFtbbnVsbCwgbW9kdWxlcywgXCJcIl1dO1xuXHRcdHZhciBhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzID0ge307XG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IHRoaXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBpZCA9IHRoaXNbaV1bMF07XG5cdFx0XHRpZih0eXBlb2YgaWQgPT09IFwibnVtYmVyXCIpXG5cdFx0XHRcdGFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaWRdID0gdHJ1ZTtcblx0XHR9XG5cdFx0Zm9yKGkgPSAwOyBpIDwgbW9kdWxlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGl0ZW0gPSBtb2R1bGVzW2ldO1xuXHRcdFx0Ly8gc2tpcCBhbHJlYWR5IGltcG9ydGVkIG1vZHVsZVxuXHRcdFx0Ly8gdGhpcyBpbXBsZW1lbnRhdGlvbiBpcyBub3QgMTAwJSBwZXJmZWN0IGZvciB3ZWlyZCBtZWRpYSBxdWVyeSBjb21iaW5hdGlvbnNcblx0XHRcdC8vICB3aGVuIGEgbW9kdWxlIGlzIGltcG9ydGVkIG11bHRpcGxlIHRpbWVzIHdpdGggZGlmZmVyZW50IG1lZGlhIHF1ZXJpZXMuXG5cdFx0XHQvLyAgSSBob3BlIHRoaXMgd2lsbCBuZXZlciBvY2N1ciAoSGV5IHRoaXMgd2F5IHdlIGhhdmUgc21hbGxlciBidW5kbGVzKVxuXHRcdFx0aWYodHlwZW9mIGl0ZW1bMF0gIT09IFwibnVtYmVyXCIgfHwgIWFscmVhZHlJbXBvcnRlZE1vZHVsZXNbaXRlbVswXV0pIHtcblx0XHRcdFx0aWYobWVkaWFRdWVyeSAmJiAhaXRlbVsyXSkge1xuXHRcdFx0XHRcdGl0ZW1bMl0gPSBtZWRpYVF1ZXJ5O1xuXHRcdFx0XHR9IGVsc2UgaWYobWVkaWFRdWVyeSkge1xuXHRcdFx0XHRcdGl0ZW1bMl0gPSBcIihcIiArIGl0ZW1bMl0gKyBcIikgYW5kIChcIiArIG1lZGlhUXVlcnkgKyBcIilcIjtcblx0XHRcdFx0fVxuXHRcdFx0XHRsaXN0LnB1c2goaXRlbSk7XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xuXHRyZXR1cm4gbGlzdDtcbn07XG5cbmZ1bmN0aW9uIGNzc1dpdGhNYXBwaW5nVG9TdHJpbmcoaXRlbSwgdXNlU291cmNlTWFwKSB7XG5cdHZhciBjb250ZW50ID0gaXRlbVsxXSB8fCAnJztcblx0dmFyIGNzc01hcHBpbmcgPSBpdGVtWzNdO1xuXHRpZiAoIWNzc01hcHBpbmcpIHtcblx0XHRyZXR1cm4gY29udGVudDtcblx0fVxuXG5cdGlmICh1c2VTb3VyY2VNYXAgJiYgdHlwZW9mIGJ0b2EgPT09ICdmdW5jdGlvbicpIHtcblx0XHR2YXIgc291cmNlTWFwcGluZyA9IHRvQ29tbWVudChjc3NNYXBwaW5nKTtcblx0XHR2YXIgc291cmNlVVJMcyA9IGNzc01hcHBpbmcuc291cmNlcy5tYXAoZnVuY3Rpb24gKHNvdXJjZSkge1xuXHRcdFx0cmV0dXJuICcvKiMgc291cmNlVVJMPScgKyBjc3NNYXBwaW5nLnNvdXJjZVJvb3QgKyBzb3VyY2UgKyAnICovJ1xuXHRcdH0pO1xuXG5cdFx0cmV0dXJuIFtjb250ZW50XS5jb25jYXQoc291cmNlVVJMcykuY29uY2F0KFtzb3VyY2VNYXBwaW5nXSkuam9pbignXFxuJyk7XG5cdH1cblxuXHRyZXR1cm4gW2NvbnRlbnRdLmpvaW4oJ1xcbicpO1xufVxuXG4vLyBBZGFwdGVkIGZyb20gY29udmVydC1zb3VyY2UtbWFwIChNSVQpXG5mdW5jdGlvbiB0b0NvbW1lbnQoc291cmNlTWFwKSB7XG5cdC8vIGVzbGludC1kaXNhYmxlLW5leHQtbGluZSBuby11bmRlZlxuXHR2YXIgYmFzZTY0ID0gYnRvYSh1bmVzY2FwZShlbmNvZGVVUklDb21wb25lbnQoSlNPTi5zdHJpbmdpZnkoc291cmNlTWFwKSkpKTtcblx0dmFyIGRhdGEgPSAnc291cmNlTWFwcGluZ1VSTD1kYXRhOmFwcGxpY2F0aW9uL2pzb247Y2hhcnNldD11dGYtODtiYXNlNjQsJyArIGJhc2U2NDtcblxuXHRyZXR1cm4gJy8qIyAnICsgZGF0YSArICcgKi8nO1xufVxuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2Nzcy1sb2FkZXIvbGliL2Nzcy1iYXNlLmpzXG4vLyBtb2R1bGUgaWQgPSA0MVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvKlxuXHRNSVQgTGljZW5zZSBodHRwOi8vd3d3Lm9wZW5zb3VyY2Uub3JnL2xpY2Vuc2VzL21pdC1saWNlbnNlLnBocFxuXHRBdXRob3IgVG9iaWFzIEtvcHBlcnMgQHNva3JhXG4qL1xudmFyIHN0eWxlc0luRG9tID0ge30sXG5cdG1lbW9pemUgPSBmdW5jdGlvbihmbikge1xuXHRcdHZhciBtZW1vO1xuXHRcdHJldHVybiBmdW5jdGlvbiAoKSB7XG5cdFx0XHRpZiAodHlwZW9mIG1lbW8gPT09IFwidW5kZWZpbmVkXCIpIG1lbW8gPSBmbi5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXHRcdFx0cmV0dXJuIG1lbW87XG5cdFx0fTtcblx0fSxcblx0aXNPbGRJRSA9IG1lbW9pemUoZnVuY3Rpb24oKSB7XG5cdFx0Ly8gVGVzdCBmb3IgSUUgPD0gOSBhcyBwcm9wb3NlZCBieSBCcm93c2VyaGFja3Ncblx0XHQvLyBAc2VlIGh0dHA6Ly9icm93c2VyaGFja3MuY29tLyNoYWNrLWU3MWQ4NjkyZjY1MzM0MTczZmVlNzE1YzIyMmNiODA1XG5cdFx0Ly8gVGVzdHMgZm9yIGV4aXN0ZW5jZSBvZiBzdGFuZGFyZCBnbG9iYWxzIGlzIHRvIGFsbG93IHN0eWxlLWxvYWRlciBcblx0XHQvLyB0byBvcGVyYXRlIGNvcnJlY3RseSBpbnRvIG5vbi1zdGFuZGFyZCBlbnZpcm9ubWVudHNcblx0XHQvLyBAc2VlIGh0dHBzOi8vZ2l0aHViLmNvbS93ZWJwYWNrLWNvbnRyaWIvc3R5bGUtbG9hZGVyL2lzc3Vlcy8xNzdcblx0XHRyZXR1cm4gd2luZG93ICYmIGRvY3VtZW50ICYmIGRvY3VtZW50LmFsbCAmJiAhd2luZG93LmF0b2I7XG5cdH0pLFxuXHRnZXRFbGVtZW50ID0gKGZ1bmN0aW9uKGZuKSB7XG5cdFx0dmFyIG1lbW8gPSB7fTtcblx0XHRyZXR1cm4gZnVuY3Rpb24oc2VsZWN0b3IpIHtcblx0XHRcdGlmICh0eXBlb2YgbWVtb1tzZWxlY3Rvcl0gPT09IFwidW5kZWZpbmVkXCIpIHtcblx0XHRcdFx0bWVtb1tzZWxlY3Rvcl0gPSBmbi5jYWxsKHRoaXMsIHNlbGVjdG9yKTtcblx0XHRcdH1cblx0XHRcdHJldHVybiBtZW1vW3NlbGVjdG9yXVxuXHRcdH07XG5cdH0pKGZ1bmN0aW9uIChzdHlsZVRhcmdldCkge1xuXHRcdHJldHVybiBkb2N1bWVudC5xdWVyeVNlbGVjdG9yKHN0eWxlVGFyZ2V0KVxuXHR9KSxcblx0c2luZ2xldG9uRWxlbWVudCA9IG51bGwsXG5cdHNpbmdsZXRvbkNvdW50ZXIgPSAwLFxuXHRzdHlsZUVsZW1lbnRzSW5zZXJ0ZWRBdFRvcCA9IFtdLFxuXHRmaXhVcmxzID0gcmVxdWlyZShcIi4vZml4VXJsc1wiKTtcblxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbihsaXN0LCBvcHRpb25zKSB7XG5cdGlmKHR5cGVvZiBERUJVRyAhPT0gXCJ1bmRlZmluZWRcIiAmJiBERUJVRykge1xuXHRcdGlmKHR5cGVvZiBkb2N1bWVudCAhPT0gXCJvYmplY3RcIikgdGhyb3cgbmV3IEVycm9yKFwiVGhlIHN0eWxlLWxvYWRlciBjYW5ub3QgYmUgdXNlZCBpbiBhIG5vbi1icm93c2VyIGVudmlyb25tZW50XCIpO1xuXHR9XG5cblx0b3B0aW9ucyA9IG9wdGlvbnMgfHwge307XG5cdG9wdGlvbnMuYXR0cnMgPSB0eXBlb2Ygb3B0aW9ucy5hdHRycyA9PT0gXCJvYmplY3RcIiA/IG9wdGlvbnMuYXR0cnMgOiB7fTtcblxuXHQvLyBGb3JjZSBzaW5nbGUtdGFnIHNvbHV0aW9uIG9uIElFNi05LCB3aGljaCBoYXMgYSBoYXJkIGxpbWl0IG9uIHRoZSAjIG9mIDxzdHlsZT5cblx0Ly8gdGFncyBpdCB3aWxsIGFsbG93IG9uIGEgcGFnZVxuXHRpZiAodHlwZW9mIG9wdGlvbnMuc2luZ2xldG9uID09PSBcInVuZGVmaW5lZFwiKSBvcHRpb25zLnNpbmdsZXRvbiA9IGlzT2xkSUUoKTtcblxuXHQvLyBCeSBkZWZhdWx0LCBhZGQgPHN0eWxlPiB0YWdzIHRvIHRoZSA8aGVhZD4gZWxlbWVudFxuXHRpZiAodHlwZW9mIG9wdGlvbnMuaW5zZXJ0SW50byA9PT0gXCJ1bmRlZmluZWRcIikgb3B0aW9ucy5pbnNlcnRJbnRvID0gXCJoZWFkXCI7XG5cblx0Ly8gQnkgZGVmYXVsdCwgYWRkIDxzdHlsZT4gdGFncyB0byB0aGUgYm90dG9tIG9mIHRoZSB0YXJnZXRcblx0aWYgKHR5cGVvZiBvcHRpb25zLmluc2VydEF0ID09PSBcInVuZGVmaW5lZFwiKSBvcHRpb25zLmluc2VydEF0ID0gXCJib3R0b21cIjtcblxuXHR2YXIgc3R5bGVzID0gbGlzdFRvU3R5bGVzKGxpc3QsIG9wdGlvbnMpO1xuXHRhZGRTdHlsZXNUb0RvbShzdHlsZXMsIG9wdGlvbnMpO1xuXG5cdHJldHVybiBmdW5jdGlvbiB1cGRhdGUobmV3TGlzdCkge1xuXHRcdHZhciBtYXlSZW1vdmUgPSBbXTtcblx0XHRmb3IodmFyIGkgPSAwOyBpIDwgc3R5bGVzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgaXRlbSA9IHN0eWxlc1tpXTtcblx0XHRcdHZhciBkb21TdHlsZSA9IHN0eWxlc0luRG9tW2l0ZW0uaWRdO1xuXHRcdFx0ZG9tU3R5bGUucmVmcy0tO1xuXHRcdFx0bWF5UmVtb3ZlLnB1c2goZG9tU3R5bGUpO1xuXHRcdH1cblx0XHRpZihuZXdMaXN0KSB7XG5cdFx0XHR2YXIgbmV3U3R5bGVzID0gbGlzdFRvU3R5bGVzKG5ld0xpc3QsIG9wdGlvbnMpO1xuXHRcdFx0YWRkU3R5bGVzVG9Eb20obmV3U3R5bGVzLCBvcHRpb25zKTtcblx0XHR9XG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IG1heVJlbW92ZS5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGRvbVN0eWxlID0gbWF5UmVtb3ZlW2ldO1xuXHRcdFx0aWYoZG9tU3R5bGUucmVmcyA9PT0gMCkge1xuXHRcdFx0XHRmb3IodmFyIGogPSAwOyBqIDwgZG9tU3R5bGUucGFydHMubGVuZ3RoOyBqKyspXG5cdFx0XHRcdFx0ZG9tU3R5bGUucGFydHNbal0oKTtcblx0XHRcdFx0ZGVsZXRlIHN0eWxlc0luRG9tW2RvbVN0eWxlLmlkXTtcblx0XHRcdH1cblx0XHR9XG5cdH07XG59O1xuXG5mdW5jdGlvbiBhZGRTdHlsZXNUb0RvbShzdHlsZXMsIG9wdGlvbnMpIHtcblx0Zm9yKHZhciBpID0gMDsgaSA8IHN0eWxlcy5sZW5ndGg7IGkrKykge1xuXHRcdHZhciBpdGVtID0gc3R5bGVzW2ldO1xuXHRcdHZhciBkb21TdHlsZSA9IHN0eWxlc0luRG9tW2l0ZW0uaWRdO1xuXHRcdGlmKGRvbVN0eWxlKSB7XG5cdFx0XHRkb21TdHlsZS5yZWZzKys7XG5cdFx0XHRmb3IodmFyIGogPSAwOyBqIDwgZG9tU3R5bGUucGFydHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0ZG9tU3R5bGUucGFydHNbal0oaXRlbS5wYXJ0c1tqXSk7XG5cdFx0XHR9XG5cdFx0XHRmb3IoOyBqIDwgaXRlbS5wYXJ0cy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRkb21TdHlsZS5wYXJ0cy5wdXNoKGFkZFN0eWxlKGl0ZW0ucGFydHNbal0sIG9wdGlvbnMpKTtcblx0XHRcdH1cblx0XHR9IGVsc2Uge1xuXHRcdFx0dmFyIHBhcnRzID0gW107XG5cdFx0XHRmb3IodmFyIGogPSAwOyBqIDwgaXRlbS5wYXJ0cy5sZW5ndGg7IGorKykge1xuXHRcdFx0XHRwYXJ0cy5wdXNoKGFkZFN0eWxlKGl0ZW0ucGFydHNbal0sIG9wdGlvbnMpKTtcblx0XHRcdH1cblx0XHRcdHN0eWxlc0luRG9tW2l0ZW0uaWRdID0ge2lkOiBpdGVtLmlkLCByZWZzOiAxLCBwYXJ0czogcGFydHN9O1xuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBsaXN0VG9TdHlsZXMobGlzdCwgb3B0aW9ucykge1xuXHR2YXIgc3R5bGVzID0gW107XG5cdHZhciBuZXdTdHlsZXMgPSB7fTtcblx0Zm9yKHZhciBpID0gMDsgaSA8IGxpc3QubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgaXRlbSA9IGxpc3RbaV07XG5cdFx0dmFyIGlkID0gb3B0aW9ucy5iYXNlID8gaXRlbVswXSArIG9wdGlvbnMuYmFzZSA6IGl0ZW1bMF07XG5cdFx0dmFyIGNzcyA9IGl0ZW1bMV07XG5cdFx0dmFyIG1lZGlhID0gaXRlbVsyXTtcblx0XHR2YXIgc291cmNlTWFwID0gaXRlbVszXTtcblx0XHR2YXIgcGFydCA9IHtjc3M6IGNzcywgbWVkaWE6IG1lZGlhLCBzb3VyY2VNYXA6IHNvdXJjZU1hcH07XG5cdFx0aWYoIW5ld1N0eWxlc1tpZF0pXG5cdFx0XHRzdHlsZXMucHVzaChuZXdTdHlsZXNbaWRdID0ge2lkOiBpZCwgcGFydHM6IFtwYXJ0XX0pO1xuXHRcdGVsc2Vcblx0XHRcdG5ld1N0eWxlc1tpZF0ucGFydHMucHVzaChwYXJ0KTtcblx0fVxuXHRyZXR1cm4gc3R5bGVzO1xufVxuXG5mdW5jdGlvbiBpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucywgc3R5bGVFbGVtZW50KSB7XG5cdHZhciBzdHlsZVRhcmdldCA9IGdldEVsZW1lbnQob3B0aW9ucy5pbnNlcnRJbnRvKVxuXHRpZiAoIXN0eWxlVGFyZ2V0KSB7XG5cdFx0dGhyb3cgbmV3IEVycm9yKFwiQ291bGRuJ3QgZmluZCBhIHN0eWxlIHRhcmdldC4gVGhpcyBwcm9iYWJseSBtZWFucyB0aGF0IHRoZSB2YWx1ZSBmb3IgdGhlICdpbnNlcnRJbnRvJyBwYXJhbWV0ZXIgaXMgaW52YWxpZC5cIik7XG5cdH1cblx0dmFyIGxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wID0gc3R5bGVFbGVtZW50c0luc2VydGVkQXRUb3Bbc3R5bGVFbGVtZW50c0luc2VydGVkQXRUb3AubGVuZ3RoIC0gMV07XG5cdGlmIChvcHRpb25zLmluc2VydEF0ID09PSBcInRvcFwiKSB7XG5cdFx0aWYoIWxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wKSB7XG5cdFx0XHRzdHlsZVRhcmdldC5pbnNlcnRCZWZvcmUoc3R5bGVFbGVtZW50LCBzdHlsZVRhcmdldC5maXJzdENoaWxkKTtcblx0XHR9IGVsc2UgaWYobGFzdFN0eWxlRWxlbWVudEluc2VydGVkQXRUb3AubmV4dFNpYmxpbmcpIHtcblx0XHRcdHN0eWxlVGFyZ2V0Lmluc2VydEJlZm9yZShzdHlsZUVsZW1lbnQsIGxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wLm5leHRTaWJsaW5nKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0c3R5bGVUYXJnZXQuYXBwZW5kQ2hpbGQoc3R5bGVFbGVtZW50KTtcblx0XHR9XG5cdFx0c3R5bGVFbGVtZW50c0luc2VydGVkQXRUb3AucHVzaChzdHlsZUVsZW1lbnQpO1xuXHR9IGVsc2UgaWYgKG9wdGlvbnMuaW5zZXJ0QXQgPT09IFwiYm90dG9tXCIpIHtcblx0XHRzdHlsZVRhcmdldC5hcHBlbmRDaGlsZChzdHlsZUVsZW1lbnQpO1xuXHR9IGVsc2Uge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIkludmFsaWQgdmFsdWUgZm9yIHBhcmFtZXRlciAnaW5zZXJ0QXQnLiBNdXN0IGJlICd0b3AnIG9yICdib3R0b20nLlwiKTtcblx0fVxufVxuXG5mdW5jdGlvbiByZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KSB7XG5cdHN0eWxlRWxlbWVudC5wYXJlbnROb2RlLnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudCk7XG5cdHZhciBpZHggPSBzdHlsZUVsZW1lbnRzSW5zZXJ0ZWRBdFRvcC5pbmRleE9mKHN0eWxlRWxlbWVudCk7XG5cdGlmKGlkeCA+PSAwKSB7XG5cdFx0c3R5bGVFbGVtZW50c0luc2VydGVkQXRUb3Auc3BsaWNlKGlkeCwgMSk7XG5cdH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlU3R5bGVFbGVtZW50KG9wdGlvbnMpIHtcblx0dmFyIHN0eWxlRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJzdHlsZVwiKTtcblx0b3B0aW9ucy5hdHRycy50eXBlID0gXCJ0ZXh0L2Nzc1wiO1xuXG5cdGF0dGFjaFRhZ0F0dHJzKHN0eWxlRWxlbWVudCwgb3B0aW9ucy5hdHRycyk7XG5cdGluc2VydFN0eWxlRWxlbWVudChvcHRpb25zLCBzdHlsZUVsZW1lbnQpO1xuXHRyZXR1cm4gc3R5bGVFbGVtZW50O1xufVxuXG5mdW5jdGlvbiBjcmVhdGVMaW5rRWxlbWVudChvcHRpb25zKSB7XG5cdHZhciBsaW5rRWxlbWVudCA9IGRvY3VtZW50LmNyZWF0ZUVsZW1lbnQoXCJsaW5rXCIpO1xuXHRvcHRpb25zLmF0dHJzLnR5cGUgPSBcInRleHQvY3NzXCI7XG5cdG9wdGlvbnMuYXR0cnMucmVsID0gXCJzdHlsZXNoZWV0XCI7XG5cblx0YXR0YWNoVGFnQXR0cnMobGlua0VsZW1lbnQsIG9wdGlvbnMuYXR0cnMpO1xuXHRpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucywgbGlua0VsZW1lbnQpO1xuXHRyZXR1cm4gbGlua0VsZW1lbnQ7XG59XG5cbmZ1bmN0aW9uIGF0dGFjaFRhZ0F0dHJzKGVsZW1lbnQsIGF0dHJzKSB7XG5cdE9iamVjdC5rZXlzKGF0dHJzKS5mb3JFYWNoKGZ1bmN0aW9uIChrZXkpIHtcblx0XHRlbGVtZW50LnNldEF0dHJpYnV0ZShrZXksIGF0dHJzW2tleV0pO1xuXHR9KTtcbn1cblxuZnVuY3Rpb24gYWRkU3R5bGUob2JqLCBvcHRpb25zKSB7XG5cdHZhciBzdHlsZUVsZW1lbnQsIHVwZGF0ZSwgcmVtb3ZlLCB0cmFuc2Zvcm1SZXN1bHQ7XG5cblx0Ly8gSWYgYSB0cmFuc2Zvcm0gZnVuY3Rpb24gd2FzIGRlZmluZWQsIHJ1biBpdCBvbiB0aGUgY3NzXG5cdGlmIChvcHRpb25zLnRyYW5zZm9ybSAmJiBvYmouY3NzKSB7XG5cdCAgICB0cmFuc2Zvcm1SZXN1bHQgPSBvcHRpb25zLnRyYW5zZm9ybShvYmouY3NzKTtcblx0ICAgIFxuXHQgICAgaWYgKHRyYW5zZm9ybVJlc3VsdCkge1xuXHQgICAgXHQvLyBJZiB0cmFuc2Zvcm0gcmV0dXJucyBhIHZhbHVlLCB1c2UgdGhhdCBpbnN0ZWFkIG9mIHRoZSBvcmlnaW5hbCBjc3MuXG5cdCAgICBcdC8vIFRoaXMgYWxsb3dzIHJ1bm5pbmcgcnVudGltZSB0cmFuc2Zvcm1hdGlvbnMgb24gdGhlIGNzcy5cblx0ICAgIFx0b2JqLmNzcyA9IHRyYW5zZm9ybVJlc3VsdDtcblx0ICAgIH0gZWxzZSB7XG5cdCAgICBcdC8vIElmIHRoZSB0cmFuc2Zvcm0gZnVuY3Rpb24gcmV0dXJucyBhIGZhbHN5IHZhbHVlLCBkb24ndCBhZGQgdGhpcyBjc3MuIFxuXHQgICAgXHQvLyBUaGlzIGFsbG93cyBjb25kaXRpb25hbCBsb2FkaW5nIG9mIGNzc1xuXHQgICAgXHRyZXR1cm4gZnVuY3Rpb24oKSB7XG5cdCAgICBcdFx0Ly8gbm9vcFxuXHQgICAgXHR9O1xuXHQgICAgfVxuXHR9XG5cblx0aWYgKG9wdGlvbnMuc2luZ2xldG9uKSB7XG5cdFx0dmFyIHN0eWxlSW5kZXggPSBzaW5nbGV0b25Db3VudGVyKys7XG5cdFx0c3R5bGVFbGVtZW50ID0gc2luZ2xldG9uRWxlbWVudCB8fCAoc2luZ2xldG9uRWxlbWVudCA9IGNyZWF0ZVN0eWxlRWxlbWVudChvcHRpb25zKSk7XG5cdFx0dXBkYXRlID0gYXBwbHlUb1NpbmdsZXRvblRhZy5iaW5kKG51bGwsIHN0eWxlRWxlbWVudCwgc3R5bGVJbmRleCwgZmFsc2UpO1xuXHRcdHJlbW92ZSA9IGFwcGx5VG9TaW5nbGV0b25UYWcuYmluZChudWxsLCBzdHlsZUVsZW1lbnQsIHN0eWxlSW5kZXgsIHRydWUpO1xuXHR9IGVsc2UgaWYob2JqLnNvdXJjZU1hcCAmJlxuXHRcdHR5cGVvZiBVUkwgPT09IFwiZnVuY3Rpb25cIiAmJlxuXHRcdHR5cGVvZiBVUkwuY3JlYXRlT2JqZWN0VVJMID09PSBcImZ1bmN0aW9uXCIgJiZcblx0XHR0eXBlb2YgVVJMLnJldm9rZU9iamVjdFVSTCA9PT0gXCJmdW5jdGlvblwiICYmXG5cdFx0dHlwZW9mIEJsb2IgPT09IFwiZnVuY3Rpb25cIiAmJlxuXHRcdHR5cGVvZiBidG9hID09PSBcImZ1bmN0aW9uXCIpIHtcblx0XHRzdHlsZUVsZW1lbnQgPSBjcmVhdGVMaW5rRWxlbWVudChvcHRpb25zKTtcblx0XHR1cGRhdGUgPSB1cGRhdGVMaW5rLmJpbmQobnVsbCwgc3R5bGVFbGVtZW50LCBvcHRpb25zKTtcblx0XHRyZW1vdmUgPSBmdW5jdGlvbigpIHtcblx0XHRcdHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpO1xuXHRcdFx0aWYoc3R5bGVFbGVtZW50LmhyZWYpXG5cdFx0XHRcdFVSTC5yZXZva2VPYmplY3RVUkwoc3R5bGVFbGVtZW50LmhyZWYpO1xuXHRcdH07XG5cdH0gZWxzZSB7XG5cdFx0c3R5bGVFbGVtZW50ID0gY3JlYXRlU3R5bGVFbGVtZW50KG9wdGlvbnMpO1xuXHRcdHVwZGF0ZSA9IGFwcGx5VG9UYWcuYmluZChudWxsLCBzdHlsZUVsZW1lbnQpO1xuXHRcdHJlbW92ZSA9IGZ1bmN0aW9uKCkge1xuXHRcdFx0cmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCk7XG5cdFx0fTtcblx0fVxuXG5cdHVwZGF0ZShvYmopO1xuXG5cdHJldHVybiBmdW5jdGlvbiB1cGRhdGVTdHlsZShuZXdPYmopIHtcblx0XHRpZihuZXdPYmopIHtcblx0XHRcdGlmKG5ld09iai5jc3MgPT09IG9iai5jc3MgJiYgbmV3T2JqLm1lZGlhID09PSBvYmoubWVkaWEgJiYgbmV3T2JqLnNvdXJjZU1hcCA9PT0gb2JqLnNvdXJjZU1hcClcblx0XHRcdFx0cmV0dXJuO1xuXHRcdFx0dXBkYXRlKG9iaiA9IG5ld09iaik7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHJlbW92ZSgpO1xuXHRcdH1cblx0fTtcbn1cblxudmFyIHJlcGxhY2VUZXh0ID0gKGZ1bmN0aW9uICgpIHtcblx0dmFyIHRleHRTdG9yZSA9IFtdO1xuXG5cdHJldHVybiBmdW5jdGlvbiAoaW5kZXgsIHJlcGxhY2VtZW50KSB7XG5cdFx0dGV4dFN0b3JlW2luZGV4XSA9IHJlcGxhY2VtZW50O1xuXHRcdHJldHVybiB0ZXh0U3RvcmUuZmlsdGVyKEJvb2xlYW4pLmpvaW4oJ1xcbicpO1xuXHR9O1xufSkoKTtcblxuZnVuY3Rpb24gYXBwbHlUb1NpbmdsZXRvblRhZyhzdHlsZUVsZW1lbnQsIGluZGV4LCByZW1vdmUsIG9iaikge1xuXHR2YXIgY3NzID0gcmVtb3ZlID8gXCJcIiA6IG9iai5jc3M7XG5cblx0aWYgKHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0KSB7XG5cdFx0c3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IHJlcGxhY2VUZXh0KGluZGV4LCBjc3MpO1xuXHR9IGVsc2Uge1xuXHRcdHZhciBjc3NOb2RlID0gZG9jdW1lbnQuY3JlYXRlVGV4dE5vZGUoY3NzKTtcblx0XHR2YXIgY2hpbGROb2RlcyA9IHN0eWxlRWxlbWVudC5jaGlsZE5vZGVzO1xuXHRcdGlmIChjaGlsZE5vZGVzW2luZGV4XSkgc3R5bGVFbGVtZW50LnJlbW92ZUNoaWxkKGNoaWxkTm9kZXNbaW5kZXhdKTtcblx0XHRpZiAoY2hpbGROb2Rlcy5sZW5ndGgpIHtcblx0XHRcdHN0eWxlRWxlbWVudC5pbnNlcnRCZWZvcmUoY3NzTm9kZSwgY2hpbGROb2Rlc1tpbmRleF0pO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRzdHlsZUVsZW1lbnQuYXBwZW5kQ2hpbGQoY3NzTm9kZSk7XG5cdFx0fVxuXHR9XG59XG5cbmZ1bmN0aW9uIGFwcGx5VG9UYWcoc3R5bGVFbGVtZW50LCBvYmopIHtcblx0dmFyIGNzcyA9IG9iai5jc3M7XG5cdHZhciBtZWRpYSA9IG9iai5tZWRpYTtcblxuXHRpZihtZWRpYSkge1xuXHRcdHN0eWxlRWxlbWVudC5zZXRBdHRyaWJ1dGUoXCJtZWRpYVwiLCBtZWRpYSlcblx0fVxuXG5cdGlmKHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0KSB7XG5cdFx0c3R5bGVFbGVtZW50LnN0eWxlU2hlZXQuY3NzVGV4dCA9IGNzcztcblx0fSBlbHNlIHtcblx0XHR3aGlsZShzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCkge1xuXHRcdFx0c3R5bGVFbGVtZW50LnJlbW92ZUNoaWxkKHN0eWxlRWxlbWVudC5maXJzdENoaWxkKTtcblx0XHR9XG5cdFx0c3R5bGVFbGVtZW50LmFwcGVuZENoaWxkKGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcykpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIHVwZGF0ZUxpbmsobGlua0VsZW1lbnQsIG9wdGlvbnMsIG9iaikge1xuXHR2YXIgY3NzID0gb2JqLmNzcztcblx0dmFyIHNvdXJjZU1hcCA9IG9iai5zb3VyY2VNYXA7XG5cblx0LyogSWYgY29udmVydFRvQWJzb2x1dGVVcmxzIGlzbid0IGRlZmluZWQsIGJ1dCBzb3VyY2VtYXBzIGFyZSBlbmFibGVkXG5cdGFuZCB0aGVyZSBpcyBubyBwdWJsaWNQYXRoIGRlZmluZWQgdGhlbiBsZXRzIHR1cm4gY29udmVydFRvQWJzb2x1dGVVcmxzXG5cdG9uIGJ5IGRlZmF1bHQuICBPdGhlcndpc2UgZGVmYXVsdCB0byB0aGUgY29udmVydFRvQWJzb2x1dGVVcmxzIG9wdGlvblxuXHRkaXJlY3RseVxuXHQqL1xuXHR2YXIgYXV0b0ZpeFVybHMgPSBvcHRpb25zLmNvbnZlcnRUb0Fic29sdXRlVXJscyA9PT0gdW5kZWZpbmVkICYmIHNvdXJjZU1hcDtcblxuXHRpZiAob3B0aW9ucy5jb252ZXJ0VG9BYnNvbHV0ZVVybHMgfHwgYXV0b0ZpeFVybHMpe1xuXHRcdGNzcyA9IGZpeFVybHMoY3NzKTtcblx0fVxuXG5cdGlmKHNvdXJjZU1hcCkge1xuXHRcdC8vIGh0dHA6Ly9zdGFja292ZXJmbG93LmNvbS9hLzI2NjAzODc1XG5cdFx0Y3NzICs9IFwiXFxuLyojIHNvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2Jhc2U2NCxcIiArIGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSkgKyBcIiAqL1wiO1xuXHR9XG5cblx0dmFyIGJsb2IgPSBuZXcgQmxvYihbY3NzXSwgeyB0eXBlOiBcInRleHQvY3NzXCIgfSk7XG5cblx0dmFyIG9sZFNyYyA9IGxpbmtFbGVtZW50LmhyZWY7XG5cblx0bGlua0VsZW1lbnQuaHJlZiA9IFVSTC5jcmVhdGVPYmplY3RVUkwoYmxvYik7XG5cblx0aWYob2xkU3JjKVxuXHRcdFVSTC5yZXZva2VPYmplY3RVUkwob2xkU3JjKTtcbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9zdHlsZS1sb2FkZXIvYWRkU3R5bGVzLmpzXG4vLyBtb2R1bGUgaWQgPSA2M1xuLy8gbW9kdWxlIGNodW5rcyA9IDAiXSwic291cmNlUm9vdCI6IiJ9