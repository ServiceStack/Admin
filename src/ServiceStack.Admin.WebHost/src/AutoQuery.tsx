/// <reference path='../typings/main.d.ts'/>

import * as React from 'react';
import { render } from 'react-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Content from './Content';
import 'jquery';
import 'ss-utils';

export default class AutoQuery extends React.Component<any, any> {
    constructor(props?, context?) {
        super(props, context);
        this.state = {};

        $.getJSON("/autoquery/metadata", metadata =>
            this.setState({ metadata, name: this.props.params.name }));
    }

    render() {
        return this.state.metadata
            ? <App metadata={this.state.metadata} name={this.props.params.name} />
            : null;
    }
}

class App extends React.Component<any, any> {
    constructor(props?, context?) {
        super(props, context);

        var operationNames = this.props.metadata.operations.map(op => op.request);

        var viewerArgs = {}, operations = {}, types = {};
        operationNames.forEach(name => {
            viewerArgs[name] = {};
            var aqViewer = this.getAutoQueryViewer(name);
            if (aqViewer && aqViewer.args) {
                aqViewer.args.forEach(arg => viewerArgs[name][arg.name] = arg.value);
            }

            operations[name] = this.props.metadata.operations.filter(op => op.request === name)[0];
        });

        this.props.metadata.types.forEach(t => types[t.name] = t);

        this.state = {
            sidebarHidden: false, selected: null, defaults: {},
            operationNames, viewerArgs, operations, types            
        };
    }

    toggleSidebar() {
        this.setState({ sidebarHidden: !this.state.sidebarHidden });
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
        return this.state.selected
            ? this.getAutoQueryViewerArgValue(this.state.selected.name, 'Title') || this.state.selected.name
            : null;
    }

    getDefaults(name) {
        const viewerArgs = this.state.viewerArgs[name] || {};
        const op = this.state.defaults[name] || {};
        return {
            searchField: op.searchField || viewerArgs["DefaultSearchField"],
            searchType: op.searchType || viewerArgs["DefaultSearchType"],
            searchText: op.searchText != null ? op.searchText : viewerArgs["DefaultSearchText"]
        };
    }

    getSelected(name) {
        const operation = this.state.operations[name];
        if (operation == null)
            return null;
        const requestType = this.state.types[name];
        const fromType = this.state.types[operation.from];
        const toType = this.state.types[operation.to];
        return { name, operation, requestType, fromType, toType};
    }

    onContentChange(name, newValues) {
        const defaults = this.state.defaults;
        const op = defaults[name] || (defaults[name] = {});
        if (newValues.searchField != null)
            op.searchField = newValues.searchField;
        if (newValues.searchType != null)
            op.searchType = newValues.searchType;
        if (newValues.searchText != null)
            op.searchText = newValues.searchText;
        this.setState({ defaults });
    }

    render() {
        var selected = this.getSelected(this.props.name);
        var opName = selected && selected.name;
        return (
            <div>
                <Header title={this.getSelectedTitle()} onSidebarToggle={e => this.toggleSidebar()} />
                <div id="body" style={{ position: 'absolute', top: 90, display: 'flex', flexDirection: 'row', width: '100%', height: '100%' }}>
                    <Sidebar hide={this.state.sidebarHidden} name={opName}                        
                        viewerArgs={this.state.viewerArgs}
                        operations={this.state.operations}
                        />
                    <Content
                        baseUrl={this.props.metadata.config.serviceBaseUrl}
                        selected={selected}
                        defaults={this.getDefaults(this.props.name)}
                        implicitConventions={this.props.metadata.config.implicitConventions}
                        viewerArgs={this.state.viewerArgs}
                        onChange={args => this.onContentChange(opName, args)}
                        />
                </div>
            </div>
        );
    }
}
