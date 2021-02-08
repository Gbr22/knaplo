<template>
    <div id="msg" v-if="MessageInfo.current != null" :class="MessageInfo.current.type">
        <span class="inner">
            {{ MessageInfo.current.text }}
        </span>
    </div>
</template>

<script>

export let Messages = [];



export let MessageInfo = {
    current: null
}

function checkQueue(){
    MessageInfo.current = null;
    
    if (Messages.length > 0){
        let obj = Messages.shift();
        pushMessage(obj.text,obj.type);
    }
}

export function pushMessage(text,type){
    let obj = {text,type};
    if (MessageInfo.current == null){
        MessageInfo.current = obj;
        setTimeout(()=>{
            checkQueue();
        }, 2300)
    } else {
        Messages.push(obj);
    }
}
export let pushError = (text)=>pushMessage(text,"error");

window.pushMessage = pushMessage;
window.pushError = pushError;


export default {
    name:"MessageDisplay",
    components: {
        
    },
    data:()=>{
       return {
            Messages,
            MessageInfo
       }
    },

}
</script>


<style scoped>
    #msg {
        position: fixed;
        bottom:70px;
        width:100%;
        text-align: center;
        animation-name: up;
        animation-duration: 0.3s;
        z-index: 9999;
    }
    .error .inner {
        background-color: rgba(216, 0, 0, 0.322);
        box-shadow: none;
        
    }
    .inner {
        display: inline-block;
        background-color: rgba(220, 220, 220, 0.164);
        padding: 10px 15px;
        border-radius: 15px;
        backdrop-filter: blur(8px);
        box-shadow: 0 0 0 1px #00000025;
        margin: 0 40px;
    }
    @keyframes up {
        from {
            transform: translateY(50%);
            opacity: 0;
            backdrop-filter: blur(0px);
        }
        to {
            transform: translateY(0);
            opacity: 1;
            backdrop-filter: blur(8px);
        }
    }
</style>