<script setup lang="ts">
import { onMounted, ref, watch } from "vue";
import Input from "@/components/ui/input/Input.vue";
import Button from "@/components/ui/button/Button.vue";
import { useRouter } from "vue-router";
import {
  BadgeCheck,
  Camera,
  ChevronDown,
  CloudUploadIcon,
  ImageUp,
  Save,
} from "lucide-vue-next";
import { addAuthor, getAuthor, updateAuthor } from "@/services/authorService";
import type {
  Author,
  NewAuthorInput,
  UpdateAuthorInput,
} from "@/models/author";

const props = withDefaults(
  defineProps<{
    initialAuthor?: Author | null;
    mode?: "create" | "edit";
  }>(),
  {
    initialAuthor: null,
    mode: "create",
  },
);

const router = useRouter();

const form = ref({
  name: "",
  nationality: "",
  imgUrl: "",
  bio: "",
});

const isDragActive = ref(false);
const fileInputRef = ref<HTMLInputElement | null>(null);
const nationalityOptions = ref<string[]>([]);
const isEdit = ref<boolean>(false);

watch(
  () => props.initialAuthor,
  (value) => {
    if (!value) return;
    ((form.value.name = value.name),
      (form.value.nationality = value.nationality),
      (form.value.bio = value.bio ?? ""),
      (form.value.imgUrl = value.imgUrl ?? ""));
  },
  { immediate: true },
);

onMounted(async () => {
  const authors = await getAuthor();
  const baseNationalities = [
    "American",
    "British",
    "Canadian",
    "Australian",
    "Indian",
    "Irish",
    "French",
    "German",
    "Spanish",
    "Italian",
    "Japanese",
    "Chinese",
    "Korean",
  ];
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

async function handleSubmit() {
  if (!validate()) {
    return;
  }

  isSubmitting.value = true;
  try {
    if (props.mode === "edit" && props.initialAuthor) {
      const changes: UpdateAuthorInput = {
        name: form.value.name.trim(),
        nationality: form.value.nationality.trim(),
        bio: form.value.bio.trim(),
        imgUrl: form.value.imgUrl || undefined,
      };

      await updateAuthor(props.initialAuthor.id, changes);
    } else {
      const payload: NewAuthorInput = {
        name: form.value.name.trim(),
        nationality: form.value.nationality.trim(),
        bio: form.value.bio.trim(),
        imgUrl: form.value.imgUrl || undefined,
      };

      await addAuthor(payload);
    }
    router.push("/authors");
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
    :class="[isEdit ? 'bg-transparent border-none' : 'bg-[#233648]']"
  >
    <div class="space-y-4" :class="[isEdit ? 'hidden' : '']">
      <h2 class="text-[20px] font-semibold text-slate-200">Author Portrait</h2>
      <div
        class="flex flex-col items-center justify-center rounded-xl border border-dashed px-6 py-8 text-center transition"
        :class="[
          isDragActive
            ? 'border-[#137fec] bg-[#0b1f33]'
            : 'border-slate-700 bg-[#192633]',
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
            class="flex h-10 w-10 items-center justify-center rounded-full bg-[#0b1524]"
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
          class="mt-5 w-[160px] h-[150px] max-w-sm bg-[#9BB7A7] p-5 rounded-sm bg-cover bg-center"
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
          ? 'border p-5 border-slate-700 bg-[#192633] rounded-lg h-auto'
          : 'hidden',
      ]"
    >
      <div
        class="flex flex-col items-center justify-center rounded-xl px-6 py-8 text-center transition"
        :class="[
          isDragActive
            ? 'border-[#137fec] bg-[#0b1f33]'
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
            class="flex h-10 w-10 items-center justify-center rounded-full bg-[#0b1524]"
          >
            <ImageUp class="h-5 w-5 text-slate-300" />
          </div>
          <div class="text-sm text-slate-300">
            Click to upload or drag and drop
          </div>
          <p class="text-xs" style="color: #507a9e">PNG, JPG (max 800x800px)</p>
        </div>

        <div
          v-if="form.imgUrl"
          class="mt-5 w-[160px] h-[150px] max-w-sm bg-[#9BB7A7] p-5 rounded-sm bg-cover bg-center"
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
          ? 'border p-5 border-slate-700 bg-[#192633] rounded-lg mt-8'
          : '',
      ]"
    >
      <div class="space-y-4" :class="[isEdit ? '' : 'mt-4']">
        <div class="grid grid-cols-1 gap-4">
          <div>
            <label class="block text-[14px] font-medium text-slate-100 mb-1">
              Full Name
              <span class="text-red-500">*</span>
            </label>
            <Input
              v-model="form.name"
              placeholder="e.g. George Orwell"
              class="bg-[#101922] border-slate-700 text-whit w-full"
            />
            <p v-if="errors.title" class="mt-1 text-xs text-red-400">
              {{ errors.title }}
            </p>
          </div>
        </div>
      </div>
      <div class="space-y-4" :class="[isEdit ? '' : 'mt-4']">
        <div class="grid grid-cols-1 gap-4">
          <div>
            <label class="block text-[14px] font-medium text-slate-100 mb-1">
              Nationality
            </label>
            <div class="relative mt-0.5">
              <select
                v-model="form.nationality"
                class="flex h-9 w-full appearance-none rounded-md border border-slate-700 bg-[#101922] pl-3 pr-10 text-sm text-slate-100 shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-500"
              >
                <option value="" disabled>Select nationality</option>
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
            rows="4"
            class="resize-none w-full rounded-md border border-slate-700 bg-[#101922] px-3 py-2 text-sm text-slate-100 shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-500"
            placeholder="Brief overview of the book's plot and themes..."
          ></textarea>
          <p class="text-sm text-[#507A9E]">Recommended : 100-500 words</p>
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
          class="bg-[#137FEC] hover:bg-[#0f68c1] text-white w-[200px] h-10"
          :disabled="isSubmitting"
        >
          {{ props.mode === "edit" ? "Upload Book" : "Save Author" }}
          <BadgeCheck
            :class="[isEdit ? 'hidden' : 'flex']"
            class="text-white"
          />
          <Save :class="[!isEdit ? 'hidden' : 'flex']" class="text-white" />
        </Button>
      </div>
    </div>
  </form>
</template>
