"use strict";
import KWM_Route from '../js/kwm-route.js?v=0.2';

/*******************************************************************************
 *
 *     Jakob Osterberger - 2022-05-04
 *******************************************************************************/

export let view = new KWM_Route("/test", async function(){
    await this.rendering();
});

view.rendering = async function(){
    await kwm.render('test', kwm.conf.appContainer, {check:true, arr:[1,2,5]});
    let obs = kwm.obs('TestText');
    let obs2 = kwm.obs('33');
    let comp = kwm.compute(()=> `${obs2.value * obs2.value} -> I am ${obs2.value} square and I have been computed`,[obs2]);
    obs.subscribe((val)=>console.log('I could send a POST request to store' + val + 'in my API'));
    kwm.bindings({'input': obs, 'select': obs2,'inputComputed':comp});
};