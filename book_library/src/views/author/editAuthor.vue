<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute, useRouter } from "vue-router";
import type { Author } from "@/models/author";
import { getAuthorsById } from "@/services/authorService";
import AuthorForm from "./authorForm.vue";
import { Breadcrumb, BreadcrumbList } from "@/components/ui/breadcrumb";
import BreadcrumbItem from "@/components/ui/breadcrumb/BreadcrumbItem.vue";
import BreadcrumbLink from "@/components/ui/breadcrumb/BreadcrumbLink.vue";
import BreadcrumbSeparator from "@/components/ui/breadcrumb/BreadcrumbSeparator.vue";

const route = useRoute();
const router = useRouter();
const authorId = route.params.id as string;

const author = ref<Author | null>(null);

onMounted(async () => {
  author.value = await getAuthorsById(authorId);
});

function onBackToAuthorList(): void {
  router.back();
}

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
                :class="isActive('/authors') ? 'text-white' : ''"
                to="/authors"
                >Authors</RouterLink
              >
            </BreadcrumbLink>
          </BreadcrumbItem>
          <BreadcrumbSeparator />
          <BreadcrumbItem>
            <BreadcrumbLink
              class="hover:text-white cursor-pointer"
              :class="
                isActive(`/authors/${author?.id}/editAuthor`)
                  ? 'text-white'
                  : ''
              "
              >Edit : {{ author?.name }}</BreadcrumbLink
            >
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>
      <div
        class="flex bg-red w-full mt-10"
        style="justify-content: space-between; align-items: center"
      >
        <div>
          <h1 class="text-2xl font-bold text-white mb-2">Edit Author Info</h1>
          <div class="flex items-center gap-2 text-slate-400 text-sm">
            <span
              >Update the professional and personal details of
              {{ author?.name }}</span
            >
          </div>
        </div>
        <div>
          <button
            class="w-full md:w-40 h-10 bg-brand-primary text-white flex items-center justify-center rounded-lg text-sm md:text-base font-medium"
            @click="onBackToAuthorList"
          >
            Back to List
          </button>
        </div>
      </div>

      <div class="w-full flex justify-center mt-6">
        <AuthorForm
          :initial-author="author"
          mode="edit"
          :updated-at="author?.updatedAt"
        />
      </div>
    </div>
  </div>
</template>
