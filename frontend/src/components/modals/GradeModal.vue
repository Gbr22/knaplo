<template>
  <div class="root">
    <div class="cont">
        <div class="header">
            <!-- <Icon :src="obj.icon" :size="40" /> -->
            <p class="value">{{ obj.textValue }}</p>
            <p class="weight">{{ obj.weight ? obj.weight+"%" : "" }}</p>
        </div>
        <div class="details">
            <div v-for="i in getList()" :key="i ? i[0] : null" class="li">
                <span  v-if="i"><span class="title">{{ i[0] }}:</span> {{ i[1] || "N/A"}}</span>
                <span class="space" v-if="!i"></span>
            </div>
        </div>
        
      </div>
      
      <Author :date="new Date(obj.createDate)" :author="obj.teacher" desc="Értékelés" />    
  </div>
</template>

<script>
import GlobalState from '../../globalState';
import { formatURLsHTML, formatDate, getDayOfWeek, formatTime } from '../../util';
import { openModal } from '../Modal';
import Icon from '../Icon';
import Author from '../Author';



let GradeModal = {
    name:"GradeModal",
    props:["obj"],
    data(){
        return {

        }
    },
    methods:{
        formatDate,
        getDayOfWeek,
        getList(){
            var list = [
                ["Tantárgy",this.obj.subject],
                ["Típus",this.obj.mode],
                ["Téma",this.obj.theme],
                null,
                ["Értékelés formája",this.obj.formName],
                null,
                ["Írás ideje",formatDate(this.obj.date)],
                ["Rögzítés ideje",formatDate(this.obj.createDate)+" "+formatTime(this.obj.createDate)],
                
            ];
            return list;
        }
    },
    components:{
        Icon,
        Author
    }
}
export default GradeModal;


export function openGrade(elem){

    let obj = elem;
    openModal("Értékelés",GradeModal,obj);
}


</script>

<style scoped>
    .root {
        margin-top: 0;
    }
    .cont {
        padding: 20px 0px;
    }
    .details {
        padding: 0 20px;
        padding-top: 10px;
    }
    .details .title {
        font-weight: bold;
    }
    p {
        margin: 0;
    }
    .space {
        display: block;
        background-color: var(--divider-color);
        height: 1px;
        margin: 8px 0;
    }
    .li {
        margin: 1px 0;
    }
    .header {
        text-align: center;
    }
    .value {
        font-size: 25px;
    }
    .weight {
        color: var(--text-smol)
    }
</style>