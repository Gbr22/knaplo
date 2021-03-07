<template>
    <div id="messages">
        <div class="menu">
            <div
                v-for="m in menuOptions"
                :key="m.id" class="item"
                :class="{active:m.id == activeMenu}"
                @click="activeMenu = m.id"
            >
                {{ m.name }}
            </div>
        </div>
        <div class="messages">
            <div v-if="getMessages(activeMenu).length == 0" class="empty">
                Nincsenek üzeneteid
            </div>
            <div class="message" v-for="m in getMessages(activeMenu)" :key="m.messageId" @click="openMessage(m)">
                <ProfileCircle :name="getSenderName(m)" class="profile" />
                <div class="content">
                    <div class="subject">{{ m.subject }}</div>
                    <div class="author">{{ getSenderName(m) }}</div>
                </div>
                <div class="attachment" v-if="m.hasAttachment">
                    <Icon src="fi/paperclip" color="var(--link-color)" size="20" />
                </div>
                <div class="tinydate date">
                    <div>{{ getDayName(m.date) }}</div>
                    <div>{{ formatDate(m.date) }}</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import { getMessage } from '../api';
import ProfileCircle from '../components/ProfileCircle.vue';
import GlobalState from '../globalState';
import { DetailedMessage } from '../data/DetailedMessage';
import { formatDate, getDayName } from '../util';
import Icon from '../components/Icon.vue';
import { openMessage } from '../components/modals/MessageModal.vue';


export default {
    name: 'Messages',
    data:()=>{
        return {
            GlobalState,
            activeMenu:"received",
            menuOptions:[
                {
                    name:"Beérkező",
                    id:"received"
                },
                {
                    name:"Elküldőtt",
                    id:"sent"
                },
                {
                    name:"Törölt",
                    id:"removed"
                }
            ]
        }
    },
    components:{
        ProfileCircle,
        Icon,
    },
    methods:{
        formatDate,
        getDayName,
        openMessage,
        getMessages(type){
            return [...GlobalState.processedData["messages_"+type]].sort((a,b)=>{
                return b.date - a.date;
            });
        },
        getSenderName(m){
            return m.senderName || this.getUserName();
        },
        getUserName(){
            return GlobalState.studentInfo.Nev;
        },
    }
    
    
}
</script>

<style scoped>
    .menu {
        display: flex;
        justify-content: center;
        align-items: center;
        flex: 0;
    }
    .menu .item {
        flex: 1;
        display: flex;
        justify-content: center;
        align-items: center;
        
        border-top: 0 solid transparent;
        border-bottom: 0 solid transparent;
        border-width: 2px;
        padding: 12px 0;
        color: var(--text-light-color);
    }
    .menu .item.active {
        border-bottom-color: var(--theme-color);
        background-color: var(--element3-color);
        color: var(--text-color);
    }
    #messages {
        display: flex;
        flex-direction: column;
    }
    .messages {
        flex: 1;
    }
    .message {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 12px;
        transition: background-color 0.3s ease;
    }
    .message:hover {
        background-color: var(--element3-color);
    }
    .message .content {
        flex: 1;
    }
    .message .profile {
        width: 40px;
        height: 40px;
    }
    .message .author {
        color: var(--text-light-color);
    }
    .empty {
        display: flex;
        justify-content: center;
        align-items: center;
        width: 100%;
        height: 100%;
    }
    .attachment {
        margin-right: 10px;
    }
    .date {
        
        color: var(--text-light-color);
        text-align: right;
    }

</style>