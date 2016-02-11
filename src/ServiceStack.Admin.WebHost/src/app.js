/// <reference path='../typings/main.d.ts'/>
System.register(['react'], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var React;
    var App;
    return {
        setters:[
            function (React_1) {
                React = React_1;
            }],
        execute: function() {
            App = (function (_super) {
                __extends(App, _super);
                function App(props, context) {
                    _super.call(this, props, context);
                    this.state = { sidebarHidden: false };
                }
                App.prototype.toggleSidebar = function () {
                    this.setState({ sidebarHidden: !this.state.sidebarHidden });
                };
                App.prototype.render = function () {
                    var _this = this;
                    return (React.createElement("div", null, React.createElement("div", {"id": "header", "style": { display: 'flex', flexDirection: 'row' }}, React.createElement("i", {"className": "material-icons", "style": { cursor: 'pointer' }, "onClick": function (e) { return _this.toggleSidebar(); }}, "menu"), React.createElement("h1", null, "AutoQuery"), React.createElement("div", {"id": "header-content", "style": { display: 'flex', flex: 1 }}, React.createElement("div", null, React.createElement("div", {"className": "seperator"})), React.createElement("h2", null, "StackOverflowQuery"), React.createElement("div", null), React.createElement("form", {"style": { flex: 1, display: 'flex', background: '#f5f5f5', borderRadius: 2, height: 40, lineHeight: '40px', padding: '0 0 0 10px' }}, React.createElement("label", {"className": "material-icons", "style": { margin: 'auto', padding: '0 5px 0 0' }, "htmlFor": "txtSearch"}, "search"), React.createElement("input", {"type": "text", "id": "txtSearch", "style": { flex: 1, margin: 'auto', background: 'none', border: 'none', fontSize: '18px', color: '#676767' }})), React.createElement("div", {"style": { margin: 'auto', flex: 1 }}))), React.createElement("div", {"id": "body", "style": { position: 'absolute', top: 90, display: 'flex', flexDirection: 'row', width: '100%', height: '100%' }}, React.createElement("div", {"id": "sidebar", "className": this.state.sidebarHidden ? ' hide' : ''}, React.createElement("div", {"id": "aq-list"}, React.createElement("div", {"className": "aq-item"}, React.createElement("i", {"className": "material-icons"}, "backup"), React.createElement("div", null, "Item 1")), React.createElement("div", {"className": "aq-item"}, React.createElement("i", {"className": "material-icons"}, "android"), React.createElement("div", null, "Item 2")), React.createElement("div", {"className": "aq-item active"}, React.createElement("i", {"className": "material-icons"}, "build"), React.createElement("div", null, "Item 3")))), React.createElement("div", {"id": "content", "style": { flex: 1 }}, React.createElement("h2", null, "Content")))));
                };
                return App;
            })(React.Component);
            exports_1("default", App);
        }
    }
});
//# sourceMappingURL=app.js.map