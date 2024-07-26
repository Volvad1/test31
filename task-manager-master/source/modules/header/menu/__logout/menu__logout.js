import {showDefaultContent} from '/modules/content/content.js';

export const logout = function () {
    document.cookie = 'currentUser=""; max-age=-1; samesite=lax';
    showDefaultContent();
    location.reload();
};
