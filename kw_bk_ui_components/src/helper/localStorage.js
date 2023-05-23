const validate = () => {
    if (typeof window !== 'undefined') {
        return window && window.localStorage;
    } else {
        return false;
    }
};

export const saveOnBrowserStorage = (key, value) =>
    validate() && window.localStorage.setItem(key, JSON.stringify(value));

export const retrieveBrowserStorage = (key) =>
    validate() && JSON.parse(window.localStorage.getItem(key));

export const removeBrowserStorage = (key) => validate() && window.localStorage.removeItem(key);

export const clearBrowserStorage = () => validate() && window.localStorage.clear();
