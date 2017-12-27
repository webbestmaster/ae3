// @flow
import classnames from 'classnames';

export default (...args: Array<string | { [key: string]: boolean }>): { className: string } => ({
    className: classnames(...args)
});
