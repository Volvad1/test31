export const showUserinfo = function (name, id) {
    const currentUserNameFields = document.querySelectorAll('.current-user-name');
    currentUserNameFields.forEach((userNameField) => {
        userNameField.textContent = name;
    });
    const currentUserIdField = document.querySelector('.current-user-id');
    currentUserIdField.setAttribute('title', `"${id}"`);
    currentUserIdField.textContent = id.slice(0, 18) + '...';
};
