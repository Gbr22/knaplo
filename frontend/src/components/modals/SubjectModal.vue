<template>
  <div>
      <h2>Jegyek</h2>
      <div>
          <TimelineItem v-for="item in grades" :item="item" v-bind:key="item.key" />
      </div>
  </div>
</template>

<script>
import TimelineItem from '../TimelineItem';

export default {
    name:"SubjectModal",
    props:["obj"],
    data(){
        let grades = JSON.parse(JSON.stringify(this.obj.grades));
        grades.forEach((e)=>{
            e.header = e.desc;
            e.desc = "";
            e.onclick = ()=>{};
        });
        
        return {
            grades,
        }
    },
    components:{
        TimelineItem
    }
}
</script>

<style scoped>
    h2 {
        text-align: center;
        padding: 10px 20px;
    }
</style>