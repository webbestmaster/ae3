// @flow

type SwiperOptionsType = {|
    +direction?: 'horizontal' | 'vertical',
    +slidesPerView?: 'auto' | number,
    +freeMode?: boolean,
    +watchOverflow?: boolean,
    +scrollbar?: {|
        +el: string, // eslint-disable-line id-length
    |},
    +mousewheel?: boolean,
|};

declare module 'swiper' {
    declare export default class Swiper {
        constructor(node: HTMLElement, options: SwiperOptionsType): Swiper,
    }
}
