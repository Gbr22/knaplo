<template>
    <span v-html="getIcon(src)" class="icon">

    </span>
</template>

<script>
import feather from 'feather-icons';

export default {
    props:["src"],
    methods:{
        getIcon(icon){
            let parts = icon.split("/");
            let type = parts[0];
            let value = parts[1];

            let types = {
                fi(value){
                    let i = feather.icons[value];
                    if (i){
                        return i.toSvg();
                    }
                },
                text(value){
                    return value;
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
</style>