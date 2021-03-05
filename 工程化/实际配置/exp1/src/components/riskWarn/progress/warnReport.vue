<template>
    <div class="container">
        <Header tilte-text="风险预警报告" isBack>
            <div slot="headerRight">
                <el-button type="primary" v-show="tabName == 2" @click="changeStatus">{{ isIndexEdit ? "保存" : "修改指标" }}</el-button>
                <el-button type="primary" v-show="tabName == 2" @click="Analysis">重新分析</el-button>
                <el-button type="primary" @click="exportReport">导出报告</el-button>
            </div>
        </Header>
        <div class="public-box" style="padding: 15px 0 0 0">
            <el-tabs type="border-card" v-model="tabName" @tab-click="handleClick">
                <el-tab-pane label="预警报告正文" name="1">
                    <report-text :isTextEdit.sync="isTextEdit" :gradeColor="gradeColor" :gradeList="gradeList" :proUnitDataId="proUnitDataId" :projectId="projectId" :companyId="companyId" ref="reportText"></report-text>
                </el-tab-pane>
                <el-tab-pane label="财务风险详情" name="2">
                    <risk-details :isIndexEdit.sync="isIndexEdit" :gradeColor="gradeColor" :gradeList="gradeList" :isTextEdit.sync="isTextEdit" :proUnitDataId="proUnitDataId" :projectId="projectId" :companyId="companyId" ref="riskDetails"></risk-details>
                </el-tab-pane>
            </el-tabs>
        </div>
    </div>
</template>

<script>
import reportText from "./children/reportText";
import riskDetails from "./children/riskDetails";

export default {
    name: "warnReport",
    data() {
        return {
            tabName: "1",
            proUnitDataId: null,
            projectId: null, //项目id
            companyId: null, //企业id
            isIndexEdit: false, //指标是否为修改状态：1：修改状态
            isTextEdit: false,
            upTokenCd: "",
            gradeList: ["绿色档（无风险）", "黄色档（低风险）", "橙色档（中风险）", "红色档（高风险）" ],
            gradeColor:["#67c139","#eecb5f","#e3935d","#ed4d51"],
        };
    },
    components: {
        reportText,
        riskDetails,
    },
    created() {
        this.proUnitDataId = this.$route.query.id;
        this.projectId = this.$route.query.projectId;
        this.companyId = this.$route.query.companyId;
        this.upTokenCd = sessionStorage.getItem("Token");
    },
    beforeRouteLeave(to, from, next) {
        // ...
        if (this.isIndexEdit || this.isTextEdit) {
            this.$confirm("“指标数据”或“预警报告正文”未保存", "提示？", {
                confirmButtonText: "继续填写",
                cancelButtonText: "不保存",
                type: "warning",
            })
                .then(() => {
                    this.$router.forward();
                })
                .catch(() => {
                    next();
                });
        } else {
            next();
        }
    },
    mounted() {
        console.log(reportText,riskDetails)
        this.$nextTick(() => {
            setTimeout(() => {
                this.$refs.riskDetails.initRader( "radar-box-now", this.$refs.riskDetails.raderSeriesNames, this.$refs.riskDetails.raderSeriesData, this.$refs.riskDetails.colors1 );
                this.$refs.riskDetails.initRader( "radar-box-now2", this.$refs.riskDetails.raderSeriesNames, this.$refs.riskDetails.raderSeriesData, this.$refs.riskDetails.colors1 );

                this.$refs.riskDetails.initRader( "radar-box-past", this.$refs.riskDetails.raderSeriesNames2, this.$refs.riskDetails.raderSeriesData2, this.$refs.riskDetails.colors2 );
                this.$refs.riskDetails.initRader( "radar-box-past2", this.$refs.riskDetails.raderSeriesNames2, this.$refs.riskDetails.raderSeriesData2, this.$refs.riskDetails.colors2 );
            }, 400);
        });
    },

    methods: {
        handleClick(tab) {
            // 如果直接在riskDetails 这个组件里初始化，没法渲染出echart图标
            // tab.name == "2" && this.$nextTick(() => { this.$refs.riskDetails.initRader("radar-box"); });
        },
        changeStatus() {
            if (this.isIndexEdit) {
                this.$confirm("确认保存信息", "提示", {
                    confirmButtonText: "确定",
                    cancelButtonText: "取消",
                    type: "warning",
                })
                    .then(() => {
                        this.$refs.riskDetails.updateTarget();
                    })
                    .catch(() => {});
            } else {
                this.isIndexEdit = !this.isIndexEdit;
            }
        },
        exportReport() {
            if (this.isIndexEdit || this.isTextEdit) {
                this.$confirm("“指标数据”或“预警报告正文”未保存", "提示？", {
                    confirmButtonText: "继续填写",
                    cancelButtonText: "不保存",
                    type: "warning",
                })
                    .then(() => {})
                    .catch(() => {
                        this.$refs.riskDetails.exportReport();
                    });

                return;
            }

            this.$refs.riskDetails.exportReport();
        },
        Analysis() {
            // 先判断有没有保存
            this.$confirm("确认重新分析", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    this.$refs.riskDetails.targetAnalysis();
                })
                .catch(() => {});
        },
        // 生成报告
        generateReport() {
            let { projectId, companyId } = this;
            this.$api
                .generateReport({ projectId, companyId })
                .then((res) => {});
        },
    },
};
</script>
<style lang="stylus" scoped>
.back {
    display: inline-block;
    height: 25px;
    width: 25px;
    border: solid 1px #5f717d;
    line-height: @height;
    text-align: center;
    margin-right: 12px;
    cursor: pointer;

    &:hover {
        border: solid 1px $themeColor;
    }

    >>> .el-icon-back:before {
        font-size: 16px;
    }

    >>> .el-icon-back:hover:before {
        color: $themeColor;
        font-weight: bold;
    }
}

.public-box {
    .el-tabs {
        height: 100%;

        >>>.el-tabs__content {
            height: calc(100% - 40px - 30px);
        }

        .el-tab-pane {
            height: 100%;
        }
    }
}
</style>

