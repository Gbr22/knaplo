import { tryJSON, tryJSONStringify } from "./util";

class Storage {
    getItem(i){
        return localStorage.getItem(i);
    }
    setItem(i,v){
        localStorage.setItem(i,v);
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
    migrate(){
        let keys = Object.keys(localStorage);
        for (let key of keys){
            if (key.indexOf("data_") == 0 && key.indexOf("data_homework/") == 0){
                this.setJSON(
                    key.replace("data_","data/"),
                    this.getJSON(key).data
                )
                this.removeItem(key);
            }
        }
    }
}
let s = new Storage();
s.migrate();
export default s;
window.storage = s;