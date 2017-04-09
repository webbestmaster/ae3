const BaseModel = require('./../core/base-model');

const mapConst = {
    landscape: 'const_landscape'
};

class GameMap extends BaseModel {

    addRawMap(rawMap) {

    }

    addLandscape(landscape) {

        return this.set(mapConst.landscape, landscape);

    }

    addUnitList(unitList) {


    }

    addBuildingList(unitList) {


    }

}

module.exports = GameMap;
