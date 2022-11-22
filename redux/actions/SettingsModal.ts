import {ReduxTypes} from '../ReduxTypes';

export const showModalSettings = () => {
    return {
        type: ReduxTypes.SHOW_MODAL_SETTINGS,
    };
};

export const hideModalSettings = () => {
    return {
        type: ReduxTypes.HIDE_MODAL_SETTINGS,
    };
};
