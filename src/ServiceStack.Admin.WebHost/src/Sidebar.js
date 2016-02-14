/// <reference path='../typings/main.d.ts'/>
System.register(['react', 'react-router', 'jquery', 'ss-utils'], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var React, react_router_1;
    var Sidebar;
    return {
        setters:[
            function (React_1) {
                React = React_1;
            },
            function (react_router_1_1) {
                react_router_1 = react_router_1_1;
            },
            function (_1) {},
            function (_2) {}],
        execute: function() {
            Sidebar = (function (_super) {
                __extends(Sidebar, _super);
                function Sidebar(props, context) {
                    _super.call(this, props, context);
                    this.state = { filter: null, defaults: {} };
                }
                Sidebar.prototype.handleFilter = function (e) {
                    this.setState({ filter: e.target.value.toLowerCase() });
                };
                Sidebar.prototype.renderIcon = function (name) {
                    var iconUrl = this.props.viewerArgs[name]["IconUrl"];
                    if (iconUrl) {
                        if (iconUrl.startsWith('material-icons:'))
                            return (React.createElement("i", {"className": "material-icons"}, $.ss.splitOnFirst(iconUrl, ':')[1]));
                        if (iconUrl.startsWith('octicon:'))
                            return (React.createElement("span", {"className": "mega-octicon octicon-" + $.ss.splitOnFirst(iconUrl, ':')[1]}));
                        return (React.createElement("img", {"src": iconUrl}));
                    }
                    return (React.createElement("i", {"className": "material-icons"}, "search"));
                };
                Sidebar.prototype.render = function () {
                    var _this = this;
                    return (React.createElement("div", {"id": "sidebar", "className": this.props.hide ? ' hide' : ''}, React.createElement("div", {"style": { padding: '90px 0 0 0' }}, React.createElement("div", {"id": "aq-filter"}, React.createElement("input", {"type": "text", "placeholder": "filter", "style": { margin: "10px 15px" }, "onChange": function (e) { return _this.handleFilter(e); }, "value": this.state.filter})), React.createElement("div", {"id": "aq-list"}, Object.keys(this.props.operations)
                        .filter(function (op) { return _this.state.filter == null || op.toLowerCase().indexOf(_this.state.filter) >= 0; })
                        .map(function (op, i) { return (React.createElement("div", {"key": i, "className": "aq-item" + (op === _this.props.name ? " active" : "")}, _this.renderIcon(op), React.createElement(react_router_1.Link, {"to": "/ss-admin/autoquery/" + op}, op))); })))));
                };
                return Sidebar;
            })(React.Component);
            exports_1("default", Sidebar);
        }
    }
});
//# sourceMappingURL=Sidebar.js.map