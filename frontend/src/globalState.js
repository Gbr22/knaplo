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
    
    user:null,
    currentMenu:localStorage.getItem("currentMenu") || "timeline"
};

window.Cookies = Cookies;

function loginWithCookie(c){
    GlobalState.user = JSON.parse(c);
    afterLogin();
}

if (cordova){
    document.addEventListener("deviceready", function(){
        let info = getCookieFromString("loginInfo",cordova.plugin.http.getCookieString("https://naplo.gbr22.me"));
        if (info){
            GlobalState.loggedIn = true;
            loginWithCookie(info);
        }
        GlobalState.loaded = true;
    }, false);
} else {
    GlobalState.loggedIn = Cookies.get("loginInfo") != null;

    if (GlobalState.loggedIn){
        loginWithCookie(Cookies.get("loginInfo"));
    }
    GlobalState.loaded = true;
}



export default GlobalState;