export class KretaType {
    id;
    description;
    name;
    constructor(o){
        if (o){
            Object.assign(this,{
                id:o.Uid,
                description:o.Leiras,
                name:o.Nev,
            });
        }
    }
}