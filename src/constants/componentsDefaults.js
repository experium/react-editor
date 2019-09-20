import React from 'react';
import uniqid from 'uniqid';
import range from 'ramda/src/range';

import Checkboxes, { CheckboxesField } from '../components/formElements/Checkboxes';
import RadioButtons, { RadioButtonsField } from '../components/formElements/RadioButtons';
import Range, { RangeField } from '../components/formElements/Range';
import Editor from '../components/formElements/Editor';
import EditorComponent from '../components/formElements/EditorComponent';
import Video, { Video as VideoComponent } from '../components/formElements/Video';
import File, { FileField } from '../components/formElements/File';

const renderInfo = (prop = 'label') => props => <div dangerouslySetInnerHTML={{ __html: props[prop] }} />;

const COMPONENTS_DEFAULTS = placeholder => ([
    {
        type: 'Editor',
        name: 'Текст',
        icon: 'font',
        renderInfo: renderInfo('content'),
        component: Editor,
        formComponent: EditorComponent,
        props: {
            content: '<p><br></p>'
        },
        staticContent: true,
        fields: [
            { type: 'editor', label: 'Текст', prop: 'content' }
        ]
    },
    {
        type: 'Checkboxes',
        name: 'Множественный выбор',
        icon: 'check-square-o',
        renderInfo: renderInfo(),
        component: Checkboxes,
        formComponent: CheckboxesField,
        fieldType: 'checkbox',
        props: {
            label: 'Множественный выбор',
            options: range(0, 3).map(i => ({
                label: `${placeholder || 'выбор'} ${i}`,
                id: uniqid('checkboxes_option_')
            }))
        },
        ableCorrect: true,
        fields: [
            { type: 'editor', label: 'Название поля', prop: 'label', props: { short: true }},
            { type: 'multiple', label: 'Ответы', prop: 'options', fieldArray: true },
            { type: 'input', label: 'Вес вопроса', prop: 'questionWeight', props: { number: true }},
            { type: 'switch', label: 'Обязательное поле', prop: 'required' },
            { type: 'switch', label: 'Выводить варианты в случайном порядке', prop: 'allowShuffle' },
            { type: 'switch', label: 'Отображать варианты по горизонтали', prop: 'inline' }
        ]
    },
    {
        type: 'Radio',
        name: 'Выбор',
        icon: 'dot-circle-o',
        renderInfo: renderInfo(),
        component: RadioButtons,
        formComponent: RadioButtonsField,
        fieldType: 'radio',
        props: {
            label: 'Выбор',
            options: range(0, 3).map(i => ({
                label: `${placeholder || 'выбор'} ${i}`,
                id: uniqid('radiobuttons_option_')
            }))
        },
        ableCorrect: true,
        fields: [
            { type: 'editor', label: 'Название поля', prop: 'label', props: { short: true }},
            { type: 'multiple', label: 'Ответы', prop: 'options', fieldArray: true },
            { type: 'input', label: 'Вес вопроса', prop: 'questionWeight', props: { number: true }},
            { type: 'switch', label: 'Обязательное поле', prop: 'required' },
            { type: 'switch', label: 'Выводить варианты в случайном порядке', prop: 'allowShuffle' },
            { type: 'switch', label: 'Отображать варианты по горизонтали', prop: 'inline' }
        ]
    },
    {
        type: 'Range',
        name: 'Слайдер',
        icon: 'sliders',
        renderInfo: renderInfo(),
        component: Range,
        formComponent: RangeField,
        fieldType: 'range',
        props: {
            label: 'Слайдер',
            step: 1,
            defaultValue: 3,
            minValue: 1,
            maxValue: 5,
            minLabel: 'Минимум',
            maxLabel: 'Максимум'
        },
        fields: [
            { type: 'editor', label: 'Название поля', prop: 'label', props: { short: true }},
            { type: 'input', label: 'Значение по-умолчанию', prop: 'defaultValue', props: { number: true }},
            { type: 'input', label: 'Шаг', prop: 'step', props: { number: true }},
            { type: 'input', label: 'Минимальное значение', prop: 'minValue', props: { number: true }},
            { type: 'input', label: 'Название минимального значения', prop: 'minLabel'},
            { type: 'input', label: 'Максимальное значение', prop: 'maxValue', props: { number: true }},
            { type: 'input', label: 'Название максимального значения', prop: 'maxLabel'},
            { type: 'switch', label: 'Обязательное поле', prop: 'required' },
            { type: 'input', label: 'Вес вопроса', prop: 'questionWeight', props: { number: true }}
        ]
    },
    {
        type: 'Video',
        name: 'Видео',
        icon: 'video-camera',
        component: Video,
        formComponent: VideoComponent,
        staticContent: true,
        props: {
            width: 560,
            height: 350
        },
        fields: [
            { type: 'input', label: 'Ссылка на видео', prop: 'src' },
            { type: 'input', label: 'Высота', prop: 'width', props: { number: true }},
            { type: 'input', label: 'Ширина', prop: 'height', props: { number: true }}
        ]
    },
    {
        type: 'File',
        name: 'Файл',
        icon: 'file-o',
        renderInfo: renderInfo(),
        component: File,
        formComponent: FileField,
        props: {
            label: 'Файл'
        },
        fields: [
            { type: 'editor', label: 'Название поля', prop: 'label', props: { short: true }}
        ]
    }
]);

export default COMPONENTS_DEFAULTS;
