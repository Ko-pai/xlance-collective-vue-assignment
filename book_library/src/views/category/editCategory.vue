<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import { Breadcrumb, BreadcrumbList } from "@/components/ui/breadcrumb";
import BreadcrumbItem from "@/components/ui/breadcrumb/BreadcrumbItem.vue";
import BreadcrumbLink from "@/components/ui/breadcrumb/BreadcrumbLink.vue";
import BreadcrumbSeparator from "@/components/ui/breadcrumb/BreadcrumbSeparator.vue";
import type { Category } from "@/models/category";
import { getCategoriesById } from "@/services/categoryService";
import CategoryForm from "./categoryForm.vue";
import { CATEGORY_BREADCRUMBS } from "@/constants/breadcrumbs";

const route = useRoute();
const router = useRouter();
const categoryId = route.params.id as string;

const category = ref<Category | null>(null);

onMounted(async () => {
  category.value = await getCategoriesById(categoryId);
});

function isActive(path: string) {
  return route.path === path;
}

function onBackToCategoriesList() {
  router.back();
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
            <BreadcrumbLink
              href="/categories"
              class="hover:text-white"
              :class="isActive('/categories') ? 'text-white' : ''"
            >
              Categories
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              class="hover:text-white cursor-pointer"
              :class="
                isActive(`/categories/${category?.id}/editCategory`)
                  ? 'text-white'
                  : ''
              "
              >Edit : {{ category?.name }}</BreadcrumbLink
            >
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div class="flex bg-red w-full mt-10" style="justify-content: space-between">
        <div>
          <h1 class="text-2xl font-bold text-white mb-2">
            Edit Category: {{ category?.name }}
          </h1>
          <div class="flex items-center gap-2 text-slate-400 text-sm">
            <span
              >Modify the category details and visibility settings for the
              library catalog.</span
            >
          </div>
        </div>
        <div>
          <button
            class="w-full md:w-40 h-10 bg-brand-primary text-white flex items-center justify-center rounded-lg text-sm md:text-base font-medium"
            @click="onBackToCategoriesList"
          >
            Back to List
          </button>
        </div>
      </div>

      <div class="w-full flex justify-center mt-6">
        <CategoryForm
          :initial-category="category"
          mode="edit"
          :updated-at="category?.updatedAt"
        />
      </div>
    </div>
  </div>
</template>
