/**
 * Created by dim on 7.5.17.
 */

var props = {
    fnc: 'function',
    obj: 'object',
    str: 'string',
    nbr: 'number',
    bln: 'boolean',
    arr: 'array'
};

var schema = {
    type: props.obj,
    props: {
        ss: {
            isRequired: true, // optional
            type: props.str // required
        },
        nn: {
            isRequired: false,
            type: props.nbr
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

            item: {
                type: props.obj,
                props: {
                    gg: {
                        type: props.nbr,
                        isRequired: true
                    }
                }
            }
        },
        cc: {
            type: function (value) {
                return value > 3;
            }
        }
    }
};

var obj = {
    ss: 'ee',
    nn: 11,
    bb: true,
    aa: [{gg: 1}, {gg: 2}],
    fn: function () {

    },
    cc: 4
};

function checkType(schema, obj) {

    if (typeof schema.type === props.fnc) {
        return schema.type(obj);
    }

    switch (schema.type) {
        case props.fnc:
        case props.obj:
        case props.str:
        case props.nbr:
        case props.bln:

            if (typeof obj !== schema.type) {
                return false;
            }

            if (schema.props) {

                return Object.keys(schema.props).every(function (key) {

                    if (obj.hasOwnProperty(key)) {
                        return checkType(schema.props[key], obj[key]);
                    }

                    return !schema.props[key].isRequired;

                });

            }

            return true;

            break;

        case props.arr:

            if (!Array.isArray(obj)) {
                return false;
            }

            return obj.every(function (item) {
                return checkType(schema.item, item);
            });

            break;

        default:
            new Error('Can not resolve type: ' + schema.type);

    }


}

console.log(checkType(schema, obj));







