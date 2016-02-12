/// <reference path='../typings/main.d.ts'/>

import * as React from 'react';

export default class Content extends React.Component<any, any> {
    constructor(props?, context?) {
        super(props, context);
        this.state = { defaults: this.props.defaults };
    }

    selectField(e) {
        var defaults = this.state.defaults;
        defaults.searchField = e.target.options[e.target.selectedIndex].value;
        this.setState({ defaults });
    }

    selectOperand(e) {
        var defaults = this.state.defaults;
        defaults.searchType = e.target.options[e.target.selectedIndex].value;
        this.setState({ defaults });
    }

    getAutoQueryUrl() {
        return location.href;
    }

    renderBody(op, defaults) {
        return (
            <div>
                <div style={{ margin: '15px 0', color: '#757575' }}>
                    {this.props.viewerArgs[op.name]["Description"] }
                </div>
                <div id="url" style={{ padding: '0 0 10px 0' }}>
                    <a href={this.getAutoQueryUrl() }>{this.getAutoQueryUrl() }</a>
                </div>
                <form style={{ padding: '0' }}>
                    <select onChange={e => this.selectField(e) }>
                        {op.from.properties.map(
                            p => <option key={p.name} selected={p.name === defaults.searchField}>{p.name}</option>) }
                    </select>
                    <select onChange={e => this.selectOperand(e) }>
                        {this.props.implicitConventions.map(
                            c => <option key={c.name} selected={c.name === defaults.searchType}>{c.name}</option>) }
                    </select>
                    <input type="text" id="txtSearch" value={defaults.searchText} />
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