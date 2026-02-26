<script setup lang="ts">
import { computed, onMounted, ref, watch, type Ref } from "vue";
import Input from "@/components/ui/input/Input.vue";
import Button from "@/components/ui/button/Button.vue";
import { useRouter } from "vue-router";
import {
  BadgeCheck,
  Camera,
  ChevronDown,
  CloudUploadIcon,
  Save,
  Upload,
  Calendar as CalendarIcon,
} from "lucide-vue-next";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import {
  CalendarDate,
  parseDate,
  type DateValue,
} from "@internationalized/date";
import { addAuthor, getAuthor, updateAuthor } from "@/services/authorService";
import type { Author, NewAuthorInput } from "@/models/author";
import type { Book } from "@/models/book";
import { getBooks } from "@/services/bookService";
import { BASE_NATIONALITIES } from "@/constants/author";

const props = withDefaults(
  defineProps<{
    initialAuthor?: Author | null;
    updatedAt?: string | null;
    mode?: "create" | "edit";
  }>(),
  {
    initialAuthor: null,
    mode: "create",
  },
);

const router = useRouter();
const books = ref<Book[]>([]);
async function loadBooks() {
  books.value = await getBooks();
}

const form = ref({
  name: "",
  nationality: "",
  imgUrl: "",
  bio: "",
  dateOfBirth: "",
  genre: "",
});

const isDragActive = ref(false);
const fileInputRef = ref<HTMLInputElement | null>(null);
const nationalityOptions = ref<string[]>([]);
const isEdit = ref<boolean>(false);

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

function handleDateInput(val: string | number): void {
  const str = String(val);
  // Only allow digits
  const digits = str.replace(/\D/g, "");

  let formatted = "";
  if (digits.length > 0) {
    // Year part
    formatted = digits.slice(0, 4);
    if (digits.length > 4) {
      // Month part
      formatted += "-" + digits.slice(4, 6);
      if (digits.length > 6) {
        // Day part
        formatted += "-" + digits.slice(6, 8);
      }
    }
  }
  form.value.dateOfBirth = formatted;
}

const placeholder = ref(
  new CalendarDate(
    new Date().getFullYear(),
    new Date().getMonth() + 1,
    new Date().getDate(),
  ),
) as Ref<DateValue>;

const dateValue = computed({
  get: () => {
    if (!form.value.dateOfBirth) return undefined;
    try {
      return parseDate(form.value.dateOfBirth);
    } catch {
      return undefined;
    }
  },
  set: (val) => {
    if (val) {
      form.value.dateOfBirth = val.toString();
      placeholder.value = val;
    }
  },
});

watch(
  () => props.initialAuthor,
  (value) => {
    if (!value) return;
    ((form.value.name = value.name),
      (form.value.nationality = value.nationality),
      (form.value.bio = value.bio ?? ""),
      (form.value.imgUrl = value.imgUrl ?? ""),
      (form.value.genre = value.genre ?? ""),
      (form.value.dateOfBirth = value.dateOfBirth ?? ""));
  },
  { immediate: true },
);

onMounted(async () => {
  const authors = await getAuthor();
  await loadBooks();
  const baseNationalities = BASE_NATIONALITIES;
  const fromAuthors = authors
    .map((author) => author.nationality?.trim())
    .filter((value): value is string => Boolean(value));
  nationalityOptions.value = Array.from(
    new Set([...baseNationalities, ...fromAuthors]),
  ).sort((a, b) => a.localeCompare(b));
});

const errors = ref<Record<string, string>>({});
const isSubmitting = ref(false);

function validate(): boolean {
  const next: Record<string, string> = {};

  if (!form.value.name.trim()) {
    next.title = "Name is required";
  }

  if (!form.value.nationality.trim()) {
    next.nationality = "Nationality is required";
  }

  errors.value = next;
  return Object.keys(next).length === 0;
}

async function handleSubmit(): Promise<void> {
  if (!validate()) {
    return;
  }

  isSubmitting.value = true;
  try {
    const payload: NewAuthorInput = {
      name: form.value.name.trim(),
      nationality: form.value.nationality.trim(),
      bio: form.value.bio.trim(),
      imgUrl: form.value.imgUrl || undefined,
      genre: form.value.genre.trim(),
      dateOfBirth: form.value.dateOfBirth.trim(),
    };

    props.initialAuthor?.id && props.mode === "edit"
      ? await updateAuthor(props.initialAuthor.id, payload)
      : await addAuthor(payload);
    router.push("/authors");
  } finally {
    isSubmitting.value = false;
  }
}

function handleCancel(): void {
  router.back();
}

function openFilePicker(): void {
  fileInputRef.value?.click();
}

async function handleFile(file: File): Promise<void> {
  if (!file.type.startsWith("image/")) {
    errors.value = { ...errors.value, imgUrl: "Please select an image file" };
    return;
  }
  errors.value = Object.fromEntries(
    Object.entries(errors.value).filter(([key]) => key !== "imgUrl"),
  );
  form.value.imgUrl = URL.createObjectURL(file);
}

async function handleFileChange(event: Event): Promise<void> {
  const input = event.target as HTMLInputElement;
  const file = input.files?.[0];
  if (file) {
    await handleFile(file);
  }
  input.value = "";
}

async function handleDrop(event: DragEvent): Promise<void> {
  event.preventDefault();
  isDragActive.value = false;
  const file = event.dataTransfer?.files?.[0];
  if (file) {
    await handleFile(file);
  }
}

function handleDragOver(event: DragEvent): void {
  event.preventDefault();
  isDragActive.value = true;
}

function handleDragLeave(): void {
  isDragActive.value = false;
}

function handleBool(result: boolean): void {
  isEdit.value = result;
}

onMounted(() => {
  if (props.mode === "edit") {
    handleBool(props.mode === "edit");
  }
});

function formatDateTime(iso: string): string {
  const date = new Date(iso);
  return date.toLocaleString("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
    hour12: true,
  });
}

const lastUpdatedText = computed(() => {
  if (!props.initialAuthor?.updatedAt) return "Unknown";
  return formatDateTime(props.updatedAt ?? "");
});
</script>

<template>
  <form
    @submit.prevent="handleSubmit"
    class="mt-6 w-full max-w-3xl mx-auto rounded-2xl border border-slate-800 px-6 py-8 md:px-8 md:py-10 text-slate-100"
    :class="[isEdit ? 'bg-transparent border-none' : 'bg-brand-card']"
  >
    <div class="space-y-4" :class="[isEdit ? 'hidden' : '']">
      <h2 class="text-xl font-semibold text-slate-200">Author Portrait</h2>
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
            <CloudUploadIcon class="h-5 w-5 text-slate-300" />
          </div>
          <div class="text-sm text-slate-300">
            Click to upload or drag and drop
          </div>
          <div class="text-xs text-slate-400">PNG, JPG (max 800x800px)</div>
        </div>

        <div
          v-if="form.imgUrl"
          class="mt-5 w-40 h-40 max-w-sm p-5 rounded-sm bg-cover bg-center"
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
      :class="[
        isEdit ? 'border  border-slate-700 bg-brand-edit rounded-lg' : 'hidden',
      ]"
    >
      <div
        class="flex flex-row p-5 rounded-xl text-center transition"
        style="justify-content: space-between; align-items: center"
      >
        <!-- {{ props.mode === "edit" ?  : }} -->
        <div class="flex flex-row" style="align-items: center">
          <div
            v-if="form.imgUrl"
            class="w-[100px] h-[90px] max-sm bg-brand-cover-placeholder p-5 rounded-sm bg-cover bg-center"
            :style="{ backgroundImage: `url(${form.imgUrl})` }"
          ></div>

          <p v-if="errors.imgUrl" class="mt-3 text-xs text-red-400">
            {{ errors.imgUrl }}
          </p>

          <p class="ml-3 text-lg text-white-500" style="font-weight: 600">
            {{ props.initialAuthor?.name }}
          </p>
        </div>

        <div
          class="flex bg-blue-500 text-xs w-[200px] justify-center rounded-md h-10 cursor-pointer"
          :class="[!isEdit ? 'hidden' : 'flex']"
          style="align-items: center"
          @click="openFilePicker"
          @keydown.enter.prevent="openFilePicker"
          @keydown.space.prevent="openFilePicker"
        >
          <Upload class="text-white" :size="20" />
          <span class="w-2"></span>
          Upload Profile Photo
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
      <div class="space-y-4" :class="[isEdit ? '' : 'mt-4']">
        <div
          class="grid grid-cols-1 gap-4"
          :class="[isEdit ? 'md:grid-cols-2' : '']"
        >
          <div>
            <label class="block text-[14px] font-medium text-slate-100 mb-1">
              {{ isEdit ? "Author Name" : "Full Name" }}
              <span class="text-red-500" :class="[isEdit ? 'hidden' : '']"
                >*</span
              >
            </label>
            <Input
              v-model="form.name"
              placeholder="e.g. George Orwell"
              class="bg-brand-main border-slate-700 text-whit w-full"
            />
            <p v-if="errors.title" class="mt-1 text-xs text-red-400">
              {{ errors.title }}
            </p>
          </div>

          <div :class="[isEdit ? '' : 'hidden']">
            <label class="block text-[14px] font-medium text-slate-100 mb-1">
              Nationality
            </label>
            <Input
              v-model="form.nationality"
              placeholder="eg. United State"
              class="bg-brand-main border-slate-700 text-white"
            />
            <p v-if="errors.nationality" class="mt-1 text-xs text-red-400">
              {{ errors.nationality }}
            </p>
          </div>
        </div>
      </div>

      <div class="space-y-4" :class="[isEdit ? 'mt-4' : 'hidden']">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label class="block text-[14px] font-medium text-slate-100 mb-1">
              Date of Birth
            </label>
            <Popover>
              <PopoverTrigger as-child>
                <div class="relative w-full">
                  <Input
                    :model-value="form.dateOfBirth"
                    @update:model-value="handleDateInput"
                    placeholder="YYYY-MM-DD"
                    class="bg-brand-main border-slate-700 text-slate-100 w-full pr-10"
                    maxlength="10"
                  />
                  <CalendarIcon
                    class="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500 cursor-pointer"
                  />
                </div>
              </PopoverTrigger>
              <PopoverContent class="w-auto p-0 bg-[#101922] border-slate-700">
                <Calendar
                  v-model:placeholder="placeholder"
                  v-model="dateValue"
                  initial-focus
                />
              </PopoverContent>
            </Popover>
            <p v-if="errors.dateOfBirth" class="mt-1 text-xs text-red-400">
              {{ errors.dateOfBirth }}
            </p>
          </div>

          <div>
            <label class="block text-[14px] font-medium text-slate-100 mb-1">
              Primary Genre
            </label>
            <Input
              v-model="form.genre"
              placeholder="eg. Fantasy, Sci-fi"
              class="bg-brand-main border-slate-700 text-white"
            />
            <p v-if="errors.genre" class="mt-1 text-xs text-red-400">
              {{ errors.genre }}
            </p>
          </div>
        </div>
      </div>

      <div class="space-y-4" :class="[isEdit ? 'hidden' : 'mt-4']">
        <div class="grid grid-cols-1 gap-4">
          <div :class="[isEdit ? 'mt-4' : '']">
            <label class="block text-[14px] font-medium text-slate-100 mb-1">
              Nationality
            </label>
            <div class="relative mt-0.5">
              <select
                v-model="form.nationality"
                class="flex h-9 w-full appearance-none rounded-md border border-slate-700 bg-brand-main pl-3 pr-10 text-sm text-slate-100 shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-500"
              >
                <option value="" disabled>Select Country</option>
                <option
                  v-for="nation in nationalityOptions"
                  :key="nation"
                  :value="nation"
                >
                  {{ nation }}
                </option>
              </select>
              <ChevronDown
                class="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400"
              />
            </div>
            <p v-if="errors.nationality" class="mt-1 text-xs text-red-400">
              {{ errors.nationality }}
            </p>
          </div>
        </div>
      </div>

      <div class="mt-4 space-y-3">
        <!-- <h2 class="text-[20px] font-semibold text-slate-200">Description</h2> -->
        <div>
          <label class="block text-[14px] font-[400] text-slate-100 mb-2">
            Biography
          </label>
          <textarea
            v-model="form.bio"
            maxlength="500"
            minlength="100"
            rows="4"
            class="resize-none w-full rounded-md border border-slate-700 bg-brand-main px-3 py-2 text-sm text-slate-100 shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-500"
            placeholder="Write a brief biography of the author..."
          ></textarea>
          <p
            class="text-sm text-brand-tip-text"
            :class="[isEdit ? 'hidden' : '']"
          >
            Recommended : 100-500 words
          </p>
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
          {{ props.mode === "edit" ? "Save Changes" : "Save Author" }}
          <BadgeCheck
            :class="[isEdit ? 'hidden' : 'flex']"
            class="text-white"
          />
          <Save :class="[!isEdit ? 'hidden' : 'flex']" class="text-white" />
        </Button>
      </div>
    </div>
    <div
      class="flex"
      style="justify-content: space-between"
      :class="[!isEdit ? 'hidden' : '']"
    >
      <div class="mt-4 text-slate-400 text-sm">
        Last updated : {{ lastUpdatedText }} By Admin
      </div>
      <div class="mt-4 text-slate-400 text-sm">
        Total Books Linked : {{ getAuthorBookCount(form.name) }}
      </div>
    </div>
  </form>
</template>
