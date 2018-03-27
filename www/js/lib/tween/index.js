// @flow

/* global requestAnimationFrame */

const TWEEN = require('@tweenjs/tween.js');
const {Tween} = require('@tweenjs/tween.js');

function animate() {
    requestAnimationFrame(animate);
    TWEEN.update();
}

animate();


type TweenOptionsType = {||};

export function tween<T>(from: T,
                         to: T,
                         time: number,
                         onUpdate: (tweenObject: T) => void,
                         options?: TweenOptionsType): Promise<T> {
    return new Promise((resolve: (from: T) => void) => {
        new Tween(from)
            .to(to, time)
            .onUpdate((tweenObject: T) => {
                onUpdate(tweenObject);
            })
            .onComplete((tweenObject: T) => {
                resolve(tweenObject);
            })
            .start();
    });
}


/*
tween(
    [0, 0],
    [1, 1],
    1000,
    (data: [number, number]) => {
        console.log(data);
    })
    .then((endData: [number, number]) => {
        console.log('---moreData---');
        console.log(endData);
    });
*/
