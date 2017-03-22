import appConst from './../const';

const RESIZE = appConst.TYPE.RESIZE;

export default function resizeScreen() {

    return {
        type: RESIZE
    };
}
