// @flow

import type {Node} from 'react';
import React from 'react';
import style from './style.scss';

type PropsType = {|
    // eslint-disable-next-line id-match
    +children: React$Node,
|};

export function DialogTextContent({children}: PropsType): Node {
    return <p className={style.text_content}>{children}</p>;
}
