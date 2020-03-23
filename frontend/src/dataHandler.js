import GlobalState from './globalState';


function showError(message){
    alert(message);
    // TODO: Implement error widget
}

function makeRequest(mode,url, data = {}){
    let base = "/api/";
    return new Promise(function(promiseResolve){
        function resolve(obj){

            if (!obj.success){
                showError(obj.message)
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

function afterLogin(){
    getData().then((result)=>{
        if (result.success){
            GlobalState.data = result.data;
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