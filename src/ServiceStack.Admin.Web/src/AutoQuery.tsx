import * as React from 'react';
import { render } from 'react-dom';
import Header from './Header';
import Sidebar from './Sidebar';
import Content from './Content';
import ColumnPrefsDialog from './ColumnPrefsDialog';

import { client, normalize } from './shared';

export default class AutoQuery extends React.Component<any, any> {
    constructor(props?, context?) {
        super(props, context);
        this.state = { metadata: null };

        client.get("/autoquery/metadata").then(r => {
            const metadata = normalize(r, true);
            this.setState({ metadata, name: this.getName() })
        });
    }

    render() {
        return this.state.metadata
            ? <App metadata={this.state.metadata} name={this.getName()} />
            : null;
    }

    getName() {
        return this.props.match.params.name || "";
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

    resolveProperties(type) {
        var props = (type.properties || []).slice(0);

        let inherits = type.inherits;
        while (inherits) {
            const t = this.state.types[inherits.name];
            if (!t && !t.properties) continue;
            t.properties.forEach(p => props.push(p));
            inherits = t.inherits;
        }

        return props;
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
            conditions: [],
            queries: []
        }, this.state.operationState[name] || {});
    }

    getSelected(name: string) {
        const operation = this.state.operations[name];
        if (operation == null)
            return null;
        const requestType = this.state.types[name];
        const fromType = this.state.types[operation.from];
        const toType = this.state.types[operation.to];
        return {
            name, operation, requestType,
            fromType, fromTypeFields: this.resolveProperties(toType),
            toType, toTypeFields: this.resolveProperties(toType)
        };
    }

    onOperationChange(opName: string, newValues: any) {
        const op = this.getOperationValues(opName);

        Object.keys(newValues).forEach(k => {
            if (newValues[k] != null)
                op[k] = newValues[k];
        });

        this.setOperationValues(opName, op);
    }

    addCondition(opName:string) {
        const op = this.getOperationValues(opName);
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

        this.setOperationValues(opName, op);
    }

    removeCondition(opName: string, condition:any) {
        const op = this.getOperationValues(opName);
        op.conditions = op.conditions.filter(x => x.id !== condition.id);
        this.setOperationValues(opName, op);
    }

    setOperationValues(opName, op) {
        var operationState = Object.assign({}, this.state.operationState);
        operationState[opName] = op;
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

    saveQuery(opName:string) {
        const name = prompt("Save Query as:", "My Query");
        if (!name) return;

        const op = this.getOperationValues(opName);
        if (!op.queries) {
            op.queries = [];
        }

        op.queries.push({
            name,
            searchField: op.searchField,
            searchType: op.searchType,
            searchText: op.searchText,
            conditions: op.conditions.map(x => Object.assign({}, x))
        });

        this.setOperationValues(opName, op);
    }

    removeQuery(opName: string, query: any) {
        const op = this.getOperationValues(opName);
        if (!op.queries) return;
        op.queries = op.queries.filter(x => x.name != query.name);
        this.setOperationValues(opName, op);
    }

    loadQuery(opName: string, query: any) {
        const op = this.getOperationValues(opName);
        op.searchField = query.searchField;
        op.searchType = query.searchType;
        op.searchText = query.searchText;
        op.conditions = query.conditions;
        this.setOperationValues(opName, op);
    }

    render() {
        var selected = this.getSelected(this.props.name);
        var opName = selected && selected.name;
        return (
            <div style={{ height: '100%' }}>
                <Header title={this.getTitle(selected)} onSidebarToggle={e => this.toggleSidebar() } />
                <div id="body" className={this.state.sidebarHidden ? 'hide-sidebar' : ''}>
                    <div className="inner">
                        <Sidebar
                            name={opName}                        
                            viewerArgs={this.state.viewerArgs}
                            operations={this.state.operations}
                            />
                        <Content
                            config={this.props.metadata.config}
                            userinfo={this.props.metadata.userinfo}
                            selected={selected}
                            values={this.getOperationValues(this.props.name)}
                            conventions={this.props.metadata.config.implicitconventions}
                            viewerArgs={this.state.viewerArgs[opName]}
                            onChange={args => this.onOperationChange(opName, args)}
                            onAddCondition={e => this.addCondition(opName)}
                            onRemoveCondition={c => this.removeCondition(opName, c) }
                            onShowDialog={id => this.showDialog(id) }
                            onSaveQuery={() => this.saveQuery(opName) }
                            onRemoveQuery={x => this.removeQuery(opName, x) }
                            onLoadQuery={x => this.loadQuery(opName, x) }
                            />
                    </div>
                </div>

                {this.state.dialog !== "column-prefs-dialog" ? null : (
                    <ColumnPrefsDialog onClose={e => this.hideDialog() }
                        fields={selected.toTypeFields}
                        values={this.getOperationValues(this.props.name)}
                        onChange={args => this.onOperationChange(opName, args) }
                        />
                )}
            </div>
        );
    }
}
