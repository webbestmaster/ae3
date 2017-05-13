function canCopyAsValue(value) {
    const type = typeof value;

    return ['function', 'string', 'number', 'boolean'].indexOf(type) !== -1 || value instanceof RegExp;
}

function maskArray(schema, donor) {
    return schema.props && schema.props.props ?
        donor.map(item => mask(schema.props, item, {})) :
        donor.map(item => item);
}

// schema, donor, receiver
function mask(schema, donor, receiver) {
    if (!schema.props) {
        Object.keys(schema)
            .forEach(schemaKey => Object.assign(receiver, {[schemaKey]: donor[schemaKey]}));
        return receiver;
    }

    Object.keys(schema.props).forEach(schemaKey => {
        if (!donor.hasOwnProperty(schemaKey)) {
            return;
        }

        const value = donor[schemaKey];

        if (canCopyAsValue(value)) {
            receiver[schemaKey] = value; // eslint-disable-line no-param-reassign
            return;
        }

        if (Array.isArray(value)) {
            receiver[schemaKey] = maskArray(schema.props[schemaKey], value); // eslint-disable-line no-param-reassign
            return;
        }

        if (typeof value === 'object') {
            receiver[schemaKey] = mask(schema.props[schemaKey], value, {});  // eslint-disable-line no-param-reassign
            // return;
        }
    });

    return receiver;
}

module.exports = mask;
