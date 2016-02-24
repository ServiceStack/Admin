/// <reference path='../typings/main.d.ts'/>
System.register(['react'], function(exports_1, context_1) {
    "use strict";
    var __moduleName = context_1 && context_1.id;
    var __extends = (this && this.__extends) || function (d, b) {
        for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
    var React;
    var ColumnPrefsDialog;
    return {
        setters:[
            function (React_1) {
                React = React_1;
            }],
        execute: function() {
            ColumnPrefsDialog = (function (_super) {
                __extends(ColumnPrefsDialog, _super);
                function ColumnPrefsDialog(props, context) {
                    _super.call(this, props, context);
                    this.state = {};
                }
                ColumnPrefsDialog.prototype.resetFields = function () {
                    var fields = [];
                    this.props.onChange({ fields: fields });
                };
                ColumnPrefsDialog.prototype.selectField = function (field) {
                    var fields = (this.props.values.fields || []);
                    if (fields.indexOf(field) >= 0)
                        fields = fields.filter(function (x) { return x !== field; });
                    else
                        fields.push(field);
                    this.props.onChange({ fields: fields });
                };
                ColumnPrefsDialog.prototype.render = function () {
                    var _this = this;
                    var fields = (this.props.values.fields || []);
                    var CheckboxStyle = {
                        verticalAlign: 'text-bottom', fontSize: '20px', margin: '0 5px 0 0'
                    };
                    return (React.createElement("div", {id: "column-prefs-dialog"}, React.createElement("div", {className: "dialog-wrapper", onClick: function (e) { return _this.props.onClose(); }}, React.createElement("div", {className: "dialog", onClick: function (e) { return e.stopPropagation(); }}, React.createElement("div", {className: "dialog-header"}, React.createElement("h3", null, "Column Preferences")), React.createElement("div", {className: "dialog-body"}, React.createElement("div", {onClick: function (e) { return _this.resetFields(); }, style: {
                        borderBottom: '1px solid #ccc', padding: '0 0 10px 0', margin: '0 0 15px 0', cursor: 'pointer'
                    }}, React.createElement("i", {className: "material-icons", style: CheckboxStyle}, fields.length === 0 ? 'radio_button_checked' : 'radio_button_unchecked'), React.createElement("span", null, "Show all columns")), this.props.fields.map(function (f) { return (React.createElement("div", {onClick: function (e) { return _this.selectField(f.name); }, style: { margin: '0 0 5px 0', cursor: 'pointer' }}, React.createElement("i", {className: "material-icons", style: CheckboxStyle}, fields.indexOf(f.name) >= 0 ? 'check_box' : 'check_box_outline_blank'), React.createElement("span", null, f.name))); })), React.createElement("div", {className: "dialog-footer", style: { textAlign: 'right' }}, React.createElement("div", {className: "btnText", onClick: function (e) { return _this.props.onClose(); }}, React.createElement("span", null, "DONE")))))));
                };
                return ColumnPrefsDialog;
            }(React.Component));
            exports_1("default", ColumnPrefsDialog);
        }
    }
});
//# sourceMappingURL=ColumnPrefsDialog.js.map