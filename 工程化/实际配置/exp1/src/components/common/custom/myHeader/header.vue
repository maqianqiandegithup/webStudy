<template>
    <div class="header-box">
        <div class="header-left">
            <span class="header-back" @click="$router.back(-1)" v-show="isBack"
                ><i class="el-icon-back"></i
            ></span>
            <h4 class="header-title">{{ tilteText }}</h4>
            <slot name="headerLeft"> </slot>
        </div>
        <div class="header-right">
            <slot name="headerRight"> </slot>
        </div>
    </div>
</template>
<script>
export default {
    name: "Header",
    props: {
        tilteText: {
            type: String,
            default: "",
        },
        isBack: {
            type: Boolean,
            default: false,
        },
    },
};
</script>
<style lang="stylus" scoped>
.header-box {
    width: 100%;
    height: 60px;
    background: #fff;
    padding: 0 24px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    box-sizing: border-box;

    .header-left {
        display: flex;
        align-items: center;

        h4 {
            font-size: 18px;
        }

        .header-back {
            display: inline-block;
            height: 25px;
            width: 25px;
            border: 1px solid #5f717d;
            text-align: center;
            line-height: 25px;
            margin-right: 15px;
            cursor: pointer;
            transition:border .15s linear 
            &:hover {
                border: 1px solid #0d4985;
            }

            >>> .el-icon-back:before {
                font-size: 16px;
                transition:color,font-weight .15s linear 
            }

            >>> .el-icon-back:hover:before {
                color: $themeColor;
                font-weight: bold;
            }
        }
    }
}
</style>