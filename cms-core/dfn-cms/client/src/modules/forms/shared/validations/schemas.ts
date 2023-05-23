export const addFormValidationSchema = {
    formTitle: {
        type: 'string',
        min: 2,
        messages: {
            string: 'Form title is required and it must be string',
            stringMin:
                'Form title is required and it must be greater than or equal to 2 characters long',
        },
    },
    customCollection: {
        type: 'string',
        min: 2,
        messages: {
            string: 'Mapped custom collection is required',
            stringMin:
                'Mapped custom collection is required and it must be greater than or equal to 2 characters long',
        },
    },
};
