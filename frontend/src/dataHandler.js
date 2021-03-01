import GlobalState, { ApiEndpoint, pushSync } from './globalState';

import { openModal } from './components/Modal';

import { pushError } from './components/MessageDisplay';

import SubjectModal from './components/modals/SubjectModal';
import { getFromCache, fetchInst, refreshUser, getTimetable, getWeekStorageId, getGrades, getNotes, getAbsences, getEvents, getStudentInfo, getMessages } from './api';
import { getWeekIndex, formatURLsHTML, sortByText, wait, getCSSVariable } from './util';
import { updateTT } from './view/Timetable';
import storage from './storage';
import { Grade } from './data/Grade';
import { Absence } from './data/Absence';
import { Note } from './data/Note';
import { Homework } from './data/Homework';
import { Subject } from './data/Subject';
import { Test } from './data/Test';
import { Lesson } from './data/Lesson';
import { NormalisedItem } from './data/NormalisedItem';
import { Event } from './data/Event';
import { Message } from './data/Message';

export function openSubject(subject){
    openModal(subject.name,SubjectModal,subject,{
        mode:"wide"
    });
}

if (window.cordova){
    console.log("running in app");
}


export function getGradeColor(grade){
    
    let unknown = "#607d8b";
    if (!grade){
        return unknown;   
    }
    let g = grade.value;
    if (!grade.value && grade.textValue){
        let map = {
            "Példás":5,
            "Jó":4,
            "Változó":3,
            "Rossz":2,
            "Hanyag":2,
        }
        g = map[grade.textValue] || null;
    } else if (!grade.value) {
        return unknown;
    }

    /* GlobalState. */
    
    function getColor(num) {
        let map = GlobalState.gradeColors;

        return map[num.toString()];
    }
    return getColor(g);
}


function updateArray(arr,n){
    arr.splice(0,arr.length);
    arr.push(...n);
}

export function getSubjectRounding(subject){
    let roundings = GlobalState.subjectRoundings || {};
    return (roundings[subject] || 50);
}
export function clearSubjectRoundings(){
    GlobalState.subjectRoundings = {};

    storage.removeItem("roundings");
}
window.clearSubjectRoundings = clearSubjectRoundings;
export function setSubjectRounding(subject, v){
    let d = GlobalState.subjectRoundings || {};
    d[subject] = v;
    GlobalState.subjectRoundings = Object.assign({},d);
    storage.setJSON("roundings", d);
}
window.setSubjectRounding = setSubjectRounding;

export function roundSubject(subject){
    let r = getSubjectRounding(subject.id)/100;
    let avg = subject.average;
    let roundAt = Math.floor(avg)+r;
    if (avg >= roundAt){
        return Math.ceil(avg);
    } else {
        return Math.floor(avg);
    } 
}
window.roundSubject = roundSubject;
export function calcAvg(subject, avgCalc = {}){
    let sum = 0;
    let count = 0;

    for (let [grade, c] of Object.entries(avgCalc)){
        sum += c * parseInt(grade);
        count+=c;
    }
    

    for (let grade of subject.grades){
        var w = grade.weight/100;
        if (grade.value > 0){
            sum += grade.value*w;
            count += w;
        }
    }
    return sum/count;
}
export function getAverage(){
    let sum = 0;
    let count = 0;
    for (let subject of GlobalState.processedData.subjects){
        let round = roundSubject(subject);
        if (!isNaN(round)){
            sum += round;
            count++;
        }
        
    }
    return sum / count;
}
window.getAverage = getAverage;

export function getTestForLesson(lesson){
    function sameDay(d1, d2) {
        return d1.getFullYear() === d2.getFullYear() &&
            d1.getMonth() === d2.getMonth() &&
            d1.getDate() === d2.getDate();
    }
    let tests = GlobalState.processedData.tests;
    let test = tests.filter(e=>
        sameDay( new Date(e.date), lesson.startDate ) && 
        e.lessonNumber == lesson.lessonNumber
    )[0];
    return test;
}

let weekReactiveRequested = [];
export function getWeekReactive(i){
    let weeksAfter = i;
    let {first, last} = getWeekIndex(i);
    let o = {
        first,last,
        week:first.toDateString(),
        active:i==0,
        days:[]
    };
    let id = getWeekStorageId(weeksAfter);
    if (getFromCache(id)){
        o.days = getWeekDaysTT(getFromCache(id));
    }

    if (navigator.onLine && !weekReactiveRequested.includes(i) ){
        weekReactiveRequested.push(i);
        getTimetable(i).then((d)=>{
            updateArray(o.days,getWeekDaysTT(d));
        })
    }
    return o;
}
window.getWeekReactive = getWeekReactive;

export function getWeekDaysTT(lessons){
    lessons = lessons.map(e=>new Lesson(e));
    let daysMap = {};
    for (let e of lessons){
        
        let day = (e.date).toDateString();
        if (!daysMap[day]){
            daysMap[day] = {
                day,
                date:e.Datum,
                lessons:[]
            };
        }
        daysMap[day].lessons.push(e);
    }
    
    let days = Object.values(daysMap);
    for (let day of days){
        day.lessons.sort((a,b)=>{
            return a.startDate - b.startDate;
        })
    }
    return Object.values(daysMap).sort((a,b)=>{
        return (a.date) - (b.date);
    });
}
window.getWeekDaysTT = getWeekDaysTT;


function processGenericList(list, id, _class) {
    var proc = list.map(e=>new _class(e));
    
    if (GlobalState.rawData[id] === undefined){
        GlobalState.rawData[id] = [];
    }
    updateArray(GlobalState.rawData[id],list);
    updateArray(GlobalState.processedData[id],proc);
    

    if (id == "grades"){
        var subjects = {}
        proc.forEach(e=>{
            if(!subjects[e.subjectId]){
                subjects[e.subjectId] = new Subject(e.subjectId,e.subject);
            }
            subjects[e.subjectId].grades.push(e);
        });
        var endlist = Object.values(subjects);
        endlist.map(e=>e.average = calcAvg(e));
        

        updateArray(
            GlobalState.processedData.subjects,
            endlist
            .sort((a,b)=>sortByText(a.name,b.name))
                .sort((a,b)=>isNaN(a.average)-isNaN(b.average))    
        )
    }
}
var dataLists = [
    {
        get:getGrades,
        id:"grades",
        class:Grade
    },
    {
        get:getNotes,
        id:"notes",
        class:Note
    },
    {
        get:getAbsences,
        id:"absences",
        class:Absence
    },
    {
        get:getHomeworks,
        id:"homeworks",
        class:Homework
    },
    {
        get:getTests,
        id:"tests",
        class:Test
    },
    {
        get:getEvents,
        id:"events",
        class:Event
    },
    {
        get:()=>{
            return getMessages(messageTypes.received);
        },
        id:"messages_received",
        class: Message,
    },
    {
        get:()=>{
            return getMessages(messageTypes.sent);
        },
        id:"messages_sent",
        class: Message,
    },
    {
        get:()=>{
            return getMessages(messageTypes.removed);
        },
        id:"messages_removed",
        class: Message,
    },
];
function updateLists(fetch) {
    return Promise.all(dataLists.map(l=>{
        return updateList(l.id,fetch);
    }));
}

function updateList(list, fetch){
    var lists = dataLists;
    
    for (let i = 0; i < lists.length; i++) {
        const e = lists[i];

        if (e.id != list){
            continue;
        }

        function process(d){
            processGenericList(d,e.id,e.class);
        }
        
        if (fetch){
            let p = new Promise((rs,rj)=>{
                e.get().then(d=>{
                    process(d);
                    rs();
                }).catch(rj);
            })
            pushSync({id:e.id,promise:p});
            return p;
        } else {
            if (storage.has("data/"+e.id)){
                process(storage.getJSON("data/"+e.id));
            }
            return new Promise(r=>r());
        }
        
    }
    return new Promise((_,r)=>r("No such list"));
}
window.updateList = updateList;
function syncOffile() {
    if (storage.has("data/studentinfo")){
        GlobalState.studentInfo = storage.getJSON("data/studentinfo");
    }
    updateLists(false);
}
function syncStudentInfo() {
    let promise = getStudentInfo();
    promise.then(d=>{
        GlobalState.studentInfo = d;
    })
    pushSync({id:"studentInfo",promise});
    return promise;
}
function syncAll(){
    let online = navigator.onLine;
    
    if (online){
        refreshUser().then(()=>{
            console.log("[afterlogin] refreshed user");

            
            syncStudentInfo();
            
            updateLists(true).then(()=>{
                console.log("All data successfully fetched");
            })
            
        })
    }
}
function afterLogin(){
    setImmediate(()=>{
        syncOffile();
        syncAll();
    })
}

export function refreshPage(page){
    if (!navigator.onLine){
        console.log("offline, not refreshing");
        pushError("Nincs internet");
        return new Promise(r=>r());
    }
    let actions = [
        {
            pages:["timeline"],
            action(){
                return Promise.all([
                    updateList("grades",true),
                    updateList("notes",true),
                    updateList("absences",true),
                    updateList("tests",true),
                    updateList("events",true),
                ]);
            }
        },
        {
            pages:["more"],
            action(){
                return syncStudentInfo();
            }
        },
        {
            pages:["more/finals", "avgs"],
            action(){
                return updateList("grades",true);
            }
        },
        {
            pages:["timetable"],
            action(){
                return new Promise(r=>r()); // TODO timetable refresh
            }
        },
        {
            pages:["homework"],
            action(){
                return updateList("homeworks",true);
            }
        }
    ]
    var promises = [new Promise(r=>r())];
    for (let a of actions){
        if (a.pages.includes(page)){
            promises.push(a.action());
        }
    }
    var time = Date.now();
    
    return Promise.all([
        new Promise((resolve,reject)=>{
            Promise.all(promises).then(()=>{
                var now = Date.now();
                console.log("Refreshed page in",now-time);
                resolve();
            }).catch(resolve);
        }),
        wait(1000)
    ]);
}

export function getInst(){
    let items = [];

    function map(arr){
        return arr.map((e)=>({
            code:e.InstituteCode,
            name:e.Name,
            city:e.City
        }));
    }
    
    let call = getFromCache("institute");
    if (call){
        setImmediate(()=>{
            updateArray(items, map(call.data));
        })
    }

    if (navigator.onLine){
        fetchInst().then(function(result){
            if (result){
                updateArray(items, map(result));
            }
        });   
    }
    

    return items;
}
window.getInst = getInst;

class User {
    loggedIn=false;
    creds = null;

    constructor(creds){
        this.update(creds);
    }
    update(creds){
        this.creds = creds;
        this.loggedIn = this.creds ? true : false;
    }
}
let currentUser = new User(null);

export {
    currentUser,
    User,
    afterLogin,
};