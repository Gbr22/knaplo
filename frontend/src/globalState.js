import { getInst } from "./dataHandler";

import Cookies from 'js-cookie';

import { afterLogin } from './dataHandler';

let GlobalState = {
    inst:getInst(),
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
        homeworks:[]
    },
    
    user:null,
    currentMenu:localStorage.getItem("currentMenu") || "timeline"
};

window.Cookies = Cookies;

GlobalState.loggedIn = Cookies.get("loginInfo") != null;

if (GlobalState.loggedIn){
    GlobalState.user = JSON.parse(Cookies.get("loginInfo"));
    afterLogin();
}


export default GlobalState;