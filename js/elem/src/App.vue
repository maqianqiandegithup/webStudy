<template>
  <div id="app">
    <el-input
      v-model="value1"
      size="normal"
     
      clearable
    ></el-input>
    <el-input
      v-model="value2"
      size="normal"
      v-on-blur
      clearable
      class="input2"
    ></el-input>
<input type="text" v-model="value3">
    <button @click="tijiao">按钮</button>
  </div>
</template>

<script>
// import HelloWorld from './components/HelloWorld.vue'

export default {
  name: "App",
  data() {
    return {
      value1: 0,
      value2: 0,
      value3:0
    };
  },
  directives: {
    numberInput: {
      bind(el, binding, vnode) {
        function onInput(el, ele, binding, vnode) {
          function handle() {
            let val = ele.value;
            // modifiers为修饰符对象，传入了float，则其float属性为true

            // 清除"数字"和"."以外的字符
            val = val.replace(/[^\d.]/g, "");
            // 只保留第一个“点”号, 清除多余的
            const idx = val.indexOf(".");
            if (!(idx === -1 || idx === val.length - 1)) {
              val =
                val.substr(0, idx) +
                "." +
                val.substr(idx + 1).replace(/\./g, "");
            }
            // 第一个字符如果是.号，则补充前缀0
            val = val.replace(/^\./g, "0.");

            ele.value = isNaN(parseFloat(val)) ? 0:parseFloat(val);
            if (vnode.componentInstance) {
              vnode.componentInstance.$emit("input", ele.value);
            } else {
              vnode.elm.dispatchEvent(new CustomEvent("input", ele.value));
            }
          }

          return handle;
        }
        const ele = el.tagName === "INPUT" ? el : el.querySelector("input");
        ele.addEventListener("blur", onInput(el, ele, binding, vnode), false);
      },
    },
    onBlur: {
      bind(el,binding, vnode) {
        function onInput(el, ele,binding, vnode) {
          function handle() {
            let val = ele.value;
            // modifiers为修饰符对象，传入了float，则其float属性为true

            ele.value = isNaN(parseFloat(val)) ? 0:parseFloat(val);
            if (vnode.componentInstance) {
              vnode.componentInstance.$emit("input", ele.value);
            } else {
              vnode.elm.dispatchEvent(new CustomEvent("input", ele.value));
            }
          }

          return handle;
        }
        const ele = el.tagName === "INPUT" ? el : el.querySelector("input");
        ele.addEventListener("blur", onInput(el,ele,binding, vnode), false);
      },
    },
  },
  components: {},
  methods: {
    tijiao() {
      console.log(typeof this.value1, typeof this.value2,typeof this.value3);
      console.log(this.value1,this.value2,this.value3);
      console.dir(document.querySelector('.input2').children[0])
    },
  },
};
</script>

<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
