<script setup lang="ts">
import Footer from "./views/footer.vue";
import HeadBar from "./views/headBar.vue";
</script>

<template>
  <div class="min-h-screen flex flex-col bg-[#101922]">
    <HeadBar />
    <div class="flex-1">
      <router-view />
    </div>
    <Footer />
  </div>
</template>
