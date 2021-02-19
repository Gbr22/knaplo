<template>
    <span v-html="getIcon(src, size, color)" class="icon" :style="{'--size': size+'px'}">

    </span>
</template>

<script>
import feather from 'feather-icons';

export default {
    props:["src","size","color"],
    methods:{
        getIcon(icon, size=24, color=null){
            let parts = icon.split("/");
            let type = parts[0];
            let value = parts[1];

            let types = {
                fi(value){
                    let i = feather.icons[value];
                    if (i){
                        return i.toSvg({width: size, height: size, stroke: color || "var(--text-color)"});
                    }
                },
                text(value){
                    return /*html*/`<span class="text" style="font-size: ${size}px; color: ${color};">${value}</span>`;
                }
            }
            if (types[type]){
                return types[type](value);
            }
            
            
        }
    }
}
</script>

<style scoped>
    .icon {
        display: inline-flex;
        align-items: center;
        justify-content: center;
    }
    .icon {
        width: var(--size);
        height: var(--size);
    }
    .icon svg {
        width: 100% !important;
        height: 100% !important;
    }
</style>