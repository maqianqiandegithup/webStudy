<template>
  <div class="container flex-start" :key="random" v-loading="loading">
    <div class="header flex-bet">
      <div class="flex-start">
        <span>{{date[1]}}</span>
        <div>
          <p>{{date[0]}}</p>
          <p>{{date[2]}}</p>
        </div>
      </div>
      <div class="enter" @click="goLink('warnProgress')"></div>
    </div>
    <div class="content flex-start">
      <p>{{projectName}}</p>
      <div class="flex-start">
        <div class="slider-left">
          <div>
            <div class="title">
              <span><u>当前项目进度</u></span>
            </div>
            <div class="stop flex-bet">
              <div>
                <div ref="speed_1"></div>
                <p>报表未汇总</p>
              </div>
              <div>
                <div ref="speed_2"></div>
                <p>报表已汇总</p>
              </div>
              <div>
                <div ref="speed_3"></div>
                <p>完成汇总</p>
              </div>
              <div>
                <div ref="speed_4"></div>
                <p>形成报告</p>
              </div>
            </div>
          </div>
          <div class="flex-start flex-column">
            <div class="title">
              <span><u>风险预警企业TOP10</u></span>
            </div>
            <ul class="rank" v-if="data.topTen&&data.topTen.length>0">
              <li v-for="(item,index) in data.topTen" :key="'rank'+index"><span>{{index+1}}</span>{{item.companyName}}</li>
            </ul>
            <p v-else class="nodata flex-center">暂无更多数据</p>
          </div>
        </div>
        <div class="slider-center">
          <div @click="goLink('warnProgress',{'grade':3})">
            <p>{{data.highRiskNum||0}}</p>
            <span>高风险</span>
          </div>
          <div @click="goLink('warnProgress',{'grade':2})">
            <p>{{data.midRiskNum||0}}</p>
            <span>中风险</span>
          </div>
          <div @click="goLink('warnProgress',{'grade':1})">
            <p>{{data.lowRiskNum||0}}</p>
            <span>低风险</span>
          </div>
          <div @click="goLink('warnProgress',{'grade':0})">
            <p>{{data.noRiskNum||0}}</p>
            <span>无风险</span>
          </div>
        </div>
        <div class="slider-right">
          <div class="flex-bet flex-column">
            <div class="title">
              <span><u>企业财务风险分布</u></span>
            </div>
            <div ref="echarts_distribution"></div>
          </div>
          <div class="flex-bet flex-column" style="position:relative">
              <div id="tip" ref="tipRadar"> 提示 </div>
            <div class="title">
              <span><u>重点关注指标</u></span>
            </div>
            <div v-if="data.targetResult&&data.targetResult[0]" ref="echarts_index" ></div>
            <p v-else class="nodata flex-center">暂无更多数据</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import echarts from "echarts";
import "echarts-gl";
export default {
  data() {
    return {
      loading: true,
      data: {},
      projectName: null,
      date: [],
      time: null,
      timer: null,
      loadTimes: null,
      resizeTimes: null,
      random: 1,
      indicatorLength:[],
      indicatorName:[]
    };
  },
  mounted() {
    this.getData();
    this.getTime();
    window.onresize=this.reload(()=>{
      this.random = Math.random();
      this.$nextTick(()=>{this.mapEcharts(this.data)});
    }, 100, true);
  },
  methods: {
    goLink(path,query){
      this.$router.push({
        name:path,
        params: query
      })
    },
    getRealpx(px){
      return (px / 1920) * document.body.clientWidth;
    },
    getData(){
      !this.projectName&&(this.loading=true);
      this.time&&clearTimeout(this.time);
      this.time=null;
      this.$api.riskWarningExec().then(res=>{
        if(res.code==200){
          this.data=res.data;
          res.data.projectInfo&&(this.projectName=res.data.projectInfo.projectName);
          setTimeout(()=>{
            this.mapEcharts(res.data);
            this.$nextTick(()=>{
              clearTimeout(this.loadTimes);
              this.loading=false
            });
            this.time=setTimeout(() => {
              this.getData();
            }, 10 * 60 * 1000);
          },1)
        }else{
          this.loading=false;
          this.$message.error(res.description);
        }
      })
    },
    mapEcharts(data) {
      let _this=this;
      _this.loadTimes&&clearTimeout(_this.loadTimes);
      _this.loadTimes=setTimeout(()=>{
        _this.loading&&(_this.loading=false);
      }, 6e3)
      // 当前项目进度
      if(data.currentProgress){
        let echarts_stop_1 = echarts.init(this.$refs.speed_1);
        echarts_stop_1.setOption(
          this.getOption(data.currentProgress.schedules[0].makeUpNumber, ["#ebd885", "#da9f17"], data.currentProgress.schedules[0].number+"/"+data.currentProgress.companyTotal, {
            color: "#f9c748",
            sColor: "#c7ef3c"
          })
        );
        let echarts_stop_2 = echarts.init(this.$refs.speed_2);
        echarts_stop_2.setOption(
          this.getOption(data.currentProgress.schedules[1].makeUpNumber, ["#0da6d8", "#25e8e7"], data.currentProgress.schedules[1].number+"/"+data.currentProgress.companyTotal, {
            color: "#47ffec",
            sColor: "#00FFB4"
          })
        );
        let echarts_stop_3 = echarts.init(this.$refs.speed_3);
        echarts_stop_3.setOption(
          this.getOption(data.currentProgress.schedules[2].makeUpNumber, ["#0da6d8", "#25e8e7"], data.currentProgress.schedules[2].number+"/"+data.currentProgress.companyTotal, {
            color: "#47ffec",
            sColor: "#00FFB4"
          })
        );
        let echarts_stop_4 = echarts.init(this.$refs.speed_4);
        echarts_stop_4.setOption(
          this.getOption(data.currentProgress.schedules[3].makeUpNumber, ["#0da6d8", "#25e8e7"], data.currentProgress.schedules[3].number+"/"+data.currentProgress.companyTotal, {
            color: "#47ffec",
            sColor: "#00FFB4"
          })
        );
      }

      // 企业财务风险分布
      if(data.highRiskPercent!==null&&data.midRiskPercent!==null&&data.lowRiskPercent!==null&&data.noRiskPercent!==null){
        let echarts_distribution = echarts.init(this.$refs.echarts_distribution);
        function getParametricEquation(
          startRatio,
          endRatio,
          isSelected,
          isHovered,
          k,
          height
        ) {
          // 计算
          let midRatio = (startRatio + endRatio) / 2;

          let startRadian = startRatio * Math.PI * 2;
          let endRadian = endRatio * Math.PI * 2;
          let midRadian = midRatio * Math.PI * 2;

          // 如果只有一个扇形，则不实现选中效果。
          if (startRatio === 0 && endRatio === 1) {
            isSelected = false;
          }

          // 通过扇形内径/外径的值，换算出辅助参数 k（默认值 1/3）
          k = typeof k !== "undefined" ? k : 1 / 3;

          // 计算选中效果分别在 x 轴、y 轴方向上的位移（未选中，则位移均为 0）
          let offsetX = isSelected ? Math.cos(midRadian) * 0.1 : 0;
          let offsetY = isSelected ? Math.sin(midRadian) * 0.1 : 0;

          // 计算高亮效果的放大比例（未高亮，则比例为 1）
          let hoverRate = isHovered ? 1.05 : 1;

          // 返回曲面参数方程
          return {
            u: {
              min: -Math.PI,
              max: Math.PI * 3,
              step: Math.PI / 32
            },

            v: {
              min: 0,
              max: Math.PI * 2,
              step: Math.PI / 20
            },

            x: function(u, v) {
              if (u < startRadian) {
                return (
                  offsetX +
                  Math.cos(startRadian) * (1 + Math.cos(v) * k) * hoverRate
                );
              }
              if (u > endRadian) {
                return (
                  offsetX +
                  Math.cos(endRadian) * (1 + Math.cos(v) * k) * hoverRate
                );
              }
              return offsetX + Math.cos(u) * (1 + Math.cos(v) * k) * hoverRate;
            },

            y: function(u, v) {
              if (u < startRadian) {
                return (
                  offsetY +
                  Math.sin(startRadian) * (1 + Math.cos(v) * k) * hoverRate
                );
              }
              if (u > endRadian) {
                return (
                  offsetY +
                  Math.sin(endRadian) * (1 + Math.cos(v) * k) * hoverRate
                );
              }
              return offsetY + Math.sin(u) * (1 + Math.cos(v) * k) * hoverRate;
            },

            z: function(u, v) {
              if (u < -Math.PI * 0.5) {
                return Math.sin(u);
              }
              if (u > Math.PI * 2.5) {
                return Math.sin(u);
              }
              return Math.sin(v) > 0 ? 1 * height : -1;
            }
          };
        }
        // 生成模拟 3D 饼图的配置项
        function getPie3D(pieData, internalDiameterRatio) {
          let series = [];
          let sumValue = 0;
          let startValue = 0;
          let endValue = 0;
          let legendData = [];
          let k =
            typeof internalDiameterRatio !== "undefined"
              ? (1 - internalDiameterRatio) / (1 + internalDiameterRatio)
              : 1 / 3;
          // 为每一个饼图数据，生成一个 series-surface 配置
          for (let i = 0; i < pieData.length; i++) {
            sumValue += pieData[i].value;
            let seriesItem = {
              name:
                typeof pieData[i].name === "undefined"
                  ? `series${i}`
                  : pieData[i].name,
              type: "surface",
              parametric: true,
              wireframe: {
                show: false
              },
              pieData: pieData[i],
              pieStatus: {
                selected: false,
                hovered: false,
                k: k
              },
              label: {
                show: true
              }
            };
            if (typeof pieData[i].itemStyle != "undefined") {
              let itemStyle = {
              };
              typeof pieData[i].itemStyle.color != "undefined"
                ? (itemStyle.color = pieData[i].itemStyle.color)
                : null;
              typeof pieData[i].itemStyle.opacity != "undefined"
                ? (itemStyle.opacity = pieData[i].itemStyle.opacity)
                : null;
              seriesItem.itemStyle = itemStyle;
            }
            series.push(seriesItem);
          }
          // 使用上一次遍历时，计算出的数据和 sumValue，调用 getParametricEquation 函数，
          // 向每个 series-surface 传入不同的参数方程 series-surface.parametricEquation，也就是实现每一个扇形。
          for (let i = 0; i < series.length; i++) {
            endValue = startValue + series[i].pieData.value;
            series[i].pieData.startRatio = startValue / sumValue;
            series[i].pieData.endRatio = endValue / sumValue;
            series[i].parametricEquation = getParametricEquation(
              series[i].pieData.startRatio,
              series[i].pieData.endRatio,
              false,
              false,
              k,
              series[i].pieData.value
            );
            startValue = endValue;
            legendData.push(series[i].name);
          }
          // 准备待返回的配置项，把准备好的 legendData、series 传入。
          let option = {
            tooltip: {
              formatter: params => {
                if (params.seriesName !== "mouseoutSeries") {
                  return `${
                    params.seriesName
                  }<br/><span style="display:inline-block;margin-right:5px;border-radius:10px;width:10px;height:10px;background-color:${
                    params.color
                  };"></span>${option.series[params.seriesIndex].pieData.value}%`;
                }
              }
            },
            legend: {
              orient: "vertical",
              data: legendData,
              itemWidth: _this.getRealpx(14),
              itemHeight: _this.getRealpx(14),
              itemGap: _this.getRealpx(21),
              top: _this.getRealpx(20),
              right: _this.getRealpx(16),
              textStyle: {
                color: "#fff",
                fontSize: _this.getRealpx(12)
              }
            },
            xAxis3D: {
              min: -1,
              max: 1
            },
            yAxis3D: {
              min: -1,
              max: 1
            },
            zAxis3D: {
              min: -1,
              max: 1
            },
            grid3D: {
              show: false,
              boxHeight: 1,
              bottom: "30",
              viewControl: {
                distance: 300,
                alpha: 25,
                beta: 130
              }
            },
            series: series
          };
          return option;
        }
        // console.log(typeof(data.noRiskPercent))
        let arr = [
            
          // {
          //   name: "无风险 " + data.noRiskPercent +"%",
          //   value: data.noRiskPercent,
          //   itemStyle: {
          //     opacity: 0.8,
          //     color: "#0072d3"
          //   }
          // },
          // {
          //   name: "债务违约风险 " + data.riskPercent +"%",
          //   value: data.riskPercent,
          //   itemStyle: {
          //     opacity: 0.8,
          //     color: "#c29a42"
          //   }
          // }
          {
            name: "高风险 " + data.highRiskPercent +"%",
            value: data.highRiskPercent,
            itemStyle: {
              opacity: 0.8,
              color: "#e16757"
            }
          },
          {
            name: "中风险 " + data.midRiskPercent +"%",
            value: data.midRiskPercent,
            itemStyle: {
              opacity: 0.8,
              color: "#e3935d"
            }
          },
          {
            name: "低风险 " + data.lowRiskPercent +"%",
            value: data.lowRiskPercent,
            itemStyle: {
              opacity: 0.8,
              color: "#eecb5f"
            }
          },
          {
            name: "无风险 " + data.noRiskPercent +"%",
            value: data.noRiskPercent,
            itemStyle: {
              opacity: 0.8,
              color: "#7ecf51"
            }
          }
        ];
        echarts_distribution.setOption(getPie3D(arr, 2));
      }
      
      // 重点关注指标
      if(data.targetResult&&data.targetResult[0]&&this.$refs.echarts_index){
          let radarBox = this.$refs.echarts_index
        let echarts_index = echarts.init(this.$refs.echarts_index);
        console.dir(this.$refs.echarts_index)
        this.indicatorLength= data.targetResult&&data.targetResult["0"]&&data.targetResult[0].length
        this.indicatorName = data.targetResult&&data.targetResult["0"]&&data.targetResult[0].map(res=> res.targetName);
        let index_title=[
          {name:"前25%分位",color:[75,149,243]}, 
          {name:"前50%分位",color:[52,246,145]},
          {name:"前75%分位",color:[178,136,54]}
        ];
        let echarts_index_opt = {
          color: ["#b28836"],
          legend: {
            orient: "vertical",
            icon: "circle", //图例形状
            data: index_title.map(res=>{return res.name}),
            top: _this.getRealpx(20),
            right: _this.getRealpx(16),
            itemWidth: _this.getRealpx(14),
            itemHeight: _this.getRealpx(14),
            itemGap: _this.getRealpx(21),
            textStyle: {
              fontSize: _this.getRealpx(12),
              color: "#fff"
            }
          },
          radar: {
            name: {
              textStyle: {
                lineHeight:  _this.getRealpx(18),
                color: "#fff",
                fontSize: _this.getRealpx(14)
              },
              formatter: (text) => {
                  text = text.replace(/\S{7}/g, function(match) {
                      return match + '\n'
                  })
                  return text
              }
            },
            center: ["50%","50%"],
            radius: "60%",
            indicator: data.targetResult&&data.targetResult["0"]&&data.targetResult[0].map(res=>{
              return {
                text: res.targetName
              }
            }),
            splitArea: {
              show: true,
              areaStyle: {
                color: ["rgba(255,255,255,0)", "rgba(255,255,255,0)"]
              }
            },
            axisLine: {
              lineStyle: {
                color: "#486b87"
              }
            },
            splitLine: {
              lineStyle: {
                color: "#486b87",
                width: 1
              } }
          },
          tooltip: {
            show: true,
            trigger: "item"
          },
          series: [
            {
              type: "radar",
              symbolSize: 8,
              data: index_title.map((item,index)=>{
                return {
                  value: data.targetResult&&data.targetResult["0"]&&data.targetResult[index].map(res=>{ return (res.tendencyId==1?res.targetValue:-res.targetValue)||0 }),
                  name:item.name,
                  tooltip:{
                    //   show:false,
                    formatter:(params)=>{
                      let arr=data.targetResult[0].map(res=>{ return {targetName:res.targetName,tendencyId:res.tendencyId} })
                      let str=item.name+"<br/>"+params.value.map((itm,idx)=>{ return arr[idx].targetName+" : "+(arr[idx].tendencyId==1?itm:-itm)+"<br/>" });
                      return str.replace(/,/g,"")
                    }
                  },
                  itemStyle:{
                    "color": "rgb("+item.color.toString()+")"
                  },
                  areaStyle: {
                    normal: {
                      color: {
                        type: "radial",
                        colorStops: [
                          {
                            offset: 0,
                            color: "rgba("+item.color.toString()+",.7)"
                          },
                          {
                            offset: 0,
                            color: "rgba(0,0,0,0)"
                          },
                          {
                            offset: 1,
                            color: "rgba("+item.color.toString()+",.7)"
                          },
                        ],
                        globalCoord: false
                      },
                      opacity: 1 // 区域透明度
                    }
                  },
                  lineStyle: {
                      "normal": {
                          "color": "rgb(178,136,54)",
                          "width": 2
                      }
                  }
                }
              })
            }
          ]
        };
        data.targetResult&&data.targetResult["0"]&&echarts_index.setOption(echarts_index_opt);
        // radarBox.onmousemove=this.mousemove
      }
    },
    getTime() {
      this.timer&&clearTimeout(this.timer);
      this.timer=null;
      var vWeek = [
          "星期天",
          "星期一",
          "星期二",
          "星期三",
          "星期四",
          "星期五",
          "星期六"
        ],
        date = new Date(),
        year = date.getFullYear(),
        month = date.getMonth() + 1,
        day = date.getDate(),
        hours = date.getHours(),
        minutes = date.getMinutes(),
        seconds = date.getSeconds(),
        vWeek_s = date.getDay();
      this.date = [
        year +
          "年" +
          (month < 10 ? "0" + month : month) +
          "月" +
          (day < 10 ? "0" + day : day) +
          "日",
        (hours < 10 ? "0" + hours : hours) +
          ":" +
          (minutes < 10 ? "0" + minutes : minutes) +
          ":" +
          (seconds < 10 ? "0" + seconds : seconds),
        vWeek[vWeek_s]
      ];
      this.timer=setTimeout(() => { this.getTime(); }, 1000);
    },
    reload(func, threshold, execAsap) {
      return function debounced () {
          var obj = this, args = arguments;
          function delayed () {
              if (!execAsap)
              func.apply(obj, args);
              this.resizeTimes = null;
          };
          if (this.resizeTimes)
              clearTimeout(this.resizeTimes);
          else if (execAsap)
              func.apply(obj, args);
          this.resizeTimes = setTimeout(delayed, threshold || 100);
      };
    },
    getOption(speed, color, num, shadow) {
      let _this=this;
      return {
        title: [
          {
            text: "{blue|" + speed + "}{red|%}",
            x: "center",
            y: "center",
            textStyle: {
              rich: {
                blue: {
                  fontWeight: "600",
                  fontSize: _this.getRealpx(28),
                  color: color[1]
                },
                red: {
                  fontSize: _this.getRealpx(12),
                  padding: [_this.getRealpx(-4), 0, 0, 2],
                  color: color[1]
                }
              }
            }
          }
        ],
        angleAxis: {
          show: false,
          max: (100 * 360) / 250,
          type: "value",
          startAngle: 215,
          endAngle: -35,
          splitLine: {
            show: false
          }
        },
        barMaxWidth: _this.getRealpx(6),
        radiusAxis: {
          show: false,
          type: "category"
        },
        polar: {
          center: ["50%", "50%"],
          radius: "144%"
        },
        series: [
          {
            type: "bar",
            data: [
              {
                value: speed,
                itemStyle: {
                  color: {
                    type: "bar",
                    colorStops: [
                      {
                        offset: 0,
                        color: color[0]
                      },
                      {
                        offset: 1,
                        color: color[1]
                      }
                    ]
                  }
                }
              }
            ],
            barGap: "-100%",
            coordinateSystem: "polar",
            roundCap: true,
            z: 2
          },
          {
            type: "bar",
            data: [
              {
                value: 100,
                itemStyle: {
                  color: "#2f5571"
                }
              }
            ],
            barGap: "-100%",
            coordinateSystem: "polar",
            roundCap: true,
            z: 1
          },
          {
            name: "AQI",
            type: "gauge",
            startAngle: 225,
            endAngle: -45,
            axisLine: {
              show: false
            },
            splitLine: {
              show: false
            },
            axisTick: {
              show: false
            },
            axisLabel: {
              show: false
            },
            splitLabel: {
              show: false
            },
            pointer: {
              show: false
            },
            detail: {
              formatter: function(e) {
                return num;
              },
              color: "#fff",
              offsetCenter: [0, "80%"],
              fontSize: _this.getRealpx(12)
            }
          },
          {
            type: "pie",
            radius: ["72%", "60%"],
            hoverAnimation: false,
            startAngle: 215,
            endAngle: -35,
            data: [
              {
                name: "",
                value: speed / 124,
                label: {
                  show: false
                },
                labelLine: {
                  show: false
                },
                itemStyle: {
                  color: "rgba(0,0,0,0)"
                }
              },
              {
                name: "",
                value: 0,
                label: {
                  position: "inside",
                  backgroundColor: shadow.color,
                  borderRadius: _this.getRealpx(6),
                  padding: _this.getRealpx(6),
                  borderWidth: 0,
                  borderColor: "blue",
                  shadowBlur: _this.getRealpx(10),
                  shadowColor: shadow.sColor
                },
              },
              {
                name: "",
                value: 1.31 - speed / 100,
                label: {
                  show: false
                },
                labelLine: {
                  show: false
                },
                itemStyle: {
                  color: "rgba(255,255,255,0)"
                }
              }
            ]
          }
        ]
      };
    },
    mousemove(event){
    //   以画布左上角为原点
    //   获取圆心的位置坐标
    let radarBox=this.$refs.echarts_index
    let tipRadar = this.$refs.tipRadar

     let { clientWidth, clientHeight } = radarBox
     
     let cx=clientWidth*0.5,cy=clientHeight*0.5
     let radarRaius = Math.min(clientWidth,clientHeight)*0.4
    //  获取鼠标的坐标
    const {left,top}=radarBox.getBoundingClientRect()
    let  {clientX, clientY} = event;
    let mouseX = clientX-left,mouseY = clientY-top;
    // 鼠标点距离圆心的向量
    let x2=mouseX-cx,y2=mouseY-cy
    // 如果鼠标点距离圆心的距离大于雷达图半径，则返回不执行函数
    let radius =parseFloat(Math.sqrt(Math.pow(x2,2)+Math.pow(y2,2)).toFixed(3))
   
    if((radius-radarRaius)>0.1)
    { 
         tipRadar.style.opacity = 0;
        return}
    else{
         console.log(radius,radarRaius)
         console.log(radius-radarRaius)
        let len = this.indicatorLength
        let ang=Math.PI*2/len
        let threshold = ang/len
        // 计算每个指标轴相对于圆心的夹角【注意是顺时针夹角，使用canvas标准坐标轴】
        let angs=[]
        for(let i=0;i<len;i++){
            let a=ang*i-Math.PI/2
            a<0&&(a=a+Math.PI*2)
            angs.push(a)
        }
        // 计算鼠标与x轴正方向的夹角,atan2 方法返回一个 -pi 到 pi 之间的数值
        let angMouse=Math.atan2(y2,x2)
         
        angMouse<0&&(angMouse=angMouse+(Math.PI*2))
        // 循环遍历，看看那个坐标轴距离鼠标的角度小于threshold
        // ind记录那个符合条件的坐标轴位置
        let ind =-1
       
        for(let i=0;i<angs.length;i++){
            if(Math.abs(angMouse-angs[i])<threshold){
                ind = i
                break
            }
        }
        console.log(ind)
        if(ind>-1){
            
         tipRadar.style.opacity = 1;
        tipRadar.innerHTML = `
                    <p>${this.indicatorName[ind]}</p>
                   
                    <p><span class="span" style="display: inline-block;height: 12px;width: 12px;background: #67c139;border-radius: 6px;margin-right: 10px;"></span>前25%分位：
                    </p>
                    <p><span class="span" style="display: inline-block;height: 12px;width: 12px;background: #eaa43d;border-radius: 6px;margin-right: 10px;"></span>前50%分位：
                    </p>
                    <p><span class="span" style="display: inline-block;height: 12px;width: 12px;background: #ff7055;border-radius: 6px;margin-right: 10px;"></span>前75%分位：
                    </p>`
       
        }
       tipRadar.style.left = `${mouseX - 125}px`;
    tipRadar.style.top = `${mouseY - 35}px`;
        
    }
    }
  },
  beforeDestroy() {
    window.onresize=null;
  }
};
</script>

<style lang="stylus" scoped>
span, p, div {
  font-size: vw(14);
  user-select: none;
}

.container {
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: url('../../assets/imgs/large-imgs/bg.png') no-repeat center / cover;
  box-sizing: border-box;
  flex-direction: column;

  .header {
    background: url('../../assets/imgs/large-imgs/bg_title.png') no-repeat center / 100%;
    height: vh(74);
    color: #44c9fb;
    padding: 0 vw(30);
    box-sizing: border-box;
    flex-shrink: 0;
    width: 100%;

    span {
      font-size: vw(36);
      margin-right: vw(12);
    }

    .enter {
      width: vw(208);
      height: vh(56);
      background: url('../../assets/imgs/large-imgs/into_system.png') no-repeat center / 100%;
      cursor: pointer;
    }
  }

  .content {
    width: 100%;
    box-sizing: border-box;
    padding: 0 vw(36) vw(44);
    align-items: flex-start;
    flex-wrap: wrap;
    flex-grow: 1;
    flex-direction: column;

    > p {
      flex-shrink: 0;
      width: 100%;
      height: vh(48);
      line-height: 2.2;
      font-size: vw(24);
      font-weight: 900;
      color: #fff;
    }

    > .flex-start {
      width: 100%;
      flex-grow: 1;
      align-items: flex-start;
      justify-content: space-between;
    }

    > .flex-start > div {
      height: 100%;
      align-items: flex-start;
      display: flex;

      &.slider-left {
        width: vw(502);
        flex-direction: column;

        > div:first-child {
          height: vh(280);
        }

        > div:last-child {
          height: vh(600);
        }
      }

      &.slider-center {
        width: vw(700);
        // width: vw(676);

        > div {
          cursor: pointer;
          margin: vw(58) 0 0 !important;
          // margin: vw(68) 0 0 !important;
          width: vw(310) !important;
          flex-grow: 0 !important;
          flex-basis: unset !important;
          height: vh(188);
          // height: vh(166);
        }
      }

      &.slider-right {
        width: vw(506);
        flex-direction: column;

        > div {
          height: 50%;

          .title + div {
            width: 100%;
            -webkit-flex: 1;
            flex: 1;
          }
        }
      }

      > div {
        width: 100%;
        background-color: #00bcff14;
        background-repeat: no-repeat;

        &:first-child {
          margin-bottom: vw(24);
        }

        .title {
          color: #fff;
          font-weight: 900;
          height: vh(64);
          width: 100%;
          display: flex;
          align-items: center;
          padding: 0 vw(16);
          position: relative;
          background: url('../../assets/imgs/large-imgs/title_bg.png') no-repeat right vw(18) center / 50%;
          box-sizing: border-box;
          flex-shrink: 0;

          span {
            position: relative;

            u {
              text-decoration: none;
              position: relative;
              z-index: 1;
              font-size: vw(22);
            }

            &::after {
              content: '';
              width: 98%;
              height: 100%;
              background-image: linear-gradient(rgba(0, 0, 0, 0) 3%, #017fd0 30%, #0186db 46%, #0186db 66%, #017fd0 70%, rgba(0, 0, 0, 0) 97%);
              position: absolute;
              left: 1%;
              z-index: 0;
            }
          }

          &::after {
            content: '';
            position: absolute;
            left: vw(18);
            right: vw(18);
            bottom: 0;
            height: vh(1);
            border-left: vw(7) solid #fff;
            border-right: vw(7) solid #fff;
            border-bottom: vw(1) solid #ffffff68;
          }
        }
      }
    }
  }
}

// 当前项目进度
.stop {
  color: #fff;
  padding: vw(14) vw(12) 0;

  > div {
    -webkit-flex: 1;
    flex: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-wrap: wrap;
    text-align: center;

    div {
      width: 100%;
      position: relative;

      &::after {
        content: '';
        display: block;
        padding-bottom: 100%;
      }

      >>> div {
        position: absolute !important;
        top: 0;
        bottom: 0;
      }
    }

    p {
      width: 100%;
      padding-bottom: vh(8);
      background: url('../../assets/imgs/large-imgs/echart_stop.png') no-repeat;
      background-position: center bottom;
      background-size: vw(83);
    }
  }
}
.nodata {
  width: 100%;
  height: 100%;
  color: #fff;
  font-size: vw(14);
  letter-spacing: vw(2);
}
// 风险预警企业TOP10
.rank {
  width: 100%;
  box-sizing: border-box;
  list-style: none;
  padding: vh(30) vw(30) 0 vw(64);
  li {
    width: 100%;
    height: vh(32);
    font-size: vw(16);
    margin-bottom: vh(18);
    color: #fff;
    background: url('../../assets/imgs/large-imgs/rank_icon4.png') no-repeat;
    background-size: vw(134) vw(29);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;

    span {
      display: inline-block;
      text-align: center;
      width: vw(32);
      margin-right: vw(20);
    }

    &:nth-child(1) {
      background-image: url('../../assets/imgs/large-imgs/rank_icon1.png');
    }

    &:nth-child(2) {
      background-image: url('../../assets/imgs/large-imgs/rank_icon2.png');
    }

    &:nth-child(3) {
      background-image: url('../../assets/imgs/large-imgs/rank_icon3.png');
    }
  }
}

// 风险数量
.slider-center {
  color: #fff;
  text-align: center;

  p {
    font-size: vw(56);
    width: 100%;
    margin-top: vw(12);
    height: vh(112);
    line-height: vh(112);
    background: url('../../assets/imgs/large-imgs/risk_bottom.png') no-repeat;
    background-size: vw(241);
    background-position: center bottom vh(-38);
  }

  div:first-child {
    background: url('../../assets/imgs/large-imgs/border_left_top.png') left top, url('../../assets/imgs/large-imgs/border_left_bottom.png') left bottom;
  }

  div:first-child p {
    color: #e16757;
  }

  div:last-child {
    background: url('../../assets/imgs/large-imgs/border_right_top.png') right top, url('../../assets/imgs/large-imgs/border_right_bottom.png') right bottom;
  }

  div:nth-child(2) p {
    color: #e3935d;
  }

  div:nth-child(3) p {
    color: #eecb5f;
  }

  div:last-child p {
    color: #7ecf51;
  }
}
#tip {
    position: absolute;
    z-index: 20;
    background-color: rgba(0, 0, 0, 0.6);
    color: #fff;
    padding: 6px 12px;
    opacity: 0;
}
</style>
