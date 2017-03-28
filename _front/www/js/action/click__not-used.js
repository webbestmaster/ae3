import appConst from './../const';

const CLICK = appConst.TYPE.CLICK;

export default function click(e) {

    return {
        type: CLICK,
        x: e.pageX,
        y: e.pageY
    };

}
