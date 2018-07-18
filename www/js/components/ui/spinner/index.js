// @flow

/* eslint consistent-this: ["error", "view"] */

import type {Node} from 'react';
import React, {Component} from 'react';
import Dialog from '@material-ui/core/Dialog';
import createMuiTheme from '@material-ui/core/styles/createMuiTheme';
import MuiThemeProvider from '@material-ui/core/styles/MuiThemeProvider';
import style from './style.scss';

const theme = createMuiTheme({
    overrides: {
        MuiPaper: { // Name of the component ⚛️ / style sheet
            root: { // Name of the rule
                // Some CSS
                boxShadow: 'none !important',
                backgroundColor: 'transparent !important'
            }
        }
    }
});

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
            <MuiThemeProvider theme={theme}>
                <Dialog
                    open={props.isOpen}
                    keepMounted
                    aria-labelledby="alert-dialog-slide-title"
                    aria-describedby="alert-dialog-slide-description"
                >
                    <div className={style.spinner}/>
                </Dialog>
            </MuiThemeProvider>

        );
    }
}
