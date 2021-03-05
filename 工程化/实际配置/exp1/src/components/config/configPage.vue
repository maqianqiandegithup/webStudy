<template>
    <div class="app">
        <menu-view :router-list="routerList"></menu-view>
    </div>
</template>

<script>
import menuView from "@/components/common/menuView.vue";
export default {
    name: "configPage",
    data() {
        return {
            routerList: [
                {
                    name: "单位档案",
                    path: "/unitInfo",
                    icon:""
                },
                {
                    name: "风险预警体系",
                    path: "/",
                    icon:"-20px -1px",
                    children: [
                        {
                            name: "报表模板",
                            path: "/reportTemplate"
                        },
                        {
                            name: "预警指标设置",
                            path: "/warnSetting"
                        }
                    ]
                }
            ],
        };
    },
    components: {
        menuView,
    },
    mounted(){
        sessionStorage.getItem("userAccount")=="admin"&&this.routerList.push({
            name: "用户管理",
            path: "/standardData",
            icon:"-60px -2px"
        })
    }
};
</script>

<style lang="stylus" scoped>
.app{
    height 100%
}
</style>

