<template>
  <div class="options">
      <div v-for="option in obj.options" v-bind:class="{ current: obj.currentValue == option.value, option:true }" v-bind:key="option.value" @click="obj.callback(option.value); close()">
            {{ option.display }}
            <div class="pad"></div>
            <Icon :src="option.icon" />
      </div>
  </div>
</template>

<script>
import Icon from '../Icon.vue'


export default {
    name:"SelectModal",
    props:["obj","close","currentValue"],
    methods:{
    },
    components:{
        Icon
    }
}
</script>

<style scoped>
    .options {
        margin-bottom: 10px;
    }
    .option {
        margin: 5px 10px;
        padding: 5px 10px;
        font-size: 20px;
        display: flex;
        border-radius: 5px;
    }
    .option.current {
        background-color: #1caa532c;
        box-shadow: 0 0 0 3px rgba(28, 170, 83, 0.699);
        color: #1CAA53;
    }
    .current /deep/ svg {
        stroke: #1CAA53;
    }
    .pad {
        flex-grow: 1;
    }
</style>