export const showPopup = function () {
    showErrorMessage();
    popupControl();
};

const showErrorMessage = function () {
    const authErrorMessage = document.querySelector('#error-message');
    authErrorMessage.classList.add('show');
    document.body.classList.add('lock');
};

const popupControl = function () {
    const activePopup = document.querySelector('.popup.show');
    if (activePopup) {
        const popupOpenBtn = document.querySelector('.error-message__link');
        if (popupOpenBtn) {
            popupOpenBtn.addEventListener('click', (event) => {
                event.preventDefault();
                const needlyPopup = popupOpenBtn.getAttribute('href');
                const currentOpenedPopup = document.querySelector(`${needlyPopup}`);
                if (currentOpenedPopup) {
                    currentOpenedPopup.classList.add('show');
                    document.body.classList.add('lock');
                    activePopup.classList.remove('show');
                    popupClose(currentOpenedPopup);
                }
            });
        }
        popupClose(activePopup);
    }
};

const popupClose = function (popup) {
    document.addEventListener('keydown', (event) => {
        if (event.code === 'Escape') {
            popup.classList.remove('show');
            document.body.classList.remove('lock');
        }
    });
    document.addEventListener('click', (event) => {
        if (event.target.closest('.btn-close') || !event.target.closest('.popup__body')) {
            popup.classList.remove('show');
            document.body.classList.remove('lock');
        }
    });
};
