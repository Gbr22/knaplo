import {httpRequest} from './http';
import GlobalState, { ApiEndpoint } from './globalState';
import { pushError  } from './components/MessageDisplay';
import storage from './storage';
import { getWeek, getDateCompareNumber, getWeekIndex } from './util';


let loginInfo;
var API_KEY = "7856d350-1fda-45f5-822d-e1a2f3f1acf0";
let CLIENT_ID = "kreta-ellenorzo-mobile";
let USER_AGENT_V2 = "Kreta.Ellenorzo/2.9.11.2020033003 (Linux; U; Android 8.0.0)";
let USER_AGENT_V3 = "hu.ekreta.student/1.0.5/Android/0/0";
let USER_AGENT_WEB = navigator.userAgent;
let USER_AGENT = USER_AGENT_V3;

let KretaEndpoints = {
    admin:"https://eugyintezes.e-kreta.hu",
}

function req(options){
    if (options.headers == undefined){
        options.headers = {};
    }
    options.headers = Object.assign({
        "User-Agent":USER_AGENT,
        "apiKey":API_KEY,
        'Content-Type': 'application/x-www-form-urlencoded',
    },options.headers);
    return httpRequest(options);
}
export function getFromCache(dataKey){
    return storage.getJSON("data/"+dataKey);
}
window.getFromCache = getFromCache;

export function kretaRequest(endpoint,dataKey,errorMessage){
    let info = GlobalState.user;
    var inst = info.inst;
    return new Promise(function(resolve,reject){
        refreshUser().then(()=>{
            function showErr(err){
                if (errorMessage){
                    pushError(errorMessage);
                    console.error(errorMessage,err);
                }
                reject(err);
            }
            req({
                url:`https://${inst}.e-kreta.hu/ellenorzo/V3/Sajat/${endpoint}`,
                headers:{
                    "Authorization":"Bearer "+info.access_token,
                    "User-Agent":USER_AGENT,
                },
            }).then((res)=>{
                if (res.statusCode == 200){
                    /* debugger; */
                    storage.setJSON("data/"+dataKey, res.bodyJSON);
                    resolve(res.bodyJSON);
                } else {
                    showErr(res);
                }
            }).catch((err)=>{
                showErr(err);
            });
        })
    });
}
export function getHomeworks(){
    var dateString = "1996-01-01";
    
    return kretaRequest(`HaziFeladatok?datumTol=${dateString}`,"homeworks","Házifeladatok lekérése sikertelen");
}
export function getGrades(){
    return kretaRequest("Ertekelesek","grades","Jegyek lekérése sikertelen");
}
export function getAbsences(){
    return kretaRequest("Mulasztasok","absences","Mulasztások lekérése sikertelen");
}

export function getNotes() {
    return kretaRequest("Feljegyzesek","notes","Feljegyzések lekérése sikertelen");
}
export function getStudentInfo(){
    return kretaRequest("TanuloAdatlap","studentinfo","Tanuló adatainak lekérése sikertelen");
}
export function getTests(){
    return kretaRequest("BejelentettSzamonkeresek","tests","Számonkérések lekérése sikertelen");
}
export function getEvents(){
    return kretaRequest("FaliujsagElemek","events","Faliújság lekérése sikertelen");
}
export let messageTypes = {
    "received":"beerkezett",
    "sent":"elkuldott",
    "removed":"torolt",
};

export function getMessages(type){
    let info = GlobalState.user;
    var inst = info.inst;
    let dataKey = "messages_"+Object.entries(messageTypes).find(e=>e[1] == type)[0];
    let errorMessage = "Üzenetek lekérése sikertelen";
    return new Promise(function(resolve,reject){
        refreshUser().then(()=>{
            function showErr(err){
                if (errorMessage){
                    pushError(errorMessage);
                    console.error(errorMessage,err);
                }
                reject(err);
            }
            req({
                url:`${KretaEndpoints.admin}/api/v1/kommunikacio/postaladaelemek/${type}`,
                headers:{
                    "Authorization":"Bearer "+info.access_token,
                    "User-Agent":USER_AGENT,
                },
            }).then((res)=>{
                if (res.statusCode == 200){
                    /* debugger; */
                    storage.setJSON("data/"+dataKey, res.bodyJSON);
                    resolve(res.bodyJSON);
                } else {
                    showErr(res);
                }
            }).catch((err)=>{
                showErr(err);
            });
        })
    });
}
export function sendMessage({recipients,subject,content}){
    let info = GlobalState.user;
    
    recipients = recipients.map(e=>e.obj);
    let attachments = [];
    let message = {
        "cimzettLista": recipients,
        "csatolmanyok": attachments,
        "targy": subject,
        "szoveg": content,
    };
    
    let errorMessage = "Üzenet elküldése sikertelen";
    return new Promise(function(resolve,reject){
        refreshUser().then(()=>{
            function showErr(err){
                if (errorMessage){
                    pushError(errorMessage);
                    console.error(errorMessage,err);
                }
                reject(err);
            }
            req({
                url:`${KretaEndpoints.admin}/api/v1/kommunikacio/uzenetek`,
                body:message,
                method:"POST",
                headers:{
                    "Authorization":"Bearer "+info.access_token,
                    "User-Agent":USER_AGENT,
                    "Content-Type":"application/json"
                },
            }).then((res)=>{
                if (res.statusCode == 200){
                    resolve(res.bodyJSON);
                } else {
                    showErr(res);
                }
            }).catch((err)=>{
                showErr(err);
            });
        })
    });
}
export function downloadAttachment(id){
    let info = GlobalState.user;
    
    let errorMessage = "Csatolmány lekérése sikertelen";
    return new Promise(function(resolve,reject){
        refreshUser().then(()=>{
            function showErr(err){
                if (errorMessage){
                    pushError(errorMessage);
                    console.error(errorMessage,err);
                }
                reject(err);
            }
            req({
                url:`${KretaEndpoints.admin}/api/v1/dokumentumok/uzenetek/${id}`,
                headers:{
                    "Authorization":"Bearer "+info.access_token,
                    "User-Agent":USER_AGENT,
                },
            }).then((res)=>{
                if (res.statusCode == 200){
                    resolve(res.blob);
                } else {
                    showErr(res);
                }
            }).catch((err)=>{
                showErr(err);
            });
        })
    });
}

export function getMessage(id){
    let info = GlobalState.user;
    var inst = info.inst;
    let dataKey = "messages/"+id;
    let errorMessage = "Üzenet lekérése sikertelen";
    return new Promise(function(resolve,reject){
        refreshUser().then(()=>{
            function showErr(err){
                if (errorMessage){
                    pushError(errorMessage);
                    console.error(errorMessage,err);
                }
                reject(err);
            }
            req({
                url:`${KretaEndpoints.admin}/api/v1/kommunikacio/postaladaelemek/${id}`,
                headers:{
                    "Authorization":"Bearer "+info.access_token,
                    "User-Agent":USER_AGENT,
                },
            }).then((res)=>{
                if (res.statusCode == 200){
                    /* debugger; */
                    storage.setJSON("data/"+dataKey, res.bodyJSON);
                    resolve(res.bodyJSON);
                } else {
                    showErr(res);
                }
            }).catch((err)=>{
                showErr(err);
            });
        })
    });
}
Object.assign(window,{
    getGrades,
    getStudentInfo,
    getHomeworks,
    getTests,
    getMessages,
    messageTypes,
    getMessage,
    downloadAttachment,
    sendMessage,
})

export function getWeekStorageId(weeksAfter = 0){
    let {first, last} = getWeekIndex(weeksAfter);

    let id = "timetable/week/"+getDateCompareNumber(first);
    return id;
}
export function getTimetable(weeksAfter = 0){
    
    let {first, last} = getWeekIndex(weeksAfter);

    let id = getWeekStorageId(weeksAfter);
    if (getFromCache(id) && weeksAfter < -4){
        return Promise.resolve(getFromCache(id));
    } else if (weeksAfter >= 0 && !navigator.onLine){
        return Promise.resolve(getFromCache(id));
    }

    function format(date){
        let pad = (n) => (n+"").padStart(2,"0");
        return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}`;
    }
    
    return kretaRequest(`OrarendElemek?datumTol=${format(first)}&datumIg=${format(last)}`,id,"Órarend lekérése sikertelen");
}
export function fetchInst(){
    return fetchInstRaw().then((d)=>{
        let inst = [];
        for (let e of d){
            inst.push({
                Name:e.name,
                InstituteCode:e.instituteCode,
                City:e.city,
            });
        }
        return inst;
    }).catch((err)=>{
        return err;
    })
}
window.fetchInst = fetchInst;
export function fetchInstRaw(){
    return new Promise(function(resolve,reject){
        let errorMessage = "Intézmények lekérése sikertelen";
        function showErr(err){
            if (errorMessage){
                pushError(errorMessage)
            }
            reject(err);
        }
        httpRequest({
            url: "https://kretaglobalmobileapi2.ekreta.hu/api/v3/Institute",
            headers: {
              "User-Agent": USER_AGENT,
              apiKey: API_KEY,
            }
        }).then((res)=>{
            if (res.statusCode == 200){
                storage.setJSON("data/inst", res.bodyJSON);
                resolve(res.bodyJSON);
            } else {
                showErr(res);
            }
        }).catch((err)=>{
            showErr(err);
        });
    });
}
window.fetchInstRaw = fetchInstRaw;

window.getTimetable = getTimetable;


export function login(form){
    return new Promise(function(resolve,reject){
        let props = ["inst","username","password"];
        let missing = {
            inst:"Intézményt",
            username:"Felhasználónevet",
            password:"Jelszót"
        }
        for (let p of props){
            if (!form[p]){
                reject(`Nem adott meg ${missing[p]}!`);
                return;
            }
        }
        let data = {
            institute_code:form.inst,
            userName:form.username,
            password:form.password,
            grant_type:'password',
            client_id:CLIENT_ID,
        }
        req({
            method:"POST",
            url:`https://idp.e-kreta.hu/connect/token`,
            body:data,
        }).then((r)=>{
            if (r.statusCode == 200){
                let o = r.bodyJSON;
                let info = {
                    "access_token":o.access_token,
                    "refresh_token":o.refresh_token,
                    "inst":form.inst,
                    "password":form.password,
                    "username":form.username
                }
                localStorage.setItem("loginInfo",JSON.stringify(info));
                resolve(info);
            } else {
                if (r.bodyJSON){
                    let messages = {
                        "invalid_grant":"Helytelen felhasználónév, vagy jelszó",
                        "invalid_password":"A jelszó üres"
                    }
                    reject(messages[r.bodyJSON.error] || r.bodyJSON.error_description || "Ismeretlen hiba");
                } else {
                    reject(`${r.statusCode} ${r.statusMessage}`)
                }
            }
        }).catch(err=>{
            console.error("login failed",err);
            reject("Sikertelen bejelentkezés");
        })
    })
}
export function refreshLogin(){
    return new Promise((resolve,reject)=>{
        let user = GlobalState.user;
        login({
            username:user.username,
            password:user.password,
            inst:user.inst
        }).then(result=>{
            console.log("Login refresh result",result);
            Object.assign(user,result);
            resolve(user);
        }).catch((err)=>{
            console.warn("login",err);
            reject(err);
        });
    })
}
export function decodeToken(access_token){
    let parts = access_token.split(".");
    function decode(data){
        let buff = new Buffer(data, 'base64');
        let text = buff.toString('utf8');
        return text;
    }
    return JSON.parse(decode(parts[1]));
}
window.decodeToken = decodeToken;
export async function assureAccesstoken(){
    let loginInfo = GlobalState.user;
    let tokenInfo = decodeToken(loginInfo.access_token);
    let expires = tokenInfo.exp;
    let now = Date.now()/1000;
    let time = expires - now; //in seconds
    let timeMinutes = time/60;
    if (timeMinutes >= 3){
        console.log(`[${timeMinutes.toFixed(2)}m left till refresh]`);
        return(loginInfo);
    } else {
        throw ("Token not valid");
    }
}
window.assureAccesstoken = assureAccesstoken;
export function refreshUser(){
    
    return new Promise((resolve,reject)=>{
        let c = Math.random();
        function functionBuilder(string){
            return (r)=>{
                console.log(string+" successful",c);
                resolve(r);
            }
        }
        let f = functionBuilder;
        assureAccesstoken().then(f("Access token")).catch(()=>{
            console.log("Access token failed",c);
            refreshToken().then(f("Refresh token")).catch(()=>{
                console.log("Refresh token failed",c);
                refreshLogin().then(f("Login")).catch(()=>{
                    console.log("Login failed",c);
                    let m = "Érvénytelen bejelentkezés";
                    pushError(m);
                    reject(m);
                })
            })
        })
    })
}
window.refreshUser = refreshUser;

export function getDktToken(){
    let accessToken = GlobalState.user.access_token;
    let data = {
        response_type:"id_token token",
        client_id:"kreta-dkttanulo-js-web",
        redirect_uri:"https://dkttanulo.e-kreta.hu",
        scope: "kreta-core-webapi.public openid kreta-core-webapi-dkt.public kreta-global-tananyagtar-webapi.public",
        accessToken:accessToken,
        nonce:"_", //important
    }
    let serialize = function(obj) {
        var str = [];
        for (var p in obj)
            if (obj.hasOwnProperty(p)) {
            str.push(escape(p) + "=" + escape(obj[p]));
            }
        return str.join("&");
    }
    return req({
        method:"GET",
        url:`https://idp.e-kreta.hu/connect/authorize?${serialize(data)}`,
        redirect: 'manual',
    }).then((r)=>{
        if (r.statusCode >= 300 && r.statusCode < 400){
            let loc = r.headers.location;
            return req({
                method:"GET",
                url:loc,
                redirect:"manual",
            }).then(r=>{
                let cookies = {};
                for(let p in r.cookies){
                    cookies[p] = r.cookies[p].value;
                }
                return req({
                    url:r.headers.location,
                    cookies,
                    redirect:"manual",
                }).then(r=>{
                    let url = new URL(r.headers.location);
                    let search = new URLSearchParams(url.hash.replace("#",""));
                    let dkt = {}
                    let keys = [...search.keys()];
                    keys.forEach(key=>{
                        dkt[key] = search.get(key);
                    });
                    Object.assign(GlobalState.dktLogin, dkt);
                    return dkt;
                })
            })
        }
        else {
            throw new Error();
        }
    }).catch(err=>{
        console.warn(err);
        return new Error("DKT belépés sikertelen");
    })
}
window.getDktToken = getDktToken;

export function refreshToken(){
    let user = GlobalState.user;
    return new Promise(function(resolve,reject){
        let data = {
            refresh_token:user.refresh_token,
            grant_type:'refresh_token',
            client_id:CLIENT_ID,
        }
        req({
            method:"POST",
            url:`https://idp.e-kreta.hu/connect/token`,
            body:data,
        }).then((r)=>{
            if (r.statusCode == 200){
                let o = r.bodyJSON;
                Object.assign(user,{
                    "access_token":o.access_token,
                    "refresh_token":o.refresh_token,
                })
                localStorage.setItem("loginInfo",JSON.stringify(user));
                resolve(user);
            } else {
                if (r.bodyJSON){
                    let messages = {
                    }
                    reject(messages[r.bodyJSON.error] || r.bodyJSON.error_description || "Ismeretlen hiba");
                } else {
                    reject(`${r.statusCode} ${r.statusMessage}`)
                }
            }
        }).catch(err=>{
            console.error("login failed",err);
            reject("Sikertelen bejelentkezés");
        })
    })
}
window.refreshToken = refreshToken;
window.login = login;