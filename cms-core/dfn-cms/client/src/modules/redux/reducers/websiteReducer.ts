// import { TOGGLE_WEBSITE } from '../action';

const initialState = {
    // website: '',
    // languages: [
    //     { language: 'English', langKey: 'EN', direction: 'ltr' },
    //     { language: 'Arabic', langKey: 'AR', direction: 'rtl' },
    // ]
};

export default function websiteReducer(state = initialState, action) {
    switch (action.type) {
        case 'TOGGLE_WEBSITE':
            return { website: action.website }
        default:
            return state;
    }
}

