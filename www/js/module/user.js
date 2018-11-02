// @flow
/* global localStorage, KeyValue, PROJECT_ID */

/* eslint consistent-this: ["error", "user"] */

type UserAttrType = {|
    id: string
|};

type SavedDataType = {|
    id?: string
|};

// eslint-disable-next-line id-match
const userLocalStorageField = PROJECT_ID + '-user-data-v.1.0';

export class User {
    attr: UserAttrType;

    constructor() {
        const user = this;

        user.attr = {
            id: '',
        };

        const userId = User.getData().id || 'user-id-' + String(Math.random()).substr(2);

        user.setId(userId);
    }

    getId(): string {
        return this.attr.id;
    }

    setId(id: string): User {
        const user = this;

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
                id: parsedData.id || '',
            };
        }

        return {
            id: '',
        };
    }
}

const userModel = new User();

export {userModel as user};
