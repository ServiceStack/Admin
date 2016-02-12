/// <reference path='../typings/main.d.ts'/>
System.register(['react', 'jquery', 'ss-utils'], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var React;
    var App;
    return {
        setters:[
            function (React_1) {
                React = React_1;
            },
            function (_1) {},
            function (_2) {}],
        execute: function() {
            App = (function (_super) {
                __extends(App, _super);
                function App(props, context) {
                    _super.call(this, props, context);
                    var operationNames = this.props.metadata.operations.map(function (op) { return op.request; });
                    this.state = { sidebarHidden: false, operationNames: operationNames, selected: null, defaults: {} };
                }
                App.prototype.toggleSidebar = function () {
                    this.setState({ sidebarHidden: !this.state.sidebarHidden });
                };
                App.prototype.getOperation = function (name) {
                    return this.props.metadata.operations.filter(function (op) { return op.request === name; })[0];
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
                    return this.getAutoQueryViewerArgValue(this.state.selected.name, 'Title') || this.state.selected.name;
                };
                App.prototype.getAutoQueryUrl = function () {
                    return location.href;
                };
                App.prototype.selectQuery = function (name) {
                    var operation = this.getOperation(name);
                    var from = this.props.metadata.types.filter(function (t) { return t.name === operation.from; });
                    var defaults = this.state.defaults;
                    var op = defaults[name] || {};
                    op.searchField = op.searchField || this.getAutoQueryViewerArgValue(name, "DefaultSearchField");
                    op.searchType = op.searchType || this.getAutoQueryViewerArgValue(name, "DefaultSearchType");
                    op.searchText = op.searchText || this.getAutoQueryViewerArgValue(name, "DefaultSearchText");
                    defaults[name] = op;
                    this.setState({ selected: { name: name, operation: operation, from: from }, defaults: defaults });
                };
                App.prototype.selectField = function (e) {
                    var defaults = this.state.defaults;
                    defaults[this.state.selected.name].searchField = e.target.options[e.target.selectedIndex].value;
                    this.setState({ defaults: defaults });
                };
                App.prototype.selectOperand = function (e) {
                    var defaults = this.state.defaults;
                    defaults[this.state.selected.name].searchType = e.target.options[e.target.selectedIndex].value;
                    this.setState({ defaults: defaults });
                };
                App.prototype.renderIcon = function (name) {
                    var iconUrl = this.getAutoQueryViewerArgValue(name, "IconUrl");
                    if (iconUrl) {
                        if (iconUrl.startsWith('material-icons:'))
                            return (React.createElement("i", {"className": "material-icons"}, $.ss.splitOnFirst(iconUrl, ':')[1]));
                        if (iconUrl.startsWith('octicon:'))
                            return (React.createElement("span", {"className": "mega-octicon octicon-" + $.ss.splitOnFirst(iconUrl, ':')[1]}));
                        return (React.createElement("img", {"src": iconUrl}));
                    }
                    return (React.createElement("i", {"className": "material-icons"}, "search"));
                };
                App.prototype.renderForm = function (op, defaults) {
                    var _this = this;
                    return (React.createElement("div", null, React.createElement("div", {"style": { margin: '15px 0', color: '#757575' }}, this.getAutoQueryViewerArgValue(op.name, "Description")), React.createElement("div", {"id": "url", "style": { padding: '0 0 10px 0' }}, React.createElement("a", {"href": this.getAutoQueryUrl()}, this.getAutoQueryUrl())), React.createElement("form", {"style": { padding: '0' }}, React.createElement("select", {"onChange": function (e) { return _this.selectField(e); }}, op.from.map(function (t) { return t.properties.map(function (p) { return React.createElement("option", {"key": p.name, "selected": p.name === defaults.searchField}, p.name); }); })), React.createElement("select", {"onChange": function (e) { return _this.selectOperand(e); }}, this.props.metadata.config.implicitConventions.map(function (c) { return React.createElement("option", {"key": c.name, "selected": c.name === defaults.searchType}, c.name); })), React.createElement("input", {"type": "text", "id": "txtSearch", "value": defaults.searchText}), React.createElement("button", null, "Search"), React.createElement("button", null, "+"))));
                };
                App.prototype.render = function () {
                    var _this = this;
                    var opName = this.state.selected && this.state.selected.name;
                    return (React.createElement("div", null, React.createElement("div", {"id": "header", "style": { display: 'flex', flexDirection: 'row' }}, React.createElement("i", {"className": "material-icons", "style": { cursor: 'pointer' }, "onClick": function (e) { return _this.toggleSidebar(); }}, "menu"), React.createElement("h1", null, "AutoQuery"), this.state.selected == null ? React.createElement("div", {"style": { flex: 1 }}) : (React.createElement("div", {"id": "header-content", "style": { display: 'flex', flex: 1 }}, React.createElement("div", null, React.createElement("div", {"className": "seperator"})), React.createElement("h2", null, this.getSelectedTitle()), React.createElement("div", {"style": { margin: 'auto', flex: 1 }})))), React.createElement("div", {"id": "body", "style": { position: 'absolute', top: 90, display: 'flex', flexDirection: 'row', width: '100%', height: '100%' }}, React.createElement("div", {"id": "sidebar", "className": this.state.sidebarHidden ? ' hide' : ''}, React.createElement("div", {"id": "aq-filter"}, React.createElement("input", {"type": "text", "placeholder": "filter", "style": { margin: "10px 15px" }})), React.createElement("div", {"id": "aq-list"}, this.state.operationNames.map(function (op) { return (React.createElement("div", {"className": "aq-item" + (op === opName ? " active" : ""), "onClick": function (e) { return _this.selectQuery(op); }}, _this.renderIcon(op), React.createElement("div", null, op))); }))), React.createElement("div", {"id": "content", "style": { flex: 1 }}, this.state.selected
                        ? this.renderForm(this.state.selected, this.state.defaults[opName])
                        : React.createElement("div", null, "No Query Selected")))));
                };
                return App;
            })(React.Component);
            exports_1("default", App);
        }
    }
});
//# sourceMappingURL=app.js.map