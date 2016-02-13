/// <reference path='../typings/main.d.ts'/>
System.register(['react', 'jquery', 'ss-utils'], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var React;
    var Content;
    return {
        setters:[
            function (React_1) {
                React = React_1;
            },
            function (_1) {},
            function (_2) {}],
        execute: function() {
            Content = (function (_super) {
                __extends(Content, _super);
                function Content(props, context) {
                    _super.call(this, props, context);
                }
                Content.prototype.selectField = function (e) {
                    this.props.onChange({ searchField: e.target.options[e.target.selectedIndex].value });
                };
                Content.prototype.selectOperand = function (e) {
                    this.props.onChange({ searchType: e.target.options[e.target.selectedIndex].value });
                };
                Content.prototype.changeText = function (e) {
                    this.props.onChange({ searchText: e.target.value });
                };
                Content.prototype.getAutoQueryUrl = function () {
                    var firstRoute = (this.props.selected.requestType.routes || []).filter(function (x) { return x.path.indexOf('{') === -1; })[0];
                    var path = firstRoute ? firstRoute.path : '/json/reply/' + this.props.selected.requestType.name;
                    var requestPath = $.ss.combinePaths(this.props.baseUrl, path);
                    var url = $.ss.createUrl(requestPath, this.getArgs());
                    return url.replace("%2C", ",");
                };
                Content.prototype.getArgs = function () {
                    var defaults = this.props.defaults;
                    var args = {};
                    if (defaults && defaults.searchField && defaults.searchType && defaults.searchText) {
                        var convention = this.props.implicitConventions.filter(function (c) { return c.name === defaults.searchType; })[0];
                        if (convention) {
                            var field = convention.value.replace("%", defaults.searchField);
                            args[field] = defaults.searchText;
                        }
                    }
                    return args;
                };
                Content.prototype.renderBody = function (op, defaults) {
                    var _this = this;
                    return (React.createElement("div", null, React.createElement("div", {"style": { margin: '15px 0', color: '#757575' }}, this.props.viewerArgs[op.name]["Description"]), React.createElement("div", {"id": "url", "style": { padding: '0 0 10px 0' }}, React.createElement("a", {"href": this.getAutoQueryUrl(), "target": "_blank"}, this.getAutoQueryUrl())), React.createElement("form", {"style": { padding: '0' }}, React.createElement("select", {"onChange": function (e) { return _this.selectField(e); }}, op.fromType.properties.map(function (p) { return React.createElement("option", {"key": p.name, "selected": p.name === defaults.searchField}, p.name); })), React.createElement("select", {"onChange": function (e) { return _this.selectOperand(e); }}, this.props.implicitConventions.map(function (c) { return React.createElement("option", {"key": c.name, "selected": c.name === defaults.searchType}, c.name); })), React.createElement("input", {"type": "text", "id": "txtSearch", "value": defaults.searchText, "onChange": function (e) { return _this.changeText(e); }}), React.createElement("button", null, "Search"), React.createElement("button", null, "+"))));
                };
                Content.prototype.render = function () {
                    return (React.createElement("div", {"id": "content", "style": { flex: 1 }}, this.props.selected
                        ? this.renderBody(this.props.selected, this.props.defaults)
                        : React.createElement("div", {"style": { padding: '15px 0' }}, "No Query Selected")));
                };
                return Content;
            })(React.Component);
            exports_1("default", Content);
        }
    }
});
//# sourceMappingURL=Content.js.map