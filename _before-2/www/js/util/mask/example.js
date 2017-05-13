const {createMask} = require('./index');

const schema = {
    props: {
        ss: {
            // type: props.str,
            isRequired: true
        },
        kk: {
            props: {
                ll: {
                    props: {
                        mm: {}
                    }
                },
                yy: {}
            }
        },
        // nn: {
        //     type: props.nbr,
        //     isRequired: false
        // },
        bb: {
            // type: props.bln
        },
        fn: {
            // type: props.fnc
        },
        aa: {
            // type: props.arr,
            isRequired: true,
            props: {
                // type: props.obj,
                props: {
                    gg: {
                        // type: props.nbr,
                        isRequired: true
                    }
                }
            }
        },
        a1: {
            // type: props.arr,
            // isRequired: true,
            props: { // <--- props is optional
                // type: props.nbr
            }
        },
        cc: {
            // type: value => value < 3
        },
        re: {
            // type: /my[\s\S]+rg/i
        },
        re3: {},
        emp: {
            // isRequired: true
        }
    }
};

const donor = {
    ss: 'ee',
    kk: {
        ll: {
            mm: {
                dd: ''
            }
        },
        yy: 1
    },
    nn: 11,
    bb: true,
    aa: [{gg: 1}, {gg: 2, cc: 1}],
    a1: [1, 2, 3],
    fn: function func() {

    },
    cc: 2,
    re: 'MY RG',
    re3: /\d/
};

console.log(createMask(schema)(donor));
