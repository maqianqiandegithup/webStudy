<template>
    <div class="container">
         <Header tilte-text="财务风险预警项目" isBack>
            <div slot="headerRight">
                  <el-button type="primary" size="small" @click="startProject" v-if="!projectInfo.projectStatus" >启动项目</el-button >
                </div>
        </Header>
        <!-- 项目详情：信息+单位列表 -->
        <div class="public-box">
            <div class="list-scroll">
                <div class="box-area">
                    <p class="box-title">项目信息</p>
                    <div class="wrapper-form">
                        <div class="public-head-left">
                            <p class="form-lable">项目名称:</p>
                            <div class="form-box">
                                <el-input
                                    placeholder="例：2019年财务风险预警项目"
                                    clearable
                                    v-model="projectInfo.projectName"
                                    disabled
                                ></el-input>
                            </div>
                        </div>
                        <div class="public-head-left">
                            <p class="form-lable">项目类型:</p>
                            <div class="form-box">
                                <el-input
                                    placeholder="例：2019年财务风险预警项目"
                                    clearable
                                    v-model="projectInfo.projectTypeName"
                                    disabled
                                ></el-input>
                            </div>
                        </div>
                        <div class="public-head-left" style="width: 40%">
                            <p class="form-lable">预警期间:</p>
                            <div class="form-box" style="max-width: 500px">
                                <el-date-picker
                                    v-model="projectInfo.startTime"
                                    type="date"
                                    placeholder="选择日期"
                                    style="max-width: 150px"
                                    disabled
                                >
                                </el-date-picker>
                                -
                                <el-date-picker
                                    v-model="projectInfo.endTime"
                                    type="date"
                                    placeholder="选择日期"
                                    style="max-width: 150px"
                                    disabled
                                >
                                </el-date-picker>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="list">
                    <p class="box-title">风险预警范围</p>
                    <p class="box-title" style=" font-size: 14px; margin-left: 16px; color: #0d4985; " > 共 {{proCompanyTotal}} 家单位 </p>
                    <div style="width: 100%; margin-top: 15px" class="flex-bet">
                        <el-input style="width: 400px" placeholder="企业代码/企业名称" v-model="searchContent2" clearable @clear="getCompanyByProjectId(true)" >
                            <template slot="prepend" ><i class="el-icon-search"></i ></template> <template slot="append"> <el-button @click="getCompanyByProjectId(true)" >查询</el-button > </template>
                        </el-input>
                        <el-button @click=" (modalVisible = true), getCompanyCanSelect() " ><i class="el-icon-plus"></i >添加风险预警单位</el-button >
                    </div>

                    <div class="unit-box public-from">
                        <el-table
                            :data="proCompanyList"
                            height="a"
                        >
                            <el-table-column label="序号" width="70" type="index" fixed="left" align="center" :index="indexMethod" > </el-table-column>
                            <el-table-column v-for="col in columns" :prop="col.id" :key="col.id" :type="col.type" :label="col.label" :width="col.width" :min-width="col.minWidth" :fixed="col.fixed" show-overflow-tooltip > </el-table-column>
                            <el-table-column fixed="right" align="center" label="操作" width="200" > <template slot-scope="scope"> <p class="btn-text btn-error" @click="delCompanyById(scope.row.id)" > 移除 </p> </template> </el-table-column>
                        </el-table>
                    </div>
                    <div class="page-box">
                        <tablePage ref="page1" :isFixed="false" :currentTotal="currentTotal" @getData="getCompanyByProjectId"></tablePage>
                    </div>
                </div>
            </div>
        </div>
        <!-- 弹框 -->
        <my-dialog
            :visible.sync="modalVisible"
            title="添加风险预警单位"
            okText="添加"
            width="70vw"
            @on-OK="addCompanyInProject"
            @on-Close="getCompanyByProjectId"
        >
            <div style="width: 100%; margin-top: 15px" class="flex-bet">
                <el-input
                    style="width: 400px"
                    v-model="searchContent"
                    placeholder="企业代码/企业名称"
                    clearable
                    @clear="getCompanyCanSelect(true)"
                >
                    <template slot="prepend" ><i class="el-icon-search"></i ></template>
                    <template slot="append"> <el-button @click="getCompanyCanSelect(true)" >查询</el-button > </template>
                </el-input>
            </div>
            <div class="unit-box public-from">
                <el-table
                    :data="selectCompanyList"
                    height="a"
                    @selection-change="handleSelectionChange"
                >
                    <el-table-column type="selection" width="55" fixed="left" align="center" >
                    </el-table-column>
                    <el-table-column label="序号" width="70" type="index" fixed="left" align="center" :index="indexMethodCanSelect" >
                    </el-table-column>
                    <el-table-column
                        v-for="col in columns"
                        :prop="col.id"
                        :key="col.id"
                        :type="col.type"
                        :label="col.label"
                        :width="col.width"
                        :min-width="col.minWidth"
                        :fixed="col.fixed"
                        show-overflow-tooltip
                    >
                    </el-table-column>
                </el-table>
            </div>
            <tablePage :isFixed="false" ref="dialogPage" :currentTotal="currentTotal2" @getData="getCompanyCanSelect" ></tablePage>
        </my-dialog>
    </div>
</template>

<script>
import tablePage from "@/components/common/tablePage";
export default {
    name: "projectDetails",
    components: {
        tablePage,
    },
    data() {
        return {
            projectID: null,
            value1: 0,
            modalVisible: false,
            indVersion: "",
            projectInfo: {},
            searchContent: "",
            searchContent2: "",
            selectCompanyList: [],
            proCompanyList: [],
            proCompanyTotal:0,
            selectionGroup: [],
            tableData: [],
            currentTotal:0,
            currentTotal2:0,
            columns: [
                {
                    id: "name",
                    label: "企业名称",
                    minWidth: "250",
                    fixed: "left",
                },
                {
                    id: "companyCode",
                    label: "企业代码",
                    minWidth: "200",
                },
                {
                    id: "economyType",
                    label: "国民经济行业分类",
                    minWidth: "250",
                },
                {
                    id: "scale",
                    label: "经营规模",
                    minWidth: "150",
                },
                {
                    id: "reportType",
                    label: "报表类型",
                    minWidth: "200",
                },
                {
                    id: "companyNature",
                    label: "单位性质",
                    minWidth: "200",
                },
                {
                    id: "executeNorm",
                    label: "执行会计准则",
                    minWidth: "180",
                },
            ],
        };
    },
    created() {
        this.projectID = this.$route.query.id;
        this.getProjectInfo();
    },
    mounted() {
        this.getCompanyByProjectId();
    },
    methods: {
        getProjectInfo(isMsg) {
            this.$api.getProjectInfo(this.projectID).then((res) => {
                if (res.code == 200) {
                    isMsg && this.$message({ message: "操作成功", type: "success"});
                    this.projectInfo = Object.assign(res.data);
                } else {
                    this.$message({ message: res.description, type: "error" });
                }
            });
        },
        // 启动项目
        startProject() {
            this.$confirm("确认启动项目", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    this.$api.startProject(this.projectID).then((res) => {
                        if (res.code == 200) {
                            this.getProjectInfo(1);
                        } else {
                            this.$message({ message: res.description, type: "error"});
                        }
                    });
                })
                .catch(() => {});
        },
        getCompanyCanSelect(isOnePage,isMsg) {
            isOnePage && (this.$refs.dialogPage.currenPage = 1);
            let param = {
                content: this.searchContent,
                page: this.$refs.dialogPage.currenPage,
                limit: this.$refs.dialogPage.pageSize,
            };
            this.$api.getCompanyCanSelect(this.projectID, param).then((res) => {
                if (res.code == 200) {
                    isMsg && this.$message({ message: "操作成功", type: "success"});
                    this.selectCompanyList = res.data;
                    this.currentTotal2 = res.data.length
                    this.$refs.dialogPage.total = res.paging.total;
                } else {
                    this.$message({ message: res.description, type: "error" });
                }
            });
        },
        addCompanyInProject() {
            if(this.selectionGroup.length == 0){
                this.$message({ message: "至少选择一家项目", type: "warning" });
                return
            } 
            this.$api
                .addCompanyInProject(this.projectID, this.selectionGroup)
                .then((res) => {
                    if (res.code == 200) {
                        this.getCompanyCanSelect(0,1);
                    } else {
                        this.$message({ message: res.description, type: "error", });
                    }
                });
        },
        getCompanyByProjectId(isOnePage,isMsg) {
            isOnePage && (this.$refs.page1.currenPage = 1);
            let param = {
                content: this.searchContent2,
                page: this.$refs.page1.currenPage,
                limit: this.$refs.page1.pageSize,
            };
            this.$api
                .getCompanyByProjectId(this.projectID, param)
                .then((res) => {
                    if (res.code == 200) {
                        isMsg && this.$message({ message: "操作成功", type: "success"});
                        this.proCompanyList = res.data;
                        this.proCompanyTotal = res.paging.total
                        this.currentTotal = res.data.length
                        this.$refs.page1.total = res.paging.total;
                    }
                });
        },
        delCompanyById(companyId) {
            this.$confirm("确认移除该单位", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    this.$api
                        .delCompanyById(this.projectID, companyId)
                        .then((res) => {
                            if (res.code == 200) {
                                this.getCompanyByProjectId(0,1);
                            } else {
                                this.$message({ message: res.description, type: "error", }); }
                        });
                })
                .catch(() => {});
        },
        indexMethodCanSelect(index) {
            return ( (this.$refs.dialogPage.currenPage - 1) * this.$refs.dialogPage.pageSize + index + 1 );
        },
        indexMethod(index){
            return ( (this.$refs.page1.currenPage - 1) * this.$refs.page1.pageSize + index + 1 );
        },
        handleSelectionChange(selection) {
            this.selectionGroup = selection;
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

.box-title {
    font-size: 16px;
    display: inline-block;
}

.wrapper-form {
    display: flex;
    flex-wrap: wrap;

    .public-head-left {
        margin-top: 15px;
        width: 30%;

        .form-lable {
            width: 100px;
            text-align: right;
            padding-right: 10px;
        }

        .form-box {
            width: calc(100% - 100px);
            max-width: 300px;

            .el-select {
                width: 100%;
            }
        }
    }
}

.list {
    height: calc(100% - 112px);
    padding-top: 15px;
    box-sizing: border-box;

    >>>.unit-box {
        height: calc(100% - 30px - 50px - 10px);
        min-height: 350px;
    }
}

.list-scroll {
    height: 100%;
    overflow-y: auto;
    padding-right: 15px;
}

>>> .my-dialog {
    .unit-box {
        height: vh(450);
    }

    .dialog-body {
        padding: 10px 20px;
    }
}

@media screen and (min-height: 800px) {
    .list-scroll {
        height: 100%;
        overflow-y: auto;
        padding-right: 15px;
    }
}

// >>>.page-box .page.fixed-footer {
//     right: vw(40);
//     left: 'calc(200px + %s)' % vw(40);
// }

.unit-box {
    width: 100%;
    margin: 15px 0 0 0;
    flex: 1;

    .el-table {
        height: 100% !important;
    }
}
.public-box{
    // height: calc(100% - 60px - 50px - 40px)
}
</style>