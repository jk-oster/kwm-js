"use strict";

/***************************************************
 *  A Collection class for several useful static functions for KWMJS
 *  - API request handling
 *  - User device information
 *  - DOM operations
 *
 *  @author Jakob Osterberger - 2022-04-05
 ***************************************************/
export default class KWM_Utils {
    /**
     * Registers new event listener, if there already is the listener registered removes the previous one
     * @param element
     * @param type
     * @param callback
     * @param options
     */
    static setSingleEventListener(element, type, callback, options = false) {
        if(element) {
            element.removeEventListener(type, callback);
            element.addEventListener(type, callback, options);
        }
        else throw new Error('Element is ' + element);
    }

    static noLoginReRoute(route = '/login'){
        // Check if user is logged in
        if (localStorage.getItem('token') && localStorage.token !== 'undefined'){
            localStorage.clear();
            kwm.router.changeView(route);
            return true;
        }
        return false;
    }

    static isOnline(){
        return navigator.onLine;
    }

    /**
     * Prevents console logs
     * @param debug
     */
    static setConsoleMode(debug) {
        if (!debug) {
            if (!window.console) window.console = {};
            let methods = ["log", "debug", "warn", "info"];
            for (let i = 0; i < methods.length; i++) {
                console[methods[i]] = function () {
                };
            }
        }
    }

    /**
     * Checks if value is undefined or [] or {}
     * @param variable
     * @returns {boolean}
     */
    static isEmpty(variable) {
        if (Array.isArray(variable))
            return (variable.length === 0);
        else if (typeof variable === "object")
            return (Object.entries(variable).length === 0 && variable.constructor === Object);
        else
            return (typeof variable === "undefined" || variable == null || variable === "");
    }

    /**
     * Deep compares two objects
     * @param object1
     * @param object2
     * @returns {boolean}
     */
    static deepEqual(object1, object2) {
        if (keys1.length !== keys2.length) {
            return false;
        }
        for (const key of keys1) {
            const val1 = object1[key];
            const val2 = object2[key];
            const areObjects = this.isObject(val1) && this.isObject(val2);
            if (
                areObjects && !this.deepEqual(val1, val2) ||
                !areObjects && val1 !== val2
            ) {
                return false;
            }
        }
        return true;
    }
    static isObject(object) {
        return object != null && typeof object === 'object';
    }

    static getOS() {
        let device = "Unknown Device";
        if (navigator.appVersion.indexOf("Win") !== -1) device = "Windows";
        if (navigator.appVersion.indexOf("Mac") !== -1) device = "MacOS"; //iPad Pro & iPhone 6 :)
        if (navigator.appVersion.indexOf("Android") !== -1) device = "Android";
        if (navigator.appVersion.indexOf("iOS") !== -1) device = "iOS";
        return device;
    }

    static getClientOS() {
        return navigator.userAgentData ? navigator.userAgentData.platform : navigator.platform;
    }

    static clientIsMobile() {
        return navigator.userAgentData.mobile || /Mobi|Android/i.test(navigator.userAgent);
    }

    static clientIsTouch() {
        return 'ontouchstart' in document.documentElement;
    }

    static clientHasCamera() {
        navigator.getMedia = (navigator.getUserMedia || navigator.webkitGetUserMedia || navigator.mozGetUserMedia || navigator.msGetUserMedia);
        navigator.getMedia({video: true}, function (stream) {
            stream.getTracks().forEach(function (track) {
                track.stop();
            });
            return true;
        }, function () {
            return false;
        });
    }

    static getIndexOfObjectInArrayByPropertyValue(array, property, value) {
        return array.map(obj => obj[property]).indexOf(value);
    }

    /**
     * Gets URL params after #
     * @returns {{}|{params: {[p: string]: string}}}
     */
    static getGetParameters() {
        const hash = location.hash;
        const index = hash.indexOf("?");
        const params = hash.slice(index + 1)
            .split('&')
            .map(param => {
                const paramPair = param.split('=');
                return [paramPair[0], paramPair[1]]
            });
        if (index !== -1) return {"params": Object.fromEntries(params)};
        return {};
    }

    static getGetParams() {
        // const url = new URL(window.location.href);
        const url = new URL(window.location.hash);
        console.log(url);
        const params = new URLSearchParams(url.search);
        const paramMap = new Map();
        for (let pair of params.entries()) paramMap.set(pair[0], pair[1]);
        return paramMap;
    }

    /**
     * Sends fetch request and returns response as object
     * @param url
     * @param config
     * @returns {Promise<any>} JS-Object
     */
    static async request(url, config = {}) {
        return fetch(url, config)
            .then((response) => {
                if (!response.ok) {
                    console.error(response.statusText + ' at ' + url);
                    console.error(config);
                }
                return response.json();
            })
            .then((data) => data);
    }

    /**
     * Sends GET request with AuthHeader
     * @param url
     * @param headers
     * @returns {Promise<*>} JS-Object
     */
    static async apiGET(url, headers = KWM_Utils.authHeader()) {
        return KWM_Utils.request(kwm.conf.apiRoot + url,
            {
                method: 'GET',
                headers: headers
            });
    }

    /**
     * Sends POST request with AuthHeader
     * @param url only put the relative path starting from kwm.conf.apiRoot
     * @param headers
     * @param body
     * @returns {Promise<*>} JS-Object
     */
    static async apiPOST(url, headers = {}, body = {}) {
        return KWM_Utils.request(kwm.conf.apiRoot + url,
            {
                method: 'POST',
                headers: headers,
                body: body
            }
        );
    }

    /**
     * Return AuthHeader with bearer token from localStorage
     * @returns {Headers}
     */
    static authHeader = () => {
        const myHeaders = new Headers();
        myHeaders.append("Authorization", "Bearer " + localStorage.token);
        return myHeaders;
    }

    /**
     * Helper Function: Remove spaces
     * @param { string } str Pending string
     * @param  { number } type Remove space type 1 - all spaces 2 - before and after spaces 3 - before and after spaces 4 - after spaces default to 1
     */
    static trim = (str, type = 1) => {
        if (type && type !== 1 && type !== 2 && type !== 3 && type !== 4) return;
        switch (type) {
            case 1:
                return str.replace(/\s/g, "");
            case 2:
                return str.replace(/(^\s)|(\s*$)/g, "");
            case 3:
                return str.replace(/(^\s)/g, "");
            case 4:
                return str.replace(/(\s$)/g, "");
            default:
                return str;
        }
    }

    /**
     * Displays Error in specified HTMLElement
     * @param message
     * @param elem
     */
    static showErrorMessage(message, elem = undefined) {
        console.log(message);
        if (elem) {
            elem.classList.remove('visually-hidden');
            elem.innerHTML = message;
        }
    }

    /**
     * Helper Function: Focuses first element matching selector
     * @param selector
     */
    static focusFirst = (selector) => {
        document.querySelector(selector).focus();
    }

    /**
     * Helper Constant: Checks if element has Class
     * @param el element
     * @param className
     * @returns {boolean}
     */
    static hasClass = (el, className) => el.classList.contains(className);

    /**
     * Helper Constant: Smoothly scroll to top of page
     */
    static scrollToTop = () => {
        const c = document.documentElement.scrollTop || document.body.scrollTop;
        if (c > 0) {
            window.requestAnimationFrame(KWM_Utils.scrollToTop);
            window.scrollTo(0, c - c / 8);
        }
    }

    /**
     * Helper Function: Shorthand for document.querySelector()
     * @param selector querySelector
     * @returns {*}
     */
    static sel = (selector) => {
        return document.querySelector(selector);
    }

    /**
     * Helper Function: Shorthand for document.querySelectorAll()
     * @param selector querySelectorAll
     * @returns {NodeListOf<*>}
     */
    static selAll = (selector) => {
        return document.querySelectorAll(selector);
    }

    /**
     * Helper Function: Checks if an object is iterable
     * @param obj
     * @returns {boolean}
     */
    static isIterable = (obj) => {
        // checks for null and undefined
        if (obj == null) {
            return false;
        }
        return typeof obj[Symbol.iterator] === 'function';
    }

    /**
     * Helper Function: Wraps an object into an array if not iterable
     * @param el
     * @returns {*[]|*}
     */
    static convertToIterable = (el) => {
        if (!KWM_Utils.isIterable(el)) {
            return [el];
        } else return el;
    }
}
