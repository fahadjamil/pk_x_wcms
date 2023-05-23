// import { TOGGLE_WEBSITE } from '../action';

const initialState = {
    // page: 'Website Settings'
};

export default function pageName(state = initialState, action) {
    switch (action.type) {
        case 'SWITCH_PAGE':
            return { page: action.page }
        default:
            return state;
    }
}


