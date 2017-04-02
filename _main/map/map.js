const BaseModel = require('./../core/base-model');

const mapConst = {
    landscape: 'const_landscape'
};

class Map extends BaseModel {

    addLandscape(landscape) {

        return this.set(mapConst.landscape, landscape);

    }

    addUnitList(unitList) {


    }

    addBuildingList(unitList) {


    }

}

module.exports = Map;
