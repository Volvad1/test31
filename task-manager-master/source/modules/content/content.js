import tasks from '/templates/tasks.html';
import noAccessMessage from '/templates/no-access-message.html';
import defaultMessage from '/templates/default-message.html';
import loginForm from '/templates/login-form.html';
import adminPanel from '/templates/admin-panel.html';
import hint from '/templates/hint-for-admin.html';

const content = document.querySelector('.content');

export const showContent = function () {
    content.innerHTML = tasks;
};

export const showAdminContent = function () {
    content.classList.add('admin-content', 'hint');
    content.innerHTML = '';
    content.insertAdjacentHTML('beforeend', adminPanel);
    content.insertAdjacentHTML('beforeend', hint);
    content.insertAdjacentHTML('beforeend', tasks);
};

export const showAuthErrorMessage = function () {
    content.innerHTML = noAccessMessage;
};

export const showDefaultContent = function () {
    document.querySelector('.header__content').innerHTML = loginForm;
    content.innerHTML = defaultMessage;
    document.querySelector('.footer').innerHTML = '';
};
