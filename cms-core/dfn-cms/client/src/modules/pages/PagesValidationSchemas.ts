export const pageInfoSchema = {
    pageName: {
        type: 'string',
        empty: false,
        min: 2,
        messages: {
            string: 'Page name field is required and it must be string.',
            stringEmpty: 'Page name field is required.',
            stringMin: 'Page name field must be greater than or equal to 2 characters long.',
        },
    },
    masterTemplate: {
        type: 'string',
        empty: false,
        messages: {
            string: 'Master template field must be string.',
            stringEmpty: 'Please select a master template from drop down.',
        },
    },
    path: {
        type: 'string',
        pattern: /^$|^[a-z0-9-_/]+$/g,
        optional: true,
        messages: {
            string: 'Page path must be string.',
            stringPattern: 'Invalid page path. Please provide a valid page path.',
        },
    },
    externalCSS: {
        type: 'array',
        unique: true,
        items: {
            type: 'string',
            optional: true,
            pattern: /^$|^[a-z0-9.-_/]+$/g,
            messages: {
                string: 'External CSS field must be string.',
                stringPattern: 'Invalid URL. Please provide a valid URL.',
            },
        },
        messages: {
            arrayUnique: 'Cannot duplicate External CSS URL fields.',
        },
    },
    externalJS: {
        type: 'array',
        unique: true,
        items: {
            type: 'string',
            optional: true,
            pattern: /^$|^[a-z-_/]+$/g,
            messages: {
                string: 'External JS field must be string.',
                stringPattern: 'Invalid URL. Please provide a valid URL.',
            },
        },
        messages: {
            arrayUnique: 'Cannot duplicate External JS URL fields.',
        },
    },
    applicationName: {
        type: 'string',
        optional: true,
        pattern: /^$|^[a-zA-Z 0-9]+$/g,
        messages: {
            string: 'Application name field must be string.',
            stringPattern: 'Invalid field data. Please provide a valid data.',
        },
    },
    author: {
        type: 'string',
        optional: true,
        pattern: /^$|^[a-zA-Z 0-9]+$/g,
        messages: {
            string: 'Author field must be string.',
            stringPattern: 'Invalid field data. Please provide a valid data.',
        },
    },
    description: {
        type: 'string',
        optional: true,
        pattern: /^$|^[a-zA-Z 0-9]+$/g,
        messages: {
            string: 'Description field must be string.',
            stringPattern: 'Invalid field data. Please provide a valid data.',
        },
    },
    keywords: {
        type: 'string',
        optional: true,
        pattern: /^$|^[a-zA-Z 0-9]+$/g,
        messages: {
            string: 'Keuwords field must be string.',
            stringPattern: 'Invalid field data. Please provide a valid data.',
        },
    },
    viewPort: {
        type: 'string',
        optional: true,
        pattern: /^$|^[a-zA-Z 0-9]+$/g,
        messages: {
            string: 'Viewport field must be string.',
            stringPattern: 'Invalid field data. Please provide a valid data.',
        },
    },
};
