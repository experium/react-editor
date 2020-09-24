import React, { Component } from 'react';
import { Radio } from 'antd';

import withFieldWrapper from '../../hocs/withFieldWrapper';

class RadioButtons extends Component {
    static defaultProps = {
        options: []
    };

    onChange = e => this.props.onChange(e.target.value);

    render() {
        const { options, defaultValue, input: { value }} = this.props;

        return <Radio.Group value={value}
            defaultValue={defaultValue}
            onChange={this.onChange}>
            { options.map(option =>
                <Radio.Button value={option || ''} key={`option-${option}`}>
                    { option || '-' }
                </Radio.Button>
            )}
        </Radio.Group>;
    }
}

export default withFieldWrapper(RadioButtons);
