import React, { useState } from 'react';
import ReactDOM from 'react-dom';

import { FormBuilder, FormGenerator } from '../src/index';

const saveState = !!window.location.search;
const isPreview = saveState && window.location.search.includes('preview=1');
const state = localStorage.getItem('editor:data');
const uploadImages = false;

const Builder = () => {
    const [copyItemState, setCopyItemState] = useState(null);

    return (
        <FormBuilder
            uploadUrl={() => uploadImages ? '/api/files' : undefined}
            downloadUrl={id => `/api/files/${id}/view`}
            uploadImages={uploadImages}
            withoutUrl={!uploadImages}
            placeholder='Тестовый выбор'
            submitText='Отправить'
            data={saveState && state ? JSON.parse(state) : undefined}
            copyItemData={copyItemState}
            onChange={data => saveState && localStorage.setItem('editor:data', JSON.stringify(data))}
            onCopy={item => setCopyItemState(item) }
            mceOnInit={editor => {
                editor.target.editorCommands.execCommand('fontSize', false, '17px');
            }}
        />
    );
};

ReactDOM.render(
    isPreview ? (
        <FormGenerator
            data={saveState && state ? JSON.parse(state) : undefined}
            values={saveState && state ? JSON.parse(state).result : undefined}
            uploadUrl='/api/files'
            downloadUrl={id => `/api/files/${id}/view`}
            onSubmit={result => {
                localStorage.setItem('editor:data', JSON.stringify({
                    ...JSON.parse(state),
                    result,
                }));
            }}
        />
    ) : (
        <Builder />
    ),
    document.getElementById('root')
);
