/// <reference path='../typings/main.d.ts'/>
System.register(['react', 'jquery', 'ss-utils'], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var React;
    var Results;
    return {
        setters:[
            function (React_1) {
                React = React_1;
            },
            function (_1) {},
            function (_2) {}],
        execute: function() {
            Results = (function (_super) {
                __extends(Results, _super);
                function Results() {
                    _super.apply(this, arguments);
                }
                Results.prototype.renderValue = function (o) {
                    return $.isArray(o)
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
                            return React.createElement("a", {"href": s, "target": "_blank"}, s.substring(s.indexOf('://') + 3));
                        if (s.toLowerCase() === "false")
                            return React.createElement("i", {"className": "material-icons", "style": { color: '#FF8A80', fontSize: '14px' }}, "remove_circle");
                        if (s.toLowerCase() === "true")
                            return React.createElement("i", {"className": "material-icons", "style": { color: '#66BB6A', fontSize: '14px' }}, "check_circle");
                    }
                    return React.createElement("span", null, s);
                };
                Results.prototype.render = function () {
                    var _this = this;
                    var Results = React.createElement("div", {"className": "results-none"}, "There were no results");
                    var results = this.props.results;
                    if (results && results.length > 0) {
                        var fieldNames = this.props.fieldNames || Object.keys(results[0]);
                        var fieldWidths = this.props.fieldWidths || {};
                        Results = (React.createElement("table", {"className": "results"}, React.createElement("thead", null, React.createElement("tr", null, fieldNames.map(function (f) { return React.createElement("th", {"key": f}, $.ss.humanize(f)); }))), React.createElement("tbody", null, results.map(function (r, i) { return (React.createElement("tr", {"key": i}, fieldNames.map(function (f, j) { return (React.createElement("td", {"key": j, "title": _this.renderValue(r[f]), "style": fieldWidths[f.toLowerCase()] ? { maxWidth: fieldWidths[f.toLowerCase()] } : {}}, _this.formatString(_this.renderValue(r[f])))); }))); }))));
                    }
                    return Results;
                };
                return Results;
            })(React.Component);
            exports_1("default", Results);
        }
    }
});
//# sourceMappingURL=Results.js.map