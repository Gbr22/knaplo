import { getInst, homeworksCompleted } from "./dataHandler";

import Cookies from 'js-cookie';

import { afterLogin } from './dataHandler';
import { getCookieFromString } from "./util";
import storage from './storage';
import { httpRequest } from "./http";
import Vue from 'vue';
import options from './options';
import { setHomeworkDone } from "./api";


export function pushSync(obj){
    let {id,promise} = obj;


    let done = ()=>{
        let arr = GlobalState.syncing;
        let i =  arr.indexOf(obj);
        if (i != -1){
            arr.splice(i,1);
        }
        if (GlobalState.syncing.length == 0){
            setTimeout(()=>{
                GlobalState.syncCount = 0;
            },1000);
        }
    }
    promise.then(r=>{
        done();
    }).catch(err=>{
        done();
    })
    GlobalState.syncCount++;
    GlobalState.syncing.push(obj);
}
export function dismissSync(){
    GlobalState.syncCount = 0;
    GlobalState.syncing.splice(0,GlobalState.syncing.length);
}
let GlobalState = {
    window:{
        width:window.innerWidth
    },
    syncCount:0,
    syncing:[],
    theme:null,
    gradeColors:{

    },
    loaded:false,
    loggedIn:false,
    data:null,
    studentInfo:null,
    modalStack:[],
    rawData:{
    },
    lessonsList:[],
    processedData:{
        subjects:[],
        grades:[],
        notes:[],
        tests:[],
        events:[],
        absences:[],
        messages_received:[],
        messages_sent:[],
        messages_removed:[],
        timetable:{
            weeks:[]
        },
        homeworks:[],
    },
    subjectRoundings:storage.getJSON("roundings") || {},
    options:options.getAllOptions(),
    cordovaIsDebug:false,
    user:null,
    dktLogin:{},
    currentMenu:localStorage.getItem("currentMenu") || "timeline"
};
window.onresize = ()=>{
    GlobalState.window.width = window.innerWidth;
}

window.Cookies = Cookies;

async function tryLogin(){
    let info = storage.getJSON("loginInfo");
    if (info){
        GlobalState.loggedIn = true;
        GlobalState.user = info;
        afterLogin();
    }
    GlobalState.loaded = true;
    if (window.cordova){
        hideSplash();
    }
}
function hideSplash(){
    Vue.nextTick(()=>{
        navigator.splashscreen.hide();
    })
}
if (window.cordova != undefined){
    document.addEventListener("deviceready", function(){
        cordova.plugins.IsDebug.getIsDebug(function(isDebug) {
            console.log('Is debug:', isDebug);
            GlobalState.cordovaIsDebug = isDebug;
            tryLogin();
        }, function(err) {
            console.error(err);
        });
    }, false);
} else {
    tryLogin();
}

export default GlobalState;