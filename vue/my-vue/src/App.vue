<template>
  <div id="app">
    <Swiper msg="Welcome to Your Vue.js App"/>
  </div>
</template>

<script>
import Swiper from './components/swiper.vue'

export default {
  name: 'App',
  components: {
    Swiper
  }
}
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
