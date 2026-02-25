<script setup lang="ts">
import { computed, onMounted, ref, watch } from "vue";
import Input from "@/components/ui/input/Input.vue";
import Button from "@/components/ui/button/Button.vue";
import { useRouter } from "vue-router";
import {
  BadgeCheck,
  Camera,
  CheckIcon,
  ChevronDown,
  CloudUploadIcon,
  PlusIcon,
  Save,
  Upload,
} from "lucide-vue-next";
import { addAuthor, getAuthor, updateAuthor } from "@/services/authorService";
import type {
  Author,
  NewAuthorInput,
  UpdateAuthorInput,
} from "@/models/author";
import type { Book } from "@/models/book";
import { getBooks } from "@/services/bookService";
import type {
  Category,
  NewCategoryInput,
  UpdateCategoryInput,
} from "@/models/category";
import { addCategory, updateCategory } from "@/services/categoryService";
import Switch from "@/components/ui/switch/Switch.vue";

const props = withDefaults(
  defineProps<{
    initialCategory?: Category | null;
    updatedAt?: string | null;
    mode?: "create" | "edit";
  }>(),
  {
    initialCategory: null,
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
  description: "",
  activeStatus: false,
});

const isEdit = ref<boolean>(false);

watch(
  () => props.initialCategory,
  (value) => {
    if (!value) return;
    ((form.value.name = value.name),
      (form.value.description = value.description ?? ""),
      (form.value.activeStatus = value.activeStatus ?? false));
  },
  { immediate: true },
);

const errors = ref<Record<string, string>>({});
const isSubmitting = ref(false);

function validate(): boolean {
  const next: Record<string, string> = {};

  if (!form.value.name.trim()) {
    next.name = "Name is required";
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
    if (props.mode === "edit" && props.initialCategory) {
      const changes: UpdateCategoryInput = {
        name: form.value.name.trim(),
        description: form.value.description.trim(),
        activeStatus: form.value.activeStatus,
      };
      console.log(changes);

      await updateCategory(props.initialCategory.id, changes);
    } else {
      const payload: NewCategoryInput = {
        name: form.value.name.trim(),
        description: form.value.description.trim(),
        activeStatus: true,
      };

      await addCategory(payload);
    }
    router.push("/categories");
  } finally {
    isSubmitting.value = false;
  }
}

function handleCancel() {
  router.back();
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

/* const lastUpdatedText = computed(() => {
  if (!props?.updatedAt) return "Unknown";
  return formatRelativeTime(props.updatedAt ?? "");
}); */
</script>

<template>
  <div>
    <form
      @submit.prevent="handleSubmit"
      class="mt-6 w-full max-w-3xl mx-auto rounded-2xl border border-slate-800 text-slate-100"
      :class="[
        isEdit
          ? 'bg-transparent border-none '
          : 'bg-brand-card px-6 py-8 md:px-8 md:py-10 ',
      ]"
    >
      <div
        class="flex flex-col"
        :class="[
          isEdit
            ? 'border p-5 border-slate-700 bg-brand-edit rounded-lg mt-8 w-[700px] '
            : '',
        ]"
      >
        <div class="space-y-4">
          <div class="grid grid-cols-1 gap-4">
            <div>
              <label class="block text-[14px] font-medium text-slate-100 mb-1">
                Category Name
                <span class="text-red-500" :class="[isEdit ? 'hidden' : '']"
                  >*</span
                >
              </label>
              <Input
                v-model="form.name"
                placeholder="e.g. Science Fiction, Biography"
                class="bg-brand-main border-slate-700 text-whit w-full"
              />
              <p v-if="errors.name" class="mt-1 text-xs text-red-400">
                {{ errors.name }}
              </p>
              <p v-if="isEdit" class="text-sm text-slate-500 mt-2">
                This name as it will appear in the public library catalog.
              </p>
            </div>
          </div>
        </div>

        <div class="mt-4 space-y-3">
          <!-- <h2 class="text-[20px] font-semibold text-slate-200">Description</h2> -->
          <div>
            <label class="block text-[14px] font-[400] text-slate-100 mb-2">
              Description
              <span class="text-slate-400">(Optional)</span>
            </label>
            <textarea
              v-model="form.description"
              maxlength="500"
              :rows="
                form.description.length > 100
                  ? (form.description.length / 100) * 1.5
                  : 4
              "
              class="resize-none w-full rounded-md border border-slate-700 bg-brand-main px-3 py-2 text-sm text-slate-100 shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-slate-500"
              placeholder="Brief describe what books belong in this category..."
            ></textarea>
            <div v-if="isEdit" class="w-full h-10 flex flex-row p-1 mt-3">
              <div class="w-full flex flex-col">
                <h1 class="text-sm text-white">Active Status</h1>
                <p class="text-slate-500 text-xs">
                  Enable this to show the category in the discovery browse
                </p>
              </div>
              <div
                class="w-[100px] flex"
                style="justify-content: center; align-items: center"
              >
                <Switch
                  id="airplane-mode"
                  v-model="form.activeStatus"
                  class="data-[state=checked]:bg-brand-primary data-[state=unchecked]:bg-slate-600"
                />
              </div>
            </div>

            <div
              class="flex w-full h-[100px] bg-brand-tip mt-4 rounded-md flex-row p-3 space-x-2"
              \
              :class="[isEdit ? 'hidden' : '']"
            >
              <div class="w-10 h-14 flex justify-center">
                <div
                  class="w-5 h-5 rounded-full bg-brand-primary text-black justify-center flex text-sm"
                  style="align-items: center"
                >
                  i
                </div>
              </div>
              <div class="w-full h-14 bg-500 space-y-3">
                <h1 class="p-0 m-0 text-brand-primary text-sm">Tip</h1>
                <p class="text-sm text-slate-400">
                  Good category names are short and descriptive. You can later
                  assgin tags to specific books within these categories.
                </p>
              </div>
            </div>
          </div>
        </div>

        <div class="mt-8 pt-6 border-t border-slate-800 flex justify-end gap-3">
          <Button
            type="button"
            variant="ghost"
            class="text-slate-300 hover:bg-transparent hover:text-slate-100"
            @click="handleCancel"
          >
            {{ isEdit ? "Discard Changes" : "Cancel" }}
          </Button>
          <Button
            type="submit"
            class="bg-brand-primary hover:bg-brand-primary-hover text-white w-[200px] h-10"
            :disabled="isSubmitting"
          >
            {{ props.mode === "edit" ? "Upload Category" : "Create Category" }}
            <PlusIcon
              :class="[isEdit ? 'hidden' : 'flex']"
              class="text-white"
            />
            <CheckIcon
              :class="[!isEdit ? 'hidden' : 'flex']"
              class="text-white"
            />
          </Button>
        </div>
      </div>
    </form>
    <div
      class="mt-4 text-slate-400 flex justify-center text-sm"
      :class="[isEdit ? 'hidden' : '']"
    >
      System Version 2.4.0 • Last Updated 12 mins ago
      <!-- {{ formatRelativeTime(props.updatedAt ?? "") }} -->
    </div>
  </div>
</template>
