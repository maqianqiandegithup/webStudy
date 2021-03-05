<template>
    <div class="container">
        <Header tilte-text="财务风险预警项目">
            <div slot="headerRight">
                <el-button type="primary" size="small" @click="openAddModal"
                    >新建项目</el-button ></div>
        </Header>
        <!-- 风险预警项目清单 -->
        <projectList
            ref="projectList"
            @openEditModal="openEditModal"
        ></projectList>
        <!-- 新增项目弹框 -->
        <my-dialog
            :visible.sync="modalVisible"
            :title="modalStatus == 0 ? '新建项目' : '编辑项目'"
            width="560px"
            @on-OK="saveProject"
            :destroy-on-close="true"
        >
            <div class="form-wrap">
                <p class="form-item public-head-left">
                    <span class="form-lable">项目名称：</span>
                    <el-input
                        class="inputbox"
                        type="text"
                        v-model="proParam.projectName"
                        size="normal"
                        style="width: 300px"
                        maxlength="50"
                        show-word-limit
                        @focus="inputChange"
                    >
                    </el-input>
                </p>
                <p class="form-item public-head-left">
                    <span class="form-lable">项目类型：</span>
                    <el-select
                        v-model="proParam.projectTypeId"
                        clearable
                        style="width: 300px"
                        @change="selectType"
                    >
                        <el-option
                            v-for="item in proTypeList"
                            :key="item.id"
                            :label="item.label"
                            :value="item.id"
                        >
                        </el-option>
                    </el-select>
                </p>
                <div class="form-item public-head-left">
                    <span class="form-lable">预警期间：</span>
                    <div
                        class="form-box"
                        style="width: 300px; display: inline-block"
                    >
                        <el-date-picker
                            v-model="proParam.startTime"
                            type="date"
                            value-format="yyyy-MM-dd"
                            format="yyyy-MM-dd"
                            placeholder="选择日期"
                            style="max-width: 140px"
                            :picker-options="startTimeOptions"
                        >
                        </el-date-picker>
                        -
                        <el-date-picker
                            v-model="proParam.endTime"
                            value-format="yyyy-MM-dd"
                            format="yyyy-MM-dd"
                            type="date"
                            placeholder="选择日期"
                            :picker-options="endTimetOptions"
                            style="max-width: 140px"
                        >
                        </el-date-picker>
                    </div>
                </div>
            </div>
        </my-dialog>
    </div>
</template>

<script>
import projectList from "./children/projectList";
export default {
    name: "warnProject",
    components: {
        projectList
    },
    data() {
        return {
            modalVisible: false,
            modalStatus: 0, //0:新增，1：编辑
            proParam: {
                id: null,
                projectName: "",
                projectTypeId: null,
                projectTypeName: "",
                startTime: null,
                endTime: null,
            },
            proTypeList: [
                {
                    id: 1,
                    label: "企业年报风险预警",
                },
                {
                    id: 2,
                    label: "企业季报风险预警",
                },
            ],
            startTimeOptions: {
                disabledDate: (time) => {
                    var endtimeStamp = new Date(
                        `${this.proParam.endTime} 00:00:00`
                    );
                    return (
                        this.proParam.endTime &&
                        time.getTime() > endtimeStamp.getTime()
                    );
                },
            },
            endTimetOptions: {
                disabledDate: (time) => {
                    var startTimeStamp = new Date(
                        `${this.proParam.startTime} 00:00:00`
                    );
                    return (
                        this.proParam.startTime &&
                        time.getTime() < startTimeStamp.getTime()
                    );
                },
            },
        };
    },

    mounted() {},
    methods: {
        saveProject() {
            if (
                this.proParam.projectName &&
                this.proParam.projectTypeId &&
                this.proParam.startTime &&
                this.proParam.endTime
            ) {
                let param1 = {
                    startTime: this.proParam.startTime + " 00:00:00",
                    endTime: this.proParam.endTime + " 00:00:00",
                };
                let param2 = { ...this.proParam };
                Object.assign(param2, param1);
                this.$api.saveProject(param2).then((res) => {
                    if (res.code == 200) {
                        this.$refs.projectList.getData(0, 1);
                        this.modalVisible = false;
                    } else {
                        this.$message({
                            message: res.description,
                            type: "error",
                        });
                    }
                });
            } else {
                this.$message({ message: "存在未填项", type: "error" });
            }
        },
        selectType(id) {
            this.proParam.projectTypeName = this.proTypeList[id - 1].label;
        },
        openEditModal(param) {
            // this.proParam = {...param} //两种方法都可以,一种是合并，一种是直接赋值
            this.modalStatus = 1;
            Object.assign(this.proParam, param);
            this.modalVisible = true;
        },
        openAddModal() {
            this.modalStatus = 0;
            (this.proParam = {
                id: null,
                projectName: "",
                projectTypeId: null,
                projectTypeName: "",
                startTime: null,
                endTime: null,
            }),
                (this.modalVisible = true);
        },
        inputChange() {
            if (this.proParam.projectName.length >= 50) {
                document.querySelector(".el-input__count-inner").style.color =
                    "red";
            } else {
                document.querySelector(".el-input__count-inner").style.color =
                    "#909399";
            }
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

.form-wrap {
    text-align: center;
    padding: 39px 0 59px;

    .form-lable {
        // width: 100px;
        text-align: right;
        padding-right: 10px;
    }

    .form-item {
        display: inline-flex;
        margin-top: 20px;
    }
}
</style>