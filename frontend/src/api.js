import {httpRequest} from './http';
import GlobalState from './globalState';
import { pushError  } from './components/MessageDisplay';
import storage from './storage';


let loginInfo;

let API_KEY = "7856d350-1fda-45f5-822d-e1a2f3f1acf0";
let CLIENT_ID = "919e0c1c-76a2-4646-a2fb-7085bbbf3c56";

function req(options){
    if (options.headers == undefined){
        options.headers = {};
    }
    Object.assign(options.headers, {
        "User-Agent":"Kreta.Ellenorzo/2.9.11.2020033003 (Linux; U; Android 8.0.0)",
        "apiKey":API_KEY,
        'Content-Type': 'application/x-www-form-urlencoded',
    });
    return httpRequest(options);
}
export function getFromCache(dataKey){
    return storage.getJSON("data_"+dataKey);
}
window.getFromCache = getFromCache;
export function genericKretaRequest(endpoint,dataKey,errorMessage){
    let info = GlobalState.user;
    return new Promise(function(resolve,reject){
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
                storage.setJSON("data_"+dataKey, res.bodyJSON);
                resolve(res.bodyJSON);
            } else {
                showErr(res);
            }
        }).catch((err)=>{
            showErr(err);
        });
    });
}
export function getData(){
    return genericKretaRequest("mapi/api/v1/StudentAmi?fromDate=null&toDate=null","data","Tanuló adatok lekérése sikertelen")
}
export function getTimetable(){
    return genericKretaRequest("mapi/api/v1/LessonAmi?fromDate=null&toDate=null","timetable","Órarend lekérése sikertelen");
}
export async function getHomework(id){
    let s = getFromCache("homework/"+id);
    if (s){
        return s;
    } else {
        let hw = await genericKretaRequest(`mapi/api/v1/HaziFeladat/TanarHaziFeladat/${id}`,"homework/"+id);
        return hw;
    }
}

window.getTimetable = getTimetable;
window.getData = getData;
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
window.login = login;