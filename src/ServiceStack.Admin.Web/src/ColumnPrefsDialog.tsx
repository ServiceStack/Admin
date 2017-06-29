import * as React from 'react';
import { render } from 'react-dom';

export default class ColumnPrefsDialog extends React.Component<any, any> {
    constructor(props?, context?) {
        super(props, context);
        this.state = {};
    }

    resetFields() {
        var fields = [];
        this.props.onChange({ fields });
    }

    selectField(field) {
        let fields = (this.props.values.fields || []);

        if (fields.indexOf(field) >= 0)
            fields = fields.filter(x => x !== field);
        else
            fields.push(field);

        this.props.onChange({ fields });
    }

    render() {
        var fields = (this.props.values.fields || []);

        var CheckboxStyle = {
            verticalAlign: 'text-bottom', fontSize: '20px', margin: '0 5px 0 0'
        };

        return (
            <div id="column-prefs-dialog">
                <div className="dialog-wrapper" onClick={e => this.props.onClose()}>
                    <div className="dialog" onClick={e => e.stopPropagation() }>

                        <div className="dialog-header">
                            <h3>Column Preferences</h3>
                        </div>

                        <div className="dialog-body">
                            <div onClick={e => this.resetFields()} style={{
                                     borderBottom: '1px solid #ccc', padding: '0 0 10px 0', margin: '0 0 15px 0', cursor: 'pointer'
                                }}>
                                <i className="material-icons" style={CheckboxStyle}>
                                    {fields.length === 0 ? 'radio_button_checked' : 'radio_button_unchecked'}
                                </i>
                                <span>Show all columns</span>
                            </div>

                            {this.props.fields.map(f => (
                                <div onClick={e => this.selectField(f.name)} style={{ margin: '0 0 5px 0', cursor: 'pointer' }}>
                                    <i className="material-icons"  style={CheckboxStyle}>
                                        {fields.indexOf(f.name) >= 0 ? 'check_box' : 'check_box_outline_blank'}
                                        </i>
                                    <span>{f.name}</span>
                                </div>
                            ))}
                        </div>

                        <div className="dialog-footer" style={{textAlign:'right'}}>
                            <div className="btnText" onClick={e => this.props.onClose()}>
                                <span>DONE</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}