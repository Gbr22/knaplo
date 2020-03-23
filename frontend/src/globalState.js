import { getInst } from "./dataHandler";

import Cookies from 'js-cookie';

import { afterLogin } from './dataHandler';

let GlobalState = {
    inst:getInst(),
    loggedIn:false,
    data:null
};
GlobalState.loggedIn = Cookies.get("loginInfo") != null;

if (GlobalState.loggedIn){
    afterLogin();
}


export default GlobalState;