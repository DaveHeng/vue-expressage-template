<template>
  <div class="home">
    <img alt="Vue logo" src="../assets/logo.png" />
    <!-- <HelloWorld msg="Welcome to Your Vue.js App" /> -->
    <el-button @click="handleOpenDialog">指定区域</el-button>
    <VueExpressageTemplate :isShow.sync="isShow" />
  </div>
</template>

<script>
// @ is an alias to /src
// import HelloWorld from '@/components/HelloWorld.vue'
import VueExpressageTemplate from '@/components/vueExpressageTemplate/main'

export default {
  name: 'Home',
  components: {
    // HelloWorld,
    VueExpressageTemplate
  },
  data() {
    return {
      isShow: false
    }
  },
  methods: {
    handleOpenDialog() {
      this.isShow = true
    }
  }
}
</script>
