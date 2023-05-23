import { TOGGLE_WEBSITE } from "./actionTypes";
import { SWITCH_PAGE } from "./actionTypes";

export const selectWebsite = website => {
    return {
        type: TOGGLE_WEBSITE,
        website
    };
};

export const switchPage = page => {
    return {
        type: SWITCH_PAGE,
        page
    };
};