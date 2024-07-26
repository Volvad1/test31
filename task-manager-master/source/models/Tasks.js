import {BaseModel} from './BaseModel.js';

export class Task extends BaseModel {
    constructor(user) {
        super(user);
        this.id = user.id;
        this.tasks = {
            backLogList: [],
            readyTasks: [],
            inProgressTasks: [],
            finishedTasks: [],
        };
    }
    get getId() {
        return this.id;
    }
}
