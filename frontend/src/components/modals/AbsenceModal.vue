<template>
  <div>
      <h3>{{ obj.header }}</h3>
      <TimelineItem v-for="item in absences" :item="item" v-bind:key="item.key" />
  </div>
</template>

<script>
import TimelineItem from '../TimelineItem';

export default {
    name:"AbsenceModal",
    props:["obj"],
    data(){
        let absences = JSON.parse(JSON.stringify(this.obj.absences)).map((e)=>{
            e.header = e.desc;
            e.desc = "";
            return e;
        })
        return {
            absences
        }
    },
    components:{
        TimelineItem
    }
}
</script>

<style scoped>
    h3 {
        text-align: center;
        margin-bottom: 8px;
        padding: 0 20px;
    }
</style>