import echarts from 'echarts'

export default {
    initRader(areaId,indicatorNames, seriesNames, seriesData) {
        /**
         * @param {String} areaId 雷达图各个区域的id图
         * @param {Array} indicatorNames 雷达图各个指标名称
         * @param {Array} seriesNames 图例名称，雷达图的系列名称
         * @param {Array} seriesData 每个系统对应的数据
         * 
        */
        let myChart = echarts.init(document.getElementById(areaId));
        let colors=['#4B95F3','#67C139','#EAA43D','#ff7055']
        let indicator = [];
        for (let i = 0; i < indicatorNames.length; i++) {
            indicator.push({
                name: indicatorNames[i],
                // max: datamax[i],
            });
        }
        console.log(indicator)
        let option = {
            backgroundColor: "#fff",
            tooltip: {
                show: true,
                trigger: "item",
            },
            legend: {
                data: seriesNames,
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
                center: ["50%", "60%"],
                radius: "65%",
                startAngle: 90,
                splitNumber: 4,
                splitArea: {
                    areaStyle: {
                        color: ["transparent"],
                    },
                },
                axisLabel: {
                    show: false,
                },
                axisLine: {
                    show: true,
                    lineStyle: {
                        color: "#E7E7E7",
                    },
                },
                splitLine: {
                    show: true,
                    lineStyle: {
                        color: "#E7E7E7",
                    },
                },
                name: {
                    formatter: "{value}",
                    textStyle: {
                        color: "#656565",
                        fontSize: 12,
                    },
                },
                indicator: indicator,
            },
            series: (function () {
                let arrData = [];
                let obj = {};
                for (let i = 0; i < seriesData.length; i++) {
                    obj = {
                        name: seriesNames[i],
                        type: "radar",
                        symbol: "circle",
                        symbolSize: 6,
                        areaStyle: {
                            normal: {
                                color: "rgba(170, 216, 255, 0.18)",
                            },
                        },
                        itemStyle: {
                            color: colors[i],
                        },
                        lineStyle: {
                            normal: {
                                color: colors[i],
                                width: 2,
                            },
                        },
                        data: [seriesData[i]],
                    };

                    arrData.push({...obj});
                }
                console.log(arrData)
                return arrData
            })()
        };
        myChart.setOption(option);
        window.onresize = function () {
            myChart.resize();
        };
    },
}