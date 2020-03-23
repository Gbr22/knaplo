import { getInst } from "./dataHandler";

import Cookies from 'js-cookie';

let GlobalState = {
    inst:getInst(),
    loggedIn:false,
};
GlobalState.loggedIn = Cookies.get("loginInfo") != null;



export default GlobalState;