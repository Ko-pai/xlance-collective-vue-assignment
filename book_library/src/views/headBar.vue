<script setup>
import { BookCopy } from "lucide-vue-next";
import { useRoute, useRouter } from "vue-router";
import Avatar from "../components/ui/avatar/Avatar.vue";
import AvatarImage from "../components/ui/avatar/AvatarImage.vue";
import { Bell } from "lucide-vue-next";
import Button from "../components/ui/button/Button.vue";

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
    style="
      width: 100%;
      height: 70px;
      background-color: #101922;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
    "
  >
    <div
      style="
        width: 80%;
        height: 80%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 10px;
        margin-top: 10px;
      "
    >
      <div style="display: flex; align-items: center">
        <div style="display: flex; align-items: center">
          <Button
            @click="goTo('/')"
            variant="ghost"
            class="flex items-center bg-transparent hover:bg-transparent p-0 text-white"
          >
            <BookCopy color="#137FEC" :size="22" />

            <h2 style="color: white; font-weight: 700; font-size: 20px">
              Library Manager
            </h2>
          </Button>
        </div>

        <div style="width: 4rem"></div>

        <div style="display: flex; gap: 24px; color: #a0aec0; font-weight: 500">
          <span
            style="cursor: pointer"
            :style="isActive('/books') ? 'color: white;' : ''"
            @click="goTo('/books')"
          >
            Books
          </span>
          <span
            style="cursor: pointer"
            :style="isActive('/authors') ? 'color: white;' : ''"
            @click="goTo('/authors')"
          >
            Authors
          </span>
          <span
            style="cursor: pointer"
            :style="isActive('/categories') ? 'color: white;' : ''"
            @click="goTo('/categories')"
          >
            Categories
          </span>
        </div>
      </div>

      <div style="display: flex; align-items: center">
        <Button
          variant="ghost"
          size="icon"
          @click="isClick"
          class="text-white hover:bg-transparent hover:text-white"
        >
          <div
            style="
              width: 35px;
              height: 35px;
              border-radius: 20%;
              background-color: #233648;
              display: flex;
              align-items: center;
              justify-content: center;
            "
          >
            <Bell :size="20" color="white" />
          </div>
        </Button>

        <span style="width: 10px"></span>
        <Avatar>
          <AvatarImage
            src="https://static.vecteezy.com/system/resources/thumbnails/057/068/323/small/single-fresh-red-strawberry-on-table-green-background-food-fruit-sweet-macro-juicy-plant-image-photo.jpg"
            alt="@you"
          />
        </Avatar>
      </div>
    </div>

    <div
      style="background-color: rgb(35, 54, 72); height: 1px; width: 100%"
    ></div>
  </div>
</template>
