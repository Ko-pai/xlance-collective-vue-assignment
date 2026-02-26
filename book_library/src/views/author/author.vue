<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import { Pencil, Trash2 } from "lucide-vue-next";
import Button from "@/components/ui/button/Button.vue";
import BookDirectory from "../book_directory.vue";
import Input from "@/components/ui/input/Input.vue";
import { deleteAuthor, getAuthor } from "@/services/authorService";
import type { Author } from "@/models/author";
import type { Book } from "@/models/book";
import { getBooks } from "@/services/bookService";
import { router } from "@/router/router";
import { MAX_AUTHOR_BOOKS } from "@/constants/author";
import Table from "@/components/ui/table/Table.vue";
import TableBody from "@/components/ui/table/TableBody.vue";
import TableCell from "@/components/ui/table/TableCell.vue";
import TableHead from "@/components/ui/table/TableHead.vue";
import TableHeader from "@/components/ui/table/TableHeader.vue";
import TableRow from "@/components/ui/table/TableRow.vue";

const books = ref<Book[]>([]);
const authors = ref<Author[]>([]);
const searchQuery = ref("");

async function loadBooks():Promise<void>  {
  books.value = await getBooks();
}

function goToEdit(id: string):void {
  router.push(`/authors/${id}/editAuthor`);
}

const filteredAuthors = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) {
    return authors.value;
  }

  return authors.value.filter((author) => {
    const name = author.name.toLowerCase();
    const nation = author.nationality.toLowerCase();

    return name.includes(query) || nation.includes(query);
  });
});

async function loadAuthor(): Promise<void> {
  authors.value = await getAuthor();
}

const authorBookCounts = computed(() => {
  const counts: Record<string, number> = {};
  for (const book of books.value) {
    const name = book.author?.trim();
    if (!name) continue;
    const key = name.toLowerCase();
    counts[key] = (counts[key] ?? 0) + 1;
  }
  return counts;
});

function getAuthorBookCount(name: string): number {
  return authorBookCounts.value[name.toLowerCase()] ?? 0;
}

function getAuthorBookProgressWidth(name: string):string {
  const count = Math.min(getAuthorBookCount(name), MAX_AUTHOR_BOOKS);
  return `${Math.round((count / MAX_AUTHOR_BOOKS) * 100)}%`;
}

onMounted(async () => {
  await loadAuthor();
  await loadBooks();
});

async function handleDelete(id: string): Promise<void> {
  await deleteAuthor(id);
  await loadAuthor();
}

function formatAuthorName(name: string): string {
  const result = name
    .split(/\s+/)
    .filter(Boolean)
    .map((part) => part.replace(/\W/g, ""))
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("");

  return result;
}
</script>

<template>
  <div class="flex justify-center bg-brand-main">
    <div class="w-full max-w-7xl h-full mt-5 px-4 mb-10">
      <BookDirectory
        @book-added="loadAuthor"
        mode="author"
        title="Author Directory"
        subtitle="Manage your global database of literary contributors. Track their works and metadata from a centralized dahboard."
      />

      <div class="max-w-md bg-transparent mb-10">
        <Input
          v-model="searchQuery"
          placeholder="Filter by name or nationality..."
          variant="search"
          class="bg-brand-input border-slate-800 hover:border-transparent focus:border-slate-800 text-white px-4"
        />
      </div>
      <div
        class="w-full overflow-hidden rounded-2xl border border-slate-800 bg-brand-table"
      >
        <Table class="w-full border-collapse">
          <TableHeader>
            <TableRow
              class="text-sm font-medium capitalize tracking-wide border-b border-slate-800 hover:bg-transparent"
            >
              <TableHead class="px-6 py-3 text-left font-medium text-slate-400"
                >Author</TableHead
              >
              <TableHead class="px-6 py-3 text-left font-medium text-slate-400"
                >Nationality</TableHead
              >
              <TableHead class="px-6 py-3 text-left font-medium text-slate-400"
                >Catalog Size</TableHead
              >
              <TableHead class="px-6 py-3 text-right font-medium text-slate-400"
                >Actions</TableHead
              >
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow
              v-for="author in filteredAuthors"
              :key="author.id"
              class="bg-brand-input hover:bg-brand-table transition-colors border-t border-slate-800"
            >
              <TableCell class="px-6 py-4">
                <div class="flex items-center gap-4">
                  <div
                    class="flex relative h-14 w-14 items-center justify-center rounded-[50%] bg-white text-slate-500 text-xs"
                  >
                    <h1
                      v-if="!author.imgUrl"
                      class="uppercase font-bold text-[18px] text-blue-500"
                    >
                      {{ formatAuthorName(author.name) }}
                    </h1>
                    <img
                      v-else
                      :src="author.imgUrl"
                      alt=""
                      class="h-full w-full rounded-[50%] object-cover"
                    />
                  </div>
                  <div class="flex flex-col">
                    <span class="text-sm font-semibold text-slate-50">
                      {{ author.name }}
                    </span>
                    <span class="text-xs text-slate-500">
                      {{ author.genre ?? "" }}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell class="px-6 py-4">
                <span
                  class="inline-flex rounded-full bg-slate-800/60 px-3 py-1 text-xs font-medium text-slate-200"
                >
                  {{ author.nationality }}
                </span>
              </TableCell>
              <TableCell class="px-6 py-4">
                <div class="flex items-center gap-3">
                  <span class="inline-flex text-xs font-medium text-slate-200">
                    {{ getAuthorBookCount(author.name) }}
                    {{ getAuthorBookCount(author.name) > 2 ? "Books" : "Book" }}
                  </span>
                  <div class="h-1.5 w-20 rounded-full bg-slate-700/60">
                    <div
                      class="h-1.5 rounded-full bg-brand-progress-blue"
                      :style="{
                        width: getAuthorBookProgressWidth(author.name),
                      }"
                    ></div>
                  </div>
                </div>
              </TableCell>

              <TableCell class="px-6 py-4 text-right">
                <div class="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    class="text-slate-300 hover:bg-slate-800 hover:text-emerald-400"
                    @click="goToEdit(author.id)"
                  >
                    <Pencil class="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    class="text-slate-400 hover:bg-red-900/40 hover:text-red-300"
                    @click="handleDelete(author.id)"
                  >
                    <Trash2 class="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
            <TableRow v-if="filteredAuthors.length === 0">
              <TableCell
                colspan="5"
                class="px-6 py-8 text-center text-sm text-slate-500 border-t border-slate-800"
              >
                No authors found. Use the Add Author button to create one.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  </div>
</template>
