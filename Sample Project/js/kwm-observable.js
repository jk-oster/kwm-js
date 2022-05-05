'use strict';
//

/**
 * KWM Observable
 *
 * inspired by https://blog.jeremylikness.com/blog/client-side-javascript-databinding-without-a-framework/
 *
 * - usage: const name = new Observable("Jeremy");
 * name.subscribe((newVal) => console.log(`Name changed to ${newVal}`));
 * name.value = "Doreen";
 * // logs "Name changed to Doreen" to the console
 *
 * @param value - Give me the initial value for your Observable
 *
 * @author Jakob Osterberger - 2022-04-05
 */
export default class Observable {
    constructor(value="") {
        this._listeners = [];
        this._value = value;
    }

    notify() {
        this._listeners.forEach(listener => listener(this._value));
    }

    subscribe(listener) {
        this._listeners.push(listener);
    }

    get value() {
        return this._value;
    }

    set value(val) {
        if (val !== this._value) {
            this._value = val;
            this.notify();
        }
    }
}



