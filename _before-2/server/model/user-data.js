/**
 * Created by dim on 1.5.17.
 */

const BaseModel = require('./../base/base-model');

class UserData extends BaseModel {

    toJSON() {
        return JSON.parse(JSON.stringify(this.getAllAttributes()));
    }

    setUserId(userId) {
        return this.set('userId', userId);
    }

    getUserId() {
        return this.get('userId');
    }

    setColor(color) {
        return this.set('color', color);
    }

    getColor() {
        return this.get('color');
    }

    setTeam(team) {
        return this.set('team', team);
    }

    getTeam() {
        return this.get('team');
    }

}

module.exports.model = UserData;
