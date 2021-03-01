<template>
  <div class="modalroot">
        <div class="recipients">
            <span class="title">
                <b>{{ obj.message.recipientList.length > 1 ? "Címzettek" : "Címzett" }}</b>:
                <span class="name">{{ obj.message.recipientList[0].name }}</span>
                <template v-if="obj.message.recipientList.length > 1">
                    <span class="plus">
                        +{{ obj.message.recipientList.length-1 }}
                    </span>
                    <div v-on:click="toggleRecipients()" class="toggle" :class="{up:recipientsOpen}">
                        <Icon :src="'fi/chevron-down'" :size="18" color="var(--text-light-color)"/>
                    </div>    
                </template>
                
                
            </span>
            <div v-if="recipientsOpen" class="l">
                <div class="recipient" v-for="r in obj.message.recipientList" :key="r.id">
                    {{ r.name }}
                </div>
            </div>
        </div>
        <div class="htmlContent selectable" v-html="html"></div>
        <div class="attachments">
            <div class="attachment" v-for="a in obj.message.attachments" :key="a.id">
                <div class="details">
                    <div class="filename">{{ a.filename }}</div>
                    <div class="download">
                        <Icon src="fi/download" />
                    </div>
                </div>
            </div>
        </div>
        <Author :author="obj.message.senderName" :desc="obj.message.senderTitle" :date="obj.message.date" />
  </div>
</template>

<script>
import { formatURLsHTML, formatDate, getDayOfWeek } from '../../util';
import { openModal } from '../Modal';
import Icon from '../Icon';
import Author from '../Author';


let MessageModal = {
    name:"MessageModal",
    props:["obj"],
    data(){
        let html = this.obj.message.content;
        html = formatURLsHTML(html);


        return {
            html,
            recipientsOpen:false,
        }
    },
    methods:{
        formatDate,
        getDayOfWeek,
        toggleRecipients(){
            this.recipientsOpen = !this.recipientsOpen;
        }
    },
    components:{
        Author,
        Icon,
    }
}
export default MessageModal;


export function openMessage(elem){
    openModal(elem.message.subject,MessageModal,elem);
}


</script>

<style scoped>
    .modalroot {
        margin-top: 0;
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
        vertical-align: middle;
        width: 15px;
        height: 1px;
        border: none;
        margin: 0;
    }
    .htmlContent {
        padding: 20px;
        padding-top: 15px;
        
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
    .attachment {
        border-radius: 12px;
        background-color: var(--element-color);
        box-shadow: var(--elem-shadow);
        padding: 10px 20px;
        margin: 0 20px;
        margin-bottom: 8px;
    }
    .attachment:last-child {
        margin-bottom: 20px;
    }
    .filename {
        flex: 1;
    }
    .attachment .details {
        display: flex;
        justify-content: center;
        align-items: center;

    }
    .recipients .title {
        margin-bottom: 5px;
        display: flex;
        align-items: center;

    }
    .recipients .name {
        margin: 0 5px;
    }
    .recipients {
        padding: 0 20px;
        padding-top: 20px;
    }
    .recipients .l {
        margin-top: 15px;
    }
    .recipient {
        border-radius: 18px;
        background-color: var(--element-color);
        display: inline-block;
        padding: 8px 12px;
        font-size: 15px;
        margin-right: 5px;
        margin-bottom: 5px;
        box-shadow: 0 0 3px 0px rgba(0,0,0,0.17);
        transition: filter 0.3s ease;
    }
    .recipient:hover {
        filter: brightness(0.9);
    }
    .recipients .toggle {
        display: flex;
        align-items: center;
        justify-content: center;
        transition: transform 0.3s ease;
        transform: rotate(0);
    }
    .recipients .toggle.up {
        transform: rotate(-180deg);
    }
</style>