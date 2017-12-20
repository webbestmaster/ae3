const viewConst = require('./const.json');

export function setShopVisible(isVisible) {
    return {
        type: viewConst.type.setShopVisible,
        payload: {
            isVisible
        }
    };
}
