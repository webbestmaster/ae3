const BaseModel = require('./../core/base-model');

const mapConst = {
    landscape: 'const_landscape'
};

class Map extends BaseModel {

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

module.exports = Map;
