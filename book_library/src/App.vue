<script setup lang="ts">
import Footer from "./components/footer.vue";
import HeadBar from "./components/headBar.vue";
</script>

<template>
  <div class="min-h-screen flex flex-col">
    <HeadBar />
    <div class="flex-1">
      <router-view />
    </div>
    <Footer />
  </div>
</template>
