'use strict';

/**
 * KWM Bindings
 *
 * inspired by https://blog.jeremylikness.com/blog/client-side-javascript-databinding-without-a-framework/
 * and https://dev.to/proticm/vanilla-js-data-binding-with-classes-from-scratch-48b1
 *
 * - enables declarative 2-way data-binding of value or innerText attributes of HtmlElements
 * - usage: 'new Bindings({lastName: new Observable('Osterberger')}'
 * binds the HtmlElement with 'data-bind="lastName"' to this Observable
 *
 * @param objObservables - Give me an object containing Observables with keys corresponding to your data-bind properties
 *
 * @author Jakob Osterberger - 2022-04-05
 */

export default class Bindings {
    constructor(objObservables) {
        this.bindings = {};
        const run = () => {
            this.bindings = objObservables;
            this.applyBindings();
        }
        setTimeout(run, 0);
    }

    bindValue = (input, observable) => {
        input.value = observable.value;
        observable.subscribe(() => input.value = observable.value);
        if (input.tagName === 'SELECT') {
            input.onchange = () => observable.value = input.options[input.selectedIndex].value;
        } else input.onkeyup = () => observable.value = input.value;
    }

    bindText = (input, observable) => {
        input.innerText = observable.value;
        observable.subscribe(() => input.innerText = observable.value);
    }

    applyBindings = () => {
        if (!kwm.utils.isEmpty(this.bindings)) {
            document.querySelectorAll("[data-bind]").forEach(elem => {
                if (this.bindings[elem.dataset.bind.replace('value: ', '').replace('text: ', '')]) {
                    if (elem.dataset.bind.includes('value: ')) {
                        const observable = this.bindings[elem.dataset.bind.replace('value: ', '')];
                        this.bindValue(elem, observable);
                    } else if (elem.dataset.bind.includes('text: ')) {
                        const observable = this.bindings[elem.dataset.bind.replace('text: ', '')];
                        this.bindText(elem, observable);
                    } else {
                        const observable = this.bindings[elem.dataset.bind];
                        this.bindValue(elem, observable);
                    }
                } else console.warn('No observable found for binding of: ', elem);
            });
        } else throw 'no observers passed to Bindings';
    }
}