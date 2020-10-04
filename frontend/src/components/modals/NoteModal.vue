<template>
  <div>
      <div class="noteContent" v-html="html"></div>
      
      <Author :date="new Date(obj.createDate)" :author="obj.teacher" :desc="obj.noteType" />
      
  </div>
</template>

<script>
import GlobalState from '../../globalState';
import { formatURLsHTML, formatDate, getDayOfWeek } from '../../util';
import { openModal } from '../Modal';
import Icon from '../Icon';
import Author from '../Author';


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
        Icon,
        Author
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
</style>