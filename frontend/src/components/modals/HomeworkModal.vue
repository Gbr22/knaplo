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
      
  </div>
</template>

<script>
import GlobalState from '../../globalState';
import { formatURLsHTML, formatDate } from '../../util';
import { openModal } from '../Modal';



let HomeworkModal = {
    name:"HomeworkModal",
    props:["obj"],
    data(){
        let html = this.obj.homework.Szoveg;
        html = formatURLsHTML(html);


        return {
            GlobalState,
            html,
        }
    },
    methods:{
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