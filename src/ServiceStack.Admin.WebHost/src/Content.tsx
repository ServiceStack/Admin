/// <reference path='../typings/main.d.ts'/>

import * as React from 'react';
import 'jquery';
import 'ss-utils';

export default class Content extends React.Component<any, any> {
    constructor(props?, context?) {
        super(props, context);
    }

    selectField(e) {
        this.props.onChange({ searchField: e.target.options[e.target.selectedIndex].value });
    }

    selectOperand(e) {
        this.props.onChange({ searchType: e.target.options[e.target.selectedIndex].value });
    }

    changeText(e) {
        this.props.onChange({ searchText: e.target.value});
    }

    getAutoQueryUrl() {
        const firstRoute = (this.props.selected.requestType.routes || []).filter(x => x.path.indexOf('{') === -1)[0];
        const path = firstRoute ? firstRoute.path : '/json/reply/' + this.props.selected.requestType.name;
        var requestPath = $.ss.combinePaths(this.props.baseUrl, path);
        var url = $.ss.createUrl(requestPath, this.getArgs());
        return url.replace("%2C",",");
    }

    getArgs() {
        var defaults = this.props.defaults;
        var args = {};
        if (defaults && defaults.searchField && defaults.searchType && defaults.searchText) {
            var convention = this.props.implicitConventions.filter(c => c.name === defaults.searchType)[0];
            if (convention) {
                var field = convention.value.replace("%", defaults.searchField);
                args[field] = defaults.searchText;
            }
        }
        return args;
    }

    renderBody(op, defaults) {
        return (
            <div>
                <div style={{ margin: '15px 0', color: '#757575' }}>
                    {this.props.viewerArgs[op.name]["Description"] }
                </div>
                <div id="url" style={{ padding: '0 0 10px 0' }}>
                    <a href={this.getAutoQueryUrl()} target="_blank">{this.getAutoQueryUrl() }</a>
                </div>
                <form style={{ padding: '0' }}>
                    <select onChange={e => this.selectField(e) }>
                        {op.fromType.properties.map(
                            p => <option key={p.name} selected={p.name === defaults.searchField}>{p.name}</option>) }
                    </select>
                    <select onChange={e => this.selectOperand(e) }>
                        {this.props.implicitConventions.map(
                            c => <option key={c.name} selected={c.name === defaults.searchType}>{c.name}</option>) }
                    </select>
                    <input type="text" id="txtSearch" value={defaults.searchText} onChange={e => this.changeText(e)} />
                    <button>Search</button>
                    <button>+</button>
                </form>
            </div>
        );
    }

    render() {
        return (
            <div id="content" style={{ flex: 1 }}>
                {this.props.selected
                    ? this.renderBody(this.props.selected, this.props.defaults)
                    : <div>No Query Selected</div> }
            </div>
        );
    }
}