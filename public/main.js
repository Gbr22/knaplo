function req(url){
    return new Promise(function(resolve,reject){
        var xhttp = new XMLHttpRequest();
        xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
                
                resolve(xhttp.responseText);
            } else if (this.readyState == 4 && this.status == 500){
                resolve(xhttp.responseText);
            }
        };
        xhttp.open("GET", url, true);
        xhttp.send();
    })
}




//let api_base = "http://localhost:3001/"
let api_base = window.location.protocol+"//"+window.location.host;
let api_full = api_base+"/api/";

async function institute(){
    return await req(api_full+"institute");
}


var ranks = [
    {
        min: 4.5,
        name: "Platinum",
        color: "#00cc66"
    },
    {
        min:4,
        name: "Gold",
        color: "#ccff33"
    },
    {
        min:3,
        name: "Silver",
        color: "#e6e600"
    },
    {
        min:2,
        name: "Bronze",
        color: "#ff9900"
    },
    {
        min:1,
        name:"Stone",
        color: "#cc3300"
    }
];

function getLastPage(){
    let pages = ["home","info","recent","halfyr"];
    let lastpage = localStorage.getItem("lastpage");
    
    for (let page of pages){
        if (lastpage == page){
            exists = true;
            return lastpage;
        }
    }
    return "recent";
    
}
var recentModes = {
    "all":"Minden",
    "grade":"Jegyek",
    "note":"Feljegyzések",
    "absence":"Mulasztások"
};
function getLastRecent(){
    
    let last = localStorage.getItem("lastrecent");
    
    for (let p in recentModes){
        if (last == p){
            return last;
        }
    }
    
    return "all";
    
}



let fillerdata = {
    loading_data:false,
    loaded_percent:0,
    recentMode:getLastRecent(),
    showRecentModeOptions:false,
    username:"",
    page:getLastPage(),
    loading:true,
    fullname:'',
    info:{
        AddressDataList:[],
        Tutelaries:[],
    },
    loginerror:{
        error:false,
        message:""
    },
    logged_in:false,
    inst_search:'',
    selected_inst:'',
    grades:[],
    recents:[],
    subjects:[],
    absences:[],
    delays:[],
    ranksScreen:false,
    ranks:ranks,
    roundView:null,
    defaultSubject:{
        "null":true,
        name:"Subject name",
        grades:[],
        average:null,
        avgCalc:createAvgCalc()
    },
    cacheCount:"#",
    viewedSubject:{
        "null":true,
        name:"Subject name",
        grades:[],
        average:null,
        avgCalc:createAvgCalc()
    },
    lastcommit:{
        time:0,
        hash:"#".repeat(7),
    }
}



let data = JSON.parse(JSON.stringify(fillerdata));

{
    
    req("/api/lastcommit").then(function(data){
        let d = JSON.parse(data);
        fillerdata.lastcommit = d;
        data.lastcommit = d;
        console.log(d);
    })
}

function showRanks(){

}

function updateArray(arr,_new){
    arr.splice(0)
    arr.push(..._new);
}

function calcSubjectAvg(subject,avg_calc){

    let sum = 0;

    let count = subject.grades.length;

    for (let grade of subject.grades){
        sum += grade.value;
    }

    if (avg_calc){
        for (let gradename in subject.avgCalc){
            let gradecount = subject.avgCalc[gradename];
            count += gradecount;
            

            sum += gradename*gradecount;
            
        }
    }
    

    return sum/count;
}

var avg_calc_obj = {
    [1]:0,
    [2]:0,
    [3]:0,
    [4]:0,
    [5]:0
}
function createAvgCalc(){
    return Object.assign({},avg_calc_obj);
}


function getGradeName(grade){
    let obj = {
        [1]:"Elégtelen",
        [2]:"Elégséges",
        [3]:"Közepes",
        [4]:"Jó",
        [5]:"Jeles"
    }
    return obj[grade];
}

async function fetchData(){
    let d;

    let response = await req(api_full+"data");

    async function errored(){
        console.log("errored");
        cookies.del("access_token");
        cookies.del("refresh_token");
        cookies.del("inst");
        window.location.href = window.location.href;
    }

    if (response == "error"){
        await errored();
        return;
    }
    try {
        d = JSON.parse(response);
    } catch(err){
        console.log(err);
        await errored();
        return;
    }

    localStorage.setItem("kretadata",response);

    return d;
}

async function getData(){
    let raw = localStorage.getItem("kretadata");
    if (raw == null){
        return await fetchData();
    } else {
        let json = null;
        try {
            json = JSON.parse(raw);
        } catch(err){
            return await fetchData();
        }
        if (json != null){
            data.loading_data = true;
            let started = new Date();
            
            let inter = setInterval(function(){
                let all = 15;
                var timeDiff = new Date() - started; //in ms
                timeDiff /= 1000;
                let max = 100;
                let percentpassed = timeDiff / all * 100;
                data.loaded_percent = percentpassed > max ? max : percentpassed;
            },1000/60);
            fetchData().then((d)=>{
                clearInterval(inter);
                putData(d);
                data.loaded_percent = 100;
                setTimeout(function(){
                    data.loading_data = false;
                },100);
                navigator.vibrate([50,30]);
            });
            return json;
        }
    }
}
function copyObj(obj){
    return JSON.parse(JSON.stringify(obj));
}
function putData(d){
    data.lastcommit = fillerdata.lastcommit;

    data.username = cookies.get("username");

    data.fullname = d.Name;
    let info_list = ["Name","NameOfBirth","PlaceOfBirth","MothersName","AddressDataList","DateOfBirthUtc","InstituteName","InstituteCode","Tutelaries"];
    let info = {};
    for (let i=0; i < info_list.length; i++){
        let p = info_list[i];
        info[p] = d[p];
    }
    data.info = info;

    let subjects = [];
    let grades = [];
    let recents = [];

    
    let avg_fallback = d.SubjectAverages == undefined || d.SubjectAverages.length == 0;
    if (!avg_fallback){
        for (let e of d.SubjectAverages){
            if (e.Value != 0){
                let obj = {
                    name:e.Subject,
                    average:e.Value,
                    grades:[],
                    HalfYear:null,
                    EndYear:null,
                    avgCalc:createAvgCalc()
                };
                subjects.push(obj);
            }
            
            
        }
    } else {
        let subj = {}; //key value pair subjects list
        for (let i=0; i < d.Evaluations.length; i++){
            let ev = d.Evaluations[i];

            if (ev.Form == "Mark"){
                subj[ev.Subject] = "";
            }
            
        }
        for (let p in subj){
            subjects.push({
                name:p,
                average:null,
                grades:[],
                avgCalc:createAvgCalc()
            })
        }
    }
    
    subjects.sort(function(a,b){
        return a.name.localeCompare(b.name);
    })




    for (let j=0; j < d.Evaluations.length; j++){

        let ev = d.Evaluations[j];
        
        let obj = null;

        let defaults = {
            id:"grade-"+ev.EvaluationId+"-"+ev.Jelleg.Id,
            recentType:"grade",
            value:ev.NumberValue,
            date:ev.Date,
            dateRecorded:ev.CreatingTime,
            subject:ev.Subject,
            mode:ev.Mode,
            teacher:ev.Teacher,
            theme:ev.Theme
        }

        if (ev.Type != "MidYear"){

            for (let i=0; i < subjects.length; i++){
                let subject = subjects[i];
                
                if (ev.Subject == subject.name){
                    subject[ev.Type] = defaults;
                }

            }

        }
        else if (ev.Form == "Mark"){
            obj = defaults;
        } else if (ev.Form == "Deportment" || ev.Form == "Diligence"){
            let names = {
                "Deportment":"Magatartás",
                "Diligence":"Szorgalom"
            }
            let val = ev.Value;
            if (val.length > 2){
                val = val.slice(0,2)+".";
            }

            obj = Object.assign(defaults,{
                recentType:"grade",
                depDil:true,
                value:val,
                subject:names[ev.Form],
                theme:null
            });
        }
            
        if (obj != null){
            grades.push(obj);
            
            for (let i=0; i < subjects.length; i++){
                let subject = subjects[i];
                
                if (ev.Subject == subject.name){
                    subject.grades.push(obj);
                }

            }
        }
    }

    recents.push(...grades);
    let absences = [];
    let delays = [];
    for (let i=0; i < d.Absences.length; i++){
        let abs = d.Absences[i];
        if (abs.Type == "Delay" || abs.Type == "Absence"){
            abs.id = "absence-"+abs.AbsenceId;
            abs.recentType = "absence";
            abs.date = abs.LessonStartTime;
            abs.dateRecorded = abs.CreatingTime;
            abs.justified = abs.JustificationState=="Justified";
            
            if (abs.Type == "Delay") {
                delays.push(abs);
            } else {
                absences.push(abs);
            }
        }
    }
    console.log("abs",absences);
    let newabs = [];
    let absMap = {};
    for (let abs of absences){
        let id = abs.JustificationType + abs.Type + abs.date; // same justification, same type, same day
        let obj = copyObj(abs);
        obj.Type = "AbsentDay";
        obj.absences = [];
        obj.lessons = [];
        if (!absMap[id]){
            absMap[id] = obj;   
        }
        absMap[id].lessons.push(abs.NumberOfLessons);
        absMap[id].absences.push(abs);
    }
    newabs = Object.values(absMap);
    
    for (let abs of newabs){
        abs.lessons.sort((a,b)=> a-b);
        if (abs.lessons.length == 1){
            abs.Type = "Absence";
        }
    }

    console.log("newabs",newabs);
    recents.push(...newabs);
    recents.push(...delays);

    
    for (let i=0; i < d.Notes.length; i++){
        let note = d.Notes[i];
        
        note.id="node-"+note.NoteId;
        note.recentType = "note";
        note.date = note.Date;
        note.dateRecorded = note.CreatingTime;
        recents.push(note);
        
    }
    

    if (avg_fallback){
        for (let subject of subjects){
            subject.average = calcSubjectAvg(subject);
        }
    }
    
    grades.sort((a,b)=>{
        if (new Date(a.dateRecorded) > new Date(b.dateRecorded)){
            return -1;
        }
        else if (new Date(a.dateRecorded) < new Date(b.dateRecorded)){
            return 1;
        }
        return 0;
    });
    recents.sort((a,b)=>{
        if (new Date(a.dateRecorded) > new Date(b.dateRecorded)){
            return -1;
        }
        else if (new Date(a.dateRecorded) < new Date(b.dateRecorded)){
            return 1;
        }
        return 0;
    });

    updateArray(data.absences, absences);
    updateArray(data.delays, delays);
    updateArray(data.grades, grades);
    updateArray(data.subjects, subjects);
    updateArray(data.recents, recents);
    
    
}
async function loadData(){
    let d = await getData();
    
    putData(d);


    console.log("data loaded",d);
}


let institutions = [];


if (cookies.get("access_token")){
    data.logged_in = true;
    data.loading = true;
    loadData().then(()=>{
        data.loading = false;
    }).catch((err)=>{
        alert(err.message);
    });
    
} else {
    data.loading = true;
    institute().then((d)=>{
        
        institutions = JSON.parse(d);
        data.loading = false;
        
        
    }).catch((err)=>{
        alert(err.message);
    });
}





if (cookies.get("loginerror")){
    data.loginerror = {
        error:true,
        message:cookies.get("loginerror")
    }
}


function searchSchool(search){
    let found = [];
    for (let i=0; i < institutions.length; i++){
        if (found.length >= 5){
            break;
        }

        if (institutions[i].Name.toLowerCase().indexOf(search.toLowerCase()) != -1){
            found.push(institutions[i]);
        }
    }
    return found;
}
var subjectRoundings = {
    "dummy":0.5
}

if (localStorage.getItem("subjectRoundings")){
    subjectRoundings = JSON.parse(localStorage.getItem("subjectRoundings"));
}

function getRound(name){
    let roundat = 0.5;
    if (subjectRoundings[name]){
        roundat = subjectRoundings[name];
    }
    return roundat;
}

function roundSubject(s){
    let roundat = getRound(s.name);
    
    let base = Math.floor(s.average);
    let baseround = base+roundat;
    if (s.average >= baseround){
        return Math.ceil(s.average);
    } else {
        return Math.floor(s.average);
    }

}



function logout(){
    let del = ["access_token","inst","password_encrypted","refresh_token","time","username"];
    for (let i=0; i < del.length; i++){
        cookies.del(del[i]);
    }
    window.location.href = window.location.href;
}

window.addEventListener('load', function() {
    window.history.pushState({}, '')
})
  
if ('scrollRestoration' in history) {
    history.scrollRestoration = 'manual';
}

window.addEventListener('popstate', function() {

    
    

    window.history.pushState({}, '');
    if (data.page == "home"){
        closeSubjectDetail();
        data.ranksScreen = false;
        closeRound();
    }
    

    
    
    
})



function domAdded(){
    let inputs = [];
    inputs.push(...document.querySelectorAll('input[type="number"]'));
    inputs.push(...document.querySelectorAll('input[type="text"]'));
    
    for (let i=0; i < inputs.length; i++){
        let input = inputs[i];
        input.onfocus = function(event){
            console.log("focus",event);
            document.body.classList.add("keyboard");
        }
        input.onblur = function(event){
            console.log("blur",event);
            document.body.classList.remove("keyboard");    
        }
    }
}
document.body.addEventListener('DOMNodeInserted', function (event) {
    domAdded();
});
domAdded();

onscroll = function(event){
    
    if (!pageinfos[data.page]){
        pageinfos[data.page] = {};
    }
    pageinfos[data.page].scrollTop = document.documentElement.scrollTop;
    
}

function closeSubjectDetail(){
    data.viewedSubject.avgCalc = createAvgCalc(); data.viewedSubject = data.defaultSubject;
}




{
    let options = document.getElementById("recentModeOptions");
    for (let mode in recentModes){
        let elem = document.createElement("button");
        elem.innerHTML = recentModes[mode];
        elem.setAttribute("onclick",`
            data.recentMode = '${mode}'; localStorage.setItem("lastrecent",'${mode}');
        `);
        options.appendChild(elem);
    }
}

var pageinfos = {
    "dummy":{
        scrollTop:0
    }
}
function showRoundView(name,event){
    document.getElementById("roundInput").value = getRound(name)*100;
    data.roundView = name;
    
    event.stopPropagation();
}
function validateRound(t,event){
    
    if (t.value.length > 3){
        t.value = t.value.slice(0,2);
    }
}
function closeRound(){
    let subject = data.roundView;
    let round = 0.5;
    if (document.getElementById("roundInput").checkValidity() && document.getElementById("roundInput").value){
        round = parseFloat("0."+document.getElementById("roundInput").value)
    }
    
    console.log("set",subject,round);
    subjectRoundings[subject] = round;

    localStorage.setItem("subjectRoundings",JSON.stringify(subjectRoundings));

    data.roundView = null;
    document.getElementById("roundInput").value = "";
}
function getAvgHalfyr(type){
    let sum = 0;
    let count = 0;
    for (let i=0; i < data.subjects.length; i++){
        let s = data.subjects[i];
        if (s[type]){
            sum += s[type].value;
            count++;
        }
    }
    return sum/count;
}
function getAvgHalfyrF(type){
    let num = getAvgHalfyr(type);
    if (isNaN(num)){
        return "#";
    } else {
        return num.toFixed(2);
    }
}
var app = new Vue({
    el: '#app',
    components: {
        'progress-ring': ProgressRing
    },
    data: data,
    methods: {
        isDark,
        getAvgHalfyr,
        getAvgHalfyrF,
        getDelaySum(){
            let sum = 0;
            for (let d of this.delays){
                sum+=d.DelayTimeMinutes;
            }

            return sum;
        },
        getJustifiedSum(){
            let sum = 0;
            for (let d of this.absences){
                if (d.justified){
                    sum++;
                }
            }

            return sum;
        },
        getUnjustifiedSum(){
            let sum = 0;
            for (let d of this.absences){
                if (!d.justified){
                    sum++;
                }
            }

            return sum;
        },
        getRecentIcon(mode){
            let pairs = {
                "all":"box",
                "absence":"watch",
                "grade":"book",
                "note":"clipboard"
            }
            return pairs[mode];
        },
        checkShowRecent(mode){
            return this.recentMode == "all" || this.recentMode == mode;
        },
        getRecentModeText(){
            
            return recentModes[this.recentMode];
        },
        getGrades(){

        },
        formatDate,
        getDayOfWeek,
        roundSubject,
        getGradeName,
        createAvgCalc,
        openSubject(subject){
            
            data.viewedSubject = subject;
            let g=[];
            
            for (let i=0; i < subject.grades.length; i++){
                g.push(subject.grades[i].value);
            }
            g.reverse();
            avgChartUpdate(g);
        },
        changePage(page){
            if (this.page == "home"){
                closeSubjectDetail();
                data.ranksScreen = false;
                closeRound();
            }
            this.page = page;
            if (pageinfos[this.page]){
                app.$nextTick(function () {
                    document.documentElement.scrollTo(0,pageinfos[this.page].scrollTop);    
                });
            } else {
                document.documentElement.scrollTo(0,0);
            }
            
            localStorage.setItem("lastpage",page);
        },
        calcSubjectAvg,
        average(){
            let sum = 0;
            
            for (let subject of this.subjects){
                sum += roundSubject(subject);
            }
            return sum/this.subjects.length;
        },
        isRoundedUp(s){
            if (roundSubject(s) == s.average){
                return true;
            }
            if (roundSubject(s) > s.average){
                return true;
            }
            return false;
        },
        isLoading(){
            if (!this.logged_in && loading_inst){
                return true;
            }
            return false;
        },
        searchSchool,
        format(num,add0){
            let result = Math.round(num*100)/100;

            if (add0) {
                return result.toFixed(2);
            }

            return result;
        },
        avg_percent(){
            return this.average() / 5 * 100;
        },
        name_abbriv(){
            return this.fullname.split(" ").map( (e)=>e[0] ).join("");
            
        },
        rank(){
            let avg = this.average();
            let currentRank = {min:0,name:"Error", color: "#000000"};
            for (let i=0; i < ranks.length; i++){
                if (ranks[i].min > currentRank.min && avg >= ranks[i].min){
                    currentRank = Object.assign({},ranks[i]);
                }
            }
            currentRank.color = "#DCE0D9";
            return currentRank;

        }
    }
})
async function clearCachePopUp(){
    await clearCache();
}
async function clearCache(){
    let cache = (await caches.open("cache-v1"));
    let keys = await cache.keys();

    for (let key of keys){
        cache.delete(key);
    }
}
setInterval(async function(){
    let cache = (await caches.open("cache-v1"));
    let keys = await cache.keys();

    data.cacheCount = keys.length;
},100);