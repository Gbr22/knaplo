<template>
  <div>
      <div class="dates">
          <div>
              <span class="t">Feladva</span>
              <span class="d">{{ formatDate(obj.FeladasDatuma) }}</span>
          </div>
          <div>
              <span class="t">Határidő</span>
              <span class="d">{{ formatDate(obj.HataridoDatuma) }}</span>
          </div>
      </div>
      <hr>
      
      <HtmlRenderer :html="html" class="hwContent"/>
      <Author :author="obj.RogzitoTanarNeve" desc="Házi feladat" :date="new Date(obj.RogzitesIdopontja)" />
  </div>
</template>

<script>
import GlobalState from '../../globalState';
import { formatURLsHTML, formatDate } from '../../util';
import { openModal } from '../Modal';
import Author from '../Author';
import HtmlRenderer from '../HtmlRenderer.vue';


let HomeworkModal = {
    name:"HomeworkModal",
    props:["obj"],
    components:{
        Author,
        HtmlRenderer
    },
    data(){
        return {
            GlobalState,
            html:this.obj.Szoveg,
            homeworksCompleted:GlobalState.processedData.homeworksCompleted
        }
    },
    methods:{
        setHomeworkCompleted(hw,val){
            
            setHomeworkDone(hw.Id,val).then(v=>{
                hw.IsMegoldva = v;
            }).catch(()=>{});
        },
        isCompleted(hw){
            return hw.IsMegoldva;
            /* return getHWCompObjFArr(hw.Id, this.homeworksCompleted)?.value == true; */
        },
        formatDate,
    }
}
export default HomeworkModal;

export function openHomework(elem){

    let obj = elem;
    console.log("homework",elem);
    
    openModal(elem.Tantargy.Nev,HomeworkModal,obj);
}



</script>

<style scoped>
    .completedSwitch {
        text-align: center;
    }
    .completedSwitch p {
        margin: 3px 0;
    }
    .completedSwitch span {
        display: inline-block;
        margin: 0 auto;
        margin-bottom: 20px;
        margin-top: 5px;
        box-shadow: var(--elem-shadow);
        background-color: var(--divider-color);
        border-radius: 5px;
        overflow: hidden;
    }
    .completedSwitch button {
        border: none;
        padding: 5px 10px;
        outline: none;
        background-color: transparent;
        color: var(--text-light-color);
        
    }
    .completedSwitch .true {
        
    }
    .completedSwitch[data-value="true"] .true{
        background-color: #4ec275b7;
        opacity: 1;
        color: black;
    }
    .completedSwitch[data-value="false"] .false{
        background-color: #f54266b9;
        opacity: 1;
        color: black;
    }
    .completedSwitch .false {
        
    }
    hr  {
        margin: 0 auto;
        box-sizing: border-box;
        display: block;
        height: 0;
        border: none;
        width: calc(100% - 40px);
        border-bottom: 1px solid var(--divider-color);
        background: none;
    }
    .theme {
        padding: 20px;
        box-sizing: border-box;
        text-align: center;
    }
    .dates {
        width: 100%;        
        display: flex;
        padding: 20px;
        padding-top: 0;
        box-sizing: border-box;
    }
    .dates div {
        flex: none;
        flex-grow: 1;
        display: flex;
        flex-direction: column;
    }
    .dates span {
        display: block;
        margin: 0 auto;
    }
    .dates .t {
        font-weight: bold;
        font-size: 20px;
    }
    .hwContent {
        padding: 20px;
        box-sizing: border-box;
    }
</style>