<template>
    <span class="icon-qmark" @click="$emit('click')">?</span>
</template>
<script>
export default {
    name: "myQmark",
};
</script>
<style lang='stylus' scoped>
.icon-qmark {
    display: inline-block;
    margin-left: 2px;
    font-size: 14px;
    height: 14px;
    width: 14px;
    text-align: center;
    line-height: 14px;
    border: 1px solid #999;
    border-radius: 50%;
    color:#999;
    cursor: pointer;
    margin-left: 10px;
    transition  .2s 
    &:hover{
        border:1px solid #0d4985
        color #0d4985
        font-weight bold
    }
}
</style>