<template>
    <div id="syncing" :class="{show:GlobalState.syncCount != 0}">
        <div class="sync_inner">
            <div class="loader"></div>
            <div class="name">{{ getSyncName() }}</div>
            <div class="text">szinkronizálása</div>
            <div class="space"></div>
            <div class="status">{{ getSyncStatus() }}</div>
            <div class="dismiss" @click="dismissSync()">
                <Icon src="fi/x" size="18" />
            </div>
            
        </div>
    </div>
</template>

<script>
import GlobalState, { dismissSync } from '../globalState';

export default {
    name:"SyncStatus",
    methods:{
        dismissSync,
        getSyncName(){
            let name = ({
                "grades":"Jegyek",
                "notes":"Feljegyzések",
                "absences":"Mulasztások",
                "homeworks":"Házifeladatok",
                "tests":"Számonkérések",
                "events":"Események",
                "studentInfo":"Tanuló adatok",
            }[GlobalState.syncing[0]?.id] || GlobalState.syncing[0]?.id);
            if (name){
                this.syncName = name;
            }
            return name || this.syncName;
        },
        getSyncStatus(){
            let all = GlobalState.syncCount;
            let done = all - GlobalState.syncing.length;
            if (!all && !done){
                return this.status;    
            } else {
                this.status = `${done}/${all}`;
                return this.status;
            }
            
        }
    },
    data() {
        return {
            status:null,
            syncName:null,
            GlobalState,
        }
    },
}
</script>

<style scoped>
.loader,
.loader:after {
  border-radius: 50%;
  width: 18px;
  height: 18px;
  flex: 0 0 18px;
}
.loader {
    margin-left: 20px;
    margin-right: 10px;
    font-size: 10px;
    position: relative;
    text-indent: -9999em;
    border: 2px solid transparent;
    border-left-color: var(--theme-color);
    -webkit-transform: translateZ(0);
    -ms-transform: translateZ(0);
    transform: translateZ(0);
    -webkit-animation: load8 1.1s infinite linear;
    animation: load8 1.1s infinite linear;
}
@-webkit-keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}
@keyframes load8 {
  0% {
    -webkit-transform: rotate(0deg);
    transform: rotate(0deg);
  }
  100% {
    -webkit-transform: rotate(360deg);
    transform: rotate(360deg);
  }
}

#syncing {
    position: fixed;
    --top: 10px;
    top: var(--top);
    width: 100%;

    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 8900;
    transform: translateY(calc(calc(-1 * var(--top) - 70px)));
    opacity: 0;
    transition: transform 0.3s ease-out, opacity 0.4s ease-out;
}
#syncing.show {
    opacity: 1;
    transform: translateY(0px);
}
#syncing .name {
    margin-right: 5px;
    font-weight: bold;
    text-overflow: ellipsis;
    flex-shrink: 1;
    max-width: calc(50%);
    overflow: hidden;
    white-space: nowrap;
}
.sync_inner {
    display: flex;
    
    align-items: center;
    max-width: min(500px, 100%);
    padding: 10px 0;
    box-sizing: border-box;
    background-color: var(--modal-glass-color);
    backdrop-filter: blur(8px);
    box-shadow: var(--modal-shadow);
    border-radius: 50px;
    overflow-x: hidden;
    margin: 0 8px;
}
.dismiss {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 20px;
    width: 20px;
    
    margin-right: 15px;
    margin-left: 10px;
    transition: opacity 0.3s ease;
}
.dismiss:hover {
    opacity: 0.5;
}

.space {
    flex-grow: 1;
    min-width: 20px;
}
</style>