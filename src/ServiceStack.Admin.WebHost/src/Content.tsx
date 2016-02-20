/// <reference path='../typings/main.d.ts'/>

import * as React from 'react';
import 'jquery';
import 'ss-utils';
import Results from './Results';

export default class Content extends React.Component<any, any> {
    constructor(props?, context?) {
        super(props, context);
        this.state = { results: null };
    }

    selectField(e) {
        var searchField = e.target.options[e.target.selectedIndex].value,
            searchType = this.props.values.searchType,
            searchText = this.props.values.searchText;

        const f = this.getSearchField(searchField);
        if (this.isIntField(f)) {
            if (isNaN(searchText))
                searchText = '';
            const convention = this.props.conventions.filter(c => c.name === searchType)[0];
            if (!this.matchesConvention(convention, f.type))
                searchType = '';
        }

        this.props.onChange({ searchField, searchType, searchText });
    }

    selectOperand(e) {
        this.props.onChange({ searchType: e.target.options[e.target.selectedIndex].value });
    }

    changeText(e) {
        this.props.onChange({ searchText: e.target.value});
    }

    selectFormat(format) {
        if (format === this.props.values.format) //toggle
            format = "";

        this.props.onChange({ format });
    }

    clear() {
        this.props.onChange({
            searchField: null, searchType: null, searchText: '', format: '', orderBy: '', offset: 0,
            fields: [], conditions: []
        });
    }

    getAutoQueryUrl(format:string) {
        const firstRoute = (this.props.selected.requestType.routes || []).filter(x => x.path.indexOf('{') === -1)[0];

        const path = firstRoute
            ? firstRoute.path
            : `/${format || 'html'}/reply/` + this.props.selected.requestType.name;

        var url = $.ss.combinePaths(this.props.config.servicebaseurl, path);

        if (firstRoute && format)
            url += "." + format;

        this.getArgs().forEach(arg =>
            url = $.ss.createUrl(url, arg));

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
    }

    isValidCondition() {
        const { searchField, searchType, searchText } = this.props.values;
        return searchField && searchType && searchText
            && (searchType.toLowerCase() !== 'between' || (searchText.indexOf(',') > 0 && searchText.indexOf(',') < searchText.length -1));
    }

    isDirty() {
        return this.isValidCondition()
            || this.props.values.format
            || this.props.values.offset
            || (this.props.values.fields || []).length > 0
            || this.props.values.orderBy
            || (this.props.values.conditions || []).length > 0;
    }

    getArgs() {
        var args = [];
        var conditions = (this.props.values.conditions || []).slice(0);
        if (this.isValidCondition()) {
            conditions.push(this.props.values);
        }

        conditions.forEach(condition => {
            const { searchField, searchType, searchText } = condition;
            var convention = this.props.conventions.filter(c => c.name === searchType)[0];
            if (convention) {
                const field = convention.value.replace("%", searchField);
                args.push({ [field]: searchText });
            }
        });

        return args;
    }

    getSearchField(name: string) {
        return this.props.selected.fromTypeFields.filter(f => f.name === name)[0];
    }

    isIntField(f) {
        return f && (f.type || '').toLowerCase().startsWith('int');
    }

    matchesConvention(convention, fieldType) {
        return !convention || !convention.types || !fieldType ||
            convention.types.replace(/ /g, '').toLowerCase().split(',').indexOf(fieldType.toLowerCase()) >= 0;
    }

    getConventions() {
        const values = this.props.values;
        if (values && values.searchField) {
            const f = this.getSearchField(values.searchField);
            if (f) {
                return this.props.conventions.filter(c => this.matchesConvention(c, f.type));
            }
        }
        return this.props.conventions;
    }

    renderResults(response) {
        var fieldNames = null, fieldWidths = null;
        var fieldDefs = (this.props.viewerArgs["SummaryFields"] || "")
            .split(',')
            .filter(x => x.trim().length > 0);

        if (fieldDefs.length > 0) {
            fieldNames = [], fieldWidths = {};
            fieldDefs.forEach(x => {
                var parts = $.ss.splitOnFirst(x, ':');
                fieldNames.push(parts[0]);
                if (parts.length > 1)
                    fieldWidths[parts[0]] = parts[1];
            });
        }

        var { offset, results, total } = response, maxLimit = this.props.config.maxlimit;

        const Control = (name, enable, offset) => enable
            ? <i className="material-icons" style={{ cursor: 'pointer' }} onClick={e => this.props.onChange({ offset })}>{name}</i>
            : <i className="material-icons" style={{ color: '#ccc' }}>{name}</i>;

        var Paging = (
            <span className="paging" style={{padding:'0 10px 0 0'}}>
                {Control("skip_previous", offset > 0, 0) }
                {Control("chevron_left", offset > 0, Math.max(offset - maxLimit, 0)) }
                {Control("chevron_right", offset + maxLimit < total, offset + maxLimit) }
                {Control("skip_next", offset + maxLimit < total, Math.floor((total - 1) / maxLimit) * maxLimit)}
            </span>
        );

        return response.results.length === 0
            ? <div className="results-none">There were no results</div>
            : (
                <div>
                    <div className="noselect" style={{ color: '#757575', padding: '15px 0' }}>
                        {Paging}
                        <span>
                            Showing Results {offset + 1} - {offset + results.length} of {total}
                        </span>

                        <i className="material-icons" title="show/hide columns" onClick={e => this.props.onShowDialog('column-prefs-dialog')} style={{
                            verticalAlign: 'text-bottom', margin: '0 0 0 10px', cursor: 'pointer', fontSize:'20px'
                        }}>view_list</i>
                    </div>

                    <Results results={response.results} fieldNames={fieldNames} fieldWidths={fieldWidths}
                        selected={this.props.selected}
                        values={this.props.values}
                        onOrderByChange={orderBy => this.props.onChange({ orderBy })} />
                </div>
            );
    }

    renderBody(op, values) {
        const url = this.getAutoQueryUrl(this.props.values.format);
        const name = this.props.selected.name;
        const loadingNewQuery = this.state.url !== url;
        if (loadingNewQuery) {
            $.ajax({
                url: this.getAutoQueryUrl("json"),
                data: { jsconfig: "DateHandler:ISO8601DateOnly" },
                dataType: 'json',
                success: r => {
                    var response = $.ss.normalize(r);
                    response.url = url;
                    this.setState({ url, name, response, error:null });
                },
                error: r => {
                    var status = $.ss.parseResponseStatus(r.responseText);
                    this.setState({ url, name, response:null, error: `${status.errorCode}: ${status.message}` });
                }
            });
        }

        return (
            <div>
                <div style={{ color: '#757575', background: '#eee', position: 'absolute', top:'125px', right: '320px', maxWidth:'700px' }}>
                    {this.props.viewerArgs["Description"] }
                </div>
                <div id="url" style={{ padding: '0 0 10px 0' }}>
                    <a href={url} target="_blank">{url}</a>
                    {!  this.isDirty() ? null : (
                        <i className="material-icons noselect" title="reset query" onClick={e => this.clear() } style={{
                            padding: '0 0 0 5px', color: '#757575', fontSize: '16px', verticalAlign: 'bottom', cursor: 'pointer'
                        }}>clear</i>
                    )}
                </div>

                <select value={values.searchField} onChange={e => this.selectField(e) }>
                    <option></option>
                    {op.fromTypeFields.map(
                        f => <option key={f.name}>{f.name}</option>) }
                </select>
                <select value={values.searchType} onChange={e => this.selectOperand(e) }>
                    <option></option>
                    {this.getConventions().map(
                        c => <option key={c.name}>{c.name}</option>) }
                </select>
                <input type="text" id="txtSearch" value={values.searchText} autoComplete="off"
                    onChange={e => this.changeText(e) }
                    onKeyDown={e => e.keyCode === 13 ? this.props.onAddCondition() : null} />

                {this.isValidCondition()
                    ? (<i className="material-icons" style={{ fontSize: '30px', verticalAlign: 'bottom', color: '#00C853', cursor: 'pointer' }}
                        onClick={e => this.props.onAddCondition() } title="Add condition">add_circle</i>)
                    : (<i className="material-icons" style={{ fontSize: '30px', verticalAlign: 'bottom', color: '#ccc' }}
                        title="Incomplete condition">add_circle</i>)}

                {!this.props.config.formats || this.props.config.formats.length === 0 ? null : (
                    <span className="formats noselect">
                        {this.props.config.formats.map(f =>
                            <span key={f} className={values.format === f ? 'active' : ''} onClick={e => this.selectFormat(f)}>{f}</span>) }
                    </span>)}

                <div className="conditions">
                    {this.props.values.conditions.map(c => (
                        <div key={c.id}>
                            <i className="material-icons" style={{ color: '#db4437', cursor: 'pointer', padding: '0 5px 0 0' }}
                                title="remove condition"
                                onClick={e => this.props.onRemoveCondition(c) }>remove_circle</i>
                            {c.searchField} {c.searchType} {c.searchText}
                        </div>
                    ))}
                </div>

                { this.state.response
                    ? (!loadingNewQuery || name === this.state.name
                        ? this.renderResults(this.state.response)
                        : (<div style={{ color: '#757575', padding:'20px 0 0 0' }}>
                                <i className="material-icons spin" style={{ fontSize:'20px', verticalAlign: 'text-bottom' }}>cached</i>
                                <span style={{ padding:'0 0 0 5px'}}>loading results...</span>
                           </div>))
                    : this.state.error
                        ? <div style={{ color:'#db4437'}}>{this.state.error}</div>
                        : null }

            </div>
        );
    }

    render() {
        const isMsEdge = /Edge/.test(navigator.userAgent);

        return (
            <div id="content" style={{ position: 'absolute', width: '100%', height: '100%', overflow: 'auto' }}>
                <div style={{ padding: '90px 0 20px 20px' }}>
                    <table>
                    <tbody>
                        <tr>
                            {isMsEdge ? <td style={{ minWidth: '290px' }}></td> : null}
                            <td>
                                {this.props.selected
                                    ? this.renderBody(this.props.selected, this.props.values)
                                    : (<div style={{ padding: '15px 0', fontSize:'20px', color:'#757575' }}>
                                        <i className="material-icons" style={{ verticalAlign: 'bottom', margin:'0 10px 0 0'}}>arrow_back</i>
                                        Please Select a Query</div>) }
                            </td>
                            {!isMsEdge ? <td style={{ minWidth: '290px' }}></td> : null}
                        </tr>
                     </tbody>
                     </table>
                </div>
            </div>
        );
    }
}