import { tryJSON, tryJSONStringify } from "./util";

class Storage {
    getItem(i){
        return localStorage.getItem(i);
    }
    setItem(i,v){
        let tries = 0;
        while(tries < 15){
            try {
                localStorage.setItem(i,v);
                return;
            } catch(err){
                let largest = Object.entries(localStorage).sort(([_, v1],[__,v2])=>v2.length-v1.length)[0];
                console.log("stoage full err",err,"largest",largest,"setting",i);
                this.removeItem(largest[0]);
            }
            tries++;
        }
        
        
    }
    removeItem(i){
        localStorage.removeItem(i);
    }
    getJSON(i){
        return tryJSON(this.getItem(i));
    }
    setJSON(i,json){
        this.setItem(i,tryJSONStringify(json));
    }
    has(i){
        for (let key of Object.keys(localStorage)){
            if (key == i){
                return true;
            }
        }
        return false;
    }
    constructor(){

    }
    clear(){
        localStorage.clear();
    }
    migrate(){
        var compatibilityVersion = "1";
        if (this.getItem("storageVersion") != compatibilityVersion){
            this.clear();
            this.setItem("storageVersion",compatibilityVersion);
        }
    }
}
let s = new Storage();
s.migrate();
export default s;
window.storage = s;