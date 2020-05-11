<template>
  <div>
      <div class="dates">
          <div>
              <span class="t">Feladva</span>
              <span class="d">{{ formatDate(obj.homework.FeladasDatuma) }}</span>
          </div>
          <div>
              <span class="t">Határidő</span>
              <span class="d">{{ formatDate(obj.homework.Hatarido) }}</span>
          </div>
      </div>
      <hr>
      <div v-if="obj.lesson.Theme">
          <h3 class="theme">{{ obj.lesson.Theme }}</h3>
          <hr>
      </div>
      <div class="hwContent" v-html="html"></div>
      <div class="completedSwitch" :data-value="isCompleted(obj.homework)+''">
          <p>Megoldott feladat?</p>
          <span>
                <button class="true" @click="setHomeworkCompleted(obj.homework,true)">Igen</button>
                <button class="false" @click="setHomeworkCompleted(obj.homework,false)">Nem</button>
          </span>
      </div>
  </div>
</template>

<script>
import GlobalState from '../../globalState';
import { formatURLsHTML, formatDate } from '../../util';
import { openModal } from '../Modal';
import { } from '../../dataHandler';
import { setHomeworkDone } from '../../api';


let HomeworkModal = {
    name:"HomeworkModal",
    props:["obj"],
    data(){
        let html = this.obj.homework.Szoveg;
        html = formatURLsHTML(html);


        return {
            GlobalState,
            html,
            homeworksCompleted:GlobalState.processedData.homeworksCompleted
        }
    },
    methods:{
        setHomeworkCompleted(hw,value){
            hw.IsMegoldva = value;
            setHomeworkDone(hw.Id,value);
        },
        isCompleted(hw){
            return hw.IsMegoldva;
        },
        formatDate,
    }
}
export default HomeworkModal;

export function openHomework(elem){

    let obj = elem;
    console.log(elem);
    openModal(elem.homework.Tantargy,HomeworkModal,obj);
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
        color: var(--text-smol);
        
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
    .hwContent :first-child {
        padding-top: 0 !important;
        margin-top: 0 !important;
    }
</style>