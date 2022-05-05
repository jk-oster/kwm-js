"use strict";
/*******************************************************
 *     Basic Class for view components
 *
 *     KWM - 2022-03-30
 *******************************************************/
export default class KWM_Component {
    constructor(templateName, init) {
        this.template = templateName;
        this.init = init;
    }

    render(container, data, mode='overwrite', comments=false){
        this.init(container, data, mode, comments);
    }
}