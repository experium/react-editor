import React, { Component } from 'react';
import { Editor } from '@tinymce/tinymce-react';
import cx from 'classnames';

import withFieldWrapper from '../../hocs/withFieldWrapper';
import styles from '../../css/editorInput.scss';
import MceLanguageUrl from '../../contexts/MceLanguageUrl';

class MceEditor extends Component {
    render() {
        const { input: { value }, onChange, short, hidePreview } = this.props;

        return <div className={cx({ [styles.editorInputShort]: short, [styles.editorInput]: !hidePreview })}>
            <MceLanguageUrl.Consumer>
                { languageUrl =>
                    <Editor
                        value={value}
                        onEditorChange={onChange}
                        inline={!hidePreview}
                        init={{
                            plugins: 'image lists link table',
                            menubar: false,
                            language: 'ru',
                            branding: false,
                            content_style: hidePreview ? `
                                div { color: rgba(0, 0, 0, 0.65); font-size: 14px; color: rgba(0, 0, 0, 0.65); font-size: 14px; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'PingFang SC', 'Hiragino Sans GB', 'Microsoft YaHei', 'Helvetica Neue', Helvetica, Arial, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji', 'Segoe UI Symbol' }
                                h1 { font-size: 28px; font-weight: 500; margin-bottom: 0.5em; color: rgba(0, 0, 0, 0.85); }
                                h2 { font-size: 21px; font-weight: 500; margin-bottom: 0.5em; color: rgba(0, 0, 0, 0.85); }
                                h3 { font-size: 16.38px; font-weight: 500; margin-bottom: 0.5em; color: rgba(0, 0, 0, 0.85); }
                                h4 { font-size: 14px; font-weight: 500; margin-bottom: 0.5em; color: rgba(0, 0, 0, 0.85); }
                                h5 { font-size: 11.62px; font-weight: 500; margin-bottom: 0.5em; color: rgba(0, 0, 0, 0.85); }
                                h6 { font-size: 9.38px; font-weight: 500; margin-bottom: 0.5em; color: rgba(0, 0, 0, 0.85); }
                                p { margin-top: 0; margin-bottom: 1em; color: rgba(0, 0, 0, 0.65); font-size: 14px; }
                                ol, li, ul, span { color: rgba(0, 0, 0, 0.65); font-size: 14px; }
                            ` : null,
                            language_url: languageUrl || '/translations/ru.js',
                            toolbar_drawer: 'sliding',
                            toolbar: short ?
                                'undo redo | bold italic underline | forecolor backcolor | link | removeformat' :
                                'undo redo | formatselect | fontselect fontsizeselect | bold italic underline |  alignleft aligncenter alignright alignjustify | forecolor backcolor | bullist numlist | image | link | table tabledelete | tableprops tablerowprops tablecellprops | tableinsertrowbefore tableinsertrowafter tabledeleterow | tableinsertcolbefore tableinsertcolafter tabledeletecol | removeformat',
                            images_upload_handler: (info, success) => {
                                const fr = new FileReader();

                                fr.readAsDataURL(info.blob());
                                fr.onload = () => success(fr.result);
                            }
                        }} />
                }
            </MceLanguageUrl.Consumer>
        </div>;
    }
}

export default withFieldWrapper(MceEditor);
