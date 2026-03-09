<script setup lang="ts">
import { BookCopy } from "lucide-vue-next";
import { useRoute, useRouter } from "vue-router";
import Avatar from "../components/ui/avatar/Avatar.vue";
import AvatarImage from "../components/ui/avatar/AvatarImage.vue";
import { Bell } from "lucide-vue-next";
import Button from "../components/ui/button/Button.vue";
import { colors } from "@/utils/colors";

const router = useRouter();
const route = useRoute();

function goTo(path: string): void {
  router.push(path);
}

function isActive(path: string): boolean {
  return route.path === path;
}
</script>

<template>
  <div class="w-full bg-brand-main flex flex-col items-center">
    <div
      class="w-full max-w-7xl flex flex-wrap items-center justify-between gap-3 px-4 py-3"
    >
      <div class="flex items-center gap-6 flex-wrap">
        <Button
          @click="goTo('/')"
          variant="ghost"
          class="flex items-center bg-transparent hover:bg-transparent p-0 text-white"
        >
          <BookCopy :color="colors.primary.blue" :size="22" />
          <h2 class="text-white font-bold text-lg sm:text-xl">
            Library Manager
          </h2>
        </Button>
        <div
          class="flex flex-wrap gap-x-4 gap-y-2 font-medium text-brand-muted text-sm sm:text-base"
        >
          <span
            class="cursor-pointer"
            :style="isActive('/books') ? 'color: white;' : ''"
            @click="goTo('/books')"
          >
            Books
          </span>
          <span
            class="cursor-pointer"
            :style="isActive('/authors') ? 'color: white;' : ''"
            @click="goTo('/authors')"
          >
            Authors
          </span>
          <span
            class="cursor-pointer"
            :style="isActive('/categories') ? 'color: white;' : ''"
            @click="goTo('/categories')"
          >
            Categories
          </span>
        </div>
      </div>
      <div class="flex items-center">
        <Button
          variant="ghost"
          size="icon"
          class="text-white hover:bg-transparent hover:text-white"
        >
          <div
            class="w-12 h-10 rounded-md flex items-center justify-center bg-brand-formCard"
          >
            <Bell :size="20" color="white" />
          </div>
        </Button>
        <span class="w-3"></span>
        <Avatar>
          <AvatarImage
            src="https://static.vecteezy.com/system/resources/thumbnails/057/068/323/small/single-fresh-red-strawberry-on-table-green-background-food-fruit-sweet-macro-juicy-plant-image-photo.jpg"
            alt="@you"
          />
        </Avatar>
      </div>
    </div>
    <div
      class="h-px w-full"
      :style="{ backgroundColor: colors.background.tip }"
    ></div>
  </div>
</template>
