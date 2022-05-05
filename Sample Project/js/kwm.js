"use strict";
import KWM_Utils from './kwm-utils.js?v=0.2';
import KWM_Translator from './kwm-translator.js?v=0.2';
import KWM_Templater from './kwm-templater.js?v=0.2';
import KWM_Router from "./kwm-router.js?v=0.2";
import KWM_Model from "./kwm-model.js?v=0.2";
import KWM_Observable from "./kwm-observable.js?v=0.2";
import KWM_Computed from "./kwm-computed.js?v=0.2";
import KWM_Bindings from "./kwm-bindings.js?v=0.2";
/**********************************************************************
 *     Class-Bundle for KWM-Applications - it provides:
 *     - Expressive and intelligent templating engine: allowing if|else|for|while|switch statements,
 *     flexible asynchronous template fetching and insertion of partials, smart caching of static templates
 *     - Flexible 2-way-data-binding with observables and computed values
 *     - Simple hash-based routing
 *     - Simple configuration
 *     - Simple translation engine with the possibility to switch language by URL parameter
 *     - Collection of handy utility functions for API calls, DOM operations and many more things
 *     - Handy and customizable shorthand convenience functions
 *
 *     @param appContainer - This is where the App is rendered into
 *     @param debugMode - Enables / Disables console.log output
 *     @param webRoot - Give me the root-URL of your App (detected automatically)
 *     @param apiRoot - Give me the root-URL of your API
 *     @param serviceworkerPath - Give me the relative path to your serviceworker
 *     @param templatesPath - Give me the relative path to your templates folder
 *     @param languages - Give me an array of the languages supported by the translator
 *
 *     @author Jakob Osterberger - 2022-04-05
 **********************************************************************/
export default class KWMJS{
    constructor(config){
        // Make it a singleton
        if (KWMJS._instance) {
            return KWMJS._instance
        }
        KWMJS._instance = this;

        // Add KWMJS as global object to window
        window.kwm = this;

        // Configuration
        if(!config) this.conf = {
            appContainer: document.getElementById('kwmJS'),
            debugMode: true,
            webRoot: window.location.origin + window.location.pathname.replace('/index.html',''),
            apiRoot: 'https://your.api.com/rest',
            serviceworkerPath: './serviceworker.js',
            templatesPath: '/templates/',
            languages: ["en", "de"],
        };
        else this.conf = config;

        this.utils = KWM_Utils;
        this.utils.setConsoleMode(this.conf.debugMode);
        this.registerServiceWorker().then(() => {});
        this.model = new KWM_Model();
        this.translator = new KWM_Translator(this.conf.languages);
        this.templater = new KWM_Templater(this.conf.webRoot+ this.conf.templatesPath);
        this.router = new KWM_Router();
        console.info('KWMJS is ready', KWMJS._instance);
    }

    async registerServiceWorker(){
        if(!this.conf.serviceworkerPath) {
            console.info('Is your application a PWA - no serviceworker path specified');
            return;
        }
        // Check if serviceworker is supported
        if ('serviceWorker' in navigator) {
            try {
                // register Serviceworker
                await navigator.serviceWorker.register(this.conf.serviceworkerPath);
                console.info("ServiceWorker registered");
            } catch (error) {
                console.error("ServiceWorker registration failed", error);
            }
        } else console.warn('ServiceWorker is not supported');
    }

    /*
     * Convenience Methods
     */

    // Create observable
    obs(value=""){
        return new KWM_Observable(value);
    }

    // Create computed - computes value
    compute(valueFn, depObserverArr = []){
        return new KWM_Computed(valueFn, depObserverArr);
    }

    // Create and init bindings - call after render function!
    bindings(observablesObject){
        return new KWM_Bindings(observablesObject);
    }

    // Translate
    t(key){
        return this.translator.translate(key);
    }

    // Render Template
    async render(templateName, container = this.conf.appContainer, values = null, mode="overwrite", comments=true){
        await this.templater.renderTemplate(templateName, container, values, mode, comments);
    }
}