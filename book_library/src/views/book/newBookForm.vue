<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import Input from "@/components/ui/input/Input.vue";
import Button from "@/components/ui/button/Button.vue";
import type {
  Book,
  BookStatus,
  NewBookInput,
  UpdateBookInput,
} from "@/models/book";
import { addBook, getBooks, updateBook } from "@/services/bookService";
import { useRouter } from "vue-router";
import {
  BadgeCheck,
  Camera,
  ChevronDown,
  ImageUp,
  Save,
} from "lucide-vue-next";
import { getAuthor } from "@/services/authorService";
import { getCategories } from "@/services/categoryService";
import { f } from "vue-router/dist/router-CWoNjPRp.mjs";

const props = withDefaults(
  defineProps<{
    initialBook?: Book | null;
    mode?: "create" | "edit";
  }>(),
  {
    initialBook: null,
    mode: "create",
  },
);

const router = useRouter();

const form = ref({
  title: "",
  author: "",
  category: "",
  status: "available" as BookStatus,
  publishedYear: "",
  imgUrl: "",
  summary: "",
});

const isDragActive = ref(false);
const fileInputRef = ref<HTMLInputElement | null>(null);
const authorOptions = ref<string[]>([]);
const categoryOptions = ref<string[]>([]);
const isEdit = ref<boolean>(false);

watch(
  () => props.initialBook,
  (value) => {
    if (!value) return;
    form.value.title = value.title;
    form.value.author = value.author;
    form.value.category = value.category;
    form.value.status = value.status;
    form.value.publishedYear = value.publishedYear?.toString
      ? String(value.publishedYear)
      : "";
    form.value.imgUrl = value.imgUrl ?? "";
    form.value.summary = value.summary ?? "";
  },
  { immediate: true },
);

onMounted(async () => {
  const authors = await getAuthor();
  const categories = await getCategories();

  authorOptions.value = authors.map((a) => a.name);
  categoryOptions.value = categories.map((a) => a.name);
});

const errors = ref<Record<string, string>>({});
const isSubmitting = ref(false);

function validate(): boolean {
  const next: Record<string, string> = {};

  if (!form.value.title.trim()) {
    next.title = "Title is required";
  }

  if (!form.value.author.trim()) {
    next.author = "Author is required";
  }

  if (!form.value.category.trim()) {
    next.category = "Category is required";
  }

  if (authorOptions.value.length === 0) {
    next.author = "There is no author so you need to create author first!";
  }

  if (!form.value.publishedYear.trim()) {
    next.publishedYear = "Publish Year is required!";
  }
  if (form.value.publishedYear) {
    const yearNum = Number(form.value.publishedYear);
    if (!Number.isFinite(yearNum) || !Number.isInteger(yearNum)) {
      next.publishedYear = "Published year must be a whole number";
    }
  }

  errors.value = next;
  return Object.keys(next).length === 0;
}

async function handleSubmit() {
  if (!validate()) {
    return;
  }

  isSubmitting.value = true;
  try {
    if (props.mode === "edit" && props.initialBook) {
      const changes: UpdateBookInput = {
        title: form.value.title.trim(),
        author: form.value.author.trim(),
        category: form.value.category.trim(),
        status: form.value.status,
        publishedYear: form.value.publishedYear
          ? Number(form.value.publishedYear)
          : undefined,
        imgUrl: form.value.imgUrl || undefined,
        summary: form.value.summary || undefined,
      };

      await updateBook(props.initialBook.id, changes);
    } else {
      const payload: NewBookInput = {
        title: form.value.title.trim(),
        author: form.value.author.trim(),
        category: form.value.category.trim(),
        status: form.value.status,
        publishedYear: form.value.publishedYear
          ? Number(form.value.publishedYear)
          : undefined,
        imgUrl: form.value.imgUrl || undefined,
        summary: form.value.summary || undefined,
      };

      await addBook(payload);
    }
    router.push("/books");
  } finally {
    isSubmitting.value = false;
  }
}

function handleCancel() {
  router.back();
}

function openFilePicker() {
  fileInputRef.value?.click();
}

function readFileAsDataUrl(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(file);
  });
}

async function handleFile(file: File) {
  if (!file.type.startsWith("image/")) {
    errors.value = { ...errors.value, imgUrl: "Please select an image file" };
    return;
  }
  errors.value = Object.fromEntries(
    Object.entries(errors.value).filter(([key]) => key !== "imgUrl"),
  );
  form.value.imgUrl = await readFileAsDataUrl(file);
}

async function handleFileChange(event: Event) {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file) {
    await handleFile(file);
  }
  input.value = "";
}

async function handleDrop(event: DragEvent) {
  event.preventDefault();
  isDragActive.value = false;
  const file = event.dataTransfer?.files?.[0];
  if (file) {
    await handleFile(file);
  }
}

function handleDragOver(event: DragEvent) {
  event.preventDefault();
  isDragActive.value = true;
}

function handleDragLeave() {
  isDragActive.value = false;
}

function handleBool(result: boolean) {
  isEdit.value = result;
  console.log(isEdit.value + "This is bool string");
}

onMounted(async () => {
  if (props.mode === "edit") {
    handleBool(props.mode === "edit");
  }
});
</script>

<template>
  <form
    @submit.prevent="handleSubmit"
    class="mt-6 w-full max-w-3xl mx-auto rounded-2xl border border-slate-800 px-6 py-8 md:px-8 md:py-10 text-slate-100"
    :class="[isEdit ? 'bg-transparent border-none' : 'bg-brand-card']"
  >
    <div class="space-y-4" :class="[isEdit ? 'hidden' : '']">
      <h2 class="text-[20px] font-semibold text-slate-200">Cover Image</h2>
      <div
        class="flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-8 text-center transition"
        :class="[
          isDragActive
            ? 'border-brand-primary bg-brand-dropzone'
            : 'border-slate-700 bg-brand-edit',
        ]"
        @dragover="handleDragOver"
        @dragleave="handleDragLeave"
        @drop="handleDrop"
      >
        <!-- {{ props.mode === "edit" ?  : }} -->
        <input
          ref="fileInputRef"
          type="file"
          accept="image/*"
          class="hidden"
          @change="handleFileChange"
        />
        <div
          class="flex flex-col items-center gap-3"
          role="button"
          tabindex="0"
          :class="props.mode === 'edit' ? 'hidden' : 'flex'"
          @click="openFilePicker"
          @keydown.enter.prevent="openFilePicker"
          @keydown.space.prevent="openFilePicker"
        >
          <div
            class="flex h-10 w-10 items-center justify-center rounded-full bg-brand-icon"
          >
            <ImageUp class="h-5 w-5 text-slate-300" />
          </div>
          <div class="text-sm text-slate-300">
            Click to upload or drag and drop
          </div>
          <div class="text-xs text-slate-400">PNG, JPG (max 800x800px)</div>
        </div>

        <div
          v-if="form.imgUrl"
          class="mt-5 w-[160px] h-[150px] max-w-sm bg-brand-cover-placeholder p-5 rounded-sm bg-cover bg-center"
          :style="{ backgroundImage: `url(${form.imgUrl})` }"
        ></div>

        <p v-if="errors.imgUrl" class="mt-3 text-xs text-red-400">
          {{ errors.imgUrl }}
        </p>

        <div
          class="flex justify-center flex-row w-[300px] mt-10 border-2 border-slate-700 rounded-xl py-3"
          :class="[!isEdit ? 'hidden' : 'flex']"
          @click="openFilePicker"
          @keydown.enter.prevent="openFilePicker"
          @keydown.space.prevent="openFilePicker"
        >
          Change Cover Image
          <span class="w-2"></span>
          <Camera class="text-white" />
        </div>
      </div>
    </div>

    <div
      class="flex flex-col"
      :class="[
        isEdit
          ? 'border p-5 border-slate-700 bg-brand-edit rounded-lg h-auto'
          : 'hidden',
      ]"
    >
      <div
        class="flex flex-col items-center justify-center rounded-xl px-6 py-8 text-center transition"
        :class="[
          isDragActive
            ? 'border-brand-primary bg-brand-dropzone'
            : 'border-slate-700 bg-transparent',
        ]"
        @dragover="handleDragOver"
        @dragleave="handleDragLeave"
        @drop="handleDrop"
      >
        <!-- {{ props.mode === "edit" ?  : }} -->
        <input
          ref="fileInputRef"
          type="file"
          accept="image/*"
          class="hidden"
          @change="handleFileChange"
        />
        <div
          class="flex flex-col items-center gap-3"
          role="button"
          tabindex="0"
          :class="props.mode === 'edit' ? 'hidden' : 'flex'"
          @click="openFilePicker"
          @keydown.enter.prevent="openFilePicker"
          @keydown.space.prevent="openFilePicker"
        >
          <div
            class="flex h-10 w-10 items-center justify-center rounded-full bg-brand-icon"
          >
            <ImageUp class="h-5 w-5 text-slate-300" />
          </div>
          <div class="text-sm text-slate-300">
            Click to upload or drag and drop
          </div>
          <div class="text-xs text-slate-400">PNG, JPG (max 800x800px)</div>
        </div>

        <div
          v-if="form.imgUrl"
          class="mt-5 w-[160px] h-[150px] max-w-sm bg-brand-cover-placeholder p-5 rounded-sm bg-cover bg-center"
          :style="{ backgroundImage: `url(${form.imgUrl})` }"
        ></div>

        <p v-if="errors.imgUrl" class="mt-3 text-xs text-red-400">
          {{ errors.imgUrl }}
        </p>

        <div
          class="flex justify-center flex-row w-[300px] mt-10 border-2 border-slate-700 rounded-xl py-3 cursor-pointer"
          :class="[!isEdit ? 'hidden' : 'flex']"
          @click="openFilePicker"
          @keydown.enter.prevent="openFilePicker"
          @keydown.space.prevent="openFilePicker"
        >
          Change Cover Image
          <span class="w-2"></span>
          <Camera class="text-white" />
        </div>
      </div>
    </div>

    <div
      class="flex flex-col"
      :class="[
        isEdit
          ? 'border p-5 border-slate-700 bg-brand-edit rounded-lg mt-8'
          : '',
      ]"
    >
      <h2
        class="text-[20px] font-semibold text-slate-200 m-0 p-0"
        :class="[isEdit ? '' : 'mt-8']"
      >
        Book Information
      </h2>
      <p
        class="p-0 m-0 text-[12px] text-gray-500"
        :class="[isEdit ? '' : 'hidden']"
      >
        Update the core details and categorization for this title.
      </p>
      <hr
        class="my-4 border-gray-700"
        :class="[isEdit ? '' : 'hidden']"
      />

      <div class="space-y-4" :class="[isEdit ? '' : 'mt-4']">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-[14px] font-medium text-slate-100 mb-1">
              Book Title
            </label>
            <Input
              v-model="form.title"
              placeholder="e.g. The Great Gatsby"
              class="bg-brand-main border-slate-700 text-white"
            />
            <p v-if="errors.title" class="mt-1 text-xs text-red-400">
              {{ errors.title }}
            </p>
          </div>

          <div>
            <label class="block text-[14px] font-medium text-slate-100 mb-1">
              Published Year
            </label>
            <Input
              v-model="form.publishedYear"
              placeholder="e.g. 1925"
              class="bg-brand-main border-slate-700 text-white"
            />
            <p v-if="errors.publishedYear" class="mt-1 text-xs text-red-400">
              {{ errors.publishedYear }}
            </p>
          </div>

          <div>
            <label class="block text-[14px] font-medium text-slate-100 mb-1">
              Author
            </label>
            <div class="relative mt-0.5">
              <select
                v-model="form.author"
                class="flex h-9 w-full appearance-none rounded-md border border-slate-700 bg-brand-main pl-3 pr-10 text-sm text-slate-100 shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-500"
              >
                <option v-if="authorOptions.length === 0" value="" disabled>
                  No authors found
                </option>
                <option v-else-if="!isEdit" value="" disabled>
                  Select an author
                </option>
                <option v-else-if="isEdit" :value="form.author" disabled>
                  {{ form.author }}
                </option>

                <option
                  v-for="author in authorOptions"
                  :key="author"
                  :value="author"
                >
                  {{ author }}
                </option>
              </select>
              <ChevronDown
                class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              />
            </div>
            <p v-if="errors.author" class="mt-1 text-xs text-red-400">
              {{ errors.author }}
            </p>
          </div>

          <div>
            <label class="block text-[14px] font-medium text-slate-100 mb-1">
              Category
            </label>
            <div class="relative mt-0.5">
              <select
                v-model="form.category"
                class="flex h-9 w-full appearance-none rounded-md border border-slate-700 bg-brand-main pl-3 pr-10 text-sm text-slate-100 shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-500"
              >
                <option v-if="categoryOptions.length === 0" value="" disabled>
                  No categories found
                </option>
                <option v-else value="" disabled>Select a category</option>
                <option
                  v-for="category in categoryOptions"
                  :key="category"
                  :value="category"
                >
                  {{ category }}
                </option>
              </select>
              <ChevronDown
                class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              />
            </div>
            <p v-if="errors.category" class="mt-1 text-xs text-red-400">
              {{ errors.category }}
            </p>
          </div>

          <div>
            <label class="block text-[14px] font-medium text-slate-100 mb-1">
              Availability Status
            </label>
            <div class="relative mt-0.5">
              <select
                v-model="form.status"
                class="flex h-9 w-full appearance-none rounded-md border border-slate-700 bg-brand-main pl-3 pr-10 text-sm text-slate-100 shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-500"
              >
                <option value="available">Available</option>
                <option value="borrowed">Borrowed</option>
                <option value="unavailable">Unavailable</option>
              </select>
              <ChevronDown
                class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              />
            </div>
          </div>
        </div>
      </div>

      <div class="mt-8 space-y-3">
        <h2
          class=" font-semibold text-slate-200"
          :class="[isEdit ? 'text-[14px]' : 'text-[20px]']"
        >
          Description {{ isEdit ? "/ Summary" : "" }}
        </h2>
        <div>
          <label
            class="block text-[14px] font-[400] text-slate-400 mb-2"
            :class="[isEdit ? 'hidden' : '']"
          >
            Book Summary
          </label>
          <textarea
            v-model="form.summary"
            maxlength="250"
            rows="4"
            class="w-full rounded-md border border-slate-700 bg-brand-main px-3 py-2 text-sm text-slate-100 shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-500"
            placeholder="Brief overview of the book's plot and themes..."
          ></textarea>
        </div>
      </div>

      <div class="mt-8 pt-6 border-t border-slate-800 flex justify-end gap-3">
        <Button
          type="button"
          variant="ghost"
          class="text-slate-300 hover:bg-transparent hover:text-slate-100"
          @click="handleCancel"
        >
          Cancel
        </Button>
        <Button
          type="submit"
          class="bg-brand-primary hover:bg-brand-primary-hover text-white w-[200px] h-10"
          :disabled="isSubmitting"
        >
          {{ props.mode === "edit" ? "Upload Book" : "Add to Library" }}
          <BadgeCheck
            :class="[!isEdit ? 'hidden' : 'flex']"
            class="text-white"
          />
          <Save :class="[isEdit ? 'hidden' : 'flex']" class="text-white" />
        </Button>
      </div>
    </div>
  </form>
</template>
