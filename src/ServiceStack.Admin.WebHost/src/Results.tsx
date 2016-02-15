/// <reference path='../typings/main.d.ts'/>

import * as React from 'react';
import { render } from 'react-dom';
import { Link } from 'react-router';
import 'jquery';
import 'ss-utils';

export default class Results extends React.Component<any, any> {
    renderValue(o: any) {
        return $.isArray(o)
            ? o.join(', ') 
            : typeof o == "undefined"
            ? "" 
            : typeof o == "object"
                ? JSON.stringify(o)
                : o + "";
    }

    formatString(s: string) {
        if (s) {
            if (s.startsWith("http"))
                return <a href={s} target="_blank">{s.substring(s.indexOf('://') + 3) }</a>;

            if (s.toLowerCase() === "false")
                return <i className="material-icons" style={{ color:'#FF8A80', fontSize:'14px' }}>remove_circle</i>;
            if (s.toLowerCase() === "true")
                return <i className="material-icons" style={{ color:'#66BB6A', fontSize:'14px' }}>check_circle</i>;
        }

        return <span>{s}</span>;
    }

    render() {
        var Results = <div className="results-none">There were no results</div>;

        var results = this.props.results;
        if (results && results.length > 0) {
            var fieldNames = this.props.fieldNames || Object.keys(results[0]);
            var fieldWidths = this.props.fieldWidths || {};

            var orderBy = (this.props.values.orderBy || '');
            var orderByName = orderBy.startsWith('-') ? orderBy.substr(1) : orderBy;

            Results = (
                <table className="results">
                    <thead><tr className="noselect">{ fieldNames.map(f => (
                        <th key={f} style={{ cursor: 'pointer' }}
                            onClick={e => this.props.onOrderByChange(f !== orderByName ? '-' + f : !orderBy.startsWith('-') ? '' : orderByName) }>

                            { $.ss.humanize(f) }

                            { f !== orderByName ? null :
                                <i className="material-icons" style={{fontSize:'18px',verticalAlign:'bottom'}}>{orderBy.startsWith('-') ? "arrow_drop_down" : "arrow_drop_up"}</i>}
                        </th>
                    )) }</tr></thead>
                    <tbody>
                        { results.map((r,i) => (
                            <tr key={i}>
                                {fieldNames.map((f, j) => (
                                    <td key={j} title={this.renderValue(r[f]) } style={fieldWidths[f.toLowerCase()] ? { maxWidth: fieldWidths[f.toLowerCase()] } : {}}>
                                        { this.formatString(this.renderValue(r[f])) }
                                    </td>
                                )) }
                            </tr>)
                        ) }
                        </tbody>
                </table>             
            );
        }

        return Results;
    }
}