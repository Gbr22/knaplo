


const ProgressRing = Vue.component('progress-ring', {
    props: {
      radius: Number,
      progress: Number,
      stroke: Number,
      strokeColor:String
    },
    data() {
      const normalizedRadius = this.radius - this.stroke * 2;
      const circumference = normalizedRadius * 2 * Math.PI;
      
      return {
        normalizedRadius,
        circumference
      };
    },
    computed: {
      strokeDashoffset() {
        return this.circumference - this.progress / 100 * this.circumference;
      }
    },
    template: `
      <svg
        :height="radius * 2"
        :width="radius * 2"
       >
         <circle
            
            :stroke-dasharray="circumference + ' ' + circumference"
            :style="{ strokeDashoffset: strokeDashoffset }"
            :stroke-width="stroke"
            :stroke="strokeColor"
            fill="transparent"
            :r="normalizedRadius"
            :cx="radius"
            :cy="radius"
        />
      </svg>
    `
  });

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

let data = {
    username:"",
    page:"recent",
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
    subjects:[],
    ranksScreen:false,
    ranks:ranks,
    defaultSubject:{
        "null":true,
        name:"Subject name",
        grades:[],
        average:null,
        avgCalc:createAvgCalc()
    },
    viewedSubject:{
        "null":true,
        name:"Subject name",
        grades:[],
        average:null,
        avgCalc:createAvgCalc()
    }
}



function showRanks(){

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

async function getData(){

    

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
    

    
    let avg_fallback = d.SubjectAverages == undefined || d.SubjectAverages.length == 0;
    if (!avg_fallback){
        for (let e of d.SubjectAverages){
            if (e.Value != 0){
                let obj = {
                    name:e.Subject,
                    average:e.Value,
                    grades:[],
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
        if (ev.Form == "Mark"){
            
        
            let obj = {
                value:ev.NumberValue,
                date:ev.Date,
                dateRecorded:ev.CreatingTime,
                subject:ev.Subject,
                mode:ev.Mode,
                teacher:ev.Teacher,
                theme:ev.Theme
            }

            grades.push(obj);
            
            for (let i=0; i < subjects.length; i++){
                let subject = subjects[i];
                
                if (ev.Subject == subject.name){
                    subject.grades.push(obj);

                    
                }

            }
        }
        
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
    
    data.grades = grades;
    data.subjects = subjects;
    

    console.log(d);
}


let institutions = [];


if (cookies.get("access_token")){
    data.logged_in = true;
    data.loading = true;
    getData().then(()=>{
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
function roundSubject(s){
    return Math.round(s.average);
}

function getDayOfWeek(d){
    let days = ["Vasárnap","Hétfő","Kedd","Szerda","Csütörtök","Péntek","Szombat"];
    //Sunday first is important


    return days[d.getDay()];
}
function formatDate(d){
    function f(n){
        if (n < 10){
            return "0"+n;
        }
        return n;
    }
    return `${f(d.getMonth()+1)}/${f(d.getDate())}`;
}

function logout(){
    let del = ["access_token","inst","password_encrypted","refresh_token","time","username"];
    for (let i=0; i < del.length; i++){
        cookies.del(del[i]);
    }
    window.location.href = window.location.href;
}



var app = new Vue({
    el: '#app',
    components: {
        'progress-ring': ProgressRing
    },
    data: data,
    methods: {
        formatDate,
        getDayOfWeek,
        roundSubject,
        getGradeName,
        createAvgCalc,
        openSubject(subject){

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
