<template>
    <div class="app">
        <menu-view :router-list="routerList"></menu-view>
    </div>
</template>

<script>
import menuView from "@/components/common/menuView.vue";
export default {
    name: "riskPage",
    data() {
        return {
            routerList: [
                {
                    name: "执行进度查询",
                    path: "/warnProgress",
                    icon:"-80px 0"
                },
                {
                    name: "风险预警项目",
                    path: "/warnProject",
                    icon:"-100px 0"
                },
            ],
        };
    },
    components: {
        menuView,
    },
};
</script>

<style lang="stylus" scoped>
.app{
    height 100%
}
</style>

