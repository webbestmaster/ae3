// @flow

/* global setTimeout */

export function wait(timeout: number): Promise<void> {
    return new Promise((resolve: () => void): mixed => setTimeout(resolve, timeout));
}
