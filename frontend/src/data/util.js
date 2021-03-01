import { Message } from "./Message";

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

export function getTimelineProps(obj){
    if (obj instanceof Message){
        return {
            onclick(){
                
            },
            icon:"fi/mail",
            desc:obj.senderName,
            header:obj.subject,
            date:obj.date,
            createDate:obj.date,
            key:"msg-"+obj.messageId,
        }
    }
    return obj;
};
