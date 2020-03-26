import GlobalState from './globalState';


import { pushError } from './components/MessageDisplay';

function makeRequest(mode,url, data = {}){
    let base = "/api/";
    return new Promise(function(promiseResolve){
        function resolve(obj){

            if (!obj.success){
                pushError(obj.message)
            }

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
                resolve({success:false, message: xhttp.responseText || `Hiba ${this.status}`, data:null});
            }
        };
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

        xhttp.open(mode, base+url+params, true);
        xhttp.send();

    });
}


function get(url){
    return makeRequest("GET",url);
}
function post(url, data){
    return makeRequest("POST",url,data);
}
function login(form){
    return post("login",form);
}
function getData(){
    return get("data");
}

export class NormalisedItem {

    obj=null;

    createDate;
    date;
    
    type="normal";
    
    key;

    header;
    icon;
    desc;

    constructor(o) {
        this.obj = o;
        this.createDate = o.CreatingTime;
        this.date = o.Date;

        this.key = this.type+this.obj.EvaluationId+this.obj.Jelleg?.Id;
    }
}

export class Grade extends NormalisedItem {

    type="grade";
    value;
    teacher;
    theme;
    mode;

    constructor(o) {
        super(o);
        this.value = o.NumberValue;
        this.teacher = o.Teacher;
        this.subject = o.Subject;
        this.theme = o.Theme;
        this.mode = o.Mode;

        this.header = this.subject;
        this.desc = this.theme ? this.theme : this.mode;
        this.icon = this.value;
    }
    
}

function updateArray(arr,n){
    arr.splice(0,arr.length);
    arr.push(...n);
}

function afterLogin(){
    getData().then((result)=>{
        if (result.success){
            let data = GlobalState.data = result.data;
            let pd = GlobalState.processedData;

            

            let grades = data.Evaluations.filter((e)=>{
                return e.Form == "Mark" && e.Type == "MidYear";
            }).map((e)=>{
                return new Grade(e);
            });

            let subjects = [];
            let subject_keys = {};

            for (let g of grades){
                if (!subject_keys[g.subject]){
                    let obj = {
                        name:g.subject,
                        average:5,
                        grades:[]
                    };
                    subject_keys[g.subject] = obj;
                    subjects.push(obj)
                }
                subject_keys[g.subject].grades.push(g);
                
            }
            subjects.sort(function(a,b){
                return a.name.localeCompare(b.name);
            })
            

            updateArray(pd.grades,grades);
            updateArray(pd.subjects,subjects);

            
            
        }
    });
}


function getInst(callback = ()=>{}){
    let items = [];

    get("institute").then(function(result){
        if (result.success){
            result.data = result.data.map((e)=>({
                code:e.InstituteCode,
                name:e.Name,
                city:e.City
            }));
            items.push(...result.data);
            callback(result.data);
            console.log(result.data);
        }
    });
    

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