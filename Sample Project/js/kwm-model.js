
export default class KWM_Model {
    constructor() {
        this.pets = [];
    }

    async getAllPets(){
        if(kwm.utils.isEmpty(this.pets)){
            const resp = await kwm.utils.apiGET("/acf/v3/kwm_pet");
            for(const index in resp) this.pets.push(resp[index].acf);
        }
        return this.pets;
    }
}