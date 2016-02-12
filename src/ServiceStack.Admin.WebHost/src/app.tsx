/// <reference path='../typings/main.d.ts'/>

import * as React from 'react';
import { render } from 'react-dom';
import 'jquery';
import 'ss-utils';

export default class App extends React.Component<any, any> {
    constructor(props?, context?) {
        super(props, context);

        var operationNames = this.props.metadata.operations.map(op => op.request);
        this.state = { sidebarHidden: false, operationNames, selected:null, defaults:{} };
    }

    toggleSidebar() {
        this.setState({ sidebarHidden: !this.state.sidebarHidden });
    }

    getOperation(name: string) {
        return this.props.metadata.operations.filter(op => op.request === name)[0];
    }

    getType(name: string) {
        return this.props.metadata.types.filter(op => op.name === name)[0];
    }

    getAutoQueryViewer(name: string) {
        const type = this.getType(name);
        return type != null && type.attributes != null
            ? type.attributes.filter(attr => attr.name === "AutoQueryViewer")[0]
            : null;
    }

    getAutoQueryViewerArgValue(name: string, argName:string) {
        var aqViewer = this.getAutoQueryViewer(name);
        var arg = aqViewer
            ? aqViewer.args.filter(x => x.name === argName)[0]
            : null;
        return arg != null
            ? arg.value
            : null;
    }

    getSelectedTitle() {
        return this.getAutoQueryViewerArgValue(this.state.selected.name, 'Title') || this.state.selected.name;
    }

    getAutoQueryUrl() {
        return location.href;
    }

    selectQuery(name) {
        const operation = this.getOperation(name);
        const from = this.props.metadata.types.filter(t => t.name === operation.from);
        const defaults = this.state.defaults;
        const op = defaults[name] || {};
        op.searchField = op.searchField || this.getAutoQueryViewerArgValue(name, "DefaultSearchField");
        op.searchType = op.searchType || this.getAutoQueryViewerArgValue(name, "DefaultSearchType");
        op.searchText = op.searchText || this.getAutoQueryViewerArgValue(name, "DefaultSearchText");
        defaults[name] = op;

        this.setState({ selected: { name, operation, from }, defaults });
    }

    selectField(e) {
        var defaults = this.state.defaults;
        defaults[this.state.selected.name].searchField = e.target.options[e.target.selectedIndex].value;
        this.setState({ defaults });
    }

    selectOperand(e) {
        var defaults = this.state.defaults;
        defaults[this.state.selected.name].searchType = e.target.options[e.target.selectedIndex].value;
        this.setState({ defaults });
    }

    renderIcon(name) {
        var iconUrl = this.getAutoQueryViewerArgValue(name, "IconUrl");
        if (iconUrl) {
            if (iconUrl.startsWith('material-icons:'))
                return (<i className="material-icons">{$.ss.splitOnFirst(iconUrl, ':')[1]}</i>);
            if (iconUrl.startsWith('octicon:'))
                return (<span className={"mega-octicon octicon-" + $.ss.splitOnFirst(iconUrl, ':')[1]}></span>);
            return (<img src={iconUrl} />);
        }
        return (<i className="material-icons">search</i>);
    }

    renderForm(op, defaults) {
        return (
            <div>
                <div style={{ margin: '15px 0', color: '#757575' }}>
                    {this.getAutoQueryViewerArgValue(op.name, "Description") }
                </div>
                <div id="url" style={{padding:'0 0 10px 0'}}>
                    <a href={this.getAutoQueryUrl()}>{this.getAutoQueryUrl()}</a>
                </div>
                <form style={{ padding: '0' }}>
                    <select onChange={e => this.selectField(e)}>
                        {op.from.map(t => t.properties.map(
                            p => <option key={p.name} selected={p.name === defaults.searchField}>{p.name}</option>)) }
                    </select>
                    <select onChange={e => this.selectOperand(e) }>
                        {this.props.metadata.config.implicitConventions.map(
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
        var opName = this.state.selected && this.state.selected.name;
        return (
            <div>
                <div id="header" style={{ display: 'flex', flexDirection: 'row' }}>
                    <i className="material-icons" style={{ cursor: 'pointer' }} onClick={e => this.toggleSidebar()}>menu</i>
                        <h1>AutoQuery</h1>
                        {this.state.selected == null ? <div style={{flex:1}} /> : (
                            <div id="header-content" style={{ display: 'flex', flex: 1 }}>
                                <div>
                                    <div className="seperator"></div>
                                </div>
                                <h2>{ this.getSelectedTitle()}</h2>
                                <div style={{ margin: 'auto', flex: 1 }}></div>
                            </div>
                        )}
                </div>
                <div id="body" style={{position: 'absolute', top: 90, display:'flex', flexDirection: 'row', width: '100%', height: '100%' }}>
                    <div id="sidebar" className={this.state.sidebarHidden ? ' hide' : ''}>
                        <div id="aq-filter">
                            <input type="text" placeholder="filter" style={{margin:"10px 15px"}} />
                        </div>
                        <div id="aq-list">
                            {this.state.operationNames.map(op => (
                                <div className={"aq-item" + (op === opName ? " active" : "")} onClick={e => this.selectQuery(op)}>
                                    {this.renderIcon(op)}
                                    <div>{op}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                    <div id="content" style={{ flex: 1 }}>
                        {this.state.selected
                            ? this.renderForm(this.state.selected, this.state.defaults[opName])
                            : <div>No Query Selected</div> }
                    </div>
                </div>
            </div>
        );
    }
}
