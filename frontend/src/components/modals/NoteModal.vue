<template>
  <div>
      <div class="noteContent" v-html="html"></div>
      <div class="user">
          <Icon src="fi/user" class="icon" />
          <div class="content">
              <div class="name">{{ obj.teacher }}</div>
              <div class="desc">{{ obj.noteType }}</div>
          </div>
          <div class="date tinyDate"><b>{{ getDayOfWeek(new Date(obj.date)) }}</b><br><i>{{ formatDate(new Date(obj.date)) }}</i></div>
      </div>
      
  </div>
</template>

<script>
import GlobalState from '../../globalState';
import { formatURLsHTML, formatDate, getDayOfWeek } from '../../util';
import { openModal } from '../Modal';
import Icon from '../Icon.vue';


let NoteModal = {
    name:"NoteModal",
    props:["obj"],
    data(){
        let html = this.obj.content;
        html = formatURLsHTML(html);


        return {
            GlobalState,
            html,
        }
    },
    methods:{
        formatDate,
        getDayOfWeek,
    },
    components:{
        Icon
    }
}
export default NoteModal;


export function openNote(elem){

    let obj = elem;
    console.log("note",elem);
    openModal(elem.title,NoteModal,obj);
}
window.openNote = openNote;


</script>

<style scoped>
    .noteContent {
        padding: 20px;
        box-sizing: border-box;
    }
    .noteContent :first-child {
        padding-top: 0 !important;
        margin-top: 0 !important;
    }
    .user {
        margin: 20px;
        margin-top: 0;
        display: flex;
        flex-direction: row;
        align-items: center;
        justify-content: flex-start;
    }
    .user .content {
        flex: 1;
    }
    .desc {
        color: var(--text-smol);
        font-style: italic;
    }
    /deep/ .user .icon {
        background-color: var(--element2-color);
        padding: 8px;
        border-radius: 50%;
        margin-right: 8px;
    }
    .date {
        text-align: right;
    }
</style>