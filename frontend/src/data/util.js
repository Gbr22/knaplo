export class KretaType {
    uid;
    description;
    name;
    constructor(o){
        Object.assign(this,{
            uid:o.Uid,
            description:o.Leiras,
            name:o.Nev,
        });
    }
}