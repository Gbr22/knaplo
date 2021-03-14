import { AdminType } from './Message';
export class DetailedMessage {

    obj;

    id;
    isRead;
    isRemoved;
    type;
    message;

    constructor(o){
        Object.assign(this,{
            obj:o,

            id:o.azonosito,
            isRead:o.isElolvasva,
            isRemoved:o.isToroltElem,
            type: new AdminType(o.tipus),
            message: new Message(o.uzenet)
        })
    }
}
class Message {

    obj;

    id;
    conversationId;
    previousMessageId;
    date;
    senderName;
    senderTitle;
    content;
    subject;
    status;
    recipientList;
    attachments;

    constructor(o){
        Object.assign(this,{
            obj:o,

            id:o.azonosito,
            conversationId:o.beszelgetesAzonosito,
            previousMessageId:o.elozoUzenetAzonosito,
            date:new Date(o.kuldesDatum),
            senderName: o.feladoNev,
            senderTitle: o.feladoTitulus,
            content: o.szoveg,
            subject: o.targy,
            status: new AdminType(o.statusz),
            recipientList: o.cimzettLista.map(e=>new Recipient(e)),
            attachments: o.csatolmanyok.map(e=>new Attachment(e))
        })
    }
}
export class Attachment {

    obj;
    id;
    filename;

    constructor(o){
        Object.assign(this,{
            obj: o,
            
            id:o.azonosito,
            filename: o.fajlNev,
        })
    }
}
export class Recipient {

    obj;

    id;
    kretaId;
    name;
    type;

    constructor(o){
        Object.assign(this,{
            obj:o,

            id:o.azonosito,
            kretaId:o.kretaAzonosito,
            name:o.nev,
            type:new AdminType(o.tipus)
        });
    }
}