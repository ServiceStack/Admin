/// <reference path='../typings/main.d.ts'/>

import * as React from 'react';
import { render } from 'react-dom';

export default class App extends React.Component<any, any> {
    constructor(props?, context?) {
        super(props, context);
        this.state = { sidebarHidden: false };
    }

    toggleSidebar() {
        this.setState({ sidebarHidden: !this.state.sidebarHidden });
    }

    render() {
        return (
            <div>
                <div id="header" style={{ display: 'flex', flexDirection: 'row' }}>
                    <i className="material-icons" style={{ cursor: 'pointer' }} onClick={e => this.toggleSidebar()}>menu</i>
                    <h1>AutoQuery</h1>
                    <div id="header-content" style={{ display: 'flex', flex: 1 }}>
                        <div>
                            <div className="seperator"></div>
                        </div>
                        <h2>StackOverflowQuery</h2>
                        <div></div>
                        <form style={{ flex: 1, display: 'flex', background: '#f5f5f5', borderRadius: 2, height: 40, lineHeight: '40px', padding: '0 0 0 10px' }}>
                            <label className="material-icons" style={{ margin: 'auto', padding: '0 5px 0 0'}} htmlFor="txtSearch">search</label>
                            <input type="text" id="txtSearch" style={{ flex: 1, margin: 'auto', background: 'none', border: 'none', fontSize: '18px', color: '#676767' }} />
                        </form>
                        <div style={{ margin: 'auto', flex: 1}}></div>
                    </div>
                </div>
                <div id="body" style={{position: 'absolute', top: 90, display:'flex', flexDirection: 'row', width: '100%', height: '100%' }}>
                    <div id="sidebar" className={this.state.sidebarHidden ? ' hide' : ''}>
                        <div id="aq-list">
                            <div className="aq-item">
                                <i className="material-icons">backup</i>
                                <div>Item 1</div>
                            </div>
                            <div className="aq-item">
                                <i className="material-icons">android</i>
                                <div>Item 2</div>
                            </div>
                            <div className="aq-item active">
                                <i className="material-icons">build</i>
                                <div>Item 3</div>
                            </div>
                        </div>
                    </div>
                    <div id="content" style={{flex: 1}}>
                        <h2>Content</h2>
                    </div>
                </div>
            </div>
        );
    }
}
