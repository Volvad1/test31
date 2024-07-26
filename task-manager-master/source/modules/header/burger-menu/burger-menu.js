export const burger = document.querySelector('.burger-menu');
export const showAuthForm = function () {
    burger.addEventListener('click', () => {
        burger.classList.toggle('open');
        document.querySelector('.header .login-form').classList.toggle('show');
    });
};
