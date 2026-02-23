<script setup lang="ts">
import { ref, watch } from "vue";
import { useRouter } from "vue-router";

const router = useRouter();
const title = ref<string>("");
const subtitle = ref<string>("");

function goTo(addBook: boolean) {
  if (addBook) {
    router.push("/addBook");
  } else {
    router.push("/addAuthor");
  }
}
const props = withDefaults(
  defineProps<{
    mode?: "book" | "author" | "category";
    title: string;
    subtitle: string;
  }>(),
  {
    initialBook: null,
    mode: "book",
  },
);

watch(
  () => props.mode,
  () => {
    title.value = props.title;
    subtitle.value = props.subtitle;
  },
);
</script>

<template>
  <div class="flex justify-center min-h-[calc(20vh)] bg-[#101922]">
    <div class="w-full max-w-7xl h-full mt-5 px-4">
      <div
        class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
      >
        <div class="flex flex-col gap-2 max-w-xl">
          <h1 class="text-3xl md:text-4xl text-white font-black">
            {{ props.title ?? "Book Directory" }}
          </h1>
          <p class="text-sm md:text-base text-slate-400 font-normal">
            {{
              props.subtitle ??
              `Manage your Book List in the order you would like to show. Add new
            books, edit the existing books and delete the books according to
            your needing.`
            }}
          </p>
        </div>

        <button
          class="w-full md:w-40 h-10 bg-[#137fec] text-white flex items-center justify-center rounded-lg text-sm md:text-base font-medium"
          @click="goTo(props.mode === 'book')"
        >
          +{{ props.mode === "author" ? " Add Author" : " Add Book" }}
        </button>
      </div>
    </div>
  </div>
</template>
