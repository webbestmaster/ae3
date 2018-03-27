// @flow


const {Tween} = require('@tweenjs/tween.js');

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


export function tweenList<T>(pointList: Array<T>,
                             timeForEachTween: number,
                             onUpdate: (tweenObject: T) => void,
                             options?: TweenOptionsType): Promise<T | null> {
    let chain = Promise.resolve(null);

    pointList.forEach((innerTween: T, innerTweenIndex: number) => {
        if (innerTweenIndex === 0) {
            return;
        }

        const start = pointList[innerTweenIndex - 1];
        const end = pointList[innerTweenIndex];

        chain = chain.then((): Promise<T> => tween(start, end, timeForEachTween, onUpdate));
    });

    return chain;
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

/*
tweenList([[0, 0], [1, 0], [1, 1], [2, 1]], 1000,
    (data: [number, number]) => {
        console.log(data);
    })
    .then((endData: [number, number] | null) => {
        console.log('---moreListData---');
        console.log(endData);
    });
*/
