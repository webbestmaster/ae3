// @flow

import type {Node} from 'react';
import React from 'react';
import style from './style.scss';

type PropsType = {|
    // eslint-disable-next-line id-match
    +onClick: () => mixed,
|};

export function DialogCloseButton({onClick}: PropsType): Node {
    return <button type="button" onClick={onClick} onKeyPress={onClick} className={style.dialog_close_button}/>;
}
