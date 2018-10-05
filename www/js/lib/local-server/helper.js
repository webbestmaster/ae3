// @flow

// eslint-disable-next-line complexity
export function getPort(originalUrl: string): number {
    const matches = originalUrl.match(/^(([a-z]+:)?(\/{2})?[^/]+).*$/);
    const url = matches ? matches[1] : originalUrl;
    const parts = url.split(':');
    const port = parseInt(parts[parts.length - 1], 10);

    if (parts[0] === 'http' && (Number.isNaN(port) || parts.length < 3)) {
        return 80;
    }

    if (parts[0] === 'https' && (Number.isNaN(port) || parts.length < 3)) {
        return 443;
    }

    if (parts.length === 1 || Number.isNaN(port)) {
        return 80;
    }

    return port;
}

export function isBoolean(value: mixed): boolean %checks {
    return value === true || value === false;
}

export function isNotBoolean(value: mixed): boolean %checks {
    return value !== true && value !== false;
}

export function isNumber(value: mixed): boolean %checks {
    return typeof value === 'number';
}

export function isNotNumber(value: mixed): boolean %checks {
    return typeof value !== 'number';
}

export function isString(value: mixed): boolean %checks {
    return typeof value === 'string';
}

export function isNotString(value: mixed): boolean %checks {
    return typeof value !== 'string';
}

export function isFunction(value: mixed): boolean %checks {
    return typeof value === 'function';
}

export function isNotFunction(value: mixed): boolean %checks {
    return typeof value !== 'function';
}
