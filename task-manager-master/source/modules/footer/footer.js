import footerContent from '/templates/footer.html';
import {showFooterInfo} from './__tasks-info/footer__tasks-info.js';

export const showFooterContent = function () {
    document.querySelector('.footer').innerHTML = footerContent;
    showFooterInfo();
};
