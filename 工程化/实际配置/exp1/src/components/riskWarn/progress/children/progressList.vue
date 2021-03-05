<template>
    <div class="public-box list-box">
        <div class="public-head-left">
            <span>单位：</span>
            <el-select
                v-model="companyId"
                value-key=""
                placeholder="请选择"
                clearable
                filterable
                @change="activatedId=null,buttonId=null,getProgressList(projectId, true)"
            >
                <el-option
                    v-for="item in companyLists"
                    :key="item.id"
                    :label="item.name"
                    :value="item.id"
                >
                </el-option>
            </el-select>
            <span style="margin-left: 30px">风险类型：</span>
            <el-select
                v-model="grade"
                placeholder="请选择"
                clearable
                filterable
                @change="activatedId=null,buttonId=null,getProgressList(projectId, true)"
            >
                <el-option
                    v-for="item in gradeList"
                    :key="item.id"
                    :label="item.label"
                    :value="item.id"
                >
                </el-option>
            </el-select>
            <el-radio-group
                v-model="isFinished"
                size="medium"
                style="margin-left: 30px"
                @change="activatedId=null,buttonId=null,getProgressList(projectId, true)"
                ><el-radio-button :label="-1">全部</el-radio-button
                ><el-radio-button :label="2">未完成</el-radio-button
                ><el-radio-button :label="1">已完成</el-radio-button>
            </el-radio-group>
        </div>
        <div class="list-scroll">
            <div
                :class="['list-item', { 'is-lock': item.recordVersion }]"
                v-for="(item, index) in progressList"
                :key="index"
            >
                <div class="flex-item1">
                    <p>单位名称：</p>
                    <div class="tip tip-top" :data-tip="item.companyName">
                        <p>
                            {{ item.companyName }}
                        </p>
                    </div>
                    <p class="zwwy" :style="`background:${gradeColor[item.grade]}`" v-show="item.grade">债务违约风险</p>
                </div>
                <div class="flex-item2">
                    <p>项目名称：</p>
                    <div class="tip tip-top" :data-tip="item.projectName">
                        <p>
                            {{ item.projectName }}
                        </p>
                    </div>
                    <!-- 这里的p元素没有内容，纯属于，撑开空间，以确保和第一列的布局相同 -->
                    <p class="zwwy zwwy-lock" v-show="item.grade"></p>
                </div>
                <div class="flex-item3">
                    <p></p>
                </div>
                <div class="flex-item4">
                    <el-steps
                        :space="200"
                        :active="item.processStatus + 1"
                        finish-status="success"
                    >
                        <el-step title="等待汇总"></el-step>
                        <el-step title="财报已汇总"></el-step>
                        <el-step title="风险分析"></el-step>
                        <el-step title="形成报告"></el-step>
                    </el-steps>
                </div>
                <div class="flex-item5 flex-end">
                    <div class="flex-bet">
                        
                        <button
                            @click="activatedId=item.id,buttonId=1, $router.push({ name: 'reportList', query: { id: item.id, companyId: item.companyId, projectId: projectId,companyName:item.companyName } }) "
                            :class=" [item.recordVersion ? 'btn-disabled' : 'btn-useable',{'btn-actived':(item.id ==activatedId && buttonId==1)} ]"
                            :disabled="item.recordVersion == 1"
                        >
                            查看报表</button
                        ><button @click="activatedId=item.id,buttonId=2,$router.push({ name: 'warnReport', query: { id: item.id, companyId: item.companyId, projectId: projectId, }, }) " 
                        :class=" [(item.recordVersion != 1 && item.processStatus == 3) ? 'btn-useable' : 'btn-disabled',{'btn-actived':(item.id ==activatedId && buttonId==2)}]" :disabled="item.recordVersion == 1 || item.processStatus != 3" > 查看报告 </button>
                    </div>
                </div>
                <div class="lock-img tip tip-left" :data-tip="'正在执行计算任务，请您稍作等待'" v-show="item.recordVersion">
                    <!-- img中也可以使用@ -->
                    <img src="@/assets/imgs/lock.png" alt="" />
                </div>
            </div>
            <div class="notext" v-show="!progressList||progressList.length===0"><p>暂无数据</p> </div>
        </div>
        <div class="page-box">
            <tablePage
                @getData="activatedId=null,buttonId=null,getProgressList(projectId)"
                ref="tablePage"
            ></tablePage>
        </div>
    </div>
</template>

<script>
import tablePage from "@/components/common/tablePage";
export default {
    name: "progressList",
    components: {
        tablePage,
    },
    data() {
        return {
            companyId: null, //0：全部
            companyLists: [],
            gradeList: [
                {
                    label: "全部",
                    id: -1,
                },
                {
                    label: "绿色档（无风险）",
                    id: 0,
                },
                {
                    label: "黄色档（低风险）",
                    id: 1,
                },
                {
                    label: "橙色档（中风险）",
                    id: 2,
                },
                {
                    label: "红色档（高风险）",
                    id: 3,
                },
            ],
            gradeColor:["#67c139","#eecb5f","#e3935d","#ed4d51"],
            grade:  -1, // 风险等级（0 绿色档-无风险，1 黄色档-低风险，2 橙色档-中风险，3 红色档-高风险）
            isFinished: -1, //完成进度【-1：全部；0：完成；1：未完成】
            progressList: [],
            stepsArr: [],
            timeOutId: null,
            activatedId:null,
            buttonId:null, //记录点击的是哪个按钮
        };
    },
    props: ["projectId"],
    created() {
    },
    activated() {
        setTimeout(() => {
                    this.projectId && (this.getProgressList(this.projectId),this.$parent.getStatistics())
                }, 10);
       
        this.$route.params.msg && this.$message({ message: this.$route.params.msg, type: "success" });        
        this.timeIntervalId(true);
    },
    deactivated(){
         this.timeIntervalId(false)
    },
    methods: {
        getReports() {},
        getCompanyList(id) {
            this.$api.getCompanyList(id).then((res) => { res.code == 200 ? (this.companyLists = res.data) : this.$message(res.description); });
        },

        getProgressList(projectId, isOnePage) {
            /**
             * @param {Boolean} isOnePage 标识是否需要将page组件的currenPage重置为:true:是,false:否
             */
            isOnePage && (this.$refs.tablePage.currenPage = 1);
            let param = {
                projectId: projectId,
                companyId: this.companyId,
                grade: this.grade,
                isFinished: this.isFinished,
                page: this.$refs.tablePage.currenPage,
                limit: this.$refs.tablePage.pageSize,
            };
            this.$api.getProgressList(param).then((res) => {
                res.code == 200
                    ? ((this.progressList = res.data),
                      (this.$refs.tablePage.total = res.paging.total))
                    : this.$message(res.description);
            });
        },
        timeIntervalId(flag) {
            // 使用setTimeout实现setInterval 
            if (flag) {
                this.timeOutId = setTimeout(() => {
                    this.getProgressList(this.projectId);
                    this.$parent.getStatistics()
                    this.timeIntervalId(true);
                }, 10000);
            }else{
                clearTimeout(this.timeOutId)
                this.timeOutId = null
            }
        },
        viewList(){
            
        }
    },
};
</script>

<style lang="stylus" scoped>
.list-box {
    min-height: 'calc(100% - 145px - 50px - %s)' % vw(40);
    height: auto;
    padding-bottom: 56px;
    margin-bottom: 0;

    .list-scroll {
        margin-top: vw(20);

        // height: inherit;
        // overflow-y: scroll;
        .notext{
            height vh(300)
            width inherit
            text-align center
            line-height: vh(300);
            p{
                height inherit 
                display: inline-block; /*一定要将div设置为inline-block*/
                vertical-align: middle;/*设置该元素在父元素中的位置*/
            }
        }
        .list-item {
            position: relative;
            box-sizing: border-box;
            display: flex;
            align-items: center;
            border-radius: 2px;
            margin-bottom: 13px;
            border: 1px solid #bfbfbf;
            padding: 20px vw(20);
            padding-top: 20px;

            &:last-child {
                margin-bottom: 0;
            }

            &.is-lock {
                background: #efefef;
            }

            .zwwy {
                color: #fff;
                font-size: 12px;
                height: 20px;
                line-height: 20px;
                display: inline-block;
                padding: 0 6px;
                border-radius: 2px;
                margin-top: 6px;
            }

            .zwwy-lock {
                background-color: inherit;
            }

            .flex-item1, .flex-item2 {
                width: 16%;
                min-width: 200px;
                padding-right: 20px;
                box-sizing: border-box;

                p:nth-child(1) {
                    color: #999999;
                }

                div:nth-child(2) p {
                    color: #0b1b2b;
                    margin-top: 12px;
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                }
            }

            .flex-item3 {
                width: 65px;

                p {
                    height: 47px;
                    width: 1px;
                    background: #bfbfbf;
                }
            }

            .flex-item4 {
                width: 45%;
            }

            .flex-item5 {
                width: calc(23% - 55px);

                // min-width: 163px;
                // width: 173px;
                // text-align: left;
                div {
                    width: 153px;
                }

                button {
                    width: 70px;
                    height: 28px;
                    background-color: #ffffff;
                    border-radius: 2px;
                    transition:.1s 
                    &:nth-child(2) {
                        // margin-left: vw(20);
                    }
                }

                button.btn-useable {
                    border: solid 1px $themeColor;
                    color: $themeColor;
                    font-size: 12px;
                    cursor: pointer;

                    &:hover {
                        color: #ffffff;
                        background: $themeColor;
                    }
                    &.btn-actived {
                        color: #ffffff;
                        background: $themeColor;
                    }
                }

                button.btn-disabled {
                    border: solid 1px #bfbfbf;
                    color: #999999;
                    cursor: not-allowed;
                }
            }

            .lock-img {
                height: 40px;
                width: 40px;
                position: absolute;
                right: 0;
                top: 0;

                img {
                    height: 100%;
                    width: 100%;
                }
            }
        }
    }
}

>>> .el-step__title.is-wait {
    color: $secondFontColor;
}

>>> .el-step__title {
    font-size: 14px;
}

>>> .el-step__title.is-success {
    color: $primaryFontColor;
    font-weight: bold;
}

>>> .el-step__title.is-process {
    color: $primaryFontColor;
    font-weight: bold;
}

>>> .el-step.is-horizontal .el-step__line {
    left: 35px;
    right: 10px;
}

>>> .el-step__line {
    background: $borderColor;
}

>>> .el-step__head.is-success {
    border-color: $themeColor;
}

>>> .el-step__head.is-progress {
    border-color: $themeColor;
}

>>> .el-step__head.is-success .el-step__line {
    background: $themeColor;
    height: 2px;
}

>>> .el-step__head.is-success .el-step__icon.is-text {
    background: $themeColor;
}

>>> .el-step__head.is-success .el-step__icon-inner {
    color: #fff;
}

>>>.page-box .page.fixed-footer {
    right: 'calc(8px + %s)' % vw(20);
    border-top: 1px solid #bfbfbf;
}
</style>