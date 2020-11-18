<template>
    <div class="wrap" v-show="currentModal().open" @click.self="closeModal()" :data-mode="currentModal().settings.mode">
        <transition name="fade">
            <div class="modal" v-if="currentModal().open">
                <div class="inner">
                    <div class="header">
                        <h1>{{ currentModal().title }}</h1>
                        <div class="pad"></div>
                        <Icon class="feather back actionBtn" src="fi/arrow-left" @click.native="back()" v-if="modalStack.length > 1"/>
                        <Icon class="feather close actionBtn" src="fi/x" @click.native="closeModal()"/>
                    </div>
                    <component v-bind:is="currentModal().contentComponent" :obj="currentModal().obj" :close="closeModal" class="content"></component>
                </div>
            </div>
        </transition>
    </div>
    
</template>

<script>

import ModalContent from './ModalContent';
import Icon from './Icon.vue';
import GlobalState from '../globalState';



export function isModalOpen(){
    return GlobalState.modalStack.length > 0;
}

window.isModalOpen = isModalOpen;

export function openModal(title,content,obj,settings = {}){
    let component;
    if (typeof content == "string"){
        component = ModalContent;
        obj = {html:content};
    } else {
        component = content;
    }
    GlobalState.modalStack.push({
        title,
        obj,
        contentComponent:component,
        settings,
    });
}
export function closeModal(){
    var r = GlobalState.modalStack.length > 0;
    GlobalState.modalStack.splice(0,GlobalState.modalStack.length);
    return r;
}
export function back(){
    var r = GlobalState.modalStack.length > 0;
    if (GlobalState.modalStack.length > 0){
        GlobalState.modalStack.splice(GlobalState.modalStack.length-1,GlobalState.modalStack.length);
    }
    return r;
}

window.openModal = openModal;
window.closeModal = closeModal;

export default {
    name:"Modal",
    data:()=>{return {
        modalStack:GlobalState.modalStack,
    }},
    methods:{
        closeModal,
        back,
        currentModal(){
            return Object.assign(
                {
                    open:true,
                    title:"Title",
                    obj:{},
                    contentComponent:null,
                    settings:{}
                },
                this.modalStack[this.modalStack.length-1] || {open:false}
            );
        }
    },
    components:{
        Icon
    }
}
</script>

<style scoped>
    .wrap {
        position: absolute;
        top: 0;
        height: 100%;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        box-sizing: border-box;
        padding: 15px;
        /* background-color: rgba(0, 0, 0, 0.3); */
    }
    .modal {
        background-color: var(--modal-color);
        box-shadow: var(--modal-shadow);
        
        border-radius: 15px;
        overflow-x: hidden;
        max-width: min(100%, 550px);
        max-height: min(100%, 550px);
        position: relative;
        transition: height 0.5s;
    }
    [data-mode="wide"] .modal{
        min-width: min(370px, 100%);
    }

    .inner {
        /* overflow-x: hidden; */
        position: relative;
        height: 100%;
        width: 100%;
        box-sizing: border-box;
    }
    .content {
        overflow-y: visible;
        overflow-x: hidden;
        width: 100%;
        word-wrap: break-word;
        margin-top: 20px;
    }
    .fade-enter-active, .fade-leave-active {
        transition: all .2s;
    }
    .fade-enter, .fade-leave-to {
        opacity: 0;
        transform: translateY(10px);
    }

    .header {
        display: flex;
        padding: 20px;
        padding-bottom: 0;
        word-break: break-word;
    }
    .pad {
        width: 20px;
        height: 10px;
        flex-shrink: 1;
    }
    .actionBtn {
        flex-shrink: 0;
        padding: 5px;
        transition: opacity 0.3s;
    }
    .actionBtn:hover {
        opacity: 0.5;
    }
    .header h1 {
        flex: 1;

    }
    
</style>