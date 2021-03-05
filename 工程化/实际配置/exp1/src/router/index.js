import Vue from 'vue'
import Router from 'vue-router'
import { Message } from 'element-ui'
Vue.use(Router)
const originalPush = Router.prototype.push
Router.prototype.push = function push(location) {
        return originalPush.call(this, location).catch(err => err)
    }
    // 基础视图
import login from '@/components/view/login.vue'
import index from '@/components/view/index.vue'
// 风险预警
import riskPage from '@/components/riskWarn/riskPage.vue'
import warnProgress from '@/components/riskWarn/progress/warnProgress.vue'
import warnProject from '@/components/riskWarn/project/warnProject.vue'
import projectDetails from '@/components/riskWarn/project/projectDetails.vue'
import reportList from '@/components/riskWarn/progress/reportList.vue'
import warnReport from '@/components/riskWarn/progress/warnReport.vue'

// 配置
import configPage from '@/components/config/configPage.vue'
import unitInfo from '@/components/config/unitInfo.vue'
import reportTemplate from '@/components/config/reportTemplate.vue'
import warnSetting from '@/components/config/warnSetting.vue'
import standardData from '@/components/config/standardData.vue'

import largeScreen from '@/components/view/largeScreen.vue'
let router = new Router({
    mode: 'history',
    routes: [{
            path: "/",
            name: "login",
            component: login
        },
        {
            path: "/index",
            name: "index",
            redirect: "/warnProgress",
            component: index,
            children: [{
                    path: "/riskPage",
                    name: "riskPage",
                    component: riskPage,
                    redirect: "/warnProgress",
                    children: [{
                            path: "/warnProgress",
                            name: "warnProgress",
                            component: warnProgress,
                            meta: {
                                keepAlive: true
                            }
                        },
                        {
                            path: "/warnProject",
                            name: "warnProject",
                            component: warnProject,
                            meta: {
                                keepAlive: true
                            }
                        },
                        {
                            path: "/warnProject/projectDetails",
                            name: "projectDetails",
                            component: projectDetails,
                        },
                        {
                            path: "/warnProgress/reportList",
                            name: "reportList",
                            component: reportList,
                        },
                        {
                            path: "/warnProgress/warnReport",
                            name: "warnReport",
                            component: warnReport,
                        },
                    ]
                },
                {
                    path: "/configPage",
                    name: "configPage",
                    component: configPage,
                    redirect: "/unitInfo",
                    children: [{
                            path: "/unitInfo",
                            name: "unitInfo",
                            component: unitInfo
                        },
                        {
                            path: "/reportTemplate",
                            name: "reportTemplate",
                            component: reportTemplate
                        },
                        {
                            path: "/warnSetting",
                            name: "warnSetting",
                            component: warnSetting
                        },
                        {
                            path: "/standardData",
                            name: "standardData",
                            component: standardData
                        },
                    ]
                }

            ]
        },
        {
            path: "/largeScreen",
            name: "largeScreen",
            component: largeScreen
        }
    ]
})
router.beforeEach((to, from, next) => {
    // 限制无权限用户无法进入用户管理
    if (sessionStorage.getItem("userAccount") != "admin" && to.name == "standardData") {
        next("/");
        return false;
    }
    next();

    //     if (to.name != "login") {
    //         if(sessionStorage.getItem("Token")&&sessionStorage.getItem("Token")!="undefined") next()
    //         else {
    //             Message.warning("您的登录信息已失效，请重新登录！");
    //             next("/")
    //         }
    //     } else next();
})
export default router