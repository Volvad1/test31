import {User} from '../models/User.js';

export const authUser = function (login, password) {
    const user = new User(login, password);
    if (!user.hasAccess) return false;
    return true;
};

export const authCheck = function () {
    if (!document.cookie.includes('currentUser')) return false;
    return true;
};
