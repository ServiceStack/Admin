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
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIndlYnBhY2s6Ly8vLi9zcmMvYXBwLnRzeCIsIndlYnBhY2s6Ly8vLi9zcmMvQXV0b1F1ZXJ5LnRzeCIsIndlYnBhY2s6Ly8vLi9zcmMvQ29sdW1uUHJlZnNEaWFsb2cudHN4Iiwid2VicGFjazovLy8uL3NyYy9Db250ZW50LnRzeCIsIndlYnBhY2s6Ly8vLi9zcmMvSGVhZGVyLnRzeCIsIndlYnBhY2s6Ly8vLi9zcmMvUmVzdWx0cy50c3giLCJ3ZWJwYWNrOi8vLy4vc3JjL1NpZGViYXIudHN4Iiwid2VicGFjazovLy8uL3NyYy9hcHAuY3NzIiwid2VicGFjazovLy8uL3NyYy9hc3NldHMvaW1nL2ljb25mb250L21hdGVyaWFsLWljb25zLmNzcyIsIndlYnBhY2s6Ly8vLi9zcmMvYXNzZXRzL2ltZy9vY3RpY29uL29jdGljb24uY3NzIiwid2VicGFjazovLy8uL3NyYy9hc3NldHMvaW1nL2ljb25mb250L01hdGVyaWFsSWNvbnMtUmVndWxhci5lb3QiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Fzc2V0cy9pbWcvaWNvbmZvbnQvTWF0ZXJpYWxJY29ucy1SZWd1bGFyLnR0ZiIsIndlYnBhY2s6Ly8vLi9zcmMvYXNzZXRzL2ltZy9pY29uZm9udC9NYXRlcmlhbEljb25zLVJlZ3VsYXIud29mZiIsIndlYnBhY2s6Ly8vLi9zcmMvYXNzZXRzL2ltZy9pY29uZm9udC9NYXRlcmlhbEljb25zLVJlZ3VsYXIud29mZjIiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Fzc2V0cy9pbWcvb2N0aWNvbi9vY3RpY29ucy50dGYiLCJ3ZWJwYWNrOi8vLy4vc3JjL2Fzc2V0cy9pbWcvb2N0aWNvbi9vY3RpY29ucy53b2ZmIiwid2VicGFjazovLy8uL3NyYy9hc3NldHMvaW1nL3JvYm90by9yb2JvdG8tdjE1LWxhdGluLXJlZ3VsYXIud29mZiIsIndlYnBhY2s6Ly8vLi9zcmMvYXNzZXRzL2ltZy9yb2JvdG8vcm9ib3RvLXYxNS1sYXRpbi1yZWd1bGFyLndvZmYyIiwid2VicGFjazovLy8uL3NyYy9zaGFyZWQudHN4Iiwid2VicGFjazovLy8uL34vc3R5bGUtbG9hZGVyL2ZpeFVybHMuanMiLCJ3ZWJwYWNrOi8vLy4vc3JjL2FwcC5jc3M/MjAwZiIsIndlYnBhY2s6Ly8vLi9zcmMvYXNzZXRzL2ltZy9pY29uZm9udC9tYXRlcmlhbC1pY29ucy5jc3M/MTU0MCIsIndlYnBhY2s6Ly8vLi9zcmMvYXNzZXRzL2ltZy9vY3RpY29uL29jdGljb24uY3NzP2U0NDMiLCJ3ZWJwYWNrOi8vLy4vfi9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qcyIsIndlYnBhY2s6Ly8vLi9+L3N0eWxlLWxvYWRlci9hZGRTdHlsZXMuanMiXSwibmFtZXMiOltdLCJtYXBwaW5ncyI6Ijs7Ozs7Ozs7Ozs7Ozs7Ozs7O0FBQUEseUJBQWtEO0FBQ2xELHlCQUEwQztBQUMxQyx5QkFBbUI7QUFFbkIsbUNBQStCO0FBQy9CLDBDQUFtQztBQUNuQyw0Q0FBd0M7QUFDeEMsaURBQXdFO0FBRXhFLHVDQUFvQztBQUNwQywyQ0FBb0M7QUFFcEM7SUFBdUIsNEJBQXlCO0lBQWhEOztJQUlBLENBQUM7SUFIRyx5QkFBTSxHQUFOO1FBQ0ksTUFBTSxDQUFDLG9CQUFDLG1CQUFTLElBQUMsS0FBSyxFQUFHLEVBQUUsTUFBTSxFQUFFLEVBQUUsSUFBSSxFQUFDLEVBQUUsRUFBQyxFQUFFLEdBQUssQ0FBQztJQUMxRCxDQUFDO0lBQ0wsZUFBQztBQUFELENBQUMsQ0FKc0IsS0FBSyxDQUFDLFNBQVMsR0FJckM7QUFFRCxJQUFJLE9BQU8sR0FBRyxpQkFBUSxHQUFHLFVBQVUsQ0FBQztBQUNwQyxJQUFNLGFBQWEsR0FBRyxPQUFPLEdBQUcsWUFBWSxDQUFDO0FBRTdDLGtCQUFNLENBQ0YsQ0FBQyxvQkFBQyxnQ0FBTTtJQUNKO1FBQ0ksb0JBQUMsd0JBQUssSUFBQyxLQUFLLFFBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxNQUFNLEVBQUU7Z0JBQ2hDLDJCQUFDLHVCQUFRLElBQUMsSUFBSSxFQUFFLE9BQU8sRUFBRSxFQUFFLEVBQUUsYUFBYSxH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QUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEdBQUc7QUFDSDtBQUNBLEdBQUc7QUFDSDtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQSxNQUFNO0FBQ047QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLEVBQUU7QUFDRjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxFQUFFO0FBQ0Y7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBOztBQUVBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLENBQUM7O0FBRUQ7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQSxHQUFHO0FBQ0g7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsRUFBRTtBQUNGO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVBO0FBQ0E7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsdURBQXVEO0FBQ3ZEOztBQUVBLDZCQUE2QixtQkFBbUI7O0FBRWhEOztBQUVBOztBQUVBO0FBQ0E7QUFDQSIsImZpbGUiOiJhcHAuYnVuZGxlLmpzIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0ICcuL2Fzc2V0cy9pbWcvaWNvbmZvbnQvbWF0ZXJpYWwtaWNvbnMuY3NzJztcclxuaW1wb3J0ICcuL2Fzc2V0cy9pbWcvb2N0aWNvbi9vY3RpY29uLmNzcyc7XHJcbmltcG9ydCAnLi9hcHAuY3NzJztcclxuXHJcbmltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHsgcmVuZGVyIH0gZnJvbSAncmVhY3QtZG9tJztcclxuaW1wb3J0IHsgUmVkaXJlY3QgfSBmcm9tICdyZWFjdC1yb3V0ZXInO1xyXG5pbXBvcnQgeyBCcm93c2VyUm91dGVyIGFzIFJvdXRlciwgUm91dGUsIExpbmsgfSBmcm9tICdyZWFjdC1yb3V0ZXItZG9tJztcclxuXHJcbmltcG9ydCB7IEJhc2VQYXRoIH0gZnJvbSAnLi9zaGFyZWQnO1xyXG5pbXBvcnQgQXV0b1F1ZXJ5IGZyb20gJy4vQXV0b1F1ZXJ5JztcclxuXHJcbmNsYXNzIEFkbWluQXBwIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PGFueSwgYW55PiB7XHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuIDxBdXRvUXVlcnkgbWF0Y2g9eyB7IHBhcmFtczogeyBuYW1lOlwiXCJ9IH0gfSAvPjtcclxuICAgIH1cclxufVxyXG4gXHJcbnZhciBBcHBQYXRoID0gQmFzZVBhdGggKyBcInNzX2FkbWluXCI7XHJcbmNvbnN0IEF1dG9RdWVyeVBhdGggPSBBcHBQYXRoICsgXCIvYXV0b3F1ZXJ5XCI7XHJcblxyXG5yZW5kZXIoXHJcbiAgICAoPFJvdXRlcj5cclxuICAgICAgICA8ZGl2PlxyXG4gICAgICAgICAgICA8Um91dGUgZXhhY3QgcGF0aD17QXBwUGF0aH0gcmVuZGVyPXsoKSA9PiBcclxuICAgICAgICAgICAgICAgIDxSZWRpcmVjdCBmcm9tPXtBcHBQYXRofSB0bz17QXV0b1F1ZXJ5UGF0aH0vPlxyXG4gICAgICAgICAgICAgICAgfSAvPlxyXG4gICAgICAgICAgICA8Um91dGUgZXhhY3QgcGF0aD17QXV0b1F1ZXJ5UGF0aH0gY29tcG9uZW50PXtBdXRvUXVlcnl9IC8+XHJcbiAgICAgICAgICAgIDxSb3V0ZSBwYXRoPXtBdXRvUXVlcnlQYXRoICsgXCIvOm5hbWVcIn0gY29tcG9uZW50PXtBdXRvUXVlcnl9IC8+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICA8L1JvdXRlcj4pLCBcclxuICAgIGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKCdhcHAnKSk7XHJcblxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9hcHAudHN4IiwiaW1wb3J0ICogYXMgUmVhY3QgZnJvbSAncmVhY3QnO1xyXG5pbXBvcnQgeyByZW5kZXIgfSBmcm9tICdyZWFjdC1kb20nO1xyXG5pbXBvcnQgSGVhZGVyIGZyb20gJy4vSGVhZGVyJztcclxuaW1wb3J0IFNpZGViYXIgZnJvbSAnLi9TaWRlYmFyJztcclxuaW1wb3J0IENvbnRlbnQgZnJvbSAnLi9Db250ZW50JztcclxuaW1wb3J0IENvbHVtblByZWZzRGlhbG9nIGZyb20gJy4vQ29sdW1uUHJlZnNEaWFsb2cnO1xyXG5cclxuaW1wb3J0IHsgY2xpZW50LCBub3JtYWxpemUgfSBmcm9tICcuL3NoYXJlZCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBBdXRvUXVlcnkgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQ8YW55LCBhbnk+IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzPywgY29udGV4dD8pIHtcclxuICAgICAgICBzdXBlcihwcm9wcywgY29udGV4dCk7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHsgbWV0YWRhdGE6IG51bGwgfTtcclxuXHJcbiAgICAgICAgY2xpZW50LmdldChcIi9hdXRvcXVlcnkvbWV0YWRhdGFcIikudGhlbihyID0+IHtcclxuICAgICAgICAgICAgY29uc3QgbWV0YWRhdGEgPSBub3JtYWxpemUociwgdHJ1ZSk7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoeyBtZXRhZGF0YSwgbmFtZTogdGhpcy5nZXROYW1lKCkgfSlcclxuICAgICAgICB9KTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc3RhdGUubWV0YWRhdGFcclxuICAgICAgICAgICAgPyA8QXBwIG1ldGFkYXRhPXt0aGlzLnN0YXRlLm1ldGFkYXRhfSBuYW1lPXt0aGlzLmdldE5hbWUoKX0gLz5cclxuICAgICAgICAgICAgOiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGdldE5hbWUoKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMucHJvcHMubWF0Y2gucGFyYW1zLm5hbWUgfHwgXCJcIjtcclxuICAgIH1cclxufVxyXG5cclxuY2xhc3MgQXBwIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PGFueSwgYW55PiB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcz8sIGNvbnRleHQ/KSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMsIGNvbnRleHQpO1xyXG5cclxuICAgICAgICB2YXIgb3BlcmF0aW9uTmFtZXMgPSB0aGlzLnByb3BzLm1ldGFkYXRhLm9wZXJhdGlvbnMubWFwKG9wID0+IG9wLnJlcXVlc3QpO1xyXG5cclxuICAgICAgICB2YXIgdmlld2VyQXJncyA9IHt9LCBvcGVyYXRpb25zID0ge30sIHR5cGVzID0ge307XHJcbiAgICAgICAgb3BlcmF0aW9uTmFtZXMuZm9yRWFjaChuYW1lID0+IHtcclxuICAgICAgICAgICAgdmlld2VyQXJnc1tuYW1lXSA9IHt9O1xyXG4gICAgICAgICAgICB2YXIgYXFWaWV3ZXIgPSB0aGlzLmdldEF1dG9RdWVyeVZpZXdlcihuYW1lKTtcclxuICAgICAgICAgICAgaWYgKGFxVmlld2VyICYmIGFxVmlld2VyLmFyZ3MpIHtcclxuICAgICAgICAgICAgICAgIGFxVmlld2VyLmFyZ3MuZm9yRWFjaChhcmcgPT4gdmlld2VyQXJnc1tuYW1lXVthcmcubmFtZV0gPSBhcmcudmFsdWUpO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICBvcGVyYXRpb25zW25hbWVdID0gdGhpcy5wcm9wcy5tZXRhZGF0YS5vcGVyYXRpb25zLmZpbHRlcihvcCA9PiBvcC5yZXF1ZXN0ID09PSBuYW1lKVswXTtcclxuICAgICAgICB9KTtcclxuXHJcbiAgICAgICAgdGhpcy5wcm9wcy5tZXRhZGF0YS50eXBlcy5mb3JFYWNoKHQgPT4gdHlwZXNbdC5uYW1lXSA9IHQpO1xyXG5cclxuICAgICAgICB2YXIgb3BlcmF0aW9uU3RhdGUgPSB7fTtcclxuICAgICAgICB2YXIganNvbiA9IGxvY2FsU3RvcmFnZS5nZXRJdGVtKFwidjEvb3BlcmF0aW9uU3RhdGVcIik7XHJcbiAgICAgICAgaWYgKGpzb24pXHJcbiAgICAgICAgICAgIG9wZXJhdGlvblN0YXRlID0gSlNPTi5wYXJzZShqc29uKTtcclxuXHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHtcclxuICAgICAgICAgICAgc2lkZWJhckhpZGRlbjogZmFsc2UsIHNlbGVjdGVkOiBudWxsLCBcclxuICAgICAgICAgICAgb3BlcmF0aW9uU3RhdGUsIG9wZXJhdGlvbk5hbWVzLCB2aWV3ZXJBcmdzLCBvcGVyYXRpb25zLCB0eXBlc1xyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgcmVzb2x2ZVByb3BlcnRpZXModHlwZSkge1xyXG4gICAgICAgIHZhciBwcm9wcyA9ICh0eXBlLnByb3BlcnRpZXMgfHwgW10pLnNsaWNlKDApO1xyXG5cclxuICAgICAgICBsZXQgaW5oZXJpdHMgPSB0eXBlLmluaGVyaXRzO1xyXG4gICAgICAgIHdoaWxlIChpbmhlcml0cykge1xyXG4gICAgICAgICAgICBjb25zdCB0ID0gdGhpcy5zdGF0ZS50eXBlc1tpbmhlcml0cy5uYW1lXTtcclxuICAgICAgICAgICAgaWYgKCF0ICYmICF0LnByb3BlcnRpZXMpIGNvbnRpbnVlO1xyXG4gICAgICAgICAgICB0LnByb3BlcnRpZXMuZm9yRWFjaChwID0+IHByb3BzLnB1c2gocCkpO1xyXG4gICAgICAgICAgICBpbmhlcml0cyA9IHQuaW5oZXJpdHM7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gcHJvcHM7XHJcbiAgICB9XHJcblxyXG4gICAgdG9nZ2xlU2lkZWJhcigpIHtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgc2lkZWJhckhpZGRlbjogIXRoaXMuc3RhdGUuc2lkZWJhckhpZGRlbiB9KTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRUeXBlKG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnByb3BzLm1ldGFkYXRhLnR5cGVzLmZpbHRlcihvcCA9PiBvcC5uYW1lID09PSBuYW1lKVswXTtcclxuICAgIH1cclxuXHJcbiAgICBnZXRBdXRvUXVlcnlWaWV3ZXIobmFtZTpzdHJpbmcpIHtcclxuICAgICAgICBjb25zdCB0eXBlID0gdGhpcy5nZXRUeXBlKG5hbWUpO1xyXG4gICAgICAgIHJldHVybiB0eXBlICE9IG51bGwgJiYgdHlwZS5hdHRyaWJ1dGVzICE9IG51bGxcclxuICAgICAgICAgICAgPyB0eXBlLmF0dHJpYnV0ZXMuZmlsdGVyKGF0dHIgPT4gYXR0ci5uYW1lID09PSBcIkF1dG9RdWVyeVZpZXdlclwiKVswXVxyXG4gICAgICAgICAgICA6IG51bGw7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0QXV0b1F1ZXJ5Vmlld2VyQXJnVmFsdWUobmFtZTpzdHJpbmcsIGFyZ05hbWU6c3RyaW5nKSB7XHJcbiAgICAgICAgdmFyIGFxVmlld2VyID0gdGhpcy5nZXRBdXRvUXVlcnlWaWV3ZXIobmFtZSk7XHJcbiAgICAgICAgdmFyIGFyZyA9IGFxVmlld2VyXHJcbiAgICAgICAgICAgID8gYXFWaWV3ZXIuYXJncy5maWx0ZXIoeCA9PiB4Lm5hbWUgPT09IGFyZ05hbWUpWzBdXHJcbiAgICAgICAgICAgIDogbnVsbDtcclxuICAgICAgICByZXR1cm4gYXJnICE9IG51bGxcclxuICAgICAgICAgICAgPyBhcmcudmFsdWVcclxuICAgICAgICAgICAgOiBudWxsO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFRpdGxlKHNlbGVjdGVkKSB7XHJcbiAgICAgICAgcmV0dXJuIHNlbGVjdGVkXHJcbiAgICAgICAgICAgID8gdGhpcy5nZXRBdXRvUXVlcnlWaWV3ZXJBcmdWYWx1ZShzZWxlY3RlZC5uYW1lLCAnVGl0bGUnKSB8fCBzZWxlY3RlZC5uYW1lXHJcbiAgICAgICAgICAgIDogbnVsbDtcclxuICAgIH1cclxuXHJcbiAgICBnZXRPcGVyYXRpb25WYWx1ZXMobmFtZTogc3RyaW5nKSB7XHJcbiAgICAgICAgY29uc3Qgdmlld2VyQXJncyA9IHRoaXMuc3RhdGUudmlld2VyQXJnc1tuYW1lXSB8fCB7fTtcclxuICAgICAgICByZXR1cm4gT2JqZWN0LmFzc2lnbih7XHJcbiAgICAgICAgICAgIHNlYXJjaEZpZWxkOiB2aWV3ZXJBcmdzW1wiRGVmYXVsdFNlYXJjaEZpZWxkXCJdIHx8IFwiXCIsXHJcbiAgICAgICAgICAgIHNlYXJjaFR5cGU6IHZpZXdlckFyZ3NbXCJEZWZhdWx0U2VhcmNoVHlwZVwiXSB8fCBcIlwiLFxyXG4gICAgICAgICAgICBzZWFyY2hUZXh0OiB2aWV3ZXJBcmdzW1wiRGVmYXVsdFNlYXJjaFRleHRcIl0sXHJcbiAgICAgICAgICAgIGNvbmRpdGlvbnM6IFtdLFxyXG4gICAgICAgICAgICBxdWVyaWVzOiBbXVxyXG4gICAgICAgIH0sIHRoaXMuc3RhdGUub3BlcmF0aW9uU3RhdGVbbmFtZV0gfHwge30pO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFNlbGVjdGVkKG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIGNvbnN0IG9wZXJhdGlvbiA9IHRoaXMuc3RhdGUub3BlcmF0aW9uc1tuYW1lXTtcclxuICAgICAgICBpZiAob3BlcmF0aW9uID09IG51bGwpXHJcbiAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgIGNvbnN0IHJlcXVlc3RUeXBlID0gdGhpcy5zdGF0ZS50eXBlc1tuYW1lXTtcclxuICAgICAgICBjb25zdCBmcm9tVHlwZSA9IHRoaXMuc3RhdGUudHlwZXNbb3BlcmF0aW9uLmZyb21dO1xyXG4gICAgICAgIGNvbnN0IHRvVHlwZSA9IHRoaXMuc3RhdGUudHlwZXNbb3BlcmF0aW9uLnRvXTtcclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBuYW1lLCBvcGVyYXRpb24sIHJlcXVlc3RUeXBlLFxyXG4gICAgICAgICAgICBmcm9tVHlwZSwgZnJvbVR5cGVGaWVsZHM6IHRoaXMucmVzb2x2ZVByb3BlcnRpZXModG9UeXBlKSxcclxuICAgICAgICAgICAgdG9UeXBlLCB0b1R5cGVGaWVsZHM6IHRoaXMucmVzb2x2ZVByb3BlcnRpZXModG9UeXBlKVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgb25PcGVyYXRpb25DaGFuZ2Uob3BOYW1lOiBzdHJpbmcsIG5ld1ZhbHVlczogYW55KSB7XHJcbiAgICAgICAgY29uc3Qgb3AgPSB0aGlzLmdldE9wZXJhdGlvblZhbHVlcyhvcE5hbWUpO1xyXG5cclxuICAgICAgICBPYmplY3Qua2V5cyhuZXdWYWx1ZXMpLmZvckVhY2goayA9PiB7XHJcbiAgICAgICAgICAgIGlmIChuZXdWYWx1ZXNba10gIT0gbnVsbClcclxuICAgICAgICAgICAgICAgIG9wW2tdID0gbmV3VmFsdWVzW2tdO1xyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnNldE9wZXJhdGlvblZhbHVlcyhvcE5hbWUsIG9wKTtcclxuICAgIH1cclxuXHJcbiAgICBhZGRDb25kaXRpb24ob3BOYW1lOnN0cmluZykge1xyXG4gICAgICAgIGNvbnN0IG9wID0gdGhpcy5nZXRPcGVyYXRpb25WYWx1ZXMob3BOYW1lKTtcclxuICAgICAgICBjb25zdCBjb25kaXRpb24gPSB7XHJcbiAgICAgICAgICAgIGlkOiBgJHtvcC5zZWFyY2hGaWVsZH18JHtvcC5zZWFyY2hUeXBlfXwke29wLnNlYXJjaFRleHR9YCxcclxuICAgICAgICAgICAgc2VhcmNoRmllbGQ6IG9wLnNlYXJjaEZpZWxkLFxyXG4gICAgICAgICAgICBzZWFyY2hUeXBlOiBvcC5zZWFyY2hUeXBlLFxyXG4gICAgICAgICAgICBzZWFyY2hUZXh0OiBvcC5zZWFyY2hUZXh0XHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgaWYgKG9wLmNvbmRpdGlvbnMuc29tZSh4ID0+IHguaWQgPT09IGNvbmRpdGlvbi5pZCkpXHJcbiAgICAgICAgICAgIHJldHVybjtcclxuXHJcbiAgICAgICAgb3Auc2VhcmNoVGV4dCA9IFwiXCI7XHJcbiAgICAgICAgb3AuY29uZGl0aW9ucy5wdXNoKGNvbmRpdGlvbik7XHJcblxyXG4gICAgICAgIHRoaXMuc2V0T3BlcmF0aW9uVmFsdWVzKG9wTmFtZSwgb3ApO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbW92ZUNvbmRpdGlvbihvcE5hbWU6IHN0cmluZywgY29uZGl0aW9uOmFueSkge1xyXG4gICAgICAgIGNvbnN0IG9wID0gdGhpcy5nZXRPcGVyYXRpb25WYWx1ZXMob3BOYW1lKTtcclxuICAgICAgICBvcC5jb25kaXRpb25zID0gb3AuY29uZGl0aW9ucy5maWx0ZXIoeCA9PiB4LmlkICE9PSBjb25kaXRpb24uaWQpO1xyXG4gICAgICAgIHRoaXMuc2V0T3BlcmF0aW9uVmFsdWVzKG9wTmFtZSwgb3ApO1xyXG4gICAgfVxyXG5cclxuICAgIHNldE9wZXJhdGlvblZhbHVlcyhvcE5hbWUsIG9wKSB7XHJcbiAgICAgICAgdmFyIG9wZXJhdGlvblN0YXRlID0gT2JqZWN0LmFzc2lnbih7fSwgdGhpcy5zdGF0ZS5vcGVyYXRpb25TdGF0ZSk7XHJcbiAgICAgICAgb3BlcmF0aW9uU3RhdGVbb3BOYW1lXSA9IG9wO1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBvcGVyYXRpb25TdGF0ZSB9KTtcclxuICAgICAgICBsb2NhbFN0b3JhZ2Uuc2V0SXRlbShcInYxL29wZXJhdGlvblN0YXRlXCIsIEpTT04uc3RyaW5naWZ5KG9wZXJhdGlvblN0YXRlKSk7XHJcbiAgICB9XHJcblxyXG4gICAgc2hvd0RpYWxvZyhkaWFsb2cpIHtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgZGlhbG9nIH0pO1xyXG4gICAgICAgIHNldFRpbWVvdXQoKCkgPT4gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQoZGlhbG9nKS5jbGFzc0xpc3QudG9nZ2xlKCdhY3RpdmUnKSwgMCk7XHJcbiAgICB9XHJcblxyXG4gICAgaGlkZURpYWxvZygpIHtcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHsgZGlhbG9nOiBudWxsIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHNhdmVRdWVyeShvcE5hbWU6c3RyaW5nKSB7XHJcbiAgICAgICAgY29uc3QgbmFtZSA9IHByb21wdChcIlNhdmUgUXVlcnkgYXM6XCIsIFwiTXkgUXVlcnlcIik7XHJcbiAgICAgICAgaWYgKCFuYW1lKSByZXR1cm47XHJcblxyXG4gICAgICAgIGNvbnN0IG9wID0gdGhpcy5nZXRPcGVyYXRpb25WYWx1ZXMob3BOYW1lKTtcclxuICAgICAgICBpZiAoIW9wLnF1ZXJpZXMpIHtcclxuICAgICAgICAgICAgb3AucXVlcmllcyA9IFtdO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgb3AucXVlcmllcy5wdXNoKHtcclxuICAgICAgICAgICAgbmFtZSxcclxuICAgICAgICAgICAgc2VhcmNoRmllbGQ6IG9wLnNlYXJjaEZpZWxkLFxyXG4gICAgICAgICAgICBzZWFyY2hUeXBlOiBvcC5zZWFyY2hUeXBlLFxyXG4gICAgICAgICAgICBzZWFyY2hUZXh0OiBvcC5zZWFyY2hUZXh0LFxyXG4gICAgICAgICAgICBjb25kaXRpb25zOiBvcC5jb25kaXRpb25zLm1hcCh4ID0+IE9iamVjdC5hc3NpZ24oe30sIHgpKVxyXG4gICAgICAgIH0pO1xyXG5cclxuICAgICAgICB0aGlzLnNldE9wZXJhdGlvblZhbHVlcyhvcE5hbWUsIG9wKTtcclxuICAgIH1cclxuXHJcbiAgICByZW1vdmVRdWVyeShvcE5hbWU6IHN0cmluZywgcXVlcnk6IGFueSkge1xyXG4gICAgICAgIGNvbnN0IG9wID0gdGhpcy5nZXRPcGVyYXRpb25WYWx1ZXMob3BOYW1lKTtcclxuICAgICAgICBpZiAoIW9wLnF1ZXJpZXMpIHJldHVybjtcclxuICAgICAgICBvcC5xdWVyaWVzID0gb3AucXVlcmllcy5maWx0ZXIoeCA9PiB4Lm5hbWUgIT0gcXVlcnkubmFtZSk7XHJcbiAgICAgICAgdGhpcy5zZXRPcGVyYXRpb25WYWx1ZXMob3BOYW1lLCBvcCk7XHJcbiAgICB9XHJcblxyXG4gICAgbG9hZFF1ZXJ5KG9wTmFtZTogc3RyaW5nLCBxdWVyeTogYW55KSB7XHJcbiAgICAgICAgY29uc3Qgb3AgPSB0aGlzLmdldE9wZXJhdGlvblZhbHVlcyhvcE5hbWUpO1xyXG4gICAgICAgIG9wLnNlYXJjaEZpZWxkID0gcXVlcnkuc2VhcmNoRmllbGQ7XHJcbiAgICAgICAgb3Auc2VhcmNoVHlwZSA9IHF1ZXJ5LnNlYXJjaFR5cGU7XHJcbiAgICAgICAgb3Auc2VhcmNoVGV4dCA9IHF1ZXJ5LnNlYXJjaFRleHQ7XHJcbiAgICAgICAgb3AuY29uZGl0aW9ucyA9IHF1ZXJ5LmNvbmRpdGlvbnM7XHJcbiAgICAgICAgdGhpcy5zZXRPcGVyYXRpb25WYWx1ZXMob3BOYW1lLCBvcCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHZhciBzZWxlY3RlZCA9IHRoaXMuZ2V0U2VsZWN0ZWQodGhpcy5wcm9wcy5uYW1lKTtcclxuICAgICAgICB2YXIgb3BOYW1lID0gc2VsZWN0ZWQgJiYgc2VsZWN0ZWQubmFtZTtcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IHN0eWxlPXt7IGhlaWdodDogJzEwMCUnIH19PlxyXG4gICAgICAgICAgICAgICAgPEhlYWRlciB0aXRsZT17dGhpcy5nZXRUaXRsZShzZWxlY3RlZCl9IG9uU2lkZWJhclRvZ2dsZT17ZSA9PiB0aGlzLnRvZ2dsZVNpZGViYXIoKSB9IC8+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGlkPVwiYm9keVwiIGNsYXNzTmFtZT17dGhpcy5zdGF0ZS5zaWRlYmFySGlkZGVuID8gJ2hpZGUtc2lkZWJhcicgOiAnJ30+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJpbm5lclwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8U2lkZWJhclxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbmFtZT17b3BOYW1lfSAgICAgICAgICAgICAgICAgICAgICAgIFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmlld2VyQXJncz17dGhpcy5zdGF0ZS52aWV3ZXJBcmdzfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb3BlcmF0aW9ucz17dGhpcy5zdGF0ZS5vcGVyYXRpb25zfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPENvbnRlbnRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbmZpZz17dGhpcy5wcm9wcy5tZXRhZGF0YS5jb25maWd9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB1c2VyaW5mbz17dGhpcy5wcm9wcy5tZXRhZGF0YS51c2VyaW5mb31cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkPXtzZWxlY3RlZH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHZhbHVlcz17dGhpcy5nZXRPcGVyYXRpb25WYWx1ZXModGhpcy5wcm9wcy5uYW1lKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGNvbnZlbnRpb25zPXt0aGlzLnByb3BzLm1ldGFkYXRhLmNvbmZpZy5pbXBsaWNpdGNvbnZlbnRpb25zfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmlld2VyQXJncz17dGhpcy5zdGF0ZS52aWV3ZXJBcmdzW29wTmFtZV19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17YXJncyA9PiB0aGlzLm9uT3BlcmF0aW9uQ2hhbmdlKG9wTmFtZSwgYXJncyl9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkFkZENvbmRpdGlvbj17ZSA9PiB0aGlzLmFkZENvbmRpdGlvbihvcE5hbWUpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25SZW1vdmVDb25kaXRpb249e2MgPT4gdGhpcy5yZW1vdmVDb25kaXRpb24ob3BOYW1lLCBjKSB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvblNob3dEaWFsb2c9e2lkID0+IHRoaXMuc2hvd0RpYWxvZyhpZCkgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25TYXZlUXVlcnk9eygpID0+IHRoaXMuc2F2ZVF1ZXJ5KG9wTmFtZSkgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25SZW1vdmVRdWVyeT17eCA9PiB0aGlzLnJlbW92ZVF1ZXJ5KG9wTmFtZSwgeCkgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25Mb2FkUXVlcnk9e3ggPT4gdGhpcy5sb2FkUXVlcnkob3BOYW1lLCB4KSB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAge3RoaXMuc3RhdGUuZGlhbG9nICE9PSBcImNvbHVtbi1wcmVmcy1kaWFsb2dcIiA/IG51bGwgOiAoXHJcbiAgICAgICAgICAgICAgICAgICAgPENvbHVtblByZWZzRGlhbG9nIG9uQ2xvc2U9e2UgPT4gdGhpcy5oaWRlRGlhbG9nKCkgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmaWVsZHM9e3NlbGVjdGVkLnRvVHlwZUZpZWxkc31cclxuICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWVzPXt0aGlzLmdldE9wZXJhdGlvblZhbHVlcyh0aGlzLnByb3BzLm5hbWUpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17YXJncyA9PiB0aGlzLm9uT3BlcmF0aW9uQ2hhbmdlKG9wTmFtZSwgYXJncykgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAvPlxyXG4gICAgICAgICAgICAgICAgKX1cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvQXV0b1F1ZXJ5LnRzeCIsImltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHsgcmVuZGVyIH0gZnJvbSAncmVhY3QtZG9tJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIENvbHVtblByZWZzRGlhbG9nIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PGFueSwgYW55PiB7XHJcbiAgICBjb25zdHJ1Y3Rvcihwcm9wcz8sIGNvbnRleHQ/KSB7XHJcbiAgICAgICAgc3VwZXIocHJvcHMsIGNvbnRleHQpO1xyXG4gICAgICAgIHRoaXMuc3RhdGUgPSB7fTtcclxuICAgIH1cclxuXHJcbiAgICByZXNldEZpZWxkcygpIHtcclxuICAgICAgICB2YXIgZmllbGRzID0gW107XHJcbiAgICAgICAgdGhpcy5wcm9wcy5vbkNoYW5nZSh7IGZpZWxkcyB9KTtcclxuICAgIH1cclxuXHJcbiAgICBzZWxlY3RGaWVsZChmaWVsZCkge1xyXG4gICAgICAgIGxldCBmaWVsZHMgPSAodGhpcy5wcm9wcy52YWx1ZXMuZmllbGRzIHx8IFtdKTtcclxuXHJcbiAgICAgICAgaWYgKGZpZWxkcy5pbmRleE9mKGZpZWxkKSA+PSAwKVxyXG4gICAgICAgICAgICBmaWVsZHMgPSBmaWVsZHMuZmlsdGVyKHggPT4geCAhPT0gZmllbGQpO1xyXG4gICAgICAgIGVsc2VcclxuICAgICAgICAgICAgZmllbGRzLnB1c2goZmllbGQpO1xyXG5cclxuICAgICAgICB0aGlzLnByb3BzLm9uQ2hhbmdlKHsgZmllbGRzIH0pO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlcigpIHtcclxuICAgICAgICB2YXIgZmllbGRzID0gKHRoaXMucHJvcHMudmFsdWVzLmZpZWxkcyB8fCBbXSk7XHJcblxyXG4gICAgICAgIHZhciBDaGVja2JveFN0eWxlID0ge1xyXG4gICAgICAgICAgICB2ZXJ0aWNhbEFsaWduOiAndGV4dC1ib3R0b20nLCBmb250U2l6ZTogJzIwcHgnLCBtYXJnaW46ICcwIDVweCAwIDAnXHJcbiAgICAgICAgfTtcclxuXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBpZD1cImNvbHVtbi1wcmVmcy1kaWFsb2dcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZGlhbG9nLXdyYXBwZXJcIiBvbkNsaWNrPXtlID0+IHRoaXMucHJvcHMub25DbG9zZSgpfT5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImRpYWxvZ1wiIG9uQ2xpY2s9e2UgPT4gZS5zdG9wUHJvcGFnYXRpb24oKSB9PlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJkaWFsb2ctaGVhZGVyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aDM+Q29sdW1uIFByZWZlcmVuY2VzPC9oMz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImRpYWxvZy1ib2R5XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IG9uQ2xpY2s9e2UgPT4gdGhpcy5yZXNldEZpZWxkcygpfSBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYm9yZGVyQm90dG9tOiAnMXB4IHNvbGlkICNjY2MnLCBwYWRkaW5nOiAnMCAwIDEwcHggMCcsIG1hcmdpbjogJzAgMCAxNXB4IDAnLCBjdXJzb3I6ICdwb2ludGVyJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cIm1hdGVyaWFsLWljb25zXCIgc3R5bGU9e0NoZWNrYm94U3R5bGV9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7ZmllbGRzLmxlbmd0aCA9PT0gMCA/ICdyYWRpb19idXR0b25fY2hlY2tlZCcgOiAncmFkaW9fYnV0dG9uX3VuY2hlY2tlZCd9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9pPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPlNob3cgYWxsIGNvbHVtbnM8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5maWVsZHMubWFwKGYgPT4gKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgb25DbGljaz17ZSA9PiB0aGlzLnNlbGVjdEZpZWxkKGYubmFtZSl9IHN0eWxlPXt7IG1hcmdpbjogJzAgMCA1cHggMCcsIGN1cnNvcjogJ3BvaW50ZXInIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJtYXRlcmlhbC1pY29uc1wiICBzdHlsZT17Q2hlY2tib3hTdHlsZX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7ZmllbGRzLmluZGV4T2YoZi5uYW1lKSA+PSAwID8gJ2NoZWNrX2JveCcgOiAnY2hlY2tfYm94X291dGxpbmVfYmxhbmsnfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9pPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj57Zi5uYW1lfTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICkpfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiZGlhbG9nLWZvb3RlclwiIHN0eWxlPXt7dGV4dEFsaWduOidyaWdodCd9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiYnRuVGV4dFwiIG9uQ2xpY2s9e2UgPT4gdGhpcy5wcm9wcy5vbkNsb3NlKCl9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuPkRPTkU8L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9Db2x1bW5QcmVmc0RpYWxvZy50c3giLCJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCBSZXN1bHRzIGZyb20gJy4vUmVzdWx0cyc7XHJcblxyXG5pbXBvcnQgeyBjb21iaW5lUGF0aHMsIGNyZWF0ZVVybCwgc3BsaXRPbkZpcnN0IH0gZnJvbSAnc2VydmljZXN0YWNrLWNsaWVudCc7XHJcbmltcG9ydCB7IGNsaWVudCwgbm9ybWFsaXplLCBwYXJzZVJlc3BvbnNlU3RhdHVzIH0gZnJvbSAnLi9zaGFyZWQnO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgY2xhc3MgQ29udGVudCBleHRlbmRzIFJlYWN0LkNvbXBvbmVudDxhbnksIGFueT4ge1xyXG4gICAgY29uc3RydWN0b3IocHJvcHM/LCBjb250ZXh0Pykge1xyXG4gICAgICAgIHN1cGVyKHByb3BzLCBjb250ZXh0KTtcclxuICAgICAgICB0aGlzLnN0YXRlID0geyByZXN1bHRzOiBudWxsIH07XHJcbiAgICB9XHJcblxyXG4gICAgc2VsZWN0RmllbGQoZSkge1xyXG4gICAgICAgIHZhciBzZWFyY2hGaWVsZCA9IGUudGFyZ2V0Lm9wdGlvbnNbZS50YXJnZXQuc2VsZWN0ZWRJbmRleF0udmFsdWUsXHJcbiAgICAgICAgICAgIHNlYXJjaFR5cGUgPSB0aGlzLnByb3BzLnZhbHVlcy5zZWFyY2hUeXBlLFxyXG4gICAgICAgICAgICBzZWFyY2hUZXh0ID0gdGhpcy5wcm9wcy52YWx1ZXMuc2VhcmNoVGV4dDtcclxuXHJcbiAgICAgICAgY29uc3QgZiA9IHRoaXMuZ2V0U2VhcmNoRmllbGQoc2VhcmNoRmllbGQpO1xyXG4gICAgICAgIGlmICh0aGlzLmlzSW50RmllbGQoZikpIHtcclxuICAgICAgICAgICAgaWYgKGlzTmFOKHNlYXJjaFRleHQpKVxyXG4gICAgICAgICAgICAgICAgc2VhcmNoVGV4dCA9ICcnO1xyXG4gICAgICAgICAgICBjb25zdCBjb252ZW50aW9uID0gdGhpcy5wcm9wcy5jb252ZW50aW9ucy5maWx0ZXIoYyA9PiBjLm5hbWUgPT09IHNlYXJjaFR5cGUpWzBdO1xyXG4gICAgICAgICAgICBpZiAoIXRoaXMubWF0Y2hlc0NvbnZlbnRpb24oY29udmVudGlvbiwgZi50eXBlKSlcclxuICAgICAgICAgICAgICAgIHNlYXJjaFR5cGUgPSAnJztcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHRoaXMucHJvcHMub25DaGFuZ2UoeyBzZWFyY2hGaWVsZCwgc2VhcmNoVHlwZSwgc2VhcmNoVGV4dCB9KTtcclxuICAgIH1cclxuXHJcbiAgICBzZWxlY3RPcGVyYW5kKGUpIHtcclxuICAgICAgICB0aGlzLnByb3BzLm9uQ2hhbmdlKHsgc2VhcmNoVHlwZTogZS50YXJnZXQub3B0aW9uc1tlLnRhcmdldC5zZWxlY3RlZEluZGV4XS52YWx1ZSB9KTtcclxuICAgIH1cclxuXHJcbiAgICBjaGFuZ2VUZXh0KGUpIHtcclxuICAgICAgICB0aGlzLnByb3BzLm9uQ2hhbmdlKHsgc2VhcmNoVGV4dDogZS50YXJnZXQudmFsdWV9KTtcclxuICAgIH1cclxuXHJcbiAgICBzZWxlY3RGb3JtYXQoZm9ybWF0KSB7XHJcbiAgICAgICAgaWYgKGZvcm1hdCA9PT0gdGhpcy5wcm9wcy52YWx1ZXMuZm9ybWF0KSAvL3RvZ2dsZVxyXG4gICAgICAgICAgICBmb3JtYXQgPSBcIlwiO1xyXG5cclxuICAgICAgICB0aGlzLnByb3BzLm9uQ2hhbmdlKHsgZm9ybWF0IH0pO1xyXG4gICAgfVxyXG5cclxuICAgIGNsZWFyKCkge1xyXG4gICAgICAgIHRoaXMucHJvcHMub25DaGFuZ2Uoe1xyXG4gICAgICAgICAgICBzZWFyY2hGaWVsZDogbnVsbCwgc2VhcmNoVHlwZTogbnVsbCwgc2VhcmNoVGV4dDogJycsIGZvcm1hdDogJycsIG9yZGVyQnk6ICcnLCBvZmZzZXQ6IDAsXHJcbiAgICAgICAgICAgIGZpZWxkczogW10sIGNvbmRpdGlvbnM6IFtdXHJcbiAgICAgICAgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgZ2V0QXV0b1F1ZXJ5VXJsKGZvcm1hdDpzdHJpbmcpIHtcclxuICAgICAgICBjb25zdCBmaXJzdFJvdXRlID0gKHRoaXMucHJvcHMuc2VsZWN0ZWQucmVxdWVzdFR5cGUucm91dGVzIHx8IFtdKS5maWx0ZXIoeCA9PiB4LnBhdGguaW5kZXhPZigneycpID09PSAtMSlbMF07XHJcblxyXG4gICAgICAgIGNvbnN0IHBhdGggPSBmaXJzdFJvdXRlXHJcbiAgICAgICAgICAgID8gZmlyc3RSb3V0ZS5wYXRoXHJcbiAgICAgICAgICAgIDogYC8ke2Zvcm1hdCB8fCAnaHRtbCd9L3JlcGx5L2AgKyB0aGlzLnByb3BzLnNlbGVjdGVkLnJlcXVlc3RUeXBlLm5hbWU7XHJcblxyXG4gICAgICAgIHZhciB1cmwgPSBjb21iaW5lUGF0aHModGhpcy5wcm9wcy5jb25maWcuc2VydmljZWJhc2V1cmwsIHBhdGgpO1xyXG5cclxuICAgICAgICBpZiAoZmlyc3RSb3V0ZSAmJiBmb3JtYXQpXHJcbiAgICAgICAgICAgIHVybCArPSBcIi5cIiArIGZvcm1hdDtcclxuXHJcbiAgICAgICAgdGhpcy5nZXRBcmdzKCkuZm9yRWFjaChhcmcgPT5cclxuICAgICAgICAgICAgdXJsID0gY3JlYXRlVXJsKHVybCwgYXJnKSk7XHJcblxyXG4gICAgICAgIGlmICh0aGlzLnByb3BzLnZhbHVlcy5vZmZzZXQpXHJcbiAgICAgICAgICAgIHVybCA9IGNyZWF0ZVVybCh1cmwsIHsgc2tpcDogdGhpcy5wcm9wcy52YWx1ZXMub2Zmc2V0IH0pO1xyXG5cclxuICAgICAgICBpZiAodGhpcy5wcm9wcy52YWx1ZXMub3JkZXJCeSlcclxuICAgICAgICAgICAgdXJsID0gY3JlYXRlVXJsKHVybCwgeyBvcmRlckJ5OiB0aGlzLnByb3BzLnZhbHVlcy5vcmRlckJ5IH0pO1xyXG5cclxuICAgICAgICBpZiAoKHRoaXMucHJvcHMudmFsdWVzLmZpZWxkcyB8fCBbXSkubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICB1cmwgPSBjcmVhdGVVcmwodXJsLCB7IGZpZWxkczogdGhpcy5wcm9wcy52YWx1ZXMuZmllbGRzLmpvaW4oJywnKSB9KTtcclxuXHJcbiAgICAgICAgICAgIGlmICghZm9ybWF0IHx8IGZvcm1hdCA9PT0gJ2h0bWwnKVxyXG4gICAgICAgICAgICAgICAgdXJsID0gY3JlYXRlVXJsKHVybCwgeyBqc2NvbmZpZzogJ2VkdicgfSk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB1cmwgPSBjcmVhdGVVcmwodXJsLCB7IGluY2x1ZGU6IFwiVG90YWxcIiB9KTtcclxuXHJcbiAgICAgICAgdXJsID0gdXJsLnJlcGxhY2UoLyUyQy9nLCBcIixcIik7XHJcblxyXG4gICAgICAgIHJldHVybiB1cmw7XHJcbiAgICB9XHJcblxyXG4gICAgaXNWYWxpZENvbmRpdGlvbigpIHtcclxuICAgICAgICBjb25zdCB7IHNlYXJjaEZpZWxkLCBzZWFyY2hUeXBlLCBzZWFyY2hUZXh0IH0gPSB0aGlzLnByb3BzLnZhbHVlcztcclxuICAgICAgICByZXR1cm4gc2VhcmNoRmllbGQgJiYgc2VhcmNoVHlwZSAmJiBzZWFyY2hUZXh0XHJcbiAgICAgICAgICAgICYmIChzZWFyY2hUeXBlLnRvTG93ZXJDYXNlKCkgIT09ICdiZXR3ZWVuJyB8fCAoc2VhcmNoVGV4dC5pbmRleE9mKCcsJykgPiAwICYmIHNlYXJjaFRleHQuaW5kZXhPZignLCcpIDwgc2VhcmNoVGV4dC5sZW5ndGggLTEpKTtcclxuICAgIH1cclxuXHJcbiAgICBpc0RpcnR5KCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLmlzVmFsaWRDb25kaXRpb24oKVxyXG4gICAgICAgICAgICB8fCB0aGlzLnByb3BzLnZhbHVlcy5mb3JtYXRcclxuICAgICAgICAgICAgfHwgdGhpcy5wcm9wcy52YWx1ZXMub2Zmc2V0XHJcbiAgICAgICAgICAgIHx8ICh0aGlzLnByb3BzLnZhbHVlcy5maWVsZHMgfHwgW10pLmxlbmd0aCA+IDBcclxuICAgICAgICAgICAgfHwgdGhpcy5wcm9wcy52YWx1ZXMub3JkZXJCeVxyXG4gICAgICAgICAgICB8fCAodGhpcy5wcm9wcy52YWx1ZXMuY29uZGl0aW9ucyB8fCBbXSkubGVuZ3RoID4gMDtcclxuICAgIH1cclxuXHJcbiAgICBnZXRBcmdzKCkge1xyXG4gICAgICAgIHZhciBhcmdzID0gW107XHJcbiAgICAgICAgdmFyIGNvbmRpdGlvbnMgPSAodGhpcy5wcm9wcy52YWx1ZXMuY29uZGl0aW9ucyB8fCBbXSkuc2xpY2UoMCk7XHJcbiAgICAgICAgaWYgKHRoaXMuaXNWYWxpZENvbmRpdGlvbigpKSB7XHJcbiAgICAgICAgICAgIGNvbmRpdGlvbnMucHVzaCh0aGlzLnByb3BzLnZhbHVlcyk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICBjb25kaXRpb25zLmZvckVhY2goY29uZGl0aW9uID0+IHtcclxuICAgICAgICAgICAgY29uc3QgeyBzZWFyY2hGaWVsZCwgc2VhcmNoVHlwZSwgc2VhcmNoVGV4dCB9ID0gY29uZGl0aW9uO1xyXG4gICAgICAgICAgICB2YXIgY29udmVudGlvbiA9IHRoaXMucHJvcHMuY29udmVudGlvbnMuZmlsdGVyKGMgPT4gYy5uYW1lID09PSBzZWFyY2hUeXBlKVswXTtcclxuICAgICAgICAgICAgaWYgKGNvbnZlbnRpb24pIHtcclxuICAgICAgICAgICAgICAgIGNvbnN0IGZpZWxkID0gY29udmVudGlvbi52YWx1ZS5yZXBsYWNlKFwiJVwiLCBzZWFyY2hGaWVsZCk7XHJcbiAgICAgICAgICAgICAgICBhcmdzLnB1c2goeyBbZmllbGRdOiBzZWFyY2hUZXh0IH0pO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfSk7XHJcblxyXG4gICAgICAgIHJldHVybiBhcmdzO1xyXG4gICAgfVxyXG5cclxuICAgIGdldFNlYXJjaEZpZWxkKG5hbWU6IHN0cmluZykge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnByb3BzLnNlbGVjdGVkLmZyb21UeXBlRmllbGRzLmZpbHRlcihmID0+IGYubmFtZSA9PT0gbmFtZSlbMF07XHJcbiAgICB9XHJcblxyXG4gICAgaXNJbnRGaWVsZChmKSB7XHJcbiAgICAgICAgcmV0dXJuIGYgJiYgKGYudHlwZSB8fCAnJykudG9Mb3dlckNhc2UoKS5zdGFydHNXaXRoKCdpbnQnKTtcclxuICAgIH1cclxuXHJcbiAgICBtYXRjaGVzQ29udmVudGlvbihjb252ZW50aW9uLCBmaWVsZFR5cGUpIHtcclxuICAgICAgICByZXR1cm4gIWNvbnZlbnRpb24gfHwgIWNvbnZlbnRpb24udHlwZXMgfHwgIWZpZWxkVHlwZSB8fFxyXG4gICAgICAgICAgICBjb252ZW50aW9uLnR5cGVzLnJlcGxhY2UoLyAvZywgJycpLnRvTG93ZXJDYXNlKCkuc3BsaXQoJywnKS5pbmRleE9mKGZpZWxkVHlwZS50b0xvd2VyQ2FzZSgpKSA+PSAwO1xyXG4gICAgfVxyXG5cclxuICAgIGdldENvbnZlbnRpb25zKCkge1xyXG4gICAgICAgIGNvbnN0IHZhbHVlcyA9IHRoaXMucHJvcHMudmFsdWVzO1xyXG4gICAgICAgIGlmICh2YWx1ZXMgJiYgdmFsdWVzLnNlYXJjaEZpZWxkKSB7XHJcbiAgICAgICAgICAgIGNvbnN0IGYgPSB0aGlzLmdldFNlYXJjaEZpZWxkKHZhbHVlcy5zZWFyY2hGaWVsZCk7XHJcbiAgICAgICAgICAgIGlmIChmKSB7XHJcbiAgICAgICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9wcy5jb252ZW50aW9ucy5maWx0ZXIoYyA9PiB0aGlzLm1hdGNoZXNDb252ZW50aW9uKGMsIGYudHlwZSkpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0aGlzLnByb3BzLmNvbnZlbnRpb25zO1xyXG4gICAgfVxyXG5cclxuICAgIHJlbmRlclJlc3VsdHMocmVzcG9uc2UpIHtcclxuICAgICAgICB2YXIgZmllbGROYW1lcyA9IG51bGwsIGZpZWxkV2lkdGhzID0gbnVsbDtcclxuICAgICAgICB2YXIgZmllbGREZWZzID0gKHRoaXMucHJvcHMudmlld2VyQXJnc1tcIkRlZmF1bHRGaWVsZHNcIl0gfHwgXCJcIilcclxuICAgICAgICAgICAgLnNwbGl0KCcsJylcclxuICAgICAgICAgICAgLmZpbHRlcih4ID0+IHgudHJpbSgpLmxlbmd0aCA+IDApO1xyXG5cclxuICAgICAgICBpZiAoZmllbGREZWZzLmxlbmd0aCA+IDApIHtcclxuICAgICAgICAgICAgZmllbGROYW1lcyA9IFtdLCBmaWVsZFdpZHRocyA9IHt9O1xyXG4gICAgICAgICAgICBmaWVsZERlZnMuZm9yRWFjaCh4ID0+IHtcclxuICAgICAgICAgICAgICAgIHZhciBwYXJ0cyA9IHNwbGl0T25GaXJzdCh4LCAnOicpO1xyXG4gICAgICAgICAgICAgICAgZmllbGROYW1lcy5wdXNoKHBhcnRzWzBdKTtcclxuICAgICAgICAgICAgICAgIGlmIChwYXJ0cy5sZW5ndGggPiAxKVxyXG4gICAgICAgICAgICAgICAgICAgIGZpZWxkV2lkdGhzW3BhcnRzWzBdXSA9IHBhcnRzWzFdO1xyXG4gICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHZhciB7IG9mZnNldCwgcmVzdWx0cywgdG90YWwgfSA9IHJlc3BvbnNlLCBtYXhMaW1pdCA9IHRoaXMucHJvcHMuY29uZmlnLm1heGxpbWl0O1xyXG5cclxuICAgICAgICBjb25zdCBDb250cm9sID0gKG5hbWUsIGVuYWJsZSwgb2Zmc2V0KSA9PiBlbmFibGVcclxuICAgICAgICAgICAgPyA8aSBjbGFzc05hbWU9XCJtYXRlcmlhbC1pY29uc1wiIHN0eWxlPXt7IGN1cnNvcjogJ3BvaW50ZXInIH19IG9uQ2xpY2s9e2UgPT4gdGhpcy5wcm9wcy5vbkNoYW5nZSh7IG9mZnNldCB9KX0+e25hbWV9PC9pPlxyXG4gICAgICAgICAgICA6IDxpIGNsYXNzTmFtZT1cIm1hdGVyaWFsLWljb25zXCIgc3R5bGU9e3sgY29sb3I6ICcjY2NjJyB9fT57bmFtZX08L2k+O1xyXG5cclxuICAgICAgICB2YXIgUGFnaW5nID0gKFxyXG4gICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJwYWdpbmdcIiBzdHlsZT17e3BhZGRpbmc6JzAgMTBweCAwIDAnfX0+XHJcbiAgICAgICAgICAgICAgICB7Q29udHJvbChcInNraXBfcHJldmlvdXNcIiwgb2Zmc2V0ID4gMCwgMCkgfVxyXG4gICAgICAgICAgICAgICAge0NvbnRyb2woXCJjaGV2cm9uX2xlZnRcIiwgb2Zmc2V0ID4gMCwgTWF0aC5tYXgob2Zmc2V0IC0gbWF4TGltaXQsIDApKSB9XHJcbiAgICAgICAgICAgICAgICB7Q29udHJvbChcImNoZXZyb25fcmlnaHRcIiwgb2Zmc2V0ICsgbWF4TGltaXQgPCB0b3RhbCwgb2Zmc2V0ICsgbWF4TGltaXQpIH1cclxuICAgICAgICAgICAgICAgIHtDb250cm9sKFwic2tpcF9uZXh0XCIsIG9mZnNldCArIG1heExpbWl0IDwgdG90YWwsIE1hdGguZmxvb3IoKHRvdGFsIC0gMSkgLyBtYXhMaW1pdCkgKiBtYXhMaW1pdCl9XHJcbiAgICAgICAgICAgIDwvc3Bhbj5cclxuICAgICAgICApO1xyXG5cclxuICAgICAgICByZXR1cm4gcmVzcG9uc2UucmVzdWx0cy5sZW5ndGggPT09IDBcclxuICAgICAgICAgICAgPyA8ZGl2IGNsYXNzTmFtZT1cInJlc3VsdHMtbm9uZVwiPlRoZXJlIHdlcmUgbm8gcmVzdWx0czwvZGl2PlxyXG4gICAgICAgICAgICA6IChcclxuICAgICAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJub3NlbGVjdFwiIHN0eWxlPXt7IGNvbG9yOiAnIzc1NzU3NScsIHBhZGRpbmc6ICcxNXB4IDAnIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7UGFnaW5nfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8c3Bhbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIFNob3dpbmcgUmVzdWx0cyB7b2Zmc2V0ICsgMX0gLSB7b2Zmc2V0ICsgcmVzdWx0cy5sZW5ndGh9IG9mIHt0b3RhbH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9zcGFuPlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwibWF0ZXJpYWwtaWNvbnNcIiB0aXRsZT1cInNob3cvaGlkZSBjb2x1bW5zXCIgb25DbGljaz17ZSA9PiB0aGlzLnByb3BzLm9uU2hvd0RpYWxvZygnY29sdW1uLXByZWZzLWRpYWxvZycpfSBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmVydGljYWxBbGlnbjogJ3RleHQtYm90dG9tJywgbWFyZ2luOiAnMCAwIDAgMTBweCcsIGN1cnNvcjogJ3BvaW50ZXInLCBmb250U2l6ZTonMjBweCdcclxuICAgICAgICAgICAgICAgICAgICAgICAgfX0+dmlld19saXN0PC9pPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG5cclxuICAgICAgICAgICAgICAgICAgICA8UmVzdWx0cyByZXN1bHRzPXtyZXNwb25zZS5yZXN1bHRzfSBmaWVsZE5hbWVzPXtmaWVsZE5hbWVzfSBmaWVsZFdpZHRocz17ZmllbGRXaWR0aHN9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHNlbGVjdGVkPXt0aGlzLnByb3BzLnNlbGVjdGVkfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB2YWx1ZXM9e3RoaXMucHJvcHMudmFsdWVzfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBvbk9yZGVyQnlDaGFuZ2U9e29yZGVyQnkgPT4gdGhpcy5wcm9wcy5vbkNoYW5nZSh7IG9yZGVyQnkgfSl9IC8+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgKTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXJCb2R5KG9wLCB2YWx1ZXMpIHtcclxuICAgICAgICBjb25zdCB1cmwgPSB0aGlzLmdldEF1dG9RdWVyeVVybCh0aGlzLnByb3BzLnZhbHVlcy5mb3JtYXQpO1xyXG4gICAgICAgIGNvbnN0IG5hbWUgPSB0aGlzLnByb3BzLnNlbGVjdGVkLm5hbWU7XHJcbiAgICAgICAgY29uc3QgbG9hZGluZ05ld1F1ZXJ5ID0gdGhpcy5zdGF0ZS51cmwgIT09IHVybDtcclxuICAgICAgICBpZiAobG9hZGluZ05ld1F1ZXJ5KSB7XHJcbiAgICAgICAgICAgIGxldCBuZXdVcmwgPSB0aGlzLmdldEF1dG9RdWVyeVVybChcImpzb25cIik7XHJcbiAgICAgICAgICAgIG5ld1VybCA9IGNyZWF0ZVVybChuZXdVcmwsIHsganNjb25maWc6ICdEYXRlSGFuZGxlcjpJU084NjAxRGF0ZU9ubHksVGltZVNwYW5IYW5kbGVyOlN0YW5kYXJkRm9ybWF0JyB9KTtcclxuXHJcbiAgICAgICAgICAgIGNsaWVudC5nZXQobmV3VXJsKVxyXG4gICAgICAgICAgICAgICAgLnRoZW4ociA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHJlc3BvbnNlID0gbm9ybWFsaXplKHIpO1xyXG4gICAgICAgICAgICAgICAgICAgIHJlc3BvbnNlLnVybCA9IHVybDtcclxuICAgICAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHsgdXJsLCBuYW1lLCByZXNwb25zZSwgZXJyb3I6bnVsbCB9KTtcclxuICAgICAgICAgICAgICAgIH0pXHJcbiAgICAgICAgICAgICAgICAuY2F0Y2gociA9PiB7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIHN0YXR1cyA9IHIucmVzcG9uc2VTdGF0dXM7XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7IHVybCwgbmFtZSwgcmVzcG9uc2U6bnVsbCwgZXJyb3I6IGAke3N0YXR1cy5lcnJvckNvZGV9OiAke3N0YXR1cy5tZXNzYWdlfWAgfSk7XHJcbiAgICAgICAgICAgICAgICB9KTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIGNvbnN0IHF1ZXJpZXMgPSAodGhpcy5wcm9wcy52YWx1ZXMucXVlcmllcyB8fCBbXSk7XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGlkPVwicXVlcnktdGl0bGVcIj5cclxuICAgICAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy52aWV3ZXJBcmdzW1wiRGVzY3JpcHRpb25cIl0gfVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IGlkPVwidXJsXCIgc3R5bGU9e3sgcGFkZGluZzogJzAgMCAxMHB4IDAnLCB3aGl0ZVNwYWNlOidub3dyYXAnIH19PlxyXG4gICAgICAgICAgICAgICAgICAgIDxhIGhyZWY9e3VybH0gdGFyZ2V0PVwiX2JsYW5rXCI+e3VybH08L2E+XHJcbiAgICAgICAgICAgICAgICAgICAgeyEgIHRoaXMuaXNEaXJ0eSgpID8gbnVsbCA6IChcclxuICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwibWF0ZXJpYWwtaWNvbnMgbm9zZWxlY3RcIiB0aXRsZT1cInJlc2V0IHF1ZXJ5XCIgb25DbGljaz17ZSA9PiB0aGlzLmNsZWFyKCkgfSBzdHlsZT17e1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcGFkZGluZzogJzAgMCAwIDVweCcsIGNvbG9yOiAnIzc1NzU3NScsIGZvbnRTaXplOiAnMTZweCcsIHZlcnRpY2FsQWxpZ246ICdib3R0b20nLCBjdXJzb3I6ICdwb2ludGVyJ1xyXG4gICAgICAgICAgICAgICAgICAgICAgICB9fT5jbGVhcjwvaT5cclxuICAgICAgICAgICAgICAgICAgICApfVxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgPHNlbGVjdCB2YWx1ZT17dmFsdWVzLnNlYXJjaEZpZWxkfSBvbkNoYW5nZT17ZSA9PiB0aGlzLnNlbGVjdEZpZWxkKGUpIH0+XHJcbiAgICAgICAgICAgICAgICAgICAgPG9wdGlvbj48L29wdGlvbj5cclxuICAgICAgICAgICAgICAgICAgICB7b3AuZnJvbVR5cGVGaWVsZHMubWFwKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBmID0+IDxvcHRpb24ga2V5PXtmLm5hbWV9PntmLm5hbWV9PC9vcHRpb24+KSB9XHJcbiAgICAgICAgICAgICAgICA8L3NlbGVjdD5cclxuICAgICAgICAgICAgICAgIDxzZWxlY3QgdmFsdWU9e3ZhbHVlcy5zZWFyY2hUeXBlfSBvbkNoYW5nZT17ZSA9PiB0aGlzLnNlbGVjdE9wZXJhbmQoZSkgfT5cclxuICAgICAgICAgICAgICAgICAgICA8b3B0aW9uPjwvb3B0aW9uPlxyXG4gICAgICAgICAgICAgICAgICAgIHt0aGlzLmdldENvbnZlbnRpb25zKCkubWFwKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICBjID0+IDxvcHRpb24ga2V5PXtjLm5hbWV9PntjLm5hbWV9PC9vcHRpb24+KSB9XHJcbiAgICAgICAgICAgICAgICA8L3NlbGVjdD5cclxuICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIGlkPVwidHh0U2VhcmNoXCIgdmFsdWU9e3ZhbHVlcy5zZWFyY2hUZXh0fSBhdXRvQ29tcGxldGU9XCJvZmZcIlxyXG4gICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXtlID0+IHRoaXMuY2hhbmdlVGV4dChlKSB9XHJcbiAgICAgICAgICAgICAgICAgICAgb25LZXlEb3duPXtlID0+IGUua2V5Q29kZSA9PT0gMTMgPyB0aGlzLnByb3BzLm9uQWRkQ29uZGl0aW9uKCkgOiBudWxsfSAvPlxyXG5cclxuICAgICAgICAgICAgICAgIHt0aGlzLmlzVmFsaWRDb25kaXRpb24oKVxyXG4gICAgICAgICAgICAgICAgICAgID8gKDxpIGNsYXNzTmFtZT1cIm1hdGVyaWFsLWljb25zXCIgc3R5bGU9e3sgZm9udFNpemU6ICczMHB4JywgdmVydGljYWxBbGlnbjogJ2JvdHRvbScsIGNvbG9yOiAnIzAwQzg1MycsIGN1cnNvcjogJ3BvaW50ZXInIH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e2UgPT4gdGhpcy5wcm9wcy5vbkFkZENvbmRpdGlvbigpIH0gdGl0bGU9XCJBZGQgY29uZGl0aW9uXCI+YWRkX2NpcmNsZTwvaT4pXHJcbiAgICAgICAgICAgICAgICAgICAgOiAoPGkgY2xhc3NOYW1lPVwibWF0ZXJpYWwtaWNvbnNcIiBzdHlsZT17eyBmb250U2l6ZTogJzMwcHgnLCB2ZXJ0aWNhbEFsaWduOiAnYm90dG9tJywgY29sb3I6ICcjY2NjJyB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICB0aXRsZT1cIkluY29tcGxldGUgY29uZGl0aW9uXCI+YWRkX2NpcmNsZTwvaT4pfVxyXG5cclxuICAgICAgICAgICAgICAgIHshdGhpcy5wcm9wcy5jb25maWcuZm9ybWF0cyB8fCB0aGlzLnByb3BzLmNvbmZpZy5mb3JtYXRzLmxlbmd0aCA9PT0gMCA/IG51bGwgOiAoXHJcbiAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPVwiZm9ybWF0cyBub3NlbGVjdFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5jb25maWcuZm9ybWF0cy5tYXAoZiA9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4ga2V5PXtmfSBjbGFzc05hbWU9e3ZhbHVlcy5mb3JtYXQgPT09IGYgPyAnYWN0aXZlJyA6ICcnfSBvbkNsaWNrPXtlID0+IHRoaXMuc2VsZWN0Rm9ybWF0KGYpfT57Zn08L3NwYW4+KSB9XHJcbiAgICAgICAgICAgICAgICAgICAgPC9zcGFuPikgfVxyXG5cclxuICAgICAgICAgICAgICAgIHt0aGlzLnByb3BzLnZhbHVlcy5jb25kaXRpb25zLmxlbmd0aCArIHF1ZXJpZXMubGVuZ3RoID4gMCA/XHJcbiAgICAgICAgICAgICAgICAgICAgKDxkaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiY29uZGl0aW9uc1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3RoaXMucHJvcHMudmFsdWVzLmNvbmRpdGlvbnMubWFwKGMgPT4gKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYga2V5PXtjLmlkfT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwibWF0ZXJpYWwtaWNvbnNcIiBzdHlsZT17eyBjb2xvcjogJyNkYjQ0MzcnLCBjdXJzb3I6ICdwb2ludGVyJywgcGFkZGluZzogJzAgNXB4IDAgMCcgfX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHRpdGxlPVwicmVtb3ZlIGNvbmRpdGlvblwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXtlID0+IHRoaXMucHJvcHMub25SZW1vdmVDb25kaXRpb24oYykgfT5yZW1vdmVfY2lyY2xlPC9pPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7Yy5zZWFyY2hGaWVsZH0ge2Muc2VhcmNoVHlwZX0ge2Muc2VhcmNoVGV4dH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICkpIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy52YWx1ZXMuY29uZGl0aW9ucy5sZW5ndGggPiAwXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA/ICg8ZGl2IHN0eWxlPXt7IGRpc3BsYXk6ICdpbmxpbmUtYmxvY2snLCB2ZXJ0aWNhbEFsaWduOiAndG9wJywgcGFkZGluZzogMTAgfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgdGl0bGU9XCJTYXZlIFF1ZXJ5XCIgY2xhc3NOYW1lPVwibWF0ZXJpYWwtaWNvbnNcIiBzdHlsZT17eyBmb250U2l6ZTogJzI0cHgnLCBjb2xvcjogJyM0NDQnLCBjdXJzb3I6ICdwb2ludGVyJyB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2xpY2s9e2UgPT4gdGhpcy5wcm9wcy5vblNhdmVRdWVyeSgpIH0+c2F2ZTwvaT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PilcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogbnVsbH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicXVlcmllc1wiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAge3F1ZXJpZXMubWFwKHggPT4gKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cIm1hdGVyaWFsLWljb25zXCIgc3R5bGU9e3sgY29sb3I6ICcjZGI0NDM3JywgY3Vyc29yOiAncG9pbnRlcicsIHBhZGRpbmc6ICcwIDVweCAwIDAnIH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aXRsZT1cInJlbW92ZSBxdWVyeVwiXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNsaWNrPXtlID0+IHRoaXMucHJvcHMub25SZW1vdmVRdWVyeSh4KSB9PnJlbW92ZV9jaXJjbGU8L2k+XHJcblxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJsbmtcIiB0aXRsZT1cImxvYWQgcXVlcnlcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17ZSA9PiB0aGlzLnByb3BzLm9uTG9hZFF1ZXJ5KHgpIH0+e3gubmFtZX08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICApKX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+KVxyXG4gICAgICAgICAgICAgICAgICAgIDogbnVsbH1cclxuXHJcbiAgICAgICAgICAgICAgICB7IHRoaXMuc3RhdGUucmVzcG9uc2VcclxuICAgICAgICAgICAgICAgICAgICA/ICghbG9hZGluZ05ld1F1ZXJ5IHx8IG5hbWUgPT09IHRoaXMuc3RhdGUubmFtZVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA/IHRoaXMucmVuZGVyUmVzdWx0cyh0aGlzLnN0YXRlLnJlc3BvbnNlKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA6ICg8ZGl2IHN0eWxlPXt7IGNvbG9yOiAnIzc1NzU3NScsIHBhZGRpbmc6JzIwcHggMCAwIDAnIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cIm1hdGVyaWFsLWljb25zIHNwaW5cIiBzdHlsZT17eyBmb250U2l6ZTonMjBweCcsIHZlcnRpY2FsQWxpZ246ICd0ZXh0LWJvdHRvbScgfX0+Y2FjaGVkPC9pPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIHN0eWxlPXt7IHBhZGRpbmc6JzAgMCAwIDVweCd9fT5sb2FkaW5nIHJlc3VsdHMuLi48L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PikpXHJcbiAgICAgICAgICAgICAgICAgICAgOiB0aGlzLnN0YXRlLmVycm9yXHJcbiAgICAgICAgICAgICAgICAgICAgICAgID8gPGRpdiBzdHlsZT17eyBjb2xvcjonI2RiNDQzNycsIHBhZGRpbmc6NSB9fT57dGhpcy5zdGF0ZS5lcnJvcn08L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgOiBudWxsIH1cclxuXHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIGNvbnN0IGlzTXNFZGdlID0gL0VkZ2UvLnRlc3QobmF2aWdhdG9yLnVzZXJBZ2VudCk7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBpZD1cImNvbnRlbnRcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5uZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICA8dGFibGU+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRib2R5PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dHI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7aXNNc0VkZ2UgPyA8dGQgc3R5bGU9e3sgbWluV2lkdGg6ICcyMHB4JyB9fT48L3RkPiA6IG51bGx9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAge3RoaXMucHJvcHMuc2VsZWN0ZWRcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPyB0aGlzLnJlbmRlckJvZHkodGhpcy5wcm9wcy5zZWxlY3RlZCwgdGhpcy5wcm9wcy52YWx1ZXMpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogKDxkaXYgc3R5bGU9e3sgcGFkZGluZzogJzE1cHggMCcsIGZvbnRTaXplOicyMHB4JywgY29sb3I6JyM3NTc1NzUnIH19PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgPGkgY2xhc3NOYW1lPVwibWF0ZXJpYWwtaWNvbnNcIiBzdHlsZT17eyB2ZXJ0aWNhbEFsaWduOiAnYm90dG9tJywgbWFyZ2luOicwIDEwcHggMCAwJ319PmFycm93X2JhY2s8L2k+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy51c2VyaW5mby5xdWVyeWNvdW50ID4gMFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgID8gXCJQbGVhc2UgU2VsZWN0IGEgUXVlcnlcIlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA6IHRoaXMucHJvcHMudXNlcmluZm8uaXNhdXRoZW50aWNhdGVkXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA/IFwiVGhlcmUgYXJlIG5vIHF1ZXJpZXMgYXZhaWxhYmxlXCJcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDogXCJQbGVhc2UgU2lnbiBJbiB0byBzZWUgeW91ciBhdmFpbGFibGUgcXVlcmllc1wifTwvZGl2PikgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90ZD5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHshaXNNc0VkZ2UgPyA8dGQgc3R5bGU9e3sgbWluV2lkdGg6ICcyMHB4JyB9fT48L3RkPiA6IG51bGx9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvdHI+XHJcbiAgICAgICAgICAgICAgICAgICAgIDwvdGJvZHk+XHJcbiAgICAgICAgICAgICAgICAgICAgIDwvdGFibGU+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9Db250ZW50LnRzeCIsImltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0JztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIEhlYWRlciBleHRlbmRzIFJlYWN0LkNvbXBvbmVudDxhbnksIGFueT4ge1xyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgaWQ9XCJoZWFkZXJcIiBzdHlsZT17eyBtYXJnaW46ICdhdXRvJywgZGlzcGxheTogJ2ZsZXgnLCBmbGV4RGlyZWN0aW9uOiAncm93JyB9fT5cclxuICAgICAgICAgICAgICAgIDxpIGNsYXNzTmFtZT1cIm1hdGVyaWFsLWljb25zXCIgc3R5bGU9e3sgY3Vyc29yOiAncG9pbnRlcicgfX0gb25DbGljaz17ZSA9PiB0aGlzLnByb3BzLm9uU2lkZWJhclRvZ2dsZSgpIH0+XHJcbiAgICAgICAgICAgICAgICAgICAgbWVudVxyXG4gICAgICAgICAgICAgICAgPC9pPlxyXG4gICAgICAgICAgICAgICAgPGgxPkF1dG9RdWVyeTwvaDE+XHJcbiAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy50aXRsZSA9PSBudWxsID8gPGRpdiBzdHlsZT17e2ZsZXg6MX19IC8+IDogKFxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJoZWFkZXItY29udGVudFwiIHN0eWxlPXt7IGRpc3BsYXk6ICdmbGV4JywgZmxleDogMSB9fT5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwic2VwZXJhdG9yXCI+PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8aDI+e3RoaXMucHJvcHMudGl0bGV9PC9oMj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBzdHlsZT17eyBtYXJnaW46ICdhdXRvJywgZmxleDogMSB9fT48L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICl9XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn1cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvSGVhZGVyLnRzeCIsImltcG9ydCAqIGFzIFJlYWN0IGZyb20gJ3JlYWN0JztcclxuaW1wb3J0IHsgcmVuZGVyIH0gZnJvbSAncmVhY3QtZG9tJztcclxuaW1wb3J0IHsgTGluayB9IGZyb20gJ3JlYWN0LXJvdXRlci1kb20nO1xyXG5pbXBvcnQgeyBnZXRGaWVsZCB9IGZyb20gJy4vc2hhcmVkJztcclxuXHJcbmltcG9ydCB7IGh1bWFuaXplIH0gZnJvbSAnc2VydmljZXN0YWNrLWNsaWVudCc7XHJcblxyXG5leHBvcnQgZGVmYXVsdCBjbGFzcyBSZXN1bHRzIGV4dGVuZHMgUmVhY3QuQ29tcG9uZW50PGFueSwgYW55PiB7XHJcbiAgICByZW5kZXJWYWx1ZShvOiBhbnkpIHtcclxuICAgICAgICByZXR1cm4gQXJyYXkuaXNBcnJheShvKVxyXG4gICAgICAgICAgICA/IG8uam9pbignLCAnKSBcclxuICAgICAgICAgICAgOiB0eXBlb2YgbyA9PSBcInVuZGVmaW5lZFwiXHJcbiAgICAgICAgICAgID8gXCJcIiBcclxuICAgICAgICAgICAgOiB0eXBlb2YgbyA9PSBcIm9iamVjdFwiXHJcbiAgICAgICAgICAgICAgICA/IEpTT04uc3RyaW5naWZ5KG8pXHJcbiAgICAgICAgICAgICAgICA6IG8gKyBcIlwiO1xyXG4gICAgfVxyXG5cclxuICAgIGZvcm1hdFN0cmluZyhzOiBzdHJpbmcpIHtcclxuICAgICAgICBpZiAocykge1xyXG4gICAgICAgICAgICBpZiAocy5zdGFydHNXaXRoKFwiaHR0cFwiKSlcclxuICAgICAgICAgICAgICAgIHJldHVybiA8YSBocmVmPXtzfSB0YXJnZXQ9XCJfYmxhbmtcIj57cy5zdWJzdHJpbmcocy5pbmRleE9mKCc6Ly8nKSArIDMpIH08L2E+O1xyXG5cclxuICAgICAgICAgICAgaWYgKHMudG9Mb3dlckNhc2UoKSA9PT0gXCJmYWxzZVwiKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDxpIGNsYXNzTmFtZT1cIm1hdGVyaWFsLWljb25zXCIgc3R5bGU9e3sgY29sb3I6ICcjNzU3NTc1JywgZm9udFNpemU6ICcxNHB4JyB9fT5jaGVja19ib3hfb3V0bGluZV9ibGFuazwvaT47XHJcbiAgICAgICAgICAgIGlmIChzLnRvTG93ZXJDYXNlKCkgPT09IFwidHJ1ZVwiKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuIDxpIGNsYXNzTmFtZT1cIm1hdGVyaWFsLWljb25zXCIgc3R5bGU9e3sgY29sb3I6ICcjNjZCQjZBJywgZm9udFNpemU6ICcxNHB4JyB9fT5jaGVja19ib3g8L2k+O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIDxzcGFuPntzfTwvc3Bhbj47XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVyKCkge1xyXG4gICAgICAgIHZhciBSZXN1bHRzID0gPGRpdiBjbGFzc05hbWU9XCJyZXN1bHRzLW5vbmVcIj5UaGVyZSB3ZXJlIG5vIHJlc3VsdHM8L2Rpdj47XHJcblxyXG4gICAgICAgIHZhciByZXN1bHRzID0gdGhpcy5wcm9wcy5yZXN1bHRzO1xyXG4gICAgICAgIGlmIChyZXN1bHRzICYmIHJlc3VsdHMubGVuZ3RoID4gMCkge1xyXG4gICAgICAgICAgICB2YXIgZmllbGROYW1lcyA9IHRoaXMucHJvcHMudmFsdWVzLmZpZWxkcyB8fCBbXTtcclxuICAgICAgICAgICAgaWYgKGZpZWxkTmFtZXMubGVuZ3RoID09PSAwKSB7XHJcbiAgICAgICAgICAgICAgICBmaWVsZE5hbWVzID0gdGhpcy5wcm9wcy5maWVsZE5hbWVzIHx8XHJcbiAgICAgICAgICAgICAgICAgICAgdGhpcy5wcm9wcy5zZWxlY3RlZC50b1R5cGVGaWVsZHMubWFwKHggPT4geC5uYW1lKTtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgdmFyIGZpZWxkV2lkdGhzID0gdGhpcy5wcm9wcy5maWVsZFdpZHRocyB8fCB7fTtcclxuXHJcbiAgICAgICAgICAgIHZhciBvcmRlckJ5ID0gKHRoaXMucHJvcHMudmFsdWVzLm9yZGVyQnkgfHwgJycpO1xyXG4gICAgICAgICAgICB2YXIgb3JkZXJCeU5hbWUgPSBvcmRlckJ5LnN0YXJ0c1dpdGgoJy0nKSA/IG9yZGVyQnkuc3Vic3RyKDEpIDogb3JkZXJCeTtcclxuXHJcbiAgICAgICAgICAgIFJlc3VsdHMgPSAoXHJcbiAgICAgICAgICAgICAgICA8dGFibGUgY2xhc3NOYW1lPVwicmVzdWx0c1wiPlxyXG4gICAgICAgICAgICAgICAgICAgIDx0aGVhZD48dHIgY2xhc3NOYW1lPVwibm9zZWxlY3RcIj57IGZpZWxkTmFtZXMubWFwKGYgPT4gKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8dGgga2V5PXtmfSBzdHlsZT17eyBjdXJzb3I6ICdwb2ludGVyJyB9fVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgb25DbGljaz17ZSA9PiB0aGlzLnByb3BzLm9uT3JkZXJCeUNoYW5nZShmICE9PSBvcmRlckJ5TmFtZSA/ICctJyArIGYgOiAhb3JkZXJCeS5zdGFydHNXaXRoKCctJykgPyAnJyA6IG9yZGVyQnlOYW1lKSB9PlxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgaHVtYW5pemUoZikgfVxyXG5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHsgZiAhPT0gb3JkZXJCeU5hbWUgPyBudWxsIDpcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8aSBjbGFzc05hbWU9XCJtYXRlcmlhbC1pY29uc1wiIHN0eWxlPXt7Zm9udFNpemU6JzE4cHgnLHZlcnRpY2FsQWxpZ246J2JvdHRvbSd9fT57b3JkZXJCeS5zdGFydHNXaXRoKCctJykgPyBcImFycm93X2Ryb3BfZG93blwiIDogXCJhcnJvd19kcm9wX3VwXCJ9PC9pPn1cclxuICAgICAgICAgICAgICAgICAgICAgICAgPC90aD5cclxuICAgICAgICAgICAgICAgICAgICApKX08L3RyPjwvdGhlYWQ+XHJcbiAgICAgICAgICAgICAgICAgICAgPHRib2R5PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICB7IHJlc3VsdHMubWFwKChyLGkpID0+IChcclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDx0ciBrZXk9e2l9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtmaWVsZE5hbWVzLm1hcCgoZiwgaikgPT4gKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICA8dGQga2V5PXtqfSB0aXRsZT17dGhpcy5yZW5kZXJWYWx1ZShnZXRGaWVsZChyLGYpKSB9IHN0eWxlPXtnZXRGaWVsZChmaWVsZFdpZHRocyxmKSA/IHsgbWF4V2lkdGg6IHBhcnNlSW50KGdldEZpZWxkKGZpZWxkV2lkdGhzLGYpKSB9IDoge319PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgeyB0aGlzLmZvcm1hdFN0cmluZyh0aGlzLnJlbmRlclZhbHVlKGdldEZpZWxkKHIsZikpKSB9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDwvdGQ+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgKSkgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPC90cj4pXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICkgfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L3Rib2R5PlxyXG4gICAgICAgICAgICAgICAgPC90YWJsZT4gICAgICAgICAgICAgXHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4gUmVzdWx0cztcclxuICAgIH1cclxufVxyXG5cblxuXG4vLyBXRUJQQUNLIEZPT1RFUiAvL1xuLy8gLi9zcmMvUmVzdWx0cy50c3giLCJpbXBvcnQgKiBhcyBSZWFjdCBmcm9tICdyZWFjdCc7XHJcbmltcG9ydCB7IHJlbmRlciB9IGZyb20gJ3JlYWN0LWRvbSc7XHJcbmltcG9ydCB7IExpbmsgfSBmcm9tICdyZWFjdC1yb3V0ZXItZG9tJztcclxuaW1wb3J0IHsgc3BsaXRPbkZpcnN0IH0gZnJvbSAnc2VydmljZXN0YWNrLWNsaWVudCc7XHJcblxyXG5pbXBvcnQgeyBCYXNlUGF0aCB9IGZyb20gJy4vc2hhcmVkJztcclxuXHJcbmV4cG9ydCBkZWZhdWx0IGNsYXNzIFNpZGViYXIgZXh0ZW5kcyBSZWFjdC5Db21wb25lbnQ8YW55LCBhbnk+IHtcclxuICAgIGNvbnN0cnVjdG9yKHByb3BzPywgY29udGV4dD8pIHtcclxuICAgICAgICBzdXBlcihwcm9wcywgY29udGV4dCk7XHJcbiAgICAgICAgdGhpcy5zdGF0ZSA9IHsgZmlsdGVyOiB1bmRlZmluZWQgfTtcclxuICAgIH1cclxuXHJcbiAgICBoYW5kbGVGaWx0ZXIoZSkge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoeyBmaWx0ZXI6IGUudGFyZ2V0LnZhbHVlLnRvTG93ZXJDYXNlKCkgfSk7XHJcbiAgICB9XHJcblxyXG4gICAgcmVuZGVySWNvbihuYW1lKSB7XHJcbiAgICAgICAgdmFyIGljb25VcmwgPSB0aGlzLnByb3BzLnZpZXdlckFyZ3NbbmFtZV1bXCJJY29uVXJsXCJdO1xyXG4gICAgICAgIGlmIChpY29uVXJsKSB7XHJcbiAgICAgICAgICAgIGlmIChpY29uVXJsLnN0YXJ0c1dpdGgoJ21hdGVyaWFsLWljb25zOicpKVxyXG4gICAgICAgICAgICAgICAgcmV0dXJuICg8aSBjbGFzc05hbWU9XCJtYXRlcmlhbC1pY29uc1wiPntzcGxpdE9uRmlyc3QoaWNvblVybCwgJzonKVsxXX08L2k+KTtcclxuICAgICAgICAgICAgaWYgKGljb25Vcmwuc3RhcnRzV2l0aCgnb2N0aWNvbjonKSlcclxuICAgICAgICAgICAgICAgIHJldHVybiAoPHNwYW4gY2xhc3NOYW1lPXtcIm1lZ2Etb2N0aWNvbiBvY3RpY29uLVwiICsgc3BsaXRPbkZpcnN0KGljb25VcmwsICc6JylbMV19Pjwvc3Bhbj4pO1xyXG4gICAgICAgICAgICByZXR1cm4gKDxpbWcgc3JjPXtpY29uVXJsfSAvPik7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiAoPGkgY2xhc3NOYW1lPVwibWF0ZXJpYWwtaWNvbnNcIj5zZWFyY2g8L2k+KTtcclxuICAgIH1cclxuXHJcbiAgICByZW5kZXIoKSB7XHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBpZD1cInNpZGViYXJcIj5cclxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwiaW5uZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGlkPVwiYXEtZmlsdGVyXCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDxpbnB1dCB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwiZmlsdGVyXCIgc3R5bGU9e3sgbWFyZ2luOiBcIjEwcHggMTVweFwiIH19XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17ZSA9PiB0aGlzLmhhbmRsZUZpbHRlcihlKX0gdmFsdWU9e3RoaXMuc3RhdGUuZmlsdGVyfSAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgaWQ9XCJhcS1saXN0XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIHtPYmplY3Qua2V5cyh0aGlzLnByb3BzLm9wZXJhdGlvbnMpXHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAuZmlsdGVyKG9wID0+IHRoaXMuc3RhdGUuZmlsdGVyID09IG51bGwgfHwgb3AudG9Mb3dlckNhc2UoKS5pbmRleE9mKHRoaXMuc3RhdGUuZmlsdGVyKSA+PSAwKVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLm1hcCgob3AsaSkgPT4gKFxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBrZXk9e2l9IGNsYXNzTmFtZT17XCJhcS1pdGVtXCIgKyAob3AgPT09IHRoaXMucHJvcHMubmFtZSA/IFwiIGFjdGl2ZVwiIDogXCJcIil9PlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLnJlbmRlckljb24ob3ApfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxMaW5rIHRvPXtCYXNlUGF0aCArIFwic3NfYWRtaW4vYXV0b3F1ZXJ5L1wiICsgb3B9Pnt0aGlzLnByb3BzLnZpZXdlckFyZ3Nbb3BdW1wiTmFtZVwiXSB8fCBvcH08L0xpbms+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgKSl9XHJcbiAgICAgICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufVxuXG5cbi8vIFdFQlBBQ0sgRk9PVEVSIC8vXG4vLyAuL3NyYy9TaWRlYmFyLnRzeCIsImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcIikodW5kZWZpbmVkKTtcbi8vIGltcG9ydHNcblxuXG4vLyBtb2R1bGVcbmV4cG9ydHMucHVzaChbbW9kdWxlLmlkLCBcImh0bWwsIGJvZHl7XFxyXFxuICBoZWlnaHQ6MTAwJTtcXHJcXG59XFxyXFxuYm9keSB7XFxyXFxuICAgIGZvbnQtZmFtaWx5OiAnUm9ib3RvJywgc2Fucy1zZXJpZjtcXHJcXG4gICAgbWFyZ2luOiAwO1xcclxcbiAgICBiYWNrZ3JvdW5kOiAjZWVlO1xcclxcbn1cXHJcXG5cXHJcXG5oMSwgaDIsIGgzLCBoNCwgaDUsIGg2LCBmb3JtIHtcXHJcXG4gICAgbWFyZ2luOiAwO1xcclxcbiAgICBwYWRkaW5nOiAwO1xcclxcbn1cXHJcXG5cXHJcXG5pbnB1dCwgc2VsZWN0LCBidXR0b24ge1xcclxcbiAgICBwYWRkaW5nOiA0cHggOHB4O1xcclxcbiAgICBtYXJnaW46IDAgNXB4IDAgMDtcXHJcXG59XFxyXFxuYSB7XFxyXFxuICAgIGNvbG9yOiAjNDI4YmNhO1xcclxcbn1cXHJcXG5cXHJcXG50YWJsZSB7XFxyXFxuICAgIG1hcmdpbjogMDtcXHJcXG4gICAgcGFkZGluZzogMDtcXHJcXG4gICAgYm9yZGVyLWNvbGxhcHNlOiBjb2xsYXBzZTtcXHJcXG59XFxyXFxudGFibGUucmVzdWx0cyB7XFxyXFxuICAgIC13ZWJraXQtYm94LXNoYWRvdzogMCAxcHggNHB4IDAgcmdiYSgwLDAsMCwwLjE0KTtcXHJcXG4gICAgICAgICAgICBib3gtc2hhZG93OiAwIDFweCA0cHggMCByZ2JhKDAsMCwwLDAuMTQpO1xcclxcbiAgICBiYWNrZ3JvdW5kOiAjZmVmZWZlO1xcclxcbn1cXHJcXG50YWJsZS5yZXN1bHRzIHRoIHtcXHJcXG4gICAgdGV4dC1hbGlnbjogbGVmdDtcXHJcXG4gICAgY29sb3I6ICM3NTc1NzU7XFxyXFxuICAgIGZvbnQtc2l6ZTogMTNweDtcXHJcXG4gICAgbGluZS1oZWlnaHQ6IDE4cHg7XFxyXFxuICAgIGJvcmRlci1ib3R0b206IDFweCBzb2xpZCAjZTBlMGUwO1xcclxcbiAgICBwYWRkaW5nOiA1cHg7XFxyXFxuICAgIG92ZXJmbG93OiBoaWRkZW47XFxyXFxuICAgIHdoaXRlLXNwYWNlOiBub3dyYXA7ICAgXFxyXFxufVxcclxcbnRhYmxlLnJlc3VsdHMgdGQge1xcclxcbiAgICBjb2xvcjogIzIxMjEyMTtcXHJcXG4gICAgZm9udC1zaXplOiAxMnB4O1xcclxcbiAgICBwYWRkaW5nOiA1cHg7XFxyXFxuICAgIG1heC13aWR0aDogMzAwcHg7XFxyXFxuICAgIG92ZXJmbG93OiBoaWRkZW47XFxyXFxuICAgIHdoaXRlLXNwYWNlOiBub3dyYXA7ICAgXFxyXFxuICAgIHRleHQtb3ZlcmZsb3c6IGVsbGlwc2lzO1xcclxcbn1cXHJcXG5cXHJcXG4jYXBwIHtcXHJcXG4gICAgaGVpZ2h0OiAxMDAlO1xcclxcbn1cXHJcXG5cXHJcXG4ucmVzdWx0cy1ub25lIHtcXHJcXG4gICAgcGFkZGluZzogMTVweCAwO1xcclxcbn1cXHJcXG5cXHJcXG4jaGVhZGVyIHtcXHJcXG4gICAgei1pbmRleDogMjtcXHJcXG4gICAgYmFja2dyb3VuZDogI2ZmZjtcXHJcXG4gICAgY29sb3I6ICM2NzY3Njc7XFxyXFxuICAgIC13ZWJraXQtYm94LXNoYWRvdzogMCAxcHggOHB4IHJnYmEoMCwwLDAsLjMpO1xcclxcbiAgICAgICAgICAgIGJveC1zaGFkb3c6IDAgMXB4IDhweCByZ2JhKDAsMCwwLC4zKTtcXHJcXG4gICAgcG9zaXRpb246IGZpeGVkO1xcclxcbiAgICB3aWR0aDogMTAwJTtcXHJcXG4gICAgY29sb3I6ICM2NzY3Njc7XFxyXFxuICAgIHBhZGRpbmc6IDE1cHggMCAxNXB4IDE1cHg7XFxyXFxufVxcclxcbiAgICAjaGVhZGVyID4gKiwgI2hlYWRlci1jb250ZW50ID4gKiB7XFxyXFxuICAgICAgICBtYXJnaW46IGF1dG87XFxyXFxuICAgICAgICBwYWRkaW5nOiAwIDEwcHg7XFxyXFxuICAgIH1cXHJcXG4gICAgI2hlYWRlciB0YWJsZSB7XFxyXFxuICAgICAgICBtYXJnaW46IDA7XFxyXFxuICAgICAgICBib3JkZXItY29sbGFwc2U6IGNvbGxhcHNlO1xcclxcbiAgICB9XFxyXFxuICAgICNoZWFkZXIgdGQge1xcclxcbiAgICAgICAgaGVpZ2h0OiAzMHB4O1xcclxcbiAgICAgICAgcGFkZGluZzogMCAwIDAgMjBweDtcXHJcXG4gICAgfVxcclxcbiAgICAjaGVhZGVyIGgxLCAjaGVhZGVyIGgyIHtcXHJcXG4gICAgICAgIGZvbnQtc2l6ZTogMjBweDtcXHJcXG4gICAgICAgIGxpbmUtaGVpZ2h0OiA0MHB4O1xcclxcbiAgICB9XFxyXFxuXFxyXFxuI3R4dFNlYXJjaDpmb2N1cyB7XFxyXFxuICAgIG91dGxpbmU6IG5vbmU7XFxyXFxufVxcclxcblxcclxcbmZvcm06Zm9jdXMge1xcclxcbiAgICBib3JkZXI6IDFweCBzb2xpZCAjMzMzO1xcclxcbn1cXHJcXG5cXHJcXG4uc2VwZXJhdG9yIHtcXHJcXG4gICAgYmFja2dyb3VuZDogI2RkZDtcXHJcXG4gICAgd2lkdGg6IDFweDtcXHJcXG4gICAgaGVpZ2h0OiAzMHB4O1xcclxcbn1cXHJcXG5cXHJcXG4jYm9keSB7XFxyXFxufVxcclxcbiNib2R5IC5pbm5lciB7XFxyXFxufVxcclxcblxcclxcbiNzaWRlYmFyIHtcXHJcXG4gICAgei1pbmRleDogMTtcXHJcXG4gICAgYmFja2dyb3VuZDogI2VlZTtcXHJcXG4gICAgbWFyZ2luLWxlZnQ6IDA7XFxyXFxuICAgIC13ZWJraXQtdHJhbnNpdGlvbjogLjNzO1xcclxcbiAgICB0cmFuc2l0aW9uOiAuM3M7XFxyXFxuICAgIHdpZHRoOiAyNTBweDtcXHJcXG4gICAgaGVpZ2h0OiAxMDAlO1xcclxcbiAgICBwb3NpdGlvbjogZml4ZWQ7XFxyXFxuICAgIG92ZXJmbG93LXk6IGF1dG87XFxyXFxuICAgIG1pbi13aWR0aDogMjUwcHg7XFxyXFxuICAgIHBhZGRpbmc6IDA7XFxyXFxufVxcclxcbiAgICAjc2lkZWJhciAuaW5uZXIge1xcclxcbiAgICAgICAgcGFkZGluZzogOTBweCAwIDAgMDtcXHJcXG4gICAgfVxcclxcbiAgICAuaGlkZS1zaWRlYmFyICNzaWRlYmFyIHtcXHJcXG4gICAgICAgIG1hcmdpbi1sZWZ0OiAtMjUwcHg7XFxyXFxuICAgICAgICAtd2Via2l0LXRyYW5zaXRpb246IC4zcztcXHJcXG4gICAgICAgIHRyYW5zaXRpb246IC4zcztcXHJcXG4gICAgICAgIC13ZWJraXQtdHJhbnNpdGlvbi10aW1pbmctZnVuY3Rpb246IGVhc2Utb3V0O1xcclxcbiAgICAgICAgICAgICAgICB0cmFuc2l0aW9uLXRpbWluZy1mdW5jdGlvbjogZWFzZS1vdXQ7XFxyXFxuICAgIH1cXHJcXG5cXHJcXG4jY29udGVudCB7XFxyXFxuICAgIHBhZGRpbmctbGVmdDogMjUwcHg7XFxyXFxufVxcclxcbi5oaWRlLXNpZGViYXIgI2NvbnRlbnQge1xcclxcbiAgICBwYWRkaW5nLWxlZnQ6IDA7XFxyXFxuICAgIC13ZWJraXQtdHJhbnNpdGlvbjogLjNzO1xcclxcbiAgICB0cmFuc2l0aW9uOiAuM3M7XFxyXFxuICAgIC13ZWJraXQtdHJhbnNpdGlvbi10aW1pbmctZnVuY3Rpb246IGVhc2Utb3V0O1xcclxcbiAgICAgICAgICAgIHRyYW5zaXRpb24tdGltaW5nLWZ1bmN0aW9uOiBlYXNlLW91dDtcXHJcXG59XFxyXFxuI2NvbnRlbnQgLmlubmVyIHtcXHJcXG4gICAgcGFkZGluZzogOTBweCAwIDIwcHggMjBweDtcXHJcXG59XFxyXFxuXFxyXFxuI3F1ZXJ5LXRpdGxlIHtcXHJcXG4gICAgei1pbmRleDogMjtcXHJcXG4gICAgY29sb3I6ICM3NTc1NzU7XFxyXFxuICAgIHBvc2l0aW9uOiBmaXhlZDtcXHJcXG4gICAgdG9wOiAyNXB4O1xcclxcbiAgICByaWdodDogMjVweDtcXHJcXG59XFxyXFxuXFxyXFxuLmFxLWl0ZW0ge1xcclxcbiAgICBkaXNwbGF5OiAtd2Via2l0LWJveDtcXHJcXG4gICAgZGlzcGxheTogLW1zLWZsZXhib3g7XFxyXFxuICAgIGRpc3BsYXk6IGZsZXg7XFxyXFxuICAgIGN1cnNvcjogcG9pbnRlcjtcXHJcXG4gICAgb3ZlcmZsb3c6IGhpZGRlbjtcXHJcXG4gICAgdGV4dC1vdmVyZmxvdzogZWxsaXBzaXM7XFxyXFxuICAgIHdoaXRlLXNwYWNlOiBub3dyYXA7XFxyXFxufVxcclxcbiAgICAuYXEtaXRlbSBpIHsgLyptYXRlcmlhbC1pY29uKi9cXHJcXG4gICAgICAgIGNvbG9yOiAjNzU3NTc1O1xcclxcbiAgICAgICAgbWFyZ2luOiBhdXRvO1xcclxcbiAgICAgICAgcGFkZGluZzogMCAxNXB4O1xcclxcbiAgICB9XFxyXFxuICAgIC5hcS1pdGVtIC5tZWdhLW9jdGljb24geyAvKm9jdGljb24qL1xcclxcbiAgICAgICAgZm9udC1zaXplOiAyNHB4O1xcclxcbiAgICAgICAgY29sb3I6ICM3NTc1NzU7XFxyXFxuICAgICAgICBwYWRkaW5nOiA0cHggMTZweDtcXHJcXG4gICAgICAgIHZlcnRpY2FsLWFsaWduOiBtaWRkbGU7XFxyXFxuICAgIH1cXHJcXG4gICAgLmFxLWl0ZW0gaW1nIHtcXHJcXG4gICAgICAgIHdpZHRoOiAyNHB4O1xcclxcbiAgICAgICAgaGVpZ2h0OiAyNHB4O1xcclxcbiAgICAgICAgcGFkZGluZzogNHB4IDE0cHg7XFxyXFxuICAgICAgICB2ZXJ0aWNhbC1hbGlnbjogbWlkZGxlO1xcclxcbiAgICB9XFxyXFxuICAgIC5hcS1pdGVtIGEge1xcclxcbiAgICAgICAgZGlzcGxheTogYmxvY2s7XFxyXFxuICAgICAgICB0ZXh0LWRlY29yYXRpb246IG5vbmU7XFxyXFxuICAgICAgICBjb2xvcjogcmdiYSgwLDAsMCwwLjg3KTtcXHJcXG4gICAgICAgIGxpbmUtaGVpZ2h0OiA0MHB4O1xcclxcbiAgICAgICAgZm9udC1zaXplOiAxNHB4O1xcclxcbiAgICAgICAgLXdlYmtpdC1ib3gtZmxleDogMTtcXHJcXG4gICAgICAgICAgICAtbXMtZmxleDogMTtcXHJcXG4gICAgICAgICAgICAgICAgZmxleDogMTtcXHJcXG4gICAgfVxcclxcbiAgICAuYXEtaXRlbS5hY3RpdmUsIC5hcS1pdGVtOmhvdmVyIHtcXHJcXG4gICAgICAgIGJhY2tncm91bmQ6ICNlN2U3ZTc7XFxyXFxuICAgIH1cXHJcXG4gICAgLmFxLWl0ZW0uYWN0aXZlIHtcXHJcXG4gICAgICAgIGNvbG9yOiAjMjcyNzI3O1xcclxcbiAgICB9XFxyXFxuXFxyXFxuLmZvcm1hdHMge1xcclxcbiAgICBwYWRkaW5nOiAwIDAgMCAxMHB4O1xcclxcbn1cXHJcXG4uZm9ybWF0cyBzcGFuIHtcXHJcXG4gICAgY29sb3I6ICM0MjhiY2E7XFxyXFxuICAgIHBhZGRpbmc6IDAgNXB4IDAgMDtcXHJcXG4gICAgZm9udC1zaXplOiAxMnB4O1xcclxcbiAgICBjdXJzb3I6IHBvaW50ZXI7XFxyXFxufVxcclxcbi5mb3JtYXRzIHNwYW4uYWN0aXZlIHtcXHJcXG4gICAgY29sb3I6ICMyMTIxMjE7XFxyXFxufVxcclxcbi5jb25kaXRpb25zIHtcXHJcXG4gICAgY29sb3I6ICM3NTc1NzU7XFxyXFxuICAgIGZvbnQtc2l6ZTogMTNweDtcXHJcXG4gICAgcGFkZGluZzogMTVweDtcXHJcXG4gICAgbGluZS1oZWlnaHQ6IDE4cHg7XFxyXFxuICAgIGRpc3BsYXk6IGlubGluZS1ibG9jaztcXHJcXG59XFxyXFxuLmNvbmRpdGlvbnMgLm1hdGVyaWFsLWljb25zLCAucXVlcmllcyAubWF0ZXJpYWwtaWNvbnMge1xcclxcbiAgICBmb250LXNpemU6IDE2cHg7XFxyXFxuICAgIHZlcnRpY2FsLWFsaWduOiB0ZXh0LWJvdHRvbTtcXHJcXG59XFxyXFxuLnF1ZXJpZXMge1xcclxcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XFxyXFxuICAgIHZlcnRpY2FsLWFsaWduOiB0b3A7XFxyXFxuICAgIHBhZGRpbmc6IDEwcHg7XFxyXFxufVxcclxcbi5sbmsge1xcclxcbiAgICBjb2xvcjogIzQyOGJjYTtcXHJcXG4gICAgZm9udC1zaXplOiAxM3B4O1xcclxcbiAgICBjdXJzb3I6IHBvaW50ZXI7XFxyXFxuICAgIHRleHQtZGVjb3JhdGlvbjogdW5kZXJsaW5lO1xcclxcbn1cXHJcXG5cXHJcXG4ucGFnaW5nIGkge1xcclxcbiAgICB2ZXJ0aWNhbC1hbGlnbjogYm90dG9tO1xcclxcbn1cXHJcXG5cXHJcXG4uZGlhbG9nLXdyYXBwZXIgeyAgICBcXHJcXG4gICAgcG9zaXRpb246IGZpeGVkO1xcclxcbiAgICB0b3A6IDA7XFxyXFxuICAgIGxlZnQ6IDA7XFxyXFxuICAgIHdpZHRoOiAxMDAlO1xcclxcbiAgICBoZWlnaHQ6IDEwMCU7XFxyXFxuICAgIG92ZXJmbG93OiBoaWRkZW47XFxyXFxuICAgIHotaW5kZXg6IDI7XFxyXFxufVxcclxcbi5hY3RpdmUgLmRpYWxvZy13cmFwcGVyIHtcXHJcXG4gICAgYmFja2dyb3VuZDogcmdiYSgwLDAsMCwwLjEpO1xcclxcbiAgICAtd2Via2l0LXRyYW5zaXRpb246IC4xNXMgY3ViaWMtYmV6aWVyKDAuNCwwLjAsMC4yLDEpIC4xNXM7XFxyXFxuICAgIHRyYW5zaXRpb246IC4xNXMgY3ViaWMtYmV6aWVyKDAuNCwwLjAsMC4yLDEpIC4xNXM7XFxyXFxufVxcclxcblxcclxcbi5kaWFsb2cge1xcclxcbiAgICBwb3NpdGlvbjogYWJzb2x1dGU7XFxyXFxuICAgIHRvcDogMTAwJTtcXHJcXG4gICAgbGVmdDogNTAlO1xcclxcbiAgICBoZWlnaHQ6IDUwJTtcXHJcXG4gICAgbWFyZ2luOiAwIDAgMCAtMzAwcHg7XFxyXFxuICAgIHdpZHRoOiA0NTBweDtcXHJcXG4gICAgYmFja2dyb3VuZDogI2ZmZjtcXHJcXG4gICAgLXdlYmtpdC1ib3gtc2hhZG93OiAwIDFweCA0cHggMCByZ2JhKDAsMCwwLDAuMTQpO1xcclxcbiAgICAgICAgICAgIGJveC1zaGFkb3c6IDAgMXB4IDRweCAwIHJnYmEoMCwwLDAsMC4xNCk7XFxyXFxuICAgIGJvcmRlci1yYWRpdXM6IDRweDtcXHJcXG4gICAgY29sb3I6ICM3NTc1NzU7XFxyXFxuICAgIGRpc3BsYXk6IC13ZWJraXQtYm94O1xcclxcbiAgICBkaXNwbGF5OiAtbXMtZmxleGJveDtcXHJcXG4gICAgZGlzcGxheTogZmxleDtcXHJcXG4gICAgLXdlYmtpdC1ib3gtb3JpZW50OiB2ZXJ0aWNhbDtcXHJcXG4gICAgLXdlYmtpdC1ib3gtZGlyZWN0aW9uOiBub3JtYWw7XFxyXFxuICAgICAgICAtbXMtZmxleC1kaXJlY3Rpb246IGNvbHVtbjtcXHJcXG4gICAgICAgICAgICBmbGV4LWRpcmVjdGlvbjogY29sdW1uO1xcclxcbn1cXHJcXG4uYWN0aXZlIC5kaWFsb2cge1xcclxcbiAgICB0b3A6IDI1JTtcXHJcXG4gICAgLXdlYmtpdC10cmFuc2l0aW9uOiAuMTVzIGN1YmljLWJlemllcigwLjQsMC4wLDAuMiwxKSAuMTVzO1xcclxcbiAgICB0cmFuc2l0aW9uOiAuMTVzIGN1YmljLWJlemllcigwLjQsMC4wLDAuMiwxKSAuMTVzO1xcclxcbn1cXHJcXG5cXHJcXG4uZGlhbG9nIHtcXHJcXG4gICAgcGFkZGluZzogMjBweDtcXHJcXG59XFxyXFxuLmRpYWxvZy1oZWFkZXIge1xcclxcbiAgICBoZWlnaHQ6IDYwcHg7XFxyXFxufVxcclxcbiAgICAuZGlhbG9nLWhlYWRlciBoMyB7XFxyXFxuICAgICAgICBjb2xvcjogIzIxMjEyMTtcXHJcXG4gICAgfVxcclxcblxcclxcbi5kaWFsb2ctYm9keSB7XFxyXFxuICAgIC13ZWJraXQtYm94LWZsZXg6IDE7XFxyXFxuICAgICAgICAtbXMtZmxleDogMTtcXHJcXG4gICAgICAgICAgICBmbGV4OiAxO1xcclxcbiAgICBvdmVyZmxvdy15OiBhdXRvO1xcclxcbn1cXHJcXG4uZGlhbG9nLWZvb3RlciB7XFxyXFxuICAgIGhlaWdodDogMzBweDtcXHJcXG59XFxyXFxuLmJ0blRleHQge1xcclxcbiAgICBkaXNwbGF5OiBpbmxpbmUtYmxvY2s7XFxyXFxuICAgIGNvbG9yOiAjNDI4NUY0O1xcclxcbiAgICBmb250LXdlaWdodDogYm9sZDtcXHJcXG4gICAgY3Vyc29yOiBwb2ludGVyO1xcclxcbn1cXHJcXG4uYnRuVGV4dCBzcGFuIHtcXHJcXG4gICAgZGlzcGxheTogYmxvY2s7XFxyXFxuICAgIHBhZGRpbmc6IDZweCAxMnB4O1xcclxcbiAgICBib3JkZXItcmFkaXVzOiAycHg7XFxyXFxufVxcclxcbi5idG5UZXh0OmhvdmVyIHNwYW4ge1xcclxcbiAgICBiYWNrZ3JvdW5kOiByZ2IoMjI3LCAyMzcsIDI1NCk7XFxyXFxuICAgIC13ZWJraXQtdHJhbnNpdGlvbjogLjNzO1xcclxcbiAgICB0cmFuc2l0aW9uOiAuM3M7XFxyXFxuICAgIC13ZWJraXQtdHJhbnNpdGlvbi10aW1pbmctZnVuY3Rpb246IGVhc2Utb3V0O1xcclxcbiAgICAgICAgICAgIHRyYW5zaXRpb24tdGltaW5nLWZ1bmN0aW9uOiBlYXNlLW91dDtcXHJcXG59XFxyXFxuXFxyXFxuLnNwaW4ge1xcclxcbiAgICB0cmFuc2Zvcm0tb3JpZ2luOiA1MCUgNTAlO1xcclxcbiAgICAtd2Via2l0LXRyYW5zZm9ybS1vcmlnaW46IDUwJSA1MCU7XFxyXFxuICAgIC13ZWJraXQtYW5pbWF0aW9uOnNwaW4gMXMgbGluZWFyIGluZmluaXRlO1xcclxcbiAgICBhbmltYXRpb246IHNwaW4gMXMgbGluZWFyIGluZmluaXRlXFxyXFxufVxcclxcblxcclxcbkAtd2Via2l0LWtleWZyYW1lcyBzcGluIHsgMTAwJSB7IC13ZWJraXQtdHJhbnNmb3JtOiByb3RhdGUoMzYwZGVnKTsgfSB9XFxyXFxuQGtleWZyYW1lcyBzcGluIHsgMTAwJSB7IC13ZWJraXQtdHJhbnNmb3JtOiByb3RhdGUoMzYwZGVnKTsgdHJhbnNmb3JtOnJvdGF0ZSgzNjBkZWcpOyB9IH1cXHJcXG5cXHJcXG46Oi13ZWJraXQtc2Nyb2xsYmFyIHtcXHJcXG4gICAgd2lkdGg6IDdweDtcXHJcXG4gICAgaGVpZ2h0OiA3cHg7XFxyXFxufVxcclxcbiBcXHJcXG46Oi13ZWJraXQtc2Nyb2xsYmFyLXRyYWNrIHtcXHJcXG4gICAgLXdlYmtpdC1ib3gtc2hhZG93OiBpbnNldCAwIDAgMnB4IHJnYmEoMCwwLDAsMC4zKTtcXHJcXG59XFxyXFxuIFxcclxcbjo6LXdlYmtpdC1zY3JvbGxiYXItdGh1bWIge1xcclxcbiAgYmFja2dyb3VuZC1jb2xvcjogZGFya2dyZXk7XFxyXFxuICBvdXRsaW5lOiAxcHggc29saWQgc2xhdGVncmV5O1xcclxcbn1cXHJcXG5cXHJcXG5cXHJcXG4ubm9zZWxlY3Qge1xcclxcbiAgLXdlYmtpdC10b3VjaC1jYWxsb3V0OiBub25lOyAvKiBpT1MgU2FmYXJpICovXFxyXFxuICAtd2Via2l0LXVzZXItc2VsZWN0OiBub25lOyAgIC8qIENocm9tZS9TYWZhcmkvT3BlcmEgKi9cXHJcXG4gIC1tb3otdXNlci1zZWxlY3Q6IG5vbmU7ICAgICAgLyogRmlyZWZveCAqL1xcclxcbiAgLW1zLXVzZXItc2VsZWN0OiBub25lOyAgICAgICAvKiBJRS9FZGdlICovXFxyXFxuICB1c2VyLXNlbGVjdDogbm9uZTsgICAgICAgICAgIC8qIG5vbi1wcmVmaXhlZCB2ZXJzaW9uLCBjdXJyZW50bHlcXHJcXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbm90IHN1cHBvcnRlZCBieSBhbnkgYnJvd3NlciAqL1xcclxcbn1cXHJcXG5cXHJcXG4vKiByb2JvdG8tcmVndWxhciAtIGxhdGluICovXFxyXFxuQGZvbnQtZmFjZSB7XFxyXFxuICAgIGZvbnQtZmFtaWx5OiAnUm9ib3RvJztcXHJcXG4gICAgZm9udC1zdHlsZTogbm9ybWFsO1xcclxcbiAgICBmb250LXdlaWdodDogNDAwO1xcclxcbiAgICBzcmM6IGxvY2FsKCdSb2JvdG8nKSwgbG9jYWwoJ1JvYm90by1SZWd1bGFyJyksIHVybChcIiArIHJlcXVpcmUoXCIuL2Fzc2V0cy9pbWcvcm9ib3RvL3JvYm90by12MTUtbGF0aW4tcmVndWxhci53b2ZmMlwiKSArIFwiKSBmb3JtYXQoJ3dvZmYyJyksIFxcclxcbiAgICB1cmwoXCIgKyByZXF1aXJlKFwiLi9hc3NldHMvaW1nL3JvYm90by9yb2JvdG8tdjE1LWxhdGluLXJlZ3VsYXIud29mZlwiKSArIFwiKSBmb3JtYXQoJ3dvZmYnKTsgLyogQ2hyb21lIDYrLCBGaXJlZm94IDMuNissIElFIDkrLCBTYWZhcmkgNS4xKyAqL1xcclxcbn1cXHJcXG5AZm9udC1mYWNlIHtcXHJcXG4gIGZvbnQtZmFtaWx5OiAnb2N0aWNvbnMnO1xcclxcbiAgc3JjOiB1cmwoXCIgKyByZXF1aXJlKFwiLi9hc3NldHMvaW1nL29jdGljb24vb2N0aWNvbnMud29mZlwiKSArIFwiKSBmb3JtYXQoJ3dvZmYnKSxcXHJcXG4gICAgICAgdXJsKFwiICsgcmVxdWlyZShcIi4vYXNzZXRzL2ltZy9vY3RpY29uL29jdGljb25zLnR0ZlwiKSArIFwiKSBmb3JtYXQoJ3RydWV0eXBlJyk7XFxyXFxuICBmb250LXdlaWdodDogbm9ybWFsO1xcclxcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xcclxcbn1cXHJcXG5cXHJcXG4vKlxcclxcbi5vY3RpY29uIGlzIG9wdGltaXplZCBmb3IgMTZweC5cXHJcXG4ubWVnYS1vY3RpY29uIGlzIG9wdGltaXplZCBmb3IgMzJweCBidXQgY2FuIGJlIHVzZWQgbGFyZ2VyLlxcclxcbiovXFxyXFxuLm9jdGljb24sIC5tZWdhLW9jdGljb24ge1xcclxcbiAgZm9udDogbm9ybWFsIG5vcm1hbCBub3JtYWwgMTZweC8xIG9jdGljb25zO1xcclxcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xcclxcbiAgdGV4dC1kZWNvcmF0aW9uOiBub25lO1xcclxcbiAgdGV4dC1yZW5kZXJpbmc6IGF1dG87XFxyXFxuICAtd2Via2l0LWZvbnQtc21vb3RoaW5nOiBhbnRpYWxpYXNlZDtcXHJcXG4gIC1tb3otb3N4LWZvbnQtc21vb3RoaW5nOiBncmF5c2NhbGU7XFxyXFxuICAtd2Via2l0LXVzZXItc2VsZWN0OiBub25lO1xcclxcbiAgLW1vei11c2VyLXNlbGVjdDogbm9uZTtcXHJcXG4gIC1tcy11c2VyLXNlbGVjdDogbm9uZTtcXHJcXG4gIHVzZXItc2VsZWN0OiBub25lO1xcclxcbn1cXHJcXG4ubWVnYS1vY3RpY29uIHsgZm9udC1zaXplOiAzMnB4OyB9XFxyXFxuXFxyXFxuLm9jdGljb24tYWxlcnQ6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDJEJ30gLyog74CtICovXFxyXFxuLm9jdGljb24tYXJyb3ctZG93bjpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwM0YnfSAvKiDvgL8gKi9cXHJcXG4ub2N0aWNvbi1hcnJvdy1sZWZ0OmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA0MCd9IC8qIO+BgCAqL1xcclxcbi5vY3RpY29uLWFycm93LXJpZ2h0OmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAzRSd9IC8qIO+AviAqL1xcclxcbi5vY3RpY29uLWFycm93LXNtYWxsLWRvd246YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMEEwJ30gLyog74KgICovXFxyXFxuLm9jdGljb24tYXJyb3ctc21hbGwtbGVmdDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwQTEnfSAvKiDvgqEgKi9cXHJcXG4ub2N0aWNvbi1hcnJvdy1zbWFsbC1yaWdodDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNzEnfSAvKiDvgbEgKi9cXHJcXG4ub2N0aWNvbi1hcnJvdy1zbWFsbC11cDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwOUYnfSAvKiDvgp8gKi9cXHJcXG4ub2N0aWNvbi1hcnJvdy11cDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwM0QnfSAvKiDvgL0gKi9cXHJcXG4ub2N0aWNvbi1taWNyb3Njb3BlOmJlZm9yZSwgLm9jdGljb24tYmVha2VyOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjBERCd9IC8qIO+DnSAqL1xcclxcbi5vY3RpY29uLWJlbGw6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMERFJ30gLyog74OeICovXFxyXFxuLm9jdGljb24tYm9sZDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwRTInfSAvKiDvg6IgKi9cXHJcXG4ub2N0aWNvbi1ib29rOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAwNyd9IC8qIO+AhyAqL1xcclxcbi5vY3RpY29uLWJvb2ttYXJrOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA3Qid9IC8qIO+BuyAqL1xcclxcbi5vY3RpY29uLWJyaWVmY2FzZTpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwRDMnfSAvKiDvg5MgKi9cXHJcXG4ub2N0aWNvbi1icm9hZGNhc3Q6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDQ4J30gLyog74GIICovXFxyXFxuLm9jdGljb24tYnJvd3NlcjpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwQzUnfSAvKiDvg4UgKi9cXHJcXG4ub2N0aWNvbi1idWc6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDkxJ30gLyog74KRICovXFxyXFxuLm9jdGljb24tY2FsZW5kYXI6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDY4J30gLyog74GoICovXFxyXFxuLm9jdGljb24tY2hlY2s6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDNBJ30gLyog74C6ICovXFxyXFxuLm9jdGljb24tY2hlY2tsaXN0OmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA3Nid9IC8qIO+BtiAqL1xcclxcbi5vY3RpY29uLWNoZXZyb24tZG93bjpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwQTMnfSAvKiDvgqMgKi9cXHJcXG4ub2N0aWNvbi1jaGV2cm9uLWxlZnQ6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMEE0J30gLyog74KkICovXFxyXFxuLm9jdGljb24tY2hldnJvbi1yaWdodDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNzgnfSAvKiDvgbggKi9cXHJcXG4ub2N0aWNvbi1jaGV2cm9uLXVwOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjBBMid9IC8qIO+CoiAqL1xcclxcbi5vY3RpY29uLWNpcmNsZS1zbGFzaDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwODQnfSAvKiDvgoQgKi9cXHJcXG4ub2N0aWNvbi1jaXJjdWl0LWJvYXJkOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjBENid9IC8qIO+DliAqL1xcclxcbi5vY3RpY29uLWNsaXBweTpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMzUnfSAvKiDvgLUgKi9cXHJcXG4ub2N0aWNvbi1jbG9jazpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNDYnfSAvKiDvgYYgKi9cXHJcXG4ub2N0aWNvbi1jbG91ZC1kb3dubG9hZDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMEInfSAvKiDvgIsgKi9cXHJcXG4ub2N0aWNvbi1jbG91ZC11cGxvYWQ6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDBDJ30gLyog74CMICovXFxyXFxuLm9jdGljb24tY29kZTpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNUYnfSAvKiDvgZ8gKi9cXHJcXG4ub2N0aWNvbi1jb21tZW50LWFkZDpiZWZvcmUsIC5vY3RpY29uLWNvbW1lbnQ6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDJCJ30gLyog74CrICovXFxyXFxuLm9jdGljb24tY29tbWVudC1kaXNjdXNzaW9uOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA0Rid9IC8qIO+BjyAqL1xcclxcbi5vY3RpY29uLWNyZWRpdC1jYXJkOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA0NSd9IC8qIO+BhSAqL1xcclxcbi5vY3RpY29uLWRhc2g6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMENBJ30gLyog74OKICovXFxyXFxuLm9jdGljb24tZGFzaGJvYXJkOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA3RCd9IC8qIO+BvSAqL1xcclxcbi5vY3RpY29uLWRhdGFiYXNlOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA5Nid9IC8qIO+CliAqL1xcclxcbi5vY3RpY29uLWNsb25lOmJlZm9yZSwgLm9jdGljb24tZGVza3RvcC1kb3dubG9hZDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwREMnfSAvKiDvg5wgKi9cXHJcXG4ub2N0aWNvbi1kZXZpY2UtY2FtZXJhOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA1Nid9IC8qIO+BliAqL1xcclxcbi5vY3RpY29uLWRldmljZS1jYW1lcmEtdmlkZW86YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDU3J30gLyog74GXICovXFxyXFxuLm9jdGljb24tZGV2aWNlLWRlc2t0b3A6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMjdDJ30gLyog74m8ICovXFxyXFxuLm9jdGljb24tZGV2aWNlLW1vYmlsZTpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMzgnfSAvKiDvgLggKi9cXHJcXG4ub2N0aWNvbi1kaWZmOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA0RCd9IC8qIO+BjSAqL1xcclxcbi5vY3RpY29uLWRpZmYtYWRkZWQ6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDZCJ30gLyog74GrICovXFxyXFxuLm9jdGljb24tZGlmZi1pZ25vcmVkOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA5OSd9IC8qIO+CmSAqL1xcclxcbi5vY3RpY29uLWRpZmYtbW9kaWZpZWQ6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDZEJ30gLyog74GtICovXFxyXFxuLm9jdGljb24tZGlmZi1yZW1vdmVkOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA2Qyd9IC8qIO+BrCAqL1xcclxcbi5vY3RpY29uLWRpZmYtcmVuYW1lZDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNkUnfSAvKiDvga4gKi9cXHJcXG4ub2N0aWNvbi1lbGxpcHNpczpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwOUEnfSAvKiDvgpogKi9cXHJcXG4ub2N0aWNvbi1leWUtdW53YXRjaDpiZWZvcmUsIC5vY3RpY29uLWV5ZS13YXRjaDpiZWZvcmUsIC5vY3RpY29uLWV5ZTpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNEUnfSAvKiDvgY4gKi9cXHJcXG4ub2N0aWNvbi1maWxlLWJpbmFyeTpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwOTQnfSAvKiDvgpQgKi9cXHJcXG4ub2N0aWNvbi1maWxlLWNvZGU6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDEwJ30gLyog74CQICovXFxyXFxuLm9jdGljb24tZmlsZS1kaXJlY3Rvcnk6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDE2J30gLyog74CWICovXFxyXFxuLm9jdGljb24tZmlsZS1tZWRpYTpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMTInfSAvKiDvgJIgKi9cXHJcXG4ub2N0aWNvbi1maWxlLXBkZjpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMTQnfSAvKiDvgJQgKi9cXHJcXG4ub2N0aWNvbi1maWxlLXN1Ym1vZHVsZTpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMTcnfSAvKiDvgJcgKi9cXHJcXG4ub2N0aWNvbi1maWxlLXN5bWxpbmstZGlyZWN0b3J5OmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjBCMSd9IC8qIO+CsSAqL1xcclxcbi5vY3RpY29uLWZpbGUtc3ltbGluay1maWxlOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjBCMCd9IC8qIO+CsCAqL1xcclxcbi5vY3RpY29uLWZpbGUtdGV4dDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMTEnfSAvKiDvgJEgKi9cXHJcXG4ub2N0aWNvbi1maWxlLXppcDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMTMnfSAvKiDvgJMgKi9cXHJcXG4ub2N0aWNvbi1mbGFtZTpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwRDInfSAvKiDvg5IgKi9cXHJcXG4ub2N0aWNvbi1mb2xkOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjBDQyd9IC8qIO+DjCAqL1xcclxcbi5vY3RpY29uLWdlYXI6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDJGJ30gLyog74CvICovXFxyXFxuLm9jdGljb24tZ2lmdDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNDInfSAvKiDvgYIgKi9cXHJcXG4ub2N0aWNvbi1naXN0OmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAwRSd9IC8qIO+AjiAqL1xcclxcbi5vY3RpY29uLWdpc3Qtc2VjcmV0OmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA4Qyd9IC8qIO+CjCAqL1xcclxcbi5vY3RpY29uLWdpdC1icmFuY2gtY3JlYXRlOmJlZm9yZSwgLm9jdGljb24tZ2l0LWJyYW5jaC1kZWxldGU6YmVmb3JlLCAub2N0aWNvbi1naXQtYnJhbmNoOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAyMCd9IC8qIO+AoCAqL1xcclxcbi5vY3RpY29uLWdpdC1jb21taXQ6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDFGJ30gLyog74CfICovXFxyXFxuLm9jdGljb24tZ2l0LWNvbXBhcmU6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMEFDJ30gLyog74KsICovXFxyXFxuLm9jdGljb24tZ2l0LW1lcmdlOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAyMyd9IC8qIO+AoyAqL1xcclxcbi5vY3RpY29uLWdpdC1wdWxsLXJlcXVlc3QtYWJhbmRvbmVkOmJlZm9yZSwgLm9jdGljb24tZ2l0LXB1bGwtcmVxdWVzdDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMDknfSAvKiDvgIkgKi9cXHJcXG4ub2N0aWNvbi1nbG9iZTpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwQjYnfSAvKiDvgrYgKi9cXHJcXG4ub2N0aWNvbi1ncmFwaDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNDMnfSAvKiDvgYMgKi9cXHJcXG4ub2N0aWNvbi1oZWFydDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXDI2NjUnfSAvKiDimaUgKi9cXHJcXG4ub2N0aWNvbi1oaXN0b3J5OmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA3RSd9IC8qIO+BviAqL1xcclxcbi5vY3RpY29uLWhvbWU6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDhEJ30gLyog74KNICovXFxyXFxuLm9jdGljb24taG9yaXpvbnRhbC1ydWxlOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA3MCd9IC8qIO+BsCAqL1xcclxcbi5vY3RpY29uLWh1Ym90OmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA5RCd9IC8qIO+CnSAqL1xcclxcbi5vY3RpY29uLWluYm94OmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjBDRid9IC8qIO+DjyAqL1xcclxcbi5vY3RpY29uLWluZm86YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDU5J30gLyog74GZICovXFxyXFxuLm9jdGljb24taXNzdWUtY2xvc2VkOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAyOCd9IC8qIO+AqCAqL1xcclxcbi5vY3RpY29uLWlzc3VlLW9wZW5lZDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMjYnfSAvKiDvgKYgKi9cXHJcXG4ub2N0aWNvbi1pc3N1ZS1yZW9wZW5lZDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMjcnfSAvKiDvgKcgKi9cXHJcXG4ub2N0aWNvbi1pdGFsaWM6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMEU0J30gLyog74OkICovXFxyXFxuLm9jdGljb24tamVyc2V5OmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAxOSd9IC8qIO+AmSAqL1xcclxcbi5vY3RpY29uLWtleTpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNDknfSAvKiDvgYkgKi9cXHJcXG4ub2N0aWNvbi1rZXlib2FyZDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMEQnfSAvKiDvgI0gKi9cXHJcXG4ub2N0aWNvbi1sYXc6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMEQ4J30gLyog74OYICovXFxyXFxuLm9jdGljb24tbGlnaHQtYnVsYjpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMDAnfSAvKiDvgIAgKi9cXHJcXG4ub2N0aWNvbi1saW5rOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA1Qyd9IC8qIO+BnCAqL1xcclxcbi5vY3RpY29uLWxpbmstZXh0ZXJuYWw6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDdGJ30gLyog74G/ICovXFxyXFxuLm9jdGljb24tbGlzdC1vcmRlcmVkOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA2Mid9IC8qIO+BoiAqL1xcclxcbi5vY3RpY29uLWxpc3QtdW5vcmRlcmVkOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA2MSd9IC8qIO+BoSAqL1xcclxcbi5vY3RpY29uLWxvY2F0aW9uOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA2MCd9IC8qIO+BoCAqL1xcclxcbi5vY3RpY29uLWdpc3QtcHJpdmF0ZTpiZWZvcmUsIC5vY3RpY29uLW1pcnJvci1wcml2YXRlOmJlZm9yZSwgLm9jdGljb24tZ2l0LWZvcmstcHJpdmF0ZTpiZWZvcmUsIC5vY3RpY29uLWxvY2s6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDZBJ30gLyog74GqICovXFxyXFxuLm9jdGljb24tbG9nby1naXN0OmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjBBRCd9IC8qIO+CrSAqL1xcclxcbi5vY3RpY29uLWxvZ28tZ2l0aHViOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA5Mid9IC8qIO+CkiAqL1xcclxcbi5vY3RpY29uLW1haWw6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDNCJ30gLyog74C7ICovXFxyXFxuLm9jdGljb24tbWFpbC1yZWFkOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAzQyd9IC8qIO+AvCAqL1xcclxcbi5vY3RpY29uLW1haWwtcmVwbHk6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDUxJ30gLyog74GRICovXFxyXFxuLm9jdGljb24tbWFyay1naXRodWI6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDBBJ30gLyog74CKICovXFxyXFxuLm9jdGljb24tbWFya2Rvd246YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMEM5J30gLyog74OJICovXFxyXFxuLm9jdGljb24tbWVnYXBob25lOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA3Nyd9IC8qIO+BtyAqL1xcclxcbi5vY3RpY29uLW1lbnRpb246YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMEJFJ30gLyog74K+ICovXFxyXFxuLm9jdGljb24tbWlsZXN0b25lOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA3NSd9IC8qIO+BtSAqL1xcclxcbi5vY3RpY29uLW1pcnJvci1wdWJsaWM6YmVmb3JlLCAub2N0aWNvbi1taXJyb3I6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDI0J30gLyog74CkICovXFxyXFxuLm9jdGljb24tbW9ydGFyLWJvYXJkOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjBENyd9IC8qIO+DlyAqL1xcclxcbi5vY3RpY29uLW11dGU6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDgwJ30gLyog74KAICovXFxyXFxuLm9jdGljb24tbm8tbmV3bGluZTpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwOUMnfSAvKiDvgpwgKi9cXHJcXG4ub2N0aWNvbi1vY3RvZmFjZTpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMDgnfSAvKiDvgIggKi9cXHJcXG4ub2N0aWNvbi1vcmdhbml6YXRpb246YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDM3J30gLyog74C3ICovXFxyXFxuLm9jdGljb24tcGFja2FnZTpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwQzQnfSAvKiDvg4QgKi9cXHJcXG4ub2N0aWNvbi1wYWludGNhbjpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwRDEnfSAvKiDvg5EgKi9cXHJcXG4ub2N0aWNvbi1wZW5jaWw6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDU4J30gLyog74GYICovXFxyXFxuLm9jdGljb24tcGVyc29uLWFkZDpiZWZvcmUsIC5vY3RpY29uLXBlcnNvbi1mb2xsb3c6YmVmb3JlLCAub2N0aWNvbi1wZXJzb246YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDE4J30gLyog74CYICovXFxyXFxuLm9jdGljb24tcGluOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA0MSd9IC8qIO+BgSAqL1xcclxcbi5vY3RpY29uLXBsdWc6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMEQ0J30gLyog74OUICovXFxyXFxuLm9jdGljb24tcmVwby1jcmVhdGU6YmVmb3JlLCAub2N0aWNvbi1naXN0LW5ldzpiZWZvcmUsIC5vY3RpY29uLWZpbGUtZGlyZWN0b3J5LWNyZWF0ZTpiZWZvcmUsIC5vY3RpY29uLWZpbGUtYWRkOmJlZm9yZSwgLm9jdGljb24tcGx1czpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNUQnfSAvKiDvgZ0gKi9cXHJcXG4ub2N0aWNvbi1wcmltaXRpdmUtZG90OmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA1Mid9IC8qIO+BkiAqL1xcclxcbi5vY3RpY29uLXByaW1pdGl2ZS1zcXVhcmU6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDUzJ30gLyog74GTICovXFxyXFxuLm9jdGljb24tcHVsc2U6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDg1J30gLyog74KFICovXFxyXFxuLm9jdGljb24tcXVlc3Rpb246YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDJDJ30gLyog74CsICovXFxyXFxuLm9jdGljb24tcXVvdGU6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDYzJ30gLyog74GjICovXFxyXFxuLm9jdGljb24tcmFkaW8tdG93ZXI6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDMwJ30gLyog74CwICovXFxyXFxuLm9jdGljb24tcmVwby1kZWxldGU6YmVmb3JlLCAub2N0aWNvbi1yZXBvOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAwMSd9IC8qIO+AgSAqL1xcclxcbi5vY3RpY29uLXJlcG8tY2xvbmU6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDRDJ30gLyog74GMICovXFxyXFxuLm9jdGljb24tcmVwby1mb3JjZS1wdXNoOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA0QSd9IC8qIO+BiiAqL1xcclxcbi5vY3RpY29uLWdpc3QtZm9yazpiZWZvcmUsIC5vY3RpY29uLXJlcG8tZm9ya2VkOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAwMid9IC8qIO+AgiAqL1xcclxcbi5vY3RpY29uLXJlcG8tcHVsbDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMDYnfSAvKiDvgIYgKi9cXHJcXG4ub2N0aWNvbi1yZXBvLXB1c2g6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDA1J30gLyog74CFICovXFxyXFxuLm9jdGljb24tcm9ja2V0OmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAzMyd9IC8qIO+AsyAqL1xcclxcbi5vY3RpY29uLXJzczpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMzQnfSAvKiDvgLQgKi9cXHJcXG4ub2N0aWNvbi1ydWJ5OmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA0Nyd9IC8qIO+BhyAqL1xcclxcbi5vY3RpY29uLXNlYXJjaC1zYXZlOmJlZm9yZSwgLm9jdGljb24tc2VhcmNoOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAyRSd9IC8qIO+AriAqL1xcclxcbi5vY3RpY29uLXNlcnZlcjpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwOTcnfSAvKiDvgpcgKi9cXHJcXG4ub2N0aWNvbi1zZXR0aW5nczpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwN0MnfSAvKiDvgbwgKi9cXHJcXG4ub2N0aWNvbi1zaGllbGQ6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMEUxJ30gLyog74OhICovXFxyXFxuLm9jdGljb24tbG9nLWluOmJlZm9yZSwgLm9jdGljb24tc2lnbi1pbjpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMzYnfSAvKiDvgLYgKi9cXHJcXG4ub2N0aWNvbi1sb2ctb3V0OmJlZm9yZSwgLm9jdGljb24tc2lnbi1vdXQ6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDMyJ30gLyog74CyICovXFxyXFxuLm9jdGljb24tc21pbGV5OmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjBFNyd9IC8qIO+DpyAqL1xcclxcbi5vY3RpY29uLXNxdWlycmVsOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjBCMid9IC8qIO+CsiAqL1xcclxcbi5vY3RpY29uLXN0YXItYWRkOmJlZm9yZSwgLm9jdGljb24tc3Rhci1kZWxldGU6YmVmb3JlLCAub2N0aWNvbi1zdGFyOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAyQSd9IC8qIO+AqiAqL1xcclxcbi5vY3RpY29uLXN0b3A6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDhGJ30gLyog74KPICovXFxyXFxuLm9jdGljb24tcmVwby1zeW5jOmJlZm9yZSwgLm9jdGljb24tc3luYzpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwODcnfSAvKiDvgocgKi9cXHJcXG4ub2N0aWNvbi10YWctcmVtb3ZlOmJlZm9yZSwgLm9jdGljb24tdGFnLWFkZDpiZWZvcmUsIC5vY3RpY29uLXRhZzpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMTUnfSAvKiDvgJUgKi9cXHJcXG4ub2N0aWNvbi10YXNrbGlzdDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwRTUnfSAvKiDvg6UgKi9cXHJcXG4ub2N0aWNvbi10ZWxlc2NvcGU6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDg4J30gLyog74KIICovXFxyXFxuLm9jdGljb24tdGVybWluYWw6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMEM4J30gLyog74OIICovXFxyXFxuLm9jdGljb24tdGV4dC1zaXplOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjBFMyd9IC8qIO+DoyAqL1xcclxcbi5vY3RpY29uLXRocmVlLWJhcnM6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDVFJ30gLyog74GeICovXFxyXFxuLm9jdGljb24tdGh1bWJzZG93bjpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwREInfSAvKiDvg5sgKi9cXHJcXG4ub2N0aWNvbi10aHVtYnN1cDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwREEnfSAvKiDvg5ogKi9cXHJcXG4ub2N0aWNvbi10b29sczpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMzEnfSAvKiDvgLEgKi9cXHJcXG4ub2N0aWNvbi10cmFzaGNhbjpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwRDAnfSAvKiDvg5AgKi9cXHJcXG4ub2N0aWNvbi10cmlhbmdsZS1kb3duOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA1Qid9IC8qIO+BmyAqL1xcclxcbi5vY3RpY29uLXRyaWFuZ2xlLWxlZnQ6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDQ0J30gLyog74GEICovXFxyXFxuLm9jdGljb24tdHJpYW5nbGUtcmlnaHQ6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDVBJ30gLyog74GaICovXFxyXFxuLm9jdGljb24tdHJpYW5nbGUtdXA6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMEFBJ30gLyog74KqICovXFxyXFxuLm9jdGljb24tdW5mb2xkOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAzOSd9IC8qIO+AuSAqL1xcclxcbi5vY3RpY29uLXVubXV0ZTpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwQkEnfSAvKiDvgrogKi9cXHJcXG4ub2N0aWNvbi12ZXJpZmllZDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwRTYnfSAvKiDvg6YgKi9cXHJcXG4ub2N0aWNvbi12ZXJzaW9uczpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNjQnfSAvKiDvgaQgKi9cXHJcXG4ub2N0aWNvbi13YXRjaDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwRTAnfSAvKiDvg6AgKi9cXHJcXG4ub2N0aWNvbi1yZW1vdmUtY2xvc2U6YmVmb3JlLCAub2N0aWNvbi14OmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA4MSd9IC8qIO+CgSAqL1xcclxcbi5vY3RpY29uLXphcDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXDI2QTEnfSAvKiDimqEgKi9cXHJcXG5cXHJcXG5cXHJcXG5cIiwgXCJcIl0pO1xuXG4vLyBleHBvcnRzXG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vY3NzLWxvYWRlciEuL34vcG9zdGNzcy1sb2FkZXIvbGliP3tcInBsdWdpbnNcIjpbbnVsbCxudWxsXX0hLi9zcmMvYXBwLmNzc1xuLy8gbW9kdWxlIGlkID0gMTExXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsImV4cG9ydHMgPSBtb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoXCIuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9saWIvY3NzLWJhc2UuanNcIikodW5kZWZpbmVkKTtcbi8vIGltcG9ydHNcblxuXG4vLyBtb2R1bGVcbmV4cG9ydHMucHVzaChbbW9kdWxlLmlkLCBcIkBmb250LWZhY2Uge1xcbiAgZm9udC1mYW1pbHk6ICdNYXRlcmlhbCBJY29ucyc7XFxuICBmb250LXN0eWxlOiBub3JtYWw7XFxuICBmb250LXdlaWdodDogNDAwO1xcbiAgc3JjOiB1cmwoXCIgKyByZXF1aXJlKFwiLi9NYXRlcmlhbEljb25zLVJlZ3VsYXIuZW90XCIpICsgXCIpOyAvKiBGb3IgSUU2LTggKi9cXG4gIHNyYzogbG9jYWwoJ01hdGVyaWFsIEljb25zJyksXFxuICAgICAgIGxvY2FsKCdNYXRlcmlhbEljb25zLVJlZ3VsYXInKSxcXG4gICAgICAgdXJsKFwiICsgcmVxdWlyZShcIi4vTWF0ZXJpYWxJY29ucy1SZWd1bGFyLndvZmYyXCIpICsgXCIpIGZvcm1hdCgnd29mZjInKSxcXG4gICAgICAgdXJsKFwiICsgcmVxdWlyZShcIi4vTWF0ZXJpYWxJY29ucy1SZWd1bGFyLndvZmZcIikgKyBcIikgZm9ybWF0KCd3b2ZmJyksXFxuICAgICAgIHVybChcIiArIHJlcXVpcmUoXCIuL01hdGVyaWFsSWNvbnMtUmVndWxhci50dGZcIikgKyBcIikgZm9ybWF0KCd0cnVldHlwZScpO1xcbn1cXG5cXG4ubWF0ZXJpYWwtaWNvbnMge1xcbiAgZm9udC1mYW1pbHk6ICdNYXRlcmlhbCBJY29ucyc7XFxuICBmb250LXdlaWdodDogbm9ybWFsO1xcbiAgZm9udC1zdHlsZTogbm9ybWFsO1xcbiAgZm9udC1zaXplOiAyNHB4OyAgLyogUHJlZmVycmVkIGljb24gc2l6ZSAqL1xcbiAgZGlzcGxheTogaW5saW5lLWJsb2NrO1xcbiAgd2lkdGg6IDFlbTtcXG4gIGhlaWdodDogMWVtO1xcbiAgbGluZS1oZWlnaHQ6IDE7XFxuICB0ZXh0LXRyYW5zZm9ybTogbm9uZTtcXG4gIGxldHRlci1zcGFjaW5nOiBub3JtYWw7XFxuICB3b3JkLXdyYXA6IG5vcm1hbDtcXG4gIHdoaXRlLXNwYWNlOiBub3dyYXA7XFxuICBkaXJlY3Rpb246IGx0cjtcXG5cXG4gIC8qIFN1cHBvcnQgZm9yIGFsbCBXZWJLaXQgYnJvd3NlcnMuICovXFxuICAtd2Via2l0LWZvbnQtc21vb3RoaW5nOiBhbnRpYWxpYXNlZDtcXG4gIC8qIFN1cHBvcnQgZm9yIFNhZmFyaSBhbmQgQ2hyb21lLiAqL1xcbiAgdGV4dC1yZW5kZXJpbmc6IG9wdGltaXplTGVnaWJpbGl0eTtcXG5cXG4gIC8qIFN1cHBvcnQgZm9yIEZpcmVmb3guICovXFxuICAtbW96LW9zeC1mb250LXNtb290aGluZzogZ3JheXNjYWxlO1xcblxcbiAgLyogU3VwcG9ydCBmb3IgSUUuICovXFxuICAtd2Via2l0LWZvbnQtZmVhdHVyZS1zZXR0aW5nczogJ2xpZ2EnO1xcbiAgICAgICAgICBmb250LWZlYXR1cmUtc2V0dGluZ3M6ICdsaWdhJztcXG59XFxuXCIsIFwiXCJdKTtcblxuLy8gZXhwb3J0c1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2Nzcy1sb2FkZXIhLi9+L3Bvc3Rjc3MtbG9hZGVyL2xpYj97XCJwbHVnaW5zXCI6W251bGwsbnVsbF19IS4vc3JjL2Fzc2V0cy9pbWcvaWNvbmZvbnQvbWF0ZXJpYWwtaWNvbnMuY3NzXG4vLyBtb2R1bGUgaWQgPSAxMTJcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiZXhwb3J0cyA9IG1vZHVsZS5leHBvcnRzID0gcmVxdWlyZShcIi4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1wiKSh1bmRlZmluZWQpO1xuLy8gaW1wb3J0c1xuXG5cbi8vIG1vZHVsZVxuZXhwb3J0cy5wdXNoKFttb2R1bGUuaWQsIFwiLypcXHJcXG4ub2N0aWNvbiBpcyBvcHRpbWl6ZWQgZm9yIDE2cHguXFxyXFxuLm1lZ2Etb2N0aWNvbiBpcyBvcHRpbWl6ZWQgZm9yIDMycHggYnV0IGNhbiBiZSB1c2VkIGxhcmdlci5cXHJcXG4qL1xcclxcbi5vY3RpY29uLCAubWVnYS1vY3RpY29uIHtcXHJcXG4gIGZvbnQ6IG5vcm1hbCBub3JtYWwgbm9ybWFsIDE2cHgvMSBvY3RpY29ucztcXHJcXG4gIGRpc3BsYXk6IGlubGluZS1ibG9jaztcXHJcXG4gIHRleHQtZGVjb3JhdGlvbjogbm9uZTtcXHJcXG4gIHRleHQtcmVuZGVyaW5nOiBhdXRvO1xcclxcbiAgLXdlYmtpdC1mb250LXNtb290aGluZzogYW50aWFsaWFzZWQ7XFxyXFxuICAtbW96LW9zeC1mb250LXNtb290aGluZzogZ3JheXNjYWxlO1xcclxcbiAgLXdlYmtpdC11c2VyLXNlbGVjdDogbm9uZTtcXHJcXG4gIC1tb3otdXNlci1zZWxlY3Q6IG5vbmU7XFxyXFxuICAtbXMtdXNlci1zZWxlY3Q6IG5vbmU7XFxyXFxuICB1c2VyLXNlbGVjdDogbm9uZTtcXHJcXG59XFxyXFxuLm1lZ2Etb2N0aWNvbiB7IGZvbnQtc2l6ZTogMzJweDsgfVxcclxcblxcclxcbi5vY3RpY29uLWFsZXJ0OmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAyRCd9IC8qIO+ArSAqL1xcclxcbi5vY3RpY29uLWFycm93LWRvd246YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDNGJ30gLyog74C/ICovXFxyXFxuLm9jdGljb24tYXJyb3ctbGVmdDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNDAnfSAvKiDvgYAgKi9cXHJcXG4ub2N0aWNvbi1hcnJvdy1yaWdodDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwM0UnfSAvKiDvgL4gKi9cXHJcXG4ub2N0aWNvbi1hcnJvdy1zbWFsbC1kb3duOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjBBMCd9IC8qIO+CoCAqL1xcclxcbi5vY3RpY29uLWFycm93LXNtYWxsLWxlZnQ6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMEExJ30gLyog74KhICovXFxyXFxuLm9jdGljb24tYXJyb3ctc21hbGwtcmlnaHQ6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDcxJ30gLyog74GxICovXFxyXFxuLm9jdGljb24tYXJyb3ctc21hbGwtdXA6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDlGJ30gLyog74KfICovXFxyXFxuLm9jdGljb24tYXJyb3ctdXA6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDNEJ30gLyog74C9ICovXFxyXFxuLm9jdGljb24tbWljcm9zY29wZTpiZWZvcmUsIC5vY3RpY29uLWJlYWtlcjpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwREQnfSAvKiDvg50gKi9cXHJcXG4ub2N0aWNvbi1iZWxsOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjBERSd9IC8qIO+DniAqL1xcclxcbi5vY3RpY29uLWJvbGQ6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMEUyJ30gLyog74OiICovXFxyXFxuLm9jdGljb24tYm9vazpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMDcnfSAvKiDvgIcgKi9cXHJcXG4ub2N0aWNvbi1ib29rbWFyazpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwN0InfSAvKiDvgbsgKi9cXHJcXG4ub2N0aWNvbi1icmllZmNhc2U6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMEQzJ30gLyog74OTICovXFxyXFxuLm9jdGljb24tYnJvYWRjYXN0OmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA0OCd9IC8qIO+BiCAqL1xcclxcbi5vY3RpY29uLWJyb3dzZXI6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMEM1J30gLyog74OFICovXFxyXFxuLm9jdGljb24tYnVnOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA5MSd9IC8qIO+CkSAqL1xcclxcbi5vY3RpY29uLWNhbGVuZGFyOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA2OCd9IC8qIO+BqCAqL1xcclxcbi5vY3RpY29uLWNoZWNrOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAzQSd9IC8qIO+AuiAqL1xcclxcbi5vY3RpY29uLWNoZWNrbGlzdDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNzYnfSAvKiDvgbYgKi9cXHJcXG4ub2N0aWNvbi1jaGV2cm9uLWRvd246YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMEEzJ30gLyog74KjICovXFxyXFxuLm9jdGljb24tY2hldnJvbi1sZWZ0OmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjBBNCd9IC8qIO+CpCAqL1xcclxcbi5vY3RpY29uLWNoZXZyb24tcmlnaHQ6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDc4J30gLyog74G4ICovXFxyXFxuLm9jdGljb24tY2hldnJvbi11cDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwQTInfSAvKiDvgqIgKi9cXHJcXG4ub2N0aWNvbi1jaXJjbGUtc2xhc2g6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDg0J30gLyog74KEICovXFxyXFxuLm9jdGljb24tY2lyY3VpdC1ib2FyZDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwRDYnfSAvKiDvg5YgKi9cXHJcXG4ub2N0aWNvbi1jbGlwcHk6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDM1J30gLyog74C1ICovXFxyXFxuLm9jdGljb24tY2xvY2s6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDQ2J30gLyog74GGICovXFxyXFxuLm9jdGljb24tY2xvdWQtZG93bmxvYWQ6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDBCJ30gLyog74CLICovXFxyXFxuLm9jdGljb24tY2xvdWQtdXBsb2FkOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAwQyd9IC8qIO+AjCAqL1xcclxcbi5vY3RpY29uLWNvZGU6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDVGJ30gLyog74GfICovXFxyXFxuLm9jdGljb24tY29tbWVudC1hZGQ6YmVmb3JlLCAub2N0aWNvbi1jb21tZW50OmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAyQid9IC8qIO+AqyAqL1xcclxcbi5vY3RpY29uLWNvbW1lbnQtZGlzY3Vzc2lvbjpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNEYnfSAvKiDvgY8gKi9cXHJcXG4ub2N0aWNvbi1jcmVkaXQtY2FyZDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNDUnfSAvKiDvgYUgKi9cXHJcXG4ub2N0aWNvbi1kYXNoOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjBDQSd9IC8qIO+DiiAqL1xcclxcbi5vY3RpY29uLWRhc2hib2FyZDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwN0QnfSAvKiDvgb0gKi9cXHJcXG4ub2N0aWNvbi1kYXRhYmFzZTpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwOTYnfSAvKiDvgpYgKi9cXHJcXG4ub2N0aWNvbi1jbG9uZTpiZWZvcmUsIC5vY3RpY29uLWRlc2t0b3AtZG93bmxvYWQ6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMERDJ30gLyog74OcICovXFxyXFxuLm9jdGljb24tZGV2aWNlLWNhbWVyYTpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNTYnfSAvKiDvgZYgKi9cXHJcXG4ub2N0aWNvbi1kZXZpY2UtY2FtZXJhLXZpZGVvOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA1Nyd9IC8qIO+BlyAqL1xcclxcbi5vY3RpY29uLWRldmljZS1kZXNrdG9wOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjI3Qyd9IC8qIO+JvCAqL1xcclxcbi5vY3RpY29uLWRldmljZS1tb2JpbGU6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDM4J30gLyog74C4ICovXFxyXFxuLm9jdGljb24tZGlmZjpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNEQnfSAvKiDvgY0gKi9cXHJcXG4ub2N0aWNvbi1kaWZmLWFkZGVkOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA2Qid9IC8qIO+BqyAqL1xcclxcbi5vY3RpY29uLWRpZmYtaWdub3JlZDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwOTknfSAvKiDvgpkgKi9cXHJcXG4ub2N0aWNvbi1kaWZmLW1vZGlmaWVkOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA2RCd9IC8qIO+BrSAqL1xcclxcbi5vY3RpY29uLWRpZmYtcmVtb3ZlZDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNkMnfSAvKiDvgawgKi9cXHJcXG4ub2N0aWNvbi1kaWZmLXJlbmFtZWQ6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDZFJ30gLyog74GuICovXFxyXFxuLm9jdGljb24tZWxsaXBzaXM6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDlBJ30gLyog74KaICovXFxyXFxuLm9jdGljb24tZXllLXVud2F0Y2g6YmVmb3JlLCAub2N0aWNvbi1leWUtd2F0Y2g6YmVmb3JlLCAub2N0aWNvbi1leWU6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDRFJ30gLyog74GOICovXFxyXFxuLm9jdGljb24tZmlsZS1iaW5hcnk6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDk0J30gLyog74KUICovXFxyXFxuLm9jdGljb24tZmlsZS1jb2RlOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAxMCd9IC8qIO+AkCAqL1xcclxcbi5vY3RpY29uLWZpbGUtZGlyZWN0b3J5OmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAxNid9IC8qIO+AliAqL1xcclxcbi5vY3RpY29uLWZpbGUtbWVkaWE6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDEyJ30gLyog74CSICovXFxyXFxuLm9jdGljb24tZmlsZS1wZGY6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDE0J30gLyog74CUICovXFxyXFxuLm9jdGljb24tZmlsZS1zdWJtb2R1bGU6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDE3J30gLyog74CXICovXFxyXFxuLm9jdGljb24tZmlsZS1zeW1saW5rLWRpcmVjdG9yeTpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwQjEnfSAvKiDvgrEgKi9cXHJcXG4ub2N0aWNvbi1maWxlLXN5bWxpbmstZmlsZTpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwQjAnfSAvKiDvgrAgKi9cXHJcXG4ub2N0aWNvbi1maWxlLXRleHQ6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDExJ30gLyog74CRICovXFxyXFxuLm9jdGljb24tZmlsZS16aXA6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDEzJ30gLyog74CTICovXFxyXFxuLm9jdGljb24tZmxhbWU6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMEQyJ30gLyog74OSICovXFxyXFxuLm9jdGljb24tZm9sZDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwQ0MnfSAvKiDvg4wgKi9cXHJcXG4ub2N0aWNvbi1nZWFyOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAyRid9IC8qIO+AryAqL1xcclxcbi5vY3RpY29uLWdpZnQ6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDQyJ30gLyog74GCICovXFxyXFxuLm9jdGljb24tZ2lzdDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMEUnfSAvKiDvgI4gKi9cXHJcXG4ub2N0aWNvbi1naXN0LXNlY3JldDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwOEMnfSAvKiDvgowgKi9cXHJcXG4ub2N0aWNvbi1naXQtYnJhbmNoLWNyZWF0ZTpiZWZvcmUsIC5vY3RpY29uLWdpdC1icmFuY2gtZGVsZXRlOmJlZm9yZSwgLm9jdGljb24tZ2l0LWJyYW5jaDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMjAnfSAvKiDvgKAgKi9cXHJcXG4ub2N0aWNvbi1naXQtY29tbWl0OmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAxRid9IC8qIO+AnyAqL1xcclxcbi5vY3RpY29uLWdpdC1jb21wYXJlOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjBBQyd9IC8qIO+CrCAqL1xcclxcbi5vY3RpY29uLWdpdC1tZXJnZTpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMjMnfSAvKiDvgKMgKi9cXHJcXG4ub2N0aWNvbi1naXQtcHVsbC1yZXF1ZXN0LWFiYW5kb25lZDpiZWZvcmUsIC5vY3RpY29uLWdpdC1wdWxsLXJlcXVlc3Q6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDA5J30gLyog74CJICovXFxyXFxuLm9jdGljb24tZ2xvYmU6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMEI2J30gLyog74K2ICovXFxyXFxuLm9jdGljb24tZ3JhcGg6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDQzJ30gLyog74GDICovXFxyXFxuLm9jdGljb24taGVhcnQ6YmVmb3JlIHsgY29udGVudDogJ1xcXFwyNjY1J30gLyog4pmlICovXFxyXFxuLm9jdGljb24taGlzdG9yeTpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwN0UnfSAvKiDvgb4gKi9cXHJcXG4ub2N0aWNvbi1ob21lOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA4RCd9IC8qIO+CjSAqL1xcclxcbi5vY3RpY29uLWhvcml6b250YWwtcnVsZTpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNzAnfSAvKiDvgbAgKi9cXHJcXG4ub2N0aWNvbi1odWJvdDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwOUQnfSAvKiDvgp0gKi9cXHJcXG4ub2N0aWNvbi1pbmJveDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwQ0YnfSAvKiDvg48gKi9cXHJcXG4ub2N0aWNvbi1pbmZvOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA1OSd9IC8qIO+BmSAqL1xcclxcbi5vY3RpY29uLWlzc3VlLWNsb3NlZDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMjgnfSAvKiDvgKggKi9cXHJcXG4ub2N0aWNvbi1pc3N1ZS1vcGVuZWQ6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDI2J30gLyog74CmICovXFxyXFxuLm9jdGljb24taXNzdWUtcmVvcGVuZWQ6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDI3J30gLyog74CnICovXFxyXFxuLm9jdGljb24taXRhbGljOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjBFNCd9IC8qIO+DpCAqL1xcclxcbi5vY3RpY29uLWplcnNleTpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMTknfSAvKiDvgJkgKi9cXHJcXG4ub2N0aWNvbi1rZXk6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDQ5J30gLyog74GJICovXFxyXFxuLm9jdGljb24ta2V5Ym9hcmQ6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDBEJ30gLyog74CNICovXFxyXFxuLm9jdGljb24tbGF3OmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjBEOCd9IC8qIO+DmCAqL1xcclxcbi5vY3RpY29uLWxpZ2h0LWJ1bGI6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDAwJ30gLyog74CAICovXFxyXFxuLm9jdGljb24tbGluazpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNUMnfSAvKiDvgZwgKi9cXHJcXG4ub2N0aWNvbi1saW5rLWV4dGVybmFsOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA3Rid9IC8qIO+BvyAqL1xcclxcbi5vY3RpY29uLWxpc3Qtb3JkZXJlZDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNjInfSAvKiDvgaIgKi9cXHJcXG4ub2N0aWNvbi1saXN0LXVub3JkZXJlZDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNjEnfSAvKiDvgaEgKi9cXHJcXG4ub2N0aWNvbi1sb2NhdGlvbjpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNjAnfSAvKiDvgaAgKi9cXHJcXG4ub2N0aWNvbi1naXN0LXByaXZhdGU6YmVmb3JlLCAub2N0aWNvbi1taXJyb3ItcHJpdmF0ZTpiZWZvcmUsIC5vY3RpY29uLWdpdC1mb3JrLXByaXZhdGU6YmVmb3JlLCAub2N0aWNvbi1sb2NrOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA2QSd9IC8qIO+BqiAqL1xcclxcbi5vY3RpY29uLWxvZ28tZ2lzdDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwQUQnfSAvKiDvgq0gKi9cXHJcXG4ub2N0aWNvbi1sb2dvLWdpdGh1YjpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwOTInfSAvKiDvgpIgKi9cXHJcXG4ub2N0aWNvbi1tYWlsOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAzQid9IC8qIO+AuyAqL1xcclxcbi5vY3RpY29uLW1haWwtcmVhZDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwM0MnfSAvKiDvgLwgKi9cXHJcXG4ub2N0aWNvbi1tYWlsLXJlcGx5OmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA1MSd9IC8qIO+BkSAqL1xcclxcbi5vY3RpY29uLW1hcmstZ2l0aHViOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAwQSd9IC8qIO+AiiAqL1xcclxcbi5vY3RpY29uLW1hcmtkb3duOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjBDOSd9IC8qIO+DiSAqL1xcclxcbi5vY3RpY29uLW1lZ2FwaG9uZTpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNzcnfSAvKiDvgbcgKi9cXHJcXG4ub2N0aWNvbi1tZW50aW9uOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjBCRSd9IC8qIO+CviAqL1xcclxcbi5vY3RpY29uLW1pbGVzdG9uZTpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNzUnfSAvKiDvgbUgKi9cXHJcXG4ub2N0aWNvbi1taXJyb3ItcHVibGljOmJlZm9yZSwgLm9jdGljb24tbWlycm9yOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAyNCd9IC8qIO+ApCAqL1xcclxcbi5vY3RpY29uLW1vcnRhci1ib2FyZDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwRDcnfSAvKiDvg5cgKi9cXHJcXG4ub2N0aWNvbi1tdXRlOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA4MCd9IC8qIO+CgCAqL1xcclxcbi5vY3RpY29uLW5vLW5ld2xpbmU6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDlDJ30gLyog74KcICovXFxyXFxuLm9jdGljb24tb2N0b2ZhY2U6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDA4J30gLyog74CIICovXFxyXFxuLm9jdGljb24tb3JnYW5pemF0aW9uOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAzNyd9IC8qIO+AtyAqL1xcclxcbi5vY3RpY29uLXBhY2thZ2U6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMEM0J30gLyog74OEICovXFxyXFxuLm9jdGljb24tcGFpbnRjYW46YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMEQxJ30gLyog74ORICovXFxyXFxuLm9jdGljb24tcGVuY2lsOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA1OCd9IC8qIO+BmCAqL1xcclxcbi5vY3RpY29uLXBlcnNvbi1hZGQ6YmVmb3JlLCAub2N0aWNvbi1wZXJzb24tZm9sbG93OmJlZm9yZSwgLm9jdGljb24tcGVyc29uOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAxOCd9IC8qIO+AmCAqL1xcclxcbi5vY3RpY29uLXBpbjpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNDEnfSAvKiDvgYEgKi9cXHJcXG4ub2N0aWNvbi1wbHVnOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjBENCd9IC8qIO+DlCAqL1xcclxcbi5vY3RpY29uLXJlcG8tY3JlYXRlOmJlZm9yZSwgLm9jdGljb24tZ2lzdC1uZXc6YmVmb3JlLCAub2N0aWNvbi1maWxlLWRpcmVjdG9yeS1jcmVhdGU6YmVmb3JlLCAub2N0aWNvbi1maWxlLWFkZDpiZWZvcmUsIC5vY3RpY29uLXBsdXM6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDVEJ30gLyog74GdICovXFxyXFxuLm9jdGljb24tcHJpbWl0aXZlLWRvdDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNTInfSAvKiDvgZIgKi9cXHJcXG4ub2N0aWNvbi1wcmltaXRpdmUtc3F1YXJlOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA1Myd9IC8qIO+BkyAqL1xcclxcbi5vY3RpY29uLXB1bHNlOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA4NSd9IC8qIO+ChSAqL1xcclxcbi5vY3RpY29uLXF1ZXN0aW9uOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAyQyd9IC8qIO+ArCAqL1xcclxcbi5vY3RpY29uLXF1b3RlOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA2Myd9IC8qIO+BoyAqL1xcclxcbi5vY3RpY29uLXJhZGlvLXRvd2VyOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAzMCd9IC8qIO+AsCAqL1xcclxcbi5vY3RpY29uLXJlcG8tZGVsZXRlOmJlZm9yZSwgLm9jdGljb24tcmVwbzpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMDEnfSAvKiDvgIEgKi9cXHJcXG4ub2N0aWNvbi1yZXBvLWNsb25lOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA0Qyd9IC8qIO+BjCAqL1xcclxcbi5vY3RpY29uLXJlcG8tZm9yY2UtcHVzaDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNEEnfSAvKiDvgYogKi9cXHJcXG4ub2N0aWNvbi1naXN0LWZvcms6YmVmb3JlLCAub2N0aWNvbi1yZXBvLWZvcmtlZDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMDInfSAvKiDvgIIgKi9cXHJcXG4ub2N0aWNvbi1yZXBvLXB1bGw6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDA2J30gLyog74CGICovXFxyXFxuLm9jdGljb24tcmVwby1wdXNoOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAwNSd9IC8qIO+AhSAqL1xcclxcbi5vY3RpY29uLXJvY2tldDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMzMnfSAvKiDvgLMgKi9cXHJcXG4ub2N0aWNvbi1yc3M6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDM0J30gLyog74C0ICovXFxyXFxuLm9jdGljb24tcnVieTpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNDcnfSAvKiDvgYcgKi9cXHJcXG4ub2N0aWNvbi1zZWFyY2gtc2F2ZTpiZWZvcmUsIC5vY3RpY29uLXNlYXJjaDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMkUnfSAvKiDvgK4gKi9cXHJcXG4ub2N0aWNvbi1zZXJ2ZXI6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDk3J30gLyog74KXICovXFxyXFxuLm9jdGljb24tc2V0dGluZ3M6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDdDJ30gLyog74G8ICovXFxyXFxuLm9jdGljb24tc2hpZWxkOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjBFMSd9IC8qIO+DoSAqL1xcclxcbi5vY3RpY29uLWxvZy1pbjpiZWZvcmUsIC5vY3RpY29uLXNpZ24taW46YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDM2J30gLyog74C2ICovXFxyXFxuLm9jdGljb24tbG9nLW91dDpiZWZvcmUsIC5vY3RpY29uLXNpZ24tb3V0OmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjAzMid9IC8qIO+AsiAqL1xcclxcbi5vY3RpY29uLXNtaWxleTpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwRTcnfSAvKiDvg6cgKi9cXHJcXG4ub2N0aWNvbi1zcXVpcnJlbDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwQjInfSAvKiDvgrIgKi9cXHJcXG4ub2N0aWNvbi1zdGFyLWFkZDpiZWZvcmUsIC5vY3RpY29uLXN0YXItZGVsZXRlOmJlZm9yZSwgLm9jdGljb24tc3RhcjpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMkEnfSAvKiDvgKogKi9cXHJcXG4ub2N0aWNvbi1zdG9wOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA4Rid9IC8qIO+CjyAqL1xcclxcbi5vY3RpY29uLXJlcG8tc3luYzpiZWZvcmUsIC5vY3RpY29uLXN5bmM6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDg3J30gLyog74KHICovXFxyXFxuLm9jdGljb24tdGFnLXJlbW92ZTpiZWZvcmUsIC5vY3RpY29uLXRhZy1hZGQ6YmVmb3JlLCAub2N0aWNvbi10YWc6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDE1J30gLyog74CVICovXFxyXFxuLm9jdGljb24tdGFza2xpc3Q6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMEU1J30gLyog74OlICovXFxyXFxuLm9jdGljb24tdGVsZXNjb3BlOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA4OCd9IC8qIO+CiCAqL1xcclxcbi5vY3RpY29uLXRlcm1pbmFsOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjBDOCd9IC8qIO+DiCAqL1xcclxcbi5vY3RpY29uLXRleHQtc2l6ZTpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwRTMnfSAvKiDvg6MgKi9cXHJcXG4ub2N0aWNvbi10aHJlZS1iYXJzOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA1RSd9IC8qIO+BniAqL1xcclxcbi5vY3RpY29uLXRodW1ic2Rvd246YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMERCJ30gLyog74ObICovXFxyXFxuLm9jdGljb24tdGh1bWJzdXA6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMERBJ30gLyog74OaICovXFxyXFxuLm9jdGljb24tdG9vbHM6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDMxJ30gLyog74CxICovXFxyXFxuLm9jdGljb24tdHJhc2hjYW46YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMEQwJ30gLyog74OQICovXFxyXFxuLm9jdGljb24tdHJpYW5nbGUtZG93bjpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwNUInfSAvKiDvgZsgKi9cXHJcXG4ub2N0aWNvbi10cmlhbmdsZS1sZWZ0OmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA0NCd9IC8qIO+BhCAqL1xcclxcbi5vY3RpY29uLXRyaWFuZ2xlLXJpZ2h0OmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjA1QSd9IC8qIO+BmiAqL1xcclxcbi5vY3RpY29uLXRyaWFuZ2xlLXVwOmJlZm9yZSB7IGNvbnRlbnQ6ICdcXFxcRjBBQSd9IC8qIO+CqiAqL1xcclxcbi5vY3RpY29uLXVuZm9sZDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwMzknfSAvKiDvgLkgKi9cXHJcXG4ub2N0aWNvbi11bm11dGU6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMEJBJ30gLyog74K6ICovXFxyXFxuLm9jdGljb24tdmVyaWZpZWQ6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMEU2J30gLyog74OmICovXFxyXFxuLm9jdGljb24tdmVyc2lvbnM6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMDY0J30gLyog74GkICovXFxyXFxuLm9jdGljb24td2F0Y2g6YmVmb3JlIHsgY29udGVudDogJ1xcXFxGMEUwJ30gLyog74OgICovXFxyXFxuLm9jdGljb24tcmVtb3ZlLWNsb3NlOmJlZm9yZSwgLm9jdGljb24teDpiZWZvcmUgeyBjb250ZW50OiAnXFxcXEYwODEnfSAvKiDvgoEgKi9cXHJcXG4ub2N0aWNvbi16YXA6YmVmb3JlIHsgY29udGVudDogJ1xcXFwyNkExJ30gLyog4pqhICovXFxyXFxuXFxyXFxuXFxyXFxuXCIsIFwiXCJdKTtcblxuLy8gZXhwb3J0c1xuXG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9+L2Nzcy1sb2FkZXIhLi9+L3Bvc3Rjc3MtbG9hZGVyL2xpYj97XCJwbHVnaW5zXCI6W251bGwsbnVsbF19IS4vc3JjL2Fzc2V0cy9pbWcvb2N0aWNvbi9vY3RpY29uLmNzc1xuLy8gbW9kdWxlIGlkID0gMTEzXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIm1vZHVsZS5leHBvcnRzID0gX193ZWJwYWNrX3B1YmxpY19wYXRoX18gKyBcImltZy9NYXRlcmlhbEljb25zLVJlZ3VsYXIuZW90XCI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvYXNzZXRzL2ltZy9pY29uZm9udC9NYXRlcmlhbEljb25zLVJlZ3VsYXIuZW90XG4vLyBtb2R1bGUgaWQgPSAxMTRcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyArIFwiaW1nL01hdGVyaWFsSWNvbnMtUmVndWxhci50dGZcIjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9hc3NldHMvaW1nL2ljb25mb250L01hdGVyaWFsSWNvbnMtUmVndWxhci50dGZcbi8vIG1vZHVsZSBpZCA9IDExNVxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IF9fd2VicGFja19wdWJsaWNfcGF0aF9fICsgXCJpbWcvTWF0ZXJpYWxJY29ucy1SZWd1bGFyLndvZmZcIjtcblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9hc3NldHMvaW1nL2ljb25mb250L01hdGVyaWFsSWNvbnMtUmVndWxhci53b2ZmXG4vLyBtb2R1bGUgaWQgPSAxMTZcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyArIFwiaW1nL01hdGVyaWFsSWNvbnMtUmVndWxhci53b2ZmMlwiO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2Fzc2V0cy9pbWcvaWNvbmZvbnQvTWF0ZXJpYWxJY29ucy1SZWd1bGFyLndvZmYyXG4vLyBtb2R1bGUgaWQgPSAxMTdcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyArIFwiaW1nL29jdGljb25zLnR0ZlwiO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2Fzc2V0cy9pbWcvb2N0aWNvbi9vY3RpY29ucy50dGZcbi8vIG1vZHVsZSBpZCA9IDExOFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IF9fd2VicGFja19wdWJsaWNfcGF0aF9fICsgXCJpbWcvb2N0aWNvbnMud29mZlwiO1xuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2Fzc2V0cy9pbWcvb2N0aWNvbi9vY3RpY29ucy53b2ZmXG4vLyBtb2R1bGUgaWQgPSAxMTlcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwibW9kdWxlLmV4cG9ydHMgPSBfX3dlYnBhY2tfcHVibGljX3BhdGhfXyArIFwiaW1nL3JvYm90by12MTUtbGF0aW4tcmVndWxhci53b2ZmXCI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvYXNzZXRzL2ltZy9yb2JvdG8vcm9ib3RvLXYxNS1sYXRpbi1yZWd1bGFyLndvZmZcbi8vIG1vZHVsZSBpZCA9IDEyMFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCJtb2R1bGUuZXhwb3J0cyA9IF9fd2VicGFja19wdWJsaWNfcGF0aF9fICsgXCJpbWcvcm9ib3RvLXYxNS1sYXRpbi1yZWd1bGFyLndvZmYyXCI7XG5cblxuLy8vLy8vLy8vLy8vLy8vLy8vXG4vLyBXRUJQQUNLIEZPT1RFUlxuLy8gLi9zcmMvYXNzZXRzL2ltZy9yb2JvdG8vcm9ib3RvLXYxNS1sYXRpbi1yZWd1bGFyLndvZmYyXG4vLyBtb2R1bGUgaWQgPSAxMjFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiaW1wb3J0IHsgSnNvblNlcnZpY2VDbGllbnQsIHNhbml0aXplIH0gZnJvbSAnc2VydmljZXN0YWNrLWNsaWVudCc7XHJcblxyXG5kZWNsYXJlIHZhciBnbG9iYWw7IC8vcG9wdWxhdGVkIGZyb20gcGFja2FnZS5qc29uL2plc3RcclxuXHJcbmV4cG9ydCB2YXIgQmFzZVBhdGggPSBsb2NhdGlvbi5wYXRobmFtZS5zdWJzdHJpbmcoMCwgbG9jYXRpb24ucGF0aG5hbWUuaW5kZXhPZihcIi9zc19hZG1pblwiKSArIDEpO1xyXG5cclxuZXhwb3J0IHZhciBjbGllbnQgPSBuZXcgSnNvblNlcnZpY2VDbGllbnQoZ2xvYmFsLkJhc2VVcmwgfHwgQmFzZVBhdGgpO1xyXG5cclxuZXhwb3J0IGNvbnN0IG5vcm1hbGl6ZUtleSA9IChrZXk6IHN0cmluZykgPT4ga2V5LnRvTG93ZXJDYXNlKCkucmVwbGFjZSgvXy9nLCAnJyk7XHJcblxyXG5jb25zdCBpc0FycmF5ID0gKG86IGFueSkgPT4gT2JqZWN0LnByb3RvdHlwZS50b1N0cmluZy5jYWxsKG8pID09PSAnW29iamVjdCBBcnJheV0nO1xyXG5cclxuY29uc3QgbG9nID0gKG86IGFueSkgPT4geyBjb25zb2xlLmxvZyhvLCB0eXBlb2YobykpOyByZXR1cm4gbzsgfVxyXG5cclxuZXhwb3J0IGNvbnN0IG5vcm1hbGl6ZSA9IChkdG86IGFueSwgZGVlcD86IGJvb2xlYW4pID0+IHtcclxuICAgIGlmIChkdG8gPT0gbnVsbClcclxuICAgICAgICByZXR1cm4gZHRvO1xyXG4gICAgaWYgKGlzQXJyYXkoZHRvKSkge1xyXG4gICAgICAgIGlmICghZGVlcCkgcmV0dXJuIGR0bztcclxuICAgICAgICBjb25zdCB0byA9IFtdO1xyXG4gICAgICAgIGZvciAobGV0IGkgPSAwOyBpIDwgZHRvLmxlbmd0aDsgaSsrKSB7XHJcbiAgICAgICAgICAgIHRvW2ldID0gbm9ybWFsaXplKGR0b1tpXSwgZGVlcCk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiB0bztcclxuICAgIH1cclxuICAgIGlmICh0eXBlb2YgZHRvICE9IFwib2JqZWN0XCIpIHJldHVybiBkdG87XHJcbiAgICB2YXIgbyA9IHt9O1xyXG4gICAgZm9yIChsZXQgayBpbiBkdG8pIHtcclxuICAgICAgICBvW25vcm1hbGl6ZUtleShrKV0gPSBkZWVwID8gbm9ybWFsaXplKGR0b1trXSwgZGVlcCkgOiBkdG9ba107XHJcbiAgICB9XHJcbiAgICByZXR1cm4gbztcclxufVxyXG5cclxuZXhwb3J0IGNvbnN0IGdldEZpZWxkID0gKG86IGFueSwgbmFtZTogc3RyaW5nKSA9PlxyXG4gICAgbyA9PSBudWxsIHx8IG5hbWUgPT0gbnVsbCA/IG51bGwgOlxyXG4gICAgICAgIG9bbmFtZV0gfHxcclxuICAgICAgICBvW09iamVjdC5rZXlzKG8pLmZpbHRlcihrID0+IG5vcm1hbGl6ZUtleShrKSA9PT0gbm9ybWFsaXplS2V5KG5hbWUpKVswXSB8fCAnJ107XHJcblxyXG5leHBvcnQgY29uc3QgcGFyc2VSZXNwb25zZVN0YXR1cyA9IChqc29uLCBkZWZhdWx0TXNnPW51bGwpID0+IHtcclxuICAgIHRyeSB7XHJcbiAgICAgICAgdmFyIGVyciA9IEpTT04ucGFyc2UoanNvbik7XHJcbiAgICAgICAgcmV0dXJuIHNhbml0aXplKGVyci5SZXNwb25zZVN0YXR1cyB8fCBlcnIucmVzcG9uc2VTdGF0dXMpO1xyXG4gICAgfSBjYXRjaCAoZSkge1xyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIG1lc3NhZ2U6IGRlZmF1bHRNc2csXHJcbiAgICAgICAgICAgIF9fZXJyb3I6IHsgZXJyb3I6IGUsIGpzb246IGpzb24gfVxyXG4gICAgICAgIH07XHJcbiAgICB9XHJcbn07XG5cblxuLy8gV0VCUEFDSyBGT09URVIgLy9cbi8vIC4vc3JjL3NoYXJlZC50c3giLCJcbi8qKlxuICogV2hlbiBzb3VyY2UgbWFwcyBhcmUgZW5hYmxlZCwgYHN0eWxlLWxvYWRlcmAgdXNlcyBhIGxpbmsgZWxlbWVudCB3aXRoIGEgZGF0YS11cmkgdG9cbiAqIGVtYmVkIHRoZSBjc3Mgb24gdGhlIHBhZ2UuIFRoaXMgYnJlYWtzIGFsbCByZWxhdGl2ZSB1cmxzIGJlY2F1c2Ugbm93IHRoZXkgYXJlIHJlbGF0aXZlIHRvIGFcbiAqIGJ1bmRsZSBpbnN0ZWFkIG9mIHRoZSBjdXJyZW50IHBhZ2UuXG4gKlxuICogT25lIHNvbHV0aW9uIGlzIHRvIG9ubHkgdXNlIGZ1bGwgdXJscywgYnV0IHRoYXQgbWF5IGJlIGltcG9zc2libGUuXG4gKlxuICogSW5zdGVhZCwgdGhpcyBmdW5jdGlvbiBcImZpeGVzXCIgdGhlIHJlbGF0aXZlIHVybHMgdG8gYmUgYWJzb2x1dGUgYWNjb3JkaW5nIHRvIHRoZSBjdXJyZW50IHBhZ2UgbG9jYXRpb24uXG4gKlxuICogQSBydWRpbWVudGFyeSB0ZXN0IHN1aXRlIGlzIGxvY2F0ZWQgYXQgYHRlc3QvZml4VXJscy5qc2AgYW5kIGNhbiBiZSBydW4gdmlhIHRoZSBgbnBtIHRlc3RgIGNvbW1hbmQuXG4gKlxuICovXG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24gKGNzcykge1xuICAvLyBnZXQgY3VycmVudCBsb2NhdGlvblxuICB2YXIgbG9jYXRpb24gPSB0eXBlb2Ygd2luZG93ICE9PSBcInVuZGVmaW5lZFwiICYmIHdpbmRvdy5sb2NhdGlvbjtcblxuICBpZiAoIWxvY2F0aW9uKSB7XG4gICAgdGhyb3cgbmV3IEVycm9yKFwiZml4VXJscyByZXF1aXJlcyB3aW5kb3cubG9jYXRpb25cIik7XG4gIH1cblxuXHQvLyBibGFuayBvciBudWxsP1xuXHRpZiAoIWNzcyB8fCB0eXBlb2YgY3NzICE9PSBcInN0cmluZ1wiKSB7XG5cdCAgcmV0dXJuIGNzcztcbiAgfVxuXG4gIHZhciBiYXNlVXJsID0gbG9jYXRpb24ucHJvdG9jb2wgKyBcIi8vXCIgKyBsb2NhdGlvbi5ob3N0O1xuICB2YXIgY3VycmVudERpciA9IGJhc2VVcmwgKyBsb2NhdGlvbi5wYXRobmFtZS5yZXBsYWNlKC9cXC9bXlxcL10qJC8sIFwiL1wiKTtcblxuXHQvLyBjb252ZXJ0IGVhY2ggdXJsKC4uLilcblx0Lypcblx0VGhpcyByZWd1bGFyIGV4cHJlc3Npb24gaXMganVzdCBhIHdheSB0byByZWN1cnNpdmVseSBtYXRjaCBicmFja2V0cyB3aXRoaW5cblx0YSBzdHJpbmcuXG5cblx0IC91cmxcXHMqXFwoICA9IE1hdGNoIG9uIHRoZSB3b3JkIFwidXJsXCIgd2l0aCBhbnkgd2hpdGVzcGFjZSBhZnRlciBpdCBhbmQgdGhlbiBhIHBhcmVuc1xuXHQgICAoICA9IFN0YXJ0IGEgY2FwdHVyaW5nIGdyb3VwXG5cdCAgICAgKD86ICA9IFN0YXJ0IGEgbm9uLWNhcHR1cmluZyBncm91cFxuXHQgICAgICAgICBbXikoXSAgPSBNYXRjaCBhbnl0aGluZyB0aGF0IGlzbid0IGEgcGFyZW50aGVzZXNcblx0ICAgICAgICAgfCAgPSBPUlxuXHQgICAgICAgICBcXCggID0gTWF0Y2ggYSBzdGFydCBwYXJlbnRoZXNlc1xuXHQgICAgICAgICAgICAgKD86ICA9IFN0YXJ0IGFub3RoZXIgbm9uLWNhcHR1cmluZyBncm91cHNcblx0ICAgICAgICAgICAgICAgICBbXikoXSsgID0gTWF0Y2ggYW55dGhpbmcgdGhhdCBpc24ndCBhIHBhcmVudGhlc2VzXG5cdCAgICAgICAgICAgICAgICAgfCAgPSBPUlxuXHQgICAgICAgICAgICAgICAgIFxcKCAgPSBNYXRjaCBhIHN0YXJ0IHBhcmVudGhlc2VzXG5cdCAgICAgICAgICAgICAgICAgICAgIFteKShdKiAgPSBNYXRjaCBhbnl0aGluZyB0aGF0IGlzbid0IGEgcGFyZW50aGVzZXNcblx0ICAgICAgICAgICAgICAgICBcXCkgID0gTWF0Y2ggYSBlbmQgcGFyZW50aGVzZXNcblx0ICAgICAgICAgICAgICkgID0gRW5kIEdyb3VwXG4gICAgICAgICAgICAgICpcXCkgPSBNYXRjaCBhbnl0aGluZyBhbmQgdGhlbiBhIGNsb3NlIHBhcmVuc1xuICAgICAgICAgICkgID0gQ2xvc2Ugbm9uLWNhcHR1cmluZyBncm91cFxuICAgICAgICAgICogID0gTWF0Y2ggYW55dGhpbmdcbiAgICAgICApICA9IENsb3NlIGNhcHR1cmluZyBncm91cFxuXHQgXFwpICA9IE1hdGNoIGEgY2xvc2UgcGFyZW5zXG5cblx0IC9naSAgPSBHZXQgYWxsIG1hdGNoZXMsIG5vdCB0aGUgZmlyc3QuICBCZSBjYXNlIGluc2Vuc2l0aXZlLlxuXHQgKi9cblx0dmFyIGZpeGVkQ3NzID0gY3NzLnJlcGxhY2UoL3VybFxccypcXCgoKD86W14pKF18XFwoKD86W14pKF0rfFxcKFteKShdKlxcKSkqXFwpKSopXFwpL2dpLCBmdW5jdGlvbihmdWxsTWF0Y2gsIG9yaWdVcmwpIHtcblx0XHQvLyBzdHJpcCBxdW90ZXMgKGlmIHRoZXkgZXhpc3QpXG5cdFx0dmFyIHVucXVvdGVkT3JpZ1VybCA9IG9yaWdVcmxcblx0XHRcdC50cmltKClcblx0XHRcdC5yZXBsYWNlKC9eXCIoLiopXCIkLywgZnVuY3Rpb24obywgJDEpeyByZXR1cm4gJDE7IH0pXG5cdFx0XHQucmVwbGFjZSgvXicoLiopJyQvLCBmdW5jdGlvbihvLCAkMSl7IHJldHVybiAkMTsgfSk7XG5cblx0XHQvLyBhbHJlYWR5IGEgZnVsbCB1cmw/IG5vIGNoYW5nZVxuXHRcdGlmICgvXigjfGRhdGE6fGh0dHA6XFwvXFwvfGh0dHBzOlxcL1xcL3xmaWxlOlxcL1xcL1xcLykvaS50ZXN0KHVucXVvdGVkT3JpZ1VybCkpIHtcblx0XHQgIHJldHVybiBmdWxsTWF0Y2g7XG5cdFx0fVxuXG5cdFx0Ly8gY29udmVydCB0aGUgdXJsIHRvIGEgZnVsbCB1cmxcblx0XHR2YXIgbmV3VXJsO1xuXG5cdFx0aWYgKHVucXVvdGVkT3JpZ1VybC5pbmRleE9mKFwiLy9cIikgPT09IDApIHtcblx0XHQgIFx0Ly9UT0RPOiBzaG91bGQgd2UgYWRkIHByb3RvY29sP1xuXHRcdFx0bmV3VXJsID0gdW5xdW90ZWRPcmlnVXJsO1xuXHRcdH0gZWxzZSBpZiAodW5xdW90ZWRPcmlnVXJsLmluZGV4T2YoXCIvXCIpID09PSAwKSB7XG5cdFx0XHQvLyBwYXRoIHNob3VsZCBiZSByZWxhdGl2ZSB0byB0aGUgYmFzZSB1cmxcblx0XHRcdG5ld1VybCA9IGJhc2VVcmwgKyB1bnF1b3RlZE9yaWdVcmw7IC8vIGFscmVhZHkgc3RhcnRzIHdpdGggJy8nXG5cdFx0fSBlbHNlIHtcblx0XHRcdC8vIHBhdGggc2hvdWxkIGJlIHJlbGF0aXZlIHRvIGN1cnJlbnQgZGlyZWN0b3J5XG5cdFx0XHRuZXdVcmwgPSBjdXJyZW50RGlyICsgdW5xdW90ZWRPcmlnVXJsLnJlcGxhY2UoL15cXC5cXC8vLCBcIlwiKTsgLy8gU3RyaXAgbGVhZGluZyAnLi8nXG5cdFx0fVxuXG5cdFx0Ly8gc2VuZCBiYWNrIHRoZSBmaXhlZCB1cmwoLi4uKVxuXHRcdHJldHVybiBcInVybChcIiArIEpTT04uc3RyaW5naWZ5KG5ld1VybCkgKyBcIilcIjtcblx0fSk7XG5cblx0Ly8gc2VuZCBiYWNrIHRoZSBmaXhlZCBjc3Ncblx0cmV0dXJuIGZpeGVkQ3NzO1xufTtcblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9zdHlsZS1sb2FkZXIvZml4VXJscy5qc1xuLy8gbW9kdWxlIGlkID0gMjUxXG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIHN0eWxlLWxvYWRlcjogQWRkcyBzb21lIGNzcyB0byB0aGUgRE9NIGJ5IGFkZGluZyBhIDxzdHlsZT4gdGFnXG5cbi8vIGxvYWQgdGhlIHN0eWxlc1xudmFyIGNvbnRlbnQgPSByZXF1aXJlKFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvbGliL2luZGV4LmpzPz9yZWYtLTUtMiEuL2FwcC5jc3NcIik7XG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcbi8vIFByZXBhcmUgY3NzVHJhbnNmb3JtYXRpb25cbnZhciB0cmFuc2Zvcm07XG5cbnZhciBvcHRpb25zID0ge31cbm9wdGlvbnMudHJhbnNmb3JtID0gdHJhbnNmb3JtXG4vLyBhZGQgdGhlIHN0eWxlcyB0byB0aGUgRE9NXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2FkZFN0eWxlcy5qc1wiKShjb250ZW50LCBvcHRpb25zKTtcbmlmKGNvbnRlbnQubG9jYWxzKSBtb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzO1xuLy8gSG90IE1vZHVsZSBSZXBsYWNlbWVudFxuaWYobW9kdWxlLmhvdCkge1xuXHQvLyBXaGVuIHRoZSBzdHlsZXMgY2hhbmdlLCB1cGRhdGUgdGhlIDxzdHlsZT4gdGFnc1xuXHRpZighY29udGVudC5sb2NhbHMpIHtcblx0XHRtb2R1bGUuaG90LmFjY2VwdChcIiEhLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2xpYi9pbmRleC5qcz8/cmVmLS01LTIhLi9hcHAuY3NzXCIsIGZ1bmN0aW9uKCkge1xuXHRcdFx0dmFyIG5ld0NvbnRlbnQgPSByZXF1aXJlKFwiISEuLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvbGliL2luZGV4LmpzPz9yZWYtLTUtMiEuL2FwcC5jc3NcIik7XG5cdFx0XHRpZih0eXBlb2YgbmV3Q29udGVudCA9PT0gJ3N0cmluZycpIG5ld0NvbnRlbnQgPSBbW21vZHVsZS5pZCwgbmV3Q29udGVudCwgJyddXTtcblx0XHRcdHVwZGF0ZShuZXdDb250ZW50KTtcblx0XHR9KTtcblx0fVxuXHQvLyBXaGVuIHRoZSBtb2R1bGUgaXMgZGlzcG9zZWQsIHJlbW92ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdG1vZHVsZS5ob3QuZGlzcG9zZShmdW5jdGlvbigpIHsgdXBkYXRlKCk7IH0pO1xufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2FwcC5jc3Ncbi8vIG1vZHVsZSBpZCA9IDI1NFxuLy8gbW9kdWxlIGNodW5rcyA9IDAiLCIvLyBzdHlsZS1sb2FkZXI6IEFkZHMgc29tZSBjc3MgdG8gdGhlIERPTSBieSBhZGRpbmcgYSA8c3R5bGU+IHRhZ1xuXG4vLyBsb2FkIHRoZSBzdHlsZXNcbnZhciBjb250ZW50ID0gcmVxdWlyZShcIiEhLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2xpYi9pbmRleC5qcz8/cmVmLS01LTIhLi9tYXRlcmlhbC1pY29ucy5jc3NcIik7XG5pZih0eXBlb2YgY29udGVudCA9PT0gJ3N0cmluZycpIGNvbnRlbnQgPSBbW21vZHVsZS5pZCwgY29udGVudCwgJyddXTtcbi8vIFByZXBhcmUgY3NzVHJhbnNmb3JtYXRpb25cbnZhciB0cmFuc2Zvcm07XG5cbnZhciBvcHRpb25zID0ge31cbm9wdGlvbnMudHJhbnNmb3JtID0gdHJhbnNmb3JtXG4vLyBhZGQgdGhlIHN0eWxlcyB0byB0aGUgRE9NXG52YXIgdXBkYXRlID0gcmVxdWlyZShcIiEuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvc3R5bGUtbG9hZGVyL2FkZFN0eWxlcy5qc1wiKShjb250ZW50LCBvcHRpb25zKTtcbmlmKGNvbnRlbnQubG9jYWxzKSBtb2R1bGUuZXhwb3J0cyA9IGNvbnRlbnQubG9jYWxzO1xuLy8gSG90IE1vZHVsZSBSZXBsYWNlbWVudFxuaWYobW9kdWxlLmhvdCkge1xuXHQvLyBXaGVuIHRoZSBzdHlsZXMgY2hhbmdlLCB1cGRhdGUgdGhlIDxzdHlsZT4gdGFnc1xuXHRpZighY29udGVudC5sb2NhbHMpIHtcblx0XHRtb2R1bGUuaG90LmFjY2VwdChcIiEhLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL2Nzcy1sb2FkZXIvaW5kZXguanMhLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3Bvc3Rjc3MtbG9hZGVyL2xpYi9pbmRleC5qcz8/cmVmLS01LTIhLi9tYXRlcmlhbC1pY29ucy5jc3NcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgbmV3Q29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzIS4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9saWIvaW5kZXguanM/P3JlZi0tNS0yIS4vbWF0ZXJpYWwtaWNvbnMuY3NzXCIpO1xuXHRcdFx0aWYodHlwZW9mIG5ld0NvbnRlbnQgPT09ICdzdHJpbmcnKSBuZXdDb250ZW50ID0gW1ttb2R1bGUuaWQsIG5ld0NvbnRlbnQsICcnXV07XG5cdFx0XHR1cGRhdGUobmV3Q29udGVudCk7XG5cdFx0fSk7XG5cdH1cblx0Ly8gV2hlbiB0aGUgbW9kdWxlIGlzIGRpc3Bvc2VkLCByZW1vdmUgdGhlIDxzdHlsZT4gdGFnc1xuXHRtb2R1bGUuaG90LmRpc3Bvc2UoZnVuY3Rpb24oKSB7IHVwZGF0ZSgpOyB9KTtcbn1cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL3NyYy9hc3NldHMvaW1nL2ljb25mb250L21hdGVyaWFsLWljb25zLmNzc1xuLy8gbW9kdWxlIGlkID0gMjU1XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8vIHN0eWxlLWxvYWRlcjogQWRkcyBzb21lIGNzcyB0byB0aGUgRE9NIGJ5IGFkZGluZyBhIDxzdHlsZT4gdGFnXG5cbi8vIGxvYWQgdGhlIHN0eWxlc1xudmFyIGNvbnRlbnQgPSByZXF1aXJlKFwiISEuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvY3NzLWxvYWRlci9pbmRleC5qcyEuLi8uLi8uLi8uLi9ub2RlX21vZHVsZXMvcG9zdGNzcy1sb2FkZXIvbGliL2luZGV4LmpzPz9yZWYtLTUtMiEuL29jdGljb24uY3NzXCIpO1xuaWYodHlwZW9mIGNvbnRlbnQgPT09ICdzdHJpbmcnKSBjb250ZW50ID0gW1ttb2R1bGUuaWQsIGNvbnRlbnQsICcnXV07XG4vLyBQcmVwYXJlIGNzc1RyYW5zZm9ybWF0aW9uXG52YXIgdHJhbnNmb3JtO1xuXG52YXIgb3B0aW9ucyA9IHt9XG5vcHRpb25zLnRyYW5zZm9ybSA9IHRyYW5zZm9ybVxuLy8gYWRkIHRoZSBzdHlsZXMgdG8gdGhlIERPTVxudmFyIHVwZGF0ZSA9IHJlcXVpcmUoXCIhLi4vLi4vLi4vLi4vbm9kZV9tb2R1bGVzL3N0eWxlLWxvYWRlci9hZGRTdHlsZXMuanNcIikoY29udGVudCwgb3B0aW9ucyk7XG5pZihjb250ZW50LmxvY2FscykgbW9kdWxlLmV4cG9ydHMgPSBjb250ZW50LmxvY2Fscztcbi8vIEhvdCBNb2R1bGUgUmVwbGFjZW1lbnRcbmlmKG1vZHVsZS5ob3QpIHtcblx0Ly8gV2hlbiB0aGUgc3R5bGVzIGNoYW5nZSwgdXBkYXRlIHRoZSA8c3R5bGU+IHRhZ3Ncblx0aWYoIWNvbnRlbnQubG9jYWxzKSB7XG5cdFx0bW9kdWxlLmhvdC5hY2NlcHQoXCIhIS4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzIS4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9saWIvaW5kZXguanM/P3JlZi0tNS0yIS4vb2N0aWNvbi5jc3NcIiwgZnVuY3Rpb24oKSB7XG5cdFx0XHR2YXIgbmV3Q29udGVudCA9IHJlcXVpcmUoXCIhIS4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9jc3MtbG9hZGVyL2luZGV4LmpzIS4uLy4uLy4uLy4uL25vZGVfbW9kdWxlcy9wb3N0Y3NzLWxvYWRlci9saWIvaW5kZXguanM/P3JlZi0tNS0yIS4vb2N0aWNvbi5jc3NcIik7XG5cdFx0XHRpZih0eXBlb2YgbmV3Q29udGVudCA9PT0gJ3N0cmluZycpIG5ld0NvbnRlbnQgPSBbW21vZHVsZS5pZCwgbmV3Q29udGVudCwgJyddXTtcblx0XHRcdHVwZGF0ZShuZXdDb250ZW50KTtcblx0XHR9KTtcblx0fVxuXHQvLyBXaGVuIHRoZSBtb2R1bGUgaXMgZGlzcG9zZWQsIHJlbW92ZSB0aGUgPHN0eWxlPiB0YWdzXG5cdG1vZHVsZS5ob3QuZGlzcG9zZShmdW5jdGlvbigpIHsgdXBkYXRlKCk7IH0pO1xufVxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vc3JjL2Fzc2V0cy9pbWcvb2N0aWNvbi9vY3RpY29uLmNzc1xuLy8gbW9kdWxlIGlkID0gMjU2XG4vLyBtb2R1bGUgY2h1bmtzID0gMCIsIi8qXG5cdE1JVCBMaWNlbnNlIGh0dHA6Ly93d3cub3BlbnNvdXJjZS5vcmcvbGljZW5zZXMvbWl0LWxpY2Vuc2UucGhwXG5cdEF1dGhvciBUb2JpYXMgS29wcGVycyBAc29rcmFcbiovXG4vLyBjc3MgYmFzZSBjb2RlLCBpbmplY3RlZCBieSB0aGUgY3NzLWxvYWRlclxubW9kdWxlLmV4cG9ydHMgPSBmdW5jdGlvbih1c2VTb3VyY2VNYXApIHtcblx0dmFyIGxpc3QgPSBbXTtcblxuXHQvLyByZXR1cm4gdGhlIGxpc3Qgb2YgbW9kdWxlcyBhcyBjc3Mgc3RyaW5nXG5cdGxpc3QudG9TdHJpbmcgPSBmdW5jdGlvbiB0b1N0cmluZygpIHtcblx0XHRyZXR1cm4gdGhpcy5tYXAoZnVuY3Rpb24gKGl0ZW0pIHtcblx0XHRcdHZhciBjb250ZW50ID0gY3NzV2l0aE1hcHBpbmdUb1N0cmluZyhpdGVtLCB1c2VTb3VyY2VNYXApO1xuXHRcdFx0aWYoaXRlbVsyXSkge1xuXHRcdFx0XHRyZXR1cm4gXCJAbWVkaWEgXCIgKyBpdGVtWzJdICsgXCJ7XCIgKyBjb250ZW50ICsgXCJ9XCI7XG5cdFx0XHR9IGVsc2Uge1xuXHRcdFx0XHRyZXR1cm4gY29udGVudDtcblx0XHRcdH1cblx0XHR9KS5qb2luKFwiXCIpO1xuXHR9O1xuXG5cdC8vIGltcG9ydCBhIGxpc3Qgb2YgbW9kdWxlcyBpbnRvIHRoZSBsaXN0XG5cdGxpc3QuaSA9IGZ1bmN0aW9uKG1vZHVsZXMsIG1lZGlhUXVlcnkpIHtcblx0XHRpZih0eXBlb2YgbW9kdWxlcyA9PT0gXCJzdHJpbmdcIilcblx0XHRcdG1vZHVsZXMgPSBbW251bGwsIG1vZHVsZXMsIFwiXCJdXTtcblx0XHR2YXIgYWxyZWFkeUltcG9ydGVkTW9kdWxlcyA9IHt9O1xuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCB0aGlzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgaWQgPSB0aGlzW2ldWzBdO1xuXHRcdFx0aWYodHlwZW9mIGlkID09PSBcIm51bWJlclwiKVxuXHRcdFx0XHRhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2lkXSA9IHRydWU7XG5cdFx0fVxuXHRcdGZvcihpID0gMDsgaSA8IG1vZHVsZXMubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBpdGVtID0gbW9kdWxlc1tpXTtcblx0XHRcdC8vIHNraXAgYWxyZWFkeSBpbXBvcnRlZCBtb2R1bGVcblx0XHRcdC8vIHRoaXMgaW1wbGVtZW50YXRpb24gaXMgbm90IDEwMCUgcGVyZmVjdCBmb3Igd2VpcmQgbWVkaWEgcXVlcnkgY29tYmluYXRpb25zXG5cdFx0XHQvLyAgd2hlbiBhIG1vZHVsZSBpcyBpbXBvcnRlZCBtdWx0aXBsZSB0aW1lcyB3aXRoIGRpZmZlcmVudCBtZWRpYSBxdWVyaWVzLlxuXHRcdFx0Ly8gIEkgaG9wZSB0aGlzIHdpbGwgbmV2ZXIgb2NjdXIgKEhleSB0aGlzIHdheSB3ZSBoYXZlIHNtYWxsZXIgYnVuZGxlcylcblx0XHRcdGlmKHR5cGVvZiBpdGVtWzBdICE9PSBcIm51bWJlclwiIHx8ICFhbHJlYWR5SW1wb3J0ZWRNb2R1bGVzW2l0ZW1bMF1dKSB7XG5cdFx0XHRcdGlmKG1lZGlhUXVlcnkgJiYgIWl0ZW1bMl0pIHtcblx0XHRcdFx0XHRpdGVtWzJdID0gbWVkaWFRdWVyeTtcblx0XHRcdFx0fSBlbHNlIGlmKG1lZGlhUXVlcnkpIHtcblx0XHRcdFx0XHRpdGVtWzJdID0gXCIoXCIgKyBpdGVtWzJdICsgXCIpIGFuZCAoXCIgKyBtZWRpYVF1ZXJ5ICsgXCIpXCI7XG5cdFx0XHRcdH1cblx0XHRcdFx0bGlzdC5wdXNoKGl0ZW0pO1xuXHRcdFx0fVxuXHRcdH1cblx0fTtcblx0cmV0dXJuIGxpc3Q7XG59O1xuXG5mdW5jdGlvbiBjc3NXaXRoTWFwcGluZ1RvU3RyaW5nKGl0ZW0sIHVzZVNvdXJjZU1hcCkge1xuXHR2YXIgY29udGVudCA9IGl0ZW1bMV0gfHwgJyc7XG5cdHZhciBjc3NNYXBwaW5nID0gaXRlbVszXTtcblx0aWYgKCFjc3NNYXBwaW5nKSB7XG5cdFx0cmV0dXJuIGNvbnRlbnQ7XG5cdH1cblxuXHRpZiAodXNlU291cmNlTWFwICYmIHR5cGVvZiBidG9hID09PSAnZnVuY3Rpb24nKSB7XG5cdFx0dmFyIHNvdXJjZU1hcHBpbmcgPSB0b0NvbW1lbnQoY3NzTWFwcGluZyk7XG5cdFx0dmFyIHNvdXJjZVVSTHMgPSBjc3NNYXBwaW5nLnNvdXJjZXMubWFwKGZ1bmN0aW9uIChzb3VyY2UpIHtcblx0XHRcdHJldHVybiAnLyojIHNvdXJjZVVSTD0nICsgY3NzTWFwcGluZy5zb3VyY2VSb290ICsgc291cmNlICsgJyAqLydcblx0XHR9KTtcblxuXHRcdHJldHVybiBbY29udGVudF0uY29uY2F0KHNvdXJjZVVSTHMpLmNvbmNhdChbc291cmNlTWFwcGluZ10pLmpvaW4oJ1xcbicpO1xuXHR9XG5cblx0cmV0dXJuIFtjb250ZW50XS5qb2luKCdcXG4nKTtcbn1cblxuLy8gQWRhcHRlZCBmcm9tIGNvbnZlcnQtc291cmNlLW1hcCAoTUlUKVxuZnVuY3Rpb24gdG9Db21tZW50KHNvdXJjZU1hcCkge1xuXHQvLyBlc2xpbnQtZGlzYWJsZS1uZXh0LWxpbmUgbm8tdW5kZWZcblx0dmFyIGJhc2U2NCA9IGJ0b2EodW5lc2NhcGUoZW5jb2RlVVJJQ29tcG9uZW50KEpTT04uc3RyaW5naWZ5KHNvdXJjZU1hcCkpKSk7XG5cdHZhciBkYXRhID0gJ3NvdXJjZU1hcHBpbmdVUkw9ZGF0YTphcHBsaWNhdGlvbi9qc29uO2NoYXJzZXQ9dXRmLTg7YmFzZTY0LCcgKyBiYXNlNjQ7XG5cblx0cmV0dXJuICcvKiMgJyArIGRhdGEgKyAnICovJztcbn1cblxuXG5cbi8vLy8vLy8vLy8vLy8vLy8vL1xuLy8gV0VCUEFDSyBGT09URVJcbi8vIC4vfi9jc3MtbG9hZGVyL2xpYi9jc3MtYmFzZS5qc1xuLy8gbW9kdWxlIGlkID0gNDFcbi8vIG1vZHVsZSBjaHVua3MgPSAwIiwiLypcblx0TUlUIExpY2Vuc2UgaHR0cDovL3d3dy5vcGVuc291cmNlLm9yZy9saWNlbnNlcy9taXQtbGljZW5zZS5waHBcblx0QXV0aG9yIFRvYmlhcyBLb3BwZXJzIEBzb2tyYVxuKi9cbnZhciBzdHlsZXNJbkRvbSA9IHt9LFxuXHRtZW1vaXplID0gZnVuY3Rpb24oZm4pIHtcblx0XHR2YXIgbWVtbztcblx0XHRyZXR1cm4gZnVuY3Rpb24gKCkge1xuXHRcdFx0aWYgKHR5cGVvZiBtZW1vID09PSBcInVuZGVmaW5lZFwiKSBtZW1vID0gZm4uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcblx0XHRcdHJldHVybiBtZW1vO1xuXHRcdH07XG5cdH0sXG5cdGlzT2xkSUUgPSBtZW1vaXplKGZ1bmN0aW9uKCkge1xuXHRcdC8vIFRlc3QgZm9yIElFIDw9IDkgYXMgcHJvcG9zZWQgYnkgQnJvd3NlcmhhY2tzXG5cdFx0Ly8gQHNlZSBodHRwOi8vYnJvd3NlcmhhY2tzLmNvbS8jaGFjay1lNzFkODY5MmY2NTMzNDE3M2ZlZTcxNWMyMjJjYjgwNVxuXHRcdC8vIFRlc3RzIGZvciBleGlzdGVuY2Ugb2Ygc3RhbmRhcmQgZ2xvYmFscyBpcyB0byBhbGxvdyBzdHlsZS1sb2FkZXIgXG5cdFx0Ly8gdG8gb3BlcmF0ZSBjb3JyZWN0bHkgaW50byBub24tc3RhbmRhcmQgZW52aXJvbm1lbnRzXG5cdFx0Ly8gQHNlZSBodHRwczovL2dpdGh1Yi5jb20vd2VicGFjay1jb250cmliL3N0eWxlLWxvYWRlci9pc3N1ZXMvMTc3XG5cdFx0cmV0dXJuIHdpbmRvdyAmJiBkb2N1bWVudCAmJiBkb2N1bWVudC5hbGwgJiYgIXdpbmRvdy5hdG9iO1xuXHR9KSxcblx0Z2V0RWxlbWVudCA9IChmdW5jdGlvbihmbikge1xuXHRcdHZhciBtZW1vID0ge307XG5cdFx0cmV0dXJuIGZ1bmN0aW9uKHNlbGVjdG9yKSB7XG5cdFx0XHRpZiAodHlwZW9mIG1lbW9bc2VsZWN0b3JdID09PSBcInVuZGVmaW5lZFwiKSB7XG5cdFx0XHRcdG1lbW9bc2VsZWN0b3JdID0gZm4uY2FsbCh0aGlzLCBzZWxlY3Rvcik7XG5cdFx0XHR9XG5cdFx0XHRyZXR1cm4gbWVtb1tzZWxlY3Rvcl1cblx0XHR9O1xuXHR9KShmdW5jdGlvbiAoc3R5bGVUYXJnZXQpIHtcblx0XHRyZXR1cm4gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihzdHlsZVRhcmdldClcblx0fSksXG5cdHNpbmdsZXRvbkVsZW1lbnQgPSBudWxsLFxuXHRzaW5nbGV0b25Db3VudGVyID0gMCxcblx0c3R5bGVFbGVtZW50c0luc2VydGVkQXRUb3AgPSBbXSxcblx0Zml4VXJscyA9IHJlcXVpcmUoXCIuL2ZpeFVybHNcIik7XG5cbm1vZHVsZS5leHBvcnRzID0gZnVuY3Rpb24obGlzdCwgb3B0aW9ucykge1xuXHRpZih0eXBlb2YgREVCVUcgIT09IFwidW5kZWZpbmVkXCIgJiYgREVCVUcpIHtcblx0XHRpZih0eXBlb2YgZG9jdW1lbnQgIT09IFwib2JqZWN0XCIpIHRocm93IG5ldyBFcnJvcihcIlRoZSBzdHlsZS1sb2FkZXIgY2Fubm90IGJlIHVzZWQgaW4gYSBub24tYnJvd3NlciBlbnZpcm9ubWVudFwiKTtcblx0fVxuXG5cdG9wdGlvbnMgPSBvcHRpb25zIHx8IHt9O1xuXHRvcHRpb25zLmF0dHJzID0gdHlwZW9mIG9wdGlvbnMuYXR0cnMgPT09IFwib2JqZWN0XCIgPyBvcHRpb25zLmF0dHJzIDoge307XG5cblx0Ly8gRm9yY2Ugc2luZ2xlLXRhZyBzb2x1dGlvbiBvbiBJRTYtOSwgd2hpY2ggaGFzIGEgaGFyZCBsaW1pdCBvbiB0aGUgIyBvZiA8c3R5bGU+XG5cdC8vIHRhZ3MgaXQgd2lsbCBhbGxvdyBvbiBhIHBhZ2Vcblx0aWYgKHR5cGVvZiBvcHRpb25zLnNpbmdsZXRvbiA9PT0gXCJ1bmRlZmluZWRcIikgb3B0aW9ucy5zaW5nbGV0b24gPSBpc09sZElFKCk7XG5cblx0Ly8gQnkgZGVmYXVsdCwgYWRkIDxzdHlsZT4gdGFncyB0byB0aGUgPGhlYWQ+IGVsZW1lbnRcblx0aWYgKHR5cGVvZiBvcHRpb25zLmluc2VydEludG8gPT09IFwidW5kZWZpbmVkXCIpIG9wdGlvbnMuaW5zZXJ0SW50byA9IFwiaGVhZFwiO1xuXG5cdC8vIEJ5IGRlZmF1bHQsIGFkZCA8c3R5bGU+IHRhZ3MgdG8gdGhlIGJvdHRvbSBvZiB0aGUgdGFyZ2V0XG5cdGlmICh0eXBlb2Ygb3B0aW9ucy5pbnNlcnRBdCA9PT0gXCJ1bmRlZmluZWRcIikgb3B0aW9ucy5pbnNlcnRBdCA9IFwiYm90dG9tXCI7XG5cblx0dmFyIHN0eWxlcyA9IGxpc3RUb1N0eWxlcyhsaXN0LCBvcHRpb25zKTtcblx0YWRkU3R5bGVzVG9Eb20oc3R5bGVzLCBvcHRpb25zKTtcblxuXHRyZXR1cm4gZnVuY3Rpb24gdXBkYXRlKG5ld0xpc3QpIHtcblx0XHR2YXIgbWF5UmVtb3ZlID0gW107XG5cdFx0Zm9yKHZhciBpID0gMDsgaSA8IHN0eWxlcy5sZW5ndGg7IGkrKykge1xuXHRcdFx0dmFyIGl0ZW0gPSBzdHlsZXNbaV07XG5cdFx0XHR2YXIgZG9tU3R5bGUgPSBzdHlsZXNJbkRvbVtpdGVtLmlkXTtcblx0XHRcdGRvbVN0eWxlLnJlZnMtLTtcblx0XHRcdG1heVJlbW92ZS5wdXNoKGRvbVN0eWxlKTtcblx0XHR9XG5cdFx0aWYobmV3TGlzdCkge1xuXHRcdFx0dmFyIG5ld1N0eWxlcyA9IGxpc3RUb1N0eWxlcyhuZXdMaXN0LCBvcHRpb25zKTtcblx0XHRcdGFkZFN0eWxlc1RvRG9tKG5ld1N0eWxlcywgb3B0aW9ucyk7XG5cdFx0fVxuXHRcdGZvcih2YXIgaSA9IDA7IGkgPCBtYXlSZW1vdmUubGVuZ3RoOyBpKyspIHtcblx0XHRcdHZhciBkb21TdHlsZSA9IG1heVJlbW92ZVtpXTtcblx0XHRcdGlmKGRvbVN0eWxlLnJlZnMgPT09IDApIHtcblx0XHRcdFx0Zm9yKHZhciBqID0gMDsgaiA8IGRvbVN0eWxlLnBhcnRzLmxlbmd0aDsgaisrKVxuXHRcdFx0XHRcdGRvbVN0eWxlLnBhcnRzW2pdKCk7XG5cdFx0XHRcdGRlbGV0ZSBzdHlsZXNJbkRvbVtkb21TdHlsZS5pZF07XG5cdFx0XHR9XG5cdFx0fVxuXHR9O1xufTtcblxuZnVuY3Rpb24gYWRkU3R5bGVzVG9Eb20oc3R5bGVzLCBvcHRpb25zKSB7XG5cdGZvcih2YXIgaSA9IDA7IGkgPCBzdHlsZXMubGVuZ3RoOyBpKyspIHtcblx0XHR2YXIgaXRlbSA9IHN0eWxlc1tpXTtcblx0XHR2YXIgZG9tU3R5bGUgPSBzdHlsZXNJbkRvbVtpdGVtLmlkXTtcblx0XHRpZihkb21TdHlsZSkge1xuXHRcdFx0ZG9tU3R5bGUucmVmcysrO1xuXHRcdFx0Zm9yKHZhciBqID0gMDsgaiA8IGRvbVN0eWxlLnBhcnRzLmxlbmd0aDsgaisrKSB7XG5cdFx0XHRcdGRvbVN0eWxlLnBhcnRzW2pdKGl0ZW0ucGFydHNbal0pO1xuXHRcdFx0fVxuXHRcdFx0Zm9yKDsgaiA8IGl0ZW0ucGFydHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0ZG9tU3R5bGUucGFydHMucHVzaChhZGRTdHlsZShpdGVtLnBhcnRzW2pdLCBvcHRpb25zKSk7XG5cdFx0XHR9XG5cdFx0fSBlbHNlIHtcblx0XHRcdHZhciBwYXJ0cyA9IFtdO1xuXHRcdFx0Zm9yKHZhciBqID0gMDsgaiA8IGl0ZW0ucGFydHMubGVuZ3RoOyBqKyspIHtcblx0XHRcdFx0cGFydHMucHVzaChhZGRTdHlsZShpdGVtLnBhcnRzW2pdLCBvcHRpb25zKSk7XG5cdFx0XHR9XG5cdFx0XHRzdHlsZXNJbkRvbVtpdGVtLmlkXSA9IHtpZDogaXRlbS5pZCwgcmVmczogMSwgcGFydHM6IHBhcnRzfTtcblx0XHR9XG5cdH1cbn1cblxuZnVuY3Rpb24gbGlzdFRvU3R5bGVzKGxpc3QsIG9wdGlvbnMpIHtcblx0dmFyIHN0eWxlcyA9IFtdO1xuXHR2YXIgbmV3U3R5bGVzID0ge307XG5cdGZvcih2YXIgaSA9IDA7IGkgPCBsaXN0Lmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIGl0ZW0gPSBsaXN0W2ldO1xuXHRcdHZhciBpZCA9IG9wdGlvbnMuYmFzZSA/IGl0ZW1bMF0gKyBvcHRpb25zLmJhc2UgOiBpdGVtWzBdO1xuXHRcdHZhciBjc3MgPSBpdGVtWzFdO1xuXHRcdHZhciBtZWRpYSA9IGl0ZW1bMl07XG5cdFx0dmFyIHNvdXJjZU1hcCA9IGl0ZW1bM107XG5cdFx0dmFyIHBhcnQgPSB7Y3NzOiBjc3MsIG1lZGlhOiBtZWRpYSwgc291cmNlTWFwOiBzb3VyY2VNYXB9O1xuXHRcdGlmKCFuZXdTdHlsZXNbaWRdKVxuXHRcdFx0c3R5bGVzLnB1c2gobmV3U3R5bGVzW2lkXSA9IHtpZDogaWQsIHBhcnRzOiBbcGFydF19KTtcblx0XHRlbHNlXG5cdFx0XHRuZXdTdHlsZXNbaWRdLnBhcnRzLnB1c2gocGFydCk7XG5cdH1cblx0cmV0dXJuIHN0eWxlcztcbn1cblxuZnVuY3Rpb24gaW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMsIHN0eWxlRWxlbWVudCkge1xuXHR2YXIgc3R5bGVUYXJnZXQgPSBnZXRFbGVtZW50KG9wdGlvbnMuaW5zZXJ0SW50bylcblx0aWYgKCFzdHlsZVRhcmdldCkge1xuXHRcdHRocm93IG5ldyBFcnJvcihcIkNvdWxkbid0IGZpbmQgYSBzdHlsZSB0YXJnZXQuIFRoaXMgcHJvYmFibHkgbWVhbnMgdGhhdCB0aGUgdmFsdWUgZm9yIHRoZSAnaW5zZXJ0SW50bycgcGFyYW1ldGVyIGlzIGludmFsaWQuXCIpO1xuXHR9XG5cdHZhciBsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcCA9IHN0eWxlRWxlbWVudHNJbnNlcnRlZEF0VG9wW3N0eWxlRWxlbWVudHNJbnNlcnRlZEF0VG9wLmxlbmd0aCAtIDFdO1xuXHRpZiAob3B0aW9ucy5pbnNlcnRBdCA9PT0gXCJ0b3BcIikge1xuXHRcdGlmKCFsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcCkge1xuXHRcdFx0c3R5bGVUYXJnZXQuaW5zZXJ0QmVmb3JlKHN0eWxlRWxlbWVudCwgc3R5bGVUYXJnZXQuZmlyc3RDaGlsZCk7XG5cdFx0fSBlbHNlIGlmKGxhc3RTdHlsZUVsZW1lbnRJbnNlcnRlZEF0VG9wLm5leHRTaWJsaW5nKSB7XG5cdFx0XHRzdHlsZVRhcmdldC5pbnNlcnRCZWZvcmUoc3R5bGVFbGVtZW50LCBsYXN0U3R5bGVFbGVtZW50SW5zZXJ0ZWRBdFRvcC5uZXh0U2libGluZyk7XG5cdFx0fSBlbHNlIHtcblx0XHRcdHN0eWxlVGFyZ2V0LmFwcGVuZENoaWxkKHN0eWxlRWxlbWVudCk7XG5cdFx0fVxuXHRcdHN0eWxlRWxlbWVudHNJbnNlcnRlZEF0VG9wLnB1c2goc3R5bGVFbGVtZW50KTtcblx0fSBlbHNlIGlmIChvcHRpb25zLmluc2VydEF0ID09PSBcImJvdHRvbVwiKSB7XG5cdFx0c3R5bGVUYXJnZXQuYXBwZW5kQ2hpbGQoc3R5bGVFbGVtZW50KTtcblx0fSBlbHNlIHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoXCJJbnZhbGlkIHZhbHVlIGZvciBwYXJhbWV0ZXIgJ2luc2VydEF0Jy4gTXVzdCBiZSAndG9wJyBvciAnYm90dG9tJy5cIik7XG5cdH1cbn1cblxuZnVuY3Rpb24gcmVtb3ZlU3R5bGVFbGVtZW50KHN0eWxlRWxlbWVudCkge1xuXHRzdHlsZUVsZW1lbnQucGFyZW50Tm9kZS5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQpO1xuXHR2YXIgaWR4ID0gc3R5bGVFbGVtZW50c0luc2VydGVkQXRUb3AuaW5kZXhPZihzdHlsZUVsZW1lbnQpO1xuXHRpZihpZHggPj0gMCkge1xuXHRcdHN0eWxlRWxlbWVudHNJbnNlcnRlZEF0VG9wLnNwbGljZShpZHgsIDEpO1xuXHR9XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVN0eWxlRWxlbWVudChvcHRpb25zKSB7XG5cdHZhciBzdHlsZUVsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwic3R5bGVcIik7XG5cdG9wdGlvbnMuYXR0cnMudHlwZSA9IFwidGV4dC9jc3NcIjtcblxuXHRhdHRhY2hUYWdBdHRycyhzdHlsZUVsZW1lbnQsIG9wdGlvbnMuYXR0cnMpO1xuXHRpbnNlcnRTdHlsZUVsZW1lbnQob3B0aW9ucywgc3R5bGVFbGVtZW50KTtcblx0cmV0dXJuIHN0eWxlRWxlbWVudDtcbn1cblxuZnVuY3Rpb24gY3JlYXRlTGlua0VsZW1lbnQob3B0aW9ucykge1xuXHR2YXIgbGlua0VsZW1lbnQgPSBkb2N1bWVudC5jcmVhdGVFbGVtZW50KFwibGlua1wiKTtcblx0b3B0aW9ucy5hdHRycy50eXBlID0gXCJ0ZXh0L2Nzc1wiO1xuXHRvcHRpb25zLmF0dHJzLnJlbCA9IFwic3R5bGVzaGVldFwiO1xuXG5cdGF0dGFjaFRhZ0F0dHJzKGxpbmtFbGVtZW50LCBvcHRpb25zLmF0dHJzKTtcblx0aW5zZXJ0U3R5bGVFbGVtZW50KG9wdGlvbnMsIGxpbmtFbGVtZW50KTtcblx0cmV0dXJuIGxpbmtFbGVtZW50O1xufVxuXG5mdW5jdGlvbiBhdHRhY2hUYWdBdHRycyhlbGVtZW50LCBhdHRycykge1xuXHRPYmplY3Qua2V5cyhhdHRycykuZm9yRWFjaChmdW5jdGlvbiAoa2V5KSB7XG5cdFx0ZWxlbWVudC5zZXRBdHRyaWJ1dGUoa2V5LCBhdHRyc1trZXldKTtcblx0fSk7XG59XG5cbmZ1bmN0aW9uIGFkZFN0eWxlKG9iaiwgb3B0aW9ucykge1xuXHR2YXIgc3R5bGVFbGVtZW50LCB1cGRhdGUsIHJlbW92ZSwgdHJhbnNmb3JtUmVzdWx0O1xuXG5cdC8vIElmIGEgdHJhbnNmb3JtIGZ1bmN0aW9uIHdhcyBkZWZpbmVkLCBydW4gaXQgb24gdGhlIGNzc1xuXHRpZiAob3B0aW9ucy50cmFuc2Zvcm0gJiYgb2JqLmNzcykge1xuXHQgICAgdHJhbnNmb3JtUmVzdWx0ID0gb3B0aW9ucy50cmFuc2Zvcm0ob2JqLmNzcyk7XG5cdCAgICBcblx0ICAgIGlmICh0cmFuc2Zvcm1SZXN1bHQpIHtcblx0ICAgIFx0Ly8gSWYgdHJhbnNmb3JtIHJldHVybnMgYSB2YWx1ZSwgdXNlIHRoYXQgaW5zdGVhZCBvZiB0aGUgb3JpZ2luYWwgY3NzLlxuXHQgICAgXHQvLyBUaGlzIGFsbG93cyBydW5uaW5nIHJ1bnRpbWUgdHJhbnNmb3JtYXRpb25zIG9uIHRoZSBjc3MuXG5cdCAgICBcdG9iai5jc3MgPSB0cmFuc2Zvcm1SZXN1bHQ7XG5cdCAgICB9IGVsc2Uge1xuXHQgICAgXHQvLyBJZiB0aGUgdHJhbnNmb3JtIGZ1bmN0aW9uIHJldHVybnMgYSBmYWxzeSB2YWx1ZSwgZG9uJ3QgYWRkIHRoaXMgY3NzLiBcblx0ICAgIFx0Ly8gVGhpcyBhbGxvd3MgY29uZGl0aW9uYWwgbG9hZGluZyBvZiBjc3Ncblx0ICAgIFx0cmV0dXJuIGZ1bmN0aW9uKCkge1xuXHQgICAgXHRcdC8vIG5vb3Bcblx0ICAgIFx0fTtcblx0ICAgIH1cblx0fVxuXG5cdGlmIChvcHRpb25zLnNpbmdsZXRvbikge1xuXHRcdHZhciBzdHlsZUluZGV4ID0gc2luZ2xldG9uQ291bnRlcisrO1xuXHRcdHN0eWxlRWxlbWVudCA9IHNpbmdsZXRvbkVsZW1lbnQgfHwgKHNpbmdsZXRvbkVsZW1lbnQgPSBjcmVhdGVTdHlsZUVsZW1lbnQob3B0aW9ucykpO1xuXHRcdHVwZGF0ZSA9IGFwcGx5VG9TaW5nbGV0b25UYWcuYmluZChudWxsLCBzdHlsZUVsZW1lbnQsIHN0eWxlSW5kZXgsIGZhbHNlKTtcblx0XHRyZW1vdmUgPSBhcHBseVRvU2luZ2xldG9uVGFnLmJpbmQobnVsbCwgc3R5bGVFbGVtZW50LCBzdHlsZUluZGV4LCB0cnVlKTtcblx0fSBlbHNlIGlmKG9iai5zb3VyY2VNYXAgJiZcblx0XHR0eXBlb2YgVVJMID09PSBcImZ1bmN0aW9uXCIgJiZcblx0XHR0eXBlb2YgVVJMLmNyZWF0ZU9iamVjdFVSTCA9PT0gXCJmdW5jdGlvblwiICYmXG5cdFx0dHlwZW9mIFVSTC5yZXZva2VPYmplY3RVUkwgPT09IFwiZnVuY3Rpb25cIiAmJlxuXHRcdHR5cGVvZiBCbG9iID09PSBcImZ1bmN0aW9uXCIgJiZcblx0XHR0eXBlb2YgYnRvYSA9PT0gXCJmdW5jdGlvblwiKSB7XG5cdFx0c3R5bGVFbGVtZW50ID0gY3JlYXRlTGlua0VsZW1lbnQob3B0aW9ucyk7XG5cdFx0dXBkYXRlID0gdXBkYXRlTGluay5iaW5kKG51bGwsIHN0eWxlRWxlbWVudCwgb3B0aW9ucyk7XG5cdFx0cmVtb3ZlID0gZnVuY3Rpb24oKSB7XG5cdFx0XHRyZW1vdmVTdHlsZUVsZW1lbnQoc3R5bGVFbGVtZW50KTtcblx0XHRcdGlmKHN0eWxlRWxlbWVudC5ocmVmKVxuXHRcdFx0XHRVUkwucmV2b2tlT2JqZWN0VVJMKHN0eWxlRWxlbWVudC5ocmVmKTtcblx0XHR9O1xuXHR9IGVsc2Uge1xuXHRcdHN0eWxlRWxlbWVudCA9IGNyZWF0ZVN0eWxlRWxlbWVudChvcHRpb25zKTtcblx0XHR1cGRhdGUgPSBhcHBseVRvVGFnLmJpbmQobnVsbCwgc3R5bGVFbGVtZW50KTtcblx0XHRyZW1vdmUgPSBmdW5jdGlvbigpIHtcblx0XHRcdHJlbW92ZVN0eWxlRWxlbWVudChzdHlsZUVsZW1lbnQpO1xuXHRcdH07XG5cdH1cblxuXHR1cGRhdGUob2JqKTtcblxuXHRyZXR1cm4gZnVuY3Rpb24gdXBkYXRlU3R5bGUobmV3T2JqKSB7XG5cdFx0aWYobmV3T2JqKSB7XG5cdFx0XHRpZihuZXdPYmouY3NzID09PSBvYmouY3NzICYmIG5ld09iai5tZWRpYSA9PT0gb2JqLm1lZGlhICYmIG5ld09iai5zb3VyY2VNYXAgPT09IG9iai5zb3VyY2VNYXApXG5cdFx0XHRcdHJldHVybjtcblx0XHRcdHVwZGF0ZShvYmogPSBuZXdPYmopO1xuXHRcdH0gZWxzZSB7XG5cdFx0XHRyZW1vdmUoKTtcblx0XHR9XG5cdH07XG59XG5cbnZhciByZXBsYWNlVGV4dCA9IChmdW5jdGlvbiAoKSB7XG5cdHZhciB0ZXh0U3RvcmUgPSBbXTtcblxuXHRyZXR1cm4gZnVuY3Rpb24gKGluZGV4LCByZXBsYWNlbWVudCkge1xuXHRcdHRleHRTdG9yZVtpbmRleF0gPSByZXBsYWNlbWVudDtcblx0XHRyZXR1cm4gdGV4dFN0b3JlLmZpbHRlcihCb29sZWFuKS5qb2luKCdcXG4nKTtcblx0fTtcbn0pKCk7XG5cbmZ1bmN0aW9uIGFwcGx5VG9TaW5nbGV0b25UYWcoc3R5bGVFbGVtZW50LCBpbmRleCwgcmVtb3ZlLCBvYmopIHtcblx0dmFyIGNzcyA9IHJlbW92ZSA/IFwiXCIgOiBvYmouY3NzO1xuXG5cdGlmIChzdHlsZUVsZW1lbnQuc3R5bGVTaGVldCkge1xuXHRcdHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0LmNzc1RleHQgPSByZXBsYWNlVGV4dChpbmRleCwgY3NzKTtcblx0fSBlbHNlIHtcblx0XHR2YXIgY3NzTm9kZSA9IGRvY3VtZW50LmNyZWF0ZVRleHROb2RlKGNzcyk7XG5cdFx0dmFyIGNoaWxkTm9kZXMgPSBzdHlsZUVsZW1lbnQuY2hpbGROb2Rlcztcblx0XHRpZiAoY2hpbGROb2Rlc1tpbmRleF0pIHN0eWxlRWxlbWVudC5yZW1vdmVDaGlsZChjaGlsZE5vZGVzW2luZGV4XSk7XG5cdFx0aWYgKGNoaWxkTm9kZXMubGVuZ3RoKSB7XG5cdFx0XHRzdHlsZUVsZW1lbnQuaW5zZXJ0QmVmb3JlKGNzc05vZGUsIGNoaWxkTm9kZXNbaW5kZXhdKTtcblx0XHR9IGVsc2Uge1xuXHRcdFx0c3R5bGVFbGVtZW50LmFwcGVuZENoaWxkKGNzc05vZGUpO1xuXHRcdH1cblx0fVxufVxuXG5mdW5jdGlvbiBhcHBseVRvVGFnKHN0eWxlRWxlbWVudCwgb2JqKSB7XG5cdHZhciBjc3MgPSBvYmouY3NzO1xuXHR2YXIgbWVkaWEgPSBvYmoubWVkaWE7XG5cblx0aWYobWVkaWEpIHtcblx0XHRzdHlsZUVsZW1lbnQuc2V0QXR0cmlidXRlKFwibWVkaWFcIiwgbWVkaWEpXG5cdH1cblxuXHRpZihzdHlsZUVsZW1lbnQuc3R5bGVTaGVldCkge1xuXHRcdHN0eWxlRWxlbWVudC5zdHlsZVNoZWV0LmNzc1RleHQgPSBjc3M7XG5cdH0gZWxzZSB7XG5cdFx0d2hpbGUoc3R5bGVFbGVtZW50LmZpcnN0Q2hpbGQpIHtcblx0XHRcdHN0eWxlRWxlbWVudC5yZW1vdmVDaGlsZChzdHlsZUVsZW1lbnQuZmlyc3RDaGlsZCk7XG5cdFx0fVxuXHRcdHN0eWxlRWxlbWVudC5hcHBlbmRDaGlsZChkb2N1bWVudC5jcmVhdGVUZXh0Tm9kZShjc3MpKTtcblx0fVxufVxuXG5mdW5jdGlvbiB1cGRhdGVMaW5rKGxpbmtFbGVtZW50LCBvcHRpb25zLCBvYmopIHtcblx0dmFyIGNzcyA9IG9iai5jc3M7XG5cdHZhciBzb3VyY2VNYXAgPSBvYmouc291cmNlTWFwO1xuXG5cdC8qIElmIGNvbnZlcnRUb0Fic29sdXRlVXJscyBpc24ndCBkZWZpbmVkLCBidXQgc291cmNlbWFwcyBhcmUgZW5hYmxlZFxuXHRhbmQgdGhlcmUgaXMgbm8gcHVibGljUGF0aCBkZWZpbmVkIHRoZW4gbGV0cyB0dXJuIGNvbnZlcnRUb0Fic29sdXRlVXJsc1xuXHRvbiBieSBkZWZhdWx0LiAgT3RoZXJ3aXNlIGRlZmF1bHQgdG8gdGhlIGNvbnZlcnRUb0Fic29sdXRlVXJscyBvcHRpb25cblx0ZGlyZWN0bHlcblx0Ki9cblx0dmFyIGF1dG9GaXhVcmxzID0gb3B0aW9ucy5jb252ZXJ0VG9BYnNvbHV0ZVVybHMgPT09IHVuZGVmaW5lZCAmJiBzb3VyY2VNYXA7XG5cblx0aWYgKG9wdGlvbnMuY29udmVydFRvQWJzb2x1dGVVcmxzIHx8IGF1dG9GaXhVcmxzKXtcblx0XHRjc3MgPSBmaXhVcmxzKGNzcyk7XG5cdH1cblxuXHRpZihzb3VyY2VNYXApIHtcblx0XHQvLyBodHRwOi8vc3RhY2tvdmVyZmxvdy5jb20vYS8yNjYwMzg3NVxuXHRcdGNzcyArPSBcIlxcbi8qIyBzb3VyY2VNYXBwaW5nVVJMPWRhdGE6YXBwbGljYXRpb24vanNvbjtiYXNlNjQsXCIgKyBidG9hKHVuZXNjYXBlKGVuY29kZVVSSUNvbXBvbmVudChKU09OLnN0cmluZ2lmeShzb3VyY2VNYXApKSkpICsgXCIgKi9cIjtcblx0fVxuXG5cdHZhciBibG9iID0gbmV3IEJsb2IoW2Nzc10sIHsgdHlwZTogXCJ0ZXh0L2Nzc1wiIH0pO1xuXG5cdHZhciBvbGRTcmMgPSBsaW5rRWxlbWVudC5ocmVmO1xuXG5cdGxpbmtFbGVtZW50LmhyZWYgPSBVUkwuY3JlYXRlT2JqZWN0VVJMKGJsb2IpO1xuXG5cdGlmKG9sZFNyYylcblx0XHRVUkwucmV2b2tlT2JqZWN0VVJMKG9sZFNyYyk7XG59XG5cblxuXG4vLy8vLy8vLy8vLy8vLy8vLy9cbi8vIFdFQlBBQ0sgRk9PVEVSXG4vLyAuL34vc3R5bGUtbG9hZGVyL2FkZFN0eWxlcy5qc1xuLy8gbW9kdWxlIGlkID0gNjNcbi8vIG1vZHVsZSBjaHVua3MgPSAwIl0sInNvdXJjZVJvb3QiOiIifQ==