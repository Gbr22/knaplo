import GlobalState, { ApiEndpoint } from './globalState';

import { openModal } from './components/Modal';

import { pushError } from './components/MessageDisplay';

import AbsenceModal from './components/modals/AbsenceModal';
import SubjectModal from './components/modals/SubjectModal';
import { getData, getHomework, getFromCache, fetchInst, pushHomeworkCompleted, refreshUser, getTimetable, getWeekStorageId } from './api';
import { getWeekIndex } from './util';


export function openSubject(subject){
    openModal(subject.name,SubjectModal,subject,{
        mode:"wide"
    });
}

if (window.cordova){
    console.log("running in app");
}

export function homeworksCompleted(){
    return GlobalState.processedData.homeworksCompleted;
}
export function syncHomeworkCompleted(){
    pushHomeworkCompleted(homeworksCompleted()).then((result)=>{
        if (result){
            for (let p in result){
                let id = p;
                let state = result[p];
                assignHomeworkCompletedState(id,state);
            }
            saveHWC();
        }
    })
}
function processHomeworksCompleted(){
    if (localStorage.getItem("homeworksCompleted")){
        try {
            homeworksCompleted().push(...JSON.parse(localStorage.getItem("homeworksCompleted"))  );
        } catch(err){
            err;
        }
    }
}
window.homeworksCompleted = homeworksCompleted;

export function getHWCompObjFArr(id,arr){
    id = id.toString();
    for (let p of arr){
        if (p.id == id){
            return p;
        }
    }
    return null;
}
function getHWCompObj(id){
    return getHWCompObjFArr(id,homeworksCompleted());
}

export function getHomeworkCompleted(id){
    return getHWCompObj(id)?.value == true;
}
window.getHomeworkCompleted = getHomeworkCompleted;

export function cleanHWC(){
    let arr = homeworksCompleted();
    let ids = new Map();
    for (let i=0; i < arr.length; i++){
        let e = arr[i];
        if (!ids.has(e.id)){
            ids.set(e.id,[]);
        } else {
            ids.get(e.id).push(e);
        }
    }
    for (let [id,elems] of ids){
        let max = elems[0];
        for (let e in elems){
            if (e.changed > max.changed){
                max = e;
            }
        }
        for (let e in elems){
            if (e != max){
                arr.splice(arr.indexOf(max),1);
            }
        }
        
    }
}
window.cleanHWC = cleanHWC;
export function assignHomeworkCompletedState(id,assignState){
    
    id = id.toString();
    let state = getHWCompObj(id);
    let exists = true;
    if (state == null){
        exists = false;
        state = {id:id};
    }
    Object.assign(state,assignState);

    if (!exists){
        let arr = homeworksCompleted();
        arr.push(state);
    }
    cleanHWC();
    saveHWC();
}
let scheduledSync = -1;
export function setHomeworkCompleted(id,value, sync = true){
    
    assignHomeworkCompletedState(id,{
        changed: Date.now(),
        value:value,
    });

    if (sync){
        if (scheduledSync){
            clearTimeout(scheduledSync);
        }
        scheduledSync = setTimeout(()=>{
            if (navigator.onLine){
                syncHomeworkCompleted();
            }
        }, 500);
    }
    
}
export function saveHWC(){
    localStorage.setItem("homeworksCompleted", JSON.stringify(homeworksCompleted()));
}
export function toggleHomeworkCompleted(id){
    console.log("toggling",id);
    return setHomeworkCompleted(id, !getHomeworkCompleted(id));
}
window.setHomeworkCompleted = setHomeworkCompleted;

export class NormalisedItem {

    obj=null;

    createDate;
    date;
    
    type="normal";
    
    key;

    header;
    icon;
    desc;

    displayState;

    onclick(){}

    map(map){
        for (let p in map){
            this[p] = this.obj[map[p]];
        }        
    }

    constructor(o) {
        this.obj = o;
        this.createDate = o.CreatingTime;
        this.date = o.Date;



        this.key = this.type+this.obj.EvaluationId+this.obj.Jelleg?.Id+this.obj.NoteId+this.obj.AbsenceId;
    }
}

export class Grade extends NormalisedItem {

    type="grade";
    value;
    teacher;
    theme;
    mode;
    normal=true;

    constructor(o) {
        super(o);
        this.map({
            value:"NumberValue",
            teacher:"Teacher",
            subject:"Subject",
            theme:"Theme",
            mode:"Mode",
        });
        if (o.Form == "Diligence" || o.Form == "Deportment"){
            this.normal = false;
            this.map({
                value:"Value",
                subject:"JellegNev"
            });
            if (this.subject == "Magatartas"){
                this.subject = "Magatartás";
            }
            if (o.Value == "Jó" || o.Value == "Példás"){
                this.icon = "fi#smile";
            } else {
                this.icon = "fi#frown";
            }
        } else {
            this.icon = this.value;
        }

        this.header = this.subject;
        this.desc = this.theme || this.mode || this.value;
        this.displayState = this.value;
    }
}

export class Absence extends NormalisedItem {

    type="absence";
    absenceType;
    subject;
    lesson;
    delayMinutes;
    justified;

    constructor(o) {
        super(o);
        this.map({
            absenceType:"Type",
            subject:"Subject",
            lesson:"NumberOfLessons",
            delayMinutes:"DelayTimeMinutes",
        });
        this.date = o.LessonStartTime;
        this.justified = o.JustificationState == "Justified";
        
        

        this.header = `${o.TypeName} - ${this.justified ? `Igazolt (${o.JustificationTypeName})` : 'Igazolatlan'}`;
        this.desc = `${this.lesson}. Óra - ${this.subject}${this.absenceType == "Delay" ? `, ${this.delayMinutes} perc`:''}`;
        this.icon = "fi#clock";
        this.displayState = this.justified;
    }
}
export class AbsentDay extends Absence {

    absences = [];

    push(lesson){
        this.absences.push(lesson);
        this.absences.sort((a,b)=>{
            return a.lesson-b.lesson;
        })
        let lessons = this.absences.map((e)=>e.lesson);
        
        this.desc = `Érintett órák: ${lessons.join(", ")}`;
    }

    onclick(){
        openModal(`Hiányzások`,AbsenceModal,this);
    }

    constructor(o) {
        super(o);
        

        this.header = `${o.TypeName} - ${this.justified ? `Igazolt (${o.JustificationTypeName})` : 'Igazolatlan'}`;
        this.desc="";

        this.icon = "fi#clock";
        this.displayState = this.justified;
    }


}

export class Note extends NormalisedItem {
    type="note";
    
    title;
    content;
    teacher;
    noteType;

    onclick(){
        function formatURLs(text){
            let regex = /(http(s)?:\/\/.)?(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_+.~#?&//=]*)/g;
            
            
            return text.replace(regex, function(match){
                return /* html */`<a href="${match}" class="link" target="_blank">${match}</a>`;
            });
            
        }


        openModal(this.title,formatURLs(this.content));
    }

    constructor(o) {
        super(o);
        this.map({
            title:"Title",
            content:"Content",
            teacher:"Teacher",
            noteType:"Type",
        });

        function shorten(text){
            let limit = 70;
            if (text.length > limit){
                let textarr = text.slice(0,limit).split(" ");
                textarr.pop();
                return textarr.join(" ")+"...";
            } else {
                return text;
            }
        }

        this.header = this.title;
        this.desc = shorten(this.content);
        this.icon = "fi#message-square";
    }
}

function updateArray(arr,n){
    arr.splice(0,arr.length);
    arr.push(...n);
}
export function roundSubject(subject){
    return Math.round(subject.average); //TODO 
}
export function calcAvg(subject, avgCalc = {}){
    let sum = 0;
    let count = subject.grades.length;

    for (let [grade, c] of Object.entries(avgCalc)){
        sum += c * parseInt(grade);
        count+=c;
    }
    

    for (let grade of subject.grades){
        sum += grade.value;
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

function processHomeworks(homeworks){
    let promises = [];
    let processed = [];
    let index = 0;
    let hadContent = !(GlobalState.processedData.homeworks.length == 0);
    for (let e of homeworks){
        index++;
        promises.push(new Promise(function(resolve,reject){
            getHomework(e.id).then((result)=>{
                e.homework = result;
                processed.push(e);
                if (!hadContent){
                    updateArray(GlobalState.processedData.homeworks,processed);
                }
                resolve(e);
            }).catch(()=>{
                console.log("Couldn't get homework!",e);
                resolve();
            })
        }));
    }
    Promise.all(promises).then((values)=>{
        if (homeworks.length != processed.length){
            pushError("Nem sikerült minden házit lekérni");
        }
        updateArray(GlobalState.processedData.homeworks,processed);
    })
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
export function getTimetables(){
    return new Promise((resolve,reject)=>{
        let list = [];
        let start = -3;
        let end = 1;
        let finished = start;
        function done(){
            finished++;
            if (finished == end){
                resolve();
            }
        }
        function get(i){
            getTimetable(i).then((result)=>{
                if (result){
                    list.push(...result);
                    processTimetable(list);
                }
                done();
            }).catch(()=>{
                done();
            })
        }
        get(0);
        for (let i=end; i>start; i--){
            if (i != 0){
                get(i);
            }
        }
    })
}
window.getTimetables = getTimetables;
export function getWeekDaysTT(lessons){
    let daysMap = {};
    for (let e of lessons){
        
        let day = (new Date(e.Date)).toDateString();
        if (!daysMap[day]){
            daysMap[day] = {
                day,
                lessons:[]
            };
        }
        daysMap[day].lessons.push(e);
    }
    
    let days = Object.values(daysMap);
    for (let day of days){
        day.lessons.sort((a,b)=>{
            return new Date(a.StartTime) - new Date(b.StartTime);
        })
    }
    return Object.values(daysMap);
}
window.getWeekDaysTT = getWeekDaysTT;
function processTimetable(result){
    if (result){
        let list = GlobalState.lessonsList = result;

        let homeworks = list.filter((e)=>e.TeacherHomeworkId != null);
        homeworks = homeworks.map((e)=>({lesson:e,id:e.TeacherHomeworkId}));
        processHomeworks(homeworks);
        
        let days = getWeekDaysTT(list);
        for (let day of days){
            day.lessons.sort((a,b)=>{
                return new Date(a.StartTime) - new Date(b.StartTime);
            })
        }

        let weeksMap = {};
        for (let e of days){
            let date = new Date(e.day);
            
            let current = date.getDay() - 1;
            if (current == -1){
                current = 6;
            }
            let first = date.getDate() - current;
            let last = first + 6;

            first = new Date(date.setDate(first));
            last = new Date(date.setDate(last));

            

            let week = first.toDateString();

            let active = first < new Date() && new Date() < last;

            if (!weeksMap[week]){
                weeksMap[week] = {
                    week,
                    first,
                    last,
                    active,
                    days:[]
                }
            }
            weeksMap[week].days.push(e);
        }
        let weeks = Object.values(weeksMap);
        for (let week of weeks){
            week.days.sort((a,b)=>{
                return new Date(a.day) - new Date(b.day);
            })
        }

        updateArray(GlobalState.processedData.timetable.weeks, weeks);
    }
}
function processData(result){
    if(result){
        let data = GlobalState.data = result;
        let pd = GlobalState.processedData;

        

        let grades = data.Evaluations.filter((e)=>{
            return e.Type == "MidYear" && (
                e.Form == "Mark" ||
                e.Form == "Diligence" || e.Form == "Deportment"
            );
        }).map((e)=>{
            return new Grade(e);
        });

        let subjects = [];
        let subject_keys = {};

        for (let g of grades){
            if (!subject_keys[g.subject]){
                let obj = {
                    name:g.subject,
                    average:NaN,
                    grades:[],
                    normal:g.normal
                };
                subject_keys[g.subject] = obj;
                subjects.push(obj)
            }
            subject_keys[g.subject].grades.push(g);
            
        }
        subjects.sort(function(a,b){
            return a.name.localeCompare(b.name);
        });
        subjects.sort(function(a,b){
            return b.normal - a.normal;
        })
        for (let e of data.Evaluations){
            if (e.Type == "HalfYear" || e.Type == "EndYear"){
                if (subject_keys[e.Subject]){
                    subject_keys[e.Subject][e.Type] = new Grade(e);
                }
                
            }
        }
        

        updateArray(pd.grades,grades);

        for (let subject of subjects){
            subject.average = calcAvg(subject);
        }

        updateArray(pd.subjects,subjects);
        updateArray(pd.notes, data.Notes.map((n)=>new Note(n)));

        {
            let delays = [];
            let map = {};
            for (let e of data.Absences){
                if (e.Type == "Delay"){
                    delays.push(new Absence(e));
                } else {
                    let id = e.JustificationType + e.Type + e.LessonStartTime;
                    let day = map[id];
                    if (day){
                        day;
                    } else {
                        day = map[id] = new AbsentDay(e);
                    }
                    day.push(new Absence(e));
                }
            }
            let absentDays = Object.values(map);
            updateArray(pd.absentDays, absentDays);
            updateArray(pd.delays, delays);
        }
        updateArray(pd.absences, data.Absences.filter((e)=>{
            return e.Type != "Delay";
        }).map((e)=>new Absence(e)));

        
        
    }
}

function afterLogin(){
    let online = navigator.onLine;
    setImmediate(()=>{
        processData(getFromCache("data"));
        getTimetables(true);
    });
    if (online){
        setImmediate(()=>{
            refreshUser().then(()=>{
                console.log("[afterlogin] refreshed user");
                getData().then((result)=>{
                    processData(result);
                });
                getTimetables()
                syncHomeworkCompleted();
            })
        })
        
    }
}
export function refreshPage(page){
    if (!navigator.onLine){
        console.log("offline, not refreshing");
        return new Promise(r=>r());
    }
    let actions = [
        {
            pages:["avgs","timeline","more/halfyr"],
            action(){
                return new Promise(function(resolve){
                    getData().then((result)=>{
                        processData(result);
                        console.log("refreshed data");
                        resolve();
                    });
                })
                
            }
        },
        {
            pages:["timetable"],
            action(){
                return new Promise(function(resolve){
                    getTimetables().then((result)=>{
                        console.log("refreshed timetable");
                        resolve();
                    });
                })
            }
        },
        {
            pages:["homework"],
            action(){
                return new Promise(function(resolve){
                    getTimetables().then((result)=>{
                        resolve();
                        processHomeworksCompleted();
                        syncHomeworkCompleted();
                        console.log("refreshed homework");
                    });
                })
            }
        }
    ]
    
    for (let a of actions){
        if (a.pages.includes(page)){
            return a.action();
        }
    }
    return new Promise(r=>r());
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