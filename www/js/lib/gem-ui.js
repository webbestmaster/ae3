/**
 * Created by dmitry.turovtsov on 29.04.2017.
 */
import React from 'react';
import {TextField, SelectField, MenuItem} from 'material-ui';

export class SelectFieldGem extends SelectField {

    constructor(props) {
        super();

        this.state = {
            value: props.defaultValue
        };
    }

    onChange(evt, index, value) {
        const view = this;

        view.setState({value});

        const {onChange} = view.props;

        return typeof onChange === 'function' && onChange(evt, index, value);
    }

    render() {
        const view = this;

        return <SelectField
            {...view.props}
            value={view.state.value}
            onChange={(evt, index, value) => view.onChange(evt, index, value)}
        />;
    }

}
