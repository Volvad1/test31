import {Task} from '/models/Tasks.js';
import taskButtons from '/templates/task-buttons.html';
import {getFromStorage, getCookie} from '/js/utils.js';
import {showFooterContent} from '/modules/footer/footer.js';

// управление задачами обычного пользователя
export const tasksControl = function (user, settings) {
    const backLogBtnSubmit = document.querySelector('.tasks_backlog .tasks__btn_submit');
    const backLogList = document.querySelector('.tasks_backlog .tasks__list');
    const backLogBtnAdd = document.querySelector('.tasks_backlog .tasks__btn_add');
    const tasksReadyList = document.querySelector('.tasks_ready .tasks__list');
    const tasksReadyAddBtn = document.querySelector('.tasks_ready .tasks__btn_add');
    const tasksInProgressList = document.querySelector('.tasks_in-progress .tasks__list');
    const tasksInProgressBtn = document.querySelector('.tasks_in-progress .tasks__btn');
    const tasksFinishedList = document.querySelector('.tasks_finished .tasks__list');
    const tasksFinishedBtn = document.querySelector('.tasks_finished .tasks__btn');
    const tasks = new Task(user);
    Object.assign(user, user, tasks);
    getUserTasks(user);
    user = getNeededUser();
    showTasks(user.tasks.backLogList, backLogList); // показываем задачи
    showTasks(user.tasks.readyTasks, tasksReadyList);
    showTasks(user.tasks.inProgressTasks, tasksInProgressList);
    showTasks(user.tasks.finishedTasks, tasksFinishedList);
    dragAndDropTasks();
    saveUserTasks(user); // сохраняем задачи
    checkEmptyTasksList(tasksReadyAddBtn, tasksInProgressBtn, tasksFinishedBtn); // проверяет пустые списки
    showFooterContent(); // отображает актуальное кол-во задач в списках в футере
    // кнопки добавления задач
    backLogBtnAdd.addEventListener('click', (event) => {
        event.stopImmediatePropagation();
        user = getNeededUser();
        const inputField = document.createElement('input');
        createTask(inputField);
        addTask(inputField, backLogList, 'add');
    });
    // кнопки для удаления задачи из списка
    document.addEventListener('click', (event) => {
        if (event.target.closest('.tasks__btn_remove')) {
            event.stopImmediatePropagation();
            user = getNeededUser();
            const section = event.target.closest('.tasks');
            if (section) {
                event.target.closest('.tasks__list-item').remove();
                const currentList = document.querySelector(`.${section.classList[1]} .tasks__list`);
                const tasks = Object.entries(currentList.childNodes).map((item) => item[1].innerText);
                user.tasks[currentList.getAttribute('id')] = tasks;
                saveUserTasks(user);
                checkEmptyTasksList(tasksReadyAddBtn, tasksInProgressBtn, tasksFinishedBtn);
                showFooterContent();
            }
        }
    });
    // кнопки для редактирования задач
    document.addEventListener('click', (event) => {
        if (event.target.closest('.tasks__btn_edit')) {
            event.stopImmediatePropagation();
            disableBtns();
            user = getNeededUser();
            const task = event.target.closest('.tasks__list-item');
            const taskIndex = +task.getAttribute('index');
            const previosElement = task.previousElementSibling;
            const currentList = event.target.closest('.tasks__list');
            const listName = currentList.getAttribute('id');
            const currentBtnAdd = currentList.parentNode.querySelector('.tasks__btn_add');
            const currentBtnSubmit = currentList.parentNode.querySelector('.tasks__btn_submit');
            task.remove();
            const tasksInput = document.querySelector('.tasks__input');
            if (tasksInput) tasksInput.remove();
            const inputField = document.createElement('input');
            inputField.value = task.textContent;
            inputField.classList.add('tasks__input');
            inputField.setAttribute('placeholder', 'task description');
            previosElement ? previosElement.after(inputField) : currentList.prepend(inputField);
            inputField.addEventListener('input', () => {
                if (inputField.value !== '') {
                    disableBtns();
                    backLogBtnAdd.classList.remove('disable');
                    setDefaultBtnSettings(currentBtnAdd, currentBtnSubmit);
                    inputField.addEventListener('focusout', () => {
                        replaceBtn(currentBtnAdd, currentBtnSubmit);
                        const allTasksButtons = document.querySelectorAll(
                            '.tasks__btn_add, .tasks__btn_edit, .tasks__btn_remove'
                        );
                        allTasksButtons.forEach((item) => item.classList.remove('disable'));
                    });
                } else {
                    replaceBtn(currentBtnAdd, currentBtnSubmit);
                    backLogBtnAdd.classList.add('disable');
                }
            });
            addTask(inputField, currentList, 'edit', previosElement, taskIndex, listName);
        }

        // блокирует кнопки
        function disableBtns() {
            const allTasksButtons = document.querySelectorAll('.tasks__btn_add, .tasks__btn_edit, .tasks__btn_remove');
            allTasksButtons.forEach((btn) => btn.classList.add('disable'));
        }
    });
    // кнопка для добавления задачи в список Ready
    tasksReadyAddBtn.addEventListener('click', (event) => {
        event.stopImmediatePropagation();
        user = getNeededUser();
        tasksReadyAddBtn.classList.remove('show');
        const tasksReadyDropdown = document.querySelector('.tasks_ready .dropdown__list');
        showDropdown(tasksReadyDropdown, backLogList);
        moveTasks();
    });
    // кнопка для добавления задачи в список InProgress
    tasksInProgressBtn.addEventListener('click', (event) => {
        event.stopImmediatePropagation();
        user = getNeededUser();
        tasksInProgressBtn.classList.remove('show');
        const tasksInProgressDropdown = document.querySelector('.tasks_in-progress .dropdown__list');
        showDropdown(tasksInProgressDropdown, tasksReadyList);
        moveTasks();
    });
    // кнопка для добавления задачи в список Finished
    tasksFinishedBtn.addEventListener('click', (event) => {
        event.stopImmediatePropagation();
        user = getNeededUser();
        tasksFinishedBtn.classList.remove('show');
        const tasksFinishedDropdown = document.querySelector('.tasks_finished .dropdown__list');
        showDropdown(tasksFinishedDropdown, tasksInProgressList);
        moveTasks();
    });
    // отображает задачи в указанной секции
    function showTasks(tasksList, section) {
        let index = 0;
        section.innerHTML = '';
        tasksList.forEach((item) => {
            const li = document.createElement('li');
            li.classList.add('tasks__list-item');
            li.setAttribute('index', index++);
            li.textContent = item;
            if (li.textContent !== '') section.append(li);
            li.insertAdjacentHTML('beforeend', taskButtons);
        });
    }
    // получаем задачи
    function getUserTasks(user) {
        const currentUser = getFromStorage('users').find((siteUser) => siteUser.id === user.id);
        if (currentUser.tasks) user.tasks = currentUser.tasks;
        saveUserTasks(user);
    }
    // сохраняет задачи
    function saveUserTasks(user) {
        const data = getFromStorage('users')
            .filter((neededUser) => neededUser.id !== user.id)
            .concat(user);
        localStorage.clear();
        localStorage.setItem('users', JSON.stringify(data));
    }
    // создает поле ввода для описания задачи
    function createTask(input) {
        setDefaultBtnSettings(backLogBtnAdd, backLogBtnSubmit);
        const tasksInput = document.querySelector('.tasks__input');
        if (tasksInput) tasksInput.remove();
        input.classList.add('tasks__input');
        input.setAttribute('placeholder', 'task description');
        backLogList.append(input);
        const coordY = backLogList.lastElementChild.getBoundingClientRect().top + scrollY;
        backLogList.scrollTo({top: coordY, behavior: 'smooth'});

        document.addEventListener('click', (event) => {
            if (!event.target.closest('.tasks_backlog')) {
                if (input) input.remove();
                replaceBtn(backLogBtnAdd, backLogBtnSubmit);
            }
        });
    }
    // добавляет задачу в список
    function addTask(input, list, settings, prevElem, index, listName) {
        const li = document.createElement('li');
        li.classList.add('tasks__list-item');
        input.addEventListener('input', () => {
            li.textContent = input.value;
            if (input.value !== '') {
                input.addEventListener('focusout', (event) => {
                    event.stopImmediatePropagation();
                    input.remove();
                    if (settings == 'add') {
                        li.setAttribute('index', `${list.childNodes.length}`);
                        user.tasks.backLogList.push(li.textContent);
                        backLogList.append(li);
                        replaceBtn(backLogBtnAdd, backLogBtnSubmit);
                    } else if (settings == 'edit') {
                        li.setAttribute('index', `${index}`);
                        user.tasks[listName].splice(index, 1, input.value);
                        prevElem ? prevElem.after(li) : list.prepend(li);
                    }
                    li.insertAdjacentHTML('beforeend', taskButtons);
                    saveUserTasks(user);
                    showFooterContent();
                    tasksReadyAddBtn.classList.remove('disable');
                });
            }
        });
    }
    // создает и показывает дропдаун
    function showDropdown(dropdown, taskList) {
        dropdown.closest('.tasks').classList.add('show');
        dropdown.innerHTML = '';
        taskList.childNodes.forEach((task) => {
            if (task.classList.contains('tasks__list-item')) {
                const dropdownElement = task.cloneNode(true);
                dropdownElement.className = 'tasks__dropdown-item';
                dropdown.append(dropdownElement);
            }
        });
    }
    // перемещает задачу из одного списка в другой по клику на элемент дропдауна
    function moveTasks() {
        document.addEventListener('click', (event) => {
            event.stopImmediatePropagation();
            user = getNeededUser();
            if (event.target.closest('.dropdown') || event.target.closest('.dropdown__list')) {
                const currentSection = event.target.closest('.tasks');
                const currentTasksList = currentSection.querySelector('.tasks__list');
                const previosTasksList = currentSection.previousElementSibling.querySelector('.tasks__list');

                const currentInputField = currentSection.querySelector('.dropdown__input');
                currentInputField.addEventListener('input', () => {
                    currentSection.querySelector('.dropdown__list').childNodes.forEach((elem) => {
                        if (!elem.textContent.toLowerCase().includes(currentInputField.value.toLowerCase())) {
                            elem.style.display = 'none';
                        } else {
                            elem.style.display = 'block';
                        }
                    });
                });

                const currentDropdownItem = event.target.closest('.tasks__dropdown-item');
                if (currentDropdownItem) {
                    const needlyIndex = currentDropdownItem.getAttribute('index');
                    const needlyTask = previosTasksList.querySelector(`li[index="${needlyIndex}"]`);
                    if (needlyTask) {
                        needlyTask.setAttribute('index', `${currentTasksList.childNodes.length}`);
                        currentTasksList.append(needlyTask);
                        user.tasks[previosTasksList.getAttribute('id')].splice(needlyIndex, 1);
                        user.tasks[currentTasksList.getAttribute('id')].push(needlyTask.innerText);
                        saveUserTasks(user);
                        const coordY = currentTasksList.lastElementChild.getBoundingClientRect().top + scrollY;
                        currentTasksList.scrollTo({top: coordY, behavior: 'smooth'});
                        currentSection.classList.remove('show');
                        currentDropdownItem.remove();
                        currentSection.querySelector('.tasks__btn_add').classList.add('show');
                    }
                    checkEmptyTasksList(tasksReadyAddBtn, tasksInProgressBtn, tasksFinishedBtn);
                    showFooterContent();
                }
            } else {
                const openedDropdown = document.querySelectorAll('.tasks.show');
                if (openedDropdown) openedDropdown.forEach((item) => item.classList.remove('show'));
                const allTasksAddBtns = document.querySelectorAll('.tasks__btn_add');
                if (allTasksAddBtns) {
                    allTasksAddBtns.forEach((btn) => {
                        if (!btn.closest('.tasks_backlog')) btn.classList.add('show');
                    });
                }
            }
        });
    }
    // drag'n'drop
    function dragAndDropTasks() {
        document.addEventListener('mousedown', (event) => {
            user = getNeededUser();
            if (event.target.classList.contains('tasks__list-item')) {
                if (event.target.closest('.tasks_finished')) return;
                const currentSection = event.target.closest('.tasks');
                const currentTasksList = currentSection.querySelector('.tasks__list');
                const nextTasksList = currentSection.nextElementSibling.querySelector('.tasks__list');
                const task = event.target;
                task.ondragstart = () => false;
                let shiftX = event.clientX - task.getBoundingClientRect().left;
                let shiftY = event.clientY - task.getBoundingClientRect().top;
                task.style.position = 'absolute';
                task.style.zIndex = 10;
                document.body.append(task);

                moveAt(event.pageX, event.pageY);

                function moveAt(pageX, pageY) {
                    task.style.left = pageX - shiftX + 'px';
                    task.style.top = pageY - shiftY + 'px';
                }

                let currentDroppable = null;

                function onMouseMove(event) {
                    moveAt(event.pageX, event.pageY);
                    task.hidden = true;
                    let elemBelow = document.elementFromPoint(event.clientX, event.clientY);
                    task.hidden = false;
                    if (!elemBelow) return;
                    let droppableBelow = elemBelow.closest('.tasks');
                    if (currentDroppable != droppableBelow) {
                        if (currentDroppable) leaveDroppable(currentDroppable);
                        currentDroppable = droppableBelow;
                        if (currentDroppable && droppableBelow == nextTasksList.parentNode) {
                            enterDroppable(currentDroppable);
                        }
                    }

                    task.onmouseup = function () {
                        document.removeEventListener('mousemove', onMouseMove);
                        task.onmouseup = null;
                        task.style.position = 'relative';
                        task.style.left = 0;
                        task.style.top = 0;
                        if (currentDroppable) leaveDroppable(currentDroppable);
                        if (currentDroppable && droppableBelow == nextTasksList.parentNode) {
                            nextTasksList.append(task);
                            const needlyIndex = task.getAttribute('index');
                            user.tasks[currentTasksList.getAttribute('id')].splice(needlyIndex, 1);
                            user.tasks[nextTasksList.getAttribute('id')].push(task.innerText);
                            saveUserTasks(user);
                            showTasks(user.tasks[currentTasksList.getAttribute('id')], currentTasksList);
                            showTasks(user.tasks[nextTasksList.getAttribute('id')], nextTasksList);
                            checkEmptyTasksList(tasksReadyAddBtn, tasksInProgressBtn, tasksFinishedBtn);
                            showFooterContent();
                        }
                        if (droppableBelow != nextTasksList.parentNode) {
                            currentTasksList.append(task);
                            if (currentDroppable) leaveDroppable(currentDroppable);
                        }
                    };
                }

                document.addEventListener('mousemove', onMouseMove);

                function enterDroppable(elem) {
                    elem.style.backgroundColor = '#92f0c9';
                }

                function leaveDroppable(elem) {
                    elem.style.background = '';
                }
            }
        });
    }

    // поменять состояние кнопок
    function replaceBtn(btnAdd, btnSubmit) {
        btnAdd.classList.add('show');
        btnSubmit.classList.remove('show');
    }

    // кнопки по умолчанию
    function setDefaultBtnSettings(btnAdd, btnSubmit) {
        btnAdd.classList.remove('show');
        btnSubmit.classList.add('show');
    }

    // блокирует кнопку 'Add card', если список пустой
    function checkEmptyTasksList(btn1, btn2, btn3) {
        backLogList.children.length == 0 ? btn1.classList.add('disable') : btn1.classList.remove('disable');
        tasksReadyList.children.length == 0 ? btn2.classList.add('disable') : btn2.classList.remove('disable');
        tasksInProgressList.children.length == 0 ? btn3.classList.add('disable') : btn3.classList.remove('disable');
    }

    // узнаем выбранного пользователя для отображения задач в админ-панели
    function getNeededUser() {
        if (settings == 'admin-mode') {
            const neededUserId = JSON.parse(getCookie('choisedUser'));
            const neededUser = getFromStorage('users').find((citeUser) => {
                return citeUser.id == neededUserId;
            });
            return neededUser;
        }
        return user;
    }
};
