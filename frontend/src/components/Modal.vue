<template>
    <div class="wrap" v-show="open">
        <transition name="fade">
            <div class="modal" v-if="open">
                <div class="inner">
                    <div class="header">
                        <h1>{{ title }}</h1>
                        <div class="pad"></div>
                        <svg class="feather close" v-on:click="closeModal()">
                            <use xlink:href="fi#x"/>
                        </svg>
                    </div>
                    <div v-html="content" class="content">

                    </div>
                </div>
            </div>
        </transition>
    </div>
    
</template>

<script>

let data = {
    open:false,
    title:"Title",
    content:"Hello"
};

export function openModal(title,content){
    data.open = true;
    data.title = title;
    data.content = content;
}
export function closeModal(){
    data.open = false;
}

window.openModal = openModal;
window.closeModal = closeModal;

export default {
    name:"Modal",
    data:()=>{return data},
    methods:{
        closeModal
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
        backdrop-filter: blur(10px);
    }
    .modal {
        background-color: var(--modal-color);
        box-shadow: var(--modal-shadow);
        
        border-radius: 15px;
        overflow-x: hidden;
        max-width: 100%;
        max-height: 100%;
        position: relative;
    }
    .inner {
        /* overflow-x: hidden; */
        position: relative;
        height: 100%;
        width: 100%;
        padding: 20px;
        box-sizing: border-box;
    }
    .content {
        overflow-y: visible;
        overflow-x: hidden;
        width: 100%;
        word-wrap: break-word;
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
        
    }
    .pad {
        width: 60px;
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