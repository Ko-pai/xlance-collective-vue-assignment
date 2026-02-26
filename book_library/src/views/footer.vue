<script setup>
import { BookCopy } from "lucide-vue-next";
import { useRoute, useRouter } from "vue-router";
import Avatar from "../components/ui/avatar/Avatar.vue";
import AvatarImage from "../components/ui/avatar/AvatarImage.vue";
import { Bell } from "lucide-vue-next";
import Button from "../components/ui/button/Button.vue";
import { colors } from "@/utils/colors";

const router = useRouter();
const route = useRoute();

/* function goTo(path) {
  router.push(path);
}

function isActive(path) {
  return route.path === path;
}

function isClick() {
  console.log("Hello World");
} */
</script>

<template>
  <div
    class="w-full h-20 flex flex-col items-center justify-center bg-brand-main"
  >
    <div class="h-[1px] w-full bg-brand-tip"></div>
    <div class="w-4/5 h-4/5 flex items-center justify-between">
      <div class="flex items-center">
        <h2 class="text-sm font-normal text-brand-muted">
          © 2026 Library Management System. All rights reserved.
        </h2>
      </div>

      <div class="w-16"></div>

      <div class="flex gap-6 font-medium text-brand-muted">
        <span class="cursor-pointer text-sm font-normal text-brand-muted">
          Terms of Service
        </span>
        <span class="cursor-pointer text-sm font-normal text-brand-muted">
          Privacy
        </span>
        <span class="cursor-pointer text-sm font-normal text-brand-muted">
          Categories
        </span>
      </div>
    </div>
  </div>
</template>
