// @flow
/* global localStorage, KeyValue */

type UserAttrType = {|
    id: string
|};

type SavedDataType = {|
    id?: string
|};

const userLocalStorageField = 'user-data-v.0.1';

export default class User {
    attr: UserAttrType;

    constructor() {
        const user = this; // eslint-disable-line consistent-this

        const attr: UserAttrType = {
            id: ''
        };

        user.attr = attr;

        const userId: string = User.getData().id || 'user-id-' + String(Math.random()).substr(2);

        user.setId(userId);
    }

    getId(): string {
        return this.attr.id;
    }

    setId(id: string): User {
        const user = this; // eslint-disable-line consistent-this

        user.attr.id = id;

        User.saveData({id});

        return user;
    }

    static saveData(data: SavedDataType): SavedDataType {
        const savedData = User.getData();

        Object.assign(savedData, data);

        localStorage.setItem(userLocalStorageField, JSON.stringify(savedData));

        return data;
    }

    static getData(): SavedDataType {
        const savedData = localStorage.getItem(userLocalStorageField) || '';

        if (savedData) {
            const parsedData = JSON.parse(savedData);

            return {
                id: parsedData.id || ''
            };
        }

        return {
            id: ''
        };
    }
}

// const userModel = new User();

// export {userModel as user};
