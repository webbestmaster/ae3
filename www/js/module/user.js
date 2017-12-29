// @flow
/* global localStorage, KeyValue */

type userAttr = {
    id: string
}

const userLocalStorageField = 'user-data-v.0.1';

export default class User {
    attr: userAttr;

    constructor() {
        this.attr = {id: 'no-user-id'};

        const userId: string = User.getData().id || String(Math.random()).substr(2);

        this.setId(userId);
    }

    getId(): string {
        return this.attr.id;
    }

    setId(id: string): User {
        this.attr.id = id;
        User.saveData({id});
        return this;
    }

    static saveData(data: KeyValue): KeyValue {
        const savedData = User.getData();

        Object.assign(savedData, data);

        localStorage.setItem(userLocalStorageField, JSON.stringify(savedData));

        return data;
    }

    static getData(): Object {
        return JSON.parse(localStorage.getItem(userLocalStorageField) || '{}');
    }
}

const user = new User();

export {user};
