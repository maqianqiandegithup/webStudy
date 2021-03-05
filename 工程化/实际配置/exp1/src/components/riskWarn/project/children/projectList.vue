<template>
    <div class="public-box">
        <div class="public-head-left">
            <el-input
                v-model="content"
                style="width: 400px"
                placeholder="请输入项目名称"
                class="search-input"
                clearable
                @clear="getData(true)"
            >
                <template slot="prepend"
                    ><i class="el-icon-search"></i
                ></template>
                <template slot="append">
                    <el-button @click="getData(true)">查询</el-button>
                </template>
            </el-input>
        </div>
        <div class="table-box">
            <el-table :data="tableData" stripe height="a" highlight-current-row>
                <el-table-column
                    label="序号"
                    align="center"
                    width="60"
                    type="index"
                    fixed="left"
                    :index="indexMethod"
                >
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
                    :class-name="col.className"
                    align="center"
                    show-overflow-tooltip
                >
                </el-table-column>
                <el-table-column
                    label="预警周期"
                    min-width="300"
                    align="center"
                >
                    <template slot-scope="scope">
                        <p> {{ $changeDate(scope.row.startTime) + " - " + $changeDate(scope.row.endTime) }} </p>
                    </template>
                </el-table-column>
                <el-table-column
                    label="预警范围"
                    min-width="80"
                    align="center"
                >
                    <template slot-scope="scope">
                        <p>{{ scope.row.warningRange }}</p>
                    </template>
                </el-table-column>
                <el-table-column label="进度" width="250" align="center">
                    <template slot-scope="scope">
                        <div v-if="scope.row.projectStatus === 0">未启动</div>
                        <div v-else class="progress public-head-left">
                            <div class="progress-text">
                                {{ scope.row.progress }}
                            </div>
                            <div class="progress-bar">
                                <div class="progress-bar-outer">
                                    <div class="progress-bar-inner" :style="`width: ${scope.row.progress}`" ></div>
                                </div>
                            </div>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column
                    fixed="right"
                    align="center"
                    label="操作"
                    width="200"
                >
                    <template slot-scope="scope">
                        <div class="actionBox" style="">
                            <p class="btn-text btn-primary" @click="showInfo(scope.row.id)" > 查看 </p>
                            <p class="divider"></p>
                            <p class="btn-text btn-primary" @click="openEditModal(scope.row)" > 编辑 </p>
                            <p class="divider" v-show="scope.row.projectStatus === 0" ></p>
                            <p class="btn-text btn-error" @click="delProject(scope.row.id)" v-show="scope.row.projectStatus === 0" > 删除 </p>
                        </div>
                    </template>
                </el-table-column>
            </el-table>
        </div>
        <div class="page-box">
            <tablePage
                :isFixed="false"
                @getData="getData"
                ref="tablePage"
            ></tablePage>
        </div>
    </div>
</template>

<script>
import tablePage from "@/components/common/tablePage";
export default {
    name: "projectList",
    data() {
        return {
            content: "",
            tableHight: 300,
            tableData: [],
            columns: [
                {
                    id: "projectName",
                    label: "项目名称",
                    minWidth: "250",
                    fixed: "left",
                    className:"txt-left"
                },
                {
                    id: "projectTypeName",
                    label: "项目类型",
                    minWidth: "160",
                },
            ],
            currentRow:null
        };
    },
    components: {
        tablePage,
    },
    mounted() {
        this.getData();
    },
    activated() {
        this.getData();
        
    },
    methods: {
        indexMethod(index) {
            return (
                (this.$refs.tablePage.currenPage - 1) * this.$refs.tablePage.pageSize + index + 1
            );
        },
        getData(isOnePage,isMsg) {
            isOnePage && (this.$refs.tablePage.currenPage = 1);
            this.$api
                .getProjectList({
                    content: this.content,
                    page:  this.$refs.tablePage ?this.$refs.tablePage.currenPage:1,
                    limit: this.$refs.tablePage ? this.$refs.tablePage.pageSize :10,
                })
                .then((res) => {
                    if (res.code == 200) {
                        isMsg && this.$message({ message: "操作成功", type: "success"});
                        this.tableData = res.data;
                       try {
                           this.$refs.tablePage.total = res.paging.total;
                       } catch (error) {
                       }
                    } else {
                        this.$message({
                            message: res.description,
                            type: "error",
                        });
                    }
                });
        },
        showInfo(id) {
            this.$router.push({ name: "projectDetails", query: { id: id } });
        },
        // 删除项目
        delProject(id) {
            this.$confirm("确认删除当前项目", "提示", {
                confirmButtonText: "确定",
                cancelButtonText: "取消",
                type: "warning",
            })
                .then(() => {
                    this.$api.delProject(id).then((res) => {
                        if (res.code == 200) {
                            this.getData(0,1);
                        } else {
                            this.$message({ message: res.description, type: "error", });
                        }
                    });
                })
                .catch(() => {});
        },
        openEditModal(param) {
            this.$emit("openEditModal", param);
        },
       
    },
};
</script>

<style lang="stylus" scoped>
.table-box {
    height: calc(100% - 30px - 50px - 9px);
}

.table-box .el-table {
    height: 100% !important;
}

// 进度条的样式
.progress {
    .progress-bar {
        display: inline-block;
        width: 160px;
        margin-left: 15px;

        .progress-bar-outer {
            height: 10px;
            background: $sencondColor;
            position: relative;

            .progress-bar-inner {
                height: 100%;
                background: $themeColor;
                position: absolute;
                left: 0;
                top: 0;
            }
        }
    }
}

.progress-text {
    display: inline-block;
    width: 70px;
    text-align: right;
}

.divider {
    divider(14px, 2px, 0, 8px);
}

>>>.page-box .page.fixed-footer {
    right: vw(40);
    left: 'calc(200px + %s)' % vw(40);
}

.actionBox {
    text-align: left;
    // display inline-block
    padding-left: 20px;
}
// >>>.txt-left div {
//     text-align: left;
// }
</style>