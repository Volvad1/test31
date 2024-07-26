import menu from '/templates/menu.html';
import {showUserinfo} from '/modules/header/menu/__user-info/menu__user-info.js';
import {logout} from '/modules/header/menu/__logout/menu__logout.js';
import {showMenuNavigation} from '/modules/header/menu/__about-user/menu__about-user';

export const showHeaderContent = function (name, id) {
    const headerContent = document.querySelector('.header__content');
    headerContent.innerHTML = menu;
    showUserinfo(name, id);

    const aboutUser = document.querySelector('.menu__about-user');
    if (aboutUser) {
        aboutUser.addEventListener('click', showMenuNavigation);
    }

    const logOutBtn = document.querySelector('.menu__logout');
    if (logOutBtn) {
        logOutBtn.addEventListener('click', (event) => {
            event.preventDefault();
            logout();
        });
    }
};
