import '../css/main.css';
import {User} from '../models/User.js';
import {adminPanelControl} from '/modules/content/admin-panel/admin-panel.js';
import {generateTestUser, setCookie, getCurrentUser, checkUserRole} from './utils.js';
import {authUser, authCheck} from './auth.js';
import {showAuthErrorMessage, showContent, showAdminContent, showDefaultContent} from '/modules/content/content.js';
import {tasksControl} from '/modules/content/tasks/tasks.js';
import {showPopup} from '/modules/popup/popup.js';
import {showAuthForm, burger} from '/modules/header/burger-menu/burger-menu.js';
import {showHeaderContent} from '/modules/header/__content/header__content.js';
import {showFooterContent} from '/modules/footer/footer.js';

generateTestUser(User);
startSession();

document.addEventListener('submit', (event) => {
    if (event.target.closest('.login-form')) {
        event.preventDefault();
        const loginForm = event.target.closest('.login-form');
        const formData = new FormData(loginForm);
        const login = formData.get('login');
        const password = formData.get('password');
        if (authUser(login, password)) {
            setCookie(login);
            startSession();
        } else {
            showPopup();
            showAuthErrorMessage();
        }
    }
});

function startSession() {
    const authorized = authCheck();
    if (!authorized) {
        burger.classList.add('show');
        showAuthForm();
        showDefaultContent();
        return;
    } else {
        burger.classList.remove('show');
        const currentUser = getCurrentUser();
        showHeaderContent(currentUser.login, currentUser.id);
        const isAdmin = checkUserRole();
        if (isAdmin) {
            showAdminContent();
            adminPanelControl();
        } else {
            showContent();
            tasksControl(currentUser);
        }

        showFooterContent();
    }
}
