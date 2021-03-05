<template>
    <div class="box-container list-scroll">
        <div class="box-content">
            <p class="font-bold">企业全称：{{ riskDetailData.companyName }}</p>
            <div class="wrapper-form">
                <div class="public-head-left">
                    <p class="form-lable">债务违约风险级别:</p>
                    <p class="form-text" :style="`color:${gradeColor[riskDetailData.grade]};font-weight:bold`">{{gradeList[riskDetailData.grade]}}</p>
                </div>
            </div>
            <div class="form-article" v-html="riskDetailData.targetReport"></div>
        </div>

        <div class="box-content">
            <p class="box-title">一、重点关注指标<my-qmark @click="modalType=2,modalVisibel=true"></my-qmark>
            </p>
            <el-radio-group v-model="radarPeriod" size="medium" @change="radioChange" style="margin-left: 30px;margin-top:12px">
                <el-radio-button :label="1">市属企业同期对比</el-radio-button>
                <el-radio-button :label="2">市属企业上期对比</el-radio-button>
            </el-radio-group>
            <!-- 同期对比雷达图 -->
            <div class="radar-div">
                <div class="radar-box" v-show="radarPeriod==1">
                    <div v-if="riskDetailData.defaultRiskRelateIndexVO && riskDetailData.defaultRiskRelateIndexVO.list && riskDetailData.defaultRiskRelateIndexVO.list[0] " id="radar-box-now"></div>
                    <p v-else class="nodata flex-center" id="radar-box-now"> <canvas></canvas> </p>
                </div>
                <!-- 往期对比雷达图 -->
                <div class="radar-box" v-show="radarPeriod==2">
                    <div v-if=" riskDetailData.defaultRiskRelateIndexVO && riskDetailData.defaultRiskRelateIndexVO.list && riskDetailData.defaultRiskRelateIndexVO.list[0] " id="radar-box-past"></div>
                    <p v-else class="nodata flex-center" id="radar-box-past"> <canvas></canvas> </p>
                </div>
                <div id="tip"> 提示 </div>
                <!-- 为了生成word中的图片 -->
                <div class="radar-box" v-show="false">
                    <div v-if=" riskDetailData.defaultRiskRelateIndexVO && riskDetailData.defaultRiskRelateIndexVO.list && riskDetailData.defaultRiskRelateIndexVO.list[0] " id="radar-box-now2"></div>
                    <p v-else class="nodata flex-center" id="radar-box-now2">
                        <canvas></canvas>
                    </p>
                </div>
                <div class="radar-box" v-show="false">
                    <div v-if=" riskDetailData.defaultRiskRelateIndexVO && riskDetailData.defaultRiskRelateIndexVO.list && riskDetailData.defaultRiskRelateIndexVO.list[0] " id="radar-box-past2"></div>
                    <p v-else class="nodata flex-center" id="radar-box-past2">
                        <canvas></canvas>
                    </p>
                </div>
            </div>
        </div>
        <div class="box-content">
            <div class="box-item">
                <p class="box-title">二、企业财务指标风险详情</p>
                <div class="public-from" style="padding: 10px 30px">
                    <el-table :data="tableData" height="a">
                        <el-table-column v-for="col in columns" :prop="col.id" :key="col.id" :type="col.type" :label="col.label" :width="col.width" :min-width="col.minWidth" :class-name="col.className" :fixed="col.fixed" align="center">
                        </el-table-column>
                        <el-table-column fixed="right" label="当前指标值" width="150" class-name="txt-right">
                            <template slot-scope="scope">
                                <el-input v-model="scope.row.targetValue" size="normal" v-show="isIndexEdit" @blur=" scope.row.targetValue = parseFloat( scope.row.targetValue ) " class="elinput"></el-input>
                                <span v-show="!isIndexEdit">{{ scope.row.targetValue }}</span>
                            </template>
                        </el-table-column>
                        <el-table-column fixed="right" label="风险" width="120" key="flag" class-name="txt-center">
                            <template slot-scope="scope">
                                <span class="is-circle tip tip-left" :class="'is-circle-' + scope.row.flag" :data-tip=" scope.row.flag == 'red' ? '比前50%分位较差' : '比前50%分位较优' "></span>
                            </template>
                        </el-table-column>
                    </el-table>
                </div>
            </div>
        </div>
        <!-- 债务违约风险说明 -->
        <my-dialog :visible.sync="modalVisibel" title="重点关注指标" :top="modalType==1?'13vh':'34vh'">
            <div class="des-text" v-show="modalType===2">
                <p>{{`市属企业同期对比：将预警公司本期各项财务指标与同期北京市国资委企业的财务指标的四分位数进行比较。
                    直观展示预警公司财务状况在北京市国资委企业中所处的位置。
                    各指标的四分位数会随着企业提交的报告数量的增加而进行更新。`}}</p>
                <br>
                <p>市属企业上期对比：将预警公司本期财务指标与市属企业2019年的财务指标中位数进行对比。</p>
            </div>
            <div class="des-text" v-show="modalType===1" v-html="riskDetailData.targetReport">
                <p v-if="!riskDetailData.targetReport">暂无说明</p>
            </div>
            <div slot="footer">
                <el-button type="primary"  @click="modalVisibel=false">关 闭</el-button>
                
            </div>
        </my-dialog>
    </div>
</template>

<script>
import echarts from "echarts";
import html2canvas from "html2canvas";
import axios from "axios";
export default {
    name: "riskDetails",
    data() {
        return {
            tableData: [],
            modalVisibel: false,
            modalType: 1, //1:债务违约风险,2:企业债务违约风险相关指标
            modalText: "",
            radorTab: "1",
            columns: [
                {
                    id: "targetCode",
                    label: "编号",
                    maxWidth: "105",
                },
                {
                    id: "targetTypeName",
                    label: "指标类",
                    maxWidth: "109",
                },
                {
                    id: "targetName",
                    label: "指标名称",
                    //   maxWidth: "232",
                    minWidth: "232",
                },
                {
                    id: "quartileValue",
                    label: "前50%分位",
                    mixWidth: "150",
                    className: "txt-right",
                },
            ],
            echartData: null,
            riskDetailData: {},
            indicatorNames: [], //雷达图指标值
            raderSeriesNames: [],
            raderSeriesNames2: [],
            raderSeriesData: [],
            raderSeriesData2: [],
            radarPeriod: 1,
            tendencyIDs: [],
            colors1: ["#4B95F3", "#67C139", "#EAA43D", "#ff7055"],
            colors2: ["#4B95F3", "#EAA43D"],
        };
    },
    props: ["isIndexEdit", "proUnitDataId", "projectId", "companyId","gradeColor","gradeList"],
    directives: {
        inputNum: {
            bind(el, binding, vnode) {
                function onInput(el, ele, binding, vnode) {
                    function handle() {
                        let val = ele.value;
                        val = val.replace(/[^\d.]/g, "");
                        const idx = val.indexOf(".");
                        if (!(idx === -1 || idx === val.length - 1)) {
                            val =
                                val.substr(0, idx) +
                                "." +
                                val.substr(idx + 1).replace(/\./g, "");
                        }
                        val = val.replace(/^\./g, "0.");

                        ele.value = val;
                    }

                    return handle;
                }
                const ele =
                    el.tagName === "INPUT" ? el : el.querySelector("input");

                ele.addEventListener(
                    "input",
                    onInput(el, ele, binding, vnode),
                    false
                );
            },
        },
    },
    created() {
        this.getriskDetails();
    },
    watch: {
    },

    mounted() {},
    methods: {
        initRader(radarId, sNames, sData, colors) {
            /**
             * sName:legend名称
             * sData：雷达图数据
             */
            if (this.indicatorNames.length == 0) {
                this.initCanvas(radarId);
                return;
            }

            let _this = this,
                maxData = [],
                minData=[];
            let radarBox = document.getElementById(radarId);
            const tip = document.getElementById("tip");
            let myChart = echarts.init(radarBox);
            //找出每一个指标的最大值
            // let maxData = _this.raderSeriesData.map((v) => Math.max(...v));
            // 对sdata进行数组的转置
            let newArray = sData[0].map(function (col, i) {
                return sData.map(function (row) {
                    return row[i];
                });
            });

            maxData=newArray.map((ele,index)=>Math.max(...ele))
            minData = newArray.map((ele,index)=>Math.min(...ele))

            let indicator = [];
          
            for (let i = 0; i < this.indicatorNames.length; i++) {
                indicator.push({ text: this.indicatorNames[i],max: maxData[i],min:minData[i]>0?minData[i]/2:(minData[i]===0?minData[i]-maxData[i]/2:minData[i]*2)});
            }
            let option = {
                backgroundColor: "#fff",
                legend: {
                    data: sNames,
                    type: "scroll",
                    icon: "circle",
                    right: "5",
                    top: "15",
                    itemGap: 9,
                    itemWidth: 10,
                    itemHeight: 10,
                    textStyle: {
                        fontSize: "12",
                        color: "#656565",
                    },
                    orient: "vertical",
                },

                radar: {
                    name: {
                        formatter: (text) => {
                            text = text.replace(/\S{11}/, function (match) {
                                return match + "\n";
                            });
                            return text;
                        },
                        textStyle: {
                            color: "#656565",
                            fontSize: 12,
                        },
                    },
                    center: ["35%", "50%"],
                    radius: "65%",
                    indicator,
                    // startAngle: 90,
                    // splitNumber: 4,
                    splitArea: {
                        areaStyle: {
                            color: ["transparent"],
                        },
                    },
                    // axisLabel: { show: true,color:"#000", },
                    axisLine: { show: true, lineStyle: { color: "#E7E7E7" } },
                    splitLine: {
                        show: true,
                        lineStyle: {
                            color: "#E7E7E7",
                        },
                    },
                },
                series: (function () {
                    let arrData = [];
                    let obj = {};
                    for (let i = 0; i < sData.length; i++) {
                        obj = {
                            name: sNames[i],
                            type: "radar",
                            symbol: "circle",
                            symbolSize: 6,
                            itemStyle: {
                                color: colors[i],
                            },
                            lineStyle: {
                                normal: {
                                    color: colors[i],
                                    width: 2,
                                },
                            },
                            data: [sData[i]],
                        };

                        arrData.push({ ...obj });
                    }
                    return arrData;
                })(),
            };
            myChart.setOption(option);
           
            let toolName = [..._this.indicatorNames].reverse();
            let i = toolName.pop();
            toolName.unshift(i);

            // 格式化tooltip需要的tendencyIDS
            let toolTendency = [..._this.tendencyIDs].reverse();
            i = toolTendency.pop();
            toolTendency.unshift(i);

            // 格式化tooltip需要的数据
            let toolData = _this.raderSeriesData.map((ele) => {
                let data = [...ele].reverse();
                let i = data.pop();
                data.unshift(i);
                return data;
            });
            let toolData2 = _this.raderSeriesData2.map((ele) => {
                let data = [...ele].reverse();
                let i = data.pop();
                data.unshift(i);
                return data;
            });
            const c = Math.PI * 2; //6.28
            const len = toolName.length;
            const ang = c / len; //单角的弧度
            const threshold = ang / len; //这个是什么东西
            const angs = [];
            toolName.forEach((ele, ind) => {
                let a = ang * ind - c / 4;
                if (a < 0) {
                    a += c;
                }
                angs[ind] = a;
            });
            myChart.on("mouseover", (param) => {
                tip.style.display = "none";

                const { clientWidth, clientHeight } = radarBox; //700,600
                // clientWidth=conetent+padding

                const cx = "35%";
                const cy = "50%";
                const cx2 = parseInt(cx) / 100; //0.5
                const cy2 = parseInt(cy) / 100; //0.6
                const cx3 = clientWidth * cx2; //350
                const cy3 = clientHeight * cy2; //360

                const {
                    event: { clientX, clientY },
                } = param.event;

                const { left, top } = radarBox.getBoundingClientRect();

                const x = clientX - left; //距离左边的距离
                const y = clientY - top; //距离上边距的距离
                const x2 = x - cx3; //距离圆心的水平边距
                const y2 = y - cy3; //距离圆心的垂直边距
                let angle = Math.atan2(y2, x2); //返回从原点(0,0)到(x,y)点的线段与x轴正方向之间的平面角度(弧度值)
                // 这个函数什么时候返回负数呢 ，以二维坐标轴为例，逆时针是正，顺时针是负的
                if (angle < 0) {
                    angle += c; //把他们转成2pi内的角度
                }

                let ind = 0;
                let num;
                for (num = 0; num < len; num++) {
                    if (Math.abs(angle - angs[num]) < threshold) {
                        ind = num;
                        break;
                    }
                }

                if (num === len && ind === 0) {
                    tip.style.display = "none";
                } else {
                    tip.style.display = "block";
                }
                if (_this.radarPeriod === 1) {
                    tip.innerHTML = `
                    <p>${toolName[ind]}</p>
                    <p><span class="span" style="display: inline-block;height: 12px;width: 12px;background: #4b95f3;border-radius: 6px;margin-right: 10px;"></span>${
                        _this.riskDetailData.companyName
                    }：${
                        toolTendency[ind] ? toolData[0][ind] : -toolData[0][ind]
                    }</p>
                    <p><span class="span" style="display: inline-block;height: 12px;width: 12px;background: #67c139;border-radius: 6px;margin-right: 10px;"></span>前25%分位：${
                        toolTendency[ind] ? toolData[1][ind] : -toolData[1][ind]
                    }</p>
                    <p><span class="span" style="display: inline-block;height: 12px;width: 12px;background: #eaa43d;border-radius: 6px;margin-right: 10px;"></span>前50%分位：${
                        toolTendency[ind] ? toolData[2][ind] : -toolData[2][ind]
                    }</p>
                    <p><span class="span" style="display: inline-block;height: 12px;width: 12px;background: #ff7055;border-radius: 6px;margin-right: 10px;"></span>前75%分位：${
                        toolTendency[ind] ? toolData[3][ind] : -toolData[3][ind]
                    }</p>
                 `;
                } else {
                    tip.innerHTML = `
                    <p>${toolName[ind]}</p>
                    <p><span class="span" style="display: inline-block;height: 12px;width: 12px;background: #4b95f3;border-radius: 6px;margin-right: 10px;"></span>${
                        _this.riskDetailData.companyName
                    }：${
                        toolTendency[ind]
                            ? toolData2[0][ind]
                            : -toolData2[0][ind]
                    }</p>
                    <p><span class="span" style="display: inline-block;height: 12px;width: 12px;background: #eaa43d;border-radius: 6px;margin-right: 10px;"></span>中位数：${
                        toolTendency[ind]
                            ? toolData2[1][ind]
                            : -toolData2[1][ind]
                    }</p>
                    `;
                }

                tip.style.left = `${x + 25}px`;
                tip.style.top = `${y - 25}px`;
            });

            const n = myChart.convertToPixel({ seriesIndex: 0 }, 1);
            window.onresize = function () {
                myChart.resize();
            };
        },
        getriskDetails(isRader) {
            this.$api
                .getRiskDetails({
                    projectId: this.projectId,
                    companyId: this.companyId,
                })
                .then((res) => {
                    if (res.code == 200) {
                        this.riskDetailData = res.data;
                        this.tableData = res.data.projectCompanyResultVOList;
                        this.fortmatEchrtData(this.riskDetailData);
                        isRader &&
                            this.$nextTick(() => {
                                this.initRader(
                                    "radar-box-now",
                                    this.raderSeriesNames,
                                    this.raderSeriesData,
                                    this.colors1
                                );
                                this.initRader(
                                    "radar-box-now2",
                                    this.raderSeriesNames,
                                    this.raderSeriesData,
                                    this.colors1
                                );

                                this.initRader(
                                    "radar-box-past",
                                    this.raderSeriesNames2,
                                    this.raderSeriesData2,
                                    this.colors2
                                );
                                this.initRader(
                                    "radar-box-past2",
                                    this.raderSeriesNames2,
                                    this.raderSeriesData2,
                                    this.colors2
                                );
                                // this.initRader("radar-box2");
                            });
                    } else {
                        this.$message({
                            message: res.description,
                            type: "error",
                        });
                    }
                });
        },
        // 格式化后端返回的雷达图数据，转换成雷达图需要的数据格式
        fortmatEchrtData(riskDetailData) {
            let curretValue = riskDetailData.defaultRiskRelateIndexVO.list; //当前公司的各项指标值
            let otherValue = Object.values(
                riskDetailData.defaultRiskRelateIndexVO.listMap
            ); //其他各分位指标值
            let pastList = riskDetailData.defaultRiskRelateIndexVO.pastList;
            this.raderSeriesData.length = 0;
            this.tendencyIDs.length = 0;
            // 当前公司的各项指标值作为第一个this.raderSeriesData
            this.tendencyIDs = curretValue.map((ele) => ele.tendencyId);
            this.indicatorNames = curretValue.map((ele) => ele.targetName); //从list中提取雷达图指标值
            this.raderSeriesData.push(
                curretValue.map((ele) =>
                    ele.tendencyId == 1 ? ele.targetValue : -ele.targetValue
                )
            );
            this.raderSeriesData2 = [...this.raderSeriesData];
            // 拼接其他指标选项
            this.raderSeriesData2.push(
                pastList.map((ele) =>
                    ele.tendencyId == 1 ? ele.targetValue : -ele.targetValue
                )
            );

            for (let i = 0; i < otherValue.length; i++) {
                this.raderSeriesData.push(
                    otherValue[i].map((ele) =>
                        ele.tendencyId == 1 ? ele.targetValue : -ele.targetValue
                    )
                );
            }

            this.raderSeriesNames = [
                riskDetailData.companyName.toString(),
                "前25%分位",
                "前50%分位",
                "前75%分位",
            ];
            this.raderSeriesNames2 = [
                riskDetailData.companyName.toString(),
                "中位数",
            ];
        },
        //保存信息
        updateTarget() {
            this.$api
                .updateTarge(this.projectId, this.tableData)
                .then((res) => {
                    if (res.code == 200) {
                        this.$emit("update:isIndexEdit", false); //直接修改父组件的isIndexEdit属性，和.sync配合使用
                        this.getriskDetails(true);
                    } else {
                        this.$message({
                            message: res.description,
                            type: "error",
                        });
                    }
                    this.$emit("update:isIndexEdit", false);
                });
        },
        targetAnalysis() {
            let param = new FormData();
            param.append("projectId", this.projectId);
            param.append("companyId", this.companyId);
            this.$emit("update:isIndexEdit", false);
            this.$emit("update:isTextEdit", false);
            this.$api.targetAnalysis(param);
            this.$router.push("/warnProgress");
        },
        exportReport() {
            let _this = this;
            let { projectId, companyId } = this;
            let canvasNow = document.querySelector("#radar-box-now2 canvas");
            let canvasPast = document.querySelector("#radar-box-past2 canvas");

            let that = this;
            let formData = new FormData();
            formData.append("projectId", projectId);
            formData.append("companyId", companyId);

            getReport();

            async function getReport() {
                let file1 = await _this.htmlToBlob(canvasNow);
                let file2 = await _this.htmlToBlob(canvasPast);
                formData.append("file1", file1);
                formData.append("file2", file2);
                axios({
                    method: "POST",
                    url: "/sasac/riskWarningReport/generateReport",
                    responseType: "blob",
                    data: formData,
                })
                    .then((res) => {
                        // console.log(res)
                        let blob = new Blob([res.data], {
                            type:
                                "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                        });
                        let eLink = document.createElement("a");
                        eLink.download = `${that.riskDetailData.companyName}.docx`;
                        eLink.style.display = "none";
                        eLink.href = URL.createObjectURL(blob);
                        document.body.appendChild(eLink);
                        eLink.click();
                        URL.revokeObjectURL(eLink.href);
                        document.body.removeChild(eLink);
                    })
                    .catch((err) => {});
            }
        },
        htmlToBlob(html) {
            return new Promise((resolve, reject) => {
                html
                    ? html.toBlob(function (blob) {
                          resolve(blob);
                      }, "image/png")
                    : reject();
            });
        },
        initCanvas(id) {
            let canvas = document.querySelector(`p#${id} canvas`);
            canvas.width = 900;
            canvas.height = 400;
            let ctx = canvas.getContext("2d");
            /*文字填充色*/
            ctx.fillStyle = "#1d1d1d";

            /*font：设置文本的字号、字体等属性*/
            ctx.font = "bold 16px arail";

            /*绘制文本*/
            ctx.fillText("暂无更多数据", 400, 180);
        },
        radioChange() {
            let tip = document.getElementById("tip");
            tip.style.display = "none";
        },
    },
};
</script>

<style lang="stylus" scoped>
.box-container {
    height: 100%;
    overflow: auto;
}

.box-title {
    font-size: 18px;
    padding: 10px 0;
}

.box-content {
    padding: 20px;
    background: #f4f5f9;
    position: relative;

    &:nth-child(2) {
        background: #fff;
        padding: 20px 0;
    }

    .font-bold {
        font-size: 16px;
        font-family: PINGFANG_BOLD;
    }

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

.radar-div {
    width: 1000px;
    height: 400px;
    margin: 0 auto;
    position: relative;

    .radar-box {
        width: 1000px;
        height: 400px;

        div {
            width: 1000px;
            height: 400px;
        }
    }
}

.public-from {
    .is-circle {
        display: inline-block;
        height: 14px;
        width: 14px;
        border-radius: 7px;
    }

    .is-circle-red {
        background: red;
    }

    .is-circle-green {
        background: green;
    }
}

.box-item {
    // height: 700px;
    div {
        box-sizing: border-box;

        >>>.el-table {
            max-height: 500px;
        }
    }
}

>>>.txt-right div {
    text-align: right;
}

>>>.txt-center div {
    text-align: center;
    overflow: visible;

    .tip:after {
        background-color: #fff;
        color: #000;
        border: 1px solid #000;
        padding: 2px 5px;
    }
}

>>>.elinput input {
    text-align: right;
}

.des-text {
    padding: 20px;
    font-size: 16px;
}

#tip {
    position: absolute;
    z-index: 20;
    background-color: rgba(0, 0, 0, 0.6);
    color: #fff;
    padding: 6px 12px;
    display: none;
}
.form-article{

    font-size:14px;
    line-height 2;
    margin-top 20px;
   
}
</style>