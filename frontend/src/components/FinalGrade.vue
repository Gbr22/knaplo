<template>
    <span>
        <div v-if="obj != null" :data-grade="obj.value">
            <Icon class="grade" :src="obj.icon" size="28" /><a v-if="obj.theme=='Dicséret' && obj.value" class="D">D</a>
        </div>
        <div v-if="obj == null" data-grade="#">
            <a class="grade">#</a>
        </div>
    </span>
</template>



<script>

export default {
    name:"FinalGrade",
    props: {
      obj: {
          type: Object,
          required: false,
      }
    },
    data(){
        return {};
    }
}
</script>

<style>
    
</style>