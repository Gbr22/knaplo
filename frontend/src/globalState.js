import { getInst } from "./dataHandler";

import Cookies from 'js-cookie';

import { afterLogin, getHomeworksCompletedMap } from './dataHandler';
import { getCookieFromString } from "./util";
import storage from './storage';
import { httpRequest } from "./http";

let GlobalState = {
    loaded:false,
    loggedIn:false,
    data:null,
    lessonsList:[],
    processedData:{
        subjects:[],
        grades:[],
        notes:[],
        absentDays:[],
        absences:[],
        delays:[],
        timetable:{
            weeks:[]
        },
        homeworks:[],
        homeworksCompleted:[],
    },
    cordovaIsDebug:false,
    user:null,
    currentMenu:localStorage.getItem("currentMenu") || "timeline"
};

window.Cookies = Cookies;

export let ApiEndpoint = "/api/";

function loginWithCookie(c){
    
    
}

async function tryLogin(){
    let cookie = getCookieFromString("loginInfo",document.cookie);
    if (cookie && !storage.getJSON("loginInfo")){
        try {
            let result = await httpRequest({
                method:"POST",
                body:JSON.parse(cookie),
                url:"/api/loginInfo"
            })
            console.log("cookie result",result);
            storage.setJSON("loginInfo",result.bodyJSON);
        } catch(err){
            console.log("Error with cookie",err);
        }
    }

    let info = storage.getJSON("loginInfo");
    if (info){
        GlobalState.loggedIn = true;
        GlobalState.user = info;
        afterLogin();
    }
    GlobalState.loaded = true;
}

if (window.cordova != undefined){
    document.addEventListener("deviceready", function(){
        navigator.splashscreen.hide();
        
        cordova.plugins.IsDebug.getIsDebug(function(isDebug) {
            console.log('Is debug:', isDebug);
            GlobalState.cordovaIsDebug = isDebug;
            ApiEndpoint = GlobalState.cordovaIsDebug ?
                `http://${window.location.hostname}:84/api/` :
                "https://naplo.gbr22.me/api/";
            console.log("endpoint",ApiEndpoint);
            tryLogin();
        }, function(err) {
            console.error(err);
        });
        
    }, false);
} else {
    console.log("endpoint",ApiEndpoint);
    tryLogin();
    
}

export default GlobalState;