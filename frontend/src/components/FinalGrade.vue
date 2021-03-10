<template>
    <span @click="obj ? openGrade(obj) : null">
        <div v-if="obj != null">
            <Icon class="grade" :src="info.icon" size="28" :color="getGradeColor(obj)" /><a v-if="obj.theme=='Dicséret' && obj.numberValue" class="D" :style="{color: getGradeColor(obj)}">D</a>
        </div>
        <div v-if="obj == null">
            <a class="grade" :style="{color: getGradeColor(null)}">#</a>
        </div>
    </span>
</template>



<script>
import { getTimelineProps } from '../data/util';
import { getGradeColor } from '../dataHandler';
import { openGrade } from './modals/GradeModal.vue';


export default {
    name:"FinalGrade",
    props: {
      obj: {
          type: Object,
          required: false,
      }
    },
    methods: {
        openGrade,
        getGradeColor,
    },
    data(){
        return {
            info: getTimelineProps(this.obj),
        };
    }
}
</script>