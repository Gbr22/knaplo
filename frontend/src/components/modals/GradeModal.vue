<template>
  <div class="root">
    <div class="cont">
        <div class="header">
            <!-- <Icon :src="obj.icon" :size="40" /> -->
            <p class="value" :style="{color: getGradeColor(obj)}">{{ obj.textValue }}</p>
            <p class="weight">{{ obj.weight != null ? obj.weight+"%" : "0%*" }}</p>
        </div>
        <DetailsList :list="getList()" />
        
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
import { getGradeColor } from '../../dataHandler';
import DetailsList from '../DetailsList.vue';



let GradeModal = {
    name:"GradeModal",
    props:["obj"],
    data(){
        return {

        }
    },
    methods:{
        getGradeColor,
        formatDate,
        getDayOfWeek,
        getList(){
            var list = [
                ["Tantárgy",this.obj.subject],
                ["Mód",this.obj.mode],
                ["Téma",this.obj.theme],
                ["Típus",this.obj.gradeTypeName],
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
        Author,
        DetailsList,
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
    .header {
        text-align: center;
        padding-bottom: 10px;
    }
    .value {
        font-size: 25px;
        font-weight: bold;
    }
    .weight {
        color: var(--text-light-color)
    }
    p {
        margin: 0;
    }
</style>