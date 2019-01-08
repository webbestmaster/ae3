// @flow

/* global setTimeout */

type CheckForStateType = () => boolean;

const waitForTimeout = 1e3;

export async function waitFor(checkForState: CheckForStateType) {
    await new Promise((resolve: () => void): mixed => setTimeout(resolve, waitForTimeout));

    console.log('waitFor tick');

    const isReady = checkForState();

    if (isReady) {
        return;
    }

    await waitFor(checkForState);
}
