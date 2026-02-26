<script setup lang="ts">
import { computed, onMounted, ref } from "vue";
import type { Book } from "@/models/book";
import { deleteBook, getBooks } from "@/services/bookService";
import { Pencil, Trash2 } from "lucide-vue-next";
import Button from "@/components/ui/button/Button.vue";
import { useRouter } from "vue-router";
import BookDirectory from "../book_directory.vue";
import Input from "@/components/ui/input/Input.vue";
import Table from "@/components/ui/table/Table.vue";
import TableHeader from "@/components/ui/table/TableHeader.vue";
import TableRow from "@/components/ui/table/TableRow.vue";
import TableHead from "@/components/ui/table/TableHead.vue";
import TableBody from "@/components/ui/table/TableBody.vue";
import TableCell from "@/components/ui/table/TableCell.vue";

const router = useRouter();
const books = ref<Book[]>([]);
const searchQuery = ref("");

const filteredBooks = computed(() => {
  const query = searchQuery.value.trim().toLowerCase();
  if (!query) {
    return books.value;
  }
  return books.value.filter((book) => {
    const title = book.title.toLowerCase();
    const author = book.author.toLowerCase();
    const category = book.category.toLowerCase();
    return (
      title.includes(query) ||
      author.includes(query) ||
      category.includes(query)
    );
  });
});

async function loadBooks(): Promise<void> {
  books.value = await getBooks();
}

onMounted(async () => {
  await loadBooks();
});

async function handleDelete(id: string): Promise<void> {
  await deleteBook(id);
  await loadBooks();
}

function goToEdit(id: string): void {
  router.push(`/books/${id}/edit`);
}
</script>

<template>
  <div class="flex justify-center bg-brand-main">
    <div class="w-full max-w-7xl h-full mt-5 px-4 mb-10">
      <BookDirectory
        @book-added="loadBooks"
        mode="book"
        title="Book Directory"
        subtitle="Manage your Book List in the order you would like to show. Add new
            books, edit the existing books and delete the books according to
            your needing."
      />

      <div class="max-w-md bg-transparent mb-10">
        <Input
          v-model="searchQuery"
          placeholder="Search books by title, author, or category..."
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
              class="text-xs font-medium uppercase tracking-wide text-slate-400 border-b border-slate-800 hover:bg-transparent"
            >
              <TableHead class="px-6 py-3 text-left font-medium text-slate-400"
                >Title</TableHead
              >
              <TableHead class="px-6 py-3 text-left font-medium text-slate-400"
                >Author</TableHead
              >
              <TableHead class="px-6 py-3 text-left font-medium text-slate-400"
                >Category</TableHead
              >
              <TableHead class="px-6 py-3 text-left font-medium text-slate-400"
                >Status</TableHead
              >
              <TableHead class="px-6 py-3 text-right font-medium text-slate-400"
                >Actions</TableHead
              >
            </TableRow>
          </TableHeader>
          <TableBody>
            <TableRow
              v-for="book in filteredBooks"
              :key="book.id"
              class="bg-brand-input hover:bg-brand-table transition-colors border-t border-slate-800"
            >
              <TableCell class="px-6 py-4">
                <div class="flex items-center gap-4">
                  <div
                    class="flex relative h-16 w-12 items-center justify-center rounded-md text-slate-500 text-xs"
                    :class="[
                      book.imgUrl
                        ? 'bg-slate-900'
                        : 'bg-brand-edit border border-slate-700',
                    ]"
                  >
                    <img
                      v-if="book.imgUrl"
                      :src="book.imgUrl"
                      alt=""
                      class="h-full w-full rounded-[5px] object-cover"
                    />

                    <div
                      class="absolute left-0 top-6 bottom-2 w-1 h-5 rounded-full bg-slate-600/70"
                    ></div>
                  </div>
                  <div class="flex flex-col">
                    <span class="text-sm font-semibold text-slate-50">
                      {{ book.title }}
                    </span>
                    <span class="text-xs text-slate-500">
                      Pub. {{ book.publishedYear ?? "—" }}
                    </span>
                  </div>
                </div>
              </TableCell>
              <TableCell class="px-6 py-4">
                <span class="text-sm text-slate-100">
                  {{ book.author }}
                </span>
              </TableCell>
              <TableCell class="px-6 py-4">
                <span
                  class="inline-flex rounded-full bg-slate-800/60 px-3 py-1 text-xs font-medium text-slate-200"
                >
                  {{ book.category }}
                </span>
              </TableCell>
              <TableCell class="px-6 py-4">
                <span
                  :class="[
                    'inline-flex rounded-full px-3 py-1 text-xs font-semibold',
                    book.status === 'available'
                      ? 'bg-emerald-500/10 text-emerald-300 border border-emerald-500/40'
                      : book.status === 'borrowed'
                        ? 'bg-amber-500/10 text-amber-300 border border-amber-500/40'
                        : 'bg-slate-500/10 text-slate-300 border border-slate-500/40',
                  ]"
                >
                  {{ book.status.toUpperCase() }}
                </span>
              </TableCell>
              <TableCell class="px-6 py-4">
                <div class="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    class="text-slate-300 hover:bg-slate-800 hover:text-emerald-400"
                    @click="goToEdit(book.id)"
                  >
                    <Pencil class="w-4 h-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    class="text-slate-400 hover:bg-red-900/40 hover:text-red-300"
                    @click="handleDelete(book.id)"
                  >
                    <Trash2 class="w-4 h-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
            <TableRow v-if="filteredBooks.length === 0">
              <TableCell
                colspan="5"
                class="px-6 py-8 text-center text-sm text-slate-500 border-t border-slate-800"
              >
                No books found. Use the Add Books button to create one.
              </TableCell>
            </TableRow>
          </TableBody>
        </Table>
      </div>
    </div>
  </div>
</template>
