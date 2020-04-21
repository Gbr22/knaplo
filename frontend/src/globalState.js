import { getInst } from "./dataHandler";

import Cookies from 'js-cookie';

import { afterLogin, getHomeworksCompletedMap } from './dataHandler';
import { getCookieFromString } from "./util";


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
    
    GlobalState.user = JSON.parse(c);
    afterLogin();
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
            let info = getCookieFromString("loginInfo",cordova.plugin.http.getCookieString(ApiEndpoint));
            if (info){
                GlobalState.loggedIn = true;
                loginWithCookie(info);
            }
        }, function(err) {
            console.error(err);
        });
        
        GlobalState.loaded = true;
    }, false);
} else {
    console.log("endpoint",ApiEndpoint);
    GlobalState.loggedIn = Cookies.get("loginInfo") != null;

    if (GlobalState.loggedIn){
        loginWithCookie(Cookies.get("loginInfo"));
    }
    GlobalState.loaded = true;
}

export default GlobalState;