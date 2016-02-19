/// <reference path='../typings/main.d.ts'/>
System.register(['react', './core', 'jquery', 'ss-utils'], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var React, core_1;
    var Results;
    return {
        setters:[
            function (React_1) {
                React = React_1;
            },
            function (core_1_1) {
                core_1 = core_1_1;
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
                            return React.createElement("i", {"className": "material-icons", "style": { color: '#757575', fontSize: '14px' }}, "check_box_outline_blank");
                        if (s.toLowerCase() === "true")
                            return React.createElement("i", {"className": "material-icons", "style": { color: '#66BB6A', fontSize: '14px' }}, "check_box");
                    }
                    return React.createElement("span", null, s);
                };
                Results.prototype.render = function () {
                    var _this = this;
                    var Results = React.createElement("div", {"className": "results-none"}, "There were no results");
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
                        Results = (React.createElement("table", {"className": "results"}, React.createElement("thead", null, React.createElement("tr", {"className": "noselect"}, fieldNames.map(function (f) { return (React.createElement("th", {"key": f, "style": { cursor: 'pointer' }, "onClick": function (e) { return _this.props.onOrderByChange(f !== orderByName ? '-' + f : !orderBy.startsWith('-') ? '' : orderByName); }}, $.ss.humanize(f), f !== orderByName ? null :
                            React.createElement("i", {"className": "material-icons", "style": { fontSize: '18px', verticalAlign: 'bottom' }}, orderBy.startsWith('-') ? "arrow_drop_down" : "arrow_drop_up"))); }))), React.createElement("tbody", null, results.map(function (r, i) { return (React.createElement("tr", {"key": i}, fieldNames.map(function (f, j) { return (React.createElement("td", {"key": j, "title": _this.renderValue(core_1.getField(r, f)), "style": core_1.getField(fieldWidths, f) ? { maxWidth: core_1.getField(fieldWidths, f) } : {}}, _this.formatString(_this.renderValue(core_1.getField(r, f))))); }))); }))));
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