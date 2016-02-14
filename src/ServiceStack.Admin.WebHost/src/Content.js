/// <reference path='../typings/main.d.ts'/>
System.register(['react', 'jquery', 'ss-utils', './Results'], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var React, Results_1;
    var Content;
    return {
        setters:[
            function (React_1) {
                React = React_1;
            },
            function (_1) {},
            function (_2) {},
            function (Results_1_1) {
                Results_1 = Results_1_1;
            }],
        execute: function() {
            Content = (function (_super) {
                __extends(Content, _super);
                function Content(props, context) {
                    _super.call(this, props, context);
                    this.state = { results: null };
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
                Content.prototype.selectFormat = function (format) {
                    if (format === this.props.defaults.format)
                        format = "";
                    this.props.onChange({ format: format });
                };
                Content.prototype.getAutoQueryUrl = function () {
                    var firstRoute = (this.props.selected.requestType.routes || []).filter(function (x) { return x.path.indexOf('{') === -1; })[0];
                    var path = firstRoute ? firstRoute.path : '/json/reply/' + this.props.selected.requestType.name;
                    var requestPath = $.ss.combinePaths(this.props.config.servicebaseurl, path);
                    if (this.props.defaults.format)
                        requestPath += "." + this.props.defaults.format;
                    var url = $.ss.createUrl(requestPath, this.getArgs());
                    return url.replace("%2C", ",");
                };
                Content.prototype.getArgs = function () {
                    var defaults = this.props.defaults;
                    var args = {};
                    if (defaults && defaults.searchField && defaults.searchType && defaults.searchText) {
                        var convention = this.props.conventions.filter(function (c) { return c.name === defaults.searchType; })[0];
                        if (convention) {
                            var field = convention.value.replace("%", defaults.searchField);
                            args[field] = defaults.searchText;
                        }
                    }
                    return args;
                };
                Content.prototype.renderResults = function (response) {
                    var fieldNames = null, fieldWidths = null;
                    var fieldDefs = (this.props.viewerArgs["SummaryFields"] || "")
                        .split(',')
                        .filter(function (x) { return x.trim().length > 0; });
                    if (fieldDefs.length > 0) {
                        fieldNames = [], fieldWidths = {};
                        fieldDefs.forEach(function (x) {
                            var parts = $.ss.splitOnFirst(x, ':');
                            fieldNames.push(parts[0]);
                            if (parts.length > 1)
                                fieldWidths[parts[0].toLowerCase()] = parts[1];
                        });
                    }
                    return response.results.length === 0
                        ? React.createElement("div", {"className": "results-none"}, "There were no results")
                        : (React.createElement("div", null, React.createElement("div", {"style": { color: '#757575', padding: '15px' }}, "Showing Results ", response.offset + 1, " - ", response.offset + response.results.length, " of ", response.total), React.createElement(Results_1.default, {"results": response.results, "fieldNames": fieldNames, "fieldWidths": fieldWidths})));
                };
                Content.prototype.renderBody = function (op, defaults) {
                    var _this = this;
                    var url = this.getAutoQueryUrl();
                    if (!this.state.response || this.state.response.url !== url) {
                        $.getJSON(url, { jsconfig: "DateHandler:ISO8601DateOnly" }, function (r) {
                            var response = $.ss.normalize(r);
                            response.url = url;
                            _this.setState({ response: response });
                        });
                    }
                    return (React.createElement("div", null, React.createElement("div", {"style": { color: '#757575', position: 'absolute', right: '300px', background: '#eee' }}, this.props.viewerArgs["Description"]), React.createElement("div", {"id": "url", "style": { padding: '0 0 10px 0' }}, React.createElement("a", {"href": url, "target": "_blank"}, url)), React.createElement("form", {"style": { padding: '0' }}, React.createElement("select", {"value": defaults.searchField, "onChange": function (e) { return _this.selectField(e); }}, React.createElement("option", null), op.fromType.properties.map(function (p) { return React.createElement("option", {"key": p.name}, p.name); })), React.createElement("select", {"value": defaults.searchType, "onChange": function (e) { return _this.selectOperand(e); }}, React.createElement("option", null), this.props.conventions.map(function (c) { return React.createElement("option", {"key": c.name}, c.name); })), React.createElement("input", {"type": "text", "id": "txtSearch", "value": defaults.searchText, "onChange": function (e) { return _this.changeText(e); }}), React.createElement("button", null, "+"), !this.props.config.formats || this.props.config.formats.length === 0 ? null : (React.createElement("span", {"className": "formats noselect"}, this.props.config.formats.map(function (f) {
                        return React.createElement("span", {"className": defaults.format === f ? 'active' : '', "onClick": function (e) { return _this.selectFormat(f); }}, f);
                    })))), this.state.response ? this.renderResults(this.state.response) : null));
                };
                Content.prototype.render = function () {
                    return (React.createElement("div", {"id": "content", "style": { position: 'absolute', width: '100%', height: '100%', overflow: 'auto' }}, React.createElement("div", {"style": { padding: '90px 0 0 20px' }}, React.createElement("table", null, React.createElement("tr", null, React.createElement("td", null, this.props.selected
                        ? this.renderBody(this.props.selected, this.props.defaults)
                        : React.createElement("div", {"style": { padding: '15px 0' }}, "No Query Selected")), React.createElement("td", {"style": { minWidth: '290px' }}))))));
                };
                return Content;
            })(React.Component);
            exports_1("default", Content);
        }
    }
});
//# sourceMappingURL=Content.js.map