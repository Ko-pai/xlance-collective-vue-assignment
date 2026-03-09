<script setup lang="ts">
import Breadcrumb from "@/components/ui/breadcrumb/Breadcrumb.vue";
import { ArrowLeft } from "lucide-vue-next";
import { BreadcrumbList } from "@/components/ui/breadcrumb";
import BreadcrumbItem from "@/components/ui/breadcrumb/BreadcrumbItem.vue";
import BreadcrumbLink from "@/components/ui/breadcrumb/BreadcrumbLink.vue";
import BreadcrumbSeparator from "@/components/ui/breadcrumb/BreadcrumbSeparator.vue";
import { useRoute, useRouter } from "vue-router";
import NewBookForm from "./newBookForm.vue";

const route = useRoute();
const router = useRouter();

function isActive(path: string): boolean {
  return route.path === path;
}

function goto(): void {
  router.back();
}
</script>

<template>
  <div class="flex justify-center bg-brand-main min-h-[calc(90vh)]">
    <div class="w-full max-w-7xl h-full mt-5 px-4">
      <Breadcrumb class="px-4">
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
              :class="isActive('/books/add') ? 'text-white' : ''"
              >Add New Book</BreadcrumbLink
            >
          </BreadcrumbItem>
        </BreadcrumbList>
      </Breadcrumb>

      <div class="h-12"></div>

      <div class="flex flex-col gap-6">
        <div class="flex justify-center bg-brand-main">
          <div class="w-full max-w-7xl h-full">
            <div
              class="flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
            >
              <div class="flex flex-col gap-2 max-w-xl px-4">
                <h1 class="text-2xl md:text-4xl text-white font-semibold">
                  Add New Book
                </h1>
                <p class="text-sm md:text-base text-slate-400 font-normal">
                  Fill in the details to expand the library collection.
                </p>
              </div>

              <button
                class="w-full md:w-40 h-10 bg-brand-card text-white flex items-center justify-center rounded-lg text-xs md:text-base font-normal"
                @click="goto"
              >
                Back to List
                <span class="w-2"></span>
                <ArrowLeft />
              </button>
            </div>
          </div>
        </div>

        <div class="w-full flex justify-center mt-6">
          <NewBookForm />
        </div>

        <div class="h-12"></div>
      </div>
    </div>
  </div>
</template>
