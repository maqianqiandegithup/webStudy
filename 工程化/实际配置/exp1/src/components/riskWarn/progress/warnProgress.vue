<template>
    <div class="container">
        <Header tilte-text="风险预警执行进度查询">
            <div slot="headerLeft">
                <span style="margin-left: 20px">
                    <el-select v-model="projectId" value-key="" placeholder="请选择项目" filterable size="small" @change="changeProject" style="width: 350px" >
                        <el-option v-for="item in projectsList" :key="item.id" :label="item.projectName" :value="item.id" > </el-option>
                    </el-select>
                </span>
            </div>
        </Header>
        <div class="list-scroll">
            <div class="tab-box">
                <div class="chart-item">
                    <p class="total-num">
                        <span>{{ echartData.companyTotal }}</span
                        ><span>家</span>
                    </p>
                    <p class="second-font">
                        共有单位<span class="font-16"></span>
                    </p>
                    <p class="divider"></p>
                </div>
                <div
                    class="chart-item"
                    v-for="(item, index) in echartData.schedules"
                    :key="index"
                >
                    <div class="pieBox">
                        <div class="wrap">
                            <div :id="'pie' + index" class="pie"></div>
                        </div>
                        <p class="total-zhanbi">
                            <span>{{
                                item.makeUp.slice(0, item.makeUp.length - 1)
                            }}</span
                            ><span>%</span>
                        </p>
                    </div>
                    <p class="second-font">
                        {{ item.name + "："
                        }}<span class="font-16">{{ item.number }}</span>
                    </p>
                    <p class="divider"></p>
                </div>
            </div>
            <progressList
                :projectId="projectId"
                ref="progressList"
            ></progressList>
        </div>
    </div>
</template>

<script>
import echarts from "echarts";
import progressList from "./children/progressList";
import tablePage from "@/components/common/tablePage";
export default {
    name: "warnProgress",
    components: {
        progressList,
        tablePage,
    },
    data() {
        return {
            projectId: null,
            projectsList: [],
            staticTexts: ["未完成汇总", "财报已汇总", "完成分析", "形成报告"],
            data: {
                companyTotal: 2,
                statics: [
                    {
                        ratio: 5, //占比
                        value: 10, //总数量
                        text: "未完成汇总",
                    },
                    {
                        ratio: 95,
                        value: 190,
                        text: "财报已汇总",
                    },
                    {
                        ratio: 92,
                        value: 182,
                        text: "完成分析",
                    },
                    {
                        ratio: 90,
                        value: 180,
                        text: "形成报告",
                    },
                ],
            },
            echartData: {},
            status: 0,
            progressList: [
                {
                    unitName: "北京二商集团有限责任公司",
                    projectName: "2019年财务风险预警",
                    status: 0,
                },
                {
                    unitName: "北京二商集团有限责任公司",
                    projectName: "2019年财务风险预警",
                    status: 0,
                },
            ],
            isFirst: false, //判断是不是第一次请求changeProject()
        };
    },
    created() {
        this.isFirst = true; // 首次进入页面第一次请求changeProject()
        this.getProjectlist();
    },
    mounted() {},

    activated() {
        document.querySelector(".list-scroll").scrollTop =
            this.$store.state.progressScorll || 0;
    },
    beforeRouteLeave(to, from, next) {
        let postion = document.querySelector(".list-scroll").scrollTop;
        postion == null && (postion = 0);
        this.$store.commit("setProgressScroll", postion);
        next();
    },
    destroyed() {
        this.$store.commit("setProgressScroll", 0);
    },
    methods: {
        drawPie() {
            for (let i = 0; i < 4; i++) {
                this.initPie(
                    "pie" + i,
                    this.echartData.companyTotal,
                    this.echartData.schedules[i]
                );
            }
        },
        getProjectlist() {
            this.$api.getProjectlist().then((res) => {
                if (res.code == 200) {
                    this.projectId = res.data[0].id;
                    this.projectsList = res.data;
                    this.changeProject();
                } else {
                }
            });
        },
        changeProject() {
            if (!this.projectId) return;

            // 选择项目后，需要重置单位，风险类型和完成进度
            let grade = this.isFirst ? this.$route.params.hasOwnProperty("grade") ? this.$route.params.grade : -1 : -1;
            let isFinished = this.isFirst ? this.$route.params.hasOwnProperty("grade") ? 1 : -1 : -1;
            this.isFirst = false;
            if (this.$refs.progressList) {
                this.getStatistics();
                this.$refs.progressList.companyId = null;
                this.$refs.progressList.grade = grade;
                this.$refs.progressList.isFinished = isFinished;
                this.$refs.progressList.getCompanyList(this.projectId);
                this.$refs.progressList.getProgressList(this.projectId, true);
            }
        },
        getStatistics() {
            this.$api.getProjectStatistics(this.projectId).then((res) => {
                if (res.code == 200) {
                    this.echartData = res.data;
                    this.$nextTick(() => {
                        this.drawPie();
                    });
                }
            });
        },
        initPie(id, total, chart) {
            let myChart = echarts.init(document.getElementById(id));
            let i = 0;
            let colors = ["#0d4985", "#e7e7e7"];
            let option = {
                series: [
                    {
                        name: chart.name,
                        type: "pie",
                        radius: ["84%", "98%"],
                        itemStyle: {
                            normal: {
                                //为什么可以用函数
                                color: function () {
                                    return colors[i++];
                                },
                                label: {
                                    show: false,
                                },
                                labelLine: {
                                    show: false,
                                },
                            },
                        },
                        avoidLabelOverlap: false,
                        silent: true,
                        data: [
                            {
                                value: chart.number,
                                name: chart.name,
                            },
                            {
                                // 这里判断total是否为0，如果是0，可以赋值为1，避免分母为0
                                value: total ? total - chart.number : 1,
                                name: "单位总数",
                            },
                        ],
                    },
                ],
            };

            myChart.setOption(option);
        },
    },
};
</script>

<style lang="stylus" scoped>
.container {
    .list-scroll {
        height: calc(100% - 60px - 20px);
        overflow-y: scroll;
    }
}

.tab-box {
    height: 180px;
    box-sizing: border-box;
    margin: vw(20);
    background: #fff;
    width: 'calc(100% - %s)' % (@margin * 2);
    display: flex;
    align-items: center;

    .chart-item {
        width: 20%;
        height: 100%;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        position: relative;

        .total-num {
            margin-bottom: 20px;

            & > span:first-child {
                font-size: 30px;
                // text-shadow: 1px 1px 1px #1d1d1d;
                font-family: PINGFANG_BOLD;
            }

            & > span:last-child {
                font-size: 12px;
            }
        }

        .font-16 {
            font-size: 16px;
            color: $primaryFontColor;
            font-weight: 600;
        }

        .pieBox {
            position: relative;
            height: 120px;
            width: 120px;
            margin-bottom: vw(8);
            display: flex;
            justify-content: center;
            align-items: center;

            .wrap {
                position: absolute;

                .pie {
                    height: 120px;
                    width: 120px;
                }
            }

            .total-zhanbi {
                margin-left: 12px;

                & > span:first-child {
                    font-size: 18px;
                    font-family: PINGFANG_BOLD;
                }

                & > span:last-child {
                    font-size: 12px;
                }
            }
        }
    }

    .divider {
        width: 1px;
        height: 50px;
        background: $borderColor;
        position: absolute;
        right: 0;
        top: 50%;
        margin-top: -(@height / 2);
    }

    .chart-item:last-child > .divider {
        display: none;
    }
}
</style>

