<template>
    <button 
        @click="$emit('click')" 
        :disabled="disabled"
        class="btn" :class="[ type ? 'btn-' + type : '', buttonSize ? 'btn-' + buttonSize : '',
        {
            'is-disabled': disabled,
            'is-loading': loading,
            'is-plain': plain,
            'is-round': round,
            'is-circle': circle
        }
        ]" ><slot></slot></button>
</template>
<script>
export default {
    name: "myButton",
    props: {
        type: {
            type: String,
            default: "default",
        },
        size: String,

        nativeType: {
            type: String,
            default: "button",
        },
        loading: Boolean,
        disabled: Boolean,
        plain: Boolean,
        autofocus: Boolean,
        round: Boolean,
        circle: Boolean,
        buttonSize:String
    },
};
</script>
<style lang="stylus" scoped>

.btn{
    padding 5px;
    border-radius: 2px;
    transition: 0.1s;
    font-size 14px;
    box-sizing border-box;
    line-height 1;
    cursor pointer;
    outline:none;
}
.btn-default{
    color #0d4985
    background #fff
    border 1px solid #0d4985
    &:hover{
        color: #ffffff;
        background: #0d4985;
    }
}
.btn-primary{
    color: #ffffff;
    background: #0d4985;
    border 1px solid #0d4985
    // &:hover{
    //     background: #2f6396;
    // }
}
</style>