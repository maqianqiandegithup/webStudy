<template>
    <div class="container">
        <Header tilte-text="已汇总报表清单" isBack>
            <div slot="headerRight">
                  <el-dropdown :hide-on-click="false">
                    <el-button type="primary" size="small">导入</el-button>
                    <el-dropdown-menu slot="dropdown">
                        <el-dropdown-item @click.native="downloadExcel">下载模板
                            <!-- <a :href="'/sasac/excelCatalog/selectConfig?Token=' + upTokenCd"
                          > -->              
                            <!-- </a> -->
                        </el-dropdown-item>
                        <el-dropdown-item ><el-upload class="upload-demo" action="/sasac/excelCatalog/importExcel" :on-error="uploadError" :on-change="handleChange" multiple :headers="{ Token: upTokenCd }" :data="{ companyId, projectId }" :show-file-list="false" > 导入数据 </el-upload></el-dropdown-item >
                    </el-dropdown-menu>
                </el-dropdown>
            </div>
        </Header>
        <div class="public-box">
            <div class="title">
                <p class="box-title">单位名称：{{ companyName }}</p>
                <div class="flex-bet">
                    <el-input
                        v-model="searchContent"
                        style="width: 400px"
                        placeholder="报表名称"
                        class="search-input"
                        clearable
                        @clear="getReportList()"
                    >
                        <template slot="prepend"
                            ><i class="el-icon-search"></i
                        ></template>
                        <template slot="append">
                            <el-button @click="getReportList()">查询</el-button>
                        </template>
                    </el-input>
                    <span>共计：{{ excelNum }} 张</span>
                </div>
            </div>
            <div class="scroll-x">
                <div
                    class="list-box"
                    v-for="(item, index) in reportData"
                    :key="index"
                >
                    <p class="retile">{{ titileArr[index] }}</p>
                    <div class="url-list" :key="random">
                        <ul
                            v-for="(colItem, count) in countArr"
                            :key="count"
                            @click="viewExcel($event)"
                        >
                            <li
                                v-for="detailIndex in maxCount"
                                :key="detailIndex"
                            >
                                <p
                                    class="item-list"
                                    v-if="
                                        item[maxCount * count + detailIndex - 1]
                                    "
                                    :data-url="
                                        item[maxCount * count + detailIndex - 1]
                                            .excelHtmlUrl
                                    "
                                >
                                    {{ item[ maxCount * count + detailIndex - 1 ] && item[maxCount * count + detailIndex - 1] .catalog }}
                                </p>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
        </div>
        <my-dialog
            :visible.sync="modalVisible"
            :title="excelTitle"
            width="80%"
            top="5vh"
        >
            <div class="iframe">
                <iframe
                    :src="$zhengshiUrl + excelUrl"
                    frameborder="0"
                    width="100%"
                    height="100%"
                ></iframe>
            </div>
        </my-dialog>
    </div>
</template>

<script>
import axios from "axios";
export default {
    name: "reportList",
    data() {
        return {
            reportData: [],
            maxCount: 0,
            random: 0,
            modalVisible: false,
            proUnitDataId: null,
            projectId: null, //项目id
            companyId: null, //企业id
            companyName: "",
            searchContent: "", //搜索内容
            countArr: [], //统计每一类报表总共需要几列展示
            titileArr: [], //统计title
            upTokenCd: "",
            excelNum: 0,
            excelUrl: "",
            excelTitle: "",
            funcId: null,
        };
    },
    created() {
        this.proUnitDataId = this.$route.query.id;
        this.projectId = this.$route.query.projectId;
        this.companyId = this.$route.query.companyId;
        this.companyName = this.$route.query.companyName;
        this.upTokenCd = sessionStorage.getItem("Token");
        this.getReportList();
    },
    mounted() {
        this.funcId = this.$debounce(this.calReportColmn, 500);
        window.addEventListener("resize", this.funcId);
    },
    destroyed() {
        window.removeEventListener("resize", this.funcId);
    },
    methods: {
        calReportColmn() {
            if (this.excelNum == 0) return;
            let urlHeight = document.querySelector(".url-list").offsetHeight;
            this.maxCount = Math.floor(urlHeight / 36);
            this.countArr.length = 0;
            this.titileArr.length = 0;
            this.reportData.forEach((ele) => {
                this.countArr.push(Math.ceil(ele.length / this.maxCount));
                this.titileArr.push(ele[0].parentCatalog);
            });
            this.random = Math.random();
            // console.log(this.reportData,this.countArr,this.titileArr);
        },
        getReportList() {
            this.$api
                .getReportList({
                    companyId: this.companyId,
                    name: this.searchContent,
                    projectId: this.projectId,
                })
                .then((res) => {
                    if (res.code == 200) {
                        this.reportData = Object.values(res.data.excelCatalog);
                        this.excelNum = res.data.dataNum;
                        this.$nextTick((res) => {
                            this.calReportColmn();
                        });
                    } else {
                        this.$message({
                            message: res.description,
                            type: "error",
                        });
                    }
                });
        },
        downloadExcel() {
            axios({
                method: "GET",
                url: "/sasac/excelCatalog/selectConfig",
                // headers:{'token':2},
                responseType: "blob",
            })
                .then((res) => {
                    let blob = new Blob([res.data], {
                        type: "application/vnd.ms-excel",
                    });
                    let eLink = document.createElement("a");
                    eLink.download = "国资委报表模板.xlsx";
                    eLink.style.display = "none";
                    eLink.href = URL.createObjectURL(blob);
                    document.body.appendChild(eLink);
                    eLink.click();
                    URL.revokeObjectURL(eLink.href);
                    document.body.removeChild(eLink);
                })
                .catch((err) => {});
        },
        uploadSuccess(res, file, fileList) {
            if (res.code == 200) {
                this.$message({ message: "操作成功", type: "success" });
                this.$router.push({
                    path: "/warnProgress",
                    params: { msg: res.description },
                });
            } else {
                this.$message({ message: res.description, type: "error" });
            }
        },
        handleChange() {
            console.log(1)
            this.$router.push({ path: "/warnProgress" });
        },
        uploadError(err, file, fileList) {
            this.$message({ message: res, type: "error" });
        },

        viewExcel(e) {
            let target = e.target;
            if (target.nodeName.toLowerCase() == "p") {
                this.modalVisible = true;
                this.excelUrl = target.dataset.url;
                this.excelTitle = target.innerText;
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

.box-title {
    font-size: 16px;
    display: inline-block;
}

.search-input {
    padding: 20px 0;
}

.scroll-x {
    overflow-x: auto;
    padding: 20px;
    border: 1px solid #bfbfbf;
    box-sizing: border-box;
    height: calc(100% - 92px);
    display: flex;

    .list-box {
        .retile {
            font-size: 16px;
            font-family: PINGFANG_BOLD;
        }

        height: 100%;

        .url-list {
            padding-top: 15px;
            height: calc(100% - 25px);
            // overflow hidden
            display: flex;

            ul {
                padding: 0;
                // display inline-flex
                height: 100%;
            }

            li {
                list-style-type: none;
            }

            .item-list {
                padding: 8px 40px 8px 9px;
                cursor: pointer;
                border-radius: 2px;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;

                // font-family:PINGFANG_MEDIUM;
                &:hover {
                    color: $themeColor;
                    background: #f5f7fa;
                }
            }
        }

        margin-right: 40px;
    }
}

.iframe {
    height: 80vh;
}

</style>