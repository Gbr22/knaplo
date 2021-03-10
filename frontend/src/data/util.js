import { Message } from "./Message";
import { openMessage } from '../components/modals/MessageModal';
import { openGrade } from '../components/modals/GradeModal';
import { Grade } from "./Grade";
import { getGradeColor } from "../dataHandler";

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

export function nullOrNew(json,obj){
    if (json == null || json == undefined){
        return null;
    } else {
        return new obj(json);
    }
}


export function getTimelineProps(obj){
    if (obj instanceof Message){
        return {
            onclick(){
                openMessage(obj);
            },
            icon:"fi/mail",
            desc:obj.senderName,
            header:obj.subject,
            date:obj.date,
            createDate:obj.date,
            key:"msg-"+obj.messageId,
        }
    } else if (obj instanceof Grade){
        let info = {
            onclick(){
                openGrade(obj);
            },
            desc:obj.theme || obj.mode?.description || obj.textValue,
            header:obj.subject.name,
            date:obj.date,
            createDate:obj.createDate,
            key:"grade-"+obj.id,
        };
        if (!obj.isType(Grade.types.midYear)){
            info.desc = obj.type.description;
        }
        
        if (obj.form?.id == Grade.forms.behavior || obj.form?.id == Grade.forms.diligence){
            if (obj.textValue == "Jó" || obj.textValue == "Példás") {
                info.icon = "fi/smile";
            } else {
                info.icon = "fi/frown";
            }
        }
        else if (obj.numberValue){
            info.icon = "text/" + obj.numberValue;
        }
        else {
            info.icon = "text/#";
        }
        info.color = getGradeColor(obj);
        
        return info;

    }
    return obj;
};
