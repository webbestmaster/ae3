// @flow

import type {Node} from 'react';
import React from 'react';
import {Locale} from '../../locale/c-locale';
import type {LangKeyType} from '../../locale/translation/type';
import {DialogHintText} from '../../ui/dialog/dialog-hint-text/c-dialog-hint-text';

export function TapToContinueDialogHint(): Node {
    return (
        <DialogHintText>
            <Locale stringKey={('TAP_ANYWHERE_TO_CONTINUE': LangKeyType)}/>
        </DialogHintText>
    );
}
