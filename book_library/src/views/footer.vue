<script setup>
import { BookCopy } from "lucide-vue-next";
import { useRoute, useRouter } from "vue-router";
import Avatar from "../components/ui/avatar/Avatar.vue";
import AvatarImage from "../components/ui/avatar/AvatarImage.vue";
import { Bell } from "lucide-vue-next";
import Button from "../components/ui/button/Button.vue";

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
    style="
      width: 100%;
      height: 80px;
      background-color: #101922;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    "
  >
    <div
      style="background-color: rgb(35, 54, 72); height: 1px; width: 100%"
    ></div>
    <div
      style="
        width: 80%;
        height: 80%;
        display: flex;
        align-items: center;
        justify-content: space-between;
      "
    >
      <div style="display: flex; align-items: center">
        <h2 style="color: #94a3b8; font-size: 14px; font-weight: 400">
          © 2026 Library Management System. All rights reserved.
        </h2>
      </div>

      <div style="width: 4rem"></div>

      <div style="display: flex; gap: 24px; color: #a0aec0; font-weight: 500">
        <span
          style="
            cursor: pointer;
            font-size: 14px;
            font-weight: 400;
            color: #94a3b8;
          "
        >
          Terms of Service
        </span>
        <span
          style="
            cursor: pointer;
            font-size: 14px;
            font-weight: 400;
            color: #94a3b8;
          "
        >
          Privacy
        </span>
        <span
          style="
            cursor: pointer;
            font-size: 14px;
            font-weight: 400;
            color: #94a3b8;
          "
        >
          Categories
        </span>
      </div>
    </div>
  </div>
</template>
