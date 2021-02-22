const { KretaType } = require("./util");

export class Lesson {

    states = {
        logged:"1,Naplozott",
        notLogged:"2,Nem_naplozott",
        dismissed:"3,Elmaradt",
        event:"4,TanevRendjeEsemeny",
    }
    types = {
        timetableLesson:"1,OrarendiOra",
        lesson:"2,TanitasiOra",
        event:"5,TanevRendjeEsemeny",
    }

    state;
    testIds;
    testId;
    date;
    substituteTeacherName;
    isStudentHomeworkEnabled;
    startDate;
    subjectName;
    lessonYearlyCount;
    lessonNumber;
    group;
    homeworkId;
    isHomeworkDone;
    teacherName;
    subject;
    studentPresence;
    theme;
    classRoomName;
    type;
    id;
    endDate;
    attachments;
    obj;
    
    constructor(o){
        Object.assign(this,{
            obj:o,

            state:new KretaType(o.Allapot),
            testIds:o.BejelentettSzamonkeresUids || [],
            testId:o.BejelentettSzamonkeresUid,
            date:new Date(o.Datum),
            substituteTeacherName: o.HelyettesTanarNeve,
            isStudentHomeworkEnabled: o.IsTanuloHaziFeladatEnabled,
            startDate: new Date(o.KezdetIdopont),
            subjectName: o.Nev,
            lessonYearlyCount:o.OraEvesSorszama,
            lessonNumber: o.Oraszam,
            //TODO OraEvesSorszama
            group: null, //TODO OsztalyCsoport
            homeworkId: o.HaziFeladatUid,
            isHomeworkDone: o.IsHaziFeladatMegoldva,
            teacherName: o.TanarNeve,
            subject: null, //TODO Tantargy
            studentPresence: new KretaType(o.TanuloJelenlet),
            theme: o.Tema,
            classRoomName: o.TeremNeve,
            type: new KretaType(o.Tipus),
            id: o.Uid,
            endDate: new Date(o.VegIdopont),
            attachments: null, //TODO Csatolmanyok
        })
    }
}