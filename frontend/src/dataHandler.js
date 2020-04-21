import GlobalState, { ApiEndpoint } from './globalState';

import { openModal } from './components/Modal';

import { pushError } from './components/MessageDisplay';

import AbsenceModal from './components/modals/AbsenceModal';
import SubjectModal from './components/modals/SubjectModal';
import { exists } from 'fs';


function putCall(call, obj){
    localStorage.setItem("data_"+call,JSON.stringify(obj));
}
function getCall(call){
    let storage = localStorage.getItem("data_"+call);
    if (storage){
        return JSON.parse(storage);
    } else {
        return {success:false, message: "Adat nem létezik a gyorsítótárban", data:null, code:"NO_CACHE"}
    }
}

export function openSubject(subject){
    openModal(subject.name,SubjectModal,subject,{
        mode:"wide"
    });
}

if (window.cordova){
    console.log("running in app");
}



function makeRequest(mode,url, data = {}, body){
    let base = "/api/";

    function HTMLtoString(html){
        let e = document.createElement("div");
        e.innerHTML = html;
        let title = e.querySelector("title");
        if (title){
            title.innerHTML = "";
        }
        console.log("element",e);
        return e.textContent;
    }

    function handleResult(obj){
        if (!obj.success){
            console.error(obj);
            pushError(obj.message)
        } else if (obj.success){
            putCall(url, obj);
        }
    }

    let params = "";

    for (let [key,elem] of Object.entries(data)){
        if (params == ""){
            params+="?";
        } else {
            params+="&";
        }
        if (elem == null || elem == undefined){
            elem = "";
        }
        params+=`${key}=${elem}`;
    }

    function makeRequestCordova(mode,endpoint,data={},body={}){
        let base = ApiEndpoint;

        let url = base+=endpoint+params;
        console.log(mode,url);
        
        if (typeof body == "object"){
            body = JSON.parse(JSON.stringify( body ));
        }
        console.log(body);

        return new Promise(function(promiseResolve){
            function resolve(obj){

                handleResult(obj);
                promiseResolve(obj);
            }
            let m = "get";
            if (mode == "POST"){
                m = "post";
            }
            cordova.plugin.http.setDataSerializer('json');
            cordova.plugin.http[m](url,body,{},function(res){
                console.log(res);
                if (res.status == 200){
                    resolve({success:true,data:JSON.parse(res.data),message:"Sikeres"});
                } else {
                    resolve({success:false, message: HTMLtoString(xhttp.responseText) || `Hiba ${this.status}`, data:null});
                }
                
            },(err)=>{
                pushError(err.message);
                console.error(err);
                resolve({success:false, message: err.message, data:null});
            })
        })
        
    }

    if (window.cordova){
        return makeRequestCordova(...arguments);
    }
    return new Promise(function(promiseResolve){
        function resolve(obj){

            handleResult(obj);
            promiseResolve(obj);
        }
        

        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                
                try {
                    resolve({success:true,data:JSON.parse(xhttp.responseText),message:"Sikeres"});
                } catch(err){
                    resolve({success:false, message: "Érvénytelen JSON, "+xhttp.responseText, data:null});
                }
                
                
            } else if (this.readyState == 4) {
                resolve({success:false, message: HTMLtoString(xhttp.responseText) || `Hiba ${this.status}`, data:null});
            }
        };
        

        xhttp.open(mode, base+url+params, true);
        let send = body;
        if (typeof body == "object"){
            send = JSON.stringify(body);
            xhttp.setRequestHeader("Content-Type","application/json");
        }
        try {
            xhttp.send(send);
        } catch(err){
            resolve({success:false, data:null, message:"Request failed"});
        }
    });
}


function get(url){
    return makeRequest("GET",url);
}
function post(url, data,body){
    return makeRequest("POST",url,data,body);
}
function login(form){
    return post("login",form);
}
function getData(){
    return get("data");
}
function getTimetable(){
    return get("timetable");
}
export function getHomeWork(homework){
    let call = "homework/"+homework;
    let stored = getCall(call);
    if (stored.code == "NO_CACHE"){
        return get(call);
    } else {
        return new Promise((resolve)=>{
            resolve(stored);
        });
    }
}

export function homeworksCompleted(){
    return GlobalState.processedData.homeworksCompleted;
}
export function syncHomeworkCompleted(){
    post("pushHomeworkDone",{},homeworksCompleted()).then((result)=>{
        if (result.success){
            for (let p in result.data){
                let id = p;
                let state = result.data[p];
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
    for (let e of homeworks){
        promises.push(new Promise(function(resolve){
            getHomeWork(e.id).then((result)=>{
                if (result.success){
                    e.homework = result.data;
                }
                resolve(e);
            })
        }));
    }
    Promise.all(promises).then((values)=>{
        let homeworks = values.filter((e)=>e.homework != undefined);
        if (homeworks.length != values.length){
            pushError("Nem sikerült minden házit lekérni");
        }
        updateArray(GlobalState.processedData.homeworks,homeworks);
    })
}
function processTimetable(result){
    if (result.success){
        let list = GlobalState.lessonsList = result.data;

        let homeworks = list.filter((e)=>e.TeacherHomeworkId != null);
        homeworks = homeworks.map((e)=>({lesson:e,id:e.TeacherHomeworkId}));
        processHomeworks(homeworks);
        
        let daysMap = {};
        for (let e of list){
            
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
    if (result.success){
        let data = GlobalState.data = result.data;
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
        processData(getCall("data"));
        processTimetable(getCall("timetable"));
        processHomeworksCompleted();
        if (online){
            syncHomeworkCompleted();
        }
    });
    if (online){    
        getData().then((result)=>{
            processData(result);
        });
        getTimetable().then((result)=>{
            processTimetable(result);
        });
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
                    getTimetable().then((result)=>{
                        processTimetable(result);
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
                    getTimetable().then((result)=>{
                        processTimetable(result);
                        processHomeworksCompleted();
                        syncHomeworkCompleted();
                        console.log("refreshed homework");
                        resolve();
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

function getInst(){
    let items = [];

    function map(arr){
        return arr.map((e)=>({
            code:e.InstituteCode,
            name:e.Name,
            city:e.City
        }));
    }
    
    let call = getCall("institute");
    if (call.success){
        setImmediate(()=>{
            updateArray(items, map(call.data));
        })
    }

    if (navigator.onLine){
        get("institute").then(function(result){
            if (result.success){
                updateArray(items, map(result.data));
            }
        });   
    }
    

    return items;
}

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
    login,
    getInst,
    currentUser,
    User,
    afterLogin,
};