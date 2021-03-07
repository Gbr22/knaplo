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
        <HtmlRenderer :html="html" class="htmlContent"/>
        <div class="attachments">
            <div class="attachment" v-for="a in obj.message.attachments" :key="a.id">
                <div class="perview">
                    <img :src="createURL(attachmentPerview[a.id])" v-if="attachmentPerview[a.id] != null"/>
                </div>
                <div class="details">
                    <div class="filename">{{ a.filename }}</div>
                    <div class="download" @click="download(a)">
                        <Icon src="fi/download" />
                    </div>
                </div>
            </div>
        </div>
        <Author :author="obj.message.senderName" :desc="obj.message.senderTitle" :date="obj.message.date" />
  </div>
</template>

<script>
import { formatURLsHTML, formatDate, getDayOfWeek, saveBlob } from '../../util';
import { openModal } from '../Modal';
import Icon from '../Icon';
import Author from '../Author';
import { downloadAttachment, getMessage } from '../../api';
import HtmlRenderer from '../HtmlRenderer.vue';
import { DetailedMessage } from '../../data/DetailedMessage';


let MessageModal = {
    name:"MessageModal",
    props:["obj"],
    data(){
        let html = this.obj.message.content;

        let attachmentPerview = {};
        this.obj.message.attachments.forEach(a=>{
            attachmentPerview[a.id] = null;
        })
        return {
            html,
            recipientsOpen:false,
            attachmentPerview,
        }
    },
    methods:{
        createURL(blob){
            return window.URL.createObjectURL(blob);
        },
        formatDate,
        getDayOfWeek,
        toggleRecipients(){
            this.recipientsOpen = !this.recipientsOpen;
        },
        download(a){
            function save(b){
                saveBlob(b,a.filename);
            }
            if (this.attachmentPerview[a.id]){
                save(this.attachmentPerview[a.id]);
            } else {
                downloadAttachment(a.id).then(b=>{
                    save(b);
                })
            }
            
        }
    },
    mounted() {
        let map = this.attachmentPerview;
        this.obj.message.attachments.forEach(a=>{
            let ext = a.filename.split(".")[1];
            let isImage = ["jpg","jpeg","png","webp","svg"].includes(ext);
            if (isImage){
                downloadAttachment(a.id).then(b=>{
                    map[a.id] = b;
                })
            }
        })
    },
    components:{
        Author,
        Icon,
        HtmlRenderer,
    }
}
export default MessageModal;


export function openMessage(m){
    getMessage(m.id).then(msg=>{
        msg = new DetailedMessage(msg);
        console.log(msg);
        openDetailedMessage(msg);
    });
}
export function openDetailedMessage(elem){
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
    
    .attachments {
        display: flex;
        justify-content: center;
        align-items: center;
    }
    .attachment {
        max-width: 300px;
        
        border-radius: 12px;
        background-color: var(--element-color);
        box-shadow: var(--elem-shadow);
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
        padding: 10px 20px;
    }
    .attachment .perview {
        width: 100%;
        min-width: 300px;
        height: 150px;
        border-radius: 12px;
        overflow: hidden;
    }
    .attachment img {
        width: 100%;
        height: 100%;
        object-fit: cover;
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