<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import type { Book } from "@/models/book";
import { getBookById } from "@/services/bookService";
import { Clock3 } from "lucide-vue-next";
import { useRoute, useRouter } from "vue-router";
import NewBookForm from "./newBookForm.vue";
import { Breadcrumb, BreadcrumbList } from "@/components/ui/breadcrumb";
import BreadcrumbItem from "@/components/ui/breadcrumb/BreadcrumbItem.vue";
import BreadcrumbLink from "@/components/ui/breadcrumb/BreadcrumbLink.vue";
import BreadcrumbSeparator from "@/components/ui/breadcrumb/BreadcrumbSeparator.vue";

const route = useRoute();
const router = useRouter();
const bookId = route.params.id as string;

const book = ref<Book | null>(null);

onMounted(async () => {
  book.value = await getBookById(bookId);
});

function onBackLibrary(): void {
  router.back();
}

function formatDateTime(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
}

const lastUpdatedText = computed(() => {
  if (!book.value) return "Unknown";
  return formatDateTime(book.value.updatedAt);
});

function isActive(path: string): boolean {
  return route.path === path;
}
</script>

<template>
  <div class="flex justify-center bg-brand-main min-h-[calc(100vh-70px)]">
    <div
      class="w-full max-w-7xl h-full mt-5 px-4 flex items-start justify-between flex-col"
    >
      <Breadcrumb class="">
        <BreadcrumbList>
          <BreadcrumbItem>
            <BreadcrumbLink as-child>
              <RouterLink
                class="hover:text-white"
                :class="isActive('/books') ? 'text-white' : ''"
                to="/books"
                >Books</RouterLink
              >
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              class="hover:text-white cursor-pointer"
              :class="isActive(`/books/${book?.id}/edit`) ? 'text-white' : ''"
              >Edit : {{ book?.title }}</BreadcrumbLink
            >
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div
        class="flex bg-red w-full mt-10"
        style="justify-content: space-between; align-items: center"
      >
        <div>
          <h1 class="text-2xl font-bold text-white mb-2">Edit Book</h1>
          <div class="flex items-center gap-2 text-slate-400 text-sm">
            <Clock3 class="w-4 h-4" />
            <span>Last updated: {{ lastUpdatedText }}</span>
          </div>
        </div>
        <div>
          <button
            class="w-full md:w-40 h-10 bg-brand-primary text-white flex items-center justify-center rounded-lg text-sm md:text-base font-medium"
            @click="onBackLibrary"
          >
            Back to List
          </button>
        </div>
      </div>

      <div class="w-full flex justify-center mt-6">
        <NewBookForm v-if="book" :initial-book="book" mode="edit" />
      </div>
    </div>
  </div>
</template>
