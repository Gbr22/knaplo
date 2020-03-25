import { getInst } from "./dataHandler";

import Cookies from 'js-cookie';

import { afterLogin } from './dataHandler';

let GlobalState = {
    inst:getInst(),
    loggedIn:false,
    data:null,
    user:null,
    currentMenu:"settings"
};

window.Cookies = Cookies;

GlobalState.loggedIn = Cookies.get("loginInfo") != null;

if (GlobalState.loggedIn){
    GlobalState.user = JSON.parse(Cookies.get("loginInfo"));
    afterLogin();
}


export default GlobalState;