const {createChecker, props} = require('./index');

const schema = {
    // type: props.obj, // props.obj - is default
    props: {
        ss: {
            type: props.str,
            isRequired: true
        },
        nn: {
            type: props.nbr,
            isRequired: false
        },
        bb: {
            type: props.bln
        },
        fn: {
            type: props.fnc
        },
        aa: {
            type: props.arr,
            isRequired: true,

            props: {
                type: props.obj,
                props: {
                    gg: {
                        type: props.nbr,
                        isRequired: true
                    }
                }
            }
        },
        a1: {
            type: props.arr,
            isRequired: true,
            props: {
                type: props.nbr
            }
        },
        cc: {
            type: value => value < 3
        },
        re: {
            type: /my[\s\S]+rg/i
        },
        emp: {
            isRequired: true
        }
    }
};

const obj = {
    ss: 'ee',
    nn: 11,
    bb: true,
    aa: [{gg: 1}, {gg: 2}],
    a1: [1, '2', 3],
    fn: function func() {

    },
    cc: 2,
    re: 'MY RG'
    // emp: {}
};

const checker = createChecker(schema);

console.log(checker(obj));
