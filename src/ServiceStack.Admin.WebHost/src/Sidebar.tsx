/// <reference path='../typings/main.d.ts'/>

import * as React from 'react';
import { render } from 'react-dom';
import 'jquery';
import 'ss-utils';

export default class Sidebar extends React.Component<any, any> {
    constructor(props?, context?) {
        super(props, context);
        this.state = { filter: null, defaults: {} };
    }

    handleFilter(e) {
        this.setState({ filter: e.target.value.toLowerCase() });
    }

    renderIcon(name) {
        var iconUrl = this.props.viewerArgs[name]["IconUrl"];
        if (iconUrl) {
            if (iconUrl.startsWith('material-icons:'))
                return (<i className="material-icons">{$.ss.splitOnFirst(iconUrl, ':')[1]}</i>);
            if (iconUrl.startsWith('octicon:'))
                return (<span className={"mega-octicon octicon-" + $.ss.splitOnFirst(iconUrl, ':')[1]}></span>);
            return (<img src={iconUrl} />);
        }
        return (<i className="material-icons">search</i>);
    }

    render() {
        return (
            <div id="sidebar" className={this.props.hide ? ' hide' : ''}>
                <div id="aq-filter">
                    <input type="text" placeholder="filter" style={{ margin: "10px 15px" }}
                        onChange={e => this.handleFilter(e)} value={this.state.filter} />
                </div>
                <div id="aq-list">
                    {Object.keys(this.props.operations)
                        .filter(op => this.state.filter == null || op.toLowerCase().indexOf(this.state.filter) >= 0)
                        .map(op => (
                        <div className={"aq-item" + (op === this.props.name ? " active" : "")} onClick={e => this.props.onChange(op)}>
                            {this.renderIcon(op)}
                            <div>{op}</div>
                        </div>
                    ))}
                </div>
            </div>
        );
    }
}