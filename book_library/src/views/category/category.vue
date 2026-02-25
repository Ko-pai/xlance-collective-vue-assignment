<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import {
  Pencil,
  Trash2,
  Wand2,
  FlaskConical,
  ScrollText,
  Palette,
  BookOpen,
} from "lucide-vue-next";
import Button from "@/components/ui/button/Button.vue";
import BookDirectory from "../book_directory.vue";
import Input from "@/components/ui/input/Input.vue";
import type { Book } from "@/models/book";
import { getBooks } from "@/services/bookService";
import { router } from "@/router/router";
import type { Category } from "@/models/category";
import { deleteCategory, getCategories } from "@/services/categoryService";
import { formatRelativeTime } from "@/utils/formateTime";

const books = ref<Book[]>([]);
const categories = ref<Category[]>([]);
const searchQuery = ref("");

function getCategoryIconComponent(name: string) {
  const lower = name.toLowerCase();

  if (lower.includes("fiction")) {
    return Wand2;
  }

  if (lower.includes("science")) {
    return FlaskConical;
  }

  if (lower.includes("history")) {
    return ScrollText;
  }

  if (lower.includes("art")) {
    return Palette;
  }

  return BookOpen;
}

function getCategoryIconColorClass(name: string) {
  const lower = name.toLowerCase();

  if (lower.includes("fiction")) {
    // fiction → purple
    return "text-purple-400";
  }

  if (lower.includes("science")) {
    // science → blue
    return "text-blue-600";
  }

  if (lower.includes("history")) {
    // history → yellow
    return "text-yellow-600";
  }

  if (lower.includes("art")) {
    // arts → pink
    return "text-pink-400";
  }

  // default color
  return "text-slate-700";
}

async function loadBooks() {
  books.value = await getBooks();
}

function goToEdit(id: string) {
  router.push(`/categories/${id}/editCategory`);
}

const filterCategories = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) {
    return categories.value;
  }

  return categories.value.filter((category) => {
    const name = category.name.toLowerCase();
    const desc = category.description?.toLowerCase() ?? "";

    return name.includes(query) || desc.includes(query);
  });
});

async function loadCategories() {
  categories.value = await getCategories();
  //   console.log("run authr load", authors.value);
}

const authorBookCounts = computed(() => {
  const counts: Record<string, number> = {};
  for (const book of books.value) {
    const category = book.category?.trim();
    if (!category) continue;
    const key = category.toLowerCase();
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return counts;
});

function getAuthorBookCount(name: string) {
  return authorBookCounts.value[name.toLowerCase()] ?? 0;
}

onMounted(async () => {
  await loadCategories();
  await loadBooks();
});

async function handleDelete(id: string) {
  await deleteCategory(id);
  await loadCategories();
}
</script>

<template>
  <div class="flex justify-center bg-brand-main">
    <div class="w-full max-w-7xl h-full mt-5 px-4 mb-10">
      <BookDirectory
        @book-added="loadCategories"
        mode="category"
        title="Categories"
        subtitle="Organize and classify your collection. Use badges to monitor stock levels across genres."
      />

      <div class="max-w-md bg-transparent mb-10">
        <Input
          v-model="searchQuery"
          placeholder="Search categories by name or description..."
          variant="search"
          class="bg-brand-input border-slate-800 hover:border-transparent focus:border-slate-800 text-white px-4"
        />
      </div>
      <div
        class="w-full overflow-hidden rounded-2xl border border-slate-800 bg-brand-table"
      >
        <table class="w-full border-collapse">
          <thead>
            <tr
              class="text-sm font-medium capitalize tracking-wide text-slate-400"
            >
              <th class="px-6 py-3 text-left font-medium">Category Name</th>
              <th class="px-6 py-3 text-left font-medium">Description</th>
              <th class="px-6 py-3 text-left font-medium">Book Count</th>
              <th class="px-6 py-3 text-left font-medium">Last Updated</th>
              <th class="px-6 py-3 text-right font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            <tr
              v-for="category in filterCategories"
              :key="category.id"
              class="bg-brand-input hover:bg-brand-table transition-colors border-t border-slate-800"
            >
              <td class="px-6 py-4">
                <div class="flex items-center gap-4">
                  <div
                    class="flex relative h-12 w-12 items-center justify-center rounded-sm bg-white text-slate-500 text-xs"
                  >
                    <component
                      :is="getCategoryIconComponent(category.name)"
                      class="w-7 h-7 text-purple-500"
                      :class="[
                        'w-5 h-5',
                        getCategoryIconColorClass(category.name),
                      ]"
                    />
                  </div>
                  <div class="flex flex-col">
                    <span class="text-sm font-semibold text-slate-50">
                      {{ category.name }}
                    </span>
                  </div>
                </div>
              </td>
              <td class="pl-6 py-4">
                <span
                  class="inline-flex max-w-xs text-xs font-medium text-slate-400 overflow-hidden text-ellipsis whitespace-nowrap"
                >
                  {{ category.description }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <span
                    class="inline-flex text-xs font-medium rounded-full bg-slate-100 px-3 py-1 text-blue-500"
                    style="font-weight: 700;"
                    :class="[
                      getAuthorBookCount(category.name) === 0 ? 'bg-slate-800 text-slate-400' : ''
                    ]"
                  >
                    {{ getAuthorBookCount(category.name) }}
                    {{
                      getAuthorBookCount(category.name) > 1 ? "Books" : "Book"
                    }}
                  </span>
                </div>
              </td>
              <td class="px-7 py-4">
                <span class="text-sm text-slate-100">
                  {{ formatRelativeTime(category.updatedAt) }}
                </span>
              </td>
              <td class="px-6 py-4">
                <div class="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    class="text-slate-300 hover:bg-slate-800 hover:text-emerald-400"
                    @click="goToEdit(category.id)"
                  >
                    <Pencil class="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    class="text-slate-400 hover:bg-red-900/40 hover:text-red-300"
                    @click="handleDelete(category.id)"
                  >
                    <Trash2 class="w-4 h-4" />
                  </Button>
                </div>
              </td>
            </tr>
            <tr v-if="filterCategories.length === 0">
              <td
                colspan="5"
                class="px-6 py-8 text-center text-sm text-slate-500 border-t border-slate-800"
              >
                No categories found. Use the Add Category button to create one.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
