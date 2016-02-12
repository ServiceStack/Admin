/// <reference path='../typings/main.d.ts'/>

import * as React from 'react';
import { render } from 'react-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Content from './Content';
import 'jquery';
import 'ss-utils';

export default class App extends React.Component<any, any> {
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

    selectQuery(name) {
        const operation = this.state.operations[name];
        const from = this.state.types[operation.from];
        const defaults = this.state.defaults;
        const viewerArgs = this.state.viewerArgs[name] || {};
        const op = defaults[name] || {};
        op.searchField = op.searchField || viewerArgs["DefaultSearchField"];
        op.searchType = op.searchType || viewerArgs["DefaultSearchType"];
        op.searchText = op.searchText || viewerArgs["DefaultSearchText"];
        defaults[name] = op;

        this.setState({ selected: { name, operation, from }, defaults });
    }

    render() {
        var opName = this.state.selected && this.state.selected.name;
        return (
            <div>
                <Header title={this.getSelectedTitle() } onSidebarToggle={this.toggleSidebar} />
                <div id="body" style={{ position: 'absolute', top: 90, display: 'flex', flexDirection: 'row', width: '100%', height: '100%' }}>
                    <Sidebar hide={this.state.sidebarHidden} name={opName}                        
                        viewerArgs={this.state.viewerArgs}
                        operations={this.state.operations}
                        onChange={op => this.selectQuery(op) }
                        />
                    <Content selected={this.state.selected} defaults={this.state.defaults[opName]}
                        implicitConventions={this.props.metadata.config.implicitConventions}
                        viewerArgs={this.state.viewerArgs}
                        />
                </div>
            </div>
        );
    }
}
