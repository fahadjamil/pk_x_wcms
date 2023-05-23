import CKEditor from '@ckeditor/ckeditor5-react';
import ClassicEditor from 'ckeditor5-build-classic';
import React from 'react';
import RichTextPropTypeModel from '../models/RichTextPropTypeModel';

function RichTextComponent(props: RichTextPropTypeModel) {
    const { id, label, data, config, disabled, onInit, onBlur, onFocus, onError } = props;

    const defaultConfig = {
        toolbar: [
            'heading',
            '|',
            'bold',
            'italic',
            'link',
            'bulletedList',
            'numberedList',
            'blockQuote',
        ],
        heading: {
            options: [
                { model: 'paragraph', title: 'Paragraph', class: 'ck-heading_paragraph' },
                { model: 'heading1', view: 'h1', title: 'Heading 1', class: 'ck-heading_heading1' },
                { model: 'heading2', view: 'h2', title: 'Heading 2', class: 'ck-heading_heading2' },
            ],
        },
        placeholder: 'Enter your content here...',
    };

    const handleValueChange = (event: any, editor: any) => {
        props.handleValueChange(event, editor);
    };

    return (
        <>
            <CKEditor
                editor={ClassicEditor}
                data={data ? data : ''}
                config={config ? config : defaultConfig}
                disabled={disabled ? disabled : false}
                key={id}
                onInit={onInit ? onInit : undefined}
                onBlur={onBlur ? onBlur : undefined}
                onFocus={onFocus ? onFocus : undefined}
                onError={onError ? onError : undefined}
                onChange={handleValueChange}
            />
        </>
    );
}

export default RichTextComponent;
