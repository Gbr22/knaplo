<template>
  <div class="root">
        <div class="cont">
            <DetailsList :list="getList()" />
        </div>
      
        <Author :date="new Date(obj.createDate)" :author="obj.teacherName" desc="Értékelés" />    
  </div>
</template>

<script>
import { formatDate, getDayOfWeek, formatTime, getDayName } from '../../util';
import { openModal } from '../Modal';
import Icon from '../Icon';
import Author from '../Author';
import DetailsList from '../DetailsList.vue';


let TestModal = {
    name:"TestModal",
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
                ["Tantárgy",this.obj.subjectName],
                ["Mód",this.obj.mode.description],
                ["Téma",this.obj.theme],
                ["Időpont",`${formatDate(this.obj.date)}, ${getDayName(this.obj.date)} ${this.obj.lessonNumber}. óra`],
                ["Bejelentés ideje",formatDate(this.obj.createDate)+" "+formatTime(this.obj.createDate)],
                
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
export default TestModal;


export function openTest(elem){
    openModal("Számonkérés",TestModal,elem);
}


</script>

<style scoped>
    .root {
        margin-top: 0;
    }
    .cont {
        padding: 20px 0px;
    }
</style>