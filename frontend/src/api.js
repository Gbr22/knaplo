import {httpRequest} from './http';
import GlobalState, { ApiEndpoint } from './globalState';
import { pushError  } from './components/MessageDisplay';
import storage from './storage';
import { getWeek, getDateCompareNumber, getWeekIndex } from './util';


let loginInfo;

let API_KEY = "7856d350-1fda-45f5-822d-e1a2f3f1acf0";
let CLIENT_ID = "919e0c1c-76a2-4646-a2fb-7085bbbf3c56";

function req(options){
    if (options.headers == undefined){
        options.headers = {};
    }
    options.headers = Object.assign({
        "User-Agent":"Kreta.Ellenorzo/2.9.11.2020033003 (Linux; U; Android 8.0.0)",
        "apiKey":API_KEY,
        'Content-Type': 'application/x-www-form-urlencoded',
    },options.headers);
    return httpRequest(options);
}
export function getFromCache(dataKey){
    return storage.getJSON("data/"+dataKey);
}
window.getFromCache = getFromCache;
export function genericKretaRequest(endpoint,dataKey,errorMessage){
    let info = GlobalState.user;
    return new Promise(function(resolve,reject){
        refreshUser().then(()=>{
            function showErr(err){
                if (errorMessage){
                    pushError(errorMessage)
                }
                reject(err);
            }
            req({
                url:`https://${info.inst}.e-kreta.hu/${endpoint}`,
                headers:{
                    "Authorization":"Bearer "+info.access_token,
                },
            }).then((res)=>{
                if (res.statusCode == 200){
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
export function getData(){
    return genericKretaRequest("mapi/api/v1/StudentAmi?fromDate=null&toDate=null","data","Tanuló adatok lekérése sikertelen")
}

export function getWeekStorageId(weeksAfter = 0){
    let {first, last} = getWeekIndex(weeksAfter);

    let id = "timetable/week/"+getDateCompareNumber(first);
    return id;
}
export function getTimetable(weeksAfter = 0){
    
    let {first, last} = getWeekIndex(weeksAfter);

    let id = getWeekStorageId(weeksAfter);
    if (getFromCache(id) && weeksAfter < 0){
        return Promise.resolve(getFromCache(id));
    } else if (weeksAfter >= 0 && !navigator.onLine){
        return Promise.resolve(getFromCache(id));
    }

    function format(date){
        let pad = (n) => (n+"").padStart(2,"0");
        return `${date.getFullYear()}-${pad(date.getMonth()+1)}-${pad(date.getDate())}`;
    }

    return genericKretaRequest(`mapi/api/v1/LessonAmi?fromDate=${format(first)}&toDate=${format(last)}`,id,"Órarend lekérése sikertelen");
}
export function fetchInst(){
    return new Promise(function(resolve,reject){
        let errorMessage = "Intézmények lekérése sikertelen";
        function showErr(err){
            if (errorMessage){
                pushError(errorMessage)
            }
            reject(err);
        }
        httpRequest({
            url:`${ApiEndpoint}institute`,
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

export async function getHomework(id){
    
    let hw = await genericKretaRequest(`mapi/api/v1/HaziFeladat/TanarHaziFeladat/${id}`,"homework/"+id);
    return hw;
    
}

window.getTimetable = getTimetable;
window.getData = getData;

export function setHomeworkDone(id,state){
    return new Promise(function(resolve,reject){
        
        
        let data = {
            "TanarHaziFeladatId":id.toString(),
            "isMegoldva":state ? "True" : "False"
        }
        function fail(){
            reject("Nem sikerült a házi állapotát megváltoztatni");
        }
        req({
            method:"POST",
            url:`https://${GlobalState.user.inst}.e-kreta.hu/mapi/api/v1/HaziFeladat/Megoldva`,
            body:data,
            headers:{
                "Authorization":"Bearer "+GlobalState.user.access_token,
                "Content-Type":"application/json"
            },
        }).then((r)=>{
            if (r.statusCode == 200 || r.statusCode == 204){
                resolve();
            } else {
                fail();
            }
        }).catch(err=>{
            console.error("login failed",err);
            fail();
        })
    })
}
window.setHomeworkDone = setHomeworkDone;
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
            url:`https://${form.inst}.e-kreta.hu/idp/api/v1/Token`,
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
            url:`https://${user.inst}.e-kreta.hu/idp/api/v1/Token`,
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