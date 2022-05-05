'use strict';

import Observable from "./kwm-observable.js";

/**
 * KWM Computed
 *
 * inspired by https://blog.jeremylikness.com/blog/client-side-javascript-databinding-without-a-framework/
 *
 * const first = new Observable("Jeremy");
 * const last = new Observable("Likness");
 * const full = new Computed(() => `${first.value} ${last.value}`.trim(), [first, last]);
 * first.value = "Doreen";
 * console.log(full.value);
 * // logs "Doreen Likness" to the console
 *
 * @param valueFn - Give me a function returning a string
 * @param depObserverArr - Give me an Array of Observers that the valueFn depends on
 *
 * @author Jakob Osterberger - 2022-04-05
 */

export default class Computed extends Observable {
    constructor(valueFn, depObserverArr=[]) {
        super(valueFn());
        const listener = () => {
            this._value = valueFn();
            this.notify();
        }
        depObserverArr.forEach(dep => dep.subscribe(listener));
    }

    get value() {
        return this._value;
    }

    set value(_) {
        throw "Cannot set computed property";
    }
}
