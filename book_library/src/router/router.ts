import { createRouter, createWebHistory } from "vue-router";
import HelloWorld from "../components/HelloWorld.vue";

import Home from "@/components/home.vue";
import Book from "@/components/book/book.vue";

const routes = [
  {
    path: "/",
    redirect: "/home",
  },
  {
    path: "/books",
    name: "books",
    component: Book,
  },
  {
    path: "/home",
    name: "home",
    component: Home,
  },
  {
    path: "/authors",
    name: "authors",
    component: HelloWorld,
  },
  {
    path: "/categories",
    name: "categories",
    component: HelloWorld,
  },
];

export const router = createRouter({
  history: createWebHistory(),
  routes,
});
