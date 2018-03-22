// @flow

type ImageMapType = {|
    building: {
        [key: string]: string
    },
    landscape: {
        [key: string]: string
    },
    other: {
        [key: string]: string
    },
    unit: {
        [key: string]: string
    }
|};

const imageMap: ImageMapType = {
    building: {},
    landscape: {},
    other: {},
    unit: {}
};


const buildingReqContext = require.context('./building/', true, /\.png$/);

buildingReqContext.keys()
    .forEach((fileName: string) => {
        Object.assign(
            imageMap.building,
            {[fileName.replace('./', '').replace('.png', '')]: buildingReqContext(fileName)}
        );
    });


const landscapeReqContext = require.context('./landscape/', true, /\.png$/);

landscapeReqContext.keys()
    .forEach((fileName: string) => {
        Object.assign(
            imageMap.landscape,
            {[fileName.replace('./', '').replace('.png', '')]: landscapeReqContext(fileName)}
        );
    });


const otherReqContext = require.context('./landscape/', true, /\.png$/);

otherReqContext.keys()
    .forEach((fileName: string) => {
        Object.assign(
            imageMap.other,
            {[fileName.replace('./', '').replace('.png', '')]: otherReqContext(fileName)}
        );
    });


const unitReqContext = require.context('./landscape/', true, /\.png$/);

unitReqContext.keys()
    .forEach((fileName: string) => {
        Object.assign(
            imageMap.unit,
            {[fileName.replace('./', '').replace('.png', '')]: unitReqContext(fileName)}
        );
    });


/*
const ____ReqContext = require.context('./landscape/', true, /\.png$/);

____ReqContext.keys()
    .forEach((fileName: string) => {
        Object.assign(
            imageMap.____,
            {[fileName.replace('./', '').replace('.png', '')]: ____ReqContext(fileName)}
        )
    });
*/

console.log(imageMap);

export default imageMap;
