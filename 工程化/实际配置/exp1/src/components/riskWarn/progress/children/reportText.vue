<template>
    <div class="box-container list-scroll">
        <div class="box-area">
            <p class="box-title">企业信息</p>
            <div class="box-content">
                <p class="font-bold">企业全称：{{ companyInfo.companyName }}</p>
                <div class="wrapper-form">
                    <div class="public-head-left">
                        <p class="form-lable">企业代码:</p>
                        <p class="form-text">{{ companyInfo.companyCode }}</p>
                    </div>
                    <div class="public-head-left">
                        <p class="form-lable">报表类型:</p>
                        <p class="form-text">
                            {{ companyInfo.reportTypeName }}
                        </p>
                    </div>
                    <div class="public-head-left">
                        <p class="form-lable">风险预警项目:</p>
                        <p class="form-text">{{ companyInfo.projectName }}</p>
                    </div>
                    <div class="public-head-left">
                        <p class="form-lable">国民经济行业分类:</p>
                        <p class="form-text">
                            {{ companyInfo.economyTypeName }}
                        </p>
                    </div>
                    <div class="public-head-left">
                        <p class="form-lable">单位性质:</p>
                        <p class="form-text">
                            {{ companyInfo.companyNatureName }}
                        </p>
                    </div>
                    <div class="public-head-left">
                        <p class="form-lable">预警周期:</p>
                        <p class="form-text">
                            {{ $changeDate(companyInfo.startTime) + "-" + $changeDate(companyInfo.endTime) }}
                        </p>
                    </div>
                    <div class="public-head-left">
                        <p class="form-lable">经营规模:</p>
                        <p class="form-text">{{ companyInfo.scaleName }}</p>
                    </div>
                    <div class="public-head-left">
                        <p class="form-lable">执行会计准则:</p>
                        <p class="form-text">
                            {{ companyInfo.executeNormName }}
                        </p>
                    </div>
                    <div class="public-head-left">
                        <p class="form-lable">债务违约风险级别:</p>
                        <p class="form-text" :style="`color:${gradeColor[companyInfo.grade]};font-weight:bold`">
                          {{gradeList[companyInfo.grade]}}
                        </p>
                    </div>
                </div>
            </div>
        </div>
        <div class="box-area">
            <div class="flex-bet">
                <p class="box-title">风险预警报告正文</p>
                <div>
                    <my-button v-show="!isTextEdit" type="primary" @click='$emit("update:isTextEdit", true);'><i class="iconfont icon-bianji"></i>编辑报告</my-button>
                    <my-button v-show="isTextEdit" type="primary" @click="updateReport"><i class="iconfont icon-baocun"></i>保&nbsp;&nbsp;存</my-button>
                    <my-button style="margin-left:20px;margin-right:20px;" @click="reportRegenerate"><i class="iconfont icon-zhongzhi"></i>重置报告</my-button>
                </div>
            </div>

            <div class="box-content box-sencond">
                <el-input type="textarea" id="textarea" :disabled="!isTextEdit" contenteditable placeholder="请输入内容" v-model="textarea" @input="getValue"></el-input>   
            </div>
            
        </div>
    </div>
</template>

<script>
export default {
    name: "reportText",
    data() {
        return {
            companyInfo: {},
            textarea: "",
        };
    },
    props: ["isTextEdit","isIndexEdit", "proUnitDataId", "projectId", "companyId","gradeColor","gradeList"],
    created() {
        this.reportContent();
    },
    mounted() {
        this.getReportText();
        // 初始化高度
        let textarea = document.querySelector("#textarea");

        textarea.style.height = `${textarea.scrollHeight + 10}px`;

        let lastscroll = textarea.scrollHeight;

        textarea.addEventListener("input", function (e) {
            if (lastscroll != this.scrollHeight) {
                this.style.height = `${this.scrollHeight + 10}px`;
            }
            lastscroll = this.scrollHeight;
        });
    },
   
    methods: {
        getReportText() {
            let { companyId, projectId } = this;
            this.$api.getReportText({ companyId, projectId }).then((res) => {
                if (res.code == 200) {
                    this.companyInfo = res.data;
                } else {
                    this.$message({ message: res.description, type: "error" });
                }
            });
        },
        // 获取输入框的内容getValue
        getValue(value) {
            // console.log(value);
        },
        changeHeight() {
            if (lastscroll != this.scrollHeight) {
                this.style.height = `${this.scrollHeight + 10}px`;
            }
            lastscroll = this.scrollHeight;
            //  this.style.height = "inherit";
        },
        reportContent() {
            let { companyId, projectId } = this;
            this.$api.reportContent({ companyId, projectId }).then((res) => {
                if (res.code == 200) {
                    this.textarea = res.data;
                    this.$nextTick(() => {
                        let textarea = document.querySelector("#textarea");
                        textarea.style.height = `${ textarea.scrollHeight + 10 }px`;
                    });
                }
            });
        },
        updateReport() {
            let { companyId, projectId } = this,
                content = this.textarea;
            this.$api
                .updateReport({ companyId, projectId, content })
                .then((res) => {
                    if (res.code == 200) {
                        this.$message({ message: res.description, type: "success", });
                        this.$emit("update:isTextEdit", false);
                    } else {
                        this.$message({ message: res.description, type: "error", });
                    }
                });
        },
        reportRegenerate() {
            let { companyId, projectId } = this,
                content = this.textarea;
            this.$confirm(
                "报告重置后，您编辑过的内容将会丢失。建议您先将编辑过的信息另存。",
                "确认重置报告？",
                {
                    confirmButtonText: "继续重置",
                    cancelButtonText: "取消",
                    type: "warning",
                }
            )
                .then(() => {
                    regenerate({ companyId, projectId });
                })
                .catch(() => {});

            let regenerate = (params) => {
                this.$api.reportRegenerate(params).then((res) => {
                    if (res.code == 200) {
                        this.$message({ message: res.description, type: "success", });
                        this.textarea = res.data;
                        this.$nextTick(() => {
                            let textarea = document.querySelector("#textarea");
                            textarea.style.height = `${ textarea.scrollHeight + 10 }px`;
                    });
                        this.$emit("update:isTextEdit", false);
                    } else {
                        this.$message({ message: res.description, type: "error", });
                    }
                });
            };
        },
    },
};
</script>

<style lang="stylus" scoped>
.box-container {
    height: 100%;
    overflow: auto;
}

.box-area {
    .box-title {
        font-size: 18px;
        padding: 10px 0;
    }

    .box-content {
        padding: 20px;
        background: #f4f5f9;

        .wrapper-form {
            display: flex;
            flex-wrap: wrap;

            .public-head-left {
                margin-top: 15px;
                width: 33%;

                .form-lable {
                    width: 120px;
                    text-align: right;
                    padding-right: 10px;
                }

                .form-text {
                    width: calc(100% - 120px);
                    max-width: 300px;
                }
            }
        }
    }

    .font-bold {
        font-size: 16px;
        font-family: PINGFANG_BOLD;
    }
}

.box-area:nth-child(2) {
    height: calc(100% - 212px);

    .box-sencond {
        min-height: calc(100% - 45px - 40px);
        height: auto;
        text-align: center;
    }
}

.iconfont {
    display: inline-block;
    margin-right: 5px;
}

>>>.el-textarea {
    width: vw(800);
    min-width: 800px;
    margin: 10px auto;
    // left: 50%;
    box-shadow: 0px 0px 20px 0px rgba(32, 33, 55, 0.1);
    height: auto;

    &>.el-textarea__inner {
        padding: 105px 125px;
        color: #1d1d1d;
        font-family:monospace;
        font-size: 16px;
        line-height: 32px;
        height: 1100px;
        border-color:#0d4985
        // font-weight bold
    }

    &.is-disabled > .el-textarea__inner {
        background-color: #fff;
        cursor: auto;
        color: #1d1d1d;
        border-color:#E4E7ED
    }

    &:before {
        content: '';
        display: inline-block;
        width: 20px;
        height: @width;
        border-right: 1px solid #ccc;
        border-bottom: 1px solid #ccc;
        position: absolute;
        left: 94px;
        top: 70px;
    }

    &:after {
        content: '';
        display: inline-block;
        width: 20px;
        height: @width;
        border-left: 1px solid #ccc;
        border-bottom: 1px solid #ccc;
        position: absolute;
        right: 94px;
        top: 70px;
    }
}
</style>