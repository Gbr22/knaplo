<template>
    <div class="wrap" v-show="open" @click.self="closeModal()" :data-mode="settings.mode">
        <transition name="fade">
            <div class="modal" v-if="open">
                <div class="inner">
                    <div class="header">
                        <h1>{{ title }}</h1>
                        <div class="pad"></div>
                        <Icon class="feather close" src="fi/x" @click.native="closeModal()"/>
                    </div>
                    <component v-bind:is="contentComponent" :obj="obj" :close="closeModal" class="content"></component>
                </div>
            </div>
        </transition>
    </div>
    
</template>

<script>

import ModalContent from './ModalContent';
import Icon from './Icon.vue';


let data = {
    open:false,
    title:"Title",
    obj:{},
    contentComponent:null,
    settings:{}
};
export function isModalOpen(){
    return data.open;
}
window.isModalOpen = isModalOpen;

export function openModal(title,content,obj,settings = {}){
    //(title, content)
    //or (title, component, obj, settings)

    let component;
    if (typeof content == "string"){
        component = ModalContent;
        data.obj = {html:content};
    } else {
        component = content;
        data.obj = obj;
    }
    
    data.open = true;
    data.title = title;
    data.contentComponent = component;
    data.settings = settings;
}
export function closeModal(){
    if (data.open == true){
        data.open = false;
        return true; //successfully closed    
    } else {
        return false; //nothing to close
    }
    
}

window.openModal = openModal;
window.closeModal = closeModal;

export default {
    name:"Modal",
    data:()=>{return data},
    methods:{
        closeModal
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
        max-width: min(100%, 500px);
        max-height: min(100%, 500px);
        position: relative;
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
    .close {
        flex-shrink: 0;
        padding: 5px;
        transition: opacity 0.3s;
    }
    .close:hover {
        opacity: 0.5;
    }
    .header h1 {
        flex: 1;

    }
    
</style>