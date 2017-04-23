/* global window */

// import util from './service/util';
import FastClick from 'fastclick';

export default function initializeEnvironment() {

    const doc = window.document;

    // doc.documentElement.style.fontSize = util.detectFontSize() + 'px';

    FastClick.attach(doc.body);

}
