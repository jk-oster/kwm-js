"use strict";
/*******************************************************
 *     Hash-based Routes for Single Page Applications.
 *     Routes are treated like Views. Each Route is
 *     therefore bound to one single (unique) View.
 *
 *     KWM - 2022-03-30
 *
 *     @author Jakob Osterberger - 2022-04-05
 *******************************************************/
export default class KWM_Route {
    constructor(slug, init) {
        this.slug = slug;
        this.init = init;
    }

    isActive() {
        const getParams = kwm.utils.getGetParameters();
        let slug = location.hash.slice(1);
        if (!kwm.utils.isEmpty(getParams)) slug = slug.slice(0, slug.indexOf('?'));
        return slug === this.slug;
    }
}