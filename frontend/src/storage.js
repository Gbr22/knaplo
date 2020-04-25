import { tryJSON, tryJSONStringify } from "./util";

class Storage {
    getItem(i){
        return localStorage.getItem(i);
    }
    setItem(i,v){
        localStorage.setItem(i,v);
    }
    getJSON(i){
        return tryJSON(this.getItem(i));
    }
    setJSON(i,json){
        this.setItem(i,tryJSONStringify(json));
    }
    constructor(){

    }
}
let s = new Storage();
export default s;
window.storage = s;