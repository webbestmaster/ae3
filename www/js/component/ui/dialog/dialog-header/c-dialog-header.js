// @flow

import type {Node} from 'react';
import React from 'react';
import style from './style.scss';

type PropsType = {|
    // eslint-disable-next-line id-match
    +children: React$Node,
|};

export function DialogHeader({children}: PropsType): Node {
    return <h4 className={style.dialog_header}>{children}</h4>;
}
