import * as React from 'react';
import { render } from 'react-dom';
import { Link } from 'react-router-dom';
import { splitOnFirst } from 'servicestack-client';

import { BasePath } from './shared';

export default class Sidebar extends React.Component<any, any> {
    constructor(props?, context?) {
        super(props, context);
        this.state = { filter: undefined };
    }

    handleFilter(e) {
        this.setState({ filter: e.target.value.toLowerCase() });
    }

    renderIcon(name) {
        var iconUrl = this.props.viewerArgs[name]["IconUrl"];
        if (iconUrl) {
            if (iconUrl.startsWith('material-icons:'))
                return (<i className="material-icons">{splitOnFirst(iconUrl, ':')[1]}</i>);
            if (iconUrl.startsWith('octicon:'))
                return (<span className={"mega-octicon octicon-" + splitOnFirst(iconUrl, ':')[1]}></span>);
            return (<img src={iconUrl} />);
        }
        return (<i className="material-icons">search</i>);
    }

    render() {
        return (
            <div id="sidebar">
                <div className="inner">
                    <div id="aq-filter">
                        <input type="text" placeholder="filter" style={{ margin: "10px 15px" }}
                            onChange={e => this.handleFilter(e)} value={this.state.filter} />
                    </div>
                    <div id="aq-list">
                        {Object.keys(this.props.operations)
                            .filter(op => this.state.filter == null || op.toLowerCase().indexOf(this.state.filter) >= 0)
                            .map((op,i) => (
                            <div key={i} className={"aq-item" + (op === this.props.name ? " active" : "")}>
                                {this.renderIcon(op)}
                                <Link to={BasePath + "ss_admin/autoquery/" + op}>{op}</Link>
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        );
    }
}