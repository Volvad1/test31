export const showMenuNavigation = function () {
    const menu = document.querySelector('.menu');
    menu.classList.toggle('active');

    document.addEventListener('click', (event) => {
        if (!event.target.closest('.menu')) {
            menu.classList.remove('active');
        }
    });
};
