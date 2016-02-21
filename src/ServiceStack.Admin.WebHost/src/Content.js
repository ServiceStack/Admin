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
                        : ("/" + (format || 'html') + "/reply/") + this.props.selected.requestType.name;
                    var url = $.ss.combinePaths(this.props.config.servicebaseurl, path);
                    if (firstRoute && format)
                        url += "." + format;
                    this.getArgs().forEach(function (arg) {
                        return url = $.ss.createUrl(url, arg);
                    });
                    if (this.props.values.offset)
                        url = $.ss.createUrl(url, { skip: this.props.values.offset });
                    if (this.props.values.orderBy)
                        url = $.ss.createUrl(url, { orderBy: this.props.values.orderBy });
                    if ((this.props.values.fields || []).length > 0) {
                        url = $.ss.createUrl(url, { fields: this.props.values.fields.join(',') });
                        if (!format || format === 'html')
                            url = $.ss.createUrl(url, { jsconfig: 'edv' });
                    }
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
                        var f = this.getSearchField(values.searchField);
                        if (f) {
                            return this.props.conventions.filter(function (c) { return _this.matchesConvention(c, f.type); });
                        }
                    }
                    return this.props.conventions;
                };
                Content.prototype.renderResults = function (response) {
                    var _this = this;
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
                                fieldWidths[parts[0]] = parts[1];
                        });
                    }
                    var offset = response.offset, results = response.results, total = response.total, maxLimit = this.props.config.maxlimit;
                    var Control = function (name, enable, offset) { return enable
                        ? React.createElement("i", {"className": "material-icons", "style": { cursor: 'pointer' }, "onClick": function (e) { return _this.props.onChange({ offset: offset }); }}, name)
                        : React.createElement("i", {"className": "material-icons", "style": { color: '#ccc' }}, name); };
                    var Paging = (React.createElement("span", {"className": "paging", "style": { padding: '0 10px 0 0' }}, Control("skip_previous", offset > 0, 0), Control("chevron_left", offset > 0, Math.max(offset - maxLimit, 0)), Control("chevron_right", offset + maxLimit < total, offset + maxLimit), Control("skip_next", offset + maxLimit < total, Math.floor((total - 1) / maxLimit) * maxLimit)));
                    return response.results.length === 0
                        ? React.createElement("div", {"className": "results-none"}, "There were no results")
                        : (React.createElement("div", null, React.createElement("div", {"className": "noselect", "style": { color: '#757575', padding: '15px 0' }}, Paging, React.createElement("span", null, "Showing Results ", offset + 1, " - ", offset + results.length, " of ", total), React.createElement("i", {"className": "material-icons", "title": "show/hide columns", "onClick": function (e) { return _this.props.onShowDialog('column-prefs-dialog'); }, "style": {
                            verticalAlign: 'text-bottom', margin: '0 0 0 10px', cursor: 'pointer', fontSize: '20px'
                        }}, "view_list")), React.createElement(Results_1.default, {"results": response.results, "fieldNames": fieldNames, "fieldWidths": fieldWidths, "selected": this.props.selected, "values": this.props.values, "onOrderByChange": function (orderBy) { return _this.props.onChange({ orderBy: orderBy }); }})));
                };
                Content.prototype.renderBody = function (op, values) {
                    var _this = this;
                    var url = this.getAutoQueryUrl(this.props.values.format);
                    var name = this.props.selected.name;
                    var loadingNewQuery = this.state.url !== url;
                    if (loadingNewQuery) {
                        $.ajax({
                            url: this.getAutoQueryUrl("json"),
                            data: { jsconfig: "DateHandler:ISO8601DateOnly" },
                            dataType: 'json',
                            success: function (r) {
                                var response = $.ss.normalize(r);
                                response.url = url;
                                _this.setState({ url: url, name: name, response: response, error: null });
                            },
                            error: function (r) {
                                var status = $.ss.parseResponseStatus(r.responseText);
                                _this.setState({ url: url, name: name, response: null, error: status.errorCode + ": " + status.message });
                            }
                        });
                    }
                    return (React.createElement("div", null, React.createElement("div", {"style": { color: '#757575', background: '#eee', position: 'absolute', top: '125px', right: '320px', maxWidth: '700px' }}, this.props.viewerArgs["Description"]), React.createElement("div", {"id": "url", "style": { padding: '0 0 10px 0', wordWrap: 'nowrap' }}, React.createElement("a", {"href": url, "target": "_blank"}, url), !this.isDirty() ? null : (React.createElement("i", {"className": "material-icons noselect", "title": "reset query", "onClick": function (e) { return _this.clear(); }, "style": {
                        padding: '0 0 0 5px', color: '#757575', fontSize: '16px', verticalAlign: 'bottom', cursor: 'pointer'
                    }}, "clear"))), React.createElement("select", {"value": values.searchField, "onChange": function (e) { return _this.selectField(e); }}, React.createElement("option", null), op.fromTypeFields.map(function (f) { return React.createElement("option", {"key": f.name}, f.name); })), React.createElement("select", {"value": values.searchType, "onChange": function (e) { return _this.selectOperand(e); }}, React.createElement("option", null), this.getConventions().map(function (c) { return React.createElement("option", {"key": c.name}, c.name); })), React.createElement("input", {"type": "text", "id": "txtSearch", "value": values.searchText, "autoComplete": "off", "onChange": function (e) { return _this.changeText(e); }, "onKeyDown": function (e) { return e.keyCode === 13 ? _this.props.onAddCondition() : null; }}), this.isValidCondition()
                        ? (React.createElement("i", {"className": "material-icons", "style": { fontSize: '30px', verticalAlign: 'bottom', color: '#00C853', cursor: 'pointer' }, "onClick": function (e) { return _this.props.onAddCondition(); }, "title": "Add condition"}, "add_circle"))
                        : (React.createElement("i", {"className": "material-icons", "style": { fontSize: '30px', verticalAlign: 'bottom', color: '#ccc' }, "title": "Incomplete condition"}, "add_circle")), !this.props.config.formats || this.props.config.formats.length === 0 ? null : (React.createElement("span", {"className": "formats noselect"}, this.props.config.formats.map(function (f) {
                        return React.createElement("span", {"key": f, "className": values.format === f ? 'active' : '', "onClick": function (e) { return _this.selectFormat(f); }}, f);
                    }))), React.createElement("div", {"className": "conditions"}, this.props.values.conditions.map(function (c) { return (React.createElement("div", {"key": c.id}, React.createElement("i", {"className": "material-icons", "style": { color: '#db4437', cursor: 'pointer', padding: '0 5px 0 0' }, "title": "remove condition", "onClick": function (e) { return _this.props.onRemoveCondition(c); }}, "remove_circle"), c.searchField, " ", c.searchType, " ", c.searchText)); })), this.state.response
                        ? (!loadingNewQuery || name === this.state.name
                            ? this.renderResults(this.state.response)
                            : (React.createElement("div", {"style": { color: '#757575', padding: '20px 0 0 0' }}, React.createElement("i", {"className": "material-icons spin", "style": { fontSize: '20px', verticalAlign: 'text-bottom' }}, "cached"), React.createElement("span", {"style": { padding: '0 0 0 5px' }}, "loading results..."))))
                        : this.state.error
                            ? React.createElement("div", {"style": { color: '#db4437' }}, this.state.error)
                            : null));
                };
                Content.prototype.render = function () {
                    var isMsEdge = /Edge/.test(navigator.userAgent);
                    return (React.createElement("div", {"id": "content", "style": { position: 'absolute', width: '100%', height: '100%', overflow: 'auto' }}, React.createElement("div", {"style": { padding: '90px 0 20px 20px' }}, React.createElement("table", null, React.createElement("tbody", null, React.createElement("tr", null, isMsEdge ? React.createElement("td", {"style": { minWidth: '290px' }}) : null, React.createElement("td", null, this.props.selected
                        ? this.renderBody(this.props.selected, this.props.values)
                        : (React.createElement("div", {"style": { padding: '15px 0', fontSize: '20px', color: '#757575' }}, React.createElement("i", {"className": "material-icons", "style": { verticalAlign: 'bottom', margin: '0 10px 0 0' }}, "arrow_back"), this.props.userinfo.querycount > 0
                            ? "Please Select a Query"
                            : this.props.userinfo.isauthenticated
                                ? "There are no queries available"
                                : "Please Sign In to see your available queries"))), !isMsEdge ? React.createElement("td", {"style": { minWidth: '290px' }}) : null))))));
                };
                return Content;
            })(React.Component);
            exports_1("default", Content);
        }
    }
});
//# sourceMappingURL=Content.js.map