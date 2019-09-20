import React, { Component } from 'react';
import cx from 'classnames';

import EditorComponent from '../formElements/EditorComponent';
import withFieldWrapper from '../../hocs/withFieldWrapper';
import styles from '../../css/editor.scss';

class Editor extends Component {
    onChange = (_, value) => {
        this.props.onChange(value);
    };

    render() {
        const { short, input: { value }} = this.props;

        return <div className={cx(styles.editorField, 'editor-field')}>
            <EditorComponent
                isEditor
                onChange={this.onChange}
                value={value}
                path='value'
                short={short} />
        </div>;
    }
}

export default withFieldWrapper(Editor);
