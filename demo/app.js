import React from 'react';
import ReactDOM from 'react-dom';

import { FormBuilder, FormGenerator } from '../src/index';

const saveState = !!window.location.search;
const isPreview = saveState && window.location.search.includes('preview=1');
const state = localStorage.getItem('editor:data');

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
        <FormBuilder
            uploadUrl='/api/files'
            downloadUrl={id => `/api/files/${id}/view`}
            uploadImages={true}
            placeholder='Тестовый выбор'
            submitText='Отправить'
            data={saveState && state ? JSON.parse(state) : undefined}
            onChange={data => saveState && localStorage.setItem('editor:data', JSON.stringify(data))}
        />
    ),
    document.getElementById('root')
);
