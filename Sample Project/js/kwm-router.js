"use strict";

//Import and rename your views here:
import {view as home} from '../views/view.home.js?v=0.2';
import {view as route404} from '../views/view.404.js?v=0.2';
import {view as shop} from '../views/view.shop.js?v=0.2';
import {view as contact} from '../views/view.contact.js?v=0.2';
import {view as test} from '../views/view.test.js?v=0.2';

/*******************************************************
 *     Hash-based router for Single Page Applications.
 *     Handles Routes behind a '/#/' to your convenience.
 *
 *     @param routes - Give me all the views you have
 *     @param routeHome - Default route for page load
 *     @param route404 - Default route when unidentified slug is put into URL
 *
 *     @author Jakob Osterberger - 2022-03-30
 *******************************************************/
export default class KWM_Router {
    constructor() {
        this.routes = [home, route404, shop, contact, test];
        this.routeHome = home;
        this.route404 = route404;

        this.init();
    }

    init() {
        window.removeEventListener('hashchange', this.changeViewHandler);
        window.addEventListener('hashchange', this.changeViewHandler.bind(this));
        this.changeViewHandler();
    }

    changeView(route=''){
        location.hash = route;
    }

    changeViewHandler() {
        // Switch by e.q. '?lang=de'
        const params = kwm.utils.getGetParameters();
        if(!kwm.utils.isEmpty(params) && 'lang' in params.params){
            kwm.translator.currentLanguage = params.params.lang;
        }

        // Handle view change
        if (location.hash === '#/' || location.hash === '') {
            this.routeHome.init();
        } else {
            const activeRoute = this.routes.find(route => route.isActive());
            if (activeRoute) activeRoute.init();
            else {
                this.route404.init();
                console.error(`Page ${location.hash} could not be found`);
                location.hash = '/404';
            }
        }
    }
}