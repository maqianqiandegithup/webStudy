<template>
    <el-row class="menu-container">
        <el-col class="content-left">
            <el-menu
                :default-active="getRouter()"
                active-text-color="#fff"
                text-color="#fff"
                :key="random"
            >
                <div v-for="(item, index) in routerList" :key="index">
                    <el-menu-item
                        v-if="!item.children"
                        :key="item.path"
                        :index="item.path"
                        @click="$router.push($event.index)"
                        ><i
                            class="icon"
                            :style="'background-position:' + item.icon"
                        ></i
                        ><span>{{ item.name }}</span>
                    </el-menu-item>

                    <el-submenu v-else :index="'item' + index">
                        <template slot="title">
                            <i
                                class="icon"
                                :style="'background-position:' + item.icon"
                            ></i
                            ><span>{{ item.name }}</span>
                        </template>
                        <el-menu-item-group>
                            <el-menu-item
                                v-for="items in item.children"
                                @click="$router.push($event.index)"
                                :key="
                                    items.path.split('/').length - 1 > 1
                                        ? items.path
                                        : items.path
                                "
                                :index="
                                    items.path.split('/').length - 1 > 1
                                        ? items.path
                                        : items.path
                                "
                            >
                                <template slot="title">
                                    <span style="padding-left: 8px">{{
                                        items.name
                                    }}</span>
                                </template>
                            </el-menu-item>
                            <!-- :index="(items.path.split('/')).length-1>1?items.path:items.path" -->
                        </el-menu-item-group>
                    </el-submenu>
                </div>
            </el-menu>
        </el-col>
        <el-col v-if="!flag" class="content-right">
            <router-view></router-view>
        </el-col>
        <el-col v-else class="content-right">
            <!-- 不需要走缓存 -->
            <router-view v-if="!$route.meta.keepAlive"></router-view>
            <!-- 需要走缓存 -->
            <keep-alive>
                <router-view v-if="$route.meta.keepAlive"></router-view>
            </keep-alive>
        </el-col>
    </el-row>
</template>

<script>
export default {
    name: "menuView",
    data() {
        return {
            random: 0,
            flag: true,
        };
    },
    props: {
        routerList: Array,
    },
    created() {},
    computed: {},
    watch: {
        $route(to, from) {
            to.path.split("/").length > 2 || from.path.split("/").length > 2 ? (this.flag = true) : (this.flag = false);
            setTimeout(() => {
                this.flag = true;
            });
        },
    },
    methods: {
        selectMenu(e) {
            this.$router.push(e);
        },
        getRouter() {
            // console.log(
            //     this.$route.path.split("/"),
            //     this.$route.path.split("/").length
            // );
            // this.$route.path.split("/").length > 2 ? this.flag=true:this.flag=false;
            return "/" + this.$route.path.split("/")[1];
        },
    },
};
</script>

<style lang="stylus">
.menu-container {
    height: 100%;

    .content-left {
        width: 200px;
        // min-width 180px
        height: 100%;
        background: #2f4050;
    }

    .el-menu {
        background: #2f4050;

        .el-menu-item {
            background-color: #2f4050;

            &:focus, &:hover, &.is-active {
                background: #435362;
            }
        }

        .el-submenu__title:hover {
            background: #435362;
        }

    }

    .content-right {
        width: calc(100% - 200px);
        height: 100%;
        position: relative;
    }
}
.icon {
    width: 18px;
    height: 18px;
    background: url('../../assets/imgs/icon_all.png') no-repeat left top;
    display: inline-block;
    margin-right: 10px;
}
</style>