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

</script>

<template>
  <div class="w-full bg-brand-main flex flex-col items-center">
    <div class="h-[1px] w-full bg-brand-tip"></div>
    <div
      class="w-full max-w-7xl flex flex-col sm:flex-row items-center justify-between gap-3 px-4 py-4"
    >
      <div class="flex items-center justify-center sm:justify-start">
        <h2 class="text-xs sm:text-sm font-normal text-brand-muted text-center">
          © 2026 Library Management System. All rights reserved.
        </h2>
      </div>
      <div
        class="flex flex-wrap justify-center sm:justify-end gap-x-4 gap-y-2 font-medium text-brand-muted text-xs sm:text-sm"
      >
        <span class="cursor-pointer font-normal text-brand-muted">
          Terms of Service
        </span>
        <span class="cursor-pointer font-normal text-brand-muted">
          Privacy
        </span>
        <span class="cursor-pointer font-normal text-brand-muted">
          Categories
        </span>
      </div>
    </div>
  </div>
</template>
