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

function goTo(path) {
  router.push(path);
}

function isActive(path) {
  return route.path === path;
}

function isClick() {
  console.log("Hello World");
}
</script>

<template>
  <div
    class="w-full h-[70px] flex flex-col items-center justify-center bg-brand-main"
  >
    <div class="w-4/5 h-4/5 flex items-center justify-between mb-2 mt-2">
      <div class="flex items-center">
        <div class="flex items-center">
          <Button
            @click="goTo('/')"
            variant="ghost"
            class="flex items-center bg-transparent hover:bg-transparent p-0 text-white"
          >
            <BookCopy :color="colors.primary.blue" :size="22" />

            <h2 class="text-white font-bold text-[20px]">Library Manager</h2>
          </Button>
        </div>

        <div class="w-16"></div>

        <div class="flex gap-6 font-medium text-brand-muted">
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
          @click="isClick"
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
      class="h-[1px] w-full"
      :style="{ backgroundColor: colors.background.tip }"
    ></div>
  </div>
</template>
