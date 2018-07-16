// @flow

/* eslint consistent-this: ["error", "view"] */

import React, {Component} from 'react';
import type {Node} from 'react';
import Dialog from '@material-ui/core/Dialog';

type StateType = void;
type PropsType = {|
    +isOpen: boolean
|};

export default class Spinner extends Component<PropsType, StateType> {
    props: PropsType;
    state: StateType;

    render(): Node {
        const view = this;
        const {props} = view;

        return (
            <Dialog
                open={props.isOpen}
                keepMounted
                aria-labelledby="alert-dialog-slide-title"
                aria-describedby="alert-dialog-slide-description"
            >
                <div style={{color: '#c00'}}>
                    smth
                </div>
                <div style={{color: '#c00'}}>
                    smth
                </div>
                <div style={{color: '#c00'}}>
                    smth
                </div>
            </Dialog>
        );
    }
}
