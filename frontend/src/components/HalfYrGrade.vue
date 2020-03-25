<template>
    <span>
        <div v-if="obj != null" :data-grade="obj.value">
            <a class="grade">{{ obj.value }}</a><a v-if="obj.theme=='Dicséret'" class="D">D</a>
        </div>
        <div v-if="obj == null" data-grade="#">
            <a class="grade">#</a>
        </div>
    </span>
</template>



<script>

export default {
    name:"HalfYrGrade",
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