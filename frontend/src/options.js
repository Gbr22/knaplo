import storage from './storage';

class Options {
    options = {
        "homeworks.separateTomorrow":{
            text:"Holnapi nap külön választása",
            icon:"edit-3",
            default:false,
        }
    }
    reactive = {};
    getAllOptions(){
        let options = storage.getJSON("options") || {};
        for (let p in this.options){
            if (options[p] != undefined && options[p] != null && options[p].consturctor == this.options[p].default.consturctor){
                this.reactive[p] = options[p];
            } else {
                this.reactive[p] = this.options[p].default;
            }
        }

        return this.reactive;
    };
    set(key,value){
        this.reactive[key] = value;
        storage.setJSON("options",this.reactive);
    }
}
let o = new Options;
export default o;
window.options = o;