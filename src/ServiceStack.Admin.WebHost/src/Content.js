/// <reference path='../typings/main.d.ts'/>
System.register(['react'], function(exports_1) {
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
            }],
        execute: function() {
            Content = (function (_super) {
                __extends(Content, _super);
                function Content(props, context) {
                    _super.call(this, props, context);
                    this.state = { defaults: this.props.defaults };
                }
                Content.prototype.selectField = function (e) {
                    var defaults = this.state.defaults;
                    defaults.searchField = e.target.options[e.target.selectedIndex].value;
                    this.setState({ defaults: defaults });
                };
                Content.prototype.selectOperand = function (e) {
                    var defaults = this.state.defaults;
                    defaults.searchType = e.target.options[e.target.selectedIndex].value;
                    this.setState({ defaults: defaults });
                };
                Content.prototype.getAutoQueryUrl = function () {
                    return location.href;
                };
                Content.prototype.renderBody = function (op, defaults) {
                    var _this = this;
                    return (React.createElement("div", null, React.createElement("div", {"style": { margin: '15px 0', color: '#757575' }}, this.props.viewerArgs[op.name]["Description"]), React.createElement("div", {"id": "url", "style": { padding: '0 0 10px 0' }}, React.createElement("a", {"href": this.getAutoQueryUrl()}, this.getAutoQueryUrl())), React.createElement("form", {"style": { padding: '0' }}, React.createElement("select", {"onChange": function (e) { return _this.selectField(e); }}, op.from.properties.map(function (p) { return React.createElement("option", {"key": p.name, "selected": p.name === defaults.searchField}, p.name); })), React.createElement("select", {"onChange": function (e) { return _this.selectOperand(e); }}, this.props.implicitConventions.map(function (c) { return React.createElement("option", {"key": c.name, "selected": c.name === defaults.searchType}, c.name); })), React.createElement("input", {"type": "text", "id": "txtSearch", "value": defaults.searchText}), React.createElement("button", null, "Search"), React.createElement("button", null, "+"))));
                };
                Content.prototype.render = function () {
                    return (React.createElement("div", {"id": "content", "style": { flex: 1 }}, this.props.selected
                        ? this.renderBody(this.props.selected, this.props.defaults)
                        : React.createElement("div", null, "No Query Selected")));
                };
                return Content;
            })(React.Component);
            exports_1("default", Content);
        }
    }
});
//# sourceMappingURL=Content.js.map