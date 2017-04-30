/**
 * Created by dim on 30.4.17.
 */

const BaseModel = require('./../base/base-model');

const props = {
    messages: 'messages'
};

class Chat extends BaseModel {

    constructor() {
        super();
        this.set(props.messages, []);
    }

    addMessage(userId, text) {
        this.get(props.messages).push({
            userId,
            text,
            timestamp: Date.now()
        });
    }

    getAllMessages() {
        return this.get(props.messages);
    }


}

module.exports.model = Chat;
