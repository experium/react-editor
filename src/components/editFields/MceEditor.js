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
                { ({ mceLanguageUrl, mceOnInit }) =>
                    <Editor
                        value={value}
                        onEditorChange={(value, event) => onChange(value || null, event)}
                        inline={!hidePreview}
                        init={{
                            plugins: 'autoresize image lists link table code paste',
                            min_height: 350,
                            menubar: !short,
                            language: 'ru',
                            branding: false,
                            paste_as_text: true,
                            fontsize_formats: '8px 10px 12px 14px 18px 24px 36px',
                            content_style: hidePreview ? `
                                ol, li, ul, span { color: rgba(0, 0, 0, 0.65); font-size: 14px; font-family: 'Roboto', sans-serif; }
                                div { color: rgba(0, 0, 0, 0.65); color: rgba(0, 0, 0, 0.65); }
                                h1 { font-size: 28px; font-weight: 500; margin-bottom: 0.5em; color: rgba(0, 0, 0, 0.85); font-family: 'Roboto', sans-serif; }
                                h1 span { font-size: 28px; color: rgba(0, 0, 0, 0.85); font-family: 'Roboto', sans-serif; }
                                h2 { font-size: 21px; font-weight: 500; margin-bottom: 0.5em; color: rgba(0, 0, 0, 0.85); font-family: 'Roboto', sans-serif; }
                                h2 span { font-size: 21px; color: rgba(0, 0, 0, 0.85); font-family: 'Roboto', sans-serif; }
                                h3 { font-size: 16.38px; font-weight: 500; margin-bottom: 0.5em; color: rgba(0, 0, 0, 0.85); font-family: 'Roboto', sans-serif; }
                                h3 span { font-size: 16.38px; color: rgba(0, 0, 0, 0.85); font-family: 'Roboto', sans-serif; }
                                h4 { font-size: 14px; font-weight: 500; margin-bottom: 0.5em; color: rgba(0, 0, 0, 0.85); font-family: 'Roboto', sans-serif; }
                                h4 span { font-size: 14px; color: rgba(0, 0, 0, 0.85); font-family: 'Roboto', sans-serif; }
                                h5 { font-size: 11.62px; font-weight: 500; margin-bottom: 0.5em; color: rgba(0, 0, 0, 0.85); font-family: 'Roboto', sans-serif; }
                                h5 span { font-size: 11.62px; color: rgba(0, 0, 0, 0.85); font-family: 'Roboto', sans-serif; }
                                h6 { font-size: 9.38px; font-weight: 500; margin-bottom: 0.5em; color: rgba(0, 0, 0, 0.85); font-family: 'Roboto', sans-serif; }
                                h6 span { font-size: 9.38px; color: rgba(0, 0, 0, 0.85); font-family: 'Roboto', sans-serif; }
                                p { margin-top: 0; margin-bottom: 1em; color: rgba(0, 0, 0, 0.65); font-size: 14px; font-family: 'Roboto', sans-serif; }
                            ` : null,
                            content_css: ['https://fonts.googleapis.com/css?family=Roboto:400,700&display=swap&subset=cyrillic'],
                            language_url: mceLanguageUrl || '/translations/ru.js',
                            toolbar_drawer: 'sliding',
                            font_formats: 'Andale Mono=andale mono,monospace;' +
                                'Arial=arial,helvetica,sans-serif;' +
                                'Arial Black=arial black,sans-serif;' +
                                'Book Antiqua=book antiqua,palatino,serif;' +
                                'Comic Sans MS=comic sans ms,sans-serif;' +
                                'Courier New=courier new,courier,monospace;' +
                                'Georgia=georgia,palatino,serif;' +
                                'Helvetica=helvetica,arial,sans-serif;' +
                                'Impact=impact,sans-serif;' +
                                'Roboto=Roboto,sans-serif;' +
                                'Symbol=symbol;' +
                                'Tahoma=tahoma,arial,helvetica,sans-serif;' +
                                'Terminal=terminal,monaco,monospace;' +
                                'Times New Roman=times new roman,times,serif;' +
                                'Trebuchet MS=trebuchet ms,geneva,sans-serif;' +
                                'Verdana=verdana,geneva,sans-serif;' +
                                'Webdings=webdings;' +
                                'Wingdings=wingdings,zapf dingbats',
                            toolbar: short ?
                                'undo redo | bold italic underline | forecolor backcolor | link | removeformat' :
                                'formatselect | fontselect | fontsizeselect | bold italic strikethrough underline forecolor backcolor | alignleft aligncenter alignright alignjustify | removeformat | bullist numlist outdent indent | link image | code',
                            images_upload_handler: (info, success) => {
                                const fr = new FileReader();

                                fr.readAsDataURL(info.blob());
                                fr.onload = () => success(fr.result);
                            },
                            setup: editor => {
                                editor.on('init', ed => {
                                    ed.target.editorCommands.execCommand('fontName', false, 'Roboto');

                                    if (mceOnInit) {
                                        mceOnInit(ed);
                                    }
                                });
                                editor.on('BeforeSetContent', e => {
                                    if (e.content.startsWith('<table ')) {
                                        e.content = `<div class="table-wrap">${e.content}</div>`;
                                    }
                                });
                            }
                        }} />
                }
            </MceLanguageUrl.Consumer>
        </div>;
    }
}

export default withFieldWrapper(MceEditor);
