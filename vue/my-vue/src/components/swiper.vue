<template>
    <div class="swiper">
        <div class="main"></div>
        <div class="right"  @mouseover="stop" @mouseout="start">
            <div class="img-box" :class="swiper(0)" :style="`background:url(${require('/src/assets/imgs/1.jpg')});background-size: cover`">
                <!-- <img src="../assets/imgs/1.jpg" alt="图片" /> -->
            </div>
            <div class="img-box" :class="swiper(1)" :style="`background:url(${require('/src/assets/imgs/2.jpg')});background-size: cover`">
                <!-- <img src="../assets/imgs/2.jpg" alt="图片" /> -->
            </div>
            <div class="img-box" :class="swiper(2)" :style="`background:url(${require('/src/assets/imgs/3.jpg')});background-size: cover`">
                <!-- <img src="../assets/imgs/3.jpg" alt="图片" /> -->
            </div>
            <div class="img-box" :class="swiper(3)" :style="`background:url(${require('/src/assets/imgs/4.jpg')});background-size: cover`">
                <!-- <img src="../assets/imgs/4.jpg" alt="图片" /> -->
            </div>
        </div>
    </div>
</template>

<script>
// const prefix = "../assets/imgs/";
export default {
    name: "Swiper",
    data() {
        return {
            itemurl: require("../assets/imgs/1.jpg"),
            nowIndex: 0,
            timeinterval: 0,
        };
    },
    props: {
        msg: String,
    },
    mounted() {
        this.start()
    },
    methods: {
        resetIndex(index){
            return index>3?index-4:index
        },
        swiper(i) {
            let nowIndex = this.nowIndex
            let maps=new Map([
                [this.resetIndex(nowIndex),"one"],
                [this.resetIndex(nowIndex+1),"second"],
                [this.resetIndex(nowIndex+2),"third"],
                [this.resetIndex(nowIndex+3),"four"],
            ])
            return maps.get(i)?maps.get(i):'hide'
        },
        start() {
            // console.log(1)
            this.timeinterval = setTimeout(() => {
                this.nowIndex = this.nowIndex > 2 ? 0 : this.nowIndex+1;
                this.start()
            }, 3000);
        },
        stop(){
            clearTimeout(this.timeinterval)
            this.timeinterval = null
        }
    },
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style  scoped>
.swiper {
    height: 400px;
    display: flex;
}
.main {
    height: 400px;
    width: 300px;
    background: #333;
}
.right {
    width: 300px;
    background: green;
    overflow: hidden;
    position: relative;
}
.img-box {
    height: 200px;
      width: 300px;
    /* position: absolute; */
    transition: .4s ease-out
    /* right: 0; */
}
.img-box img {
    height: 200px;
  
}
.one {
    transform: translateY(200px);
     z-index: 2
}
.second {
    transform: translateY(200px);
    z-index: 2
}
.third {
    transform: translateY(200px);
    z-index: 2
}
.four {
     transform: translateY(200px);
}
.hide{
    display: none !important;
}
</style>
