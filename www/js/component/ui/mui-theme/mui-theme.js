// @flow

import createMuiTheme from '@material-ui/core/styles/createMuiTheme';

export default createMuiTheme({
    typography: {
        useNextVariants: true
    },
    overrides: {
        MuiPaper: {
            // Name of the component ⚛️ / style sheet
            root: {
                // Name of the rule
                backgroundColor: '#c00' // Some CSS
            }
        }
    }
});
