<template>
  <div>
      <h3>{{ (new Date(obj.date)).toLocaleDateString() }}</h3>
      <TimelineItem v-for="item in obj.absences" :item="item" v-bind:key="item.key" />
  </div>
</template>

<script>
import TimelineItem from './TimelineItem';

export default {
    name:"AbsenceModal",
    props:["obj"],
    components:{
        TimelineItem
    }
}
</script>

<style scoped>
    h3 {
        text-align: center;
        margin-bottom: 8px;
    }
</style>