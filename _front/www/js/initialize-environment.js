/*global window, document */

import util from './services/util';
import FastClick from 'fastclick';

export default function initializeEnvironment() {

    const doc = window.document;

    doc.documentElement.style.fontSize = util.detectFontSize() + 'px';

    FastClick.attach(doc.body);

}
