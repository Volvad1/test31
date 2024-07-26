import {User} from '/models/User.js';
import {Task} from '/models/Tasks.js';
import {getFromStorage} from '/js/utils.js';
import removeBtn from '/templates/remove-button.html';
import {tasksControl} from '/modules/content/tasks/tasks.js';
// панель управления админа
export const adminPanelControl = function () {
    addNewUser();
    showUsers();
    selectUser();
    // кнопки для удаления пользователя
    document.addEventListener('click', (event) => {
        if (event.target.closest('.admin-panel__btn_remove')) {
            const userList = getFromStorage('users');
            const choisedUser = event.target.closest('.admin-panel__user');
            const choisedUserId = choisedUser.getAttribute('data-user-id');
            const users = userList.filter((user) => user.id !== choisedUserId);
            localStorage.setItem('users', `${JSON.stringify(users)}`);
            showUsers();
        }
    });
    // показывает задачи выбранного пользователя
    function selectUser() {
        document.addEventListener('click', (event) => {
            const content = document.querySelector('.content');
            if (event.target.classList.contains('admin-panel__user')) {
                event.stopImmediatePropagation();
                document.querySelectorAll('.admin-panel__user').forEach((item) => {
                    item.classList.remove('active');
                });
                event.target.classList.add('active');
                content.classList.remove('hint');
                if (!content.classList.contains('hint')) {
                    document.querySelector('.admin-panel__hint').style.display = 'none';
                }
                const choicedUserId = event.target.getAttribute('data-user-id');
                document.cookie = `choisedUser=${JSON.stringify(choicedUserId)}; sameSite=lax; max-age=${86400 * 365}`;
                const choicedUser = getFromStorage('users').find((citeUser) => citeUser.id == choicedUserId);
                tasksControl(choicedUser, 'admin-mode');
            }
        });
    }
    // показывает список пользователей
    function showUsers() {
        const users = getFromStorage('users');
        const usersList = document.querySelector('.admin-panel__users-list');
        usersList.innerHTML = '';
        if (users && users.length > 0) {
            users.forEach((user) => {
                if (user.login !== 'admin') {
                    const li = document.createElement('li');
                    li.classList.add('admin-panel__user');
                    li.textContent = user.login;
                    li.setAttribute('data-user-id', user.id);
                    li.insertAdjacentHTML('afterbegin', removeBtn);
                    usersList.append(li);
                }
            });
        }
    }
    // добавляет нового пользователя
    function addNewUser() {
        const adminPanelBtnAdd = document.querySelector('.admin-panel__btn_add');
        if (adminPanelBtnAdd) {
            adminPanelBtnAdd.addEventListener('click', (event) => {
                event.stopImmediatePropagation();
                event.preventDefault();
                adminPanelBtnAdd.classList.remove('show');
                adminPanelForm.classList.add('show');

                document.addEventListener('click', (event) => {
                    if (!event.target.closest('.admin-panel__form')) {
                        adminPanelBtnAdd.classList.add('show');
                        adminPanelForm.classList.remove('show');
                    }
                });
            });
        }
        const adminPanelForm = document.querySelector('.admin-panel__form');
        if (adminPanelForm) {
            adminPanelForm.addEventListener('submit', (event) => {
                event.preventDefault();
                removeMessage();
                const login = document.querySelector('.admin-panel__input_login');
                const pass = document.querySelector('.admin-panel__input_password');

                if (login.value !== '' && pass.value !== '') {
                    const newUser = new User(login.value, pass.value);
                    const tasks = new Task(newUser);
                    Object.assign(newUser, newUser, tasks);
                    User.save(newUser);
                    setTimeout(createMessage, 500, adminPanelForm, adminPanelBtnAdd);
                    showUsers();
                }
            });
        }
        // создает сообщение
        function createMessage(form, btn) {
            const text = document.createElement('p');
            text.classList.add('admin-panel__message');
            text.textContent = 'User added successfully';
            form.after(text);
            form.classList.remove('show');
            btn.classList.add('show');
            setTimeout(() => text.remove(), 2000);
        }
        // удаляет сообщение
        function removeMessage() {
            const message = document.querySelector('.admin-panel__message');
            if (message) message.remove();
        }
    }
};
