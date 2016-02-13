/// <reference path='../typings/main.d.ts'/>
System.register(['react'], function(exports_1) {
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var React;
    var Header;
    return {
        setters:[
            function (React_1) {
                React = React_1;
            }],
        execute: function() {
            Header = (function (_super) {
                __extends(Header, _super);
                function Header() {
                    _super.apply(this, arguments);
                }
                Header.prototype.render = function () {
                    var _this = this;
                    return (React.createElement("div", {"id": "header", "style": { display: 'flex', flexDirection: 'row', zIndex: 1 }}, React.createElement("i", {"className": "material-icons", "style": { cursor: 'pointer' }, "onClick": function (e) { return _this.props.onSidebarToggle(); }}, "menu"), React.createElement("h1", null, "AutoQuery"), this.props.title == null ? React.createElement("div", {"style": { flex: 1 }}) : (React.createElement("div", {"id": "header-content", "style": { display: 'flex', flex: 1 }}, React.createElement("div", null, React.createElement("div", {"className": "seperator"})), React.createElement("h2", null, this.props.title), React.createElement("div", {"style": { margin: 'auto', flex: 1 }})))));
                };
                return Header;
            })(React.Component);
            exports_1("default", Header);
        }
    }
});
//# sourceMappingURL=Header.js.map