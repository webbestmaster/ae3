import {store} from './../index';

export default user => {
    if (user) {
        const currentUserPublicId = store.getState().userState.publicIdState.publicId;

        return currentUserPublicId === user.publicId;
    }

    return false;
};
