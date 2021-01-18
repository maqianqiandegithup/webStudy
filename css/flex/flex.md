## 1.flex:
flex-direction
flex-wrap
flex-flow  =flex-direction|flex-wrap
justify-content:主轴：flex-start flex-end center space-between space-around
align-items：在交叉轴： flex-start flex-end center baseline，strech
align-content属性定义了多根主轴线，一根负轴线

## 2.项目的属性
order 默认为0
flex-grow 0 放大比例
flex-shrink 1 空间不足就会缩小 
flex-basis 主轴空间，项目的本来大小 auto
flex ：flex-grow|flex-shrink |flex-basis  auto（1,1，auto）；none(0,0,auto)
align-self 默认auto，继承父元素。自定义父元素的align-items 
auto | flex-start | flex-end | center | baseline | stretch;