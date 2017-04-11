const SchemaJS = require('schema-js');

class Schema extends SchemaJS {

    isValid(data, options, definition) {
        return this.validate(data, options, definition);
    }

    isInvalid(data, options, definition) {
        return !this.isValid(data, options, definition);
    }

    validate(data, options, definition) {

        try {
            super.validate(data, options, definition);
            return true;
        } catch (e) {
            console.error('---> Invalid data');
            console.error(data);
        }

        return false;
    }

}

module.exports = Schema;
