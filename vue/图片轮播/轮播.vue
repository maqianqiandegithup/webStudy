<template>
    <div id="slider-wrapper" @mouseover="stop" @mouseout="start">
        <div
            class="main-slide"
            :style="`background: url(${slideConfig[nowIndex].src}) `"
        ></div>
        <div class="extra-slide">
            <div
                class="extra-slide-item"
                :class="slideClass(i)"
                v-for="(v, i) in slideConfig"
                :key="i"
                :style="`background: url(${v.src}); background-size: cover `"
            ></div>
        </div>
    </div>
</template>

<style lang="stylus" scoped>

$width: 800px;      // 容器宽度
$height: 300px;     // 容器高度
$bWidth: 500px;     // 大图片宽度
$sWidth: $width - $bWidth;  // 小图片宽度
$sHeight: $height / 2;  // 小图片高度

#slider-wrapper{
    width: $width;
    height: $height;
    margin: 0 auto;
    cursor: pointer;
    background: #ddd;
    border-radius: 5px;
    box-shadow: 0 1px 6px rgba(0,0,0,0.117647), 0 1px 4px rgba(0,0,0,0.117647);
    display: flex;
    overflow: hidden;
    div{
        display: inline-block;
    }
}
.main-slide{
    width: $bWidth;
    height: $height;
    float: left;
    transition: all .4s ease;
}
.extra-slide{
    width: $sWidth;
    position: relative;
    .extra-slide-item{
        position: absolute;
        width: $sWidth;
        height: $sHeight;
        left: 0;
        transition: .4s ease-out;
    }
    .extra-slide-top{
        top: -$sHeight;
    }
    .extra-slide-middle-first{
        top: 0;
        z-index: 2
    }
    .extra-slide-middle-second{
        top: $sHeight;
        z-index: 2
    }
    .extra-slide-bottom{
        top: $height
    }
    .extra-slide-hide{
        display: none!important;
    }
}
</style>