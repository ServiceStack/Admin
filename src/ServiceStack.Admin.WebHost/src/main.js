/// <reference path='../typings/main.d.ts'/>
System.register(['react', 'react-dom', './App'], function(exports_1) {
    var React, react_dom_1, App_1;
    return {
        setters:[
            function (React_1) {
                React = React_1;
            },
            function (react_dom_1_1) {
                react_dom_1 = react_dom_1_1;
            },
            function (App_1_1) {
                App_1 = App_1_1;
            }],
        execute: function() {
            react_dom_1.render(React.createElement(App_1.default), document.getElementById('app'));
        }
    }
});
//# sourceMappingURL=main.js.map