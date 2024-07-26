export const showFooterInfo = function () {
    const activeTasksList = document.querySelector('.tasks_backlog .tasks__list');
    const finishedTasksList = document.querySelector('.tasks_finished .tasks__list');

    let activeTaskCount = 0;
    let finishedTasksCount = 0;

    if (activeTasksList && finishedTasksList) {
        activeTasksList.childNodes.forEach((elem) => {
            if (elem.classList.contains('tasks__list-item')) activeTaskCount++;
        });
        finishedTasksList.childNodes.forEach((elem) => {
            if (elem.classList.contains('tasks__list-item')) finishedTasksCount++;
        });

        document.querySelector('#active-tasks').textContent = activeTaskCount;
        document.querySelector('#finished-tasks').textContent = finishedTasksCount;
    }
};
