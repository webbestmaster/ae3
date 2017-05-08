const props = require('./props');

function canCopyAsValue(value) {
    const type = typeof value;
    return ['function', 'string', 'number', 'boolean'].indexOf(type) !== -1 || value instanceof RegExp;
}

// schema, donor, receiver
function mask(schema, donor, receiver) {
    if (!schema.props) {
        Object.keys(schema).forEach(schemaKey => receiver[schemaKey] = donor[schemaKey]);
        return receiver;
    }

    Object.keys(schema.props).forEach(schemaKey => {

        if (!donor.hasOwnProperty(schemaKey)) {
            return;
        }

        const value = donor[schemaKey];

        if (canCopyAsValue(value)) {
            receiver[schemaKey] = value;
            return receiver;
        }

        if (Array.isArray(value)) {
            const arrayItemSchemeProps = schema.props[schemaKey].props;

            // check if array's items is objects
            receiver[schemaKey] = arrayItemSchemeProps.props ?
                value.map(item => mask(arrayItemSchemeProps, item, {})) :
                value.map(item => item);

            return receiver;
        }

        if (typeof value === 'object') {
            receiver[schemaKey] = mask(schema.props[schemaKey], value, {});
            return receiver;
        }

    });

    return receiver;
}

module.exports.mask = mask;

module.exports.props = props;
