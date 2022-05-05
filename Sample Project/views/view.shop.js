"use strict";
import KWM_Route from '../js/kwm-route.js?v=0.2';

/*******************************************************************************
 *
 *     KWM - 2022-03-30
 *******************************************************************************/

export let view = new KWM_Route("/shop", async function(){
    await this.rendering();
});

view.rendering = async function(){
    await kwm.render("shop");

    const container = document.querySelector('#pets');

    for(const pet of await kwm.model.getAllPets()){
        const div = document.createElement('div');
        div.classList.add('pet');
        container.appendChild(div);
        await kwm.render("shop.pet-overview", div, pet);
    }
};