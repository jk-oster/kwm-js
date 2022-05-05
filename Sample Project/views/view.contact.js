"use strict";
import KWM_Route from '../js/kwm-route.js?v=0.2';

/*******************************************************************************
 *
 *     KWM - 2022-03-26
 *******************************************************************************/

export let view = new KWM_Route("/contact", async function(){
    await this.rendering();
});

view.rendering = async function(){
    await kwm.render("contact");
};