<template>
  <div class="modalroot">
        <div class="htmlContent selectable" v-html="html"></div>
        <div class="dates">
            {{ formatDate(obj.startDate) }}
            <span class="divider"></span>
            {{ formatDate(obj.endDate) }}
        </div>
  </div>
</template>

<script>
import { formatURLsHTML, formatDate, getDayOfWeek } from '../../util';
import { openModal } from '../Modal';
import Icon from '../Icon';
import Author from '../Author';


let EventModal = {
    name:"EventModal",
    props:["obj"],
    data(){
        let html = this.obj.content;
        html = formatURLsHTML(html);


        return {
            html,
        }
    },
    methods:{
        formatDate,
        getDayOfWeek,
    },
    components:{
        
    }
}
export default EventModal;


export function openEvent(elem){
    openModal(elem.title,EventModal,elem);
}


</script>

<style scoped>
    .modalroot {
        margin-top: 0;
        padding: 20px;
        box-sizing: border-box;
    }
    .dates {
        margin-top: 15px;
        text-align: right;
        color: var(--text-light-color);
    }
    .divider {
        background-color: var(--text-light-color);
        display: inline-block;
        width: 15px;
        height: 1px;
        border: none;
        margin: 0;
    }
    .htmlContent {
        
        
        box-sizing: border-box;
    }
    .htmlContent :first-child {
        padding-top: 0 !important;
        margin-top: 0 !important;
    }
    .htmlContent :last-child {
        padding-bottom: 0 !important;
        margin-bottom: 0 !important;
    }
</style>