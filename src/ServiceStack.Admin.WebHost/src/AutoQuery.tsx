/// <reference path='../typings/main.d.ts'/>

import * as React from 'react';
import { render } from 'react-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Content from './Content';
import ColumnPrefsDialog from './ColumnPrefsDialog';
import 'jquery';
import 'ss-utils';

export default class AutoQuery extends React.Component<any, any> {
    constructor(props?, context?) {
        super(props, context);
        this.state = {
            basePath: location.pathname.substring(0, location.pathname.indexOf("/ss_admin") + 1)
        };

        $.getJSON(this.state.basePath + "autoquery/metadata", r =>
            this.setState({ metadata: $.ss.normalize(r, true), name: this.props.params.name }));
    }

    render() {
        return this.state.metadata
            ? <App basePath={this.state.basePath} metadata={this.state.metadata} name={this.props.params.name} />
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

        var operationState = {};
        var json = localStorage.getItem("v1/operationState");
        if (json)
            operationState = JSON.parse(json);

        this.state = {
            sidebarHidden: false, selected: null, 
            operationState, operationNames, viewerArgs, operations, types            
        };
    }

    toggleSidebar() {
        this.setState({ sidebarHidden: !this.state.sidebarHidden });
    }

    getType(name: string) {
        return this.props.metadata.types.filter(op => op.name === name)[0];
    }

    getAutoQueryViewer(name:string) {
        const type = this.getType(name);
        return type != null && type.attributes != null
            ? type.attributes.filter(attr => attr.name === "AutoQueryViewer")[0]
            : null;
    }

    getAutoQueryViewerArgValue(name:string, argName:string) {
        var aqViewer = this.getAutoQueryViewer(name);
        var arg = aqViewer
            ? aqViewer.args.filter(x => x.name === argName)[0]
            : null;
        return arg != null
            ? arg.value
            : null;
    }

    getTitle(selected) {
        return selected
            ? this.getAutoQueryViewerArgValue(selected.name, 'Title') || selected.name
            : null;
    }

    getOperationValues(name: string) {
        const viewerArgs = this.state.viewerArgs[name] || {};
        return Object.assign({
            searchField: viewerArgs["DefaultSearchField"] || "",
            searchType: viewerArgs["DefaultSearchType"] || "",
            searchText: viewerArgs["DefaultSearchText"],
            conditions: []
        }, this.state.operationState[name] || {});
    }

    getSelected(name: string) {
        const operation = this.state.operations[name];
        if (operation == null)
            return null;
        const requestType = this.state.types[name];
        const fromType = this.state.types[operation.from];
        const toType = this.state.types[operation.to];
        return { name, operation, requestType, fromType, toType};
    }

    onOperationChange(name: string, newValues: any) {
        const op = this.getOperationValues(name);

        Object.keys(newValues).forEach(k => {
            if (newValues[k] != null)
                op[k] = newValues[k];
        });

        this.setOperationValues(name, op);
    }

    addCondition(name:string) {
        const op = this.getOperationValues(name);
        const condition = {
            id: `${op.searchField}|${op.searchType}|${op.searchText}`,
            searchField: op.searchField,
            searchType: op.searchType,
            searchText: op.searchText
        };

        if (op.conditions.some(x => x.id === condition.id))
            return;

        op.searchText = "";
        op.conditions.push(condition);

        this.setOperationValues(name, op);
    }

    removeCondition(name: string, condition:any) {
        const op = this.getOperationValues(name);
        op.conditions = op.conditions.filter(x => x.id !== condition.id);
        this.setOperationValues(name, op);
    }

    setOperationValues(name, op) {
        var operationState = Object.assign({}, this.state.operationState);
        operationState[name] = op;
        this.setState({ operationState });
        localStorage.setItem("v1/operationState", JSON.stringify(operationState));
    }

    showDialog(dialog) {
        this.setState({ dialog });
        setTimeout(() => document.getElementById(dialog).classList.toggle('active'), 0);
    }

    hideDialog() {
        this.setState({ dialog: null });
    }

    render() {
        var selected = this.getSelected(this.props.name);
        var opName = selected && selected.name;
        return (
            <div style={{ height: '100%' }}>
                <Header title={this.getTitle(selected)} onSidebarToggle={e => this.toggleSidebar() } />
                <div id="body" style={{ display:'flex', height:'100%' }}>
                    <div style={{ height: '100%', display: 'flex', flexDirection: 'row' }}>
                        <Sidebar basePath={this.props.basePath}
                            hide={this.state.sidebarHidden} name={opName}                        
                            viewerArgs={this.state.viewerArgs}
                            operations={this.state.operations}
                            />
                        <Content
                            config={this.props.metadata.config}
                            selected={selected}
                            values={this.getOperationValues(this.props.name)}
                            conventions={this.props.metadata.config.implicitconventions}
                            viewerArgs={this.state.viewerArgs[opName]}
                            onChange={args => this.onOperationChange(opName, args)}
                            onAddCondition={e => this.addCondition(opName)}
                            onRemoveCondition={c => this.removeCondition(opName, c) }
                            onShowDialog={id => this.showDialog(id)}
                            />
                    </div>
                </div>

                {this.state.dialog !== "column-prefs-dialog" ? null : (
                    <ColumnPrefsDialog onClose={e => this.hideDialog() }
                        type={selected.toType}
                        values={this.getOperationValues(this.props.name)}
                        onChange={args => this.onOperationChange(opName, args) }
                        />
                )}
            </div>
        );
    }
}
