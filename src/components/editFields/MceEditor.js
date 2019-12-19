import React, { Component } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import cx from 'classnames';

import withFieldWrapper from '../../hocs/withFieldWrapper';
import styles from '../../css/editorInput.scss';

class MceEditor extends Component {
    render() {
        const { input: { value }, onChange, short } = this.props;

        return <div className={cx(styles.editorInput, { [styles.editorInputShort]: short })}>
            <Editor
                value={value}
                onEditorChange={onChange}
                inline
                init={{
                    plugins: 'image lists link',
                    menubar: false,
                    language: 'ru',
                    language_url: '/translations/ru.js',
                    toolbar: short ?
                        'undo redo | bold italic underline | forecolor backcolor | link | removeformat' :
                        'undo redo | formatselect | fontsizeselect | bold italic underline | forecolor backcolor | bullist numlist | image | link | removeformat',
                    images_upload_handler: (info, success) => {
                        const fr = new FileReader();

                        fr.readAsDataURL(info.blob());
                        fr.onload = () => success(fr.result);
                    }
                }} />
        </div>;
    }
}

export default withFieldWrapper(MceEditor);
