export const getFromStorage = function (key) {
    return JSON.parse(localStorage.getItem(key) || '[]');
};

export const addToStorage = function (obj, key) {
    const storageData = getFromStorage(key);
    storageData.push(obj);
    localStorage.setItem(key, JSON.stringify(storageData));
};

export const generateTestUser = function (User) {
    const testUser = new User('test', 'qwerty123');
    const admin = new User('admin', '1234');
    const arr = getFromStorage('users');
    const searchResult = arr.find((item) => item.login == testUser.login);
    if (!searchResult) {
        User.save(testUser);
        User.save(admin);
    }
};

export const getCookie = function (name) {
    let matches = document.cookie.match(
        new RegExp('(?:^|; )' + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + '=([^;]*)')
    );
    return matches ? decodeURIComponent(matches[1]) : undefined;
};

export const setCookie = function (login) {
    const data = {
        isAdmin: login == 'admin' ? true : false,
        name: login,
    };
    document.cookie = `currentUser=${JSON.stringify(data)}; max-age=${86400 * 365}; samesite=lax`;
};

export const getCurrentUser = function () {
    if (!document.cookie.includes('currentUser')) return;
    const currentUser = JSON.parse(getCookie('currentUser'));
    const currentUserName = currentUser.name;
    const users = getFromStorage('users');
    return users.find((user) => user.login == currentUserName);
};

export const checkUserRole = function () {
    if (!document.cookie.includes('currentUser')) return false;
    const currentUser = JSON.parse(getCookie('currentUser'));
    return currentUser.isAdmin;
};
