import { getInst } from "./dataHandler";

import Cookies from 'js-cookie';

import { afterLogin } from './dataHandler';

let GlobalState = {
    inst:getInst(),
    loggedIn:false,
    data:null,
    
    processedData:{
        subjects:[],
        grades:[],
        notes:[],
        absences:[]
    },
    
    user:null,
    currentMenu:"timeline"
};

window.Cookies = Cookies;

GlobalState.loggedIn = Cookies.get("loginInfo") != null;

if (GlobalState.loggedIn){
    GlobalState.user = JSON.parse(Cookies.get("loginInfo"));
    afterLogin();
}


export default GlobalState;