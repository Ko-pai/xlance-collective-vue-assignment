<script setup lang="ts">
import { ref } from 'vue'
import Button from './ui/button/Button.vue';


defineProps<{ msg: string }>()

const count = ref(0)

function reset() {
  if (count.value > 0) {
    count.value = 0
  }
}

function countPlus () {
  count.value++
}
function countNeg () {
  if(count.value <= 0) {
    count.value = 0
  }else{
    count.value--
  }
}


</script>

<template>
  <h1>{{ count }}</h1>

  <div class="card"  style="display: flex; align-items: center; justify-content: center;">
    <Button type="button" @click="countPlus" style="background-color: green;">+ </Button>
    <div style="width: 10px;height: 20px"></div>
    <Button @click="countNeg" style="background-color: red;"> - </Button>
    <div style="width: 10px;height: 20px"></div>
    <Button type="button" @click="reset">reset count</Button>
    
  </div>

  <div>
    <p>
      Edit
      <code>components/HelloWorld.vue</code> to test HMR
    </p>
  </div>

  <p>
    Check out
    <a href="https://vuejs.org/guide/quick-start.html#local" target="_blank"
      >create-vue</a
    >, the official Vue + Vite starter
  </p>
  <p>
    Learn more about IDE Support for Vue in the
    <a
      href="https://vuejs.org/guide/scaling-up/tooling.html#ide-support"
      target="_blank"
      >Vue Docs Scaling up Guide</a
    >.
  </p>
  <p class="read-the-docs">Click on the Vite and Vue logos to learn more</p>
</template>

<style scoped>
.read-the-docs {
  color: #888;
}
</style>
