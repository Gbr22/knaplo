export class Message {

    obj;
    id;
    hasAttachment;
    isRead;
    messageId;
    senderName;
    senderTitle;
    date;
    subject;
    status;

    constructor(o){

        Object.assign(this,{
            obj:o,

            id:o.azonosito,
            hasAttachment: o.hasCsatolmany,
            isRead:o.isElolvasva,
            messageId:o.uzenetAzonosito,
            senderName:o.uzenetFeladoNev,
            senderTitle:o.uzenetFeladoTitulus,
            date:new Date(o.uzenetKuldesDatum),
            subject:o.uzenetTargy,
            status:o.uzenetStatusz ? new AdminType(o.uzenetStatusz) : null,

        })
    }
}
export class AdminType {
    id;
    code;
    shortName;
    name;
    description;
    obj;

    constructor(o){
        Object.assign(this,{
            obj:o,
            
            id:o.azonosito,
            code:o.kod,
            shortName:o.rovidNev,
            name:o.nev,
            description:o.leiras,
        })
    }
}